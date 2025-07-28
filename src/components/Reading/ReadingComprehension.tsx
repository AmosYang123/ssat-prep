'use client';

import { useState, useCallback, useEffect } from 'react';
import { Highlighter, RefreshCw, X } from 'lucide-react';

interface ReadingComprehensionProps {
  onComplete: (markedWords: string[], definitionCache: Record<string, WordDefinition | null>) => void;
  onSaveProgress?: (passage: string, markedWords: string[], definitionCache: Record<string, WordDefinition | null>) => void;
  savedPassage?: string;
  savedMarkedWords?: string[];
  savedDefinitionCache?: Record<string, WordDefinition | null>;
}

const initialPassage = `
    The concept of artificial intelligence has evolved dramatically over the past few decades. Initially conceived as a way to replicate human reasoning, AI has transformed into a multifaceted field encompassing machine learning, natural language processing, and computer vision. The implications of these advancements extend far beyond academic curiosity, potentially revolutionizing industries from healthcare to transportation.

    Contemporary AI systems demonstrate remarkable capabilities in pattern recognition and data analysis. However, they also present unprecedented challenges regarding ethics, employment, and societal impact. As we navigate this technological landscape, it becomes increasingly important to establish frameworks for responsible AI development and deployment.

    The proliferation of AI technologies raises fundamental questions about the nature of intelligence itself. While machines can process vast amounts of information and identify complex patterns, the question of whether they truly "understand" remains contentious among researchers and philosophers alike.
  `;

// Define a type for our definition object for better type safety
interface WordDefinition {
  word: string;
  phonetic: string;
  meanings: {
    partOfSpeech: string;
    definitions: string[];
  }[];
}

export function ReadingComprehension({ 
  onComplete, 
  onSaveProgress,
  savedPassage,
  savedMarkedWords,
  savedDefinitionCache
}: ReadingComprehensionProps) {
  const [passage, setPassage] = useState(savedPassage || "Loading your first passage...");
  const [markedWords, setMarkedWords] = useState<string[]>(savedMarkedWords || []);
  const [isLoading, setIsLoading] = useState(!savedPassage); // Only loading if no saved passage
  const [error, setError] = useState<string | null>(null);

  // New state for handling definitions
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [definitionCache, setDefinitionCache] = useState<Record<string, WordDefinition | null>>(savedDefinitionCache || {});
  const [isFetchingDef, setIsFetchingDef] = useState(false);

  const generateNewPassage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/reading/generate', {
        method: 'POST',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate new passage.');
      }
      const data = await response.json();
      setPassage(data.passage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setPassage(initialPassage); // Fallback to the default passage on error
    } finally {
      setIsLoading(false);
    }
  }, []); // Use useCallback to memoize the function

  // Preload next passage in background (disabled to ensure randomness)
  const preloadNextPassage = useCallback(async () => {
    // Disabled to ensure each request gets a fresh, random passage
    return;
  }, []);

  // Fetch the initial passage when the component first mounts
  useEffect(() => {
    if (!savedPassage) {
      generateNewPassage();
      // Preload next passage after a short delay
      const timer = setTimeout(() => {
        preloadNextPassage();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [generateNewPassage, preloadNextPassage, savedPassage]);
  
  const handleWordClick = (word: string) => {
    // This function now handles adding/removing from both the passage and the bank
    // A more robust regex that only removes punctuation from the start/end of a word.
    const cleanWord = word.replace(/^[.,!?;:"'()\[\]]+|[.,!?;:"'()\[\]]+$/g, '');
    if (cleanWord === '') return;

    setMarkedWords(prev => {
      const newMarkedWords = prev.includes(cleanWord)
        ? prev.filter(w => w !== cleanWord)
        : [...prev, cleanWord];
      
      // Preload definitions for newly marked words
      if (!prev.includes(cleanWord)) {
        // Fetch definition in background for new words
        fetch(`/api/dictionary/${cleanWord}`)
          .then(response => response.ok ? response.json() : null)
          .then(data => {
            setDefinitionCache(prev => ({ ...prev, [cleanWord]: data }));
          })
          .catch(error => {
            console.error("Failed to preload definition:", error);
            setDefinitionCache(prev => ({ ...prev, [cleanWord]: null }));
          });
      }
      
      return newMarkedWords;
    });
  };

  const handleWordHover = async (word: string) => {
    setHoveredWord(word);
    if (definitionCache[word]) {
      return; // Already in cache
    }
    
    setIsFetchingDef(true);
    try {
      const response = await fetch(`/api/dictionary/${word}`);
      if (!response.ok) {
        // If not found, we'll cache 'null' to avoid re-fetching
        setDefinitionCache(prev => ({ ...prev, [word]: null }));
        return;
      }
      const data: WordDefinition = await response.json();
      setDefinitionCache(prev => ({ ...prev, [word]: data }));
    } catch (error) {
      console.error("Failed to fetch definition:", error);
      setDefinitionCache(prev => ({ ...prev, [word]: null }));
    } finally {
      setIsFetchingDef(false);
    }
  };

  const saveProgress = () => {
    if (onSaveProgress) {
      onSaveProgress(passage, markedWords, definitionCache);
    }
  };
  
  const renderClickableText = (text: string) => {
    const words = text.split(/(\s+)/); // Split by space, keeping spaces
    return (
      <>
        {words.map((word, index) => {
          const cleanWord = word.replace(/^[.,!?;:"'()\[\]]+|[.,!?;:"'()\[\]]+$/g, '');
      const isMarked = markedWords.includes(cleanWord);
          if (word.trim() === '') {
            return <span key={index}>{word}</span>;
          }
      return (
        <span
          key={index}
          onClick={() => handleWordClick(word)}
              className={`cursor-pointer transition-colors duration-200 rounded-md px-1 py-0.5
                ${isMarked ? 'bg-yellow-200 hover:bg-red-200' : 'hover:bg-yellow-100'}`}
        >
              {word}
        </span>
      );
        })}
      </>
    );
  };

  const currentDefinition = hoveredWord ? definitionCache[hoveredWord] : null;
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Reading Comprehension</h2>
            <button
              onClick={generateNewPassage}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center transition-colors"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Generating...' : 'New Reading'}
            </button>
          </div>
          <p className="text-gray-600">
            Read the passage below and click on words you'd like to add to your vocabulary practice.
          </p>
        </div>
        
        {/* Passage Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Highlighter className="text-blue-600 h-6 w-6 mr-2" />
            <span className="font-semibold text-gray-700">
              Click on a word to mark it. Click it again, or click it in the bank below, to unmark.
            </span>
          </div>
          
          <div className="prose max-w-none">
            {isLoading && (
              <div className="flex justify-center items-center h-48">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            )}
            {error && !isLoading && (
              <div className="text-red-500 bg-red-100 p-4 rounded-lg my-4">
                <p><strong>Error:</strong> {error}</p>
                <p>Displaying the current passage. Please check your connection or try again later.</p>
              </div>
            )}
            
            <div className={`text-gray-800 leading-relaxed text-lg ${isLoading ? 'opacity-50' : ''}`}>
              {passage.trim().split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {renderClickableText(paragraph.trim())}
                </p>
              ))}
            </div>
          </div>
        </div>
        
        {/* Marked Words Bank Section */}
        {markedWords.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Marked Words for Practice</h3>
            <div className="flex flex-wrap gap-3">
              {markedWords.map((word, index) => (
                <div key={index} className="relative">
                  <button
                    onMouseEnter={() => handleWordHover(word)}
                    onMouseLeave={() => setHoveredWord(null)}
                    onClick={() => handleWordClick(word)}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-red-200 hover:text-red-800 hover:shadow-md transform hover:-translate-y-1"
                    title={`Remove "${word}"`}
                >
                  {word}
                    <X className="ml-2 h-4 w-4" />
                  </button>
                  
                  {/* Definition Tooltip */}
                  {hoveredWord === word && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-4 bg-gray-800 text-white rounded-lg shadow-xl z-10 pointer-events-none">
                      {isFetchingDef && <p>Loading definition...</p>}
                      {!isFetchingDef && currentDefinition && (
                        <>
                          <h4 className="font-bold text-lg">{currentDefinition.word}</h4>
                          {currentDefinition.meanings.map((meaning, i) => (
                            <div key={i} className="mb-2">
                              <p className="font-semibold text-gray-300 text-base mb-1">{meaning.partOfSpeech}</p>
                              {currentDefinition.phonetic && (
                                <p className="text-xs text-gray-400 mb-2 italic">{currentDefinition.phonetic}</p>
                              )}
                              <ul className="list-disc list-inside text-sm">
                                {meaning.definitions.slice(0, 2).map((def, j) => <li key={j}>{def}</li>)}
                              </ul>
                            </div>
                          ))}
                        </>
                      )}
                       {!isFetchingDef && !currentDefinition && (
                        <p>No definition found for this word.</p>
                      )}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-800 -mb-2"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => setMarkedWords([])}
                className="text-gray-700 hover:text-red-600 font-semibold py-2 px-4 rounded-lg flex items-center transition-colors text-sm"
          >
            Clear All
          </button>
          <button
                onClick={() => {
                  // Save current progress before completing
                  if (onSaveProgress) {
                    onSaveProgress(passage, markedWords, definitionCache);
                  }
                  onComplete(markedWords, definitionCache);
                }}
                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
                Start Vocabulary Practice
          </button>
        </div>
          </div>
        )}
      </div>
    </div>
  );
}