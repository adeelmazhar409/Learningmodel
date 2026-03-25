"use client";
import { useState, useEffect } from "react";
import type { DiagnosticQuestion } from "@neuropath/types";
import { useDiagnosticStore } from "@/store/diagnostic.store";

interface Props { questions: DiagnosticQuestion[]; onComplete: () => void; }

export default function VisualRound({ questions, onComplete }: Props) {
  const { submitAnswer, startQuestion } = useDiagnosticStore();
  const [index,    setIndex]    = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const question  = questions[index];
  const isLast    = index === questions.length - 1;
  const isCorrect = selected === question?.answer;
  const choices   = question?.choices ?? [];

  useEffect(() => { startQuestion(); setSelected(null); setRevealed(false); }, [index]); // eslint-disable-line

  function handleCheck() {
    if (!selected || revealed) return;
    submitAnswer({ question_id: question.id, method: "visual", correct: isCorrect, time_ms: 0, user_answer: selected });
    setRevealed(true);
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

      {/* Diagram */}
      <div className="relative overflow-hidden bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-[18px] px-7 py-7 flex flex-col items-center gap-4 min-h-[200px] justify-center">
        <p className="text-[11px] text-[rgba(240,237,232,0.25)] tracking-[1.2px] uppercase">Study the diagram</p>
        <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[340px]">
          <ellipse cx="160" cy="100" rx="90" ry="60" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.3)" strokeWidth="1.5"/>
          <line x1="160" y1="40" x2="160" y2="160" stroke="rgba(34,197,94,0.4)" strokeWidth="1.5" strokeDasharray="4 3"/>
          <circle cx="50" cy="40" r="16" fill="rgba(251,191,36,0.12)" stroke="rgba(251,191,36,0.4)" strokeWidth="1.5"/>
          <text x="50" y="44" textAnchor="middle" fill="rgba(251,191,36,0.8)" fontSize="12">☀</text>
          <line x1="72" y1="52" x2="105" y2="80" stroke="rgba(251,191,36,0.35)" strokeWidth="1" strokeDasharray="3 2"/>
          <text x="16" y="115" fill="rgba(240,237,232,0.4)" fontSize="9">CO₂</text>
          <line x1="60" y1="112" x2="92" y2="105" stroke="rgba(240,237,232,0.25)" strokeWidth="1" strokeDasharray="3 2"/>
          <line x1="228" y1="90" x2="262" y2="78" stroke="rgba(34,197,94,0.35)" strokeWidth="1" strokeDasharray="3 2"/>
          <text x="265" y="82" fill="rgba(34,197,94,0.6)" fontSize="9">O₂</text>
          <line x1="160" y1="165" x2="160" y2="188" stroke="rgba(96,165,250,0.4)" strokeWidth="1" strokeDasharray="3 2"/>
          <text x="168" y="196" fill="rgba(96,165,250,0.5)" fontSize="9">H₂O</text>
          <text x="160" y="97" textAnchor="middle" fill="rgba(240,237,232,0.5)" fontSize="8">Chloroplast</text>
          <text x="160" y="108" textAnchor="middle" fill="rgba(240,237,232,0.3)" fontSize="7">(inside leaf)</text>
        </svg>
      </div>

      <p className="font-serif text-[clamp(16px,2.5vw,19px)] font-medium text-[#f0ede8] leading-[1.45] tracking-[-0.01em] px-1">{question.question}</p>

      <div className="grid grid-cols-2 gap-2.5 max-[480px]:grid-cols-1">
        {choices.map(c => {
          let cls = "border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.025)] text-[rgba(240,237,232,0.55)]";
          if (revealed) {
            if (c === question.answer) cls = "border-[rgba(34,197,94,0.5)] bg-[rgba(34,197,94,0.06)] text-[#4ade80]";
            else if (c === selected)  cls = "border-[rgba(239,68,68,0.45)] bg-[rgba(239,68,68,0.06)] text-[#f87171]";
          } else if (c === selected)  cls = "border-[rgba(217,79,43,0.4)] bg-[rgba(217,79,43,0.06)] text-[#f0ede8]";
          return (
            <button key={c} onClick={() => !revealed && setSelected(c)} disabled={revealed}
              className={`px-4 py-3.5 border rounded-xl cursor-pointer transition-all font-sans text-[13.5px] font-light text-left leading-relaxed ${cls} ${!revealed ? "hover:border-[rgba(255,255,255,0.13)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#f0ede8]" : "cursor-default"}`}>
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

      {!revealed
        ? <button onClick={handleCheck} disabled={!selected} className="w-full flex items-center justify-center bg-[#f0ede8] text-[#0c0c0e] rounded-full py-3.5 text-sm font-medium transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">Check answer</button>
        : <button onClick={handleNext} className="w-full flex items-center justify-center bg-[#f0ede8] text-[#0c0c0e] rounded-full py-3.5 text-sm font-medium transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">{isLast ? "Finish round →" : "Next question →"}</button>
      }
    </div>
  );
}
