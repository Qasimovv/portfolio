"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileUp,
  Plus,
  RotateCcw,
  Shuffle,
  Trash2,
  X,
} from "lucide-react";
import {
  clearRenderCache,
  loadPdf,
  parseQuiz,
  renderSegments,
  type QuizQuestion,
} from "@/components/quiz/parsePdf";
import {
  clearAll as clearStore,
  deleteDoc as deleteStoredDoc,
  getAllDocs,
  getSession,
  saveDoc,
  saveSession,
} from "@/components/quiz/quizStore";

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `d${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  }
}

// -------------------- PDF Quiz Trainer --------------------
//  Upload one or more Q&A PDFs → practice question by question, or build a
//  random N-question quiz from the combined pool. Everything runs in the
//  browser; files are never uploaded anywhere.

type Stage =
  | "idle"
  | "restoring"
  | "parsing"
  | "setup"
  | "ready"
  | "done"
  | "error";
type Result = { chosen: string[]; confirmed: boolean; correct: boolean };
type LoadedDoc = {
  id: string;
  pdf: PDFDocumentProxy;
  name: string;
  questions: QuizQuestion[];
  skipped: number[];
};
type PoolItem = { docIndex: number; q: QuizQuestion };

const ACCENT = "#04AAFB";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizApp() {
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState("");
  const [docs, setDocs] = useState<LoadedDoc[]>([]);
  const [progress, setProgress] = useState({
    file: "", fileIdx: 0, fileCount: 0, done: 0, total: 0,
  });

  const [activeSet, setActiveSet] = useState<PoolItem[]>([]);
  const [quizCount, setQuizCount] = useState(20);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<Record<number, Result>>({});
  const [qImages, setQImages] = useState<string[]>([]);
  const [expImages, setExpImages] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const current = activeSet[index];
  const question = current?.q;
  const currentPdf = current ? docs[current.docIndex]?.pdf : null;
  const result = results[index];
  const confirmed = !!result?.confirmed;
  const isMulti = (question?.answers.length ?? 1) > 1;

  const confirmedResults = Object.values(results).filter((r) => r.confirmed);
  const correctCount = confirmedResults.filter((r) => r.correct).length;
  const wrongCount = confirmedResults.length - correctCount;
  const totalPool = docs.reduce((n, d) => n + d.questions.length, 0);

  // ---- Load & parse (supports multiple files, append mode) ----

  const parseFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      setStage("parsing");
      try {
        const added: LoadedDoc[] = [];
        for (let f = 0; f < files.length; f++) {
          const file = files[f];
          setProgress({
            file: file.name, fileIdx: f + 1, fileCount: files.length,
            done: 0, total: 0,
          });
          const buf = await file.arrayBuffer();
          const storeBuf = buf.slice(0); // keep an intact copy for persistence
          const pdf = await loadPdf(buf);
          const parsed = await parseQuiz(pdf, (done, total) =>
            setProgress((p) => ({ ...p, done, total })),
          );
          const id = newId();
          void saveDoc({
            id, name: file.name, buffer: storeBuf,
            questions: parsed.questions, skipped: parsed.skipped,
          });
          added.push({
            id, pdf, name: file.name,
            questions: parsed.questions, skipped: parsed.skipped,
          });
        }
        const merged = [...docs, ...added];
        const mergedTotal = merged.reduce((n, d) => n + d.questions.length, 0);
        if (mergedTotal === 0) {
          throw new Error(
            "No questions found. PDFs must contain 'Question N' blocks with 'Correct Answer:' lines.",
          );
        }
        setDocs(merged);
        setQuizCount((c) => Math.min(Math.max(c, 1), mergedTotal));
        setStage("setup");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not read this PDF.");
        setStage("error");
      }
    },
    [docs],
  );

  const onFiles = useCallback(
    (list: FileList | null | undefined) => {
      const files = [...(list ?? [])].filter(
        (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"),
      );
      void parseFiles(files);
    },
    [parseFiles],
  );

  // On mount: load ?src=/path.pdf if given, otherwise resume the saved session.
  const bootDone = useRef(false);
  useEffect(() => {
    if (bootDone.current) return;
    bootDone.current = true;
    const src = new URLSearchParams(window.location.search).get("src");

    if (src && src.startsWith("/")) {
      setStage("parsing");
      setProgress({ file: src, fileIdx: 1, fileCount: 1, done: 0, total: 0 });
      fetch(src)
        .then((r) => {
          if (!r.ok) throw new Error(`Could not fetch ${src}`);
          return r.arrayBuffer();
        })
        .then(async (buf) => {
          const pdf = await loadPdf(buf);
          const parsed = await parseQuiz(pdf, (done, total) =>
            setProgress((p) => ({ ...p, done, total })),
          );
          setDocs([{
            id: newId(), pdf, name: src.split("/").pop() || "quiz.pdf",
            questions: parsed.questions, skipped: parsed.skipped,
          }]);
          setStage("setup");
        })
        .catch((e) => {
          setError(e instanceof Error ? e.message : "Fetch failed");
          setStage("error");
        });
      return;
    }

    // Resume from IndexedDB
    (async () => {
      const session = await getSession();
      if (!session || !session.docIds?.length) return; // stay idle
      setStage("restoring");
      try {
        const records = await getAllDocs();
        const byId = new Map(records.map((r) => [r.id, r]));
        const ordered: LoadedDoc[] = [];
        for (const id of session.docIds) {
          const r = byId.get(id);
          if (!r) continue;
          const pdf = await loadPdf(r.buffer.slice(0));
          ordered.push({
            id: r.id, pdf, name: r.name,
            questions: r.questions, skipped: r.skipped,
          });
        }
        if (ordered.length === 0) {
          setStage("idle");
          return;
        }
        const docIndexById = new Map(ordered.map((d, i) => [d.id, i]));
        const set: PoolItem[] = [];
        for (const o of session.order ?? []) {
          const di = docIndexById.get(o.docId);
          if (di == null) continue;
          const q = ordered[di].questions.find((x) => x.number === o.num);
          if (q) set.push({ docIndex: di, q });
        }
        setDocs(ordered);
        setActiveSet(set);
        setResults(session.results ?? {});
        setQuizCount(session.quizCount ?? 20);
        const resumeStage =
          set.length > 0 && (session.stage === "ready" || session.stage === "done")
            ? session.stage
            : "setup";
        setIndex(
          resumeStage === "ready"
            ? Math.min(session.index ?? 0, Math.max(0, set.length - 1))
            : 0,
        );
        setStage(resumeStage);
      } catch {
        setStage("idle");
      }
    })();
  }, []);

  // Persist the session whenever meaningful state changes
  useEffect(() => {
    if (
      docs.length === 0 ||
      stage === "idle" ||
      stage === "restoring" ||
      stage === "parsing" ||
      stage === "error"
    ) {
      return;
    }
    void saveSession({
      docIds: docs.map((d) => d.id),
      order: activeSet.map((p) => ({
        docId: docs[p.docIndex].id,
        num: p.q.number,
      })),
      index,
      results,
      quizCount,
      stage,
    });
  }, [stage, docs, activeSet, index, results, quizCount]);

  // ---- Session builders ----

  const buildPool = useCallback((): PoolItem[] => {
    return docs.flatMap((d, di) => d.questions.map((q) => ({ docIndex: di, q })));
  }, [docs]);

  const startSession = useCallback(
    (set: PoolItem[]) => {
      setActiveSet(set);
      setResults({});
      setIndex(0);
      setSelected([]);
      setStage("ready");
    },
    [],
  );

  const startAll = useCallback(() => startSession(buildPool()), [buildPool, startSession]);
  const startRandom = useCallback(() => {
    const n = Math.min(Math.max(quizCount, 1), totalPool);
    startSession(shuffle(buildPool()).slice(0, n));
  }, [buildPool, quizCount, totalPool, startSession]);

  const removeDoc = useCallback((di: number) => {
    setDocs((prev) => {
      const doc = prev[di];
      doc?.pdf.destroy().catch(() => {});
      if (doc) void deleteStoredDoc(doc.id);
      const next = prev.filter((_, i) => i !== di);
      if (next.length === 0) {
        void clearStore();
        setStage("idle");
      }
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    docs.forEach((d) => d.pdf.destroy().catch(() => {}));
    clearRenderCache();
    void clearStore();
    setDocs([]);
    setActiveSet([]);
    setResults({});
    setIndex(0);
    setSelected([]);
    setStage("idle");
  }, [docs]);

  // ---- Render current question images ----

  useEffect(() => {
    if (!currentPdf || !question) return;
    let cancelled = false;
    setQImages([]);
    renderSegments(currentPdf, question.questionSegments).then((urls) => {
      if (!cancelled) setQImages(urls);
    });
    return () => { cancelled = true; };
  }, [currentPdf, question]);

  useEffect(() => {
    if (!currentPdf || !question || !confirmed) {
      setExpImages([]);
      return;
    }
    let cancelled = false;
    renderSegments(currentPdf, question.explanationSegments).then((urls) => {
      if (!cancelled) setExpImages(urls);
    });
    return () => { cancelled = true; };
  }, [currentPdf, question, confirmed]);

  // Restore selection when navigating
  useEffect(() => {
    setSelected(results[index]?.chosen ?? []);
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Actions ----

  const toggleLetter = useCallback(
    (letter: string) => {
      if (confirmed) return;
      setSelected((prev) => {
        if (isMulti) {
          return prev.includes(letter)
            ? prev.filter((l) => l !== letter)
            : [...prev, letter].sort();
        }
        return prev.includes(letter) ? [] : [letter];
      });
    },
    [confirmed, isMulti],
  );

  const confirm = useCallback(() => {
    if (!question || selected.length === 0 || confirmed) return;
    const correct =
      selected.length === question.answers.length &&
      question.answers.every((a) => selected.includes(a));
    setResults((prev) => ({
      ...prev,
      [index]: { chosen: selected, confirmed: true, correct },
    }));
  }, [question, selected, confirmed, index]);

  const goNext = useCallback(() => {
    if (index + 1 < activeSet.length) setIndex(index + 1);
    else setStage("done");
  }, [activeSet.length, index]);

  const goPrev = useCallback(() => {
    if (index > 0) setIndex(index - 1);
  }, [index]);

  const restart = useCallback(() => {
    setResults({});
    setIndex(0);
    setSelected([]);
    setStage("ready");
  }, []);

  // ---- Keyboard ----

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (stage !== "ready" || !question) return;
      if ((e.target as HTMLElement | null)?.tagName === "INPUT") return;
      const k = e.key.toUpperCase();
      if (question.letters.includes(k)) toggleLetter(k);
      else if (e.key === "Enter") {
        if (!confirmed) confirm();
        else goNext();
      } else if (e.key === "ArrowRight" && confirmed) goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, question, confirmed, toggleLetter, confirm, goNext, goPrev]);

  // ==================== Screens ====================

  if (stage === "idle" || stage === "error") {
    return (
      <Shell>
        <div
          className={`mx-auto mt-10 max-w-lg rounded-3xl bg-white p-10 text-center ring-1 transition-colors dark:bg-zinc-900 ${
            dragOver ? "ring-2 ring-[#04AAFB]" : "ring-zinc-200/70 dark:ring-zinc-800"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            onFiles(e.dataTransfer.files);
          }}
        >
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: `${ACCENT}1a` }}
          >
            <FileUp className="h-6 w-6" style={{ color: ACCENT }} />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight">
            PDF Quiz Trainer
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Upload one or more questions &amp; answers PDFs — practice
            everything in order, or generate a random quiz from the pool.
          </p>
          {stage === "error" && (
            <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-6 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            <FileUp className="h-4 w-4" />
            Choose PDF(s)
          </button>
          <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
            …or drag &amp; drop them here
          </p>
          <p className="mt-6 text-xs text-zinc-400 dark:text-zinc-500">
            🔒 Files are processed entirely in your browser — never uploaded.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              onFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      </Shell>
    );
  }

  if (stage === "restoring") {
    return (
      <Shell>
        <div className="mx-auto mt-10 max-w-lg rounded-3xl bg-white p-10 text-center ring-1 ring-zinc-200/70 dark:bg-zinc-900 dark:ring-zinc-800">
          <h1 className="text-xl font-bold tracking-tight">
            Restoring your session…
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Picking up right where you left off.
          </p>
          <div className="mx-auto mt-6 h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-[#04AAFB] dark:border-zinc-700 dark:border-t-[#04AAFB]" />
        </div>
      </Shell>
    );
  }

  if (stage === "parsing") {
    const pct = progress.total
      ? Math.round((progress.done / progress.total) * 100)
      : 0;
    return (
      <Shell>
        <div className="mx-auto mt-10 max-w-lg rounded-3xl bg-white p-10 text-center ring-1 ring-zinc-200/70 dark:bg-zinc-900 dark:ring-zinc-800">
          <h1 className="text-xl font-bold tracking-tight">Reading PDF…</h1>
          <p className="mt-2 truncate text-sm text-zinc-500 dark:text-zinc-400">
            {progress.fileCount > 1 && (
              <span className="font-medium">
                {progress.fileIdx}/{progress.fileCount}:{" "}
              </span>
            )}
            {progress.file}
          </p>
          <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, background: ACCENT }}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-400">
            {progress.done} / {progress.total} pages
          </p>
        </div>
      </Shell>
    );
  }

  if (stage === "setup") {
    const skippedTotal = docs.reduce((n, d) => n + d.skipped.length, 0);
    return (
      <Shell>
        <div className="mx-auto mt-10 max-w-lg rounded-3xl bg-white p-8 ring-1 ring-zinc-200/70 dark:bg-zinc-900 dark:ring-zinc-800">
          <h1 className="text-xl font-bold tracking-tight">Build your quiz</h1>

          {/* Loaded PDFs */}
          <div className="mt-4 space-y-2">
            {docs.map((d, di) => (
              <div
                key={`${d.name}-${di}`}
                className="flex items-center gap-3 rounded-xl bg-zinc-50 px-3.5 py-2.5 ring-1 ring-zinc-200/70 dark:bg-zinc-800/60 dark:ring-zinc-700/60"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-zinc-400">
                    {d.questions.length} questions
                    {d.skipped.length > 0 && ` · ${d.skipped.length} skipped`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeDoc(di)}
                  aria-label="Remove PDF"
                  className="cursor-pointer rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-zinc-600 ring-1 ring-zinc-300 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-800"
          >
            <Plus className="h-4 w-4" />
            Add another PDF
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              onFiles(e.target.files);
              e.target.value = "";
            }}
          />

          {skippedTotal > 0 && (
            <p className="mt-3 text-xs text-zinc-400">
              {skippedTotal} question(s) had no readable answer line and were
              skipped.
            </p>
          )}

          {/* Modes */}
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={startAll}
              className="flex w-full cursor-pointer items-center justify-between rounded-2xl bg-zinc-900 px-5 py-4 text-left text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              <span>
                <span className="block text-sm font-semibold">
                  Full practice — in order
                </span>
                <span className="block text-xs opacity-70">
                  All {totalPool} questions, sequential
                </span>
              </span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <div className="rounded-2xl px-5 py-4 ring-1 ring-zinc-200 dark:ring-zinc-700">
              <div className="flex items-center justify-between gap-3">
                <span>
                  <span className="block text-sm font-semibold">
                    Random quiz
                  </span>
                  <span className="block text-xs text-zinc-400">
                    Pick questions randomly from the pool
                  </span>
                </span>
                <input
                  type="number"
                  min={1}
                  max={totalPool}
                  value={quizCount}
                  onChange={(e) =>
                    setQuizCount(
                      Math.min(
                        Math.max(parseInt(e.target.value) || 1, 1),
                        totalPool,
                      ),
                    )
                  }
                  className="h-10 w-20 rounded-xl bg-white text-center text-sm font-semibold ring-1 ring-zinc-300 outline-none focus:ring-2 focus:ring-[#04AAFB] dark:bg-zinc-800 dark:ring-zinc-600"
                />
              </div>
              <button
                type="button"
                onClick={startRandom}
                className="mt-3 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: ACCENT }}
              >
                <Shuffle className="h-4 w-4" />
                Start {Math.min(quizCount, totalPool)}-question quiz
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={resetAll}
            className="mt-4 w-full cursor-pointer text-center text-xs text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Clear everything
          </button>
        </div>
      </Shell>
    );
  }

  if (stage === "done") {
    const total = activeSet.length;
    const pct = total ? Math.round((correctCount / total) * 100) : 0;
    const wrongIndexes = activeSet
      .map((_, i) => i)
      .filter((i) => results[i]?.confirmed && !results[i].correct);
    return (
      <Shell>
        <div className="mx-auto mt-10 max-w-lg rounded-3xl bg-white p-10 text-center ring-1 ring-zinc-200/70 dark:bg-zinc-900 dark:ring-zinc-800">
          <h1 className="text-2xl font-bold tracking-tight">Finished 🎉</h1>
          <p className="mt-6 text-5xl font-bold" style={{ color: ACCENT }}>
            {pct}%
          </p>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-emerald-500">
              {correctCount} correct
            </span>{" "}
            ·{" "}
            <span className="font-semibold text-red-500">
              {wrongCount} wrong
            </span>{" "}
            · {total} questions
          </p>
          {wrongIndexes.length > 0 && (
            <div className="mt-6 text-left">
              <p className="text-xs uppercase tracking-wider text-zinc-400">
                Review mistakes
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {wrongIndexes.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setIndex(i); setStage("ready"); }}
                    className="cursor-pointer rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400"
                  >
                    Q{activeSet[i].q.number}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={restart}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              <RotateCcw className="h-4 w-4" />
              Restart this quiz
            </button>
            <button
              type="button"
              onClick={() => setStage("setup")}
              className="inline-flex h-10 cursor-pointer items-center rounded-full px-5 text-sm font-medium text-zinc-600 ring-1 ring-zinc-300 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-800"
            >
              New quiz
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  if (!question) return null;

  const total = activeSet.length;
  const answeredPct = total
    ? Math.round((confirmedResults.length / total) * 100)
    : 0;

  return (
    <Shell>
      {/* Top bar */}
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 text-sm">
        <div className="min-w-0">
          <p className="font-semibold">
            Question {index + 1}
            <span className="text-zinc-400"> / {total}</span>
            <span className="ml-2 text-xs font-normal text-zinc-400">
              (Q{question.number})
            </span>
          </p>
          <p className="truncate text-xs text-zinc-400">
            {docs[current.docIndex]?.name}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Check className="h-3.5 w-3.5" /> {correctCount}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
            <X className="h-3.5 w-3.5" /> {wrongCount}
          </span>
          <button
            type="button"
            onClick={() => setStage("setup")}
            className="cursor-pointer rounded-full px-3 py-1 text-xs text-zinc-500 ring-1 ring-zinc-300 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:ring-zinc-700 dark:hover:bg-zinc-800"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mx-auto mt-3 h-1 max-w-3xl overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${answeredPct}%`, background: ACCENT }}
        />
      </div>

      {/* Question card (original PDF rendering) */}
      <div className="mx-auto mt-5 max-w-3xl overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200/80 dark:ring-zinc-700">
        {qImages.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-zinc-400">
            Rendering…
          </div>
        ) : (
          qImages.map((src, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img key={i} src={src} alt={`Question ${question.number}`} className="block w-full" />
          ))
        )}
      </div>

      {/* Answer letters */}
      <div className="mx-auto mt-5 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          {isMulti && !confirmed && (
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              Choose {question.answers.length}
            </span>
          )}
          {confirmed && (
            <>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  result.correct
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {result.correct ? "Correct!" : "Wrong"}
              </span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                You: {result.chosen.join(", ")}
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Correct: {question.answers.join(", ")}
              </span>
            </>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {question.letters.map((letter) => {
            const isSelected = confirmed
              ? result.chosen.includes(letter)
              : selected.includes(letter);
            const isAnswer = question.answers.includes(letter);
            let cls =
              "bg-white text-zinc-700 ring-zinc-300 hover:ring-zinc-500 dark:bg-zinc-900 dark:text-zinc-200 dark:ring-zinc-700 dark:hover:ring-zinc-500";
            if (!confirmed && isSelected) {
              cls =
                "bg-zinc-900 text-white ring-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:ring-zinc-100";
            } else if (confirmed && isAnswer && isSelected) {
              cls =
                "bg-emerald-500 text-white ring-emerald-500";
            } else if (confirmed && isAnswer) {
              cls =
                "bg-emerald-500/10 text-emerald-600 ring-emerald-500 dark:text-emerald-400";
            } else if (confirmed && isSelected && !isAnswer) {
              cls = "bg-red-500 text-white ring-red-500";
            } else if (confirmed) {
              cls =
                "bg-white text-zinc-400 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-600 dark:ring-zinc-800";
            }
            return (
              <button
                key={letter}
                type="button"
                onClick={() => toggleLetter(letter)}
                disabled={confirmed}
                className={`relative h-12 w-12 rounded-xl text-base font-bold ring-1 transition-all ${cls} ${
                  confirmed ? "cursor-default" : "cursor-pointer"
                }`}
              >
                {letter}
                {confirmed && isSelected && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[9px] font-bold text-white ring-2 ring-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 dark:ring-zinc-950">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {confirmed && (
          <p className="mt-2 text-xs text-zinc-400">
            ✓ badge = your choice · green = correct option · red = your wrong
            pick
          </p>
        )}

        {/* Actions */}
        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={index === 0}
            className="inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-full px-4 text-sm font-medium text-zinc-600 ring-1 ring-zinc-300 transition-colors hover:bg-zinc-100 disabled:cursor-default disabled:opacity-40 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Prev
          </button>
          {!confirmed ? (
            <button
              type="button"
              onClick={confirm}
              disabled={selected.length === 0}
              className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-default disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              Confirm
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: ACCENT }}
            >
              {index + 1 < total ? "Next question" : "See results"}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Explanation (after confirm) */}
        {confirmed && (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-wider text-zinc-400">
              Answer &amp; explanation
            </p>
            <div className="mt-2 overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200/80 dark:ring-zinc-700">
              {expImages.length === 0 ? (
                <div className="flex h-24 items-center justify-center text-sm text-zinc-400">
                  Rendering…
                </div>
              ) : (
                expImages.map((src, i) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img key={i} src={src} alt="Explanation" className="block w-full" />
                ))
              )}
            </div>
          </div>
        )}

        <p className="mt-6 pb-4 text-center text-xs text-zinc-400 dark:text-zinc-600">
          Keyboard: A–F select · Enter confirm / next · ← → navigate
        </p>
      </div>
    </Shell>
  );
}

// -------------------- Shell --------------------

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full px-4 pb-16 pt-8 font-[family-name:var(--font-inter-tight)] text-zinc-900 sm:px-6 dark:text-zinc-100">
      {children}
    </div>
  );
}
