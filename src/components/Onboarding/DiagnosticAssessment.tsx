'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface DiagnosticAssessmentProps {
  onComplete: (results: { concept: string; score: number }[]) => void;
}

export function DiagnosticAssessment({ onComplete }: DiagnosticAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<{ concept: string; score: number }[]>([]);
  
  const assessmentAreas = [
    { concept: 'Algebra', questions: ['Basic equations', 'Linear functions', 'Quadratic equations'] },
    { concept: 'Geometry', questions: ['Area and perimeter', 'Angles and triangles', 'Coordinate geometry'] },
    { concept: 'Statistics', questions: ['Mean and median', 'Probability', 'Data interpretation'] },
    { concept: 'Reading Comprehension', questions: ['Main ideas', 'Supporting details', 'Inference'] },
    { concept: 'Grammar', questions: ['Subject-verb agreement', 'Punctuation', 'Sentence structure'] },
    { concept: 'Writing', questions: ['Essay structure', 'Argument development', 'Style and tone'] }
  ];
  
  const handleAreaAssessment = (concept: string, score: number) => {
    const newResults = [...results, { concept, score }];
    setResults(newResults);
    
    if (currentStep < assessmentAreas.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(newResults);
    }
  };
  
  const currentArea = assessmentAreas[currentStep];
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Diagnostic Assessment</h2>
          <p className="text-gray-600">
            Help us understand your current skill level to create a personalized study plan.
          </p>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Progress</span>
              <span>{currentStep + 1} of {assessmentAreas.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / assessmentAreas.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">{currentArea.concept}</h3>
          <p className="text-gray-600 mb-6">
            Rate your confidence level in the following areas:
          </p>
          
          <div className="space-y-4">
            {currentArea.questions.map((question, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <span className="text-gray-700">{question}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Weak</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-blue-500 transition-colors"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">Strong</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-4">
            <button
              onClick={() => handleAreaAssessment(currentArea.concept, 25)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Needs Work
            </button>
            <button
              onClick={() => handleAreaAssessment(currentArea.concept, 50)}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Average
            </button>
            <button
              onClick={() => handleAreaAssessment(currentArea.concept, 75)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Good
            </button>
            <button
              onClick={() => handleAreaAssessment(currentArea.concept, 95)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Excellent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}