-- Complete Fix for Supabase - Fixes UUID Error AND Performance Issues
-- Run this in your Supabase SQL editor to resolve ALL issues

-- First, drop ALL related tables that reference users
DROP TABLE IF EXISTS user_vocabulary CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS study_sessions CASCADE;
DROP TABLE IF EXISTS vocabulary_words CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create the users table with TEXT id instead of UUID (Fixes UUID error)
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

-- Create vocabulary_words table
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

-- Create optimized RLS policies with (select auth.uid()) for better performance

-- Users table policies
CREATE POLICY "users_select" ON users
  FOR SELECT USING ((select auth.uid())::text = id);

CREATE POLICY "users_insert" ON users
  FOR INSERT WITH CHECK ((select auth.uid())::text = id);

CREATE POLICY "users_update" ON users
  FOR UPDATE USING ((select auth.uid())::text = id);

CREATE POLICY "users_delete" ON users
  FOR DELETE USING ((select auth.uid())::text = id);

-- User progress table policies
CREATE POLICY "user_progress_select" ON user_progress
  FOR SELECT USING ((select auth.uid())::text = user_id);

CREATE POLICY "user_progress_insert" ON user_progress
  FOR INSERT WITH CHECK ((select auth.uid())::text = user_id);

CREATE POLICY "user_progress_update" ON user_progress
  FOR UPDATE USING ((select auth.uid())::text = user_id);

CREATE POLICY "user_progress_delete" ON user_progress
  FOR DELETE USING ((select auth.uid())::text = user_id);

-- Study sessions table policies
CREATE POLICY "study_sessions_select" ON study_sessions
  FOR SELECT USING ((select auth.uid())::text = user_id);

CREATE POLICY "study_sessions_insert" ON study_sessions
  FOR INSERT WITH CHECK ((select auth.uid())::text = user_id);

CREATE POLICY "study_sessions_update" ON study_sessions
  FOR UPDATE USING ((select auth.uid())::text = user_id);

CREATE POLICY "study_sessions_delete" ON study_sessions
  FOR DELETE USING ((select auth.uid())::text = user_id);

-- Vocabulary words table (public read access)
CREATE POLICY "vocabulary_words_select" ON vocabulary_words
  FOR SELECT USING (true);

-- User vocabulary table policies
CREATE POLICY "user_vocabulary_select" ON user_vocabulary
  FOR SELECT USING ((select auth.uid())::text = user_id);

CREATE POLICY "user_vocabulary_insert" ON user_vocabulary
  FOR INSERT WITH CHECK ((select auth.uid())::text = user_id);

CREATE POLICY "user_vocabulary_update" ON user_vocabulary
  FOR UPDATE USING ((select auth.uid())::text = user_id);

CREATE POLICY "user_vocabulary_delete" ON user_vocabulary
  FOR DELETE USING ((select auth.uid())::text = user_id);

-- Create optimized indexes for better performance
CREATE INDEX idx_users_id ON users(id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX idx_user_vocabulary_user_id ON user_vocabulary(user_id);

-- Create additional performance indexes
CREATE INDEX idx_user_progress_concept_user ON user_progress(user_id, concept);
CREATE INDEX idx_study_sessions_user_time ON study_sessions(user_id, start_time);
CREATE INDEX idx_user_vocabulary_user_word ON user_vocabulary(user_id, word_id);
CREATE INDEX idx_vocabulary_words_word_lower ON vocabulary_words(LOWER(word));

-- Update table statistics
ANALYZE users;
ANALYZE user_progress;
ANALYZE study_sessions;
ANALYZE vocabulary_words;
ANALYZE user_vocabulary; 