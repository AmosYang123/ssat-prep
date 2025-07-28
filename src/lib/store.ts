'use client';

import { create } from 'zustand';
import { User, Question, UserProgress, StudySession } from '../types';

interface AppState {
  user: User | null;
  currentQuestion: Question | null;
  userProgress: UserProgress[];
  studySession: StudySession | null;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setCurrentQuestion: (question: Question | null) => void;
  setUserProgress: (progress: UserProgress[]) => void;
  setStudySession: (session: StudySession | null) => void;
  setLoading: (loading: boolean) => void;
  
  // Computed values
  getWeakestConcepts: () => string[];
  getStrongestConcepts: () => string[];
  getOverallProgress: () => number;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  currentQuestion: null,
  userProgress: [],
  studySession: null,
  isLoading: false,
  
  setUser: (user) => set({ user }),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setUserProgress: (progress) => set({ userProgress: progress }),
  setStudySession: (session) => set({ studySession: session }),
  setLoading: (loading) => set({ isLoading: loading }),
  
  getWeakestConcepts: () => {
    const { userProgress } = get();
    return userProgress
      .filter(p => p.masteryLevel < 60)
      .sort((a, b) => a.masteryLevel - b.masteryLevel)
      .slice(0, 5)
      .map(p => p.concept);
  },
  
  getStrongestConcepts: () => {
    const { userProgress } = get();
    return userProgress
      .filter(p => p.masteryLevel >= 80)
      .sort((a, b) => b.masteryLevel - a.masteryLevel)
      .slice(0, 3)
      .map(p => p.concept);
  },
  
  getOverallProgress: () => {
    const { userProgress } = get();
    if (userProgress.length === 0) return 0;
    return Math.round(
      userProgress.reduce((sum, p) => sum + p.masteryLevel, 0) / userProgress.length
    );
  }
}));