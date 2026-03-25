"use client";
import { useState, useEffect } from "react";

interface Props { onComplete: () => void; }
const BREAK_SECONDS = 180;

export default function BreakScreen({ onComplete }: Props) {
  const [seconds, setSeconds] = useState(BREAK_SECONDS);
  useEffect(() => {
    if (seconds <= 0) { onComplete(); return; }
    const t = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds, onComplete]);

  const pct  = ((BREAK_SECONDS - seconds) / BREAK_SECONDS) * 100;
  const mm   = Math.floor(seconds / 60);
  const ss   = seconds % 60;
  const circ = 502;

  return (
    <div className="flex flex-col items-center gap-9 w-full max-w-[480px] mx-auto text-center py-5">
      {/* Countdown ring */}
      <div className="relative w-[180px] h-[180px] shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 170 170">
          <circle fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" cx="85" cy="85" r="80"/>
          <circle fill="none" stroke="#d94f2b" strokeWidth="4" strokeLinecap="round" cx="85" cy="85" r="80"
            strokeDasharray={circ} strokeDashoffset={circ - (circ * pct) / 100} style={{ transition: "stroke-dashoffset 1s linear" }}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span className="font-serif text-[36px] font-semibold text-[#f0ede8] leading-none tracking-[-0.02em]">{mm}:{String(ss).padStart(2,"0")}</span>
          <span className="text-[10px] text-[rgba(240,237,232,0.25)] tracking-[1.4px] uppercase">remaining</span>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-[clamp(22px,3vw,30px)] font-medium text-[#f0ede8] leading-tight tracking-[-0.02em] mb-0">
          Time to rest.<br/><em className="italic text-[rgba(240,237,232,0.65)]">Your brain is consolidating.</em>
        </h2>
      </div>

      <p className="text-[15px] text-[rgba(240,237,232,0.55)] font-light leading-[1.7] max-w-[380px]">
        This 3-minute break is scientifically important. It clears your short-term memory so the recall test measures real learning.
      </p>

      <div className="flex flex-col gap-2.5 w-full">
        {[["🧘","Take a few slow breaths and let your mind wander."],["💧","Grab a glass of water — hydration helps memory."],["🚶","Stand up and stretch if you can."]].map(([icon, text]) => (
          <div key={text} className="flex items-center gap-3 px-[18px] py-3 bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-xl text-left">
            <span className="text-lg shrink-0">{icon}</span>
            <span className="text-[13.5px] text-[rgba(240,237,232,0.55)] font-light leading-relaxed">{text}</span>
          </div>
        ))}
      </div>

      <button onClick={onComplete} className="bg-transparent border border-[rgba(255,255,255,0.07)] text-[rgba(240,237,232,0.25)] text-[12.5px] px-5 py-2 rounded-full cursor-pointer transition-all hover:text-[rgba(240,237,232,0.55)] hover:border-[rgba(255,255,255,0.13)] font-sans">
        Skip break (not recommended)
      </button>
    </div>
  );
}
