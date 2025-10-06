import { LeetCodeData } from "@/types/index";

const STORAGE_KEY = "leetcode-tracker";

export const storage = {
  get: ({ userId }: { userId: string }): LeetCodeData | null => {
    try {
      const key = `${userId}-${STORAGE_KEY}`; // safer separator
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  },

  set: async ({
    data,
    userId,
  }: {
    data: LeetCodeData;
    userId: string;
  }): Promise<void> => {
    try {
      const key = `${userId}-${STORAGE_KEY}`;
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {}
  },

  clear: (userId?: string): void => {
    try {
      if (userId) {
        // clear only this user's data
        const key = `${userId}-${STORAGE_KEY}`;
        localStorage.removeItem(key);
      } else {
        // fallback: remove all possible keys containing the pattern
        Object.keys(localStorage).forEach((key) => {
          if (key.endsWith(STORAGE_KEY)) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch (error) {}
  },
};
