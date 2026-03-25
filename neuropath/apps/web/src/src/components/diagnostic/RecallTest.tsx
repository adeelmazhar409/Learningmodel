"use client";
import { useState, useEffect, useCallback } from "react";
import type { DiagnosticQuestion, DiagnosticAnswer } from "@neuropath/types";

interface Props { questions: DiagnosticQuestion[]; onComplete: (answers: DiagnosticAnswer[]) => void; }
const TIME_PER_QUESTION = 25;

export default function RecallTest({ questions, onComplete }: Props) {
  const [index,      setIndex]      = useState(0);
  const [selected,   setSelected]   = useState<string | null>(null);
  const [answers,    setAnswers]     = useState<DiagnosticAnswer[]>([]);
  const [timeLeft,   setTimeLeft]    = useState(TIME_PER_QUESTION);
  const [startedAt,  setStartedAt]   = useState(Date.now());
  const [submitting, setSubmitting]  = useState(false);
  const question = questions[index];
  const isLast   = index === questions.length - 1;
  const choices  = question?.choices ?? [];

  const advance = useCallback((forced = false) => {
    if (!question) return;
    const answer: DiagnosticAnswer = { question_id: question.id, method: question.method, correct: forced ? false : selected === question.answer, time_ms: Date.now() - startedAt, user_answer: forced ? "" : (selected ?? "") };
    const updated = [...answers, answer];
    setAnswers(updated);
    if (isLast || updated.length === questions.length) { setSubmitting(true); onComplete(updated); return; }
    setIndex(i => i + 1); setSelected(null); setTimeLeft(TIME_PER_QUESTION); setStartedAt(Date.now());
  }, [question, selected, answers, isLast, questions.length, startedAt, onComplete]);

  useEffect(() => {
    if (submitting) return;
    if (timeLeft <= 0) { advance(true); return; }
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, advance, submitting]);

  if (!question || submitting) return (
    <div className="text-center py-16">
      <p className="font-serif text-[22px] text-[#f0ede8] mb-2.5">Calculating your results…</p>
      <p className="text-sm text-[rgba(240,237,232,0.55)] font-light">This takes just a moment.</p>
    </div>
  );

  const timerPct  = (timeLeft / TIME_PER_QUESTION) * 100;
  const timerWarn = timeLeft <= 8;

  return (
    <div className="flex flex-col gap-5 w-full max-w-[620px] mx-auto">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-[rgba(240,237,232,0.25)] tracking-[0.04em] shrink-0">Question {index + 1} / {questions.length}</span>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-20 h-1 bg-[rgba(255,255,255,0.07)] rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-[width] duration-1000 linear ${timerWarn ? "bg-[#e8603c]" : "bg-gradient-to-r from-[#d94f2b] to-[#e8603c]"}`} style={{ width: `${timerPct}%` }}/>
          </div>
          <span className={`text-[15px] font-serif font-semibold min-w-[28px] text-right ${timerWarn ? "text-[#e8603c]" : "text-[#f0ede8]"}`}>{timeLeft}s</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2.5">
        <span className="text-[11px] text-[rgba(240,237,232,0.25)] shrink-0">Overall</span>
        <div className="flex-1 h-[3px] bg-[rgba(255,255,255,0.07)] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#d94f2b] to-[#e8603c] rounded-full" style={{ width: `${(index / questions.length) * 100}%` }}/>
        </div>
        <span className="text-[11px] text-[rgba(240,237,232,0.25)] shrink-0">{Math.round((index / questions.length) * 100)}%</span>
      </div>

      <span className="inline-flex self-start text-[10.5px] text-[#d94f2b] border border-[rgba(217,79,43,0.22)] rounded-full px-2.5 py-0.5 bg-[rgba(217,79,43,0.05)] tracking-[0.8px] uppercase font-medium">
        {question.method.replace("_","-")}
      </span>

      <div className="relative overflow-hidden bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-[18px] px-7 py-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.018)] to-transparent pointer-events-none rounded-[inherit]"/>
        <p className="font-serif text-[clamp(16px,2.5vw,19px)] font-medium text-[#f0ede8] leading-[1.48] tracking-[-0.01em]">{question.question}</p>
      </div>

      <div className="flex flex-col gap-2">
        {choices.map((c, i) => (
          <button key={c} onClick={() => setSelected(c)}
            className={`flex items-center gap-3 px-[17px] py-3 border rounded-xl cursor-pointer transition-all font-sans w-full text-left text-sm font-light ${selected === c ? "border-[rgba(217,79,43,0.45)] bg-[rgba(217,79,43,0.07)] text-[#f0ede8]" : "border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.025)] text-[rgba(240,237,232,0.55)] hover:border-[rgba(255,255,255,0.13)] hover:bg-[rgba(255,255,255,0.04)]"}`}>
            <span className={`w-[25px] h-[25px] rounded-full border flex items-center justify-center text-[11px] font-semibold shrink-0 transition-all ${selected === c ? "bg-[rgba(217,79,43,0.2)] border-[rgba(217,79,43,0.5)] text-[#e8603c]" : "border-[rgba(255,255,255,0.13)] text-[rgba(240,237,232,0.25)]"}`}>
              {String.fromCharCode(65 + i)}
            </span>
            {c}
          </button>
        ))}
      </div>

      <button onClick={() => advance(false)} disabled={!selected}
        className="w-full flex items-center justify-center bg-[#f0ede8] text-[#0c0c0e] rounded-full py-3.5 text-sm font-medium transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">
        {isLast ? "Submit answers" : "Next question →"}
      </button>
    </div>
  );
}
