"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { studyPacksApi } from "../../../../lib/api/study-packs.api";

/* ─────────────────────────────────────────
   Local types — exact shape from the API
   (safe subset, avoids import issues)
───────────────────────────────────────── */
interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
}

interface QuizQuestion {
  id: string;
  type: string;
  question: string;
  choices: string[];
  answer: string;
  explanation?: string;
}

interface Pack {
  id: string;
  title: string;
  summary_short: string;
  summary_bullets: string[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  teach_back: string;
  flashcard_count: number;
  quiz_count: number;
  profile_snapshot?: Record<string, number>;
}

type Tab = "summary" | "flashcards" | "quiz" | "teach-back";

/* ─────────────────────────────────────────
   SVG Icons
───────────────────────────────────────── */
function IcArrowLeft() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
function IcFile() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
function IcCard() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}
function IcHelp() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function IcMsg() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IcCheck({ s = 10 }: { s?: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function IcX({ s = 10 }: { s?: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IcRotate() {
  return (
    <svg
      width="14"
      height="14"
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
function IcChevLeft() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
function IcChevRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
function IcCopy() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
function IcLayers() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 12.5-8.57 3.91a2 2 0 0 1-1.66 0L3 12.5" />
      <path d="m22 17.5-8.57 3.91a2 2 0 0 1-1.66 0L3 17.5" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Tab: Summary
───────────────────────────────────────── */
function SummaryTab({ pack }: { pack: Pack }) {
  return (
    <div className="flex flex-col gap-5">
      {/* pull quote */}
      <div className="relative overflow-hidden rounded-2xl border border-edge bg-surface p-5 sm:p-7">
        <div className="absolute top-0 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-flame to-transparent opacity-60" />
        <p className="font-serif text-[clamp(14px,2.2vw,18px)] italic font-normal text-text leading-relaxed tracking-[-0.01em]">
          {pack.summary_short}
        </p>
      </div>
      {/* bullets */}
      <div>
        <p className="text-[10px] text-flame font-semibold tracking-[2px] uppercase mb-3">
          Key points
        </p>
        <div className="flex flex-col gap-2">
          {pack.summary_bullets.map((b, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3.5 bg-surface border border-edge rounded-xl hover:border-edge-2 transition-colors"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-flame shrink-0 mt-[7px]" />
              <p className="text-[13px] sm:text-[13.5px] text-soft font-light leading-relaxed">
                {b}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Tab: Flashcards
───────────────────────────────────────── */
function FlashcardsTab({ cards }: { cards: Flashcard[] }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);

  const card = cards[idx];
  const progress = (idx / cards.length) * 100;

  function mark(correct: boolean) {
    const next = new Set(known);
    if (correct) next.add(card.id);
    else next.delete(card.id);
    setKnown(next);
    if (idx < cards.length - 1) {
      setIdx((i) => i + 1);
      setFlipped(false);
    } else setDone(true);
  }

  function restart() {
    setIdx(0);
    setFlipped(false);
    setKnown(new Set());
    setDone(false);
  }

  if (done) {
    const score = known.size;
    const pct = Math.round((score / cards.length) * 100);
    return (
      <div className="flex flex-col items-center gap-5 py-10 text-center">
        <div className="w-16 h-16 rounded-full bg-[rgba(217,79,43,0.1)] border border-[rgba(217,79,43,0.2)] flex items-center justify-center text-flame">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] text-flame font-semibold tracking-[2px] uppercase mb-1.5">
            Round complete
          </p>
          <h3 className="font-serif text-[22px] sm:text-[26px] font-medium text-text tracking-[-0.02em] mb-2">
            {pct >= 80
              ? "Excellent!"
              : pct >= 50
                ? "Good progress!"
                : "Keep practising!"}
          </h3>
          <p className="text-[13.5px] text-soft font-light">
            Knew <span className="text-text font-semibold">{score}</span> of{" "}
            <span className="text-text font-semibold">{cards.length}</span> (
            {pct}%)
          </p>
        </div>
        <button
          onClick={restart}
          className="flex items-center gap-2 bg-gradient-to-br from-ember to-flame text-white rounded-full px-6 py-3 text-[13px] font-semibold cursor-pointer border-none transition-all hover:opacity-90 active:scale-95 shadow-[0_4px_18px_rgba(217,79,43,0.3)]"
        >
          <IcRotate /> Restart
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 max-w-[540px] mx-auto w-full">
      {/* progress */}
      <div className="w-full flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-lift rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-flame to-ember rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[11px] text-whisper font-semibold shrink-0">
          {idx + 1}/{cards.length}
        </span>
      </div>

      {/* difficulty */}
      <div className="self-start">
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.05em] uppercase border ${card.difficulty === "easy" ? "bg-[rgba(34,197,94,0.08)] border-[rgba(34,197,94,0.2)] text-green-400" : card.difficulty === "hard" ? "bg-[rgba(239,68,68,0.08)] border-[rgba(239,68,68,0.2)] text-red-400" : "bg-[rgba(217,79,43,0.08)] border-[rgba(217,79,43,0.18)] text-ember"}`}
        >
          {card.difficulty}
        </span>
      </div>

      {/* flip card */}
      <div
        className="w-full cursor-pointer select-none"
        style={{ perspective: "1200px" }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "200px",
          }}
        >
          {/* front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 py-8 text-center bg-surface border border-edge rounded-2xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-[10px] text-whisper tracking-[1.2px] uppercase font-semibold">
              Question — tap to reveal
            </p>
            <p className="font-serif text-[clamp(14px,2.5vw,18px)] font-medium text-text leading-snug">
              {card.question}
            </p>
          </div>
          {/* back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 py-8 text-center bg-[rgba(217,79,43,0.06)] border border-[rgba(217,79,43,0.2)] rounded-2xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-[10px] text-ember tracking-[1.2px] uppercase font-semibold">
              Answer
            </p>
            <p className="font-serif text-[clamp(13px,2.2vw,17px)] text-text leading-relaxed">
              {card.answer}
            </p>
          </div>
        </div>
      </div>

      {/* actions */}
      {flipped ? (
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={() => mark(false)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-edge bg-lift text-soft text-[13px] font-semibold font-sans cursor-pointer transition-all hover:border-[rgba(239,68,68,0.4)] hover:bg-[rgba(239,68,68,0.06)] hover:text-red-400 active:scale-95"
          >
            <IcX /> Didn&apos;t know
          </button>
          <button
            onClick={() => mark(true)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[rgba(217,79,43,0.25)] bg-[rgba(217,79,43,0.07)] text-ember text-[13px] font-semibold font-sans cursor-pointer transition-all hover:border-[rgba(217,79,43,0.5)] hover:bg-[rgba(217,79,43,0.13)] active:scale-95"
          >
            <IcCheck /> Got it
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full gap-3">
          <button
            onClick={() => {
              if (idx > 0) {
                setIdx((i) => i - 1);
                setFlipped(false);
              }
            }}
            disabled={idx === 0}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-edge bg-lift text-soft text-[12.5px] font-semibold font-sans cursor-pointer disabled:opacity-30 transition-all hover:enabled:border-edge-2"
          >
            <IcChevLeft /> Prev
          </button>
          <p className="text-[11.5px] text-whisper font-light">
            Tap card to flip
          </p>
          <button
            onClick={() => {
              if (idx < cards.length - 1) {
                setIdx((i) => i + 1);
                setFlipped(false);
              }
            }}
            disabled={idx === cards.length - 1}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-edge bg-lift text-soft text-[12.5px] font-semibold font-sans cursor-pointer disabled:opacity-30 transition-all hover:enabled:border-edge-2"
          >
            Next <IcChevRight />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Tab: Quiz
───────────────────────────────────────── */
function QuizTab({ questions }: { questions: QuizQuestion[] }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[idx];
  const progress = (idx / questions.length) * 100;

  function pick(choice: string) {
    if (revealed) return;
    setSelected(choice);
    setRevealed(true);
    if (choice === q.answer) setScore((s) => s + 1);
  }

  function next() {
    if (idx < questions.length - 1) {
      setIdx((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    } else setDone(true);
  }

  function restart() {
    setIdx(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setDone(false);
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col items-center gap-5 py-10 text-center max-w-[440px] mx-auto">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center border ${pct >= 80 ? "bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.25)] text-green-400" : pct >= 50 ? "bg-[rgba(217,79,43,0.1)] border-[rgba(217,79,43,0.25)] text-ember" : "bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.25)] text-red-400"}`}
        >
          <IcHelp />
        </div>
        <div>
          <p className="text-[10px] text-flame font-semibold tracking-[2px] uppercase mb-1.5">
            Quiz complete
          </p>
          <h3 className="font-serif text-[22px] sm:text-[26px] font-medium text-text tracking-[-0.02em] mb-2">
            {pct >= 80
              ? "Excellent!"
              : pct >= 50
                ? "Good effort!"
                : "Keep studying!"}
          </h3>
          <p className="text-[13.5px] text-soft font-light">
            Score: <span className="text-text font-semibold">{score}</span>/
            {questions.length} ({pct}%)
          </p>
        </div>
        <button
          onClick={restart}
          className="flex items-center gap-2 bg-gradient-to-br from-ember to-flame text-white rounded-full px-6 py-3 text-[13px] font-semibold cursor-pointer border-none transition-all hover:opacity-90 active:scale-95 shadow-[0_4px_18px_rgba(217,79,43,0.3)]"
        >
          <IcRotate /> Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 max-w-[580px] mx-auto w-full">
      {/* progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-lift rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-flame to-ember rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[11px] text-whisper font-semibold shrink-0">
          {idx + 1}/{questions.length}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400" />
        <span className="text-[11.5px] text-soft font-medium">
          {score} correct
        </span>
      </div>

      {/* question */}
      <div className="bg-surface border border-edge rounded-2xl p-5">
        <p className="text-[10px] text-flame font-semibold tracking-[2px] uppercase mb-2.5">
          Question {idx + 1}
        </p>
        <p className="font-serif text-[clamp(14px,2.2vw,18px)] font-medium text-text leading-snug">
          {q.question}
        </p>
      </div>

      {/* choices */}
      <div className="flex flex-col gap-2">
        {q.choices.map((choice) => {
          const isSel = selected === choice;
          const isCorr = choice === q.answer;
          let cls =
            "border-edge bg-lift text-soft hover:border-edge-2 hover:text-text cursor-pointer";
          if (revealed) {
            if (isCorr)
              cls =
                "border-[rgba(34,197,94,0.4)] bg-[rgba(34,197,94,0.08)] text-green-400 cursor-default";
            else if (isSel)
              cls =
                "border-[rgba(239,68,68,0.4)] bg-[rgba(239,68,68,0.08)] text-red-400 cursor-default";
            else
              cls =
                "border-edge bg-lift text-whisper cursor-default opacity-50";
          }
          return (
            <button
              key={choice}
              onClick={() => pick(choice)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left text-[13px] sm:text-[14px] font-medium font-sans transition-all duration-150 active:scale-[0.99] ${cls}`}
            >
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${revealed && isCorr ? "border-green-400 bg-[rgba(34,197,94,0.15)]" : revealed && isSel ? "border-red-400 bg-[rgba(239,68,68,0.15)]" : "border-edge-2"}`}
              >
                {revealed && isCorr ? (
                  <IcCheck />
                ) : revealed && isSel ? (
                  <IcX />
                ) : null}
              </div>
              {choice}
            </button>
          );
        })}
      </div>

      {/* explanation */}
      {revealed && q.explanation && (
        <div className="flex gap-3 px-4 py-4 bg-[rgba(217,79,43,0.05)] border border-[rgba(217,79,43,0.18)] rounded-xl">
          <div className="w-1 rounded-full bg-flame shrink-0 self-stretch" />
          <p className="text-[12.5px] sm:text-[13px] text-soft font-light leading-relaxed">
            {q.explanation}
          </p>
        </div>
      )}

      {/* next btn */}
      {revealed && (
        <div className="flex justify-end">
          <button
            onClick={next}
            className="flex items-center gap-2 bg-gradient-to-br from-ember to-flame text-white rounded-full px-5 py-2.5 text-[13px] font-semibold cursor-pointer border-none transition-all hover:opacity-90 active:scale-95 shadow-[0_4px_16px_rgba(217,79,43,0.28)]"
          >
            {idx < questions.length - 1 ? (
              <>
                Next <IcChevRight />
              </>
            ) : (
              "See results"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Tab: Teach-back
───────────────────────────────────────── */
function TeachBackTab({ script }: { script: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(script).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const sentences = script.split(/(?<=[.!?])\s+/).filter(Boolean);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <p className="text-[10px] text-flame font-semibold tracking-[2px] uppercase mb-1">
            Teach-back script
          </p>
          <p className="text-[12.5px] text-soft font-light leading-relaxed max-w-[380px]">
            Read this aloud as if teaching someone else. The single best way to
            lock in knowledge.
          </p>
        </div>
        <button
          onClick={copy}
          className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[12px] font-semibold font-sans cursor-pointer transition-all active:scale-95 ${copied ? "border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.08)] text-green-400" : "border-edge bg-lift text-soft hover:border-edge-2 hover:text-text"}`}
        >
          {copied ? (
            <>
              <IcCheck s={12} /> Copied
            </>
          ) : (
            <>
              <IcCopy /> Copy
            </>
          )}
        </button>
      </div>

      {/* script card */}
      <div className="relative overflow-hidden bg-surface border border-edge rounded-2xl p-5 sm:p-7">
        <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-flame to-transparent opacity-40" />
        <div className="flex flex-col gap-4">
          {sentences.map((s, i) => (
            <div key={i} className="flex items-start gap-3.5">
              <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[rgba(217,79,43,0.08)] border border-[rgba(217,79,43,0.15)] flex items-center justify-center text-[9px] text-flame font-semibold">
                {i + 1}
              </span>
              <p className="font-serif text-[14px] sm:text-[15px] font-normal text-soft leading-relaxed">
                {s.trim()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* tip */}
      <div className="flex items-start gap-3 px-4 py-4 bg-lift border border-edge rounded-xl">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-ember shrink-0 mt-0.5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-[12px] text-soft font-light leading-relaxed">
          Try recording yourself or explaining to a friend. Teaching is the most
          effective way to consolidate memory.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main page
───────────────────────────────────────── */
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "summary", label: "Summary", icon: <IcFile /> },
  { id: "flashcards", label: "Flashcards", icon: <IcCard /> },
  { id: "quiz", label: "Quiz", icon: <IcHelp /> },
  { id: "teach-back", label: "Teach-back", icon: <IcMsg /> },
];

export default function StudyPackPage() {
  const params = useParams();
  const packId = params.packId as string;

  const [pack, setPack] = useState<Pack | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("summary");

  useEffect(() => {
    studyPacksApi
      .getById(packId)
      .then((d) => setPack(d as Pack))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [packId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-7 h-7 border-2 border-edge border-t-ember rounded-full animate-spin" />
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-6">
        <p className="font-serif text-[18px] font-medium text-text">
          Study pack not found
        </p>
        <p className="text-[13px] text-soft font-light">
          This pack may have been deleted.
        </p>
        <Link
          href="/study-packs"
          className="text-[13px] text-flame font-semibold no-underline hover:opacity-75 transition-opacity"
        >
          ← Back to library
        </Link>
      </div>
    );
  }

  const topModes = Object.entries(pack.profile_snapshot ?? {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-ink">
      {/* glow */}
      <div
        aria-hidden
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[480px] h-[280px] pointer-events-none z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(217,79,43,0.06)] to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[820px] mx-auto px-4 sm:px-6 pt-5 pb-28">
        {/* back */}
        <Link
          href="/study-packs"
          className="inline-flex items-center gap-2 text-[12px] text-soft font-semibold no-underline hover:text-text transition-colors mb-6"
        >
          <IcArrowLeft /> Back to library
        </Link>

        {/* header */}
        <div className="mb-7">
          <p className="flex items-center gap-2 text-[10px] font-semibold text-flame tracking-[2.5px] uppercase mb-2.5">
            <span className="w-4 h-px bg-flame" />
            Study Pack
          </p>
          <h1 className="font-serif text-[clamp(22px,5vw,36px)] font-medium text-text tracking-[-0.03em] leading-tight mb-3">
            {pack.title}
          </h1>

          {/* meta pills */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {[
              { icon: <IcCard />, label: `${pack.flashcard_count} flashcards` },
              { icon: <IcHelp />, label: `${pack.quiz_count} questions` },
              { icon: <IcMsg />, label: "Teach-back" },
            ].map(({ icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lift border border-edge text-[11.5px] text-soft"
              >
                <span className="text-whisper">{icon}</span>
                {label}
              </span>
            ))}
          </div>

          {/* profile badge */}
          {topModes.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 px-3.5 py-2.5 bg-[rgba(217,79,43,0.05)] border border-[rgba(217,79,43,0.15)] rounded-xl w-fit">
              <div className="text-flame">
                <IcLayers />
              </div>
              <span className="text-[11.5px] text-soft font-light">
                For your profile:
              </span>
              {topModes.map(([m, v]) => (
                <span
                  key={m}
                  className="px-2 py-0.5 rounded-full bg-[rgba(217,79,43,0.08)] border border-[rgba(217,79,43,0.18)] text-[11px] text-ember font-semibold capitalize"
                >
                  {m.replace("_", " ")} {Math.round(v * 100)}%
                </span>
              ))}
            </div>
          )}
        </div>

        {/* tabs */}
        <div className="flex gap-0.5 border-b border-edge mb-7 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-3 text-[12.5px] sm:text-[13px] font-semibold font-sans cursor-pointer bg-transparent border-none border-b-2 -mb-px whitespace-nowrap transition-all duration-200 ${t.id === tab ? "text-text border-flame" : "text-soft border-transparent hover:text-text hover:border-edge-2"}`}
            >
              <span className={t.id === tab ? "text-flame" : "text-whisper"}>
                {t.icon}
              </span>
              {t.label}
            </button>
          ))}
        </div>

        {/* tab content */}
        <div>
          {tab === "summary" && <SummaryTab pack={pack} />}
          {tab === "flashcards" && <FlashcardsTab cards={pack.flashcards} />}
          {tab === "quiz" && <QuizTab questions={pack.quiz} />}
          {tab === "teach-back" && <TeachBackTab script={pack.teach_back} />}
        </div>
      </div>
    </div>
  );
}
