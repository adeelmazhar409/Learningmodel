"use client";
import { useState } from "react";
import type { DiagnosticQuestion } from "@neuropath/types";
import { useDiagnosticStore } from "@/store/diagnostic.store";

interface Props { questions: DiagnosticQuestion[]; onComplete: () => void; }

export default function FlashcardRound({ questions, onComplete }: Props) {
  const { submitAnswer, startQuestion } = useDiagnosticStore();
  const [index,    setIndex]    = useState(0);
  const [flipped,  setFlipped]  = useState(false);
  const [answered, setAnswered] = useState(false);
  const question = questions[index];
  const isLast   = index === questions.length - 1;

  function handleFlip() {
    if (answered) return;
    if (!flipped) { setFlipped(true); startQuestion(); }
  }
  function handleAnswer(correct: boolean) {
    if (answered) return;
    submitAnswer({ question_id: question.id, method: "flashcards", correct, time_ms: 0, user_answer: correct ? question.answer : "incorrect" });
    setAnswered(true);
  }
  function handleNext() {
    if (isLast) { onComplete(); return; }
    setIndex(i => i + 1); setFlipped(false); setAnswered(false);
  }
  if (!question) return null;

  return (
    <div className="flex flex-col gap-5 w-full max-w-[560px] mx-auto">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[rgba(240,237,232,0.25)] tracking-[0.04em]">Card {index + 1} of {questions.length}</span>
        <span className="text-xs text-[rgba(240,237,232,0.25)] tracking-[0.04em]">{Math.round((index / questions.length) * 100)}% done</span>
      </div>
      <div className="w-full h-[3px] bg-[rgba(255,255,255,0.07)] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#d94f2b] to-[#e8603c] rounded-full" style={{ width: `${(index / questions.length) * 100}%` }}/>
      </div>

      <div className="w-full h-[240px] cursor-pointer" style={{ perspective: "900px" }} onClick={handleFlip}>
        <div className="w-full h-full relative rounded-[20px] transition-transform duration-500" style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "" }}>
          <div className="absolute inset-0 rounded-[20px] bg-[#141418] border border-[rgba(255,255,255,0.07)] flex flex-col items-center justify-center px-8 py-7 text-center gap-2.5" style={{ backfaceVisibility: "hidden" }}>
            <p className="text-[10.5px] text-[rgba(240,237,232,0.25)] tracking-[1px] uppercase">Question — tap to reveal</p>
            <p className="font-serif text-[clamp(16px,2.5vw,20px)] font-medium text-[#f0ede8] leading-[1.45] tracking-[-0.01em]">{question.question}</p>
          </div>
          <div className="absolute inset-0 rounded-[20px] bg-[rgba(217,79,43,0.08)] border border-[rgba(217,79,43,0.25)] flex flex-col items-center justify-center px-8 py-7 text-center gap-2.5" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <p className="text-[10.5px] text-[rgba(240,237,232,0.25)] tracking-[1px] uppercase">Answer</p>
            <p className="text-[17px] text-[#f0ede8] leading-[1.55] font-normal">{question.answer}</p>
          </div>
        </div>
      </div>

      {flipped && !answered && (
        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={() => handleAnswer(false)} className="py-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.025)] text-[rgba(240,237,232,0.55)] text-[13.5px] font-medium font-sans cursor-pointer transition-all hover:border-[rgba(255,255,255,0.13)] hover:text-[#f0ede8]">✗ &nbsp;Didn&apos;t know</button>
          <button onClick={() => handleAnswer(true)}  className="py-3 rounded-xl border border-[rgba(217,79,43,0.28)] bg-[rgba(217,79,43,0.08)] text-[#e8603c] text-[13.5px] font-medium font-sans cursor-pointer transition-all hover:border-[rgba(217,79,43,0.45)] hover:bg-[rgba(217,79,43,0.14)]">✓ &nbsp;Got it</button>
        </div>
      )}
      {answered && (
        <button onClick={handleNext} className="w-full flex items-center justify-center bg-[#f0ede8] text-[#0c0c0e] rounded-full py-3.5 text-sm font-medium transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">
          {isLast ? "Finish round →" : "Next card →"}
        </button>
      )}
      {!flipped && <p className="text-xs text-[rgba(240,237,232,0.25)] text-center">Tap the card to flip it</p>}
    </div>
  );
}
