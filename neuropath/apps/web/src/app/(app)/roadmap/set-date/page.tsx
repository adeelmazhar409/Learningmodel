"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { roadmapApi } from "../../../../lib/api/roadmap.api";
import toast from "react-hot-toast";
import dayjs from "dayjs";

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const SUBJECTS = [
  "General (Critical Thinking)",
  "Biology",
  "Chemistry",
  "Physics",
  "History",
];

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
function IcCalendar({ s = 15 }: { s?: number }) {
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
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IcArrowLeft({ s = 14 }: { s?: number }) {
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
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
function IcInfo({ s = 14 }: { s?: number }) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function SetDatePage() {
  const router = useRouter();

  const [subject, setSubject] = useState("");
  const [testDate, setTestDate] = useState("");
  const [loading, setLoading] = useState(false);

  const today = dayjs().format("YYYY-MM-DD");
  const maxDate = dayjs().add(90, "day").format("YYYY-MM-DD");
  const daysLeft = testDate
    ? Math.max(0, dayjs(testDate).diff(dayjs(), "day"))
    : null;

  const canSubmit =
    subject !== "" && testDate !== "" && daysLeft !== null && daysLeft >= 1;

  async function handleGenerate() {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await roadmapApi.generate({ subject, test_date: testDate });
      toast.success("Study roadmap created!");
      router.push("/roadmap");
    } catch {
      toast.error("Could not generate roadmap. Please try again.");
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
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(217,79,43,0.06)] to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[600px] mx-auto px-4 sm:px-6 pt-6 pb-28">
        {/* Back link */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[12px] text-soft font-semibold hover:text-text transition-colors cursor-pointer bg-transparent border-none mb-8"
        >
          <IcArrowLeft /> Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <p className="flex items-center gap-2 text-[10px] font-semibold text-flame tracking-[2.5px] uppercase mb-3">
            <span className="w-4 h-px bg-flame" />
            Set Test Date
          </p>
          <h1 className="font-serif text-[clamp(24px,5vw,38px)] font-medium text-text tracking-[-0.03em] leading-tight mb-2.5">
            When is your test?
          </h1>
          <p className="text-[13.5px] sm:text-[14.5px] text-soft font-light leading-relaxed">
            Tell us the subject and your test date. We&apos;ll build a
            personalised day-by-day study plan that fits your schedule.
          </p>
        </div>

        <div className="flex flex-col gap-7">
          {/* Subject picker */}
          <div>
            <label className="block text-[10.5px] font-semibold text-soft tracking-[0.08em] uppercase mb-3">
              Subject
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SUBJECTS.map((s) => {
                const isSel = subject === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSubject(s)}
                    className={[
                      "relative flex items-center justify-between px-4 py-3.5 rounded-xl border text-left cursor-pointer transition-all duration-150 active:scale-[0.98] font-sans",
                      isSel
                        ? "border-[rgba(217,79,43,0.45)] bg-[rgba(217,79,43,0.07)] text-text"
                        : "border-edge bg-surface text-soft hover:border-edge-2 hover:bg-lift hover:text-text",
                    ].join(" ")}
                  >
                    <span className="text-[13.5px] font-medium">{s}</span>
                    {isSel && (
                      <div className="w-5 h-5 rounded-full bg-flame flex items-center justify-center text-white shrink-0">
                        <IcCheck />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date picker */}
          <div>
            <label
              htmlFor="test-date"
              className="block text-[10.5px] font-semibold text-soft tracking-[0.08em] uppercase mb-3"
            >
              Test date
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-whisper pointer-events-none">
                <IcCalendar />
              </div>
              <input
                id="test-date"
                type="date"
                value={testDate}
                min={today}
                max={maxDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="w-full bg-surface border border-edge rounded-xl pl-11 pr-4 py-3.5 text-[14px] text-text outline-none font-sans focus:border-[rgba(217,79,43,0.45)] focus:shadow-[0_0_0_3px_rgba(217,79,43,0.09)] transition-all duration-200 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Days preview */}
          {daysLeft !== null && daysLeft >= 1 && (
            <div className="flex items-center gap-4 px-4 py-4 bg-[rgba(217,79,43,0.06)] border border-[rgba(217,79,43,0.18)] rounded-2xl">
              <div className="shrink-0">
                <p className="font-serif text-[32px] font-semibold text-text leading-none tracking-[-0.03em]">
                  {daysLeft}
                </p>
                <p className="text-[10px] text-whisper uppercase tracking-[0.06em] font-semibold mt-0.5">
                  {daysLeft === 1 ? "day" : "days"}
                </p>
              </div>
              <div className="h-8 w-px bg-edge shrink-0" />
              <p className="text-[13px] text-soft font-light leading-relaxed">
                until your test. We&apos;ll create{" "}
                <span className="text-text font-semibold">
                  {Math.min(daysLeft, 7)}
                </span>{" "}
                {Math.min(daysLeft, 7) === 1 ? "day" : "days"} of personalised
                tasks to get you ready.
              </p>
            </div>
          )}

          {/* Date error */}
          {daysLeft === 0 && testDate && (
            <div className="flex items-center gap-2 px-4 py-3 bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.2)] rounded-xl text-red-400">
              <IcInfo s={13} />
              <p className="text-[12.5px] font-medium">
                Your test is today — pick a future date to generate a roadmap.
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleGenerate}
            disabled={!canSubmit || loading}
            className="w-full flex items-center justify-center gap-2.5 bg-text text-ink rounded-full py-4 text-[14px] font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[rgba(12,12,14,0.25)] border-t-ink rounded-full animate-spin shrink-0" />
                Building your roadmap…
              </>
            ) : (
              <>
                Generate Study Roadmap
                <IcArrowRight />
              </>
            )}
          </button>

          <p className="text-[11.5px] text-whisper text-center font-light">
            You can change your test date at any time from the roadmap page.
          </p>
        </div>
      </div>
    </div>
  );
}
