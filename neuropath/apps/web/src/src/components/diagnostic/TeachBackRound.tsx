"use client";
import { useState, useEffect } from "react";
import type { DiagnosticQuestion } from "@neuropath/types";
import { useDiagnosticStore } from "@/store/diagnostic.store";

interface Props { questions: DiagnosticQuestion[]; onComplete: () => void; }
const MIN_CHARS = 30;

export default function TeachBackRound({ questions, onComplete }: Props) {
  const { submitAnswer, startQuestion } = useDiagnosticStore();
  const [index,     setIndex]     = useState(0);
  const [response,  setResponse]  = useState("");
  const [revealed,  setRevealed]  = useState(false);
  const [selfScore, setSelfScore] = useState<"got_it"|"partial"|"missed"|null>(null);
  const question  = questions[index];
  const isLast    = index === questions.length - 1;
  const canCheck  = response.trim().length >= MIN_CHARS;

  useEffect(() => { startQuestion(); setResponse(""); setRevealed(false); setSelfScore(null); }, [index]); // eslint-disable-line

  function handleRate(score: "got_it"|"partial"|"missed") {
    setSelfScore(score);
    submitAnswer({ question_id: question.id, method: "teach_back", correct: score !== "missed", time_ms: 0, user_answer: response });
  }
  function handleNext() { if (isLast) { onComplete(); return; } setIndex(i => i + 1); }
  if (!question) return null;

  return (
    <div className="flex flex-col gap-5 w-full max-w-[620px] mx-auto">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[rgba(240,237,232,0.25)] tracking-[0.04em]">Question {index + 1} of {questions.length}</span>
        <span className="text-xs text-[rgba(240,237,232,0.25)] tracking-[0.04em]">{Math.round((index / questions.length) * 100)}% done</span>
      </div>
      <div className="w-full h-[3px] bg-[rgba(255,255,255,0.07)] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#d94f2b] to-[#e8603c] rounded-full" style={{ width: `${(index / questions.length) * 100}%` }}/>
      </div>

      <div className="relative overflow-hidden bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-[18px] px-7 py-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.018)] to-transparent pointer-events-none rounded-[inherit]"/>
        <p className="text-[10.5px] text-[#d94f2b] tracking-[1.2px] uppercase font-medium mb-2.5">Teach-back prompt</p>
        <p className="font-serif text-[clamp(16px,2.5vw,20px)] font-medium text-[#f0ede8] leading-[1.5] tracking-[-0.01em]">{question.question}</p>
      </div>

      <div className="relative">
        <textarea value={response} onChange={e => setResponse(e.target.value)} disabled={revealed}
          className="w-full min-h-[140px] bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-xl px-4 py-4 text-[14.5px] text-[#f0ede8] font-sans font-light leading-relaxed outline-none transition-all resize-y placeholder:text-[rgba(240,237,232,0.25)] focus:border-[rgba(217,79,43,0.45)] focus:shadow-[0_0_0_3px_rgba(217,79,43,0.07)] disabled:opacity-70 disabled:cursor-default"
          placeholder="Write your explanation here — imagine you're teaching a classmate who has never heard of this topic before…"/>
        <span className={`absolute bottom-2.5 right-3.5 text-[11px] pointer-events-none ${canCheck ? "text-[#e8603c]" : "text-[rgba(240,237,232,0.25)]"}`}>
          {response.trim().length}/{MIN_CHARS}
        </span>
      </div>

      {revealed && (
        <>
          <div className="px-5 py-4 bg-[rgba(217,79,43,0.06)] border border-[rgba(217,79,43,0.2)] rounded-xl">
            <p className="text-[10.5px] text-[#d94f2b] tracking-[1.2px] uppercase font-medium mb-2">Model answer</p>
            <p className="text-sm text-[rgba(240,237,232,0.55)] font-light leading-[1.7]">{question.answer}</p>
          </div>
          {!selfScore ? (
            <>
              <p className="text-[13px] text-[rgba(240,237,232,0.55)] font-light text-center">Compare your explanation to the model answer. How did you do?</p>
              <div className="grid grid-cols-3 gap-2.5">
                {([["got_it","✓ Got it","border-[rgba(34,197,94,0.5)] bg-[rgba(34,197,94,0.07)] text-[#4ade80]"],["partial","~ Partially","border-[rgba(251,191,36,0.5)] bg-[rgba(251,191,36,0.07)] text-[#fbbf24]"],["missed","✗ Missed it","border-[rgba(239,68,68,0.45)] bg-[rgba(239,68,68,0.06)] text-[#f87171]"]] as const).map(([val, label, cls]) => (
                  <button key={val} onClick={() => handleRate(val)} className={`py-3 rounded-xl border font-medium text-[13px] font-sans cursor-pointer transition-all ${cls}`}>{label}</button>
                ))}
              </div>
            </>
          ) : (
            <button onClick={handleNext} className="w-full flex items-center justify-center bg-[#f0ede8] text-[#0c0c0e] rounded-full py-3.5 text-sm font-medium transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">
              {isLast ? "Finish round →" : "Next question →"}
            </button>
          )}
        </>
      )}

      {!revealed && (
        <button onClick={() => canCheck && setRevealed(true)} disabled={!canCheck}
          className="w-full flex items-center justify-center bg-[#f0ede8] text-[#0c0c0e] rounded-full py-3.5 text-sm font-medium transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">
          {canCheck ? "Reveal model answer" : `Write at least ${MIN_CHARS} characters to continue`}
        </button>
      )}
    </div>
  );
}
