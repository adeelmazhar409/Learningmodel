-- NeuroPath Migration 004
-- Roadmaps and Tasks

CREATE TABLE IF NOT EXISTS roadmaps (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject         TEXT        NOT NULL,
  test_date       DATE        NOT NULL,
  days_until_test INTEGER     NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own roadmaps"
  ON roadmaps FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS roadmaps_user_id_idx ON roadmaps (user_id);

-- ── Roadmap Tasks ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS roadmap_tasks (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id   UUID        NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  user_id      UUID        NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  day          DATE        NOT NULL,
  description  TEXT        NOT NULL,
  method       TEXT        NOT NULL,   -- "flashcards", "practice", "visual", "teach_back"
  duration_min INTEGER     NOT NULL DEFAULT 15,
  completed    BOOLEAN     NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  "order"      INTEGER     NOT NULL DEFAULT 1
);

ALTER TABLE roadmap_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tasks"
  ON roadmap_tasks FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS rt_roadmap_id_idx ON roadmap_tasks (roadmap_id);
CREATE INDEX IF NOT EXISTS rt_user_day_idx   ON roadmap_tasks (user_id, day);
