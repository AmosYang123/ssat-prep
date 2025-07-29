'use client';

import { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { DashboardOverview } from '@/components/Dashboard/DashboardOverview';
import { QuickActions } from '@/components/Dashboard/QuickActions';

export default function Home() {
  const [appState] = useState('dashboard');
  
  // Show the main dashboard (no authentication required for now)
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