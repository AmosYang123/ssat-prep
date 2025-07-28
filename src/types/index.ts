export interface User {
  id: string;
  name: string;
  email: string;
  targetScore: number;
  testDate: string;
  currentScore: number;
  streakDays: number;
  createdAt: string;
}

export interface Question {
  id: string;
  type: 'math' | 'reading' | 'writing';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  concept: string;
  subConcept: string;
}

export interface UserProgress {
  userId: string;
  concept: string;
  masteryLevel: number; // 0-100
  lastPracticed: string;
  correctAnswers: number;
  totalAttempts: number;
  needsReview: boolean;
}

export interface StudySession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  questionsAttempted: number;
  correctAnswers: number;
  conceptsStudied: string[];
  focusArea: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  examples: string[];
}

export interface UserVocabulary {
  userId: string;
  wordId: string;
  masteryLevel: number;
  lastReviewed: string;
  correctCount: number;
  incorrectCount: number;
  nextReview: string;
}

export type AppState = 'dashboard' | 'diagnostic' | 'question' | 'reading' | 'vocabulary' | 'progress';