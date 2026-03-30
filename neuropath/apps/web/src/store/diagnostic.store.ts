import { create } from "zustand";
import type {
  DiagnosticQuestion,
  DiagnosticAnswer,
  LearningProfile,
} from "@neuropath/types";

/* ── Types ── */
export type DiagnosticMethod =
  | "flashcards"
  | "practice"
  | "visual"
  | "teach_back";
export type DiagnosticPhase =
  | "idle"
  | "round_flashcards"
  | "round_practice"
  | "round_visual"
  | "round_teach_back"
  | "break"
  | "recall"
  | "complete";

const PHASE_ORDER: DiagnosticPhase[] = [
  "round_flashcards",
  "round_practice",
  "round_visual",
  "round_teach_back",
  "break",
  "recall",
  "complete",
];

interface DiagnosticState {
  /* Current state */
  phase: DiagnosticPhase;
  attemptId: string | null;
  currentQuestion: number;

  /* Content */
  roundQuestions: DiagnosticQuestion[];
  recallQuestions: DiagnosticQuestion[];

  /* Collected responses — kept separate so submit() doesn't need to split by ID */
  roundAnswers: DiagnosticAnswer[];
  recallAnswers: DiagnosticAnswer[];

  /** @deprecated use roundAnswers + recallAnswers */
  answers: DiagnosticAnswer[];

  /* Result */
  profile: LearningProfile | null;

  /* Timing */
  questionStartedAt: number | null;

  /* Flag so submitAnswer knows which bucket to write into */
  isRecallPhase: boolean;

  /* Actions */
  startDiagnostic: (attemptId: string) => void;
  setRoundQuestions: (questions: DiagnosticQuestion[]) => void;
  setRecallQuestions: (questions: DiagnosticQuestion[]) => void;
  startQuestion: () => void;
  submitAnswer: (answer: DiagnosticAnswer) => void;
  nextQuestion: () => void;
  advancePhase: () => void;
  setProfile: (profile: LearningProfile) => void;
  reset: () => void;
}

const INITIAL: Pick<
  DiagnosticState,
  | "phase"
  | "attemptId"
  | "currentQuestion"
  | "roundQuestions"
  | "recallQuestions"
  | "roundAnswers"
  | "recallAnswers"
  | "answers"
  | "profile"
  | "questionStartedAt"
  | "isRecallPhase"
> = {
  phase: "idle",
  attemptId: null,
  currentQuestion: 0,
  roundQuestions: [],
  recallQuestions: [],
  roundAnswers: [],
  recallAnswers: [],
  answers: [], // kept for any legacy reads
  profile: null,
  questionStartedAt: null,
  isRecallPhase: false,
};

export const useDiagnosticStore = create<DiagnosticState>()((set, get) => ({
  ...INITIAL,

  startDiagnostic: (attemptId) =>
    set({ ...INITIAL, attemptId, phase: "round_flashcards" }),

  setRoundQuestions: (questions) =>
    set({ roundQuestions: questions, currentQuestion: 0 }),

  setRecallQuestions: (questions) =>
    set({ recallQuestions: questions, currentQuestion: 0 }),

  startQuestion: () => set({ questionStartedAt: Date.now() }),

  submitAnswer: (answer) => {
    const {
      questionStartedAt,
      roundAnswers,
      recallAnswers,
      answers,
      isRecallPhase,
    } = get();

    // Always use the store-measured time — ignore whatever time_ms the component passed
    const enriched: DiagnosticAnswer = {
      ...answer,
      time_ms: questionStartedAt ? Date.now() - questionStartedAt : 0,
    };

    if (isRecallPhase) {
      set({
        recallAnswers: [...recallAnswers, enriched],
        answers: [...answers, enriched],
        questionStartedAt: null,
      });
    } else {
      set({
        roundAnswers: [...roundAnswers, enriched],
        answers: [...answers, enriched],
        questionStartedAt: null,
      });
    }
  },

  nextQuestion: () => set((s) => ({ currentQuestion: s.currentQuestion + 1 })),

  advancePhase: () => {
    const { phase } = get();
    const idx = PHASE_ORDER.indexOf(phase);
    const next = PHASE_ORDER[idx + 1] ?? "complete";
    // Mark recall phase so submitAnswer routes to the right bucket
    set({ phase: next, currentQuestion: 0, isRecallPhase: next === "recall" });
  },

  setProfile: (profile) => set({ profile, phase: "complete" }),

  reset: () => set(INITIAL),
}));
