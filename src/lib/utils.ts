import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Problem, Stats } from "@/types/index";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "text-emerald-600 dark:text-emerald-400";
    case "medium":
      return "text-amber-600 dark:text-amber-400";
    case "hard":
      return "text-rose-600 dark:text-rose-400";
    default:
      return "text-muted-foreground";
  }
};

export const calculateStats = (problems: Problem[]): Stats => {
  return {
    totalSolved: problems.length,
    easy: problems.filter((p) => p.difficulty === "Easy").length,
    medium: problems.filter((p) => p.difficulty === "Medium").length,
    hard: problems.filter((p) => p.difficulty === "Hard").length,
  };
};

export const filterProblems = (
  problems: Problem[],
  difficulty: string,
  searchTerm: string
): Problem[] => {
  return problems.filter((problem) => {
    const matchesDifficulty =
      difficulty === "all" ||
      problem.difficulty.toLowerCase() === difficulty.toLowerCase();

    const matchesSearch =
      searchTerm === "" ||
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.id.toString().includes(searchTerm);

    return matchesDifficulty && matchesSearch;
  });
};

export const sortProblemsByRevision = (problems: Problem[]): Problem[] => {
  return [...problems].sort((a, b) => a.revisionCount - b.revisionCount);
};

export const scrollToElement = (elementId: string): void => {
  setTimeout(() => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      el.style.border = "2px solid purple";
      el.style.borderRadius = "20px";
      el.style.transition = "0.3s all";

      setTimeout(() => {
        el.style.border = "";
        el.style.transition = "0.3s all";
      }, 1000);
    }
  }, 100);
};
