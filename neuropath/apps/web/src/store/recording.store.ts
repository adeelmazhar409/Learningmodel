import { create } from "zustand";
import type { RecordingStatus } from "@neuropath/types";

export type RecordingPhase =
  | "idle"
  | "recording"
  | "stopped"
  | "uploading"
  | "processing"
  | "ready"
  | "error";

interface RecordingState {
  /* Phase */
  phase:       RecordingPhase;
  recordingId: string | null;

  /* Audio capture */
  mediaRecorder:  MediaRecorder | null;
  audioChunks:    Blob[];
  audioBlob:      Blob | null;
  durationMs:     number;
  timerInterval:  ReturnType<typeof setInterval> | null;

  /* Processing */
  status:         RecordingStatus | null;
  statusMessage:  string;
  progress:       number;           // 0–100

  /* Error */
  error: string | null;

  /* Actions */
  setPhase:         (phase: RecordingPhase) => void;
  setRecordingId:   (id: string) => void;
  setMediaRecorder: (mr: MediaRecorder | null) => void;
  appendChunk:      (chunk: Blob) => void;
  setAudioBlob:     (blob: Blob) => void;
  tickDuration:     () => void;
  setTimerInterval: (interval: ReturnType<typeof setInterval> | null) => void;
  setStatus:        (status: RecordingStatus, message: string, progress: number) => void;
  setError:         (error: string) => void;
  reset:            () => void;
}

const INITIAL = {
  phase:          "idle"  as RecordingPhase,
  recordingId:    null,
  mediaRecorder:  null,
  audioChunks:    [] as Blob[],
  audioBlob:      null,
  durationMs:     0,
  timerInterval:  null,
  status:         null,
  statusMessage:  "",
  progress:       0,
  error:          null,
};

export const useRecordingStore = create<RecordingState>()((set, get) => ({
  ...INITIAL,

  setPhase:         (phase)       => set({ phase }),
  setRecordingId:   (id)          => set({ recordingId: id }),
  setMediaRecorder: (mr)          => set({ mediaRecorder: mr }),
  appendChunk:      (chunk)       => set(s => ({ audioChunks: [...s.audioChunks, chunk] })),
  setAudioBlob:     (blob)        => set({ audioBlob: blob }),
  tickDuration:     ()            => set(s => ({ durationMs: s.durationMs + 1000 })),
  setTimerInterval: (interval)    => set({ timerInterval: interval }),

  setStatus: (status, message, progress) =>
    set({ status, statusMessage: message, progress }),

  setError: (error) =>
    set({ phase: "error", error }),

  reset: () => {
    // Stop any running timer
    const { timerInterval, mediaRecorder } = get();
    if (timerInterval) clearInterval(timerInterval);
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      try { mediaRecorder.stop(); } catch { /* ignore */ }
    }
    set(INITIAL);
  },
}));
