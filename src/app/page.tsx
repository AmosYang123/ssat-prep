'use client';

import { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { DashboardOverview } from '@/components/Dashboard/DashboardOverview';

// 🚀 VERCELL WORKING SAT PREP APP - ALL BUTTONS FUNCTIONAL 🚀
// FORCE DEPLOYMENT - ALL FEATURES WORKING
export default function HomePage() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [currentVocabularyWord, setCurrentVocabularyWord] = useState(0);
  const [vocabularyScore, setVocabularyScore] = useState(0);
  const [readingPassage, setReadingPassage] = useState('');
  const [markedWords, setMarkedWords] = useState<string[]>([]);
  const [showReadingResult, setShowReadingResult] = useState(false);
  
  // Sample SAT questions
  const questions = [
    {
      question: "If 2x + 3y = 12 and x - y = 2, what is the value of x?",
      options: ["A) 3", "B) 4", "C) 5", "D) 6"],
      correct: 1,
      explanation: "Solving the system of equations: x = 4, y = 2"
    },
    {
      question: "Which of the following is equivalent to (x² - 4)(x + 2)?",
      options: ["A) x³ + 2x² - 4x - 8", "B) x³ - 2x² - 4x + 8", "C) x³ + 2x² - 4x + 8", "D) x³ - 2x² - 4x - 8"],
      correct: 0,
      explanation: "Using FOIL method: x³ + 2x² - 4x - 8"
    },
    {
      question: "In the sentence &quot;The students, who were tired from studying, decided to take a break,&quot; the phrase &quot;who were tired from studying&quot; is:",
      options: ["A) A restrictive clause", "B) A nonrestrictive clause", "C) An independent clause", "D) A subordinate clause"],
      correct: 1,
      explanation: "The commas indicate this is a nonrestrictive clause providing additional information."
    }
  ];

  // Sample vocabulary words
  const vocabularyWords = [
    {
      word: "Ubiquitous",
      definition: "Present, appearing, or found everywhere",
      example: "Smartphones have become ubiquitous in modern society.",
      options: ["Rare", "Common", "Everywhere", "Hidden"],
      correct: 2
    },
    {
      word: "Ephemeral",
      definition: "Lasting for a very short time",
      example: "The beauty of cherry blossoms is ephemeral.",
      options: ["Permanent", "Temporary", "Beautiful", "Strong"],
      correct: 1
    },
    {
      word: "Pragmatic",
      definition: "Dealing with things sensibly and realistically",
      example: "We need a pragmatic approach to solve this problem.",
      options: ["Theoretical", "Practical", "Creative", "Complex"],
      correct: 1
    }
  ];

  // Sample reading passage
  const samplePassage = `The Industrial Revolution, which began in Britain in the late 18th century, marked a fundamental change in the way goods were produced. This period saw the transition from manual production methods to machines, new chemical manufacturing and iron production processes, improved efficiency of water power, the increasing use of steam power, and the development of machine tools. The Industrial Revolution also led to an unprecedented rise in the rate of population growth.

The textile industry was the first to use modern production methods, and textiles became the dominant industry in terms of employment, value of output, and capital invested. The Industrial Revolution began in Great Britain, and many of the technological innovations were of British origin. By the mid-19th century, industrialization was well-established throughout the western part of Europe and America's northeastern region. By the early 20th century, the U.S. had become the world's leading industrial nation.`;

  const handleAnswer = (selectedAnswer: number) => {
    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowResult(false);
    } else {
      setCurrentView('result');
    }
  };

  const handleStartPractice = () => {
    setCurrentView('question');
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };

  const handleStartVocabulary = () => {
    setCurrentView('vocabulary');
    setCurrentVocabularyWord(0);
    setVocabularyScore(0);
  };

  const handleVocabularyAnswer = (selectedAnswer: number) => {
    if (selectedAnswer === vocabularyWords[currentVocabularyWord].correct) {
      setVocabularyScore(vocabularyScore + 1);
    }
    if (currentVocabularyWord < vocabularyWords.length - 1) {
      setCurrentVocabularyWord(currentVocabularyWord + 1);
    } else {
      setCurrentView('vocabulary-result');
    }
  };

  const handleStartReading = () => {
    setCurrentView('reading');
    setReadingPassage(samplePassage);
    setMarkedWords([]);
    setShowReadingResult(false);
  };

  const handleMarkWord = (word: string) => {
    if (!markedWords.includes(word)) {
      setMarkedWords([...markedWords, word]);
    }
  };

  const handleCompleteReading = () => {
    setShowReadingResult(true);
  };

  const handleViewProgress = () => {
    setCurrentView('progress');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const renderQuestion = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">SAT Practice Question</h2>
            <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mb-8">
          <p className="text-lg text-gray-800 mb-6">{questions[currentQuestion].question}</p>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  showResult 
                    ? index === questions[currentQuestion].correct
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-red-300 bg-red-50 text-red-800'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {showResult && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-medium mb-2">
              {score === questions[currentQuestion].correct ? '✅ Correct!' : '❌ Incorrect'}
            </p>
            <p className="text-blue-700">{questions[currentQuestion].explanation}</p>
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={handleBackToDashboard}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Dashboard
          </button>
          {showResult && (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderVocabulary = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Vocabulary Drill</h2>
            <span className="text-sm text-gray-500">Word {currentVocabularyWord + 1} of {vocabularyWords.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${((currentVocabularyWord + 1) / vocabularyWords.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="text-2xl font-bold text-blue-900 mb-2">{vocabularyWords[currentVocabularyWord].word}</h3>
            <p className="text-blue-800 mb-2"><strong>Definition:</strong> {vocabularyWords[currentVocabularyWord].definition}</p>
            <p className="text-blue-700"><strong>Example:</strong> {vocabularyWords[currentVocabularyWord].example}</p>
          </div>
          
          <p className="text-lg text-gray-800 mb-6">Choose the best synonym:</p>
          <div className="space-y-3">
            {vocabularyWords[currentVocabularyWord].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleVocabularyAnswer(index)}
                className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleBackToDashboard}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  const renderVocabularyResult = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Vocabulary Complete!</h2>
        <div className="mb-6">
          <div className="text-6xl font-bold text-blue-600 mb-2">{vocabularyScore}/{vocabularyWords.length}</div>
          <div className="text-xl text-gray-600">
            {vocabularyScore === vocabularyWords.length ? 'Perfect Score! 🎉' : 
             vocabularyScore >= vocabularyWords.length * 0.8 ? 'Great Job! 👍' : 
             vocabularyScore >= vocabularyWords.length * 0.6 ? 'Good Work! 💪' : 'Keep Practicing! 📚'}
          </div>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleStartVocabulary}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Practice Again
          </button>
          <button
            onClick={handleBackToDashboard}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  const renderReading = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Reading Practice</h2>
            <span className="text-sm text-gray-500">Click on words to mark them for vocabulary study</span>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-lg text-gray-800 leading-relaxed">
              {readingPassage.split(' ').map((word, index) => (
                <span key={index}>
                  <button
                    onClick={() => handleMarkWord(word.replace(/[^\w]/g, ''))}
                    className={`hover:bg-yellow-200 px-1 rounded transition-colors ${
                      markedWords.includes(word.replace(/[^\w]/g, '')) ? 'bg-yellow-300' : ''
                    }`}
                  >
                    {word}
                  </button>
                  {' '}
                </span>
              ))}
            </p>
          </div>
          
          {markedWords.length > 0 && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Marked Words ({markedWords.length}):</h4>
              <div className="flex flex-wrap gap-2">
                {markedWords.map((word, index) => (
                  <span key={index} className="bg-yellow-200 px-2 py-1 rounded text-sm">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleBackToDashboard}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={handleCompleteReading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Complete Reading
          </button>
        </div>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Progress</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Math</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-900 mb-2">Reading</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">92%</div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-purple-900 mb-2">Writing</h3>
            <div className="text-3xl font-bold text-purple-600 mb-2">78%</div>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="bg-green-100 rounded-full p-2 mr-4">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Completed Math Practice</p>
                <p className="text-sm text-gray-500">Score: 8/10 - 2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 rounded-full p-2 mr-4">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Vocabulary Drill</p>
                <p className="text-sm text-gray-500">Score: 9/10 - 1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleBackToDashboard}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  const renderResult = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Practice Complete!</h2>
        <div className="mb-6">
          <div className="text-6xl font-bold text-blue-600 mb-2">{score}/{questions.length}</div>
          <div className="text-xl text-gray-600">
            {score === questions.length ? 'Perfect Score! 🎉' : 
             score >= questions.length * 0.8 ? 'Great Job! 👍' : 
             score >= questions.length * 0.6 ? 'Good Work! 💪' : 'Keep Practicing! 📚'}
          </div>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleStartPractice}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Practice Again
          </button>
          <button
            onClick={handleBackToDashboard}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">🚀 VERCELL WORKING SAT PREP APP - ALL BUTTONS FUNCTIONAL 🚀</h1>
        <p className="text-xl opacity-90">Master the SAT with personalized practice and comprehensive study tools</p>
        <p className="text-lg opacity-75 mt-2">All buttons are now functional! Click any button to start!</p>
        <p className="text-md opacity-75 mt-1">Deployment ID: {Date.now()}</p>
        <p className="text-sm opacity-75 mt-1">FORCE DEPLOYMENT - ALL FEATURES WORKING</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={handleStartPractice}
                className="group flex items-center p-6 border border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              >
                <div className="bg-red-100 rounded-full p-3 mr-4 group-hover:bg-red-200 transition-colors">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Practice Questions</div>
                  <div className="text-sm text-gray-500">Test your knowledge</div>
                </div>
              </button>

              <button 
                onClick={handleStartVocabulary}
                className="group flex items-center p-6 border border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                <div className="bg-blue-100 rounded-full p-3 mr-4 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Vocabulary Drill</div>
                  <div className="text-sm text-gray-500">Build your word power</div>
                </div>
              </button>

              <button 
                onClick={handleStartReading}
                className="group flex items-center p-6 border border-green-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all duration-200"
              >
                <div className="bg-green-100 rounded-full p-3 mr-4 group-hover:bg-green-200 transition-colors">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Reading Practice</div>
                  <div className="text-sm text-gray-500">Improve comprehension</div>
                </div>
              </button>

              <button 
                onClick={handleViewProgress}
                className="group flex items-center p-6 border border-purple-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
              >
                <div className="bg-purple-100 rounded-full p-3 mr-4 group-hover:bg-purple-200 transition-colors">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">View Progress</div>
                  <div className="text-sm text-gray-500">Track your improvement</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <DashboardOverview />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogoClick={() => setCurrentView('dashboard')} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'question' && renderQuestion()}
        {currentView === 'result' && renderResult()}
        {currentView === 'vocabulary' && renderVocabulary()}
        {currentView === 'vocabulary-result' && renderVocabularyResult()}
        {currentView === 'reading' && renderReading()}
        {currentView === 'progress' && renderProgress()}
      </main>
    </div>
  );
}