"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/auth.store";
import { userApi } from "../../../lib/api/user.api";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────
   Grade data
───────────────────────────────────────── */
const GRADES = [
  { value: 5, label: "Grade 5", sub: "Age 10–11" },
  { value: 6, label: "Grade 6", sub: "Age 11–12" },
  { value: 7, label: "Grade 7", sub: "Age 12–13" },
  { value: 8, label: "Grade 8", sub: "Age 13–14" },
  { value: 9, label: "Grade 9", sub: "Age 14–15" },
  { value: 10, label: "Grade 10", sub: "Age 15–16" },
  { value: 11, label: "Grade 11", sub: "Age 16–17" },
  { value: 12, label: "Grade 12", sub: "Age 17–18" },
];

/* ─────────────────────────────────────────
   SVG Icons
───────────────────────────────────────── */
function IcCheck({ s = 12 }: { s?: number }) {
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
function IcArrowRight({ s = 14 }: { s?: number }) {
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
   Page
───────────────────────────────────────── */
export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [selected, setSelected] = useState<number | null>(
    user?.grade_level ?? null,
  );
  const [loading, setLoading] = useState(false);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  async function handleContinue() {
    if (!selected) return;
    setLoading(true);
    try {
      const updated = await userApi.updateProfile({ grade_level: selected });
      setUser(updated);
      toast.success("Profile saved!");
      router.push("/diagnostic");
    } catch {
      toast.error("Could not save your grade. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[440px] h-[280px] pointer-events-none z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(217,79,43,0.07)] to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16">
        <div className="w-full max-w-[580px]">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((n) => (
              <div key={n} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10.5px] font-semibold shrink-0 transition-all ${n === 1 ? "bg-gradient-to-br from-ember to-flame text-white shadow-[0_0_10px_rgba(217,79,43,0.4)]" : "bg-lift border border-edge text-whisper"}`}
                >
                  {n === 1 ? 1 : 2}
                </div>
                <span
                  className={`text-[11px] font-semibold ${n === 1 ? "text-text" : "text-whisper"}`}
                >
                  {n === 1 ? "Your grade" : "Diagnostic"}
                </span>
                {n < 2 && <div className="w-8 h-px bg-edge" />}
              </div>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-8">
            <p className="flex items-center gap-2 text-[10px] font-semibold text-flame tracking-[2.5px] uppercase mb-3">
              <span className="w-4 h-px bg-flame" />
              Step 1 of 2
            </p>
            <h1 className="font-serif text-[clamp(26px,5vw,40px)] font-medium text-text tracking-[-0.03em] leading-[1.15] mb-3">
              Welcome, {firstName}.<br />
              <em className="italic text-soft">What grade are you in?</em>
            </h1>
            <p className="text-[13.5px] sm:text-[14.5px] text-soft font-light leading-relaxed max-w-[460px]">
              This helps us pick the right diagnostic topics — ones you
              haven&apos;t studied yet — so your learning profile is accurate.
            </p>
          </div>

          {/* Grade grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-8">
            {GRADES.map((g) => {
              const isSel = selected === g.value;
              return (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setSelected(g.value)}
                  className={[
                    "relative overflow-hidden rounded-2xl border py-4 sm:py-5 px-3 text-center cursor-pointer transition-all duration-200 active:scale-95",
                    isSel
                      ? "border-[rgba(217,79,43,0.55)] bg-[rgba(217,79,43,0.08)] -translate-y-0.5"
                      : "bg-surface border-edge hover:border-edge-2 hover:bg-lift hover:-translate-y-0.5",
                  ].join(" ")}
                >
                  {/* top stripe on selected */}
                  {isSel && (
                    <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-flame to-transparent" />
                  )}

                  {/* selected check */}
                  {isSel && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-flame flex items-center justify-center text-white">
                      <IcCheck s={8} />
                    </div>
                  )}

                  <p
                    className={`font-serif text-[15px] sm:text-base font-semibold mb-0.5 ${isSel ? "text-ember" : "text-text"}`}
                  >
                    {g.label}
                  </p>
                  <p className="text-[11px] text-whisper tracking-[0.03em]">
                    {g.sub}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <button
            onClick={handleContinue}
            disabled={!selected || loading}
            className="w-full flex items-center justify-center gap-2.5 bg-text text-ink rounded-full py-4 text-[14px] font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[rgba(12,12,14,0.25)] border-t-ink rounded-full animate-spin shrink-0" />
                Saving…
              </>
            ) : (
              <>
                Continue to Diagnostic
                <IcArrowRight />
              </>
            )}
          </button>

          <p className="text-[11.5px] text-whisper text-center mt-4 font-light">
            You can change your grade at any time in your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
}
