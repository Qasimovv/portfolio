// -------------------- Quiz persistence (IndexedDB) --------------------
//  Stores uploaded PDFs (bytes + parsed questions) and the current session so
//  the trainer resumes exactly where the user left off. Everything stays on
//  the device — nothing is uploaded.

import type { QuizQuestion } from "@/components/quiz/parsePdf";

const DB_NAME = "quiz-trainer";
const DB_VERSION = 1;
const DOCS = "docs";
const META = "meta";
const SESSION_KEY = "session";

export type StoredDoc = {
  id: string;
  name: string;
  buffer: ArrayBuffer;
  questions: QuizQuestion[];
  skipped: number[];
};

export type StoredSession = {
  docIds: string[];
  order: { docId: string; num: number }[];
  index: number;
  results: Record<number, { chosen: string[]; confirmed: boolean; correct: boolean }>;
  quizCount: number;
  stage: "setup" | "ready" | "done";
};

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DOCS)) {
        db.createObjectStore(DOCS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(META)) {
        db.createObjectStore(META);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx<T>(
  store: string,
  mode: IDBTransactionMode,
  run: (s: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T | undefined> {
  return openDb().then(
    (db) =>
      new Promise<T | undefined>((resolve, reject) => {
        const t = db.transaction(store, mode);
        const s = t.objectStore(store);
        let result: T | undefined;
        const r = run(s);
        if (r) r.onsuccess = () => (result = r.result);
        t.oncomplete = () => resolve(result);
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error);
      }),
  );
}

export async function saveDoc(doc: StoredDoc): Promise<void> {
  try {
    await tx(DOCS, "readwrite", (s) => s.put(doc));
  } catch {
    // storage may be full or blocked — degrade to non-persistent
  }
}

export async function deleteDoc(id: string): Promise<void> {
  try {
    await tx(DOCS, "readwrite", (s) => s.delete(id));
  } catch {
    /* ignore */
  }
}

export async function getAllDocs(): Promise<StoredDoc[]> {
  try {
    const all = await tx<StoredDoc[]>(DOCS, "readonly", (s) => s.getAll());
    return all ?? [];
  } catch {
    return [];
  }
}

export async function saveSession(session: StoredSession): Promise<void> {
  try {
    await tx(META, "readwrite", (s) => s.put(session, SESSION_KEY));
  } catch {
    /* ignore */
  }
}

export async function getSession(): Promise<StoredSession | null> {
  try {
    const s = await tx<StoredSession>(META, "readonly", (st) =>
      st.get(SESSION_KEY),
    );
    return s ?? null;
  } catch {
    return null;
  }
}

export async function clearAll(): Promise<void> {
  try {
    await tx(DOCS, "readwrite", (s) => s.clear());
    await tx(META, "readwrite", (s) => s.clear());
  } catch {
    /* ignore */
  }
}
