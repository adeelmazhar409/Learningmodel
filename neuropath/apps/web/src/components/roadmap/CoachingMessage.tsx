"use client";
import { useEffect } from "react";
import type { CoachingMessage as CoachingMessageType } from "@neuropath/types";

interface Props { message: CoachingMessageType; onDismiss: () => void; }

export default function CoachingMessage({ message, onDismiss }: Props) {
  useEffect(() => { const t = setTimeout(onDismiss, 6000); return () => clearTimeout(t); }, [onDismiss]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onDismiss(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onDismiss]);

  const icons: Record<string, string> = { task_complete: "✓", streak: "🔥", behind: "💪", exam_soon: "📅" };

  return (
    <div className="fixed inset-0 z-[700] flex items-end justify-center p-6 pointer-events-none">
      <div
        className="w-full max-w-[440px] bg-[#141418] border border-[rgba(255,255,255,0.13)] rounded-[20px] px-6 py-6 pointer-events-auto relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
        style={{ animation: "cmSlideUp 0.45s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-[#d94f2b] to-transparent" />
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#d94f2b] to-[#e8603c] rounded-b-[20px]"
          style={{ animation: "cmTimer 6s linear forwards" }}
        />
        <button
          onClick={onDismiss}
          className="absolute top-3.5 right-3.5 w-6 h-6 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.07)] rounded-full flex items-center justify-center text-[13px] text-[rgba(240,237,232,0.25)] cursor-pointer transition-all hover:bg-[rgba(255,255,255,0.1)] hover:text-[#f0ede8]"
        >
          ✕
        </button>
        <div className="flex items-start gap-3.5">
          <div className="w-[38px] h-[38px] bg-[rgba(217,79,43,0.1)] border border-[rgba(217,79,43,0.22)] rounded-[10px] flex items-center justify-center text-lg shrink-0">
            {icons[message.trigger] ?? "✓"}
          </div>
          <div>
            <p className="font-serif text-[17px] font-medium text-[#f0ede8] mb-1.5 tracking-[-0.01em] leading-tight">
              {message.heading}
            </p>
            <p className="text-[13.5px] text-[rgba(240,237,232,0.55)] leading-relaxed font-light">
              {message.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
