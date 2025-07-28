import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import Groq from 'groq-sdk';

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

if (!groq) {
  console.error("\n\n\nCRITICAL ERROR: The GROQ_API_KEY environment variable is missing or invalid.");
  console.error("Please ensure the .env.local file exists and contains the correct Groq API key.\n\n\n");
}

// Cache for generated passages
const passageCache = new Map<string, any>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

// Pre-defined topic categories for better variety and faster generation
const topicCategories = [
  'Ancient Civilizations', 'Renaissance Art', 'Quantum Physics', 'Marine Biology',
  'Classical Literature', 'Modern Architecture', 'Space Exploration', 'Environmental Science',
  'Medieval History', 'Digital Technology', 'Human Psychology', 'Economic Theory',
  'Philosophical Concepts', 'Medical Advances', 'Cultural Anthropology', 'Astronomy',
  'Political Science', 'Chemical Engineering', 'Linguistics', 'Climate Science'
];

// Pre-generated passages for instant response (fallback)
const preGeneratedPassages = [
  `The Renaissance period marked a profound transformation in European art and culture, spanning roughly from the 14th to the 17th century. This era witnessed the emergence of groundbreaking artistic techniques, including linear perspective and chiaroscuro, which revolutionized how artists represented three-dimensional space and light on two-dimensional surfaces.

  The cultural movement was characterized by a renewed interest in classical antiquity, leading to the rediscovery of ancient Greek and Roman texts and artistic principles. Artists like Leonardo da Vinci and Michelangelo exemplified the Renaissance ideal of the "universal man," combining artistic talent with scientific inquiry and philosophical depth. This period also saw the development of humanism, which emphasized the value and agency of human beings, individually and collectively.`,

  `Quantum mechanics represents one of the most revolutionary developments in modern physics, fundamentally altering our understanding of the universe at its most fundamental level. The theory introduces concepts that challenge our everyday intuition, such as wave-particle duality, where particles can exhibit both wave-like and particle-like properties depending on how they are observed.

  The uncertainty principle, formulated by Werner Heisenberg, states that it is impossible to simultaneously know both the position and momentum of a particle with absolute precision. This principle has profound implications for our understanding of reality, suggesting that at the quantum level, the universe operates according to probabilistic rather than deterministic laws. These discoveries have led to technological innovations ranging from lasers and transistors to quantum computers and medical imaging devices.`,

  `Marine biology encompasses the scientific study of organisms that inhabit the world's oceans and other saltwater environments. This diverse field investigates everything from microscopic plankton to the largest creatures on Earth, including blue whales that can reach lengths of over 100 feet. Marine biologists study not only individual species but also complex ecosystems and the intricate relationships between marine organisms and their environment.

  The field has become increasingly important as human activities impact ocean health through pollution, overfishing, and climate change. Coral reefs, often called the "rainforests of the sea," serve as crucial habitats for thousands of species while also protecting coastal communities from storms and erosion. Understanding marine ecosystems is essential for developing sustainable practices that preserve these vital resources for future generations.`,

  `The Industrial Revolution, beginning in the late 18th century, fundamentally transformed human society through unprecedented technological and economic changes. This period saw the transition from manual labor and hand production methods to machine-based manufacturing, dramatically increasing productivity and efficiency across various industries.

  The development of steam power, mechanized textile production, and improved iron-making techniques created new economic opportunities while also presenting significant social challenges. Urbanization accelerated as people moved from rural areas to cities in search of employment, leading to the growth of industrial centers and the emergence of new social classes. This transformation also sparked important discussions about labor rights, working conditions, and the role of government in regulating industrial development.`,

  `Cognitive psychology explores the mental processes that underlie human behavior, including attention, memory, language, problem-solving, and decision-making. This field investigates how people acquire, process, store, and retrieve information, providing insights into both normal cognitive functioning and various cognitive disorders.

  Research in cognitive psychology has revealed that human memory is not a passive storage system but an active, reconstructive process influenced by various factors such as attention, emotion, and context. Studies have shown that our cognitive processes are subject to various biases and limitations, which can affect everything from eyewitness testimony to medical diagnosis. Understanding these cognitive mechanisms has important applications in education, healthcare, and artificial intelligence development.`,

  `Climate change represents one of the most pressing global challenges of the 21st century, with far-reaching implications for ecosystems, human societies, and economic systems worldwide. The scientific consensus indicates that human activities, particularly the burning of fossil fuels and deforestation, have significantly contributed to the observed warming of Earth's climate system.

  The impacts of climate change are already evident in rising global temperatures, melting polar ice caps, and increasingly frequent extreme weather events. These changes affect agricultural productivity, water availability, and human health, while also threatening biodiversity and ecosystem stability. Addressing climate change requires coordinated international efforts to reduce greenhouse gas emissions, develop renewable energy sources, and implement adaptation strategies to cope with unavoidable changes.`
];

export async function POST(request: NextRequest) {
  if (!groq) {
    return NextResponse.json(
      { error: 'Groq API key is not configured on the server. Please check the server logs.' },
      { status: 500 }
    );
  }

  try {
    const { userId } = await getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate a unique cache key that includes timestamp to ensure randomness
    const timestamp = Date.now();
    const cacheKey = `passage_${userId}_${timestamp}`;

    // Select a random topic category for variety
    const randomIndex = Math.floor(Math.random() * topicCategories.length);
    const selectedTopic = topicCategories[randomIndex];
    
    // Add additional randomness by sometimes using a completely random topic
    const useRandomTopic = Math.random() < 0.3; // 30% chance
    const finalTopic = useRandomTopic ? 
      `a random academic topic from ${['history', 'science', 'literature', 'art', 'technology', 'philosophy', 'economics', 'psychology'][Math.floor(Math.random() * 8)]}` : 
      selectedTopic;
    
    // Optimized prompt for faster generation
    const prompt = `Generate a 150-200 word SSAT upper-level reading passage about ${finalTopic}. 

Requirements:
- Exactly 2-3 paragraphs
- Mix of standard and advanced vocabulary
- Formal, educational tone
- No titles or introductions
- Start directly with the first word of the passage
- Make it completely different from any previous passages

Topic: ${finalTopic}`;

    // Generate passage with optimized parameters
    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300, // Reduced for faster generation
      temperature: 0.9, // Higher temperature for more randomness
    });

    let passage = response.choices[0]?.message?.content?.trim();

    // Fallback to pre-generated passage if AI generation fails
    if (!passage || passage.length < 100) {
      const randomIndex = Math.floor(Math.random() * preGeneratedPassages.length);
      passage = preGeneratedPassages[randomIndex];
    } else {
      // Clean up the generated passage
      const paragraphs = passage.split('\n\n');
      if (paragraphs.length > 1 && paragraphs[0].length < 150 && !paragraphs[0].includes('.')) {
        passage = paragraphs.slice(1).join('\n\n');
      }
    }

    if (!passage) {
      throw new Error('Failed to generate a passage from Groq.');
    }
    
    // Cache the result with a shorter TTL for more variety
    passageCache.set(cacheKey, { passage, timestamp: Date.now() });
    
    // Clean up old cache entries to prevent memory bloat
    const now = Date.now();
    Array.from(passageCache.entries()).forEach(([key, value]) => {
      if (now - value.timestamp > CACHE_TTL) {
        passageCache.delete(key);
      }
    });
    
    return NextResponse.json({ passage });
  } catch (error) {
    console.error('[API ERROR] Error generating reading passage with Groq:', error);
    
    // Return a pre-generated passage as fallback
    const randomIndex = Math.floor(Math.random() * preGeneratedPassages.length);
    return NextResponse.json({ passage: preGeneratedPassages[randomIndex] });
  }
} 