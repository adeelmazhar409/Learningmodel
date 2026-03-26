-- NeuroPath Migration 003
-- Recordings and Study Packs

CREATE TABLE IF NOT EXISTS recordings (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         TEXT        NOT NULL,
  duration_s    INTEGER,
  file_url      TEXT        NOT NULL,
  transcript    TEXT,
  transcript_id TEXT,                  -- AssemblyAI transcript ID
  status        TEXT        NOT NULL DEFAULT 'uploading',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recordings"
  ON recordings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recordings"
  ON recordings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recordings"
  ON recordings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS recordings_user_id_idx     ON recordings (user_id);
CREATE INDEX IF NOT EXISTS recordings_transcript_idx  ON recordings (transcript_id);

-- ── Study Packs ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS study_packs (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recording_id     UUID        NOT NULL REFERENCES recordings(id) ON DELETE CASCADE,
  title            TEXT        NOT NULL,
  summary_short    TEXT        NOT NULL DEFAULT '',
  summary_bullets  JSONB       NOT NULL DEFAULT '[]',
  flashcards       JSONB       NOT NULL DEFAULT '[]',
  quiz             JSONB       NOT NULL DEFAULT '[]',
  teach_back       TEXT        NOT NULL DEFAULT '',
  flashcard_count  INTEGER     NOT NULL DEFAULT 0,
  quiz_count       INTEGER     NOT NULL DEFAULT 0,
  profile_snapshot JSONB,
  status           TEXT        NOT NULL DEFAULT 'generating',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE study_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own study packs"
  ON study_packs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study packs"
  ON study_packs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study packs"
  ON study_packs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS sp_user_id_idx      ON study_packs (user_id);
CREATE INDEX IF NOT EXISTS sp_recording_id_idx ON study_packs (recording_id);
