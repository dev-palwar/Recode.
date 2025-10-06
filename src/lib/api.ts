import { LeetCodeData } from "@/types/index";
import { Prisma, User } from "@prisma/client";
import axios from "axios";

export const fetchLeetCodeDataFromExt = async (): Promise<LeetCodeData> => {
  const response = await fetch("/api/leetcode");

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch data");
  }

  const result = await response.json();
  return result;
};

export const fetchUserFromDb = async ({
  userId,
}: {
  userId: string;
}): Promise<User> => {
  try {
    const res = await axios.post(
      "/api/fetch-progress",
      { clerkId: userId },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res.status !== 200 || !res.data) {
      throw new Error("No user progress found or bad response");
    }

    return res.data as User;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch user progress"
    );
  }
};

export const saveUserProgress = async (payload: Prisma.UserCreateInput) => {
  try {
    const res = await axios.post(
      "/api/save-progress",
      { data: payload },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res.status !== 200 || !res.data) {
      throw new Error("Could not save progress");
    }

    return res.data;
  } catch (err) {
    throw new Error("Error " + err);
  }
};
