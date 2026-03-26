import { callOrMock, get, post } from "./client";
import type { Recording, RecordingStatus, RecordingStatusResponse } from "@neuropath/types";

const MOCK_RECORDINGS: Recording[] = [
  {
    id: "mock-rec-001", user_id: "mock-user-001", title: "Biology — Photosynthesis",
    duration_s: 480, file_url: "", status: "ready",
    transcript: "Today we are going to learn about photosynthesis. Photosynthesis is the process by which plants convert light energy into chemical energy stored in glucose.",
    created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "mock-rec-002", user_id: "mock-user-001", title: "Chemistry — Atomic Structure",
    duration_s: 360, file_url: "", status: "ready",
    transcript: "An atom is the smallest unit of a chemical element. Every atom consists of a nucleus containing protons and neutrons, surrounded by electrons.",
    created_at: new Date(Date.now() - 172800000).toISOString(), updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

let mockStatusStep = 0;
const STATUS_STEPS: Array<{ status: RecordingStatus; progress: number; message: string }> = [
  { status: "uploading",    progress: 20,  message: "Uploading audio…" },
  { status: "transcribing", progress: 50,  message: "Transcribing lecture…" },
  { status: "generating",   progress: 80,  message: "Generating study pack…" },
  { status: "ready",        progress: 100, message: "Your study pack is ready!" },
];

export const recordingsApi = {
  upload: async (file: File, title: string): Promise<Recording> => {
    if (process.env.NEXT_PUBLIC_API_URL) {
      const { apiClient } = await import("./client");
      const form = new FormData();
      form.append("audio", file);
      form.append("title", title);
      const res = await apiClient.post<Recording>("/api/recordings/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    }
    await new Promise(r => setTimeout(r, 1000));
    mockStatusStep = 0;
    const newRec: Recording = {
      id: `mock-rec-${Date.now()}`, user_id: "mock-user-001", title,
      duration_s: null, file_url: "", transcript: null, status: "uploading",
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    };
    MOCK_RECORDINGS.unshift(newRec);
    return newRec;
  },

  getStatus: (recordingId: string): Promise<RecordingStatusResponse> =>
    callOrMock(
      () => get<RecordingStatusResponse>(`/api/recordings/${recordingId}/status`),
      (() => {
        const step = STATUS_STEPS[Math.min(mockStatusStep, STATUS_STEPS.length - 1)];
        if (mockStatusStep < STATUS_STEPS.length - 1) mockStatusStep++;
        return { recording_id: recordingId, ...step };
      })(),
      1500
    ),

  getById: (recordingId: string): Promise<Recording> =>
    callOrMock(
      () => get<Recording>(`/api/recordings/${recordingId}`),
      MOCK_RECORDINGS.find(r => r.id === recordingId) ?? MOCK_RECORDINGS[0],
      400
    ),

  list: (): Promise<Recording[]> =>
    callOrMock(() => get<Recording[]>("/api/recordings"), MOCK_RECORDINGS, 500),
};
