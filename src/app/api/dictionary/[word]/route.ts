import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

interface WordDefinition {
  word: string;
  phonetic: string;
  meanings: {
    partOfSpeech: string;
    definitions: string[];
  }[];
}

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

// Simple in-memory cache for frequently requested words
const definitionCache = new Map<string, any>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function GET(
  request: Request,
  { params }: { params: { word: string } }
) {
  const { searchParams } = new URL(request.url);
  const concise = searchParams.get('concise') === 'true';
  
  const word = params.word;
  if (!word) {
    return NextResponse.json({ error: 'Word parameter is missing' }, { status: 400 });
  }

  // Check cache first
  const cached = definitionCache.get(word);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const isPotentialAcronym = /^[A-Z]{2,5}$/.test(word.toUpperCase());
  const isNumber = /^\d+$/.test(word);

  try {
    // Common words that often fail with dictionary API
    const commonWords: Record<string, WordDefinition> = {
      "a": {
        word: "a",
        phonetic: "/ə/",
        meanings: [{
          partOfSpeech: "article",
          definitions: ["Used before singular nouns to indicate one example of something"]
        }]
      },
      "an": {
        word: "an",
        phonetic: "/ən/",
        meanings: [{
          partOfSpeech: "article",
          definitions: ["Used before words beginning with a vowel sound to indicate one example"]
        }]
      },
      "the": {
        word: "the",
        phonetic: "/ðə/",
        meanings: [{
          partOfSpeech: "article",
          definitions: ["Used before nouns to indicate a specific person, place, or thing"]
        }]
      },
      "is": {
        word: "is",
        phonetic: "/ɪz/",
        meanings: [{
          partOfSpeech: "verb",
          definitions: ["Third person singular present tense of 'be'"]
        }]
      },
      "are": {
        word: "are",
        phonetic: "/ɑr/",
        meanings: [{
          partOfSpeech: "verb",
          definitions: ["Second person singular and plural present tense of 'be'"]
        }]
      },
      "was": {
        word: "was",
        phonetic: "/wəz/",
        meanings: [{
          partOfSpeech: "verb",
          definitions: ["First and third person singular past tense of 'be'"]
        }]
      },
      "were": {
        word: "were",
        phonetic: "/wər/",
        meanings: [{
          partOfSpeech: "verb",
          definitions: ["Second person singular and plural past tense of 'be'"]
        }]
      },
      "be": {
        word: "be",
        phonetic: "/bi/",
        meanings: [{
          partOfSpeech: "verb",
          definitions: ["To exist or occur; to have a specific state or quality"]
        }]
      },
      "been": {
        word: "been",
        phonetic: "/bɪn/",
        meanings: [{
          partOfSpeech: "verb",
          definitions: ["Past participle of 'be'"]
        }]
      },
      "being": {
        word: "being",
        phonetic: "/ˈbiɪŋ/",
        meanings: [{
          partOfSpeech: "verb",
          definitions: ["Present participle of 'be'"]
        }]
      }
    };

    // Check if it's a common word first
    if (commonWords[word]) {
      return NextResponse.json(commonWords[word]);
    }

    // Run dictionary API first, then AI if needed
    const dictionaryResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    let dictionaryDefinition = null;
    
    if (dictionaryResponse.ok) {
      const data = await dictionaryResponse.json();
      const firstResult = data[0];
      if (firstResult) {
        dictionaryDefinition = {
          word: firstResult.word,
          phonetic: firstResult.phonetic || (firstResult.phonetics.find((p: any) => p.text)?.text),
          meanings: firstResult.meanings.map((meaning: any) => ({
            partOfSpeech: meaning.partOfSpeech,
            definitions: meaning.definitions.map((def: any) => def.definition),
          })),
        };
      }
    } else {
      console.log(`Dictionary API failed for "${word}": ${dictionaryResponse.status}`);
    }

    // If dictionary failed, use AI as fallback
    let aiDefinitionContent = null;
    let aiPartOfSpeech = 'Definition';
    
    if (!dictionaryDefinition && groq) {
      const aiResponse = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that provides ${concise ? 'very short and concise' : 'concise, accurate'} definitions for words. For common words like "a", "an", "the", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "can", "must", "shall", provide simple, clear definitions that a student would understand.

For example:
- "a" should be defined as: "Used before singular nouns to indicate one example of something"
- "the" should be defined as: "Used before nouns to indicate a specific person, place, or thing"
- "is" should be defined as: "Third person singular present tense of 'be'"

${concise ? 'IMPORTANT: Provide extremely short definitions (under 50 characters) that still convey the essential meaning. Focus only on the core definition.' : 'Always provide the part of speech first, then pronunciation in parentheses, then a clear, concise definition. Keep definitions under 100 characters when possible.'}`
          },
          {
            role: "user",
            content: `Define the word "${word}" with its part of speech, pronunciation, and a ${concise ? 'very short' : 'clear'} definition. Format: Part of Speech (pronunciation) Definition`
          }
        ],
        model: "llama-3.1-8b-instant",
        max_tokens: concise ? 80 : 120,
        temperature: 0.3,
      });

      const rawDefinition = aiResponse.choices[0]?.message?.content?.trim();
      if (rawDefinition) {
        const typeMatch = rawDefinition.match(/^Type:\s*(Noun|Verb|Adjective|Adverb|Acronym|Number)\s*\n?/);
        if (typeMatch) {
          aiPartOfSpeech = typeMatch[1];
          aiDefinitionContent = rawDefinition.substring(typeMatch[0].length).trim();
        } else {
          // Try to infer part of speech from the word itself
          if (word.endsWith('ly')) {
            aiPartOfSpeech = 'Adverb';
          } else if (word.endsWith('ing') || word.endsWith('ed')) {
            aiPartOfSpeech = 'Verb';
          } else if (word.endsWith('al') || word.endsWith('ous') || word.endsWith('ful') || word.endsWith('less')) {
            aiPartOfSpeech = 'Adjective';
          } else {
            aiPartOfSpeech = 'Noun';
          }
          aiDefinitionContent = rawDefinition;
        }
        
        // Extract pronunciation from the definition if it exists
        let aiPhonetic = '';
        const pronunciationMatch = aiDefinitionContent.match(/\(([^)]+)\)/);
        if (pronunciationMatch) {
          aiPhonetic = pronunciationMatch[1];
          // Remove the pronunciation from the definition text
          aiDefinitionContent = aiDefinitionContent.replace(/\([^)]+\)/, '').trim();
        }
        
        aiDefinitionContent = aiDefinitionContent.replace(/[\*\_`]/g, '');
        
        // Clean up the definition text
        aiDefinitionContent = aiDefinitionContent
          .replace(/^Pronunciation:\s*\n?/i, '')
          .replace(/^Definition:\s*/i, '')
          .replace(/^Here is the definition of\s*["']?[^"']*["']?:\s*/i, '')
          .replace(/^Type:\s*(Noun|Verb|Adjective|Adverb|Acronym|Number)\s*\n?/i, '')
          .replace(/\n\n+/g, '\n')
          .replace(/^\s+|\s+$/g, '') // Remove leading/trailing whitespace
          .trim();
        
        // If we have AI definition, create a proper structure
        if (aiDefinitionContent) {
          aiDefinitionContent = {
            word: word,
            phonetic: aiPhonetic,
            meanings: [{
              partOfSpeech: aiPartOfSpeech,
              definitions: [aiDefinitionContent]
            }]
          };
        }
      }
    }

    // Return early if we have a good dictionary result
    if (dictionaryDefinition && !isPotentialAcronym && !isNumber) {
      const result = {
        word: word,
        phonetic: dictionaryDefinition.phonetic || '',
        meanings: dictionaryDefinition.meanings,
      };
      
      // Cache the result
      definitionCache.set(word, { data: result, timestamp: Date.now() });
      return NextResponse.json(result);
    }

    // Combine results
    const combinedMeanings = [];
    if (dictionaryDefinition) {
      combinedMeanings.push(...dictionaryDefinition.meanings);
    }
    if (aiDefinitionContent && typeof aiDefinitionContent === 'object') {
      // AI definition is already in proper structure
      const finalResponse = {
        word: word,
        phonetic: aiDefinitionContent.phonetic || '',
        meanings: aiDefinitionContent.meanings,
      };
      
      // Cache the result
      definitionCache.set(word, { data: finalResponse, timestamp: Date.now() });
      return NextResponse.json(finalResponse);
    } else if (aiDefinitionContent) {
      // Legacy string format
      combinedMeanings.push({
        partOfSpeech: aiPartOfSpeech,
        definitions: [aiDefinitionContent],
      });
    }

    if (combinedMeanings.length === 0) {
      return NextResponse.json({ error: 'Definition not found' }, { status: 404 });
    }
    
    const finalResponse = {
      word: word,
      phonetic: dictionaryDefinition?.phonetic || '',
      meanings: combinedMeanings,
    };

    // Cache the result
    definitionCache.set(word, { data: finalResponse, timestamp: Date.now() });
    return NextResponse.json(finalResponse);

  } catch (error) {
    console.error(`[API ERROR] Failed to fetch definition for "${word}":`, error);
    return NextResponse.json({ error: 'Failed to fetch definition' }, { status: 500 });
  }
} 