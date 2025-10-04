import { LeetCodeData } from "@/types/index";

export const fetchLeetCodeData = async (): Promise<LeetCodeData> => {
  const response = await fetch("/api/leetcode");

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch data");
  }

  const result = await response.json();
  return result;
};
