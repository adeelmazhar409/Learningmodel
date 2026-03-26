import { supabase }       from "../config/supabase";
import { usersDb }        from "../db/users.db";
import { NotFoundError }  from "../utils/errors";
import { logger }         from "../utils/logger";
import dayjs              from "dayjs";
import type {
  Roadmap,
  RoadmapTask,
  GenerateRoadmapPayload,
  TodaysTasksResponse,
  CompleteTaskResponse,
  CoachingMessage,
  LearningMethod,
} from "@neuropath/types";

const COACHING_MESSAGES: Omit<CoachingMessage, "id">[] = [
  { trigger: "task_complete", heading: "Effort builds ability.",          body: "You just trained your brain. Every small session compounds into something bigger." },
  { trigger: "task_complete", heading: "You showed up — that matters.",   body: "Starting is the hardest part. You did it. Tomorrow will be easier because of today." },
  { trigger: "task_complete", heading: "Confusion means growth.",         body: "If something felt hard, that's your brain building new wiring. That's exactly what should happen." },
  { trigger: "streak",        heading: "Consistency is a superpower.",    body: "You're building a habit that most people never manage. Keep feeding it." },
];

export const roadmapService = {

  generate: async (userId: string, payload: GenerateRoadmapPayload): Promise<Roadmap> => {
    const { subject, test_date } = payload;

    const today    = dayjs();
    const testDay  = dayjs(test_date);
    const daysLeft = testDay.diff(today, "day");

    if (daysLeft < 1) throw new Error("Test date must be in the future");

    /* Get user learning profile to weight task types */
    const user    = await usersDb.findById(userId);
    const profile = user?.learning_profile ?? { practice: 0.25, teach_back: 0.25, flashcards: 0.25, visual: 0.25 };

    /* Delete any existing roadmap for this user */
    await supabase.from("roadmap_tasks").delete().eq("user_id", userId);
    await supabase.from("roadmaps").delete().eq("user_id", userId);

    /* Create roadmap record */
    const { data: roadmap, error } = await supabase
      .from("roadmaps")
      .insert({ user_id: userId, subject, test_date, days_until_test: daysLeft })
      .select()
      .single();

    if (error) throw new Error("Could not create roadmap");

    /* Build tasks weighted to learning profile */
    const tasks = buildTasks(roadmap.id, userId, subject, daysLeft, profile);

    /* Insert all tasks */
    const { error: tasksError } = await supabase.from("roadmap_tasks").insert(tasks);
    if (tasksError) throw new Error("Could not create roadmap tasks");

    logger.info(`Roadmap generated for user ${userId}: ${daysLeft} days, ${tasks.length} tasks`);

    return { ...roadmap, tasks } as Roadmap;
  },

  get: async (userId: string): Promise<Roadmap> => {
    const { data: roadmap } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!roadmap) throw new NotFoundError("No roadmap found. Set a test date to create one.");

    const { data: tasks } = await supabase
      .from("roadmap_tasks")
      .select("*")
      .eq("roadmap_id", roadmap.id)
      .order("day", { ascending: true })
      .order("order", { ascending: true });

    return { ...roadmap, tasks: tasks ?? [] } as Roadmap;
  },

  getTodaysTasks: async (userId: string): Promise<TodaysTasksResponse> => {
    const today = dayjs().format("YYYY-MM-DD");

    const { data: roadmap } = await supabase
      .from("roadmaps")
      .select("id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!roadmap) return { date: today, tasks: [], completed_count: 0, total_count: 0 };

    const { data: tasks } = await supabase
      .from("roadmap_tasks")
      .select("*")
      .eq("roadmap_id", roadmap.id)
      .eq("day", today)
      .order("order", { ascending: true });

    const t = (tasks ?? []) as RoadmapTask[];

    return {
      date:            today,
      tasks:           t,
      completed_count: t.filter(task => task.completed).length,
      total_count:     t.length,
    };
  },

  completeTask: async (userId: string, taskId: string): Promise<CompleteTaskResponse> => {
    /* Verify task belongs to user */
    const { data: task } = await supabase
      .from("roadmap_tasks")
      .select("*")
      .eq("id", taskId)
      .eq("user_id", userId)
      .single();

    if (!task) throw new NotFoundError("Task not found");

    /* Mark as complete */
    const { data: updated } = await supabase
      .from("roadmap_tasks")
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq("id", taskId)
      .select()
      .single();

    /* Pick a random coaching message */
    const msg  = COACHING_MESSAGES[Math.floor(Math.random() * COACHING_MESSAGES.length)];
    const coaching_message: CoachingMessage = { id: `cm-${Date.now()}`, ...msg };

    return { task: updated as RoadmapTask, coaching_message };
  },
};

/* ── Build task list weighted to learning profile ── */
function buildTasks(
  roadmapId: string,
  userId:    string,
  subject:   string,
  daysLeft:  number,
  profile:   Record<string, number>,
): Omit<RoadmapTask, "id">[] {
  const cap = Math.min(daysLeft, 14); // Max 2 weeks of tasks

  /* Sort methods by profile weight — highest first */
  const methods = (["practice","teach_back","flashcards","visual"] as LearningMethod[])
    .sort((a, b) => (profile[b] ?? 0) - (profile[a] ?? 0));

  const TEMPLATES: Record<LearningMethod, { desc: string; dur: number }[]> = {
    practice:   [
      { desc: `Complete 5 practice questions on ${subject}`,             dur: 20 },
      { desc: `Take the ${subject} quiz and check your score`,           dur: 10 },
      { desc: `Redo any practice questions you got wrong`,               dur: 15 },
    ],
    teach_back: [
      { desc: `Record yourself explaining the main ${subject} concepts`, dur: 15 },
      { desc: `Re-read your teach-back script and refine it`,            dur: 12 },
      { desc: `Explain ${subject} out loud without looking at notes`,    dur: 15 },
    ],
    flashcards: [
      { desc: `Go through ${subject} flashcards — aim for 100%`,         dur: 10 },
      { desc: `Review summary notes from last ${subject} lecture`,       dur: 15 },
      { desc: `Flashcard review — focus on cards you got wrong`,         dur: 10 },
    ],
    visual:     [
      { desc: `Draw a mind map of the key ${subject} concepts`,          dur: 20 },
      { desc: `Review diagrams and visual notes from ${subject}`,        dur: 12 },
    ],
  };

  const tasks: Omit<RoadmapTask, "id">[] = [];

  for (let i = 0; i < cap; i++) {
    const day    = dayjs().add(i, "day").format("YYYY-MM-DD");
    const method = methods[i % methods.length];
    const temps  = TEMPLATES[method];
    const temp   = temps[i % temps.length];

    tasks.push({
      roadmap_id:   roadmapId,
      user_id:      userId,
      day,
      description:  temp.desc,
      method,
      duration_min: temp.dur,
      completed:    false,
      completed_at: null,
      order:        i + 1,
    } as any);
  }

  return tasks;
}
