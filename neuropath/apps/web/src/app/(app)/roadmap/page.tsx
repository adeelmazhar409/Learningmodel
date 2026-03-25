"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { roadmapApi } from "@/lib/api/roadmap.api";
import TaskList       from "@/components/roadmap/TaskList";
import type { Roadmap, RoadmapTask } from "@neuropath/types";
import dayjs from "dayjs";

export default function RoadmapPage() {
  const [roadmap,  setRoadmap]  = useState<Roadmap | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    roadmapApi.get()
      .then(setRoadmap)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleTaskUpdate(updated: RoadmapTask) {
    if (!roadmap) return;
    setRoadmap({
      ...roadmap,
      tasks: roadmap.tasks.map(t => t.id === updated.id ? updated : t),
    });
  }

  const daysLeft    = roadmap ? dayjs(roadmap.test_date).diff(dayjs(), "day") : null;
  const totalTasks  = roadmap?.tasks.length ?? 0;
  const doneTasks   = roadmap?.tasks.filter(t => t.completed).length ?? 0;
  const pct         = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <>
      <style>{`
        .rm-page { max-width: 860px; margin: 0 auto; padding: 40px 24px 80px; }

        .rm-header { margin-bottom: 36px; }
        .rm-eyebrow {
          font-size: 11px; color: var(--flame); letter-spacing: 2px;
          text-transform: uppercase; margin-bottom: 10px; font-weight: 500;
          display: flex; align-items: center; gap: 8px;
        }
        .rm-eyebrow::before { content:''; display:block; width:18px; height:1px; background:var(--flame); }
        .rm-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(24px, 3.5vw, 36px); font-weight: 500;
          color: var(--text); letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 10px;
        }
        .rm-sub { font-size: 15px; color: var(--soft); font-weight: 300; line-height: 1.65; }

        /* Stats row */
        .rm-stats {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 12px; margin-bottom: 32px;
        }
        .rm-stat {
          background: var(--surface); border: 1px solid var(--edge);
          border-radius: 16px; padding: 20px 18px; text-align: center;
        }
        .rm-stat-n {
          font-family: 'Playfair Display', serif;
          font-size: 30px; font-weight: 600;
          color: var(--text); line-height: 1; letter-spacing:-0.02em; margin-bottom:4px;
        }
        .rm-stat-l { font-size: 11.5px; color: var(--whisper); letter-spacing: 0.04em; }

        /* Progress */
        .rm-progress-wrap { margin-bottom: 32px; }
        .rm-progress-label {
          display: flex; justify-content: space-between;
          font-size: 12px; color: var(--whisper); margin-bottom: 8px;
        }

        /* Empty */
        .rm-empty {
          text-align: center; padding: 64px 24px;
          display: flex; flex-direction: column; align-items: center; gap: 16px;
        }
        .rm-empty-icon { font-size: 36px; }
        .rm-empty-heading {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 500; color: var(--text); margin-bottom: 6px;
        }
        .rm-empty-sub { font-size: 14px; color: var(--soft); line-height: 1.65; font-weight: 300; max-width: 360px; }

        /* Loading */
        .rm-loading {
          display: flex; align-items: center; justify-content: center; padding: 80px 24px;
        }
        .rm-spinner {
          width: 28px; height: 28px;
          border: 2px solid var(--edge); border-top-color: var(--ember);
          border-radius: 50%; animation: spin 0.8s linear infinite;
        }

        @media(max-width:640px) {
          .rm-page  { padding: 28px 18px 60px; }
          .rm-stats { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>

      <div className="rm-page">
        <div className="rm-header">
          <p className="rm-eyebrow">Study Roadmap</p>
          <h1 className="rm-heading">
            {roadmap ? `${roadmap.subject} — ${dayjs(roadmap.test_date).format("MMM D")}` : "Your Roadmap"}
          </h1>
          {roadmap && (
            <p className="rm-sub">
              {daysLeft === 0 ? "Your test is today — good luck." : daysLeft && daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} until your test.` : "Your test date has passed."}
            </p>
          )}
        </div>

        {loading && <div className="rm-loading"><div className="rm-spinner"/></div>}

        {!loading && !roadmap && (
          <div className="rm-empty">
            <div className="rm-empty-icon">📅</div>
            <div>
              <p className="rm-empty-heading">No roadmap yet</p>
              <p className="rm-empty-sub">
                Set a test date and we&apos;ll build a day-by-day study plan personalised to your learning profile.
              </p>
            </div>
            <Link href="/roadmap/set-date" className="btn-p">Set a test date →</Link>
          </div>
        )}

        {!loading && roadmap && (
          <>
            {/* Stats */}
            <div className="rm-stats">
              <div className="rm-stat">
                <div className="rm-stat-n">{daysLeft ?? 0}</div>
                <div className="rm-stat-l">Days remaining</div>
              </div>
              <div className="rm-stat">
                <div className="rm-stat-n">{doneTasks}</div>
                <div className="rm-stat-l">Tasks complete</div>
              </div>
              <div className="rm-stat">
                <div className="rm-stat-n">{totalTasks - doneTasks}</div>
                <div className="rm-stat-l">Tasks remaining</div>
              </div>
            </div>

            {/* Overall progress */}
            <div className="rm-progress-wrap">
              <div className="rm-progress-label">
                <span>Overall progress</span>
                <span>{pct}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%` }}/>
              </div>
            </div>

            {/* Task list */}
            <TaskList tasks={roadmap.tasks} onUpdate={handleTaskUpdate}/>

            {/* Change date */}
            <div style={{ marginTop: 32, textAlign: "center" }}>
              <Link
                href="/roadmap/set-date"
                style={{ fontSize: 13, color: "var(--whisper)", textDecoration: "none" }}
              >
                Change test date →
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
