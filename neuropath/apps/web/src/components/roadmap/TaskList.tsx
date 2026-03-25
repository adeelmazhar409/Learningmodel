"use client";

import { useState } from "react";
import type { RoadmapTask } from "@neuropath/types";
import { roadmapApi } from "@/lib/api/roadmap.api";
import toast from "react-hot-toast";
import CoachingMessage from "./CoachingMessage";
import type { CoachingMessage as CoachingMessageType } from "@neuropath/types";
import dayjs from "dayjs";

interface Props {
  tasks:     RoadmapTask[];
  onUpdate?: (updated: RoadmapTask) => void;
}

const METHOD_LABELS: Record<string, string> = {
  flashcards:  "Flashcards",
  practice:    "Practice",
  visual:      "Visual",
  teach_back:  "Teach-back",
};

const METHOD_COLORS: Record<string, string> = {
  flashcards:  "rgba(217,79,43,0.12)",
  practice:    "rgba(217,79,43,0.20)",
  visual:      "rgba(217,79,43,0.08)",
  teach_back:  "rgba(217,79,43,0.15)",
};

export default function TaskList({ tasks, onUpdate }: Props) {
  const [completing, setCompleting]             = useState<string | null>(null);
  const [coaching,   setCoaching]               = useState<CoachingMessageType | null>(null);
  const [localTasks, setLocalTasks]             = useState<RoadmapTask[]>(tasks);

  /* Group tasks by day */
  const grouped = localTasks.reduce<Record<string, RoadmapTask[]>>((acc, t) => {
    if (!acc[t.day]) acc[t.day] = [];
    acc[t.day].push(t);
    return acc;
  }, {});

  const days = Object.keys(grouped).sort();

  async function handleComplete(taskId: string) {
    setCompleting(taskId);
    try {
      const { task, coaching_message } = await roadmapApi.completeTask(taskId);
      setLocalTasks(ts => ts.map(t => t.id === taskId ? task : t));
      onUpdate?.(task);
      setCoaching(coaching_message);
    } catch {
      toast.error("Could not mark task as complete. Try again.");
    } finally {
      setCompleting(null);
    }
  }

  const today = dayjs().format("YYYY-MM-DD");

  return (
    <>
      <style>{`
        .tl-wrap { display: flex; flex-direction: column; gap: 28px; }

        /* Day group */
        .tl-day-group {}
        .tl-day-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .tl-day-label {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 500;
          color: var(--text);
          letter-spacing: -0.01em;
        }
        .tl-today-pill {
          font-size: 10px;
          color: var(--flame);
          border: 1px solid rgba(217,79,43,0.3);
          border-radius: 100px;
          padding: 2px 9px;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          background: rgba(217,79,43,0.06);
        }
        .tl-day-rule { flex: 1; height: 1px; background: var(--edge); }

        /* Progress within day */
        .tl-day-progress {
          font-size: 11.5px;
          color: var(--whisper);
          margin-bottom: 12px;
        }

        /* Task rows */
        .tl-tasks { display: flex; flex-direction: column; gap: 9px; }

        .tl-task {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: var(--surface);
          border: 1px solid var(--edge);
          border-radius: 14px;
          transition: border-color 0.2s, opacity 0.2s;
        }
        .tl-task.done {
          opacity: 0.5;
          border-color: rgba(255,255,255,0.04);
        }

        /* Complete button */
        .tl-check-btn {
          width: 22px; height: 22px;
          border-radius: 50%;
          border: 1.5px solid var(--edge2);
          background: none;
          cursor: pointer;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s, background 0.2s;
          position: relative;
        }
        .tl-check-btn:hover:not(:disabled) {
          border-color: rgba(217,79,43,0.5);
          background: rgba(217,79,43,0.08);
        }
        .tl-check-btn.done {
          background: var(--flame);
          border-color: var(--flame);
          cursor: default;
        }
        .tl-check-btn.loading {
          border-color: rgba(217,79,43,0.3);
          animation: pulse 1s ease infinite;
          cursor: wait;
        }
        .tl-check-tick {
          width: 10px; height: 6px;
          border-left: 1.5px solid #fff;
          border-bottom: 1.5px solid #fff;
          transform: rotate(-45deg) translate(1px,-1px);
        }

        /* Task body */
        .tl-task-body { flex: 1; min-width: 0; }
        .tl-task-desc {
          font-size: 14px;
          color: var(--text);
          line-height: 1.45;
          font-weight: 300;
          margin-bottom: 6px;
        }
        .tl-task.done .tl-task-desc {
          text-decoration: line-through;
          color: var(--soft);
        }
        .tl-task-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .tl-method-pill {
          display: inline-flex;
          font-size: 10.5px;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: var(--ember);
          border-radius: 100px;
          padding: 2px 9px;
          font-weight: 500;
        }
        .tl-duration {
          font-size: 11.5px;
          color: var(--whisper);
        }

        /* Empty */
        .tl-empty {
          text-align: center;
          padding: 48px 24px;
          font-size: 14px;
          color: var(--whisper);
          line-height: 1.65;
        }
      `}</style>

      {/* Coaching message overlay */}
      {coaching && (
        <CoachingMessage
          message={coaching}
          onDismiss={() => setCoaching(null)}
        />
      )}

      {days.length === 0 ? (
        <div className="tl-empty">
          No tasks yet. Set a test date to generate your study roadmap.
        </div>
      ) : (
        <div className="tl-wrap">
          {days.map(day => {
            const dayTasks   = grouped[day];
            const doneCount  = dayTasks.filter(t => t.completed).length;
            const isToday    = day === today;
            const label      = isToday
              ? "Today"
              : dayjs(day).format("dddd, MMM D");

            return (
              <div className="tl-day-group" key={day}>
                {/* Day header */}
                <div className="tl-day-header">
                  <span className="tl-day-label">{label}</span>
                  {isToday && <span className="tl-today-pill">Today</span>}
                  <span className="tl-day-rule"/>
                </div>
                <p className="tl-day-progress">
                  {doneCount} of {dayTasks.length} tasks complete
                </p>

                {/* Tasks */}
                <div className="tl-tasks">
                  {dayTasks.map(task => (
                    <div
                      key={task.id}
                      className={`tl-task${task.completed ? " done" : ""}`}
                    >
                      {/* Check button */}
                      <button
                        className={`tl-check-btn${task.completed ? " done" : completing === task.id ? " loading" : ""}`}
                        onClick={() => !task.completed && handleComplete(task.id)}
                        disabled={task.completed || completing === task.id}
                        title={task.completed ? "Completed" : "Mark as complete"}
                      >
                        {task.completed && <div className="tl-check-tick"/>}
                      </button>

                      {/* Body */}
                      <div className="tl-task-body">
                        <p className="tl-task-desc">{task.description}</p>
                        <div className="tl-task-meta">
                          <span
                            className="tl-method-pill"
                            style={{ background: METHOD_COLORS[task.method] ?? "rgba(217,79,43,0.1)" }}
                          >
                            {METHOD_LABELS[task.method] ?? task.method}
                          </span>
                          <span className="tl-duration">{task.duration_min} min</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
