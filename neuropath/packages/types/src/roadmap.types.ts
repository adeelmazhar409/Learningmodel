/* ═══════════════════════════════════════════════════════════
   ROADMAP TYPES
   Shared between apps/web and apps/server
═══════════════════════════════════════════════════════════ */

export interface RoadmapTask {
  id:           string;
  roadmap_id:   string;
  day:          string;             // ISO date "YYYY-MM-DD"
  description:  string;
  method:       import("./diagnostic.types").LearningMethod;
  duration_min: number;
  completed:    boolean;
  completed_at: string | null;
  order:        number;
}

export interface Roadmap {
  id:              string;
  user_id:         string;
  subject:         string;
  test_date:       string;          // ISO date "YYYY-MM-DD"
  days_until_test: number;
  tasks:           RoadmapTask[];
  created_at:      string;
  updated_at:      string;
}

export interface TodaysTasksResponse {
  date:             string;
  tasks:            RoadmapTask[];
  completed_count:  number;
  total_count:      number;
}

/* ── Coaching messages ── */
export interface CoachingMessage {
  id:        string;
  trigger:   "task_complete" | "streak" | "behind" | "exam_soon";
  heading:   string;
  body:      string;
}

/* ── API payloads ── */
export interface GenerateRoadmapPayload {
  subject:   string;
  test_date: string;               // ISO date "YYYY-MM-DD"
}

export interface CompleteTaskResponse {
  task:             RoadmapTask;
  coaching_message: CoachingMessage;
}
