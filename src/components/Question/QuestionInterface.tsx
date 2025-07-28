'use client';

import { useState } from 'react';
import { Question } from '@/types';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionInterfaceProps {
  question: Question;
  onAnswer: (selectedAnswer: number, isCorrect: boolean) => void;
  onNext: () => void;
}

export function QuestionInterface({ question, onAnswer, onNext }: QuestionInterfaceProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const handleAnswerSelect = (answerIndex: number) => {
    if (showResults) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === question.correctAnswer;
    setIsCorrect(correct);
    setShowResults(true);
    onAnswer(answerIndex, correct);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {question.concept} • {question.subConcept}
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {question.question}
          </h2>
        </div>
        
        <div className="space-y-3 mb-8">
          {question.options.map((option, index) => {
            let buttonClass = 'w-full text-left p-4 border rounded-lg transition-colors ';
            
            if (showResults) {
              if (index === question.correctAnswer) {
                buttonClass += 'border-green-500 bg-green-50 text-green-700';
              } else if (index === selectedAnswer && index !== question.correctAnswer) {
                buttonClass += 'border-red-500 bg-red-50 text-red-700';
              } else {
                buttonClass += 'border-gray-200 bg-gray-50 text-gray-500';
              }
            } else {
              buttonClass += 'border-gray-200 hover:border-blue-500 hover:bg-blue-50';
            }
            
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={buttonClass}
                disabled={showResults}
              >
                <div className="flex items-center">
                  <span className="font-medium mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span>{option}</span>
                  {showResults && index === question.correctAnswer && (
                    <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                  )}
                  {showResults && index === selectedAnswer && index !== question.correctAnswer && (
                    <XCircle className="h-5 w-5 text-red-600 ml-auto" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        {showResults && (
          <div className="mb-6">
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center mb-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mr-2" />
                )}
                <span className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {question.explanation}
              </p>
            </div>
          </div>
        )}
        
        {showResults && (
          <div className="flex justify-end">
            <button
              onClick={onNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}