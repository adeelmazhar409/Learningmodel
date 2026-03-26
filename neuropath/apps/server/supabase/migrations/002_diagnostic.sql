-- NeuroPath Migration 002
-- Diagnostic questions and attempts

-- Questions bank — seeded per grade band
CREATE TABLE IF NOT EXISTS diagnostic_questions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_band  TEXT        NOT NULL,   -- "5-6", "7-8", "9-10", "11-12"
  method      TEXT        NOT NULL,   -- "flashcards", "practice", "visual", "teach_back"
  type        TEXT        NOT NULL,   -- "mcq", "short_answer", "visual_label", "teach_back"
  difficulty  TEXT        NOT NULL,   -- "easy", "medium", "hard"
  question    TEXT        NOT NULL,
  choices     JSONB,                  -- array of strings for MCQ
  answer      TEXT        NOT NULL,
  explanation TEXT,
  image_url   TEXT,
  active      BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS dq_grade_band_idx ON diagnostic_questions (grade_band, active);
CREATE INDEX IF NOT EXISTS dq_method_idx     ON diagnostic_questions (method);

-- Student diagnostic attempts
CREATE TABLE IF NOT EXISTS diagnostic_attempts (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject          TEXT        NOT NULL,
  grade_band       TEXT        NOT NULL,
  status           TEXT        NOT NULL DEFAULT 'in_progress', -- "in_progress", "completed"
  answers          JSONB,
  scores           JSONB,      -- { flashcards, practice, visual, teach_back } each with accuracy/speed/retention/final
  primary_method   TEXT,
  secondary_method TEXT,
  started_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at     TIMESTAMPTZ
);

ALTER TABLE diagnostic_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own attempts"
  ON diagnostic_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts"
  ON diagnostic_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attempts"
  ON diagnostic_attempts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS da_user_id_idx ON diagnostic_attempts (user_id);
