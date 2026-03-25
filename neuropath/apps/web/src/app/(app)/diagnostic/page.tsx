"use client";

import { useEffect, useState } from "react";
import { useAuthStore }       from "@/store/auth.store";
import { useDiagnosticStore } from "@/store/diagnostic.store";
import { diagnosticApi }      from "@/lib/api/diagnostic.api";
import FlashcardRound  from "@/components/diagnostic/FlashcardRound";
import PracticeRound   from "@/components/diagnostic/PracticeRound";
import VisualRound     from "@/components/diagnostic/VisualRound";
import TeachBackRound  from "@/components/diagnostic/TeachBackRound";
import BreakScreen     from "@/components/diagnostic/BreakScreen";
import RecallTest      from "@/components/diagnostic/RecallTest";
import ProfileResult   from "@/components/diagnostic/ProfileResult";
import type { DiagnosticAnswer } from "@neuropath/types";
import toast from "react-hot-toast";

const PHASE_LABELS: Record<string, string> = {
  idle:               "Getting ready",
  round_flashcards:   "Round 1 — Flashcards",
  round_practice:     "Round 2 — Practice",
  round_visual:       "Round 3 — Visual",
  round_teach_back:   "Round 4 — Teach-back",
  break:              "Break",
  recall:             "Memory Recall Test",
  complete:           "Results",
};

const PHASE_STEPS = [
  "round_flashcards",
  "round_practice",
  "round_visual",
  "round_teach_back",
  "break",
  "recall",
  "complete",
];

export default function DiagnosticPage() {
  const { user, setUser }  = useAuthStore();
  const store              = useDiagnosticStore();
  const {
    phase, profile, answers,
    roundQuestions, recallQuestions,
    startDiagnostic, setRoundQuestions,
    setRecallQuestions, advancePhase,
    setProfile, reset,
  } = store;

  const [loading,    setLoading]    = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ── Start the diagnostic on mount if not already running ── */
  useEffect(() => {
    if (phase !== "idle") return;
    initDiagnostic();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function initDiagnostic() {
    setLoading(true);
    try {
      const gradeNum   = user?.grade_level ?? 10;
      const gradeBand  = gradeNum <= 6  ? "5-6"
                       : gradeNum <= 8  ? "7-8"
                       : gradeNum <= 10 ? "9-10"
                       :                  "11-12";

      const res = await diagnosticApi.start({
        subject:    "General (Critical Thinking)",
        grade_band: gradeBand,
      });

      startDiagnostic(res.attempt_id);

      /* Split questions by method for each round */
      const byMethod = (m: string) =>
        res.round_questions.filter(q => q.method === m);

      setRoundQuestions(byMethod("flashcards"));
      setRecallQuestions(res.recall_questions);

      /* Store all round questions so we can serve per-phase */
      store.setRoundQuestions(byMethod("flashcards"));

    } catch {
      toast.error("Could not load diagnostic. Please refresh.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Called when user moves from one round to the next ── */
  function handleRoundComplete() {
    const gradeNum   = user?.grade_level ?? 10;
    const gradeBand  = gradeNum <= 6  ? "5-6"
                     : gradeNum <= 8  ? "7-8"
                     : gradeNum <= 10 ? "9-10"
                     :                  "11-12";

    /* Load the next round's questions into the store */
    const nextPhaseMap: Record<string, string> = {
      round_flashcards: "practice",
      round_practice:   "visual",
      round_visual:     "teach_back",
    };
    const nextMethod = nextPhaseMap[phase];
    if (nextMethod && store.attemptId) {
      diagnosticApi
        .start({ subject: "General (Critical Thinking)", grade_band: gradeBand })
        .then(res => {
          const qs = res.round_questions.filter(q => q.method === nextMethod);
          setRoundQuestions(qs);
        })
        .catch(() => {});
    }
    advancePhase();
  }

  /* ── Submit all recall answers for scoring ── */
  async function handleRecallComplete(recallAnswers: DiagnosticAnswer[]) {
    if (!store.attemptId) return;
    setSubmitting(true);
    try {
      const res = await diagnosticApi.submit({
        attempt_id: store.attemptId,
        answers:    [...answers, ...recallAnswers],
      });
      setProfile(res.learning_profile);

      /* Update user profile in auth store */
      if (user) {
        setUser({ ...user, learning_profile: res.learning_profile });
      }
    } catch {
      toast.error("Could not score your diagnostic. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const stepIdx = PHASE_STEPS.indexOf(phase);

  /* ── Render ── */
  return (
    <>
      <style>{`
        .diag-page {
          max-width: 820px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }

        /* Phase header */
        .diag-header {
          margin-bottom: 40px;
        }
        .diag-phase-steps {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .diag-step-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--edge2);
          transition: background 0.3s;
          flex-shrink: 0;
        }
        .diag-step-dot.done    { background: var(--flame); }
        .diag-step-dot.current { background: var(--ember); box-shadow: 0 0 6px rgba(217,79,43,0.5); }
        .diag-step-line {
          flex: 1;
          height: 1px;
          background: var(--edge);
          min-width: 12px;
        }

        .diag-phase-label {
          font-size: 11px;
          color: var(--flame);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 6px;
          font-weight: 500;
        }
        .diag-phase-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 3.5vw, 32px);
          font-weight: 500;
          color: var(--text);
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        /* Loading */
        .diag-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 80px 24px;
          text-align: center;
        }
        .diag-loading-spinner {
          width: 36px; height: 36px;
          border: 3px solid var(--edge);
          border-top-color: var(--ember);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .diag-loading-text {
          font-size: 15px;
          color: var(--soft);
          font-weight: 300;
          line-height: 1.6;
        }

        /* Reset */
        .diag-reset {
          margin-top: 20px;
          text-align: center;
        }
        .diag-reset-btn {
          background: none;
          border: 1px solid var(--edge);
          color: var(--whisper);
          font-size: 12px;
          padding: 7px 16px;
          border-radius: 100px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s, border-color 0.2s;
        }
        .diag-reset-btn:hover { color: var(--soft); border-color: var(--edge2); }

        @media (max-width: 640px) {
          .diag-page { padding: 28px 18px 60px; }
        }
      `}</style>

      <div className="diag-page">
        {/* Phase stepper */}
        {phase !== "idle" && phase !== "complete" && (
          <div className="diag-header">
            <div className="diag-phase-steps">
              {PHASE_STEPS.filter(s => s !== "complete").map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, flex: i < PHASE_STEPS.length - 2 ? 1 : 0 }}>
                  <div className={`diag-step-dot${i < stepIdx ? " done" : i === stepIdx ? " current" : ""}`}/>
                  {i < PHASE_STEPS.length - 2 && <div className="diag-step-line"/>}
                </div>
              ))}
            </div>
            <p className="diag-phase-label">
              {phase === "break" ? "Distraction break" : `Step ${stepIdx + 1} of ${PHASE_STEPS.length - 1}`}
            </p>
            <h1 className="diag-phase-title">{PHASE_LABELS[phase]}</h1>
          </div>
        )}

        {/* Loading */}
        {(loading || submitting) && (
          <div className="diag-loading">
            <div className="diag-loading-spinner"/>
            <p className="diag-loading-text">
              {submitting ? "Calculating your learning profile…" : "Preparing your diagnostic…"}
            </p>
          </div>
        )}

        {/* Phases */}
        {!loading && !submitting && (
          <>
            {phase === "round_flashcards" && roundQuestions.length > 0 && (
              <FlashcardRound questions={roundQuestions} onComplete={handleRoundComplete}/>
            )}
            {phase === "round_practice" && roundQuestions.length > 0 && (
              <PracticeRound questions={roundQuestions} onComplete={handleRoundComplete}/>
            )}
            {phase === "round_visual" && roundQuestions.length > 0 && (
              <VisualRound questions={roundQuestions} onComplete={handleRoundComplete}/>
            )}
            {phase === "round_teach_back" && roundQuestions.length > 0 && (
              <TeachBackRound questions={roundQuestions} onComplete={advancePhase}/>
            )}
            {phase === "break" && (
              <BreakScreen onComplete={advancePhase}/>
            )}
            {phase === "recall" && recallQuestions.length > 0 && (
              <RecallTest questions={recallQuestions} onComplete={handleRecallComplete}/>
            )}
            {phase === "complete" && profile && store.answers.length > 0 && (
              <ProfileResult
                profile={profile}
                scores={{
                  flashcards:  { accuracy: 60, speed: 75, retention: 55, final: 63 },
                  practice:    { accuracy: 88, speed: 82, retention: 84, final: 86 },
                  visual:      { accuracy: 52, speed: 68, retention: 48, final: 54 },
                  teach_back:  { accuracy: 74, speed: 71, retention: 78, final: 74 },
                }}
              />
            )}
          </>
        )}

        {/* Reset link */}
        {phase !== "idle" && phase !== "complete" && !loading && (
          <div className="diag-reset">
            <button className="diag-reset-btn" onClick={() => { reset(); setTimeout(initDiagnostic, 100); }}>
              Restart diagnostic
            </button>
          </div>
        )}
      </div>
    </>
  );
}
