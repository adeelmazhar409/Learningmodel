"use client";

import { useState, useEffect, useRef } from "react";
import { useDiagnosticStore } from "../../store/diagnostic.store";

/* ─────────────────────────────────────────
   Local type (matches @neuropath/types)
───────────────────────────────────────── */
interface Question {
  id: string;
  method: string;
  type: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
}

interface Props {
  questions: Question[];
  onComplete: () => void;
}

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const ROUND_SECONDS = 120; // 2 minutes

/* ─────────────────────────────────────────
   SVG Icons
───────────────────────────────────────── */
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
function IcClock({ s = 13 }: { s?: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IcRotate({ s = 14 }: { s?: number }) {
  return (
    <svg
      width={s}
      height={s}
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

/* ─────────────────────────────────────────
   Difficulty badge
───────────────────────────────────────── */
function DiffBadge({ d }: { d: "easy" | "medium" | "hard" }) {
  const cls =
    d === "easy"
      ? "bg-[rgba(34,197,94,0.08)] border-[rgba(34,197,94,0.2)] text-green-400"
      : d === "hard"
        ? "bg-[rgba(239,68,68,0.08)] border-[rgba(239,68,68,0.2)] text-red-400"
        : "bg-[rgba(217,79,43,0.08)] border-[rgba(217,79,43,0.18)] text-ember";
  return (
    <span
      className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold tracking-[0.05em] uppercase ${cls}`}
    >
      {d}
    </span>
  );
}

/* ─────────────────────────────────────────
   Timer ring (SVG circle)
───────────────────────────────────────── */
function TimerRing({
  secondsLeft,
  total,
}: {
  secondsLeft: number;
  total: number;
}) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const pct = secondsLeft / total;
  const col = secondsLeft > 30 ? "#d94f2b" : "#ef4444";

  return (
    <svg width="52" height="52" viewBox="0 0 52 52">
      {/* track */}
      <circle
        cx="26"
        cy="26"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="3"
      />
      {/* progress */}
      <circle
        cx="26"
        cy="26"
        r={r}
        fill="none"
        stroke={col}
        strokeWidth="3"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round"
        transform="rotate(-90 26 26)"
        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
      />
      {/* number */}
      <text
        x="26"
        y="30"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill={col}
        fontFamily="DM Sans, sans-serif"
      >
        {secondsLeft}
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export default function FlashcardRound({ questions, onComplete }: Props) {
  const { submitAnswer, startQuestion } = useDiagnosticStore();

  const [phase, setPhase] = useState<"intro" | "cards" | "done">("intro");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [marked, setMarked] = useState(false);
  const [seenCount, setSeenCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* start countdown when entering cards phase */
  useEffect(() => {
    if (phase !== "cards") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setPhase("done");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  /* start question timer when card changes */
  useEffect(() => {
    if (phase !== "cards") return;
    startQuestion();
    setFlipped(false);
    setMarked(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, phase]);

  function handleMark(correct: boolean) {
    if (marked) return;
    setMarked(true);
    submitAnswer({
      question_id: questions[index].id,
      method: "flashcards",
      correct,
      time_ms: 0,
      user_answer: questions[index].answer,
    });
    setSeenCount((c) => c + 1);
    setTimeout(() => {
      if (index < questions.length - 1) setIndex((i) => i + 1);
      else {
        clearInterval(timerRef.current!);
        setPhase("done");
      }
    }, 400);
  }

  function handleDone() {
    // submit skipped cards as incorrect
    for (let i = seenCount; i < questions.length; i++) {
      submitAnswer({
        question_id: questions[i].id,
        method: "flashcards",
        correct: false,
        time_ms: 0,
      });
    }
    onComplete();
  }

  /* ── INTRO ── */
  if (phase === "intro") {
    return (
      <div className="flex flex-col items-center gap-6 max-w-[540px] mx-auto w-full py-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[rgba(217,79,43,0.1)] border border-[rgba(217,79,43,0.2)] flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-flame"
          >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-flame tracking-[2.5px] uppercase mb-2">
            Round 1 of 4
          </p>
          <h2 className="font-serif text-[22px] sm:text-[26px] font-medium text-text tracking-[-0.02em] mb-3">
            Flashcard Round
          </h2>
          <p className="text-[13.5px] text-soft font-light leading-relaxed">
            You&apos;ll see {questions.length} question-and-answer cards. Read
            each question, then tap to reveal the answer. Mark whether you knew
            it or not. You have{" "}
            <strong className="text-text font-semibold">2 minutes</strong>.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-center text-[12px] text-whisper">
          <span className="flex items-center gap-1.5">
            <IcClock /> 2 min limit
          </span>
          <span className="w-1 h-1 rounded-full bg-edge" />
          <span>{questions.length} cards</span>
          <span className="w-1 h-1 rounded-full bg-edge" />
          <span>Tap card to flip</span>
        </div>
        <button
          onClick={() => setPhase("cards")}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-br from-ember to-flame text-white rounded-full px-8 py-3.5 text-[14px] font-semibold cursor-pointer border-none transition-all hover:opacity-90 active:scale-95 shadow-[0_4px_20px_rgba(217,79,43,0.35)]"
        >
          Start round
        </button>
      </div>
    );
  }

  /* ── DONE ── */
  if (phase === "done") {
    return (
      <div className="flex flex-col items-center gap-5 max-w-[480px] mx-auto w-full py-6 text-center">
        <div className="w-14 h-14 rounded-full bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] flex items-center justify-center text-green-400">
          <IcCheck s={22} />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-flame tracking-[2.5px] uppercase mb-2">
            Round complete
          </p>
          <h2 className="font-serif text-[22px] font-medium text-text mb-2">
            Flashcard round done!
          </h2>
          <p className="text-[13px] text-soft font-light">
            You saw <span className="text-text font-semibold">{seenCount}</span>{" "}
            of {questions.length} cards.
          </p>
        </div>
        <button
          onClick={handleDone}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-br from-ember to-flame text-white rounded-full px-8 py-3.5 text-[14px] font-semibold cursor-pointer border-none transition-all hover:opacity-90 active:scale-95 shadow-[0_4px_20px_rgba(217,79,43,0.35)]"
        >
          Continue to next round →
        </button>
      </div>
    );
  }

  /* ── CARDS ── */
  const card = questions[index];
  const progress = (index / questions.length) * 100;

  return (
    <div className="flex flex-col gap-5 max-w-[560px] mx-auto w-full">
      {/* Header: progress + timer */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-lift rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-flame to-ember rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[11px] text-whisper font-semibold shrink-0">
          {index + 1}/{questions.length}
        </span>
        <TimerRing secondsLeft={timeLeft} total={ROUND_SECONDS} />
      </div>

      {/* Difficulty */}
      <div className="flex items-center gap-2">
        <DiffBadge d={card.difficulty} />
        <span className="text-[11px] text-whisper">
          Tap the card to reveal the answer
        </span>
      </div>

      {/* Flip card */}
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
            minHeight: "180px",
          }}
        >
          {/* Front — Question */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 py-8 text-center bg-surface border border-edge rounded-2xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-edge-2 to-transparent" />
            <p className="text-[10px] text-whisper tracking-[1.2px] uppercase font-semibold">
              Question
            </p>
            <p className="font-serif text-[clamp(15px,2.5vw,19px)] font-medium text-text leading-snug tracking-[-0.01em]">
              {card.question}
            </p>
            <p className="text-[11px] text-whisper font-light">
              Tap to see answer
            </p>
          </div>

          {/* Back — Answer */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 py-8 text-center bg-[rgba(217,79,43,0.06)] border border-[rgba(217,79,43,0.2)] rounded-2xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-flame to-transparent opacity-60" />
            <p className="text-[10px] text-ember tracking-[1.2px] uppercase font-semibold">
              Answer
            </p>
            <p className="font-serif text-[clamp(14px,2.2vw,18px)] text-text leading-relaxed font-medium">
              {card.answer}
            </p>
            {card.explanation && (
              <p className="text-[11.5px] text-soft font-light italic leading-relaxed max-w-[380px]">
                {card.explanation}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mark buttons — only show when flipped */}
      {flipped && !marked && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleMark(false)}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-edge bg-lift text-soft text-[13.5px] font-semibold font-sans cursor-pointer transition-all hover:border-[rgba(239,68,68,0.4)] hover:bg-[rgba(239,68,68,0.06)] hover:text-red-400 active:scale-95"
          >
            <svg
              width="12"
              height="12"
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
            Didn&apos;t know
          </button>
          <button
            onClick={() => handleMark(true)}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-[rgba(217,79,43,0.25)] bg-[rgba(217,79,43,0.07)] text-ember text-[13.5px] font-semibold font-sans cursor-pointer transition-all hover:border-[rgba(217,79,43,0.5)] hover:bg-[rgba(217,79,43,0.13)] active:scale-95"
          >
            <IcCheck s={12} /> Got it
          </button>
        </div>
      )}

      {/* Nav buttons when not flipped */}
      {!flipped && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (index > 0) {
                setIndex((i) => i - 1);
              }
            }}
            disabled={index === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-edge bg-lift text-soft text-[12.5px] font-semibold font-sans cursor-pointer disabled:opacity-30 transition-all hover:enabled:border-edge-2"
          >
            ← Prev
          </button>
          <span className="text-[11.5px] text-whisper font-light">
            Tap card to flip
          </span>
          <button
            onClick={() => {
              // skip this card
              submitAnswer({
                question_id: card.id,
                method: "flashcards",
                correct: false,
                time_ms: 0,
              });
              setSeenCount((c) => c + 1);
              if (index < questions.length - 1) setIndex((i) => i + 1);
              else {
                clearInterval(timerRef.current!);
                setPhase("done");
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-edge bg-lift text-soft text-[12.5px] font-semibold font-sans cursor-pointer transition-all hover:border-edge-2 active:scale-95"
          >
            Skip →
          </button>
        </div>
      )}
    </div>
  );
}
