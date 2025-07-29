'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, PanInfo } from 'framer-motion';
import {
  Info,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Undo2,
  X,
  Check,
  X as XIcon,
} from 'lucide-react';

interface WordDefinition {
  word: string;
  phonetic: string;
  meanings: {
    partOfSpeech: string;
    definitions: string[];
  }[];
}

interface VocabularyDrillProps {
  markedWords: string[];
  definitionCache: Record<string, WordDefinition | null>;
  onComplete: () => void;
  onUpdateCache: (newCache: Record<string, WordDefinition | null>) => void;
  onBackToReading: () => void;
  onSaveProgress?: () => void;
}

export function VocabularyDrill({
  markedWords,
  definitionCache,
  onComplete,
  onUpdateCache,
  onBackToReading,
  onSaveProgress,
}: VocabularyDrillProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [currentDefinition, setCurrentDefinition] = useState<WordDefinition | null>(null);
  const [localDefinitionCache, setLocalDefinitionCache] = useState(definitionCache);
  
  const currentWord = markedWords[currentWordIndex];

  // Debug logging
  console.log('VocabularyDrill rendered with:', {
    markedWords,
    markedWordsLength: markedWords.length,
    currentWordIndex,
    currentWord,
    definitionCache
  });

  // Handle empty marked words
  if (markedWords.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Words to Study</h2>
          <p className="text-gray-600 mb-6">You haven't marked any words during your reading session yet.</p>
          <div className="space-y-3">
            <button
              onClick={onBackToReading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go Back to Reading
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate if text will fit at minimum font size (13px)
  const willTextFit = useCallback((text: string) => {
    const cleanedText = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    // Approximate characters per line at 13px font in the card width
    const cardWidth = 768; // max-w-3xl = 768px
    const charPerLine = Math.floor(cardWidth / 8); // ~8px per character at 13px font
    const lines = Math.ceil(cleanedText.length / charPerLine);
    const maxLines = 8; // Maximum lines that fit in the card height
    return lines <= maxLines;
  }, []);

  useEffect(() => {
    const fetchDefinition = async () => {
      if (!markedWords[currentWordIndex]) return;
      
      const word = markedWords[currentWordIndex];
      
      // Check cache first
      if (definitionCache[word]) {
        setCurrentDefinition(definitionCache[word]);
        return;
      }

      setIsLoading(true);
      
      try {
        // Priority 1: Try dictionary API first (most accurate, not AI)
        const response = await fetch(`/api/dictionary/${word}`);
        if (response.ok) {
          const data = await response.json();
          
          // Check if dictionary definition fits in box
          const fitsInBox = data.meanings.every((meaning: any) => 
            willTextFit(meaning.definitions[0])
          );
          
          if (fitsInBox) {
            // Dictionary definition fits - use it (Priority 1 & 2 met)
            setCurrentDefinition(data);
            onUpdateCache({ ...definitionCache, [word]: data });
          } else {
            // Dictionary definition doesn't fit - try AI concise version (Priority 1)
            const conciseResponse = await fetch(`/api/dictionary/${word}?concise=true`);
            if (conciseResponse.ok) {
              const conciseData = await conciseResponse.json();
              setCurrentDefinition(conciseData);
              onUpdateCache({ ...definitionCache, [word]: conciseData });
            } else {
              // Fallback to original dictionary definition even if it doesn't fit perfectly
              setCurrentDefinition(data);
              onUpdateCache({ ...definitionCache, [word]: data });
            }
          }
        } else {
          // Dictionary failed - use AI (Priority 3 not met, but we need a definition)
          const aiResponse = await fetch(`/api/dictionary/${word}?concise=true`);
          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            setCurrentDefinition(aiData);
            onUpdateCache({ ...definitionCache, [word]: aiData });
          } else {
            setCurrentDefinition(null);
          }
        }
      } catch (error) {
        console.error('Error fetching definition:', error);
        setCurrentDefinition(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDefinition();
  }, [currentWordIndex, markedWords, definitionCache, onUpdateCache, willTextFit]);

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    setTimeout(() => {
      if (currentWordIndex < markedWords.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setShowDefinition(false);
        setSwipeDirection(null);
      } else {
        onComplete();
      }
    }, 300);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 80;
    
    if (info.offset.x > threshold) {
      handleSwipe('right');
    } else if (info.offset.x < -threshold) {
      handleSwipe('left');
    }
  };

  const handleCardClick = () => {
    if (!isDragging) {
      setShowDefinition(!showDefinition);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && currentWordIndex > 0) {
        setCurrentWordIndex(currentWordIndex - 1);
        setShowDefinition(false);
      } else if (event.key === 'ArrowRight') {
        if (currentWordIndex < markedWords.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1);
          setShowDefinition(false);
        } else {
          onComplete();
        }
      } else if (event.key === ' ') {
        event.preventDefault(); // Prevent page scroll
        setShowDefinition(!showDefinition);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentWordIndex, markedWords.length, onComplete, showDefinition]);

  const getFittedText = (text: string) => {
    return text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const getFontSize = (text: string) => {
    if (text.length > 300) return 'text-sm';
    if (text.length > 200) return 'text-base';
    if (text.length > 150) return 'text-lg';
    return 'text-xl';
  };

  // Request more concise definition from AI if text doesn't fit
  const requestConciseDefinition = async (word: string, originalDefinition: string) => {
    try {
      const response = await fetch(`/api/dictionary/${word}?concise=true`);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Failed to get concise definition:', error);
    }
    return null;
  };
  
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="relative flex h-full w-full max-w-4xl flex-col items-center rounded-lg bg-white p-8 shadow-xl">
        <div className="w-full">
          <h1 className="text-center text-4xl font-bold text-gray-800">
            Vocabulary Practice
          </h1>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Vocabulary Practice</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (onSaveProgress) {
                      onSaveProgress();
                    }
                    onBackToReading();
                  }}
                  className="font-semibold py-2 px-4 transition-colors text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <Undo2 size={16} />
                  Back
                </button>
                <button
                  onClick={onComplete}
                  className="font-semibold py-2 px-4 transition-colors text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                >
                  End Session
                </button>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentWordIndex === markedWords.length - 1 
                    ? 'bg-red-500' 
                    : 'bg-blue-600'
                }`}
                style={{ width: `${((currentWordIndex + 1) / markedWords.length) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Swipe Instructions */}
          <div className="text-center mb-6">
            <div className="flex justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <XIcon className="h-5 w-5 text-red-500" />
                <span>Swipe left to mark as unknown</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Swipe right to mark as known</span>
              </div>
            </div>
          </div>

          {/* Stacked Cards Area */}
          <div className="relative flex justify-center items-center min-h-[500px] mb-4">
            {/* Background Cards */}
            {[1, 2].map((index) => (
              <motion.div
                key={index}
                className="absolute w-full max-w-3xl h-[450px] bg-gray-100 rounded-xl shadow-lg border border-gray-200"
                animate={{
                  y: index * 6,
                  scale: 1 - index * 0.03,
                  opacity: 0.3 - index * 0.1,
                }}
                transition={{ 
                  duration: 0.25,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                style={{
                  zIndex: 10 - index,
                  filter: `blur(${index * 0.5}px)`,
                }}
              />
            ))}
            
            {/* Main Card */}
            <motion.div
              key={currentWordIndex}
              className="relative w-full max-w-3xl h-[450px] cursor-pointer"
              style={{ perspective: '1000px', zIndex: 20 }}
              drag="x"
              dragConstraints={{ left: -200, right: 200 }}
              dragElastic={0.1}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{
                x: swipeDirection === 'left' ? -600 : swipeDirection === 'right' ? 600 : 0,
                y: swipeDirection ? -100 : 0,
                rotate: swipeDirection === 'left' ? -15 : swipeDirection === 'right' ? 15 : 0,
                opacity: swipeDirection ? 0 : 1,
                scale: swipeDirection ? 0.8 : 1,
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.1 }
              }}
              transition={{ 
                duration: 0.25, 
                ease: [0.25, 0.46, 0.45, 0.94],
                opacity: { duration: 0.2 }
              }}
              onClick={handleCardClick}
            >

              {/* Flashcard Container */}
              <div
                className="relative w-full h-full"
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${showDefinition ? 180 : 0}deg)`,
                  transition: 'transform 0.3s ease-in-out'
                }}
              >
                {/* Front of Card - Word */}
                <div 
                  className="absolute w-full h-full bg-white rounded-xl shadow-lg border-2 border-gray-200 flex flex-col justify-center items-center p-6"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <h3 className="text-6xl font-bold text-gray-900 mb-6">{currentWord}</h3>
                  <div className="flex items-center text-gray-500 text-lg">
                    <BookOpen className="h-5 w-5 mr-2" />
                    <span>Tap to reveal definition</span>
                  </div>
                </div>

                {/* Back of Card - Definition */}
                <div 
                  className="absolute w-full h-full bg-white rounded-xl shadow-lg border-2 border-gray-200 flex flex-col justify-center items-center p-6"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateX(180deg)'
                  }}
                >
                  {isLoading && (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-700 text-lg">Loading definition...</span>
                    </div>
                  )}
                  {!isLoading && currentDefinition && (
                    <div className="w-full text-center px-4 h-full overflow-y-auto">
                      {currentDefinition.meanings.map((meaning, i) => (
                        <div key={i} className="mb-3">
                          <p className="font-bold text-gray-800 text-2xl mb-2">{meaning.partOfSpeech}</p>
                          {currentDefinition.phonetic && (
                            <p className="text-lg text-gray-600 mb-2 italic">{currentDefinition.phonetic}</p>
                          )}
                          <p className="text-gray-900 leading-relaxed break-words text-lg">
                            {getFittedText(meaning.definitions[0])}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {!isLoading && !currentDefinition && (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-700 text-lg">No definition could be found for this word.</p>
                    </div>
                  )}
                  <div className="mt-4 text-center text-gray-500 text-base font-medium">
                    Tap to flip back
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Manual Buttons */}
          <div className="flex justify-center items-center gap-8">
            <button
              onClick={() => {
                if (currentWordIndex > 0) {
                  setCurrentWordIndex(currentWordIndex - 1);
                  setShowDefinition(false);
                }
              }}
              disabled={currentWordIndex === 0}
              className={`p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${
                currentWordIndex === 0 
                  ? 'bg-gray-100 text-gray-400' 
                  : 'bg-white hover:bg-gray-100 text-gray-700'
              }`}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <span className="w-32 text-center text-lg font-medium text-gray-600">
              Word {currentWordIndex + 1} of {markedWords.length}
              {currentWordIndex === markedWords.length - 1 && (
                <div className="text-sm text-red-500 font-semibold mt-1">Last one! 🎯</div>
              )}
            </span>
            <button
              onClick={() => {
                if (currentWordIndex < markedWords.length - 1) {
                  setCurrentWordIndex(currentWordIndex + 1);
                  setShowDefinition(false);
                } else {
                  onComplete();
                }
              }}
              className={`p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${
                currentWordIndex === markedWords.length - 1 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-white hover:bg-gray-100 text-gray-700'
              }`}
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}