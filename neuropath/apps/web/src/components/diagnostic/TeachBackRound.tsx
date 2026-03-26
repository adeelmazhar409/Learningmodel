"use client";

import { useState, useEffect } from "react";
import { useDiagnosticStore } from "../../store/diagnostic.store";

/* ─────────────────────────────────────────
   Local type
───────────────────────────────────────── */
interface Question {
  id: string;
  method: string;
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

const MIN_CHARS = 30;

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
function IcMinus({ s = 10 }: { s?: number }) {
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
      <line x1="5" y1="12" x2="19" y2="12" />
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
function IcMessage({ s = 22 }: { s?: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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
   Main component
───────────────────────────────────────── */
export default function TeachBackRound({ questions, onComplete }: Props) {
  const { submitAnswer, startQuestion } = useDiagnosticStore();

  const [phase, setPhase] = useState<"intro" | "questions" | "done">("intro");
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [selfScore, setSelfScore] = useState<
    "got_it" | "partial" | "missed" | null
  >(null);
  const [gotCount, setGotCount] = useState(0);

  const question = questions[index];
  const charCount = response.trim().length;
  const canCheck = charCount >= MIN_CHARS;

  useEffect(() => {
    if (phase !== "questions") return;
    startQuestion();
    setResponse("");
    setRevealed(false);
    setSelfScore(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, phase]);

  function handleReveal() {
    if (!canCheck || revealed) return;
    setRevealed(true);
  }

  function handleRate(score: "got_it" | "partial" | "missed") {
    setSelfScore(score);
    const correct = score !== "missed";
    submitAnswer({
      question_id: question.id,
      method: "teach_back",
      correct,
      time_ms: 0,
      user_answer: response,
    });
    if (score === "got_it") setGotCount((c) => c + 1);
  }

  function handleNext() {
    if (index < questions.length - 1) setIndex((i) => i + 1);
    else setPhase("done");
  }

  /* ── INTRO ── */
  if (phase === "intro") {
    return (
      <div className="flex flex-col items-center gap-6 max-w-[540px] mx-auto w-full py-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[rgba(217,79,43,0.1)] border border-[rgba(217,79,43,0.2)] flex items-center justify-center text-flame">
          <IcMessage />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-flame tracking-[2.5px] uppercase mb-2">
            Round 4 of 4
          </p>
          <h2 className="font-serif text-[22px] sm:text-[26px] font-medium text-text tracking-[-0.02em] mb-3">
            Teach-back Round
          </h2>
          <p className="text-[13.5px] text-soft font-light leading-relaxed">
            For each prompt, write an explanation{" "}
            <strong className="text-text font-semibold">
              in your own words
            </strong>{" "}
            — as if teaching a classmate. Write at least{" "}
            <strong className="text-text font-semibold">
              {MIN_CHARS} characters
            </strong>
            , then reveal the model answer and rate yourself honestly.
          </p>
        </div>
        <div className="w-full bg-lift border border-edge rounded-2xl p-4 text-left flex flex-col gap-2.5">
          {[
            { icon: "✏️", text: "Write your explanation in your own words" },
            { icon: "📋", text: "Compare to the model answer" },
            { icon: "🎯", text: "Rate yourself: Got it / Partial / Missed it" },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-3 text-[12.5px] text-soft font-light"
            >
              <span className="text-base">{icon}</span>
              {text}
            </div>
          ))}
        </div>
        <button
          onClick={() => setPhase("questions")}
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
        <div className="w-14 h-14 rounded-full bg-[rgba(217,79,43,0.1)] border border-[rgba(217,79,43,0.2)] flex items-center justify-center text-flame">
          <IcMessage />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-flame tracking-[2.5px] uppercase mb-2">
            Round complete
          </p>
          <h2 className="font-serif text-[22px] font-medium text-text mb-2">
            Teach-back round done!
          </h2>
          <p className="text-[13px] text-soft font-light">
            You got <span className="text-text font-semibold">{gotCount}</span>{" "}
            of {questions.length} fully correct.
          </p>
        </div>
        <button
          onClick={onComplete}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-br from-ember to-flame text-white rounded-full px-8 py-3.5 text-[14px] font-semibold cursor-pointer border-none transition-all hover:opacity-90 active:scale-95 shadow-[0_4px_20px_rgba(217,79,43,0.35)]"
        >
          Continue to break →
        </button>
      </div>
    );
  }

  /* ── QUESTIONS ── */
  const progress = (index / questions.length) * 100;

  return (
    <div className="flex flex-col gap-5 max-w-[600px] mx-auto w-full">
      {/* Header */}
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
      </div>

      <div className="flex items-center gap-2">
        <DiffBadge d={question.difficulty} />
      </div>

      {/* Prompt card */}
      <div className="relative overflow-hidden bg-surface border border-edge rounded-2xl p-5 sm:p-6">
        <div className="absolute top-0 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-flame to-transparent opacity-50" />
        <p className="text-[10px] font-semibold text-flame tracking-[2px] uppercase mb-2.5">
          Teach-back prompt
        </p>
        <p className="font-serif text-[clamp(15px,2.3vw,18px)] font-medium text-text leading-snug tracking-[-0.01em]">
          {question.question}
        </p>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          disabled={revealed}
          rows={5}
          placeholder="Write your explanation here — imagine you're teaching a classmate who has never heard of this concept before…"
          className={[
            "w-full bg-surface border rounded-xl px-4 py-4",
            "text-[14px] text-text font-sans font-light leading-relaxed",
            "outline-none resize-y transition-all duration-200",
            "placeholder:text-whisper",
            "disabled:opacity-60 disabled:cursor-default",
            revealed
              ? "border-edge"
              : canCheck
                ? "border-[rgba(217,79,43,0.45)] focus:shadow-[0_0_0_3px_rgba(217,79,43,0.09)]"
                : "border-edge focus:border-[rgba(217,79,43,0.4)] focus:shadow-[0_0_0_3px_rgba(217,79,43,0.08)]",
          ].join(" ")}
        />
        {/* Char counter */}
        <div
          className={[
            "absolute bottom-3 right-3.5 text-[11px] font-semibold pointer-events-none transition-colors",
            charCount >= MIN_CHARS ? "text-ember" : "text-whisper",
          ].join(" ")}
        >
          {charCount}/{MIN_CHARS}
        </div>
      </div>

      {/* Hint when not enough chars */}
      {!revealed && !canCheck && charCount > 0 && (
        <p className="text-[11.5px] text-whisper font-light text-center -mt-2">
          {MIN_CHARS - charCount} more characters to unlock reveal
        </p>
      )}

      {/* Model answer (after reveal) */}
      {revealed && (
        <div className="relative overflow-hidden bg-[rgba(217,79,43,0.05)] border border-[rgba(217,79,43,0.2)] rounded-2xl p-5">
          <div className="absolute top-0 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-flame to-transparent opacity-50" />
          <p className="text-[10px] font-semibold text-flame tracking-[2px] uppercase mb-2.5">
            Model answer
          </p>
          <p className="text-[13.5px] text-soft font-light leading-relaxed">
            {question.answer}
          </p>
        </div>
      )}

      {/* Self-rating */}
      {revealed && !selfScore && (
        <div className="flex flex-col gap-3">
          <p className="text-[13px] text-soft font-light text-center">
            Compare your explanation to the model. How did you do?
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {(
              [
                [
                  "got_it",
                  "Got it",
                  "border-[rgba(34,197,94,0.5)]  bg-[rgba(34,197,94,0.08)]  text-green-400",
                  IcCheck,
                ],
                [
                  "partial",
                  "Partially",
                  "border-[rgba(251,191,36,0.5)] bg-[rgba(251,191,36,0.08)] text-yellow-400",
                  IcMinus,
                ],
                [
                  "missed",
                  "Missed it",
                  "border-[rgba(239,68,68,0.45)] bg-[rgba(239,68,68,0.07)]  text-red-400",
                  IcX,
                ],
              ] as const
            ).map(([val, label, cls, Icon]) => (
              <button
                key={val}
                onClick={() => handleRate(val)}
                className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl border font-semibold text-[12.5px] font-sans cursor-pointer transition-all active:scale-95 ${cls}`}
              >
                <Icon s={16} />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* After rating — next button */}
      {revealed && selfScore && (
        <div className="flex flex-col items-center gap-3">
          <div
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-[12.5px] font-semibold ${
              selfScore === "got_it"
                ? "border-[rgba(34,197,94,0.3)]  bg-[rgba(34,197,94,0.07)]  text-green-400"
                : selfScore === "partial"
                  ? "border-[rgba(251,191,36,0.3)] bg-[rgba(251,191,36,0.07)] text-yellow-400"
                  : "border-[rgba(239,68,68,0.3)]  bg-[rgba(239,68,68,0.07)]  text-red-400"
            }`}
          >
            {selfScore === "got_it" ? (
              <>
                <IcCheck s={12} /> Got it
              </>
            ) : selfScore === "partial" ? (
              <>
                <IcMinus s={12} /> Partially
              </>
            ) : (
              <>
                <IcX s={12} /> Missed it
              </>
            )}
          </div>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-gradient-to-br from-ember to-flame text-white rounded-full px-6 py-3 text-[13.5px] font-semibold cursor-pointer border-none transition-all hover:opacity-90 active:scale-95 shadow-[0_4px_16px_rgba(217,79,43,0.28)]"
          >
            {index < questions.length - 1 ? "Next question →" : "Finish round"}
          </button>
        </div>
      )}

      {/* Reveal button */}
      {!revealed && (
        <button
          onClick={handleReveal}
          disabled={!canCheck}
          className="w-full flex items-center justify-center gap-2 bg-text text-ink rounded-full py-3.5 text-[14px] font-semibold cursor-pointer border-none transition-all hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_4px_22px_rgba(0,0,0,0.3)]"
        >
          {canCheck
            ? "Reveal model answer"
            : `Write at least ${MIN_CHARS} characters to continue`}
        </button>
      )}
    </div>
  );
}
