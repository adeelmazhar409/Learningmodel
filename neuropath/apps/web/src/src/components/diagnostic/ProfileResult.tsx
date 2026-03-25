"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { LearningProfile, DiagnosticScores } from "@neuropath/types";

interface Props { profile: LearningProfile; scores: DiagnosticScores; }

const METHOD_META: Record<keyof LearningProfile, { label: string; desc: string }> = {
  practice:   { label: "Practice Problems", desc: "You learn best by applying knowledge to real questions. Your brain locks in understanding through doing." },
  teach_back: { label: "Teach-Back",        desc: "Explaining ideas out loud solidifies your understanding. Teaching is how you master." },
  flashcards: { label: "Active Recall",     desc: "Question-and-answer repetition helps you retrieve facts quickly under pressure." },
  visual:     { label: "Visual Mapping",    desc: "Diagrams and spatial relationships help you see how concepts connect." },
};
const BAR_OPACITY = ["opacity-100","opacity-75","opacity-50","opacity-30"];

export default function ProfileResult({ profile, scores }: Props) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t); }, []);

  const sorted  = (Object.keys(profile) as Array<keyof LearningProfile>).sort((a, b) => profile[b] - profile[a]);
  const primary = sorted[0]; const secondary = sorted[1];

  return (
    <div className="flex flex-col gap-8 w-full max-w-[600px] mx-auto">
      <div className="text-center">
        <p className="text-[11px] text-[#d94f2b] tracking-[2px] uppercase font-medium mb-3">Diagnostic complete</p>
        <h1 className="font-serif text-[clamp(28px,4vw,40px)] font-medium text-[#f0ede8] tracking-[-0.02em] leading-[1.15] mb-2.5">
          Your learning profile<br/><em className="italic text-[rgba(240,237,232,0.65)]">has been revealed.</em>
        </h1>
        <p className="text-[14.5px] text-[rgba(240,237,232,0.55)] font-light leading-relaxed">Based on your actual performance — not guesswork — here is how your brain learns best.</p>
      </div>

      {/* Primary badge */}
      <div className="relative overflow-hidden px-6 py-5 bg-[rgba(217,79,43,0.08)] border border-[rgba(217,79,43,0.25)] rounded-[18px]">
        <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-[#d94f2b] to-transparent"/>
        <p className="text-[10.5px] text-[#d94f2b] tracking-[1.6px] uppercase font-medium mb-1.5">Your primary learning method</p>
        <p className="font-serif text-[22px] font-medium text-[#f0ede8] mb-2 tracking-[-0.01em]">{METHOD_META[primary].label}</p>
        <p className="text-sm text-[rgba(240,237,232,0.55)] font-light leading-relaxed">{METHOD_META[primary].desc}</p>
      </div>

      {/* Bar chart */}
      <div className="flex flex-col gap-3.5">
        {sorted.map((m, i) => (
          <div key={m} className="flex items-center gap-3.5">
            <span className="text-[13px] text-[rgba(240,237,232,0.55)] font-light w-[130px] shrink-0 text-right">{METHOD_META[m].label}</span>
            <div className="flex-1 h-2 bg-[rgba(255,255,255,0.07)] rounded-full overflow-hidden">
              <div className={`h-full bg-[#d94f2b] rounded-full transition-[width] duration-[1200ms] ${BAR_OPACITY[i]}`} style={{ width: animated ? `${Math.round(profile[m] * 100)}%` : "0%" }}/>
            </div>
            <span className="text-[13px] font-serif text-[rgba(240,237,232,0.25)] w-9 text-right shrink-0">{Math.round(profile[m] * 100)}%</span>
          </div>
        ))}
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {sorted.map(m => (
          <div key={m} className="bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-xl px-[18px] py-4">
            <p className="text-[11px] text-[rgba(240,237,232,0.25)] tracking-[0.04em] uppercase mb-2.5">{METHOD_META[m].label}</p>
            {[["Accuracy", `${Math.round(scores[m].accuracy)}%`], ["Speed", `${Math.round(scores[m].speed)}%`], ["Retention", `${Math.round(scores[m].retention)}%`]].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-[rgba(240,237,232,0.55)] font-light">{label}</span>
                <span className="text-xs text-[#f0ede8] font-medium">{val}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        <Link href="/record" className="w-full flex items-center justify-center bg-[#f0ede8] text-[#0c0c0e] rounded-full py-3.5 text-sm font-medium no-underline transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">Record your first lecture →</Link>
        <Link href="/dashboard" className="w-full flex items-center justify-center bg-transparent border border-[rgba(255,255,255,0.13)] text-[rgba(240,237,232,0.55)] rounded-full py-3.5 text-sm font-medium no-underline transition-all hover:text-[#f0ede8] hover:border-[rgba(255,255,255,0.26)]">Go to dashboard</Link>
      </div>

      <p className="text-xs text-[rgba(240,237,232,0.25)] text-center leading-relaxed">
        Your secondary method is <strong className="text-[rgba(240,237,232,0.55)] font-medium">{METHOD_META[secondary].label}</strong>. Both are prioritised in every study pack.
      </p>
    </div>
  );
}
