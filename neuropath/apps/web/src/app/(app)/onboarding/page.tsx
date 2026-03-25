"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { userApi } from "@/lib/api/user.api";
import toast from "react-hot-toast";

const GRADES = [
  { value: 5,  label: "Grade 5",  sub: "Age 10–11" },
  { value: 6,  label: "Grade 6",  sub: "Age 11–12" },
  { value: 7,  label: "Grade 7",  sub: "Age 12–13" },
  { value: 8,  label: "Grade 8",  sub: "Age 13–14" },
  { value: 9,  label: "Grade 9",  sub: "Age 14–15" },
  { value: 10, label: "Grade 10", sub: "Age 15–16" },
  { value: 11, label: "Grade 11", sub: "Age 16–17" },
  { value: 12, label: "Grade 12", sub: "Age 17–18" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [selected, setSelected] = useState<number | null>(null);
  const [loading,  setLoading]  = useState(false);

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
    <>
      <style>{`
        .onb-page {
          min-height: calc(100svh - 80px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px 80px;
        }

        .onb-inner {
          width: 100%;
          max-width: 600px;
        }

        .onb-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--flame);
          margin-bottom: 16px;
        }
        .onb-eyebrow::before {
          content: '';
          display: block;
          width: 18px;
          height: 1px;
          background: var(--flame);
        }

        .onb-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 500;
          color: var(--text);
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin-bottom: 12px;
        }
        .onb-heading em {
          font-style: italic;
          color: rgba(240,237,232,0.65);
        }

        .onb-sub {
          font-size: 15px;
          color: var(--soft);
          line-height: 1.65;
          font-weight: 300;
          margin-bottom: 40px;
          max-width: 480px;
        }

        /* Grade grid */
        .grade-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 36px;
        }

        .grade-tile {
          background: var(--surface);
          border: 1px solid var(--edge);
          border-radius: 14px;
          padding: 18px 12px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.18s;
          user-select: none;
          position: relative;
          overflow: hidden;
        }
        .grade-tile::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.018) 0%, transparent 55%);
          pointer-events: none;
          border-radius: inherit;
        }
        .grade-tile:hover {
          border-color: var(--edge2);
          background: rgba(255,255,255,0.04);
          transform: translateY(-2px);
        }
        .grade-tile.selected {
          border-color: rgba(217,79,43,0.55);
          background: rgba(217,79,43,0.08);
          transform: translateY(-2px);
        }
        .grade-tile.selected::before {
          content: '';
          position: absolute;
          top: -1px; left: 20%; right: 20%;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--flame), transparent);
        }

        .grade-tile-label {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 3px;
          line-height: 1;
        }
        .grade-tile.selected .grade-tile-label {
          color: var(--ember);
        }
        .grade-tile-sub {
          font-size: 11px;
          color: var(--whisper);
          letter-spacing: 0.03em;
        }

        /* Action row */
        .onb-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .onb-continue {
          flex: 1;
          justify-content: center;
        }
        .onb-continue:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none !important;
        }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(12,12,14,0.3);
          border-top-color: var(--ink);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        .onb-note {
          font-size: 12px;
          color: var(--whisper);
          line-height: 1.5;
          margin-top: 16px;
          text-align: center;
        }

        @media (max-width: 500px) {
          .grade-grid { grid-template-columns: repeat(2, 1fr); }
          .onb-page   { padding: 32px 18px 60px; }
        }
      `}</style>

      <div className="onb-page">
        <div className="onb-inner">
          <p className="onb-eyebrow">Step 1 of 2</p>

          <h1 className="onb-heading">
            Welcome, {firstName}.<br />
            <em>What grade are you in?</em>
          </h1>

          <p className="onb-sub">
            This helps us select the right diagnostic topics — ones you
            haven&apos;t studied yet, so your results are accurate.
          </p>

          {/* Grade picker */}
          <div className="grade-grid">
            {GRADES.map(g => (
              <button
                key={g.value}
                className={`grade-tile${selected === g.value ? " selected" : ""}`}
                onClick={() => setSelected(g.value)}
                type="button"
              >
                <div className="grade-tile-label">{g.label}</div>
                <div className="grade-tile-sub">{g.sub}</div>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="onb-actions">
            <button
              className="btn-p onb-continue"
              onClick={handleContinue}
              disabled={!selected || loading}
            >
              {loading
                ? <><span className="spinner" /> Saving…</>
                : "Continue to Diagnostic →"
              }
            </button>
          </div>

          <p className="onb-note">
            You can change your grade later in your profile settings.
          </p>
        </div>
      </div>
    </>
  );
}
