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
  revisionCounter: number; // Changed from revisionCounter to match schema
}

export interface LeetCodeData {
  totalSolved: number;
  lastFetched: string;
  filtered?: number;
  problems: Problem[];
}

export interface Stats {
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
}
