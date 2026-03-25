/* ═══════════════════════════════════════════════════════════
   USER TYPES
   Shared between apps/web and apps/server
═══════════════════════════════════════════════════════════ */

export interface LearningProfile {
  flashcards:  number; // 0–1 weight
  practice:    number;
  visual:      number;
  teach_back:  number;
}

export interface User {
  id:               string;
  name:             string;
  email:            string;
  grade_level:      number | null;   // 5–12, null until onboarding complete
  learning_profile: LearningProfile | null;
  created_at:       string;          // ISO timestamp
  updated_at:       string;
}

export interface Session {
  access_token:  string;
  refresh_token: string;
  expires_at:    number;             // Unix timestamp
  user_id:       string;
}

/* ── API payloads ── */
export interface SignupPayload {
  name:     string;
  email:    string;
  password: string;
}

export interface LoginPayload {
  email:    string;
  password: string;
}

export interface AuthResponse {
  user:    User;
  session: Session;
}

export interface UpdateProfilePayload {
  name?:        string;
  grade_level?: number;
}
