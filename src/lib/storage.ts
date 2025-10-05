import { LeetCodeData } from "@/types/index";
import { syncProblemsToServer } from "./api";

const STORAGE_KEY = "leetcode-tracker";

export const storage = {
  get: (): LeetCodeData | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  },

  set: async (data: LeetCodeData, syncToServer = true): Promise<void> => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      // Optionally sync to server
      if (syncToServer) {
        await syncProblemsToServer(data.problems);
      }
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};
