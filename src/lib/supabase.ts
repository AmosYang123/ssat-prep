import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string // Changed from UUID to string to accept Clerk user IDs
          email: string
          name: string
          target_score: number
          test_date: string
          current_score: number
          streak_days: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string // Required field for Clerk user ID
          email: string
          name: string
          target_score?: number
          test_date?: string
          current_score?: number
          streak_days?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          target_score?: number
          test_date?: string
          current_score?: number
          streak_days?: number
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          type: 'math' | 'reading' | 'writing'
          difficulty: 'easy' | 'medium' | 'hard'
          question: string
          options: string[]
          correct_answer: number
          explanation: string
          concept: string
          sub_concept: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'math' | 'reading' | 'writing'
          difficulty: 'easy' | 'medium' | 'hard'
          question: string
          options: string[]
          correct_answer: number
          explanation: string
          concept: string
          sub_concept: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'math' | 'reading' | 'writing'
          difficulty?: 'easy' | 'medium' | 'hard'
          question?: string
          options?: string[]
          correct_answer?: number
          explanation?: string
          concept?: string
          sub_concept?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          concept: string
          mastery_level: number
          last_practiced: string
          correct_answers: number
          total_attempts: number
          needs_review: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          concept: string
          mastery_level: number
          last_practiced: string
          correct_answers: number
          total_attempts: number
          needs_review: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          concept?: string
          mastery_level?: number
          last_practiced?: string
          correct_answers?: number
          total_attempts?: number
          needs_review?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          start_time: string
          end_time: string | null
          questions_attempted: number
          correct_answers: number
          concepts_studied: string[]
          focus_area: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          start_time: string
          end_time?: string | null
          questions_attempted: number
          correct_answers: number
          concepts_studied: string[]
          focus_area: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          start_time?: string
          end_time?: string | null
          questions_attempted?: number
          correct_answers?: number
          concepts_studied?: string[]
          focus_area?: string
          created_at?: string
          updated_at?: string
        }
      }
      vocabulary_words: {
        Row: {
          id: string
          word: string
          definition: string
          difficulty: 'easy' | 'medium' | 'hard'
          category: string
          examples: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          word: string
          definition: string
          difficulty: 'easy' | 'medium' | 'hard'
          category: string
          examples: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          word?: string
          definition?: string
          difficulty?: 'easy' | 'medium' | 'hard'
          category?: string
          examples?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      user_vocabulary: {
        Row: {
          id: string
          user_id: string
          word_id: string
          mastery_level: number
          last_reviewed: string
          correct_count: number
          incorrect_count: number
          next_review: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          word_id: string
          mastery_level: number
          last_reviewed: string
          correct_count: number
          incorrect_count: number
          next_review: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          word_id?: string
          mastery_level?: number
          last_reviewed?: string
          correct_count?: number
          incorrect_count?: number
          next_review?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Question = Database['public']['Tables']['questions']['Row']
export type UserProgress = Database['public']['Tables']['user_progress']['Row']
export type StudySession = Database['public']['Tables']['study_sessions']['Row']
export type VocabularyWord = Database['public']['Tables']['vocabulary_words']['Row']
export type UserVocabulary = Database['public']['Tables']['user_vocabulary']['Row']