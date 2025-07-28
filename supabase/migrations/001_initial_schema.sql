-- Create users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    target_score INTEGER NOT NULL DEFAULT 1600,
    test_date DATE NOT NULL,
    current_score INTEGER NOT NULL DEFAULT 0,
    streak_days INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('math', 'reading', 'writing')),
    difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer INTEGER NOT NULL,
    explanation TEXT NOT NULL,
    concept VARCHAR(100) NOT NULL,
    sub_concept VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    concept VARCHAR(100) NOT NULL,
    mastery_level INTEGER NOT NULL DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
    last_practiced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    correct_answers INTEGER NOT NULL DEFAULT 0,
    total_attempts INTEGER NOT NULL DEFAULT 0,
    needs_review BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, concept)
);

-- Create study_sessions table
CREATE TABLE study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    questions_attempted INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    concepts_studied TEXT[] NOT NULL DEFAULT '{}',
    focus_area VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vocabulary_words table
CREATE TABLE vocabulary_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word VARCHAR(100) UNIQUE NOT NULL,
    definition TEXT NOT NULL,
    difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    category VARCHAR(100) NOT NULL,
    examples TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_vocabulary table
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

-- Create indexes for better performance
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_concept ON user_progress(concept);
CREATE INDEX idx_user_progress_mastery_level ON user_progress(mastery_level);
CREATE INDEX idx_questions_type ON questions(type);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_concept ON questions(concept);
CREATE INDEX idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX idx_study_sessions_start_time ON study_sessions(start_time);
CREATE INDEX idx_user_vocabulary_user_id ON user_vocabulary(user_id);
CREATE INDEX idx_user_vocabulary_next_review ON user_vocabulary(next_review);
CREATE INDEX idx_vocabulary_words_difficulty ON vocabulary_words(difficulty);
CREATE INDEX idx_vocabulary_words_category ON vocabulary_words(category);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_sessions_updated_at BEFORE UPDATE ON study_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vocabulary_words_updated_at BEFORE UPDATE ON vocabulary_words
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_vocabulary_updated_at BEFORE UPDATE ON user_vocabulary
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vocabulary ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own data" ON users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own progress" ON user_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON study_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own vocabulary" ON user_vocabulary
    FOR ALL USING (auth.uid() = user_id);

-- Questions and vocabulary_words are public (read-only for authenticated users)
CREATE POLICY "Authenticated users can view questions" ON questions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view vocabulary words" ON vocabulary_words
    FOR SELECT USING (auth.role() = 'authenticated');