"use client";
import { useState } from "react";
import type { QuizQuestion } from "@neuropath/types";

interface Props { questions: QuizQuestion[]; }

export default function QuizViewer({ questions }: Props) {
  const [index,    setIndex]    = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score,    setScore]    = useState(0);
  const [done,     setDone]     = useState(false);
  const [answers,  setAnswers]  = useState<boolean[]>([]);
  const question  = questions[index];
  const isLast    = index === questions.length - 1;
  const isCorrect = selected === question?.answer;
  const choices   = question?.choices ?? [];

  function handleCheck() {
    if (!selected || revealed) return;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(a => [...a, isCorrect]); setRevealed(true);
  }
  function handleNext() {
    if (isLast) { setDone(true); return; }
    setIndex(i => i + 1); setSelected(null); setRevealed(false);
  }
  function restart() { setIndex(0); setSelected(null); setRevealed(false); setScore(0); setDone(false); setAnswers([]); }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const r = 45; const circ = 2 * Math.PI * r;
    return (
      <div className="flex flex-col items-center gap-6 max-w-[480px] mx-auto text-center">
        <div className="relative w-[120px] h-[120px] shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" cx="50" cy="50" r={r}/>
            <circle fill="none" stroke="#d94f2b" strokeWidth="6" strokeLinecap="round" cx="50" cy="50" r={r}
              strokeDasharray={circ} strokeDashoffset={circ - (circ * pct) / 100}/>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-[28px] font-semibold text-[#f0ede8] leading-none">{score}/{questions.length}</span>
            <span className="text-[10px] text-[rgba(240,237,232,0.25)]">{pct}%</span>
          </div>
        </div>
        <div>
          <p className="font-serif text-[22px] font-medium text-[#f0ede8] mb-1">{pct >= 80 ? "Great work." : pct >= 50 ? "Good effort." : "Keep practising."}</p>
          <p className="text-sm text-[rgba(240,237,232,0.55)] font-light leading-relaxed">{pct >= 80 ? "Your understanding of this topic is solid." : "Review the questions you missed and try again."}</p>
        </div>
        <div className="w-full flex flex-col gap-2">
          {questions.map((q, i) => (
            <div key={q.id} className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-xl text-[13px] text-[rgba(240,237,232,0.55)] font-light text-left">
              <span className="text-sm shrink-0">{answers[i] ? "✓" : "✗"}</span><span>{q.question}</span>
            </div>
          ))}
        </div>
        <button onClick={restart} className="w-full flex items-center justify-center bg-[#f0ede8] text-[#0c0c0e] rounded-full py-3.5 text-sm font-medium transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">Retake quiz</button>
      </div>
    );
  }

  if (!question) return null;
  return (
    <div className="flex flex-col gap-5 w-full max-w-[580px] mx-auto">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[rgba(240,237,232,0.25)] tracking-[0.04em]">Question {index + 1} of {questions.length}</span>
        <span className="text-xs text-[rgba(240,237,232,0.25)] tracking-[0.04em]">Score: {score}</span>
      </div>
      <div className="w-full h-[3px] bg-[rgba(255,255,255,0.07)] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#d94f2b] to-[#e8603c] rounded-full" style={{ width: `${(index / questions.length) * 100}%` }}/>
      </div>
      <div className="relative overflow-hidden bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-[18px] px-7 py-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.018)] to-transparent pointer-events-none rounded-[inherit]"/>
        <p className="font-serif text-[clamp(16px,2.5vw,19px)] font-medium text-[#f0ede8] leading-[1.48] tracking-[-0.01em]">{question.question}</p>
      </div>
      <div className="flex flex-col gap-2.5">
        {choices.map((c, i) => {
          let cls = "border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.025)] text-[rgba(240,237,232,0.55)]";
          if (revealed) {
            if (c === question.answer) cls = "border-[rgba(34,197,94,0.5)] bg-[rgba(34,197,94,0.06)] text-[#4ade80]";
            else if (c === selected)  cls = "border-[rgba(239,68,68,0.45)] bg-[rgba(239,68,68,0.06)] text-[#f87171]";
          } else if (c === selected)  cls = "border-[rgba(217,79,43,0.4)] bg-[rgba(217,79,43,0.06)] text-[#f0ede8]";
          return (
            <button key={c} onClick={() => !revealed && setSelected(c)} disabled={revealed}
              className={`flex items-center gap-3 px-[17px] py-3 border rounded-xl cursor-pointer transition-all font-sans w-full text-left text-sm font-light leading-relaxed ${cls} ${!revealed ? "hover:border-[rgba(255,255,255,0.13)] hover:bg-[rgba(255,255,255,0.04)]" : "cursor-default"}`}>
              <span className="w-[25px] h-[25px] rounded-full border border-[rgba(255,255,255,0.13)] flex items-center justify-center text-[11px] font-semibold shrink-0">{String.fromCharCode(65 + i)}</span>
              {c}
            </button>
          );
        })}
      </div>
      {revealed && question.explanation && (
        <div className="px-[18px] py-3.5 bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.07)] rounded-xl text-[13.5px] text-[rgba(240,237,232,0.55)] leading-relaxed font-light">
          <strong className="text-[#f0ede8] font-medium">{isCorrect ? "Correct." : "Not quite."}</strong>{" "}{question.explanation}
        </div>
      )}
      <div>
        {!revealed
          ? <button onClick={handleCheck} disabled={!selected} className="w-full flex items-center justify-center bg-[#f0ede8] text-[#0c0c0e] rounded-full py-3.5 text-sm font-medium transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">Check answer</button>
          : <button onClick={handleNext} className="w-full flex items-center justify-center bg-[#f0ede8] text-[#0c0c0e] rounded-full py-3.5 text-sm font-medium transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">{isLast ? "See results" : "Next →"}</button>
        }
      </div>
    </div>
  );
}
