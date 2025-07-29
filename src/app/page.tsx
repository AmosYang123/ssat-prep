'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          SAT Prep App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your SAT preparation application is working!
        </p>
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
              Practice Questions
            </button>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
              Vocabulary Drill
            </button>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors">
              Reading Practice
            </button>
            <button className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors">
              View Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}