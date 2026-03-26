-- NeuroPath Migration 001
-- Users table — stores student profiles and learning data

CREATE TABLE IF NOT EXISTS users (
  id                UUID        PRIMARY KEY,  -- matches Supabase Auth user ID
  name              TEXT        NOT NULL,
  email             TEXT        NOT NULL UNIQUE,
  grade_level       INTEGER     CHECK (grade_level BETWEEN 5 AND 12),
  learning_profile  JSONB,      -- { flashcards, practice, visual, teach_back }
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security — users can only see their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Index for fast lookups by email
CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);
