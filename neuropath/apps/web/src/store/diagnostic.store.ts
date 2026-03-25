import { create } from "zustand";
import type {
  DiagnosticQuestion,
  DiagnosticAnswer,
  LearningProfile,
} from "@neuropath/types";

/* ── Types ── */
export type DiagnosticMethod = "flashcards" | "practice" | "visual" | "teach_back";
export type DiagnosticPhase  =
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
  phase:           DiagnosticPhase;
  attemptId:       string | null;
  currentQuestion: number;

  /* Content */
  roundQuestions:  DiagnosticQuestion[];   // questions for the active learning round
  recallQuestions: DiagnosticQuestion[];   // the 20 mixed recall questions

  /* Collected responses */
  answers:         DiagnosticAnswer[];

  /* Result */
  profile:         LearningProfile | null;

  /* Timing — so speed can be measured */
  questionStartedAt: number | null;

  /* Actions */
  startDiagnostic:      (attemptId: string) => void;
  setRoundQuestions:    (questions: DiagnosticQuestion[]) => void;
  setRecallQuestions:   (questions: DiagnosticQuestion[]) => void;
  startQuestion:        () => void;
  submitAnswer:         (answer: DiagnosticAnswer) => void;
  nextQuestion:         () => void;
  advancePhase:         () => void;
  setProfile:           (profile: LearningProfile) => void;
  reset:                () => void;
}

const INITIAL: Pick<
  DiagnosticState,
  | "phase"
  | "attemptId"
  | "currentQuestion"
  | "roundQuestions"
  | "recallQuestions"
  | "answers"
  | "profile"
  | "questionStartedAt"
> = {
  phase:             "idle",
  attemptId:         null,
  currentQuestion:   0,
  roundQuestions:    [],
  recallQuestions:   [],
  answers:           [],
  profile:           null,
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

  startQuestion: () =>
    set({ questionStartedAt: Date.now() }),

  submitAnswer: (answer) => {
    // Attach time taken if we have a start time
    const { questionStartedAt, answers } = get();
    const enriched: DiagnosticAnswer = {
      ...answer,
      time_ms: questionStartedAt ? Date.now() - questionStartedAt : 0,
    };
    set({ answers: [...answers, enriched], questionStartedAt: null });
  },

  nextQuestion: () =>
    set(s => ({ currentQuestion: s.currentQuestion + 1 })),

  advancePhase: () => {
    const { phase } = get();
    const idx  = PHASE_ORDER.indexOf(phase);
    const next = PHASE_ORDER[idx + 1] ?? "complete";
    set({ phase: next, currentQuestion: 0 });
  },

  setProfile: (profile) =>
    set({ profile, phase: "complete" }),

  reset: () => set(INITIAL),
}));
