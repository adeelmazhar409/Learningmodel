"use client";
import { useState } from "react";

interface Props { script: string; title: string; }

export default function TeachBackViewer({ script, title }: Props) {
  const [practiced, setPracticed] = useState(false);
  const paragraphs = script.split(/\n+/).filter(Boolean);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[640px] mx-auto">
      <div className="flex items-start gap-3.5 px-5 py-5 bg-[rgba(217,79,43,0.06)] border border-[rgba(217,79,43,0.18)] rounded-2xl">
        <span className="text-[22px] shrink-0 mt-0.5">🎙</span>
        <div>
          <p className="font-serif text-base font-medium text-[#f0ede8] mb-1.5">How to use the teach-back script</p>
          <p className="text-[13.5px] text-[rgba(240,237,232,0.55)] font-light leading-relaxed">Read this script aloud as if you&apos;re explaining it to a classmate. Don&apos;t just read — try to say it in your own words where you can.</p>
        </div>
      </div>

      <div className="relative overflow-hidden bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-[20px] px-7 py-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.018)] to-transparent pointer-events-none rounded-[inherit]"/>
        <p className="text-[10.5px] text-[#d94f2b] tracking-[1.6px] uppercase font-medium mb-4 flex items-center gap-2 before:block before:w-[18px] before:h-px before:bg-[#d94f2b]">Your teach-back script</p>
        <p className="font-serif text-xl font-medium text-[#f0ede8] mb-4 tracking-[-0.01em]">{title}</p>
        {paragraphs.map((p, i) => (
          <p key={i} className="text-[15px] text-[rgba(240,237,232,0.55)] leading-[1.8] font-light mb-3.5 last:mb-0">{p}</p>
        ))}
      </div>

      <div>
        <p className="text-[11px] text-[rgba(240,237,232,0.25)] tracking-[1.4px] uppercase mb-3">Tips for teaching back</p>
        <div className="flex flex-col gap-2">
          {["Close the script after reading it once, then try to explain without looking.", "Record yourself on your phone — listening back reveals gaps in your understanding.", "Use simple language. If you can't explain it simply, you don't fully understand it yet."].map(t => (
            <div key={t} className="flex items-start gap-2.5 px-3.5 py-3 bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-xl">
              <div className="w-[5px] h-[5px] rounded-full bg-[#d94f2b] shrink-0 mt-[6px]"/>
              <span className="text-[13px] text-[rgba(240,237,232,0.55)] font-light leading-relaxed">{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        {!practiced ? (
          <button onClick={() => setPracticed(true)} className="w-full max-w-[360px] flex items-center justify-center bg-[#f0ede8] text-[#0c0c0e] rounded-full py-3.5 text-sm font-medium transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">Mark as practised</button>
        ) : (
          <>
            <div className="flex items-center gap-2 px-5 py-3 bg-[rgba(34,197,94,0.07)] border border-[rgba(34,197,94,0.25)] rounded-full text-[13.5px] font-medium text-[#4ade80]">✓ &nbsp;Practised</div>
            <p className="text-[12.5px] text-[rgba(240,237,232,0.25)] text-center leading-relaxed max-w-[380px]">Effort builds ability. Come back tomorrow and try explaining it again without the script.</p>
          </>
        )}
      </div>
    </div>
  );
}
