import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { User } from '@/types';

export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('Fetching profile for user:', userId);

  try {
    // Check if user profile exists
    let { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    console.log('Profile lookup result:', { profile, error: profileError });

    // If profile doesn't exist, create it
    if (profileError && profileError.code === 'PGRST116') {
      console.log('Profile not found, creating new profile...');
      
      const user = await clerkClient.users.getUser(userId);
      if (!user) {
        throw new Error('Clerk user not found.');
      }
      
      const newUser = {
        id: userId,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        target_score: 1400,
        test_date: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
        current_score: 0,
        streak_days: 0,
      };

      console.log('Creating new user profile:', newUser);

      const { data: createdProfile, error: createError } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        throw createError;
      }
      
      console.log('Profile created successfully:', createdProfile);
      profile = createdProfile;
    } else if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching or creating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

  try {
    const body = await request.json();
    const { name, targetScore, testDate, currentScore } = body;

    // Validate input
    if (!name || !targetScore || !testDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from('users')
      .update({
        name,
        target_score: targetScore,
        test_date: testDate,
        current_score: currentScore,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}