"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../../store/auth.store";
import { useDiagnosticStore } from "../../../store/diagnostic.store";
import {
  diagnosticApi,
  type DiagnosticQuestion,
} from "../../../lib/api/diagnostic.api";
import FlashcardRound from "../../../components/diagnostic/FlashcardRound";
import PracticeRound from "../../../components/diagnostic/PracticeRound";
import VisualRound from "../../../components/diagnostic/VisualRound";
import TeachBackRound from "../../../components/diagnostic/TeachBackRound";
import BreakScreen from "../../../components/diagnostic/BreakScreen";
import RecallTest from "../../../components/diagnostic/RecallTest";
import ProfileResult from "../../../components/diagnostic/ProfileResult";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const PHASE_LABELS: Record<string, string> = {
  idle: "Getting ready",
  round_flashcards: "Round 1 — Flashcards",
  round_practice: "Round 2 — Practice",
  round_visual: "Round 3 — Visual",
  round_teach_back: "Round 4 — Teach-back",
  break: "Distraction Break",
  recall: "Memory Recall Test",
  complete: "Results",
};

const PHASE_STEPS = [
  "round_flashcards",
  "round_practice",
  "round_visual",
  "round_teach_back",
  "break",
  "recall",
  "complete",
] as const;

/* ─────────────────────────────────────────
   Icons
───────────────────────────────────────── */
function IcBrain({ s = 22 }: { s?: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.41-4.28 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24A2.5 2.5 0 0 1 9.5 2z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.41-4.28 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 14.5 2z" />
    </svg>
  );
}

function IcRefresh({ s = 13 }: { s?: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function IcArrow({ s = 16 }: { s?: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Phase progress dots
───────────────────────────────────────── */
function PhaseDots({ current }: { current: string }) {
  const steps = PHASE_STEPS.filter((s) => s !== "complete");
  const idx = PHASE_STEPS.indexOf(current as (typeof PHASE_STEPS)[number]);
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 mb-6">
      {steps.map((step, i) => {
        const isDone = i < idx;
        const isCurrent = i === idx;
        return (
          <div key={step} className="flex items-center gap-1.5 sm:gap-2">
            <div
              className={[
                "rounded-full transition-all duration-300",
                isDone
                  ? "w-2 h-2 bg-flame"
                  : isCurrent
                    ? "w-3 h-3 bg-ember shadow-[0_0_8px_rgba(217,79,43,0.6)]"
                    : "w-2 h-2 bg-edge",
              ].join(" ")}
            />
            {i < steps.length - 1 && (
              <div
                className={`h-px transition-all duration-500 ${isDone ? "w-4 sm:w-8 bg-flame" : "w-4 sm:w-8 bg-edge"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   WorldIntroGate
   Full-screen card shown BEFORE each round.
   User must click "Got it — start round" to proceed.
───────────────────────────────────────── */
function WorldIntroGate({
  topic,
  intro,
  roundLabel,
  onStart,
}: {
  topic: string;
  intro: string;
  roundLabel: string;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-10">
      <div className="w-full max-w-[640px]">
        {/* Tag */}
        <p className="text-[10px] font-semibold text-flame tracking-[2.5px] uppercase mb-3 flex items-center gap-2">
          <span className="w-4 h-px bg-flame" />
          Read before you begin
        </p>

        {/* Card */}
        <div className="relative overflow-hidden bg-[rgba(217,79,43,0.05)] border border-[rgba(217,79,43,0.25)] rounded-2xl p-6 sm:p-8 mb-6">
          {/* top shimmer line */}
          <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-flame to-transparent opacity-60" />

          <p className="text-[11px] font-semibold text-flame tracking-[2px] uppercase mb-1">
            World: {topic}
          </p>
          <p className="text-[11px] text-whisper mb-4 uppercase tracking-widest">
            {roundLabel}
          </p>

          <p className="text-[14.5px] sm:text-[15px] text-soft font-light leading-[1.75] whitespace-pre-line">
            {intro}
          </p>

          {/* bottom shimmer */}
          <div className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-flame to-transparent opacity-30" />
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <button
            onClick={onStart}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-flame text-white text-[13.5px] font-semibold cursor-pointer hover:bg-ember transition-colors font-sans shadow-[0_4px_20px_rgba(217,79,43,0.35)]"
          >
            Got it — start round <IcArrow />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main page
───────────────────────────────────────── */
export default function DiagnosticPage() {
  const { user, setUser } = useAuthStore();
  const store = useDiagnosticStore();
  const {
    phase,
    profile,
    answers,
    roundQuestions,
    recallQuestions,
    chunkOrder,
    startDiagnostic,
    setRoundQuestions,
    setRecallQuestions,
    setChunkOrder,
    setChunkIntros,
    getCurrentChunkIntro,
    advancePhase,
    setProfile,
    reset,
  } = store;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [topic, setTopic] = useState("");
  const [scores, setScores] = useState<Record<
    string,
    {
      accuracy: number;
      speed: number;
      retention: number;
      final: number;
    }
  > | null>(null);
  // When true, show the world intro gate instead of the question component
  const [showingIntro, setShowingIntro] = useState(false);
  const [introText, setIntroText] = useState("");

  const [allRoundQ, setAllRoundQ] = useState<
    Record<string, DiagnosticQuestion[]>
  >({});

  const roundRef = useRef<HTMLDivElement>(null);

  /* Start on mount */
  useEffect(() => {
    if (phase !== "idle") return;
    initDiagnostic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Scroll into view on phase change */
  useEffect(() => {
    if (phase !== "idle" && phase !== "complete" && roundRef.current) {
      setTimeout(
        () =>
          roundRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        100,
      );
    }
  }, [phase]);

  /* ── Init ──────────────────────────────────────────────────────── */
  async function initDiagnostic() {
    setLoading(true);
    try {
      const gradeNum = user?.grade_level ?? 10;
      const gradeBand =
        gradeNum <= 6
          ? "5-6"
          : gradeNum <= 8
            ? "7-8"
            : gradeNum <= 10
              ? "9-10"
              : "11-12";

      const res = await diagnosticApi.start({
        subject: "Learning Science",
        grade_band: gradeBand,
        attempt_number: 0,
      });

      setTopic(res.topic ?? "");
      setChunkOrder(res.chunk_order ?? []);
      setChunkIntros(res.chunk_intros ?? []);

      const byMethod: Record<string, DiagnosticQuestion[]> = {};
      for (const q of res.round_questions) {
        if (!byMethod[q.method]) byMethod[q.method] = [];
        byMethod[q.method].push(q);
      }
      setAllRoundQ(byMethod);

      startDiagnostic(res.attempt_id);
      setRoundQuestions(byMethod["flashcards"] ?? []);
      setRecallQuestions(res.recall_questions);

      // Show intro for the first round before questions appear
      setIntroText(
        res.chunk_intros[res.chunk_order[0]] ?? res.chunk_intros[0] ?? "",
      );
      setShowingIntro(true);
    } catch (err) {
      console.error("Diagnostic init error:", err);
      toast.error("Could not load diagnostic. Please refresh.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Round complete → show next intro → advance ─────────────────── */
  function handleRoundComplete() {
    const nextMethodMap: Record<string, string> = {
      round_flashcards: "practice",
      round_practice: "visual",
      round_visual: "teach_back",
    };
    const nextMethod = nextMethodMap[phase];
    if (nextMethod && allRoundQ[nextMethod]) {
      setRoundQuestions(allRoundQ[nextMethod]);
    }

    // Show intro for the next round if available
    const nextIntro = getCurrentChunkIntro();
    if (nextIntro && nextMethod) {
      setIntroText(nextIntro);
      setShowingIntro(true);
      // Advance phase AFTER showing the intro (intro gate calls advancePhase via onStart)
      advancePhase();
    } else {
      advancePhase();
    }
  }

  /* ── Recall complete → score ──────────────────────────────────────── */
  async function handleRecallComplete(
    recallAnswers: {
      question_id: string;
      method: string;
      correct: boolean;
      time_ms: number;
      user_answer?: string;
      chunk_index?: number;
    }[],
  ) {
    if (!store.attemptId) return;
    setSubmitting(true);
    try {
      const allAnswers = [...answers, ...recallAnswers] as Parameters<
        typeof diagnosticApi.submit
      >[0]["answers"];

      const res = await diagnosticApi.submit({
        attempt_id: store.attemptId,
        answers: allAnswers,
        chunk_order: chunkOrder,
      });

      setScores(res.scores);
      setProfile(res.learning_profile as Parameters<typeof setProfile>[0]);
      if (user) setUser({ ...user, learning_profile: res.learning_profile });
    } catch (err) {
      console.error("Diagnostic submit error:", err);
      toast.error("Could not score your diagnostic. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Derived ───────────────────────────────────────────────────── */
  const stepIdx = PHASE_STEPS.indexOf(phase as (typeof PHASE_STEPS)[number]);

  /* ── Render ────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-ink">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[460px] h-[280px] pointer-events-none z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(217,79,43,0.07)] to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[820px] mx-auto px-4 sm:px-6 pt-6 pb-28">
        {/* ── Page header (hidden during intro gate and idle) ── */}
        {phase !== "idle" && phase !== "complete" && !showingIntro && (
          <div className="mb-7">
            <p className="flex items-center gap-2 text-[10px] font-semibold text-flame tracking-[2.5px] uppercase mb-4">
              <span className="w-4 h-px bg-flame" />
              Diagnostic
            </p>
            <PhaseDots current={phase} />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="font-serif text-[clamp(20px,4.5vw,32px)] font-medium text-text tracking-[-0.03em] leading-tight mb-1">
                  {PHASE_LABELS[phase] ?? "Diagnostic"}
                </h1>
                <p className="text-[12.5px] sm:text-[13.5px] text-soft font-light">
                  {phase === "break"
                    ? "Clearing your working memory — mandatory for accurate results."
                    : phase === "recall"
                      ? "20 questions · no hints · answer from memory only."
                      : stepIdx >= 0
                        ? `Step ${stepIdx + 1} of ${PHASE_STEPS.length - 1}`
                        : ""}
                </p>
              </div>
              {stepIdx >= 0 && phase !== "break" && (
                <div className="shrink-0 px-3 py-1.5 rounded-full bg-surface border border-edge text-[11px] text-whisper font-semibold w-fit">
                  {stepIdx + 1} / {PHASE_STEPS.length}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Loading ── */}
        {(loading || submitting) && (
          <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface border border-edge flex items-center justify-center text-flame">
              <IcBrain />
            </div>
            <div>
              <p className="font-serif text-[18px] font-medium text-text mb-1.5">
                {submitting
                  ? "Calculating your learning profile…"
                  : "Preparing your diagnostic…"}
              </p>
              <p className="text-[13px] text-soft font-light">
                This will only take a moment.
              </p>
            </div>
            <div className="w-7 h-7 border-2 border-edge border-t-ember rounded-full animate-spin" />
          </div>
        )}

        {/* ── World intro gate — shown before each round ── */}
        {!loading && !submitting && showingIntro && (
          <WorldIntroGate
            topic={topic}
            intro={introText}
            roundLabel={PHASE_LABELS[phase] ?? "Round"}
            onStart={() => setShowingIntro(false)}
          />
        )}

        {/* ── Phase content — only shown after intro is dismissed ── */}
        {!loading && !submitting && !showingIntro && (
          <div ref={roundRef}>
            {phase === "round_flashcards" && roundQuestions.length > 0 && (
              <FlashcardRound
                questions={
                  roundQuestions as Parameters<
                    typeof FlashcardRound
                  >[0]["questions"]
                }
                onComplete={handleRoundComplete}
              />
            )}
            {phase === "round_practice" && roundQuestions.length > 0 && (
              <PracticeRound
                questions={
                  roundQuestions as Parameters<
                    typeof PracticeRound
                  >[0]["questions"]
                }
                onComplete={handleRoundComplete}
              />
            )}
            {phase === "round_visual" && roundQuestions.length > 0 && (
              <VisualRound
                questions={
                  roundQuestions as Parameters<
                    typeof VisualRound
                  >[0]["questions"]
                }
                onComplete={handleRoundComplete}
              />
            )}
            {phase === "round_teach_back" && roundQuestions.length > 0 && (
              <TeachBackRound
                questions={
                  roundQuestions as Parameters<
                    typeof TeachBackRound
                  >[0]["questions"]
                }
                onComplete={advancePhase}
              />
            )}
            {phase === "break" && <BreakScreen onComplete={advancePhase} />}
            {phase === "recall" && recallQuestions.length > 0 && (
              <RecallTest
                questions={
                  recallQuestions as Parameters<
                    typeof RecallTest
                  >[0]["questions"]
                }
                onComplete={handleRecallComplete}
              />
            )}
            {phase === "complete" && profile && (
              <>
                <div className="mb-8">
                  <p className="flex items-center gap-2 text-[10px] font-semibold text-flame tracking-[2.5px] uppercase mb-2.5">
                    <span className="w-4 h-px bg-flame" />
                    Complete
                  </p>
                  <h1 className="font-serif text-[clamp(22px,5vw,36px)] font-medium text-text tracking-[-0.03em] leading-tight mb-2">
                    Your learning profile
                  </h1>
                  <p className="text-[13.5px] text-soft font-light">
                    World tested:{" "}
                    <span className="text-text font-medium">{topic}</span>
                  </p>
                </div>
                <ProfileResult
                  profile={
                    profile as Parameters<typeof ProfileResult>[0]["profile"]
                  }
                  scores={
                    scores ?? {
                      flashcards: {
                        accuracy: 60,
                        speed: 75,
                        retention: 55,
                        final: 63,
                      },
                      practice: {
                        accuracy: 88,
                        speed: 82,
                        retention: 84,
                        final: 86,
                      },
                      visual: {
                        accuracy: 52,
                        speed: 68,
                        retention: 48,
                        final: 54,
                      },
                      teach_back: {
                        accuracy: 74,
                        speed: 71,
                        retention: 78,
                        final: 74,
                      },
                    }
                  }
                />
              </>
            )}
          </div>
        )}

        {/* ── Restart button ── */}
        {phase !== "idle" &&
          phase !== "complete" &&
          !loading &&
          !submitting &&
          !showingIntro && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => {
                  reset();
                  setTimeout(initDiagnostic, 100);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-edge bg-transparent text-[12px] text-whisper font-semibold cursor-pointer hover:text-soft hover:border-edge-2 transition-all font-sans"
              >
                <IcRefresh /> Restart diagnostic
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
