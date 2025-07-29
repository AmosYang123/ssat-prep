import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';



export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get user's progress to determine weak areas
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('mastery_level', { ascending: true });

    if (progressError) {
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
    }

    // Determine the next question based on weakest concepts
    let selectedConcept = null;
    let selectedDifficulty = 'medium';

    if (progress && progress.length > 0) {
      // Find the weakest concept
      const weakestConcept = progress[0];
      selectedConcept = weakestConcept.concept;
      
      // Adjust difficulty based on mastery level
      if (weakestConcept.mastery_level < 40) {
        selectedDifficulty = 'easy';
      } else if (weakestConcept.mastery_level < 70) {
        selectedDifficulty = 'medium';
      } else {
        selectedDifficulty = 'hard';
      }
    }

    // Build query for adaptive question selection
    let query = supabase
      .from('questions')
      .select('*');

    if (selectedConcept) {
      query = query.eq('concept', selectedConcept);
    }

    query = query.eq('difficulty', selectedDifficulty);

    // Get a random question by ordering by a random function
    let { data: questions, error: questionsError } = await query
      .limit(10);

    if (questionsError) {
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }

    if (!questions || questions.length === 0) {
      // Fallback: get any question if no specific match found
      const { data: fallbackQuestions, error: fallbackError } = await supabase
        .from('questions')
        .select('*')
        .eq('difficulty', 'medium')
        .limit(10);

      if (fallbackError || !fallbackQuestions || fallbackQuestions.length === 0) {
        return NextResponse.json({ error: 'No questions available' }, { status: 404 });
      }

      questions = fallbackQuestions;
    }

    // Return a random question from the results
    const randomIndex = Math.floor(Math.random() * questions.length);
    const selectedQuestion = questions[randomIndex];

    return NextResponse.json({
      question: selectedQuestion,
      reasoning: {
        concept: selectedConcept,
        difficulty: selectedDifficulty,
        total_available: questions.length
      }
    });
  } catch (error) {
    console.error('Error fetching adaptive question:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}