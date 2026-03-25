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
  idle: "Getting ready", round_flashcards: "Round 1 — Flashcards", round_practice: "Round 2 — Practice",
  round_visual: "Round 3 — Visual", round_teach_back: "Round 4 — Teach-back",
  break: "Break", recall: "Memory Recall Test", complete: "Results",
};
const PHASE_STEPS = ["round_flashcards","round_practice","round_visual","round_teach_back","break","recall","complete"];

export default function DiagnosticPage() {
  const { user, setUser } = useAuthStore();
  const store = useDiagnosticStore();
  const { phase, profile, answers, roundQuestions, recallQuestions, startDiagnostic, setRoundQuestions, setRecallQuestions, advancePhase, setProfile, reset } = store;
  const [loading,    setLoading]    = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (phase !== "idle") return; initDiagnostic(); }, []); // eslint-disable-line

  async function initDiagnostic() {
    setLoading(true);
    try {
      const gradeNum  = user?.grade_level ?? 10;
      const gradeBand = gradeNum <= 6 ? "5-6" : gradeNum <= 8 ? "7-8" : gradeNum <= 10 ? "9-10" : "11-12";
      const res = await diagnosticApi.start({ subject: "General (Critical Thinking)", grade_band: gradeBand });
      startDiagnostic(res.attempt_id);
      store.setRoundQuestions(res.round_questions.filter(q => q.method === "flashcards"));
      setRecallQuestions(res.recall_questions);
    } catch { toast.error("Could not load diagnostic. Please refresh."); }
    finally { setLoading(false); }
  }

  function handleRoundComplete() {
    const gradeNum  = user?.grade_level ?? 10;
    const gradeBand = gradeNum <= 6 ? "5-6" : gradeNum <= 8 ? "7-8" : gradeNum <= 10 ? "9-10" : "11-12";
    const nextMethod: Record<string, string> = { round_flashcards: "practice", round_practice: "visual", round_visual: "teach_back" };
    const nm = nextMethod[phase];
    if (nm && store.attemptId) {
      diagnosticApi.start({ subject: "General (Critical Thinking)", grade_band: gradeBand })
        .then(res => setRoundQuestions(res.round_questions.filter(q => q.method === nm)))
        .catch(() => {});
    }
    advancePhase();
  }

  async function handleRecallComplete(recallAnswers: DiagnosticAnswer[]) {
    if (!store.attemptId) return;
    setSubmitting(true);
    try {
      const res = await diagnosticApi.submit({ attempt_id: store.attemptId, answers: [...answers, ...recallAnswers] });
      setProfile(res.learning_profile);
      if (user) setUser({ ...user, learning_profile: res.learning_profile });
    } catch { toast.error("Could not score your diagnostic. Please try again."); }
    finally { setSubmitting(false); }
  }

  const stepIdx = PHASE_STEPS.indexOf(phase);

  return (
    <div className="max-w-[820px] mx-auto px-6 py-10 pb-20">

      {/* Phase stepper */}
      {phase !== "idle" && phase !== "complete" && (
        <div className="mb-10">
          <div className="flex items-center gap-1.5 mb-4 flex-wrap">
            {PHASE_STEPS.filter(s => s !== "complete").map((s, i) => (
              <div key={s} className="flex items-center gap-1.5 flex-1">
                <div className={`w-2 h-2 rounded-full shrink-0 transition-all ${i < stepIdx ? "bg-[#d94f2b]" : i === stepIdx ? "bg-[#e8603c] shadow-[0_0_6px_rgba(217,79,43,0.5)]" : "bg-[rgba(255,255,255,0.13)]"}`}/>
                {i < PHASE_STEPS.length - 2 && <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)] min-w-[12px]"/>}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#d94f2b] tracking-[2px] uppercase font-medium mb-1.5">
            {phase === "break" ? "Distraction break" : `Step ${stepIdx + 1} of ${PHASE_STEPS.length - 1}`}
          </p>
          <h1 className="font-serif text-[clamp(22px,3.5vw,32px)] font-medium text-[#f0ede8] tracking-[-0.02em] leading-tight">{PHASE_LABELS[phase]}</h1>
        </div>
      )}

      {/* Loading */}
      {(loading || submitting) && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="w-9 h-9 border-[3px] border-[rgba(255,255,255,0.07)] border-t-[#e8603c] rounded-full animate-spin"/>
          <p className="text-[15px] text-[rgba(240,237,232,0.55)] font-light leading-relaxed">
            {submitting ? "Calculating your learning profile…" : "Preparing your diagnostic…"}
          </p>
        </div>
      )}

      {!loading && !submitting && (
        <>
          {phase === "round_flashcards"  && roundQuestions.length > 0  && <FlashcardRound  questions={roundQuestions}  onComplete={handleRoundComplete}/>}
          {phase === "round_practice"    && roundQuestions.length > 0  && <PracticeRound   questions={roundQuestions}  onComplete={handleRoundComplete}/>}
          {phase === "round_visual"      && roundQuestions.length > 0  && <VisualRound      questions={roundQuestions}  onComplete={handleRoundComplete}/>}
          {phase === "round_teach_back"  && roundQuestions.length > 0  && <TeachBackRound   questions={roundQuestions}  onComplete={advancePhase}/>}
          {phase === "break"             && <BreakScreen onComplete={advancePhase}/>}
          {phase === "recall"            && recallQuestions.length > 0 && <RecallTest questions={recallQuestions} onComplete={handleRecallComplete}/>}
          {phase === "complete"          && profile && (
            <ProfileResult profile={profile} scores={{ flashcards:{accuracy:60,speed:75,retention:55,final:63}, practice:{accuracy:88,speed:82,retention:84,final:86}, visual:{accuracy:52,speed:68,retention:48,final:54}, teach_back:{accuracy:74,speed:71,retention:78,final:74} }}/>
          )}
        </>
      )}

      {phase !== "idle" && phase !== "complete" && !loading && (
        <div className="mt-5 text-center">
          <button onClick={() => { reset(); setTimeout(initDiagnostic, 100); }}
            className="bg-transparent border border-[rgba(255,255,255,0.07)] text-[rgba(240,237,232,0.25)] text-xs px-4 py-1.5 rounded-full cursor-pointer transition-all hover:text-[rgba(240,237,232,0.55)] hover:border-[rgba(255,255,255,0.13)] font-sans">
            Restart diagnostic
          </button>
        </div>
      )}
    </div>
  );
}
