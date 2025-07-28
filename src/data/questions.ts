import { Question } from '@/types';

export const questionBank: Question[] = [
  // Math Questions - Algebra
  {
    id: 'math-alg-001',
    type: 'math',
    difficulty: 'easy',
    concept: 'Algebra',
    subConcept: 'Linear Equations',
    question: 'If 3x + 7 = 22, what is the value of x?',
    options: ['3', '5', '7', '9'],
    correctAnswer: 1,
    explanation: 'Subtract 7 from both sides: 3x = 15, then divide by 3: x = 5'
  },
  {
    id: 'math-alg-002',
    type: 'math',
    difficulty: 'easy',
    concept: 'Algebra',
    subConcept: 'Linear Equations',
    question: 'If 2x - 5 = 13, what is the value of x?',
    options: ['6', '8', '9', '11'],
    correctAnswer: 2,
    explanation: 'Add 5 to both sides: 2x = 18, then divide by 2: x = 9'
  },
  {
    id: 'math-alg-003',
    type: 'math',
    difficulty: 'medium',
    concept: 'Algebra',
    subConcept: 'Quadratic Equations',
    question: 'What are the solutions to x² - 5x + 6 = 0?',
    options: ['x = 2, x = 3', 'x = 1, x = 6', 'x = -2, x = -3', 'x = 2, x = -3'],
    correctAnswer: 0,
    explanation: 'Factor: (x - 2)(x - 3) = 0, so x = 2 or x = 3'
  },
  {
    id: 'math-alg-004',
    type: 'math',
    difficulty: 'hard',
    concept: 'Algebra',
    subConcept: 'Systems of Equations',
    question: 'If 2x + 3y = 12 and x - y = 1, what is the value of x?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 1,
    explanation: 'From the second equation: x = y + 1. Substitute into the first: 2(y + 1) + 3y = 12, solving gives y = 2, so x = 3'
  },

  // Math Questions - Geometry
  {
    id: 'math-geo-001',
    type: 'math',
    difficulty: 'easy',
    concept: 'Geometry',
    subConcept: 'Area',
    question: 'What is the area of a rectangle with length 8 and width 5?',
    options: ['13', '26', '40', '45'],
    correctAnswer: 2,
    explanation: 'Area of rectangle = length × width = 8 × 5 = 40'
  },
  {
    id: 'math-geo-002',
    type: 'math',
    difficulty: 'medium',
    concept: 'Geometry',
    subConcept: 'Circle Area',
    question: 'What is the area of a circle with radius 6?',
    options: ['12π', '36π', '72π', '144π'],
    correctAnswer: 1,
    explanation: 'Area of circle = πr² = π(6)² = 36π'
  },
  {
    id: 'math-geo-003',
    type: 'math',
    difficulty: 'hard',
    concept: 'Geometry',
    subConcept: 'Pythagorean Theorem',
    question: 'In a right triangle, if one leg is 5 and the hypotenuse is 13, what is the length of the other leg?',
    options: ['8', '12', '15', '18'],
    correctAnswer: 1,
    explanation: 'Using a² + b² = c²: 5² + b² = 13², so 25 + b² = 169, therefore b² = 144, and b = 12'
  },

  // Math Questions - Statistics
  {
    id: 'math-stat-001',
    type: 'math',
    difficulty: 'easy',
    concept: 'Statistics',
    subConcept: 'Mean',
    question: 'What is the mean of 3, 7, 11, and 15?',
    options: ['8', '9', '10', '11'],
    correctAnswer: 1,
    explanation: 'Mean = (3 + 7 + 11 + 15) ÷ 4 = 36 ÷ 4 = 9'
  },
  {
    id: 'math-stat-002',
    type: 'math',
    difficulty: 'medium',
    concept: 'Statistics',
    subConcept: 'Probability',
    question: 'If you roll a fair 6-sided die, what is the probability of getting an even number?',
    options: ['1/6', '1/3', '1/2', '2/3'],
    correctAnswer: 2,
    explanation: 'Even numbers on a die are 2, 4, 6. That\'s 3 out of 6 outcomes, so probability = 3/6 = 1/2'
  },

  // Reading Questions
  {
    id: 'read-comp-001',
    type: 'reading',
    difficulty: 'easy',
    concept: 'Reading Comprehension',
    subConcept: 'Main Idea',
    question: 'Based on the passage, the author\'s main purpose is to:',
    options: ['Argue for a specific viewpoint', 'Inform readers about a topic', 'Entertain with a story', 'Persuade readers to take action'],
    correctAnswer: 1,
    explanation: 'The passage primarily provides information about the topic without taking a strong stance or trying to persuade'
  },
  {
    id: 'read-comp-002',
    type: 'reading',
    difficulty: 'medium',
    concept: 'Reading Comprehension',
    subConcept: 'Inference',
    question: 'The passage suggests that the character\'s decision was primarily motivated by:',
    options: ['Fear of failure', 'Desire for recognition', 'Concern for others', 'Personal ambition'],
    correctAnswer: 2,
    explanation: 'The text provides several clues indicating the character\'s actions were driven by concern for others\' wellbeing'
  },
  {
    id: 'read-comp-003',
    type: 'reading',
    difficulty: 'hard',
    concept: 'Reading Comprehension',
    subConcept: 'Tone',
    question: 'The tone of the passage can best be described as:',
    options: ['Optimistic and encouraging', 'Skeptical and questioning', 'Neutral and informative', 'Pessimistic and warning'],
    correctAnswer: 1,
    explanation: 'The author uses questioning language and expresses doubt about the claims being discussed'
  },

  // Writing Questions
  {
    id: 'write-gram-001',
    type: 'writing',
    difficulty: 'easy',
    concept: 'Grammar',
    subConcept: 'Subject-Verb Agreement',
    question: 'Each of the students _____ completed their assignment.',
    options: ['have', 'has', 'having', 'had'],
    correctAnswer: 1,
    explanation: '"Each" is singular, so it takes the singular verb "has"'
  },
  {
    id: 'write-gram-002',
    type: 'writing',
    difficulty: 'medium',
    concept: 'Grammar',
    subConcept: 'Pronoun Usage',
    question: 'The teacher gave the award to my friend and _____.',
    options: ['I', 'me', 'myself', 'mine'],
    correctAnswer: 1,
    explanation: 'Use "me" as the object of the preposition "to"'
  },
  {
    id: 'write-punc-001',
    type: 'writing',
    difficulty: 'easy',
    concept: 'Writing',
    subConcept: 'Punctuation',
    question: 'Which sentence is punctuated correctly?',
    options: [
      'The team worked hard, and they succeeded.',
      'The team worked hard and, they succeeded.',
      'The team worked hard and they succeeded.',
      'The team worked hard; and they succeeded.'
    ],
    correctAnswer: 0,
    explanation: 'When joining two independent clauses with a coordinating conjunction, use a comma before the conjunction'
  },
  {
    id: 'write-style-001',
    type: 'writing',
    difficulty: 'hard',
    concept: 'Writing',
    subConcept: 'Style',
    question: 'Which choice maintains the most formal tone?',
    options: [
      'The research shows pretty clearly that...',
      'The research demonstrates conclusively that...',
      'The research kinda proves that...',
      'The research totally shows that...'
    ],
    correctAnswer: 1,
    explanation: 'Formal academic writing requires precise, professional language like "demonstrates conclusively"'
  },

  // Advanced Math Questions
  {
    id: 'math-adv-001',
    type: 'math',
    difficulty: 'hard',
    concept: 'Trigonometry',
    subConcept: 'Basic Functions',
    question: 'If sin(θ) = 3/5 and θ is in the first quadrant, what is cos(θ)?',
    options: ['3/5', '4/5', '5/3', '5/4'],
    correctAnswer: 1,
    explanation: 'Using the Pythagorean identity: sin²(θ) + cos²(θ) = 1. Since sin(θ) = 3/5, we have (3/5)² + cos²(θ) = 1, so cos²(θ) = 16/25, and cos(θ) = 4/5 (positive in first quadrant)'
  },
  {
    id: 'math-adv-002',
    type: 'math',
    difficulty: 'hard',
    concept: 'Data Analysis',
    subConcept: 'Correlation',
    question: 'A scatter plot shows a correlation coefficient of -0.8. This indicates:',
    options: ['Strong positive correlation', 'Weak positive correlation', 'Strong negative correlation', 'No correlation'],
    correctAnswer: 2,
    explanation: 'A correlation coefficient of -0.8 indicates a strong negative correlation (close to -1)'
  },

  // More Reading Questions
  {
    id: 'read-vocab-001',
    type: 'reading',
    difficulty: 'medium',
    concept: 'Reading Comprehension',
    subConcept: 'Vocabulary in Context',
    question: 'In line 15, "paradigm" most nearly means:',
    options: ['Problem', 'Model', 'Solution', 'Question'],
    correctAnswer: 1,
    explanation: 'In context, "paradigm" refers to a standard example or pattern, which is closest to "model"'
  },
  {
    id: 'read-struct-001',
    type: 'reading',
    difficulty: 'hard',
    concept: 'Reading Comprehension',
    subConcept: 'Structure',
    question: 'The structure of the passage can best be described as:',
    options: [
      'Problem followed by solution',
      'Chronological sequence of events',
      'Comparison of different viewpoints',
      'General statement supported by examples'
    ],
    correctAnswer: 3,
    explanation: 'The passage begins with a general statement and then provides specific examples to support it'
  }
];

export function getQuestionsByType(type: Question['type']): Question[] {
  return questionBank.filter(q => q.type === type);
}

export function getQuestionsByConcept(concept: string): Question[] {
  return questionBank.filter(q => q.concept === concept);
}

export function getQuestionsByDifficulty(difficulty: Question['difficulty']): Question[] {
  return questionBank.filter(q => q.difficulty === difficulty);
}

export function getRandomQuestions(count: number, filters?: {
  type?: Question['type'];
  concept?: string;
  difficulty?: Question['difficulty'];
}): Question[] {
  let filteredQuestions = questionBank;
  
  if (filters?.type) {
    filteredQuestions = filteredQuestions.filter(q => q.type === filters.type);
  }
  
  if (filters?.concept) {
    filteredQuestions = filteredQuestions.filter(q => q.concept === filters.concept);
  }
  
  if (filters?.difficulty) {
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === filters.difficulty);
  }
  
  // Shuffle and return requested count
  const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}