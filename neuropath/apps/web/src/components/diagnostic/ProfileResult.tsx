"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Local types (safe subsets)
───────────────────────────────────────── */
type Method = "flashcards" | "practice" | "visual" | "teach_back";

interface MethodScore {
  accuracy: number;
  speed: number;
  retention: number;
  final: number;
}

interface Props {
  profile: Record<Method, number>;
  scores: Record<Method, MethodScore>;
}

/* ─────────────────────────────────────────
   Method metadata
───────────────────────────────────────── */
const META: Record<
  Method,
  {
    label: string;
    short: string;
    desc: string;
    tip: string;
    icon: React.ReactNode;
  }
> = {
  practice: {
    label: "Practice Problems",
    short: "Practice",
    desc: "You learn best by applying knowledge to real questions. Your brain locks in understanding through doing, not reading.",
    tip: "NeuroPath will weight your study packs with more application questions and worked examples.",
    icon: (
      <svg
        width="18"
        height="18"
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
    ),
  },
  teach_back: {
    label: "Teach-Back / Explanation",
    short: "Teach-back",
    desc: "Explaining ideas in your own words solidifies your understanding. You master concepts by teaching them.",
    tip: "Your study packs will include more teach-back scripts and elaboration prompts.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  flashcards: {
    label: "Active Recall / Flashcards",
    short: "Flashcards",
    desc: "Question-and-answer repetition helps you retrieve facts quickly. Retrieval practice is your strongest memory tool.",
    tip: "Your study packs will be rich with high-frequency flashcard sets and spaced repetition.",
    icon: (
      <svg
        width="18"
        height="18"
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
    ),
  },
  visual: {
    label: "Visual Mapping",
    short: "Visual",
    desc: "Diagrams, flow charts and spatial relationships help you see how concepts connect and build on each other.",
    tip: "Your study packs will include more concept maps, flow diagrams and visual summaries.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </svg>
    ),
  },
};

/* ─────────────────────────────────────────
   Score bar with animation
───────────────────────────────────────── */
function ScoreBar({
  value,
  animated,
  opacity = "opacity-100",
}: {
  value: number;
  animated: boolean;
  opacity?: string;
}) {
  return (
    <div className="flex-1 h-2.5 bg-lift rounded-full overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r from-flame to-ember rounded-full transition-[width] duration-[1200ms] ease-out ${opacity}`}
        style={{ width: animated ? `${Math.min(value, 100)}%` : "0%" }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   Metric row inside score card
───────────────────────────────────────── */
function MetricRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-edge last:border-none">
      <span className="text-[11.5px] text-soft font-light">{label}</span>
      <span className="text-[12.5px] text-text font-semibold font-serif">
        {value}%
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export default function ProfileResult({ profile, scores }: Props) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  /* Sort methods by profile weight descending */
  const sorted = (Object.keys(profile) as Method[]).sort(
    (a, b) => profile[b] - profile[a],
  );
  const primary = sorted[0];
  const secondary = sorted[1];

  /* Bar opacities for ranked order */
  const BAR_OPACITY = ["opacity-100", "opacity-70", "opacity-45", "opacity-25"];

  return (
    <div className="flex flex-col gap-8 max-w-[640px] mx-auto w-full">
      {/* ── Header ── */}
      <div className="text-center">
        <p className="text-[10px] font-semibold text-flame tracking-[2.5px] uppercase mb-3">
          Diagnostic complete
        </p>
        <h1 className="font-serif text-[clamp(26px,5vw,40px)] font-medium text-text tracking-[-0.03em] leading-[1.15] mb-3">
          Your learning profile
          <br />
          <em className="italic text-soft">has been revealed.</em>
        </h1>
        <p className="text-[13.5px] sm:text-[14.5px] text-soft font-light leading-relaxed max-w-[440px] mx-auto">
          Based on your actual performance — not guesswork. Every study pack
          from now on will reflect how your brain learns best.
        </p>
      </div>

      {/* ── Primary method badge ── */}
      <div className="relative overflow-hidden bg-[rgba(217,79,43,0.07)] border border-[rgba(217,79,43,0.25)] rounded-2xl p-6 sm:p-7">
        <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-flame to-transparent" />
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-[rgba(217,79,43,0.12)] border border-[rgba(217,79,43,0.25)] flex items-center justify-center text-flame shrink-0">
            {META[primary].icon}
          </div>
          <div>
            <p className="text-[10px] font-semibold text-flame tracking-[2px] uppercase mb-1.5">
              Your primary learning method
            </p>
            <p className="font-serif text-[20px] sm:text-[22px] font-medium text-text tracking-[-0.01em] mb-2">
              {META[primary].label}
            </p>
            <p className="text-[13px] text-soft font-light leading-relaxed">
              {META[primary].desc}
            </p>
          </div>
        </div>
      </div>

      {/* ── Profile bar chart ── */}
      <div className="bg-surface border border-edge rounded-2xl p-5 sm:p-6">
        <p className="text-[10.5px] font-semibold text-whisper tracking-[0.07em] uppercase mb-5">
          Learning method profile
        </p>
        <div className="flex flex-col gap-4">
          {sorted.map((method, i) => (
            <div key={method} className="flex items-center gap-3">
              <div className="w-[110px] sm:w-[130px] shrink-0 flex items-center gap-2">
                <span className="text-whisper shrink-0">
                  {META[method].icon}
                </span>
                <span className="text-[11.5px] text-soft font-medium truncate">
                  {META[method].short}
                </span>
              </div>
              <ScoreBar
                value={profile[method] * 100}
                animated={animated}
                opacity={BAR_OPACITY[i]}
              />
              <span className="text-[13px] text-text font-semibold font-serif w-10 text-right shrink-0">
                {Math.round(profile[method] * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Score breakdown (2-column grid) ── */}
      <div>
        <p className="text-[10.5px] font-semibold text-whisper tracking-[0.07em] uppercase mb-4">
          Score breakdown — accuracy · speed · retention
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sorted.map((method, i) => (
            <div
              key={method}
              className={`bg-surface border rounded-2xl p-4 transition-all ${i === 0 ? "border-[rgba(217,79,43,0.25)]" : "border-edge"}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`text-[10px] font-semibold tracking-[0.05em] uppercase ${i === 0 ? "text-flame" : "text-whisper"}`}
                >
                  {META[method].short}
                </span>
                {i === 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[rgba(217,79,43,0.1)] border border-[rgba(217,79,43,0.2)] text-[9px] text-flame font-semibold">
                    Primary
                  </span>
                )}
                {i === 1 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-lift border border-edge text-[9px] text-whisper font-semibold">
                    Secondary
                  </span>
                )}
              </div>
              <div className="mb-3">
                <p className="font-serif text-[28px] font-semibold text-text leading-none tracking-[-0.03em] mb-0.5">
                  {scores[method].final}%
                </p>
                <p className="text-[10px] text-whisper font-medium uppercase tracking-[0.05em]">
                  Final score
                </p>
              </div>
              <MetricRow label="Accuracy" value={scores[method].accuracy} />
              <MetricRow label="Speed" value={scores[method].speed} />
              <MetricRow label="Retention" value={scores[method].retention} />
            </div>
          ))}
        </div>
      </div>

      {/* ── What this means ── */}
      <div className="bg-surface border border-edge rounded-2xl p-5 sm:p-6">
        <p className="text-[10.5px] font-semibold text-whisper tracking-[0.07em] uppercase mb-4">
          What this means for your study packs
        </p>
        <div className="flex flex-col gap-3">
          {[primary, secondary].map((method, i) => (
            <div key={method} className="flex items-start gap-3">
              <div
                className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-semibold ${i === 0 ? "bg-flame text-white" : "bg-lift border border-edge text-whisper"}`}
              >
                {i + 1}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-text mb-0.5">
                  {META[method].label}
                </p>
                <p className="text-[12.5px] text-soft font-light leading-relaxed">
                  {META[method].tip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Formula explanation ── */}
      <div className="flex items-start gap-3 px-4 py-4 bg-lift border border-edge rounded-2xl">
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
          <strong className="text-text font-semibold">
            How your profile was calculated:
          </strong>{" "}
          Final score = (Accuracy × 60%) + (Speed × 20%) + (Retention × 20%).
          Weights are then normalised to create your learning profile
          percentages.
        </p>
      </div>

      {/* ── CTA ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/record"
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-ember to-flame text-white rounded-full py-4 text-[14px] font-semibold no-underline transition-all hover:opacity-90 active:scale-95 shadow-[0_4px_24px_rgba(217,79,43,0.35)]"
        >
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
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="8" y1="22" x2="16" y2="22" />
          </svg>
          Record your first lecture
        </Link>
        <Link
          href="/dashboard"
          className="flex-1 flex items-center justify-center gap-2 bg-surface border border-edge text-text rounded-full py-4 text-[14px] font-semibold no-underline transition-all hover:border-edge-2 hover:bg-lift active:scale-95"
        >
          Go to dashboard
        </Link>
      </div>

      <p className="text-[11.5px] text-whisper text-center font-light">
        Your profile is saved. Every study pack you generate will use these
        weights to personalise your materials.
      </p>
    </div>
  );
}
