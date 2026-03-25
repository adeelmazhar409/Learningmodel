"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { studyPacksApi } from "@/lib/api/study-packs.api";
import { roadmapApi } from "@/lib/api/roadmap.api";
import type { StudyPack } from "@neuropath/types";
import type { RoadmapTask } from "@neuropath/types";

export default function DashboardPage() {
  const { user } = useAuthStore();

  const [recentPacks, setRecentPacks]   = useState<StudyPack[]>([]);
  const [todayTasks,  setTodayTasks]    = useState<RoadmapTask[]>([]);
  const [loadingPacks, setLoadingPacks] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const hasProfile  = !!user?.learning_profile;
  const firstName   = user?.name?.split(" ")[0] ?? "there";
  const gradeLabel  = user?.grade_level ? `Grade ${user.grade_level}` : "";

  /* ── Fetch recent study packs ── */
  useEffect(() => {
    studyPacksApi
      .list({ limit: 3 })
      .then(setRecentPacks)
      .catch(() => {})
      .finally(() => setLoadingPacks(false));
  }, []);

  /* ── Fetch today's roadmap tasks ── */
  useEffect(() => {
    roadmapApi
      .getTodaysTasks()
      .then(setTodayTasks)
      .catch(() => {})
      .finally(() => setLoadingTasks(false));
  }, []);

  const completedToday = todayTasks.filter(t => t.completed).length;

  return (
    <>
      <style>{`
        .dash-page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        /* ── Header ── */
        .dash-header {
          margin-bottom: 48px;
        }
        .dash-greeting {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 500;
          color: var(--text);
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin-bottom: 6px;
        }
        .dash-greeting em {
          font-style: italic;
          color: var(--soft);
        }
        .dash-meta {
          font-size: 13.5px;
          color: var(--whisper);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .dash-meta-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--edge2);
          flex-shrink: 0;
        }

        /* ── CTA banner (no diagnostic yet) ── */
        .diag-banner {
          background: linear-gradient(
            135deg,
            rgba(217,79,43,0.10) 0%,
            rgba(217,79,43,0.04) 100%
          );
          border: 1px solid rgba(217,79,43,0.22);
          border-radius: 20px;
          padding: 28px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          margin-bottom: 40px;
          position: relative;
          overflow: hidden;
        }
        .diag-banner::before {
          content: '';
          position: absolute;
          top: -1px; left: 20%; right: 60%;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--flame), transparent);
        }
        .diag-banner-left h2 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }
        .diag-banner-left p {
          font-size: 14px;
          color: var(--soft);
          line-height: 1.6;
          font-weight: 300;
          max-width: 440px;
        }

        /* ── Section layout ── */
        .dash-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        /* ── Section card ── */
        .dash-section {
          background: var(--surface);
          border: 1px solid var(--edge);
          border-radius: 20px;
          padding: 28px;
          position: relative;
          overflow: hidden;
        }
        .dash-section::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.018) 0%, transparent 55%);
          pointer-events: none;
          border-radius: inherit;
        }
        .dash-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }
        .dash-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 500;
          color: var(--text);
          letter-spacing: -0.01em;
        }
        .dash-section-link {
          font-size: 12px;
          color: var(--flame);
          text-decoration: none;
          font-weight: 500;
          letter-spacing: 0.03em;
          transition: opacity 0.2s;
        }
        .dash-section-link:hover { opacity: 0.75; }

        /* ── Quick stats row ── */
        .dash-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 40px;
        }
        .dash-stat {
          background: var(--surface);
          border: 1px solid var(--edge);
          border-radius: 16px;
          padding: 20px 18px;
          text-align: center;
        }
        .dash-stat-n {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          font-weight: 600;
          color: var(--text);
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }
        .dash-stat-l {
          font-size: 11.5px;
          color: var(--whisper);
          letter-spacing: 0.04em;
        }

        /* ── Pack preview ── */
        .pack-preview {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .pack-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.025);
          border: 1px solid var(--edge);
          border-radius: 12px;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .pack-row:hover {
          border-color: var(--edge2);
          background: rgba(255,255,255,0.04);
        }
        .pack-row-icon {
          width: 36px; height: 36px;
          background: rgba(217,79,43,0.08);
          border: 1px solid rgba(217,79,43,0.15);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-size: 16px;
        }
        .pack-row-body { flex: 1; min-width: 0; }
        .pack-row-name {
          font-size: 13.5px;
          font-weight: 500;
          color: var(--text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 2px;
        }
        .pack-row-meta {
          font-size: 11.5px;
          color: var(--whisper);
        }

        /* ── Task list ── */
        .task-list { display: flex; flex-direction: column; gap: 10px; }
        .task-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.025);
          border: 1px solid var(--edge);
          border-radius: 12px;
        }
        .task-row.done { opacity: 0.45; }
        .task-check {
          width: 18px; height: 18px;
          border-radius: 50%;
          border: 1.5px solid var(--edge2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .task-check.done {
          background: var(--flame);
          border-color: var(--flame);
        }
        .task-check.done::after {
          content: '';
          width: 8px; height: 5px;
          border-left: 1.5px solid #fff;
          border-bottom: 1.5px solid #fff;
          transform: rotate(-45deg) translate(1px, -1px);
        }
        .task-text {
          font-size: 13.5px;
          color: var(--soft);
          line-height: 1.5;
          font-weight: 300;
          flex: 1;
        }
        .task-text.done { text-decoration: line-through; }

        /* ── Empty state ── */
        .empty-state {
          text-align: center;
          padding: 24px 16px;
          font-size: 13.5px;
          color: var(--whisper);
          line-height: 1.6;
        }
        .empty-state a {
          color: var(--ember);
          text-decoration: none;
          font-weight: 500;
        }

        /* ── Skeleton ── */
        .skel { height: 52px; border-radius: 12px; margin-bottom: 10px; }

        /* ── Profile pill ── */
        .profile-pills {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .profile-pill-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .profile-pill-label {
          font-size: 12.5px;
          color: var(--soft);
          width: 110px;
          flex-shrink: 0;
          font-weight: 300;
        }
        .profile-pill-track {
          flex: 1;
          height: 5px;
          background: var(--edge);
          border-radius: 100px;
          overflow: hidden;
        }
        .profile-pill-fill {
          height: 100%;
          background: linear-gradient(to right, var(--flame), var(--ember));
          border-radius: 100px;
        }
        .profile-pill-pct {
          font-size: 12px;
          color: var(--whisper);
          width: 34px;
          text-align: right;
          flex-shrink: 0;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .dash-sections { grid-template-columns: 1fr; }
          .dash-stats    { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 480px) {
          .dash-page  { padding: 32px 18px 60px; }
          .dash-stats { grid-template-columns: repeat(2, 1fr); }
          .diag-banner { padding: 22px 20px; }
        }
      `}</style>

      <div className="dash-page">
        {/* Header */}
        <div className="dash-header">
          <h1 className="dash-greeting">
            Good to see you, <em>{firstName}.</em>
          </h1>
          <div className="dash-meta">
            {gradeLabel && <span>{gradeLabel}</span>}
            {gradeLabel && hasProfile && <span className="dash-meta-dot" />}
            {hasProfile && <span>Learning profile active</span>}
          </div>
        </div>

        {/* Diagnostic CTA — only shown when profile doesn't exist yet */}
        {!hasProfile && (
          <div className="diag-banner">
            <div className="diag-banner-left">
              <h2>Discover how your brain learns</h2>
              <p>
                Take the 20-minute diagnostic to unlock a fully personalised
                study system. No guessing — pure performance data.
              </p>
            </div>
            <Link href="/diagnostic" className="btn-p" style={{ flexShrink: 0 }}>
              Start Diagnostic
            </Link>
          </div>
        )}

        {/* Stats row */}
        <div className="dash-stats">
          <div className="dash-stat">
            <div className="dash-stat-n">{recentPacks.length}</div>
            <div className="dash-stat-l">Study packs</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-n">{completedToday}</div>
            <div className="dash-stat-l">Tasks done today</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-n">{todayTasks.length}</div>
            <div className="dash-stat-l">Tasks remaining</div>
          </div>
        </div>

        {/* Two-column sections */}
        <div className="dash-sections">

          {/* Recent Study Packs */}
          <div className="dash-section">
            <div className="dash-section-header">
              <span className="dash-section-title">Recent Study Packs</span>
              <Link href="/study-packs" className="dash-section-link">View all →</Link>
            </div>

            {loadingPacks ? (
              <>
                <div className="skel skeleton" />
                <div className="skel skeleton" />
                <div className="skel skeleton" />
              </>
            ) : recentPacks.length === 0 ? (
              <div className="empty-state">
                No study packs yet.{" "}
                <Link href="/record">Record your first lecture</Link> to get started.
              </div>
            ) : (
              <div className="pack-preview">
                {recentPacks.map(pack => (
                  <Link
                    key={pack.id}
                    href={`/study-packs/${pack.id}/summary`}
                    className="pack-row"
                  >
                    <div className="pack-row-icon">📚</div>
                    <div className="pack-row-body">
                      <div className="pack-row-name">{pack.title}</div>
                      <div className="pack-row-meta">
                        {pack.flashcard_count} flashcards · {pack.quiz_count} questions
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Today's Tasks */}
          <div className="dash-section">
            <div className="dash-section-header">
              <span className="dash-section-title">Today&apos;s Tasks</span>
              <Link href="/roadmap" className="dash-section-link">View roadmap →</Link>
            </div>

            {loadingTasks ? (
              <>
                <div className="skel skeleton" />
                <div className="skel skeleton" />
              </>
            ) : todayTasks.length === 0 ? (
              <div className="empty-state">
                No tasks scheduled.{" "}
                <Link href="/roadmap/set-date">Set a test date</Link> to build your roadmap.
              </div>
            ) : (
              <div className="task-list">
                {todayTasks.map(task => (
                  <div key={task.id} className={`task-row${task.completed ? " done" : ""}`}>
                    <div className={`task-check${task.completed ? " done" : ""}`} />
                    <span className={`task-text${task.completed ? " done" : ""}`}>
                      {task.description}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Learning Profile */}
          {hasProfile && user?.learning_profile && (
            <div className="dash-section">
              <div className="dash-section-header">
                <span className="dash-section-title">Your Learning Profile</span>
                <Link href="/diagnostic" className="dash-section-link">Retake →</Link>
              </div>
              <div className="profile-pills">
                {[
                  { label: "Practice",    value: user.learning_profile.practice    },
                  { label: "Teach-Back",  value: user.learning_profile.teach_back  },
                  { label: "Flashcards",  value: user.learning_profile.flashcards  },
                  { label: "Visual Map",  value: user.learning_profile.visual      },
                ].sort((a, b) => b.value - a.value).map(m => (
                  <div key={m.label} className="profile-pill-row">
                    <span className="profile-pill-label">{m.label}</span>
                    <div className="profile-pill-track">
                      <div
                        className="profile-pill-fill"
                        style={{ width: `${Math.round(m.value * 100)}%` }}
                      />
                    </div>
                    <span className="profile-pill-pct">
                      {Math.round(m.value * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick record CTA */}
          <div className="dash-section" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: 16, minHeight: 180 }}>
            <div style={{ fontSize: 32 }}>🎙</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 500, color: "var(--text)", marginBottom: 6 }}>
                Record a lecture
              </div>
              <div style={{ fontSize: 13, color: "var(--soft)", fontWeight: 300, lineHeight: 1.55, maxWidth: 220, margin: "0 auto" }}>
                Turn any class into a personalised study pack in minutes.
              </div>
            </div>
            <Link href="/record" className="btn-p" style={{ fontSize: 13.5 }}>
              Start Recording
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
