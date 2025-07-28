-- Fix All 24 Supabase Issues - Final Cleanup
-- Run this in your Supabase SQL editor to resolve ALL remaining warnings

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Allow all operations" ON users;

DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;

DROP POLICY IF EXISTS "Users can view own sessions" ON study_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON study_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON study_sessions;

DROP POLICY IF EXISTS "Anyone can view vocabulary words" ON vocabulary_words;

DROP POLICY IF EXISTS "Users can view own vocabulary" ON user_vocabulary;
DROP POLICY IF EXISTS "Users can insert own vocabulary" ON user_vocabulary;
DROP POLICY IF EXISTS "Users can update own vocabulary" ON user_vocabulary;

-- Create optimized RLS policies with (select auth.uid()) for better performance

-- Users table policies (single policy per operation)
CREATE POLICY "users_select" ON users
  FOR SELECT USING ((select auth.uid())::text = id);

CREATE POLICY "users_insert" ON users
  FOR INSERT WITH CHECK ((select auth.uid())::text = id);

CREATE POLICY "users_update" ON users
  FOR UPDATE USING ((select auth.uid())::text = id);

-- User progress table policies
CREATE POLICY "user_progress_select" ON user_progress
  FOR SELECT USING ((select auth.uid())::text = user_id);

CREATE POLICY "user_progress_insert" ON user_progress
  FOR INSERT WITH CHECK ((select auth.uid())::text = user_id);

CREATE POLICY "user_progress_update" ON user_progress
  FOR UPDATE USING ((select auth.uid())::text = user_id);

-- Study sessions table policies
CREATE POLICY "study_sessions_select" ON study_sessions
  FOR SELECT USING ((select auth.uid())::text = user_id);

CREATE POLICY "study_sessions_insert" ON study_sessions
  FOR INSERT WITH CHECK ((select auth.uid())::text = user_id);

CREATE POLICY "study_sessions_update" ON study_sessions
  FOR UPDATE USING ((select auth.uid())::text = user_id);

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

-- Update table statistics
ANALYZE users;
ANALYZE user_progress;
ANALYZE study_sessions;
ANALYZE vocabulary_words;
ANALYZE user_vocabulary; 