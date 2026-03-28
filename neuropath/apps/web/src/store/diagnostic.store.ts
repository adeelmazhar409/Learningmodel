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

/* Maps each phase to its method index in METHODS array
   METHODS = ["flashcards","practice","visual","teach_back"]
   Phase 0 → method index 0 → reads chunkOrder[0] to get its chunk */
const PHASE_TO_METHOD_IDX: Partial<Record<DiagnosticPhase, number>> = {
  round_flashcards: 0,
  round_practice: 1,
  round_visual: 2,
  round_teach_back: 3,
};

interface DiagnosticState {
  /* Current state */
  phase: DiagnosticPhase;
  attemptId: string | null;
  currentQuestion: number;

  /* Content */
  roundQuestions: DiagnosticQuestion[]; // questions for the active learning round
  recallQuestions: DiagnosticQuestion[]; // the 20 mixed recall questions

  /*
   * chunk_order[i] = which world chunk was shown during round i (0-indexed).
   * This is set once at start() and used by submit() to apply decay multipliers.
   * Example: [2, 0, 3, 1] means:
   *   Round 0 (flashcards) got chunk 2
   *   Round 1 (practice)   got chunk 0
   *   Round 2 (visual)     got chunk 3
   *   Round 3 (teach_back) got chunk 1
   */
  chunkOrder: number[];

  /*
   * chunk_intros[i] = intro text for the chunk shown in round i.
   * Displayed ONLY before that round starts — never all at once (prevents chunk bleed).
   */
  chunkIntros: string[];

  /* Collected responses */
  answers: DiagnosticAnswer[];

  /* Result */
  profile: LearningProfile | null;

  /* Timing — so speed can be measured */
  questionStartedAt: number | null;

  /* Actions */
  startDiagnostic: (attemptId: string) => void;
  setRoundQuestions: (questions: DiagnosticQuestion[]) => void;
  setRecallQuestions: (questions: DiagnosticQuestion[]) => void;
  setChunkOrder: (order: number[]) => void;
  setChunkIntros: (intros: string[]) => void;
  /** Returns the intro for the currently active round (or empty string) */
  getCurrentChunkIntro: () => string;
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
  | "chunkOrder"
  | "chunkIntros"
  | "answers"
  | "profile"
  | "questionStartedAt"
> = {
  phase: "idle",
  attemptId: null,
  currentQuestion: 0,
  roundQuestions: [],
  recallQuestions: [],
  chunkOrder: [],
  chunkIntros: [],
  answers: [],
  profile: null,
  questionStartedAt: null,
};

export const useDiagnosticStore = create<DiagnosticState>()((set, get) => ({
  ...INITIAL,

  startDiagnostic: (attemptId) =>
    set({ ...INITIAL, attemptId, phase: "round_flashcards" }),

  setRoundQuestions: (questions) =>
    set({ roundQuestions: questions, currentQuestion: 0 }),

  setRecallQuestions: (questions) =>
    set({ recallQuestions: questions, currentQuestion: 0 }),

  setChunkOrder: (order) => set({ chunkOrder: order }),

  setChunkIntros: (intros) => set({ chunkIntros: intros }),

  getCurrentChunkIntro: () => {
    const { phase, chunkIntros } = get();
    const methodIdx = PHASE_TO_METHOD_IDX[phase];
    if (methodIdx === undefined || chunkIntros.length === 0) return "";
    return chunkIntros[methodIdx] ?? "";
  },

  startQuestion: () => set({ questionStartedAt: Date.now() }),

  submitAnswer: (answer) => {
    const { questionStartedAt, answers } = get();
    const enriched: DiagnosticAnswer = {
      ...answer,
      time_ms: questionStartedAt ? Date.now() - questionStartedAt : 0,
    };
    set({ answers: [...answers, enriched], questionStartedAt: null });
  },

  nextQuestion: () => set((s) => ({ currentQuestion: s.currentQuestion + 1 })),

  advancePhase: () => {
    const { phase } = get();
    const idx = PHASE_ORDER.indexOf(phase);
    const next = PHASE_ORDER[idx + 1] ?? "complete";
    set({ phase: next, currentQuestion: 0 });
  },

  setProfile: (profile) => set({ profile, phase: "complete" }),

  reset: () => set(INITIAL),
}));
