import { LeetCodeData, Problem } from "@/types/index";

export const fetchLeetCodeData = async (): Promise<LeetCodeData> => {
  const response = await fetch("/api/leetcode");

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch data");
  }

  const result = await response.json();
  return result;
};

export const syncProblemsToServer = async (
  problems: Problem[]
): Promise<boolean> => {
  try {
    const response = await fetch("/api/leetcode", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ problems }),
    });

    if (!response.ok) {
      console.error("Failed to sync problems to server");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error syncing problems to server:", error);
    return false;
  }
};
