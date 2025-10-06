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
  revisionCount: number;
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
