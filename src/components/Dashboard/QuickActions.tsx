'use client';

import { useStore } from '@/lib/store';
import { Brain, BookOpen, PenTool, TrendingUp, BarChart3 } from 'lucide-react';

interface QuickActionsProps {
  onStartWeaknessPractice: () => void;
  onStartVocabulary: () => void;
  onStartReading: () => void;
  onStartStrengthMaintenance: () => void;
  onViewProgress: () => void;
}

export function QuickActions({
  onStartWeaknessPractice,
  onStartVocabulary,
  onStartReading,
  onStartStrengthMaintenance,
  onViewProgress
}: QuickActionsProps) {
  const { getWeakestConcepts, getStrongestConcepts, userProgress } = useStore();
  
  const weakestConcepts = getWeakestConcepts();
  const strongestConcepts = getStrongestConcepts();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={onStartWeaknessPractice}
              className="group flex items-center p-6 border border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200"
            >
              <div className="bg-red-100 rounded-full p-3 mr-4 group-hover:bg-red-200 transition-colors">
                <Brain className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Practice Weaknesses</div>
                <div className="text-sm text-gray-500">Focus on improvement areas</div>
              </div>
            </button>
            
            <button
              onClick={onStartVocabulary}
              className="group flex items-center p-6 border border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            >
              <div className="bg-blue-100 rounded-full p-3 mr-4 group-hover:bg-blue-200 transition-colors">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Vocabulary Drill</div>
                <div className="text-sm text-gray-500">Build your word power</div>
              </div>
            </button>
            
            <button
              onClick={onStartReading}
              className="group flex items-center p-6 border border-green-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all duration-200"
            >
              <div className="bg-green-100 rounded-full p-3 mr-4 group-hover:bg-green-200 transition-colors">
                <PenTool className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Reading Practice</div>
                <div className="text-sm text-gray-500">Improve comprehension</div>
              </div>
            </button>
            
            <button
              onClick={onStartStrengthMaintenance}
              className="group flex items-center p-6 border border-purple-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
            >
              <div className="bg-purple-100 rounded-full p-3 mr-4 group-hover:bg-purple-200 transition-colors">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Maintain Strengths</div>
                <div className="text-sm text-gray-500">Keep your skills sharp</div>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 rounded-full p-2 mr-3">
              <BarChart3 className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Areas to Focus</h3>
          </div>
          <div className="space-y-4">
            {weakestConcepts.slice(0, 3).map((concept) => {
              const progress = userProgress.find(p => p.concept === concept);
              const masteryLevel = progress?.masteryLevel || 0;
              return (
                <div key={concept} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{concept}</span>
                    <span className="text-sm font-bold text-red-600">
                      {masteryLevel}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${masteryLevel}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={onViewProgress}
            className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            View All Progress
          </button>
        </div>
        
        {strongestConcepts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Your Strengths</h3>
            </div>
            <div className="space-y-4">
              {strongestConcepts.map((concept) => {
                const progress = userProgress.find(p => p.concept === concept);
                const masteryLevel = progress?.masteryLevel || 0;
                return (
                  <div key={concept} className="bg-green-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{concept}</span>
                      <span className="text-sm font-bold text-green-600">
                        {masteryLevel}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${masteryLevel}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}