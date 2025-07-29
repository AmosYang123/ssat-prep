'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Header } from '@/components/Layout/Header';
import { DashboardOverview } from '@/components/Dashboard/DashboardOverview';
import { QuickActions } from '@/components/Dashboard/QuickActions';

export default function Home() {
  const [appState] = useState('dashboard');
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  
  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SAT Prep...</p>
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

  // Show the main dashboard for authenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogoClick={() => {}} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <QuickActions
                onStartWeaknessPractice={() => console.log('Start weakness practice')}
                onStartVocabulary={() => console.log('Start vocabulary')}
                onStartReading={() => console.log('Start reading')}
                onStartStrengthMaintenance={() => console.log('Start strength maintenance')}
                onViewProgress={() => console.log('View progress')}
              />
            </div>
            <div className="space-y-6">
              <DashboardOverview />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}