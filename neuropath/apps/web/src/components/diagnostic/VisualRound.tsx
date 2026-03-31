"use client";

import { useState, useEffect, useRef } from "react";
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
  context?: string;
}

interface Props {
  questions: Question[];
  onComplete: () => void;
}

const ROUND_SECONDS = 120;

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
function IcEye({ s = 18 }: { s?: number }) {
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
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Timer ring
───────────────────────────────────────── */
function TimerRing({ s, total }: { s: number; total: number }) {
  const r = 20,
    circ = 2 * Math.PI * r;
  const col = s > 30 ? "#d94f2b" : "#ef4444";
  return (
    <svg width="52" height="52" viewBox="0 0 52 52">
      <circle
        cx="26"
        cy="26"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="3"
      />
      <circle
        cx="26"
        cy="26"
        r={r}
        fill="none"
        stroke={col}
        strokeWidth="3"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - s / total)}
        strokeLinecap="round"
        transform="rotate(-90 26 26)"
        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
      />
      <text
        x="26"
        y="30"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill={col}
        fontFamily="DM Sans, sans-serif"
      >
        {s}
      </text>
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
   Context panel (renders diagram text)
───────────────────────────────────────── */
function ContextPanel({ text }: { text: string }) {
  const segments = text
    .split(/\s*[→|]\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  const isSingleBlock = segments.length <= 1;

  // Strip ALL square and round brackets anywhere in the string
  function stripBrackets(s: string) {
    return s.replace(/[\[\]()]/g, "").trim();
  }

  return (
    <div className="relative overflow-hidden bg-[rgba(217,79,43,0.04)] border border-[rgba(217,79,43,0.18)] rounded-2xl p-4 sm:p-5">
      <div className="absolute top-0 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-flame to-transparent opacity-50" />
      <p className="text-[10px] font-semibold text-flame tracking-[2px] uppercase mb-3">
        Diagram / Context
      </p>

      {isSingleBlock ? (
        <p className="text-[13px] sm:text-[13.5px] text-soft font-light leading-relaxed font-mono">
          {stripBrackets(text)}
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-1.5">
          {segments.map((seg, i) => {
            const clean = stripBrackets(seg);
            const isBox = seg.startsWith("[") || seg.startsWith("(");
            const isNote =
              !isBox && seg.includes(":") && i > 0 && i < segments.length - 1;

            return (
              <div key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <svg
                    width="16"
                    height="10"
                    viewBox="0 0 16 10"
                    className="text-whisper shrink-0"
                  >
                    <path
                      d="M0 5h12M9 1l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <span
                  className={[
                    "px-2.5 py-1 rounded-lg text-[11.5px] font-medium leading-snug text-center max-w-[160px]",
                    isBox
                      ? "bg-surface border border-edge-2 text-text"
                      : isNote
                        ? "bg-[rgba(217,79,43,0.06)] border border-[rgba(217,79,43,0.2)] text-ember text-[10.5px] italic"
                        : "text-soft text-[11px]",
                  ].join(" ")}
                >
                  {clean}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export default function VisualRound({ questions, onComplete }: Props) {
  const { submitAnswer, startQuestion } = useDiagnosticStore();

  const [phase, setPhase] = useState<"intro" | "questions" | "done">("intro");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase !== "questions") return;
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

  useEffect(() => {
    if (phase !== "questions") return;
    startQuestion();
    setSelected(null);
    setRevealed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, phase]);

  function handleSelect(c: string) {
    if (!revealed) setSelected(c);
  }

  function handleCheck() {
    if (!selected || revealed) return;
    const correct = selected === questions[index].answer;
    submitAnswer({
      question_id: questions[index].id,
      method: "visual",
      correct,
      time_ms: 0,
      user_answer: selected,
    });
    if (correct) setScore((s) => s + 1);
    setRevealed(true);
  }

  function handleNext() {
    if (index < questions.length - 1) setIndex((i) => i + 1);
    else {
      clearInterval(timerRef.current!);
      setPhase("done");
    }
  }

  function handleDone() {
    for (let i = index + (revealed ? 1 : 0); i < questions.length; i++) {
      submitAnswer({
        question_id: questions[i].id,
        method: "visual",
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
        <div className="w-14 h-14 rounded-2xl bg-[rgba(217,79,43,0.1)] border border-[rgba(217,79,43,0.2)] flex items-center justify-center text-flame">
          <IcEye s={24} />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-flame tracking-[2.5px] uppercase mb-2">
            Round 3 of 4
          </p>
          <h2 className="font-serif text-[22px] sm:text-[26px] font-medium text-text tracking-[-0.02em] mb-3">
            Visual Round
          </h2>
          <p className="text-[13.5px] text-soft font-light leading-relaxed">
            Each question comes with a{" "}
            <strong className="text-text font-semibold">
              diagram or flow chart
            </strong>{" "}
            showing how the concepts connect. Read it carefully before
            answering. You have{" "}
            <strong className="text-text font-semibold">2 minutes</strong>.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-center text-[12px] text-whisper">
          <span>⏱ 2 min limit</span>
          <span className="w-1 h-1 rounded-full bg-edge" />
          <span>{questions.length} questions</span>
          <span className="w-1 h-1 rounded-full bg-edge" />
          <span>Read diagram first</span>
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
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col items-center gap-5 max-w-[480px] mx-auto w-full py-6 text-center">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center border ${pct >= 70 ? "bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.2)] text-green-400" : "bg-[rgba(217,79,43,0.1)] border-[rgba(217,79,43,0.2)] text-ember"}`}
        >
          <IcEye s={24} />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-flame tracking-[2.5px] uppercase mb-2">
            Round complete
          </p>
          <h2 className="font-serif text-[22px] font-medium text-text mb-2">
            Visual round done!
          </h2>
          <p className="text-[13px] text-soft font-light">
            You got <span className="text-text font-semibold">{score}</span> of{" "}
            {questions.length} correct ({pct}%).
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

  /* ── QUESTIONS ── */
  const q = questions[index];
  const progress = (index / questions.length) * 100;

  return (
    <div className="flex flex-col gap-4 max-w-[620px] mx-auto w-full">
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
        <TimerRing s={timeLeft} total={ROUND_SECONDS} />
      </div>

      <div className="flex items-center gap-2 justify-between">
        <DiffBadge d={q.difficulty} />
        <span className="text-[11px] text-whisper">{score} correct so far</span>
      </div>

      {/* Context / Diagram panel */}
      {q.context && <ContextPanel text={q.context} />}

      {/* Question */}
      <div className="relative overflow-hidden bg-surface border border-edge rounded-2xl p-5 sm:p-6">
        <div className="absolute top-0 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-edge-2 to-transparent" />
        <p className="text-[10px] font-semibold text-flame tracking-[2px] uppercase mb-2.5">
          Question {index + 1}
        </p>
        <p className="font-serif text-[clamp(15px,2.3vw,18px)] font-medium text-text leading-snug tracking-[-0.01em]">
          {q.question}
        </p>
      </div>

      {/* Choices */}
      <div className="flex flex-col gap-2.5">
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
                "border-edge bg-lift text-whisper opacity-40 cursor-default";
          } else if (isSel)
            cls =
              "border-[rgba(217,79,43,0.45)] bg-[rgba(217,79,43,0.07)] text-text cursor-pointer";

          return (
            <button
              key={choice}
              onClick={() => handleSelect(choice)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left text-[13.5px] font-medium font-sans transition-all duration-150 active:scale-[0.99] ${cls}`}
            >
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  revealed && isCorr
                    ? "border-green-400 bg-[rgba(34,197,94,0.15)] text-green-400"
                    : revealed && isSel
                      ? "border-red-400 bg-[rgba(239,68,68,0.15)] text-red-400"
                      : isSel
                        ? "border-flame bg-[rgba(217,79,43,0.15)] text-flame"
                        : "border-edge-2"
                }`}
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

      {/* Explanation */}
      {revealed && q.explanation && (
        <div className="flex gap-3 px-4 py-4 bg-[rgba(217,79,43,0.05)] border border-[rgba(217,79,43,0.18)] rounded-xl">
          <div className="w-1 rounded-full bg-flame shrink-0 self-stretch" />
          <p className="text-[12.5px] sm:text-[13px] text-soft font-light leading-relaxed">
            {q.explanation}
          </p>
        </div>
      )}

      {/* Actions */}
      {!revealed ? (
        <button
          onClick={handleCheck}
          disabled={!selected}
          className="w-full flex items-center justify-center gap-2 bg-text text-ink rounded-full py-3.5 text-[14px] font-semibold cursor-pointer border-none transition-all hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_4px_22px_rgba(0,0,0,0.3)]"
        >
          Check answer
        </button>
      ) : (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-gradient-to-br from-ember to-flame text-white rounded-full px-6 py-3 text-[13.5px] font-semibold cursor-pointer border-none transition-all hover:opacity-90 active:scale-95 shadow-[0_4px_16px_rgba(217,79,43,0.28)]"
          >
            {index < questions.length - 1 ? "Next question →" : "Finish round"}
          </button>
        </div>
      )}
    </div>
  );
}
