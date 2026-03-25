"use client";
import { useState, useEffect } from "react";
import type { DiagnosticQuestion } from "@neuropath/types";
import { useDiagnosticStore } from "@/store/diagnostic.store";

interface Props { questions: DiagnosticQuestion[]; onComplete: () => void; }

export default function PracticeRound({ questions, onComplete }: Props) {
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
    submitAnswer({ question_id: question.id, method: "practice", correct: isCorrect, time_ms: 0, user_answer: selected });
    setRevealed(true);
  }
  function handleNext() {
    if (isLast) { onComplete(); return; }
    setIndex(i => i + 1);
  }
  if (!question) return null;

  return (
    <div className="flex flex-col gap-5 w-full max-w-[600px] mx-auto">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[rgba(240,237,232,0.25)] tracking-[0.04em]">Question {index + 1} of {questions.length}</span>
        <span className="text-xs text-[rgba(240,237,232,0.25)] tracking-[0.04em]">{Math.round((index / questions.length) * 100)}% done</span>
      </div>
      <div className="w-full h-[3px] bg-[rgba(255,255,255,0.07)] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#d94f2b] to-[#e8603c] rounded-full" style={{ width: `${(index / questions.length) * 100}%` }}/>
      </div>

      <div className="relative overflow-hidden bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-[18px] px-7 py-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.018)] to-transparent pointer-events-none rounded-[inherit]"/>
        <p className="text-[10.5px] text-[#d94f2b] tracking-[1.2px] uppercase font-medium mb-3">{question.difficulty}</p>
        <p className="font-serif text-[clamp(16px,2.5vw,20px)] font-medium text-[#f0ede8] leading-[1.45] tracking-[-0.01em]">{question.question}</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {choices.map((c, i) => {
          let cls = "border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.025)] text-[rgba(240,237,232,0.55)]";
          if (revealed) {
            if (c === question.answer) cls = "border-[rgba(34,197,94,0.5)] bg-[rgba(34,197,94,0.06)] text-[#f0ede8]";
            else if (c === selected)  cls = "border-[rgba(239,68,68,0.45)] bg-[rgba(239,68,68,0.06)] text-[#f0ede8]";
          } else if (c === selected)  cls = "border-[rgba(217,79,43,0.4)] bg-[rgba(217,79,43,0.06)] text-[#f0ede8]";
          return (
            <button key={c} onClick={() => !revealed && setSelected(c)} disabled={revealed}
              className={`flex items-center gap-3.5 px-[18px] py-3.5 border rounded-xl cursor-pointer transition-all font-sans w-full text-left text-sm font-light ${cls} ${!revealed ? "hover:border-[rgba(255,255,255,0.13)] hover:bg-[rgba(255,255,255,0.04)]" : "cursor-default"}`}>
              <span className="w-[26px] h-[26px] rounded-full border border-[rgba(255,255,255,0.13)] flex items-center justify-center text-[11.5px] font-semibold shrink-0">{String.fromCharCode(65 + i)}</span>
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
