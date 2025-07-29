'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Header } from '@/components/Layout/Header';
import { DashboardOverview } from '@/components/Dashboard/DashboardOverview';
import { QuickActions } from '@/components/Dashboard/QuickActions';
import { DiagnosticAssessment } from '@/components/Onboarding/DiagnosticAssessment';
import { QuestionInterface } from '@/components/Question/QuestionInterface';
import { ReadingComprehension } from '@/components/Reading/ReadingComprehension';
import { VocabularyDrill } from '@/components/Vocabulary/VocabularyDrill';
import { ProgressVisualization } from '@/components/Progress/ProgressVisualization';
import { useStore } from '@/lib/store';
import { Question, User, UserProgress, AppState } from '@/types';
import { getRandomQuestions, getQuestionsByConcept } from '@/data/questions';

export default function Home() {
  const { 
    user, 
    setUser, 
    setUserProgress, 
    currentQuestion, 
    setCurrentQuestion,
    getWeakestConcepts,
    getStrongestConcepts
  } = useStore();
  const [appState, setAppState] = useState<AppState>('dashboard');
  const [markedWords, setMarkedWords] = useState<string[]>([]);
  const [definitionCache, setDefinitionCache] = useState<Record<string, any>>({});
  const [savedPassage, setSavedPassage] = useState<string>('');
  const [savedMarkedWords, setSavedMarkedWords] = useState<string[]>([]);
  const [savedDefinitionCache, setSavedDefinitionCache] = useState<Record<string, any>>({});
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  
  useEffect(() => {
    if (isSignedIn && clerkUser) {
      const fetchUserData = async () => {
        try {
          // Fetch user profile
          const profileResponse = await fetch('/api/users/profile');
          if (!profileResponse.ok) {
            throw new Error('Failed to fetch user profile');
          }
          const userProfile: User = await profileResponse.json();
          setUser(userProfile);

          // Fetch user progress
          const progressResponse = await fetch('/api/users/progress');
          if (!progressResponse.ok) {
            throw new Error('Failed to fetch user progress');
          }
          const userProgress: UserProgress[] = await progressResponse.json();
          setUserProgress(userProgress);

        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [isSignedIn, clerkUser, setUser, setUserProgress]);
  
  const handleDiagnosticComplete = (results: { concept: string; score: number }[]) => {
    const newProgress: UserProgress[] = results.map(result => ({
      userId: user?.id || '1',
      concept: result.concept,
      masteryLevel: result.score,
      lastPracticed: new Date().toISOString(),
      correctAnswers: result.score === 100 ? 1 : 0,
      totalAttempts: 1,
      needsReview: result.score < 80
    }));
    
    setUserProgress(newProgress);
    setAppState('dashboard');
  };
  
  const handleStartWeaknessPractice = () => {
    const weakestConcepts = getWeakestConcepts();
    
    let question: Question;
    if (weakestConcepts.length > 0) {
      const weakestConcept = weakestConcepts[0];
      const conceptQuestions = getQuestionsByConcept(weakestConcept);
      question = conceptQuestions.length > 0 
        ? conceptQuestions[Math.floor(Math.random() * conceptQuestions.length)]
        : getRandomQuestions(1)[0];
    } else {
      question = getRandomQuestions(1)[0];
    }
    
    setCurrentQuestion(question);
    setAppState('question');
  };
  
  const handleAnswer = (selectedAnswer: number, isCorrect: boolean) => {
    console.log('Answer selected:', selectedAnswer, 'Correct:', isCorrect);
  };
  
  const handleNext = () => {
    const weakestConcepts = getWeakestConcepts();
    
    let question: Question;
    
    if (Math.random() < 0.7 && weakestConcepts.length > 0) {
      const randomWeakConcept = weakestConcepts[Math.floor(Math.random() * weakestConcepts.length)];
      const conceptQuestions = getQuestionsByConcept(randomWeakConcept);
      question = conceptQuestions.length > 0 
        ? conceptQuestions[Math.floor(Math.random() * conceptQuestions.length)]
        : getRandomQuestions(1)[0];
    } else {
      question = getRandomQuestions(1)[0];
    }
    
    setCurrentQuestion(question);
  };

  const handleStartStrengthMaintenance = () => {
    const strongestConcepts = getStrongestConcepts();
    
    let question: Question;
    if (strongestConcepts.length > 0) {
      const strongestConcept = strongestConcepts[0];
      const conceptQuestions = getQuestionsByConcept(strongestConcept);
      question = conceptQuestions.length > 0 
        ? conceptQuestions[Math.floor(Math.random() * conceptQuestions.length)]
        : getRandomQuestions(1)[0];
    } else {
      question = getRandomQuestions(1, { difficulty: 'hard' })[0] || getRandomQuestions(1)[0];
    }
    
    setCurrentQuestion(question);
    setAppState('question');
  };
  
  const handleReadingComplete = (
    words: string[],
    definitions: Record<string, any>
  ) => {
    setMarkedWords(words);
    setDefinitionCache(definitions);
    setAppState('vocabulary');
  };

  const handleBackToReading = () => {
    setAppState('reading');
  };

  const handleSaveReadingProgress = (passage: string, words: string[], definitions: Record<string, any>) => {
    setSavedPassage(passage);
    setSavedMarkedWords(words);
    setSavedDefinitionCache(definitions);
  };

  const handleCacheUpdate = (newCache: Record<string, any>) => {
    setDefinitionCache(newCache);
  };

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign-in page if not authenticated
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SAT Prep</h1>
            <p className="text-gray-600">Sign in to access your personalized SAT preparation</p>
          </div>
          <div className="space-y-4">
            <a 
              href="/sign-in" 
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors block text-center font-medium"
            >
              Sign In
            </a>
            <a 
              href="/sign-up" 
              className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors block text-center font-medium"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (appState) {
      case 'diagnostic':
        return <DiagnosticAssessment onComplete={handleDiagnosticComplete} />;
      case 'question':
        return currentQuestion ? (
          <QuestionInterface
            question={currentQuestion}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        ) : null;
      case 'vocabulary':
        return (
          <VocabularyDrill
            markedWords={markedWords}
            definitionCache={definitionCache}
            onUpdateCache={handleCacheUpdate}
            onComplete={() => {
              setAppState('dashboard');
              setMarkedWords([]);
              setSavedPassage('');
              setSavedMarkedWords([]);
              setSavedDefinitionCache({});
            }}
            onBackToReading={handleBackToReading}
            onSaveProgress={() => {
              handleSaveReadingProgress(savedPassage, markedWords, definitionCache);
            }}
          />
        );
      case 'reading':
        return (
          <ReadingComprehension 
            onComplete={handleReadingComplete}
            onSaveProgress={handleSaveReadingProgress}
            savedPassage={savedPassage}
            savedMarkedWords={savedMarkedWords}
            savedDefinitionCache={savedDefinitionCache}
          />
        );
      case 'progress':
        return <ProgressVisualization />;
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <QuickActions
                  onStartWeaknessPractice={handleStartWeaknessPractice}
                  onStartVocabulary={() => setAppState('vocabulary')}
                  onStartReading={() => setAppState('reading')}
                  onStartStrengthMaintenance={handleStartStrengthMaintenance}
                  onViewProgress={() => setAppState('progress')}
                />
              </div>
              <div className="space-y-6">
                <DashboardOverview />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogoClick={() => setAppState('dashboard')} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}