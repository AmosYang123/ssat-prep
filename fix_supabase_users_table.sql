-- Fix the users table to work with Clerk user IDs
-- Run this in your Supabase SQL editor

-- First, drop ALL related tables that reference users
DROP TABLE IF EXISTS user_vocabulary CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS study_sessions CASCADE;
DROP TABLE IF EXISTS vocabulary_words CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create the users table with TEXT id instead of UUID
CREATE TABLE users (
  id TEXT PRIMARY KEY, -- Changed from UUID to TEXT to accept Clerk user IDs
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  target_score INTEGER DEFAULT 1400,
  test_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '3 months'),
  current_score INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table with TEXT user_id
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  concept TEXT NOT NULL,
  mastery_level INTEGER NOT NULL DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
  last_practiced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_attempts INTEGER NOT NULL DEFAULT 0,
  needs_review BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, concept)
);

-- Create study_sessions table with TEXT user_id
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  questions_attempted INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  concepts_studied TEXT[] DEFAULT '{}',
  focus_area TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vocabulary_words table (unchanged)
CREATE TABLE vocabulary_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL UNIQUE,
  definition TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category TEXT,
  examples TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_vocabulary table with TEXT user_id
CREATE TABLE user_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  mastery_level INTEGER NOT NULL DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
  last_reviewed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  correct_count INTEGER NOT NULL DEFAULT 0,
  incorrect_count INTEGER NOT NULL DEFAULT 0,
  next_review TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, word_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vocabulary ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id);
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id);
CREATE POLICY "Allow all operations" ON users
  FOR ALL USING (true);

-- Create policies for user_progress table
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Create policies for study_sessions table
CREATE POLICY "Users can view own sessions" ON study_sessions
  FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own sessions" ON study_sessions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own sessions" ON study_sessions
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Create policies for vocabulary_words table (read-only for all)
CREATE POLICY "Anyone can view vocabulary words" ON vocabulary_words
  FOR SELECT USING (true);

-- Create policies for user_vocabulary table
CREATE POLICY "Users can view own vocabulary" ON user_vocabulary
  FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own vocabulary" ON user_vocabulary
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own vocabulary" ON user_vocabulary
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_concept ON user_progress(concept);
CREATE INDEX idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX idx_user_vocabulary_user_id ON user_vocabulary(user_id);
CREATE INDEX idx_user_vocabulary_word_id ON user_vocabulary(word_id);
CREATE INDEX idx_vocabulary_words_word ON vocabulary_words(word); 