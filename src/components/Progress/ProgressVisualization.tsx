'use client';

import { useStore } from '@/lib/store';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function ProgressVisualization() {
  const { userProgress, user } = useStore();
  
  const getProgressColor = (masteryLevel: number) => {
    if (masteryLevel >= 80) return 'bg-green-500';
    if (masteryLevel >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getProgressTextColor = (masteryLevel: number) => {
    if (masteryLevel >= 80) return 'text-green-600';
    if (masteryLevel >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getTrendIcon = (masteryLevel: number) => {
    if (masteryLevel >= 80) return <TrendingUp className="h-4 w-4" />;
    if (masteryLevel >= 60) return <Minus className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };
  
  const overallProgress = userProgress.length > 0 
    ? Math.round(userProgress.reduce((sum, p) => sum + p.masteryLevel, 0) / userProgress.length)
    : 0;
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Progress Overview</h2>
          <p className="text-gray-600">
            Track your mastery across different SAT concepts and skills.
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
            <span className="text-2xl font-bold text-gray-900">{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-300 ${getProgressColor(overallProgress)}`}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userProgress.map((progress, index) => (
            <div key={index} className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{progress.concept}</h4>
                  <p className="text-sm text-gray-500">
                    Last practiced: {new Date(progress.lastPracticed).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-bold ${getProgressTextColor(progress.masteryLevel)}`}>
                      {progress.masteryLevel}%
                    </span>
                    <div className={getProgressTextColor(progress.masteryLevel)}>
                      {getTrendIcon(progress.masteryLevel)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress.masteryLevel)}`}
                    style={{ width: `${progress.masteryLevel}%` }}
                  />
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  {progress.correctAnswers}/{progress.totalAttempts} correct
                </span>
                <span>
                  {progress.needsReview ? 'Needs Review' : 'On Track'}
                </span>
              </div>
              
              {progress.needsReview && (
                <div className="mt-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                    Priority Review
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {userProgress.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No progress data available yet. Start practicing to see your progress!
            </p>
          </div>
        )}
        
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-2">Study Recommendations</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Focus on concepts with mastery levels below 60%</li>
            <li>• Practice regularly to maintain your streak</li>
            <li>• Review concepts marked as &quot;Needs Review&quot;</li>
            <li>• Balance weakness practice with strength maintenance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}