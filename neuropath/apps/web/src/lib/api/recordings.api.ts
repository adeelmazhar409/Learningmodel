import { callOrMock, get, post } from "./client";
import type {
  Recording,
  RecordingStatus,
  RecordingStatusResponse,
} from "@neuropath/types";

/* ── Mock recordings ── */
const MOCK_RECORDINGS: Recording[] = [
  {
    id:          "mock-rec-001",
    user_id:     "mock-user-001",
    title:       "Biology — Photosynthesis",
    duration_s:  480,
    file_url:    "",
    transcript:  "Today we are going to learn about photosynthesis. Photosynthesis is the process by which plants convert light energy into chemical energy stored in glucose. The process takes place in the chloroplasts, which contain a green pigment called chlorophyll. Plants absorb carbon dioxide from the air through tiny pores called stomata, and water from the soil through their roots. Using sunlight as an energy source, they convert these raw materials into glucose and oxygen. The oxygen is released into the atmosphere as a byproduct, which is why plants are so important for all life on Earth.",
    status:      "ready",
    created_at:  new Date(Date.now() - 86400000).toISOString(),
    updated_at:  new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id:          "mock-rec-002",
    user_id:     "mock-user-001",
    title:       "Chemistry — Atomic Structure",
    duration_s:  360,
    file_url:    "",
    transcript:  "An atom is the smallest unit of a chemical element. Every atom consists of a nucleus containing protons and neutrons, surrounded by electrons that orbit in shells. Protons carry a positive charge, electrons carry a negative charge, and neutrons have no charge. The atomic number of an element is the number of protons in its nucleus, which defines what element it is. The mass number is the total number of protons and neutrons. Electrons occupy energy levels or shells around the nucleus.",
    status:      "ready",
    created_at:  new Date(Date.now() - 172800000).toISOString(),
    updated_at:  new Date(Date.now() - 172800000).toISOString(),
  },
];

/* Simulate status polling — progresses through states */
let mockStatusStep = 0;
const STATUS_STEPS: Array<{ status: RecordingStatus; progress: number; message: string }> = [
  { status: "uploading",    progress: 20,  message: "Uploading audio…"       },
  { status: "transcribing", progress: 50,  message: "Transcribing lecture…"  },
  { status: "generating",   progress: 80,  message: "Generating study pack…" },
  { status: "ready",        progress: 100, message: "Your study pack is ready!" },
];

/* ════════════════════════════════════════
   RECORDINGS API
════════════════════════════════════════ */
export const recordingsApi = {
  /* ── Upload audio file — returns recording with status "uploading" ── */
  upload: async (
    file:  File,
    title: string
  ): Promise<Recording> => {
    if (process.env.NEXT_PUBLIC_API_URL) {
      // Real upload — multipart form data
      const { apiClient } = await import("./client");
      const form = new FormData();
      form.append("audio", file);
      form.append("title", title);
      const res = await apiClient.post<Recording>("/api/recordings/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    }

    // Mock — simulate upload delay
    await new Promise(r => setTimeout(r, 1000));
    mockStatusStep = 0;
    const newRec: Recording = {
      id:          `mock-rec-${Date.now()}`,
      user_id:     "mock-user-001",
      title,
      duration_s:  null,
      file_url:    "",
      transcript:  null,
      status:      "uploading",
      created_at:  new Date().toISOString(),
      updated_at:  new Date().toISOString(),
    };
    MOCK_RECORDINGS.unshift(newRec);
    return newRec;
  },

  /* ── Poll status of a recording ── */
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

  /* ── Get single recording (with transcript) ── */
  getById: (recordingId: string): Promise<Recording> =>
    callOrMock(
      () => get<Recording>(`/api/recordings/${recordingId}`),
      MOCK_RECORDINGS.find(r => r.id === recordingId) ?? MOCK_RECORDINGS[0],
      400
    ),

  /* ── List all recordings ── */
  list: (): Promise<Recording[]> =>
    callOrMock(
      () => get<Recording[]>("/api/recordings"),
      MOCK_RECORDINGS,
      500
    ),
};
