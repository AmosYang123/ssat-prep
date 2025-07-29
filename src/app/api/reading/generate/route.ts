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

// Pre-generated passages for instant response (fallback) - UPDATED WITH LONGER PASSAGES
const preGeneratedPassages = [
  `The Renaissance period marked a profound transformation in European art and culture, spanning roughly from the 14th to the 17th century. This era witnessed the emergence of groundbreaking artistic techniques, including linear perspective and chiaroscuro, which revolutionized how artists represented three-dimensional space and light on two-dimensional surfaces. The cultural movement was characterized by a renewed interest in classical antiquity, leading to the rediscovery of ancient Greek and Roman texts and artistic principles.

  Artists like Leonardo da Vinci and Michelangelo exemplified the Renaissance ideal of the "universal man," combining artistic talent with scientific inquiry and philosophical depth. This period also saw the development of humanism, which emphasized the value and agency of human beings, individually and collectively. The Renaissance was not merely an artistic movement but a comprehensive cultural revolution that affected every aspect of society, from education and politics to science and religion.

  The proliferation of printing technology during this period facilitated the spread of knowledge and ideas across Europe, contributing to the intellectual ferment that characterized the era. Universities and academies flourished, becoming centers of learning and debate where scholars could exchange ideas freely. This intellectual climate fostered innovations in various fields, from astronomy and mathematics to medicine and engineering, laying the groundwork for the scientific revolution that would follow.`,

  `Quantum mechanics represents one of the most revolutionary developments in modern physics, fundamentally altering our understanding of the universe at its most fundamental level. The theory introduces concepts that challenge our everyday intuition, such as wave-particle duality, where particles can exhibit both wave-like and particle-like properties depending on how they are observed. This fundamental uncertainty lies at the heart of quantum theory and has profound implications for our understanding of reality.

  The uncertainty principle, formulated by Werner Heisenberg, states that it is impossible to simultaneously know both the position and momentum of a particle with absolute precision. This principle has profound implications for our understanding of reality, suggesting that at the quantum level, the universe operates according to probabilistic rather than deterministic laws. These discoveries have led to technological innovations ranging from lasers and transistors to quantum computers and medical imaging devices.

  Quantum entanglement, another remarkable feature of quantum mechanics, allows particles to become correlated in ways that seem to defy classical physics. When two particles become entangled, measuring the state of one particle instantaneously determines the state of the other, regardless of the distance between them. This phenomenon, which Einstein famously referred to as "spooky action at a distance," has been experimentally verified and forms the basis for quantum computing and quantum cryptography.`,

  `Marine biology encompasses the scientific study of organisms that inhabit the world's oceans and other saltwater environments. This diverse field investigates everything from microscopic plankton to the largest creatures on Earth, including blue whales that can reach lengths of over 100 feet. Marine biologists study not only individual species but also complex ecosystems and the intricate relationships between marine organisms and their environment. The field has become increasingly important as human activities impact ocean health through pollution, overfishing, and climate change.

  Coral reefs, often called the "rainforests of the sea," serve as crucial habitats for thousands of species while also protecting coastal communities from storms and erosion. Understanding marine ecosystems is essential for developing sustainable practices that preserve these vital resources for future generations. The study of marine biology also provides insights into fundamental biological processes, as many marine organisms have evolved unique adaptations to survive in challenging environments.

  Recent advances in technology have revolutionized marine biology research, enabling scientists to explore previously inaccessible depths and study marine life in unprecedented detail. Remotely operated vehicles, autonomous underwater vehicles, and advanced imaging systems have revealed the incredible diversity of life in the deep sea, including species that have evolved to thrive in complete darkness and extreme pressure conditions. These discoveries continue to expand our understanding of life's adaptability and the interconnectedness of marine ecosystems.`,

  `The Industrial Revolution, beginning in the late 18th century, fundamentally transformed human society through unprecedented technological and economic changes. This period saw the transition from manual labor and hand production methods to machine-based manufacturing, dramatically increasing productivity and efficiency across various industries. The development of steam power, mechanized textile production, and improved iron-making techniques created new economic opportunities while also presenting significant social challenges.

  Urbanization accelerated as people moved from rural areas to cities in search of employment, leading to the growth of industrial centers and the emergence of new social classes. This transformation also sparked important discussions about labor rights, working conditions, and the role of government in regulating industrial development. The Industrial Revolution was not a single event but a complex process that unfolded over several decades, affecting different regions and industries at different times.

  The social and economic changes brought about by industrialization had far-reaching consequences for society. The rise of factory work created new forms of employment but also led to concerns about working conditions and child labor. The development of transportation networks, including canals and railways, facilitated the movement of goods and people, contributing to the growth of national markets and international trade. These changes laid the foundation for the modern industrialized world and continue to influence economic and social structures today.`,

  `Cognitive psychology explores the mental processes that underlie human behavior, including attention, memory, language, problem-solving, and decision-making. This field investigates how people acquire, process, store, and retrieve information, providing insights into both normal cognitive functioning and various cognitive disorders. Research in cognitive psychology has revealed that human memory is not a passive storage system but an active, reconstructive process influenced by various factors such as attention, emotion, and context.

  Studies have shown that our cognitive processes are subject to various biases and limitations, which can affect everything from eyewitness testimony to medical diagnosis. Understanding these cognitive mechanisms has important applications in education, healthcare, and artificial intelligence development. The field has also contributed to our understanding of how people learn and how educational practices can be optimized to enhance learning outcomes.

  Recent advances in neuroscience have provided new insights into the biological basis of cognitive processes, revealing how different brain regions contribute to various cognitive functions. This interdisciplinary approach, combining psychological research with neuroimaging techniques, has deepened our understanding of the relationship between brain structure and cognitive function. These findings have important implications for treating cognitive disorders and developing interventions to enhance cognitive performance.`,

  `Climate change represents one of the most pressing global challenges of the 21st century, with far-reaching implications for ecosystems, human societies, and economic systems worldwide. The scientific consensus indicates that human activities, particularly the burning of fossil fuels and deforestation, have significantly contributed to the observed warming of Earth's climate system. The impacts of climate change are already evident in rising global temperatures, melting polar ice caps, and increasingly frequent extreme weather events.

  These changes affect agricultural productivity, water availability, and human health, while also threatening biodiversity and ecosystem stability. Addressing climate change requires coordinated international efforts to reduce greenhouse gas emissions, develop renewable energy sources, and implement adaptation strategies to cope with unavoidable changes. The transition to a low-carbon economy presents both challenges and opportunities for innovation and economic development.

  The scientific understanding of climate change has advanced significantly in recent decades, with improved models and observational data providing more accurate predictions of future climate scenarios. This knowledge has informed international climate agreements and national policies aimed at reducing emissions and promoting sustainable development. However, the complexity of the climate system and the long-term nature of climate change continue to present challenges for policy-making and public understanding of the issue.`
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
    
    // Updated prompt for longer passages (300-400 words)
    const prompt = `Generate a 300-400 word SSAT upper-level reading passage about ${finalTopic}. 

Requirements:
- Exactly 3-4 paragraphs
- Mix of standard and advanced vocabulary
- Formal, educational tone
- No titles or introductions
- Start directly with the first word of the passage
- Make it completely different from any previous passages
- Include complex sentence structures and varied vocabulary
- Ensure the passage is substantial enough for comprehensive reading practice

Topic: ${finalTopic}`;

    // Generate passage with optimized parameters for longer content
    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500, // Increased for longer passages
      temperature: 0.9, // Higher temperature for more randomness
    });

    let passage = response.choices[0]?.message?.content?.trim();

    // Fallback to pre-generated passage if AI generation fails
    if (!passage || passage.length < 200) {
      const randomIndex = Math.floor(Math.random() * preGeneratedPassages.length);
      passage = preGeneratedPassages[randomIndex];
    } else {
      // Clean up the generated passage
      const paragraphs = passage.split('\n\n');
      if (paragraphs.length > 1 && paragraphs[0].length < 200 && !paragraphs[0].includes('.')) {
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