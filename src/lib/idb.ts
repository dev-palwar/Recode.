import { openDB } from "idb";

const DB_NAME = "leetcodeDB";
const STORE_NAME = "ac_problems";

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "question__title_slug" });
      }
    },
  });
};

export const saveProblems = async (problems: any[]) => {
  const db = await initDB();
  const tx = db.transaction("ac_problems", "readwrite");
  const store = tx.objectStore("ac_problems");
  problems.forEach((problem) => store.put(problem));
  await tx.done;
};

export const getProblems = async () => {
  const db = await initDB();
  return db.getAll("ac_problems");
};
