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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');
    const concept = searchParams.get('concept');
    const limit = searchParams.get('limit') || '10';

    let query = supabase
      .from('questions')
      .select('*');

    if (type) {
      query = query.eq('type', type);
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    if (concept) {
      query = query.eq('concept', concept);
    }

    const { data: questions, error: questionsError } = await query
      .limit(parseInt(limit))
      .order('created_at', { ascending: false });

    if (questionsError) {
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}