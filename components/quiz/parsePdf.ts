// -------------------- PDF quiz parser (runs 100% in the browser) --------------------
//  The PDF never leaves the user's machine. We locate "Question N" and
//  "Correct Answer: …" markers with pdf.js text coordinates, then show each
//  question as image crops of the original pages (so tables / code
//  screenshots survive), with the answer region hidden until confirmed.

import type { PDFDocumentProxy } from "pdfjs-dist";

export type Segment = { page: number; y0: number; y1: number }; // top-based, scale-1 units

export type QuizQuestion = {
  number: number;
  /** Option letters that exist for this question (e.g. ["A","B","C","D"]) */
  letters: string[];
  /** Correct option letters */
  answers: string[];
  /** Page crops that show the question + options (answer hidden) */
  questionSegments: Segment[];
  /** Page crops with the correct answer + explanation (shown after confirm) */
  explanationSegments: Segment[];
};

export type ParsedQuiz = {
  questions: QuizQuestion[];
  pageCount: number;
  skipped: number[];
};

// ---- pdf.js loader (client-only, lazy) ----

let pdfjsPromise: Promise<typeof import("pdfjs-dist")> | null = null;

async function getPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((m) => {
      m.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      return m;
    });
  }
  return pdfjsPromise;
}

export async function loadPdf(data: ArrayBuffer): Promise<PDFDocumentProxy> {
  const pdfjs = await getPdfjs();
  return pdfjs.getDocument({ data }).promise;
}

// ---- Parsing ----

type Line = { page: number; y: number; text: string };

export async function parseQuiz(
  pdf: PDFDocumentProxy,
  onProgress?: (done: number, total: number) => void,
): Promise<ParsedQuiz> {
  const pageCount = pdf.numPages;
  const lines: Line[] = [];
  const contentTops: number[] = [];
  const pageHeights: number[] = [];

  for (let p = 1; p <= pageCount; p++) {
    const page = await pdf.getPage(p);
    const viewport = page.getViewport({ scale: 1 });
    pageHeights[p - 1] = viewport.height;

    const tc = await page.getTextContent();
    const raw: { x: number; y: number; str: string }[] = [];
    for (const item of tc.items as { str?: string; transform?: number[] }[]) {
      if (!item.str || !item.str.trim() || !item.transform) continue;
      raw.push({
        x: item.transform[4],
        y: viewport.height - item.transform[5], // top-based
        str: item.str,
      });
    }
    raw.sort((a, b) => a.y - b.y || a.x - b.x);

    // Group items into visual lines by y proximity
    const pageLines: { y: number; parts: { x: number; str: string }[] }[] = [];
    for (const r of raw) {
      const last = pageLines[pageLines.length - 1];
      if (last && Math.abs(last.y - r.y) < 4) {
        last.parts.push({ x: r.x, str: r.str });
      } else {
        pageLines.push({ y: r.y, parts: [{ x: r.x, str: r.str }] });
      }
    }

    let contentTop = 26;
    for (const ln of pageLines) {
      const text = ln.parts
        .sort((a, b) => a.x - b.x)
        .map((s) => s.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      // Per-page header — content starts below it
      if (ln.y < 110 && (/EXPERT VERIFIED/i.test(text) || /^Page \d+$/i.test(text))) {
        contentTop = Math.max(contentTop, ln.y + 12);
        continue;
      }
      lines.push({ page: p, y: ln.y, text });
    }
    contentTops[p - 1] = contentTop;
    onProgress?.(p, pageCount);
  }

  // ---- Markers ----
  const qMarkers: { idx: number; page: number; y: number; num: number }[] = [];
  const aMarkers: { idx: number; page: number; y: number; letters: string[] }[] = [];

  const extractLetters = (text: string): string[] => {
    const up = text.toUpperCase();
    const single = up.match(/\b[A-H]\b/g) || [];
    if (single.length) return single;
    // Compact form like "BCE"
    const compact = up.match(/\b([A-H]{2,5})\b/);
    if (compact) return compact[1].split("");
    return [];
  };

  // PDF text extraction sprinkles spurious spaces inside words
  // ("Qu estion 18", "Corre ct Answer"). Collapse those spaces within the two
  // keywords we key on, so detection is space-tolerant.
  const normalize = (text: string): string =>
    text
      .replace(/Q\s*u\s*e\s*s\s*t\s*i\s*o\s*n/gi, "Question")
      .replace(/C\s*o\s*r\s*r\s*e\s*c\s*t\s*A\s*n\s*s\s*w\s*e\s*r/gi, "Correct Answer");

  lines.forEach((ln, idx) => {
    const norm = normalize(ln.text);
    // Header lines are standalone "Question N" (allow a leading ✓ and a tiny
    // trailing bit like a period), so the number can't be a mid-sentence match.
    const qm = norm.match(/^(?:✓\s*)?Question\s+(\d{1,4})\b(.{0,3})$/i);
    if (qm) {
      qMarkers.push({ idx, page: ln.page, y: ln.y, num: +qm[1] });
      return;
    }
    const am = norm.match(/Correct Answers?\s*:?\s*(.*)$/i);
    if (am) {
      aMarkers.push({ idx, page: ln.page, y: ln.y, letters: extractLetters(am[1]) });
    }
  });

  // Fallback: answer lines whose letters wrapped onto following lines
  for (const a of aMarkers) {
    if (a.letters.length === 0) {
      for (let step = 1; step <= 2; step++) {
        const nextLine = lines[a.idx + step];
        if (!nextLine || nextLine.page !== a.page || nextLine.y - a.y > 40) break;
        const letters = extractLetters(nextLine.text);
        if (letters.length && letters.length <= 5) {
          a.letters = letters;
          break;
        }
      }
    }
  }

  // ---- Build questions ----
  const questions: QuizQuestion[] = [];
  const skipped: number[] = [];

  for (let i = 0; i < qMarkers.length; i++) {
    const q = qMarkers[i];
    const next = qMarkers[i + 1];
    const a = aMarkers.find(
      (m) => m.idx > q.idx && (!next || m.idx < next.idx) && m.letters.length > 0,
    );
    if (!a) {
      skipped.push(q.num);
      continue;
    }

    const letters = new Set<string>();
    for (let j = q.idx + 1; j < a.idx; j++) {
      if (lines[j].page < q.page) continue;
      const m = lines[j].text.match(/^([A-H])[.)]\s*/);
      if (m) letters.add(m[1]);
    }
    a.letters.forEach((l) => letters.add(l));

    const answers = [...new Set(a.letters)].sort();
    const questionSegments = buildSegments(
      q.page, q.y - 8, a.page, a.y - 8, contentTops, pageHeights,
    );
    const endPage = next ? next.page : pageCount;
    const endY = next ? next.y - 12 : pageHeights[pageCount - 1] - 24;
    const explanationSegments = buildSegments(
      a.page, a.y - 8, endPage, endY, contentTops, pageHeights,
    );

    questions.push({
      number: q.num,
      letters: [...letters].sort(),
      answers,
      questionSegments,
      explanationSegments,
    });
  }

  return { questions, pageCount, skipped };
}

function buildSegments(
  p0: number, y0: number, p1: number, y1: number,
  contentTops: number[], pageHeights: number[],
): Segment[] {
  const bottomPad = 22;
  const segs: Segment[] = [];
  if (p0 === p1) {
    if (y1 > y0) segs.push({ page: p0, y0, y1 });
  } else {
    segs.push({ page: p0, y0, y1: pageHeights[p0 - 1] - bottomPad });
    for (let p = p0 + 1; p < p1; p++) {
      segs.push({ page: p, y0: contentTops[p - 1], y1: pageHeights[p - 1] - bottomPad });
    }
    segs.push({ page: p1, y0: contentTops[p1 - 1], y1 });
  }
  return segs.filter((s) => s.y1 - s.y0 > 10);
}

// ---- Rendering (page canvas cache + segment crops) ----

const pageCanvasCache = new Map<string, HTMLCanvasElement>();
const inflight = new Map<string, Promise<HTMLCanvasElement>>();

async function renderPageCanvas(
  pdf: PDFDocumentProxy, pageNum: number, scale: number,
): Promise<HTMLCanvasElement> {
  const fp =
    (pdf as unknown as { fingerprints?: string[] }).fingerprints?.[0] ?? "doc";
  const key = `${fp}:${pageNum}@${scale}`;
  const cached = pageCanvasCache.get(key);
  if (cached) return cached;
  const pending = inflight.get(key);
  if (pending) return pending;

  const task = (async () => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext("2d")!;
    // "print" intent schedules with setTimeout instead of rAF, so rendering
    // also completes in background/hidden tabs.
    await page.render({
      canvasContext: ctx, viewport, intent: "print",
    } as never).promise;

    pageCanvasCache.set(key, canvas);
    // Keep the cache small — quiz walks pages mostly sequentially
    if (pageCanvasCache.size > 8) {
      const firstKey = pageCanvasCache.keys().next().value as string;
      pageCanvasCache.delete(firstKey);
    }
    return canvas;
  })();

  inflight.set(key, task);
  try {
    return await task;
  } finally {
    inflight.delete(key);
  }
}

export function clearRenderCache() {
  pageCanvasCache.clear();
}

/** Renders segments as PNG data-URLs (one per segment). */
export async function renderSegments(
  pdf: PDFDocumentProxy, segments: Segment[],
): Promise<string[]> {
  const scale = Math.min(2.5, (window.devicePixelRatio || 1) * 1.4);
  const out: string[] = [];
  for (const seg of segments) {
    const canvas = await renderPageCanvas(pdf, seg.page, scale);
    const crop = document.createElement("canvas");
    crop.width = canvas.width;
    crop.height = Math.max(1, Math.round((seg.y1 - seg.y0) * scale));
    const ctx = crop.getContext("2d")!;
    ctx.drawImage(
      canvas,
      0, Math.round(seg.y0 * scale), canvas.width, crop.height,
      0, 0, crop.width, crop.height,
    );
    out.push(crop.toDataURL("image/png"));
  }
  return out;
}
