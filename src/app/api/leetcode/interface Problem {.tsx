interface User {
  userid: string;
  name: string;
  email: string;
  image: string;
  createdAt: string;
  problems: {
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
  }[];
}

interface Problem {
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

// interface user {
//   id: string;
//   name: string;
//   image: string;
//   email: string;
//   createdAt: Date;
// }

// interface User_Problem_Record {
//   id: string;
//   problem_id: string;
//   user_id: string;
//   revision_count: number;
// }
