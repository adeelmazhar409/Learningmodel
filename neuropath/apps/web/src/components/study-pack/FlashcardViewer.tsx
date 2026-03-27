"use client";
import { useState } from "react";
import type { Flashcard } from "@neuropath/types";

interface Props { flashcards: Flashcard[]; }

export default function FlashcardViewer({ flashcards }: Props) {
  const [index,   setIndex]   = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known,   setKnown]   = useState<Set<number>>(new Set());
  const card   = flashcards[index];
  const isLast = index === flashcards.length - 1;

  function handleMark(correct: boolean) {
    if (correct) setKnown(k => new Set([...k, index]));
    setFlipped(false);
    setTimeout(() => setIndex(i => Math.min(i + 1, flashcards.length - 1)), 150);
  }
  function goPrev() { setFlipped(false); setTimeout(() => setIndex(i => Math.max(i - 1, 0)), 150); }
  function restart() { setIndex(0); setFlipped(false); setKnown(new Set()); }

  if (!card) return null;
  const allDone = index === flashcards.length - 1 && flipped;

  return (
    <div className="flex flex-col gap-5 w-full max-w-[580px] mx-auto">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[rgba(240,237,232,0.25)] tracking-[0.04em]">Card {index + 1} of {flashcards.length}</span>
        <span className="text-xs text-[#e8603c] font-medium tracking-[0.04em]">{known.size} known</span>
      </div>
      <div className="w-full h-[3px] bg-[rgba(255,255,255,0.07)] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#d94f2b] to-[#e8603c] rounded-full" style={{ width: `${((index + 1) / flashcards.length) * 100}%` }}/>
      </div>
      <span className="inline-flex self-start text-[10.5px] text-[#d94f2b] border border-[rgba(217,79,43,0.22)] rounded-full px-2.5 py-0.5 bg-[rgba(217,79,43,0.05)] tracking-[1.2px] uppercase">{card.difficulty}</span>

      <div className="w-full h-[220px] cursor-pointer" style={{ perspective: "1000px" }} onClick={() => setFlipped(f => !f)}>
        <div className="w-full h-full relative transition-transform duration-500 rounded-[20px]" style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "" }}>
          <div className="absolute inset-0 rounded-[20px] bg-[#141418] border border-[rgba(255,255,255,0.07)] flex flex-col items-center justify-center px-8 py-7 text-center gap-2.5" style={{ backfaceVisibility: "hidden" }}>
            <p className="text-[10.5px] text-[rgba(240,237,232,0.25)] tracking-[1px] uppercase">Question — tap to reveal</p>
            <p className="font-serif text-[clamp(15px,2.2vw,19px)] font-medium text-[#f0ede8] leading-[1.45] tracking-[-0.01em]">{card.question}</p>
          </div>
          <div className="absolute inset-0 rounded-[20px] bg-[rgba(217,79,43,0.07)] border border-[rgba(217,79,43,0.22)] flex flex-col items-center justify-center px-8 py-7 text-center gap-2.5" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <p className="text-[10.5px] text-[rgba(240,237,232,0.25)] tracking-[1px] uppercase">Answer</p>
            <p className="font-serif text-[clamp(14px,2vw,17px)] font-normal text-[#f0ede8] leading-[1.45]">{card.answer}</p>
          </div>
        </div>
      </div>

      {flipped && !allDone && (
        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={() => handleMark(false)} className="py-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.025)] text-[rgba(240,237,232,0.55)] text-[13.5px] font-medium font-sans cursor-pointer transition-all hover:border-[rgba(239,68,68,0.4)] hover:bg-[rgba(239,68,68,0.06)] hover:text-[#f87171]">✗ &nbsp;Didn&apos;t know</button>
          <button onClick={() => handleMark(true)}  className="py-3 rounded-xl border border-[rgba(217,79,43,0.25)] bg-[rgba(217,79,43,0.07)] text-[#e8603c] text-[13.5px] font-medium font-sans cursor-pointer transition-all hover:border-[rgba(217,79,43,0.5)] hover:bg-[rgba(217,79,43,0.13)]">✓ &nbsp;Got it</button>
        </div>
      )}

      {allDone && isLast && (
        <div className="text-center px-7 py-7 bg-[rgba(217,79,43,0.06)] border border-[rgba(217,79,43,0.2)] rounded-[18px]">
          <div className="text-[32px] mb-2.5">🎉</div>
          <p className="font-serif text-xl font-medium text-[#f0ede8] mb-1.5">Round complete</p>
          <p className="text-[13.5px] text-[rgba(240,237,232,0.55)] font-light leading-relaxed mb-5">You knew {known.size} of {flashcards.length} cards.{known.size < flashcards.length ? " Practice the ones you missed." : " Perfect score."}</p>
          <button onClick={restart} className="inline-flex items-center gap-2 bg-[#f0ede8] text-[#0c0c0e] rounded-full px-7 py-3 text-sm font-medium transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">Restart deck</button>
        </div>
      )}

      {!allDone && (
        <div className="flex items-center justify-between">
          <button onClick={goPrev} disabled={index === 0} className="px-4 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-full text-[13px] text-[rgba(240,237,232,0.55)] cursor-pointer transition-all hover:text-[#f0ede8] hover:border-[rgba(255,255,255,0.13)] disabled:opacity-30 disabled:cursor-default font-sans">← Previous</button>
          {!flipped && <p className="text-xs text-[rgba(240,237,232,0.25)]">Tap card to flip</p>}
          <button onClick={() => { setFlipped(false); setTimeout(() => setIndex(i => Math.min(i + 1, flashcards.length - 1)), 150); }} disabled={isLast} className="px-4 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-full text-[13px] text-[rgba(240,237,232,0.55)] cursor-pointer transition-all hover:text-[#f0ede8] hover:border-[rgba(255,255,255,0.13)] disabled:opacity-30 disabled:cursor-default font-sans">Next →</button>
        </div>
      )}
    </div>
  );
}
