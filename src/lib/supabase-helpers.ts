import { supabaseClient } from "./supabase";

export interface Problem {
  id: number;
  title: string;
  titleSlug: string;
  difficulty: string;
  difficultyLevel: number;
  acceptanceRate: number;
  totalAccepted: number;
  totalSubmissions: number;
  isPaidOnly: boolean;
  revisionCounter: number;
}

export interface User {
  userid: string;
  name: string;
  email: string;
  image: string;
  createdAt: string;
  problems: Problem[];
}

// Get user data
export async function getUserData(userId: string): Promise<User | null> {
  const { data, error } = await supabaseClient
    .from("users")
    .select("*")
    .eq("userid", userId)
    .single();

  if (error) {
    console.error("Error fetching user data:", error);
    return null;
  }

  return data;
}

// Update user's problems
export async function updateUserProblems(
  userId: string,
  problems: Problem[]
): Promise<boolean> {
  const { error } = await supabaseClient
    .from("users")
    .update({ problems })
    .eq("userid", userId);

  if (error) {
    console.error("Error updating user problems:", error);
    return false;
  }

  return true;
}

// Add a single problem to user's list
export async function addProblemToUser(
  userId: string,
  problem: Problem
): Promise<boolean> {
  const userData = await getUserData(userId);

  if (!userData) return false;

  // Check if problem already exists
  const existingProblemIndex = userData.problems.findIndex(
    (p) => p.id === problem.id
  );

  let updatedProblems: Problem[];

  if (existingProblemIndex !== -1) {
    // Update existing problem
    updatedProblems = [...userData.problems];
    updatedProblems[existingProblemIndex] = problem;
  } else {
    // Add new problem
    updatedProblems = [...userData.problems, problem];
  }

  return updateUserProblems(userId, updatedProblems);
}

// Update revision count for a problem
export async function updateProblemrevisionCounter(
  userId: string,
  problemId: number,
  revisionCounter: number
): Promise<boolean> {
  const userData = await getUserData(userId);

  if (!userData) return false;

  const updatedProblems = userData.problems.map((p) =>
    p.id === problemId ? { ...p, revisionCounter } : p
  );

  return updateUserProblems(userId, updatedProblems);
}

// Sync LeetCode data to user's profile
export async function syncLeetCodeData(
  userId: string,
  problems: Problem[]
): Promise<boolean> {
  const userData = await getUserData(userId);

  if (!userData) return false;

  // Merge with existing problems, preserving revision counts
  const mergedProblems = problems.map((newProblem) => {
    const existing = userData.problems.find((p) => p.id === newProblem.id);
    return {
      ...newProblem,
      revisionCounter: existing?.revisionCounter || 0,
    };
  });

  return updateUserProblems(userId, mergedProblems);
}
