'use client';

import { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { DashboardOverview } from '@/components/Dashboard/DashboardOverview';
import { QuickActions } from '@/components/Dashboard/QuickActions';

export default function Home() {
  const [appState] = useState('dashboard');
  
  const handleStartWeaknessPractice = () => {
    console.log('Start weakness practice');
  };
  
  const handleStartVocabulary = () => {
    console.log('Start vocabulary');
  };
  
  const handleStartReading = () => {
    console.log('Start reading');
  };
  
  const handleStartStrengthMaintenance = () => {
    console.log('Start strength maintenance');
  };
  
  const handleViewProgress = () => {
    console.log('View progress');
  };
  
  const handleLogoClick = () => {
    console.log('Logo clicked');
  };
  
  const renderContent = () => {
    switch (appState) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <QuickActions 
                  onStartWeaknessPractice={handleStartWeaknessPractice}
                  onStartVocabulary={handleStartVocabulary}
                  onStartReading={handleStartReading}
                  onStartStrengthMaintenance={handleStartStrengthMaintenance}
                  onViewProgress={handleViewProgress}
                />
              </div>
              <div className="space-y-6">
                <DashboardOverview />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <QuickActions 
                  onStartWeaknessPractice={handleStartWeaknessPractice}
                  onStartVocabulary={handleStartVocabulary}
                  onStartReading={handleStartReading}
                  onStartStrengthMaintenance={handleStartStrengthMaintenance}
                  onViewProgress={handleViewProgress}
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
      <Header onLogoClick={handleLogoClick} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}