"use client";

import { useState, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────
   Local types (mirrors @neuropath/types)
───────────────────────────────────────── */
interface Question {
  id: string;
  method: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  choices: string[];
  answer: string;
}

interface Answer {
  question_id: string;
  method: string;
  correct: boolean;
  time_ms: number;
  user_answer: string;
}

interface Props {
  questions: Question[];
  onComplete: (answers: Answer[]) => void;
}

const TIME_PER_Q = 25; // seconds — enough to recall but not to look up

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

/* ─────────────────────────────────────────
   Timer bar
───────────────────────────────────────── */
function TimerBar({
  timeLeft,
  total,
  warn,
}: {
  timeLeft: number;
  total: number;
  warn: boolean;
}) {
  const pct = (timeLeft / total) * 100;
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-1.5 bg-lift rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-1000 linear ${warn ? "bg-red-400" : "bg-gradient-to-r from-flame to-ember"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={`font-serif text-[15px] font-semibold min-w-[32px] text-right shrink-0 transition-colors ${warn ? "text-red-400" : "text-text"}`}
      >
        {timeLeft}s
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export default function RecallTest({ questions, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const timerWarn = timeLeft <= 8;

  /* Advance to next question or complete */
  const advance = useCallback(
    (forced = false) => {
      if (!question || submitting) return;
      const ans: Answer = {
        question_id: question.id,
        method: question.method,
        correct: forced ? false : selected === question.answer,
        time_ms: Date.now() - startedAt,
        user_answer: forced ? "" : (selected ?? ""),
      };
      const updated = [...answers, ans];
      setAnswers(updated);

      if (isLast || updated.length === questions.length) {
        setSubmitting(true);
        onComplete(updated);
        return;
      }
      setIndex((i) => i + 1);
      setSelected(null);
      setTimeLeft(TIME_PER_Q);
      setStartedAt(Date.now());
    },
    [
      question,
      selected,
      answers,
      isLast,
      questions.length,
      startedAt,
      onComplete,
      submitting,
    ],
  );

  /* Countdown */
  useEffect(() => {
    if (submitting) return;
    if (timeLeft <= 0) {
      advance(true);
      return;
    }
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, advance, submitting]);

  /* Submitting / loading state */
  if (!question || submitting) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
        <div className="w-10 h-10 border-2 border-edge border-t-ember rounded-full animate-spin" />
        <div>
          <p className="font-serif text-[22px] font-medium text-text mb-2 tracking-[-0.02em]">
            Calculating your results…
          </p>
          <p className="text-[13.5px] text-soft font-light">
            Analysing your performance across all four learning methods.
          </p>
        </div>
      </div>
    );
  }

  const overallPct = Math.round((index / questions.length) * 100);

  return (
    <div className="flex flex-col gap-5 max-w-[620px] mx-auto w-full">
      {/* Top: question counter + timer */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11.5px] text-whisper font-semibold tracking-[0.02em]">
            Question {index + 1} of {questions.length}
          </span>
          <span className="text-[11px] text-whisper font-medium">
            {overallPct}% done
          </span>
        </div>

        {/* Timer bar */}
        <TimerBar timeLeft={timeLeft} total={TIME_PER_Q} warn={timerWarn} />

        {/* Overall progress */}
        <div className="h-1 bg-lift rounded-full overflow-hidden">
          <div
            className="h-full bg-[rgba(217,79,43,0.35)] rounded-full transition-all duration-500"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </div>

      {/* NOTE: we intentionally do NOT show the method tag during recall
           — the student should not know which method each question is from.
           This keeps the test measuring pure retention. */}

      {/* Question card */}
      <div className="relative overflow-hidden bg-surface border border-edge rounded-2xl p-5 sm:p-7">
        <div className="absolute top-0 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-edge-2 to-transparent" />
        <p className="text-[10px] font-semibold text-flame tracking-[2px] uppercase mb-3">
          Memory Recall
        </p>
        <p className="font-serif text-[clamp(15px,2.5vw,20px)] font-medium text-text leading-snug tracking-[-0.01em]">
          {question.question}
        </p>
      </div>

      {/* Choices — A / B / C / D lettered */}
      <div className="flex flex-col gap-2.5">
        {question.choices.map((choice, i) => {
          const letter = String.fromCharCode(65 + i);
          const isSel = selected === choice;
          return (
            <button
              key={choice}
              onClick={() => setSelected(choice)}
              className={[
                "flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left",
                "text-[13.5px] font-medium font-sans",
                "transition-all duration-150 active:scale-[0.99] cursor-pointer",
                isSel
                  ? "border-[rgba(217,79,43,0.5)] bg-[rgba(217,79,43,0.08)] text-text"
                  : "border-edge bg-lift text-soft hover:border-edge-2 hover:text-text",
              ].join(" ")}
            >
              {/* Letter badge */}
              <div
                className={[
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                  "text-[11.5px] font-semibold transition-all",
                  isSel
                    ? "bg-flame text-white"
                    : "bg-surface border border-edge-2 text-whisper",
                ].join(" ")}
              >
                {isSel ? <IcCheck s={11} /> : letter}
              </div>
              {choice}
            </button>
          );
        })}
      </div>

      {/* Submit / next */}
      <button
        onClick={() => advance(false)}
        disabled={!selected}
        className="w-full flex items-center justify-center gap-2 bg-text text-ink rounded-full py-3.5 text-[14px] font-semibold cursor-pointer border-none transition-all hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_4px_22px_rgba(0,0,0,0.3)]"
      >
        {isLast ? "Submit answers" : "Next question →"}
      </button>

      {/* Timer urgency note */}
      {timerWarn && timeLeft > 0 && (
        <p className="text-[11.5px] text-red-400 font-semibold text-center animate-pulse">
          ⚡ Time running out — answer now!
        </p>
      )}
    </div>
  );
}
