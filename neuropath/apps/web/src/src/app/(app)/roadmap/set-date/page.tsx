"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { roadmapApi } from "@/lib/api/roadmap.api";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const SUBJECTS = ["General (Critical Thinking)", "Biology", "Chemistry", "Physics", "History"];

export default function SetDatePage() {
  const router = useRouter();
  const [subject,  setSubject]  = useState("");
  const [testDate, setTestDate] = useState("");
  const [loading,  setLoading]  = useState(false);
  const today    = dayjs().format("YYYY-MM-DD");
  const maxDate  = dayjs().add(90, "day").format("YYYY-MM-DD");
  const daysLeft = testDate ? Math.max(0, dayjs(testDate).diff(dayjs(), "day")) : null;
  const canSubmit = subject && testDate && daysLeft !== null && daysLeft >= 1;

  async function handleGenerate() {
    if (!canSubmit) return;
    setLoading(true);
    try { await roadmapApi.generate({ subject, test_date: testDate }); toast.success("Study roadmap created!"); router.push("/roadmap"); }
    catch { toast.error("Could not generate roadmap. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-[560px] mx-auto px-6 py-12 pb-20">
      <div className="mb-9">
        <p className="flex items-center gap-2 text-[11px] font-medium text-[#d94f2b] tracking-[2px] uppercase mb-2.5 before:block before:w-[18px] before:h-px before:bg-[#d94f2b]">Set Test Date</p>
        <h1 className="font-serif text-[clamp(26px,4vw,36px)] font-medium text-[#f0ede8] tracking-[-0.02em] leading-tight mb-2.5">When is your test?</h1>
        <p className="text-[15px] text-[rgba(240,237,232,0.55)] font-light leading-relaxed">Tell us the subject and your test date. We&apos;ll build a personalised day-by-day study plan.</p>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <label className="block text-[11px] font-medium text-[rgba(240,237,232,0.55)] tracking-[0.04em] uppercase mb-3">Subject</label>
          <div className="grid grid-cols-2 gap-2.5 max-[480px]:grid-cols-1">
            {SUBJECTS.map(s => (
              <button key={s} type="button" onClick={() => setSubject(s)}
                className={`px-4 py-3 bg-[#141418] border rounded-xl text-[13.5px] font-sans font-light text-left cursor-pointer transition-all hover:border-[rgba(255,255,255,0.13)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#f0ede8] ${subject === s ? "border-[rgba(217,79,43,0.45)] bg-[rgba(217,79,43,0.07)] text-[#f0ede8]" : "border-[rgba(255,255,255,0.07)] text-[rgba(240,237,232,0.55)]"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-[rgba(240,237,232,0.55)] tracking-[0.04em] uppercase mb-3" htmlFor="test-date">Test date</label>
          <input id="test-date" type="date" value={testDate} min={today} max={maxDate} onChange={e => setTestDate(e.target.value)}
            className="w-full bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-xl px-4 py-3 text-sm text-[#f0ede8] outline-none transition-all focus:border-[rgba(217,79,43,0.45)] focus:shadow-[0_0_0_3px_rgba(217,79,43,0.07)] font-sans [color-scheme:dark]"/>
        </div>

        {daysLeft !== null && daysLeft >= 1 && (
          <div className="flex items-center gap-3 px-4 py-3.5 bg-[rgba(217,79,43,0.06)] border border-[rgba(217,79,43,0.18)] rounded-xl">
            <span className="font-serif text-[22px] font-semibold text-[#f0ede8] leading-none shrink-0">{daysLeft}</span>
            <span className="text-sm text-[rgba(240,237,232,0.55)] font-light">day{daysLeft !== 1 ? "s" : ""} until your test. We&apos;ll create {Math.min(daysLeft, 7)} days of tasks to get you ready.</span>
          </div>
        )}
        {daysLeft === 0 && testDate && <p className="text-[13px] text-[#e8603c] py-2">Your test is today — pick a future date to generate a roadmap.</p>}

        <button onClick={handleGenerate} disabled={!canSubmit || loading}
          className="w-full flex items-center justify-center gap-2 bg-[#f0ede8] text-[#0c0c0e] rounded-full py-3.5 text-sm font-medium transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">
          {loading ? <><span className="w-4 h-4 border-2 border-[rgba(12,12,14,0.3)] border-t-[#0c0c0e] rounded-full animate-spin"/>Building your roadmap…</> : "Generate Study Roadmap →"}
        </button>
        <p className="text-xs text-[rgba(240,237,232,0.25)] text-center">You can change your test date at any time from the roadmap page.</p>
      </div>
    </div>
  );
}
