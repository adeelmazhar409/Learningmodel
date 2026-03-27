import { callOrMock, get, post } from "./client";
import type {
  Roadmap,
  RoadmapTask,
  TodaysTasksResponse,
  GenerateRoadmapPayload,
  CompleteTaskResponse,
  CoachingMessage,
} from "../../../../../packages/types/src/roadmap.types";
import dayjs from "dayjs";

/* ── Mock coaching messages ── */
const COACHING_MESSAGES: CoachingMessage[] = [
  {
    id: "cm1",
    trigger: "task_complete",
    heading: "Effort builds ability.",
    body: "You just trained your brain. Every small session compounds into something bigger. Keep going.",
  },
  {
    id: "cm2",
    trigger: "task_complete",
    heading: "You showed up — that matters.",
    body: "Starting is the hardest part. You did it. Tomorrow will be easier because of today.",
  },
  {
    id: "cm3",
    trigger: "task_complete",
    heading: "Confusion means growth.",
    body: "If something felt hard, that's your brain building new wiring. That's exactly what should happen.",
  },
  {
    id: "cm4",
    trigger: "streak",
    heading: "Consistency is a superpower.",
    body: "You're building a habit that most people never manage. Keep feeding it.",
  },
];

/* ── Generate mock tasks for the next N days ── */
function buildMockTasks(testDate: string, subject: string): RoadmapTask[] {
  const today = dayjs();
  const test = dayjs(testDate);
  const daysLeft = test.diff(today, "day");
  const cap = Math.min(daysLeft, 7);

  // FIX: added "title" field to every task — the dashboard and roadmap
  // page render task.title, but the original mock only had task.description.
  const taskTemplates = [
    {
      title: `Review summary notes — ${subject}`,
      description: `Review summary notes from last ${subject} lecture`,
      method: "flashcards" as const,
      duration_min: 15,
    },
    {
      title: `Practice questions — ${subject}`,
      description: `Complete 5 practice questions on ${subject}`,
      method: "practice" as const,
      duration_min: 20,
    },
    {
      title: `Teach-back recording — ${subject}`,
      description: `Record yourself explaining the main ${subject} concepts`,
      method: "teach_back" as const,
      duration_min: 15,
    },
    {
      title: `Flashcard drill — ${subject}`,
      description: `Go through flashcards — aim for 100% accuracy`,
      method: "flashcards" as const,
      duration_min: 10,
    },
    {
      title: `5-question quiz — ${subject}`,
      description: `Take the 5-question ${subject} quiz`,
      method: "practice" as const,
      duration_min: 10,
    },
    {
      title: `Refine teach-back script — ${subject}`,
      description: `Re-read your teach-back script and refine it`,
      method: "teach_back" as const,
      duration_min: 12,
    },
    {
      title: `Final review — ${subject}`,
      description: `Final review — redo any questions you got wrong`,
      method: "practice" as const,
      duration_min: 20,
    },
  ];

  const tasks: RoadmapTask[] = [];
  for (let i = 0; i < cap; i++) {
    const day = today.add(i, "day").format("YYYY-MM-DD");
    const template = taskTemplates[i % taskTemplates.length];
    tasks.push({
      id: `mock-task-${i + 1}`,
      roadmap_id: "mock-roadmap-001",
      day,
      title: template.title, // FIX: was missing
      description: template.description,
      subject: subject, // FIX: was missing — shown on dashboard under title
      method: template.method,
      duration_min: template.duration_min,
      completed: i === 0, // first task pre-completed for demo
      completed_at: i === 0 ? new Date().toISOString() : null,
      order: i + 1,
    });
  }
  return tasks;
}

const MOCK_TEST_DATE = dayjs().add(7, "day").format("YYYY-MM-DD");
const MOCK_TASKS = buildMockTasks(MOCK_TEST_DATE, "Biology");

const MOCK_ROADMAP: Roadmap = {
  id: "mock-roadmap-001",
  user_id: "mock-user-001",
  subject: "Biology",
  test_date: MOCK_TEST_DATE,
  days_until_test: 7,
  tasks: MOCK_TASKS,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/* Track completed tasks locally in mock mode */
const completedIds = new Set<string>(["mock-task-1"]);

/* ════════════════════════════════════════
   ROADMAP API
════════════════════════════════════════ */
export const roadmapApi = {
  /* ── Generate a new roadmap from a test date ── */
  generate: (payload: GenerateRoadmapPayload): Promise<Roadmap> =>
    callOrMock(
      () => post<Roadmap>("/api/roadmap/generate", payload),
      (() => {
        const tasks = buildMockTasks(payload.test_date, payload.subject);
        return {
          ...MOCK_ROADMAP,
          subject: payload.subject,
          test_date: payload.test_date,
          days_until_test: dayjs(payload.test_date).diff(dayjs(), "day"),
          tasks,
        };
      })(),
      900,
    ),

  /* ── Get the full current roadmap ── */
  get: (): Promise<Roadmap> =>
    callOrMock(() => get<Roadmap>("/api/roadmap"), MOCK_ROADMAP, 400),

  /* ── Get only today's tasks ── */
  getTodaysTasks: (): Promise<RoadmapTask[]> =>
    callOrMock(
      () => get<TodaysTasksResponse>("/api/roadmap/today").then((r) => r.tasks),
      MOCK_TASKS.filter((t) => t.day === dayjs().format("YYYY-MM-DD")),
      350,
    ),

  /* ── Mark a task as complete — returns updated task + coaching message ── */
  completeTask: (taskId: string): Promise<CompleteTaskResponse> =>
    callOrMock(
      () => post<CompleteTaskResponse>(`/api/roadmap/tasks/${taskId}/complete`),
      (() => {
        completedIds.add(taskId);
        const task = MOCK_TASKS.find((t) => t.id === taskId)!;
        const msg =
          COACHING_MESSAGES[
            Math.floor(Math.random() * COACHING_MESSAGES.length)
          ];
        const updated: RoadmapTask = {
          ...task,
          completed: true,
          completed_at: new Date().toISOString(),
        };
        return { task: updated, coaching_message: msg };
      })(),
      500,
    ),
};
