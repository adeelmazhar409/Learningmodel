/* ═══════════════════════════════════════════════════════════
   RECORDING & STUDY PACK TYPES
   Shared between apps/web and apps/server
═══════════════════════════════════════════════════════════ */

export type RecordingStatus =
  | "uploading"
  | "transcribing"
  | "generating"
  | "ready"
  | "failed";

export interface Recording {
  id:          string;
  user_id:     string;
  title:       string;
  duration_s:  number | null;        // seconds
  file_url:    string;
  transcript:  string | null;
  status:      RecordingStatus;
  created_at:  string;
  updated_at:  string;
}

export interface RecordingStatusResponse {
  recording_id: string;
  status:       RecordingStatus;
  progress:     number;              // 0–100 percentage
  message:      string;              // human-readable status message
}

/* ── Flashcard ── */
export interface Flashcard {
  id:         string;
  question:   string;
  answer:     string;
  difficulty: "easy" | "medium" | "hard";
}

/* ── Quiz question ── */
export interface QuizQuestion {
  id:          string;
  question:    string;
  type:        "mcq" | "short_answer";
  choices?:    string[];
  answer:      string;
  explanation: string;
}

/* ── Study pack ── */
export interface StudyPack {
  id:              string;
  user_id:         string;
  recording_id:    string;
  title:           string;

  summary_short:   string;
  summary_bullets: string[];

  flashcards:      Flashcard[];
  quiz:            QuizQuestion[];
  teach_back:      string;           // script text

  flashcard_count: number;
  quiz_count:      number;

  /* The profile weights used when generating this pack */
  profile_snapshot: import("./user.types").LearningProfile;

  status:          "generating" | "ready" | "failed";
  created_at:      string;
  updated_at:      string;
}

/* ── API payloads ── */
export interface UploadRecordingPayload {
  title:    string;
  duration: number;
}

export interface ListStudyPacksParams {
  limit?:  number;
  offset?: number;
}
