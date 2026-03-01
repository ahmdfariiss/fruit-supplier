export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface QuizResult {
  score: number;
  total: number;
  isPerfect: boolean;
  voucherCode: string | null;
  results: {
    questionId: string;
    correct: boolean;
    correctIndex: number;
    explanation: string | null;
  }[];
}
