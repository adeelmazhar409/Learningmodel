import { callOrMock, get, patch } from "./client";
import type { User, UpdateProfilePayload } from "@neuropath/types";

const MOCK_USER: User = {
  id: "mock-user-001", name: "Alex Johnson", email: "student@school.edu",
  grade_level: 10,
  learning_profile: { practice: 0.45, teach_back: 0.28, flashcards: 0.17, visual: 0.10 },
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
};

export const userApi = {
  getProfile: (): Promise<User> =>
    callOrMock(() => get<User>("/api/user/profile"), MOCK_USER, 400),

  updateProfile: (payload: UpdateProfilePayload): Promise<User> =>
    callOrMock(
      () => patch<User>("/api/user/profile", payload),
      { ...MOCK_USER, ...payload, updated_at: new Date().toISOString() },
      500
    ),
};
