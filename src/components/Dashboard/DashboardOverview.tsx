'use client';

import { useStore } from '@/lib/store';
import { Target, TrendingUp, Calendar, Flame } from 'lucide-react';

export function DashboardOverview() {
  const { user, getOverallProgress } = useStore();
  
  if (!user) return null;
  
  const overallProgress = getOverallProgress();
  const daysUntilTest = Math.ceil(
    (new Date(user.testDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Calculate progress to target
  const progressToTarget = Math.round(((user.currentScore - 400) / (user.targetScore - 400)) * 100);
  
  return (
    <div className="mb-8">
      {/* Welcome Message */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
        <p className="text-gray-600 mt-2">Ready to continue your SAT preparation journey?</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Target Score</p>
              <p className="text-3xl font-bold text-blue-900">{user.targetScore}</p>
            </div>
            <div className="bg-blue-200 rounded-full p-3">
              <Target className="h-6 w-6 text-blue-700" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Current Score</p>
              <p className="text-3xl font-bold text-green-900">{user.currentScore}</p>
              <p className="text-xs text-green-600 mt-1">{progressToTarget}% to target</p>
            </div>
            <div className="bg-green-200 rounded-full p-3">
              <TrendingUp className="h-6 w-6 text-green-700" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Days Until Test</p>
              <p className="text-3xl font-bold text-orange-900">{daysUntilTest}</p>
              <p className="text-xs text-orange-600 mt-1">{daysUntilTest > 30 ? 'Plenty of time!' : 'Final push!'}</p>
            </div>
            <div className="bg-orange-200 rounded-full p-3">
              <Calendar className="h-6 w-6 text-orange-700" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Study Streak</p>
              <p className="text-3xl font-bold text-red-900">{user.streakDays}</p>
              <p className="text-xs text-red-600 mt-1">{user.streakDays > 7 ? 'On fire!' : 'Keep going!'}</p>
            </div>
            <div className="bg-red-200 rounded-full p-3">
              <Flame className="h-6 w-6 text-red-700" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Overall Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
          <span className="text-2xl font-bold text-gray-900">{overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {overallProgress >= 80 ? 'Excellent progress! You\'re ready for the test.' :
           overallProgress >= 60 ? 'Good progress! Keep practicing your weak areas.' :
           overallProgress >= 40 ? 'Making progress! Focus on consistent practice.' :
           'Getting started! Regular practice will boost your scores.'}
        </p>
      </div>
    </div>
  );
}