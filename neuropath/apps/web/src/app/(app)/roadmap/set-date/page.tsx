"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { roadmapApi } from "@/lib/api/roadmap.api";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const SUBJECTS = [
  "General (Critical Thinking)",
  "Biology",
  "Chemistry",
  "Physics",
  "History",
];

export default function SetDatePage() {
  const router = useRouter();

  const [subject,   setSubject]   = useState("");
  const [testDate,  setTestDate]  = useState("");
  const [loading,   setLoading]   = useState(false);

  const today    = dayjs().format("YYYY-MM-DD");
  const maxDate  = dayjs().add(90, "day").format("YYYY-MM-DD");
  const daysLeft = testDate
    ? Math.max(0, dayjs(testDate).diff(dayjs(), "day"))
    : null;

  const canSubmit = subject && testDate && daysLeft !== null && daysLeft >= 1;

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
    <>
      <style>{`
        .sd-page {
          max-width: 560px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        .sd-header { margin-bottom: 36px; }
        .sd-eyebrow {
          font-size: 11px; color: var(--flame); letter-spacing: 2px;
          text-transform: uppercase; margin-bottom: 10px; font-weight: 500;
          display: flex; align-items: center; gap: 8px;
        }
        .sd-eyebrow::before { content:''; display:block; width:18px; height:1px; background:var(--flame); }
        .sd-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 4vw, 36px); font-weight: 500;
          color: var(--text); letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 10px;
        }
        .sd-sub { font-size: 15px; color: var(--soft); font-weight: 300; line-height: 1.65; }

        .sd-form { display: flex; flex-direction: column; gap: 22px; }
        .sd-field { display: flex; flex-direction: column; gap: 8px; }

        /* Subject grid */
        .sd-subjects {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 9px;
        }
        .sd-subject-btn {
          padding: 13px 16px;
          background: var(--surface);
          border: 1px solid var(--edge);
          border-radius: 12px;
          font-size: 13.5px;
          color: var(--soft);
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          cursor: pointer;
          text-align: left;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
          line-height: 1.3;
        }
        .sd-subject-btn:hover {
          border-color: var(--edge2);
          background: rgba(255,255,255,0.04);
          color: var(--text);
        }
        .sd-subject-btn.sel {
          border-color: rgba(217,79,43,0.45);
          background: rgba(217,79,43,0.07);
          color: var(--text);
        }

        /* Date input */
        .sd-date-input {
          width: 100%;
          background: var(--surface);
          border: 1px solid var(--edge);
          border-radius: 12px;
          padding: 13px 16px;
          font-size: 14px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
          -webkit-appearance: none;
          color-scheme: dark;
        }
        .sd-date-input:focus {
          border-color: rgba(217,79,43,0.45);
          box-shadow: 0 0 0 3px rgba(217,79,43,0.07);
        }

        /* Days preview */
        .sd-days-preview {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          background: rgba(217,79,43,0.06);
          border: 1px solid rgba(217,79,43,0.18);
          border-radius: 12px;
          font-size: 14px;
          color: var(--soft);
          font-weight: 300;
          animation: riseIn 0.4s ease both;
        }
        .sd-days-num {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--text);
          line-height: 1;
          flex-shrink: 0;
        }

        /* Submit */
        .sd-submit { width: 100%; justify-content: center; margin-top: 4px; }
        .sd-submit:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
        .sd-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(12,12,14,0.3);
          border-top-color: var(--ink);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        .sd-note {
          font-size: 12px;
          color: var(--whisper);
          text-align: center;
          line-height: 1.55;
        }

        @media(max-width:480px) {
          .sd-page     { padding: 32px 18px 60px; }
          .sd-subjects { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="sd-page">
        <div className="sd-header">
          <p className="sd-eyebrow">Set Test Date</p>
          <h1 className="sd-heading">When is your test?</h1>
          <p className="sd-sub">
            Tell us the subject and your test date. We&apos;ll build a personalised
            day-by-day study plan that fits your schedule.
          </p>
        </div>

        <div className="sd-form">
          {/* Subject */}
          <div className="sd-field">
            <label className="label">Subject</label>
            <div className="sd-subjects">
              {SUBJECTS.map(s => (
                <button
                  key={s}
                  className={`sd-subject-btn${subject === s ? " sel" : ""}`}
                  onClick={() => setSubject(s)}
                  type="button"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Test date */}
          <div className="sd-field">
            <label className="label" htmlFor="test-date">Test date</label>
            <input
              id="test-date"
              type="date"
              className="sd-date-input"
              value={testDate}
              min={today}
              max={maxDate}
              onChange={e => setTestDate(e.target.value)}
            />
          </div>

          {/* Days preview */}
          {daysLeft !== null && daysLeft >= 1 && (
            <div className="sd-days-preview">
              <span className="sd-days-num">{daysLeft}</span>
              <span>
                day{daysLeft !== 1 ? "s" : ""} until your test.
                We&apos;ll create {Math.min(daysLeft, 7)} days of tasks to get you ready.
              </span>
            </div>
          )}
          {daysLeft === 0 && testDate && (
            <div style={{ fontSize: 13, color: "var(--ember)", padding: "10px 0" }}>
              Your test is today — pick a future date to generate a roadmap.
            </div>
          )}

          {/* Submit */}
          <button
            className="btn-p sd-submit"
            onClick={handleGenerate}
            disabled={!canSubmit || loading}
          >
            {loading
              ? <><span className="sd-spinner"/> Building your roadmap…</>
              : "Generate Study Roadmap →"
            }
          </button>

          <p className="sd-note">
            You can change your test date at any time from the roadmap page.
          </p>
        </div>
      </div>
    </>
  );
}
