import { callOrMock, post, del } from "./client";
import type {
  SignupPayload,
  LoginPayload,
  AuthResponse,
} from "@neuropath/types";

/* ── Mock data ── */
const MOCK_SESSION = {
  access_token:  "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_at:    Date.now() / 1000 + 3600,
  user_id:       "mock-user-001",
};

const MOCK_USER_BASE = {
  id:               "mock-user-001",
  email:            "student@school.edu",
  grade_level:      null as null,
  learning_profile: null as null,
  created_at:       new Date().toISOString(),
  updated_at:       new Date().toISOString(),
};

/* ════════════════════════════════════════
   AUTH API
════════════════════════════════════════ */
export const authApi = {
  /* ── Sign up ── */
  signup: (payload: SignupPayload): Promise<AuthResponse> =>
    callOrMock(
      () => post<AuthResponse>("/api/auth/signup", payload),
      {
        user:    { ...MOCK_USER_BASE, name: payload.name, email: payload.email },
        session: { ...MOCK_SESSION },
      },
      800
    ),

  /* ── Log in ── */
  login: (payload: LoginPayload): Promise<AuthResponse> =>
    callOrMock(
      () => post<AuthResponse>("/api/auth/login", payload),
      {
        user: {
          ...MOCK_USER_BASE,
          name:             "Alex Johnson",
          email:            payload.email,
          grade_level:      10,
          learning_profile: {
            practice:   0.45,
            teach_back: 0.28,
            flashcards: 0.17,
            visual:     0.10,
          },
        },
        session: { ...MOCK_SESSION },
      },
      700
    ),

  /* ── Log out ── */
  logout: (): Promise<void> =>
    callOrMock(
      () => del<void>("/api/auth/logout"),
      undefined,
      300
    ),
};
