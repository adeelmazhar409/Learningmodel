import { callOrMock, get, post } from "./client";
import type {
  Roadmap, RoadmapTask, TodaysTasksResponse,
  GenerateRoadmapPayload, CompleteTaskResponse, CoachingMessage,
} from "@neuropath/types";
import dayjs from "dayjs";

const COACHING: CoachingMessage[] = [
  { id:"cm1", trigger:"task_complete", heading:"Effort builds ability.",        body:"Every small session compounds into something bigger." },
  { id:"cm2", trigger:"task_complete", heading:"You showed up — that matters.", body:"Starting is the hardest part. You did it."          },
  { id:"cm3", trigger:"task_complete", heading:"Confusion means growth.",       body:"That's your brain building new wiring."             },
];

const TEST_DATE   = dayjs().add(7,"day").format("YYYY-MM-DD");
const MOCK_TASKS: RoadmapTask[] = Array.from({ length: 5 }, (_, i) => ({
  id: `mock-task-${i+1}`, roadmap_id: "mock-roadmap-001",
  day: dayjs().add(i,"day").format("YYYY-MM-DD"),
  description: ["Review summary notes","Complete 5 practice questions","Record yourself explaining","Go through flashcards","Take the quiz"][i],
  method: (["flashcards","practice","teach_back","flashcards","practice"] as const)[i],
  duration_min: [15,20,15,10,10][i],
  completed: i === 0, completed_at: i === 0 ? new Date().toISOString() : null, order: i+1,
}));

const MOCK_ROADMAP: Roadmap = {
  id: "mock-roadmap-001", user_id: "mock-user-001", subject: "Biology",
  test_date: TEST_DATE, days_until_test: 7, tasks: MOCK_TASKS,
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
};

export const roadmapApi = {
  generate: (payload: GenerateRoadmapPayload): Promise<Roadmap> =>
    callOrMock(
      async () => {
        const data = await post<{ roadmap: Roadmap }>("/api/roadmap/generate", payload);
        return data.roadmap;
      },
      MOCK_ROADMAP, 900
    ),

  get: (): Promise<Roadmap> =>
    callOrMock(
      async () => {
        const data = await get<{ roadmap: Roadmap }>("/api/roadmap");
        return data.roadmap;
      },
      MOCK_ROADMAP, 400
    ),

  getTodaysTasks: (): Promise<RoadmapTask[]> =>
    callOrMock(
      async () => {
        const data = await get<TodaysTasksResponse>("/api/roadmap/today");
        return data.tasks;
      },
      MOCK_TASKS.filter(t => t.day === dayjs().format("YYYY-MM-DD")),
      350
    ),

  completeTask: (taskId: string): Promise<CompleteTaskResponse> =>
    callOrMock(
      async () => {
        const data = await post<CompleteTaskResponse>(`/api/roadmap/tasks/${taskId}/complete`);
        return data;
      },
      (() => {
        const task = MOCK_TASKS.find(t => t.id === taskId) ?? MOCK_TASKS[0];
        return {
          task: { ...task, completed: true, completed_at: new Date().toISOString() },
          coaching_message: COACHING[Math.floor(Math.random() * COACHING.length)],
        };
      })(),
      500
    ),
};
