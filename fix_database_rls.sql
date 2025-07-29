-- Fix RLS policies to allow user creation
-- Run this in your Supabase SQL editor

-- First, disable RLS temporarily to allow user creation
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "users_select" ON users;
DROP POLICY IF EXISTS "users_insert" ON users;
DROP POLICY IF EXISTS "users_update" ON users;
DROP POLICY IF EXISTS "users_delete" ON users;
DROP POLICY IF EXISTS "users_insert_authenticated" ON users;

-- Create new policies that work with Clerk authentication
CREATE POLICY "users_select" ON users
  FOR SELECT USING (true);

CREATE POLICY "users_insert" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "users_update" ON users
  FOR UPDATE USING (true);

CREATE POLICY "users_delete" ON users
  FOR DELETE USING (true);

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY; 