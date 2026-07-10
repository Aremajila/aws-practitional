export interface WeeklyModule {
  id: string;
  week: number;
  month: number;
  title: string;
  subtitle: string;
  description: string;
  topics: string[];
  completed: boolean;
  confidence: number; // 0 (unrated) to 5
}

export interface Flashcard {
  id: string;
  front: string; // AWS term
  back: string;  // Explanation
  domain: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  reviewCount: number;
  nextReviewDate?: string; // ISO string
}

export interface QuizQuestion {
  id: string;
  domain: 'Cloud Concepts' | 'Security & Compliance' | 'Technology' | 'Billing & Pricing';
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface LabTask {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  completed: boolean;
  estimatedMinutes: number;
}

export interface QuizAttempt {
  id: string;
  timestamp: string;
  score: number;
  totalQuestions: number;
  mode: 'quick' | 'full';
  timeTakenSeconds: number;
  domainScores: {
    'Cloud Concepts': { correct: number; total: number };
    'Security & Compliance': { correct: number; total: number };
    'Technology': { correct: number; total: number };
    'Billing & Pricing': { correct: number; total: number };
  };
}

export interface StudyState {
  modules: WeeklyModule[];
  flashcards: Flashcard[];
  labTasks: LabTask[];
  quizAttempts: QuizAttempt[];
  streak: {
    current: number;
    lastStudiedDate: string | null;
  };
  studyPace: 'fast' | 'regular' | 'relaxed'; // fast = 5 days/module, regular = 7, relaxed = 10
}
