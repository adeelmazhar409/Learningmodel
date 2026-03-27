import { callOrMock, get } from "./client";
import { apiClient } from "./client";
import type { Recording, RecordingStatusResponse } from "@neuropath/types";

const MOCK_RECORDINGS: Recording[] = [
  { id: "mock-rec-001", user_id: "mock-user-001", title: "Biology — Photosynthesis",
    duration_s: 480, file_url: "", transcript: "Today we learn about photosynthesis...",
    status: "ready", created_at: new Date(Date.now()-86400000).toISOString(), updated_at: new Date(Date.now()-86400000).toISOString() },
  { id: "mock-rec-002", user_id: "mock-user-001", title: "Chemistry — Atomic Structure",
    duration_s: 360, file_url: "", transcript: "An atom is the smallest unit...",
    status: "ready", created_at: new Date(Date.now()-172800000).toISOString(), updated_at: new Date(Date.now()-172800000).toISOString() },
];

let mockStep = 0;
const MOCK_STEPS = [
  { status: "uploading"    as const, progress: 20,  message: "Uploading audio…"        },
  { status: "transcribing" as const, progress: 50,  message: "Transcribing lecture…"   },
  { status: "generating"   as const, progress: 80,  message: "Generating study pack…"  },
  { status: "ready"        as const, progress: 100, message: "Your study pack is ready!" },
];

export const recordingsApi = {
  upload: async (file: File, title: string): Promise<Recording> => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      await new Promise(r => setTimeout(r, 1000));
      mockStep = 0;
      const rec: Recording = {
        id: `mock-rec-${Date.now()}`, user_id: "mock-user-001", title,
        duration_s: null, file_url: "", transcript: null,
        status: "uploading", created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      };
      MOCK_RECORDINGS.unshift(rec);
      return rec;
    }
    const form = new FormData();
    form.append("audio", file);
    form.append("title", title);
    const res = await apiClient.post<{ success: boolean; data: { recording: Recording } }>(
      "/api/recordings/upload", form, { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.data.recording;
  },

  getStatus: (recordingId: string): Promise<RecordingStatusResponse> =>
    callOrMock(
      async () => {
        const data = await get<RecordingStatusResponse>(`/api/recordings/${recordingId}/status`);
        return data;
      },
      (() => {
        const step = MOCK_STEPS[Math.min(mockStep, MOCK_STEPS.length - 1)];
        if (mockStep < MOCK_STEPS.length - 1) mockStep++;
        return { recording_id: recordingId, ...step };
      })(),
      1500
    ),

  getById: (recordingId: string): Promise<Recording> =>
    callOrMock(
      async () => {
        const data = await get<{ recording: Recording }>(`/api/recordings/${recordingId}`);
        return data.recording;
      },
      MOCK_RECORDINGS.find(r => r.id === recordingId) ?? MOCK_RECORDINGS[0],
      400
    ),

  list: (): Promise<Recording[]> =>
    callOrMock(
      async () => {
        const data = await get<{ recordings: Recording[] }>("/api/recordings");
        return data.recordings;
      },
      MOCK_RECORDINGS,
      500
    ),
};
