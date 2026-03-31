/* ═══════════════════════════════════════════════════════════
   DIAGNOSTIC TYPES
   Shared between apps/web and apps/server
═══════════════════════════════════════════════════════════ */

export type LearningMethod = "flashcards" | "practice" | "visual" | "teach_back";
export type QuestionDifficulty = "easy" | "medium" | "hard";
export type QuestionType = "mcq" | "short_answer" | "visual_label" | "teach_back";



export interface DiagnosticQuestion {
  id:           string;
  method:       LearningMethod;
  type:         QuestionType;
  difficulty:   QuestionDifficulty;
  question:     string;
  choices?:     string[];            // only for MCQ questions
  answer:       string;
  explanation?: string;
  image_url?:   string;             // only for visual questions
}

export interface DiagnosticAnswer {
  question_id: string;
  method:      LearningMethod;
  correct:     boolean;
  time_ms:     number;             // milliseconds taken to answer
  user_answer: string;
}

export interface DiagnosticAttempt {
  id:              string;
  user_id:         string;
  subject:         string;
  grade_band:      string;          // e.g. "9-10"
  started_at:      string;
  completed_at:    string | null;
  answers:         DiagnosticAnswer[];
  scores:          DiagnosticScores | null;
  primary_method:  LearningMethod | null;
  secondary_method:LearningMethod | null;
}

export interface DiagnosticScores {
  flashcards:  MethodScore;
  practice:    MethodScore;
  visual:      MethodScore;
  teach_back:  MethodScore;
}

export interface MethodScore {
  accuracy:  number;   // 0–100
  speed:     number;   // 0–100
  retention: number;   // 0–100
  final:     number;   // weighted composite 0–100
}

/* ── API payloads ── */
export interface StartDiagnosticPayload {
  subject:    string;
  grade_band: string;
}

export interface StartDiagnosticResponse {
  attempt_id:       string;
  round_questions:  DiagnosticQuestion[];
  recall_questions: DiagnosticQuestion[];
}

export interface SubmitDiagnosticPayload {
  attempt_id: string;
  answers:    DiagnosticAnswer[];
}

export interface SubmitDiagnosticResponse {
  scores:           DiagnosticScores;
  primary_method:   LearningMethod;
  secondary_method: LearningMethod;
  learning_profile: import("./user.types").LearningProfile;
}
