"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../../store/auth.store";
import { useDiagnosticStore } from "../../../store/diagnostic.store";
import { diagnosticApi } from "../../../lib/api/diagnostic.api";
import FlashcardRound from "../../../components/diagnostic/FlashcardRound";
import PracticeRound from "../../../components/diagnostic/PracticeRound";
import VisualRound from "../../../components/diagnostic/VisualRound";
import TeachBackRound from "../../../components/diagnostic/TeachBackRound";
import BreakScreen from "../../../components/diagnostic/BreakScreen";
import RecallTest from "../../../components/diagnostic/RecallTest";
import ProfileResult from "../../../components/diagnostic/ProfileResult";
import toast from "react-hot-toast";

interface DiagAnswer {
  question_id: string;
  method: string;
  correct: boolean;
  time_ms: number;
  user_answer?: string;
}

/* ─────────────────────────────────────────
   Phase metadata
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
   SVG Icons
───────────────────────────────────────── */
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
   Topic intro card — collapsed by default
───────────────────────────────────────── */
function TopicIntroCard({ topic, intro }: { topic: string; intro: string }) {
  const [expanded, setExpanded] = useState(false);
  const SHORT = 180;
  const isLong = intro.length > SHORT;
  const shown = expanded || !isLong ? intro : intro.slice(0, SHORT) + "…";

  return (
    <div className="relative overflow-hidden bg-[rgba(217,79,43,0.04)] border border-[rgba(217,79,43,0.18)] rounded-2xl p-4 sm:p-5 mb-5">
      <div className="absolute top-0 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-flame to-transparent opacity-50" />
      <p className="text-[10px] font-semibold text-flame tracking-[2px] uppercase mb-1.5">
        Today&apos;s topic: {topic}
      </p>
      <p className="text-[13px] text-soft font-light leading-relaxed">
        {shown}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-[11.5px] text-flame font-semibold mt-1.5 cursor-pointer bg-transparent border-none hover:opacity-75 transition-opacity"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
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
    startDiagnostic,
    setRoundQuestions,
    setRecallQuestions,
    advancePhase,
    setProfile,
    reset,
  } = store;

  const [submitting, setSubmitting] = useState(false);
  const [topic, setTopic] = useState("");
  const [topicIntro, setTopicIntro] = useState("");

  // Group questions by method so each round gets its own slice
  const allRoundQRef = useRef<Record<string, unknown[]>>({});

  const roundRef = useRef<HTMLDivElement>(null);

  /* ── Init on mount ── */
  useEffect(() => {
    if (phase !== "idle") return;
    initDiagnostic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Scroll to round content when phase changes ── */
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

  /*
    initDiagnostic — calls diagnosticApi.start() which is now SYNCHRONOUS
    (returns a Promise.resolve, no network). Fast and instant.
  */
  async function initDiagnostic() {
    const gradeNum = user?.grade_level ?? 10;
    const gradeBand =
      gradeNum <= 6
        ? "5-6"
        : gradeNum <= 8
          ? "7-8"
          : gradeNum <= 10
            ? "9-10"
            : "11-12";

    // This resolves instantly — no loading spinner needed
    const res = await diagnosticApi.start({
      subject: "Learning Science",
      grade_band: gradeBand,
    });

    setTopic(res.topic ?? "");
    setTopicIntro(res.topic_intro ?? "");

    // Group round questions by method
    const byMethod: Record<string, unknown[]> = {};
    for (const q of res.round_questions as Array<{ method: string }>) {
      if (!byMethod[q.method]) byMethod[q.method] = [];
      byMethod[q.method].push(q);
    }
    allRoundQRef.current = byMethod;

    startDiagnostic(res.attempt_id);
    setRoundQuestions(
      (byMethod["flashcards"] ?? []) as Parameters<typeof setRoundQuestions>[0],
    );
    setRecallQuestions(
      res.recall_questions as Parameters<typeof setRecallQuestions>[0],
    );
  }

  /* Advance to next round, loading that round's questions */
  function handleRoundComplete() {
    const nextMethodMap: Record<string, string> = {
      round_flashcards: "practice",
      round_practice: "visual",
      round_visual: "teach_back",
    };
    const nextMethod = nextMethodMap[phase];
    if (nextMethod && allRoundQRef.current[nextMethod]) {
      setRoundQuestions(
        allRoundQRef.current[nextMethod] as Parameters<
          typeof setRoundQuestions
        >[0],
      );
    }
    advancePhase();
  }

  /* Score + save when recall is done */
  async function handleRecallComplete(recallAnswers: DiagAnswer[]) {
    if (!store.attemptId) return;
    setSubmitting(true);
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

      const res = await (
        diagnosticApi as unknown as {
          submit: (p: {
            attempt_id: string;
            answers: DiagAnswer[];
            grade_band: string;
          }) => Promise<{
            scores: Record<
              string,
              {
                accuracy: number;
                speed: number;
                retention: number;
                final: number;
              }
            >;
            primary_method: string;
            secondary_method: string;
            learning_profile: Record<string, number>;
          }>;
        }
      ).submit({
        attempt_id: store.attemptId,
        answers: [...answers, ...recallAnswers] as DiagAnswer[],
        grade_band: gradeBand,
      });

      setProfile(res.learning_profile as Parameters<typeof setProfile>[0]);
      if (user) setUser({ ...user, learning_profile: res.learning_profile });
    } catch {
      toast.error("Could not score your diagnostic. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const stepIdx = PHASE_STEPS.indexOf(phase as (typeof PHASE_STEPS)[number]);
  const showTopicIntro =
    phase !== "idle" &&
    phase !== "complete" &&
    phase !== "break" &&
    !!topicIntro;

  /* ── Render ── */
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
        {/* ── Phase header ── */}
        {phase !== "idle" && phase !== "complete" && (
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

        {/* ── Topic intro card ── */}
        {showTopicIntro && <TopicIntroCard topic={topic} intro={topicIntro} />}

        {/* ── Calculating overlay ── */}
        {submitting && (
          <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
            <div className="w-7 h-7 border-2 border-edge border-t-ember rounded-full animate-spin" />
            <div>
              <p className="font-serif text-[18px] font-medium text-text mb-1.5">
                Calculating your learning profile…
              </p>
              <p className="text-[13px] text-soft font-light">
                This will only take a moment.
              </p>
            </div>
          </div>
        )}

        {/* ── Round content ── */}
        {!submitting && (
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
                    Topic tested:{" "}
                    <span className="text-text font-medium">{topic}</span>
                  </p>
                </div>
                <ProfileResult
                  profile={
                    profile as Parameters<typeof ProfileResult>[0]["profile"]
                  }
                  scores={{
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
                  }}
                />
              </>
            )}
          </div>
        )}

        {/* ── Restart button ── */}
        {phase !== "idle" && phase !== "complete" && !submitting && (
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
