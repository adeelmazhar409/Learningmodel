"use client";

import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────
   Props
───────────────────────────────────────── */
interface Props {
  onComplete: () => void;
}

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const BREAK_SECONDS = 180; // 3 minutes — mandatory per the diagnostic pattern

/* ─────────────────────────────────────────
   Breathing cycle
   4-7-8 breathing: inhale 4s, hold 7s, exhale 8s = 19s cycle
   Simplified for UX: 4s in, 4s hold, 6s out = 14s cycle
───────────────────────────────────────── */
const BREATHING_CYCLE = [
  {
    label: "Breathe in",
    duration: 4,
    scale: "scale-[1.3]",
    color: "from-[rgba(217,79,43,0.25)] to-[rgba(217,79,43,0.08)]",
  },
  {
    label: "Hold",
    duration: 4,
    scale: "scale-[1.3]",
    color: "from-[rgba(217,79,43,0.25)] to-[rgba(217,79,43,0.08)]",
  },
  {
    label: "Breathe out",
    duration: 6,
    scale: "scale-[0.85]",
    color: "from-[rgba(217,79,43,0.08)] to-[rgba(217,79,43,0.03)]",
  },
] as const;

/* ─────────────────────────────────────────
   SVG icons
───────────────────────────────────────── */
function IcBrain({ s = 20 }: { s?: number }) {
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
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.41-4.28 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24A2.5 2.5 0 0 1 9.5 2z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.41-4.28 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 14.5 2z" />
    </svg>
  );
}
function IcArrow({ s = 14 }: { s?: number }) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Breathing orb
───────────────────────────────────────── */
function BreathingOrb({
  phase,
  phaseIdx,
}: {
  phase: (typeof BREATHING_CYCLE)[number];
  phaseIdx: number;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Outer glow ring */}
      <div className="relative flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48">
        {/* Pulsing glow */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-radial ${phase.color} blur-2xl transition-all duration-[4000ms] ease-in-out ${phase.scale}`}
        />
        {/* Main orb */}
        <div
          className={[
            "relative w-28 h-28 sm:w-32 sm:h-32 rounded-full",
            "bg-gradient-to-br from-[rgba(217,79,43,0.2)] to-[rgba(217,79,43,0.06)]",
            "border border-[rgba(217,79,43,0.3)]",
            "flex items-center justify-center",
            "transition-transform ease-in-out",
            phase.label === "Breathe in"
              ? "duration-[4000ms] scale-110"
              : phase.label === "Hold"
                ? "duration-[100ms]  scale-110"
                : "duration-[6000ms] scale-90",
          ].join(" ")}
        >
          {/* Inner ring */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[rgba(217,79,43,0.2)] flex items-center justify-center text-flame">
            <IcBrain s={28} />
          </div>
        </div>
      </div>

      {/* Phase label */}
      <div className="text-center">
        <p className="font-serif text-[22px] sm:text-[26px] font-medium text-text tracking-[-0.02em] mb-1">
          {phase.label}
        </p>
        <p className="text-[12px] text-whisper font-light tracking-[0.04em]">
          {phaseIdx === 0
            ? "through your nose"
            : phaseIdx === 1
              ? "keep still"
              : "through your mouth, slowly"}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export default function BreakScreen({ onComplete }: Props) {
  const [timeLeft, setTimeLeft] = useState(BREAK_SECONDS);
  const [breathPhase, setBreathPhase] = useState(0); // 0=in, 1=hold, 2=out
  const [canSkip, setCanSkip] = useState(false);
  const [dots, setDots] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Main countdown */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setCanSkip(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    /* Allow manual skip after 60s */
    const skipTimer = setTimeout(() => setCanSkip(true), 60_000);
    return () => {
      clearInterval(timerRef.current!);
      clearTimeout(skipTimer);
    };
  }, []);

  /* Breathing cycle advancement */
  useEffect(() => {
    const dur = BREATHING_CYCLE[breathPhase].duration * 1000;
    breathRef.current = setTimeout(() => {
      setBreathPhase((p) => (p + 1) % BREATHING_CYCLE.length);
    }, dur);
    return () => {
      if (breathRef.current) clearTimeout(breathRef.current);
    };
  }, [breathPhase]);

  /* Animated dots */
  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d + 1) % 4), 600);
    return () => clearInterval(t);
  }, []);

  /* Format mm:ss */
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${mins}:${String(secs).padStart(2, "0")}`;

  /* Progress arc */
  const pct = timeLeft / BREAK_SECONDS;
  const r = 28;
  const circ = 2 * Math.PI * r;

  return (
    <div className="flex flex-col items-center gap-8 max-w-[480px] mx-auto w-full py-6 text-center">
      {/* Header */}
      <div>
        <p className="text-[10px] font-semibold text-flame tracking-[2.5px] uppercase mb-2">
          Distraction Break
        </p>
        <h2 className="font-serif text-[22px] sm:text-[26px] font-medium text-text tracking-[-0.02em] mb-2">
          Clear your working memory
        </h2>
        <p className="text-[13px] text-soft font-light leading-relaxed max-w-[360px] mx-auto">
          This break is{" "}
          <strong className="text-text font-semibold">mandatory</strong> — it
          clears short-term memory so the final recall test measures real
          retention. Follow the breathing exercise below.
        </p>
      </div>

      {/* Countdown ring + breathing orb */}
      <div className="flex flex-col items-center gap-6">
        {/* Circular countdown */}
        <div className="relative flex items-center justify-center">
          <svg
            width="70"
            height="70"
            viewBox="0 0 70 70"
            className="-rotate-90"
          >
            <circle
              cx="35"
              cy="35"
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="3"
            />
            <circle
              cx="35"
              cy="35"
              r={r}
              fill="none"
              stroke="#d94f2b"
              strokeWidth="3"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - pct)}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-[16px] font-semibold text-text font-sans">
              {timeStr}
            </span>
            <span className="text-[8px] text-whisper uppercase tracking-[0.08em]">
              left
            </span>
          </div>
        </div>

        {/* Breathing orb */}
        <BreathingOrb
          phase={BREATHING_CYCLE[breathPhase]}
          phaseIdx={breathPhase}
        />
      </div>

      {/* Science note */}
      <div className="w-full flex items-start gap-3 px-4 py-4 bg-lift border border-edge rounded-2xl text-left">
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
          <strong className="text-text font-semibold">Why this matters:</strong>{" "}
          Short-term memory lasts ~20 seconds without rehearsal. This break
          ensures the upcoming recall test measures what was actually
          transferred to long-term memory — not what you&apos;re still holding
          in working memory.
        </p>
      </div>

      {/* Action */}
      {timeLeft > 0 && !canSkip && (
        <div className="flex items-center gap-2 text-[12.5px] text-whisper font-medium">
          <div className="w-4 h-4 border-[1.5px] border-edge-2 border-t-ember rounded-full animate-spin shrink-0" />
          Break in progress{".".repeat(dots)}
        </div>
      )}

      {(timeLeft === 0 || canSkip) && (
        <button
          onClick={onComplete}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-ember to-flame text-white rounded-full px-8 py-4 text-[14px] font-semibold cursor-pointer border-none transition-all hover:opacity-90 active:scale-95 shadow-[0_4px_24px_rgba(217,79,43,0.35)]"
        >
          {timeLeft === 0
            ? "Start Memory Recall →"
            : "Continue to Recall Test →"}
          <IcArrow />
        </button>
      )}

      {canSkip && timeLeft > 0 && (
        <p className="text-[11px] text-whisper font-light">
          You can continue now or wait for the full break ({timeStr} remaining).
        </p>
      )}
    </div>
  );
}
