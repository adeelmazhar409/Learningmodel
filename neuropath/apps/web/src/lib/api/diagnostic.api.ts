import { post } from "./client";

/* ─────────────────────────────────────────────────────────────────
   LOCAL TYPES
───────────────────────────────────────────────────────────────── */
type DiagnosticMethod = "flashcards" | "practice" | "visual" | "teach_back";

interface DiagnosticQuestion {
  id: string;
  method: DiagnosticMethod;
  type: "mcq";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
  context?: string;
}

interface DiagnosticAnswer {
  question_id: string;
  method: DiagnosticMethod;
  correct: boolean;
  time_ms: number;
  user_answer?: string;
}

interface MethodScore {
  accuracy: number;
  speed: number;
  retention: number;
  final: number;
}

interface StartDiagnosticResponse {
  attempt_id: string;
  round_questions: DiagnosticQuestion[];
  recall_questions: DiagnosticQuestion[];
  topic: string;
  topic_intro: string;
}

interface SubmitDiagnosticPayload {
  grade_band: string;
  scores: Record<DiagnosticMethod, MethodScore>;
  learning_profile: Record<DiagnosticMethod, number>;
  primary_method: DiagnosticMethod;
  secondary_method: DiagnosticMethod;
}

interface SubmitDiagnosticResponse {
  scores: Record<DiagnosticMethod, MethodScore>;
  primary_method: DiagnosticMethod;
  secondary_method: DiagnosticMethod;
  learning_profile: Record<DiagnosticMethod, number>;
}

/* ═══════════════════════════════════════════════════════════════
   QUESTION CONTENT — all local, never fetched from server
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────
   GRADE 5–6  |  Topic: How Memory Works
───────────────────────────────────────────────────────────────── */
const GRADE_5_6_TOPIC = "How Memory Works";
const GRADE_5_6_INTRO =
  "Your brain has a special system for remembering things. It works in 3 steps: first it records information (encoding), then it stores it, and later it brings it back (retrieval). Short-term memory can only hold about 7 things at once and lasts about 20 seconds. Sleep is when your brain moves important memories into long-term storage. Repeating something helps you remember it better. Emotions also help — exciting or scary events stick in your memory more easily.";

const GRADE_5_6_ROUND: DiagnosticQuestion[] = [
  {
    id: "56_fc1",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "What are the 3 stages of memory?",
    choices: [
      "Encoding, storage, retrieval",
      "Seeing, hearing, feeling",
      "Reading, writing, speaking",
      "Thinking, dreaming, forgetting",
    ],
    answer: "Encoding, storage, retrieval",
    explanation: "Memory always follows: record it, store it, bring it back.",
  },
  {
    id: "56_fc2",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "How many items can short-term memory hold at once?",
    choices: ["About 7", "About 20", "About 100", "About 3"],
    answer: "About 7",
    explanation: "Short-term memory has a capacity of roughly 7 items.",
  },
  {
    id: "56_fc3",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "How long does short-term memory last without review?",
    choices: [
      "About 20 seconds",
      "About 10 minutes",
      "About 1 hour",
      "Forever",
    ],
    answer: "About 20 seconds",
    explanation: "Without repetition, short-term memories fade in ~20 seconds.",
  },
  {
    id: "56_fc4",
    method: "flashcards",
    type: "mcq",
    difficulty: "medium",
    question: "What helps move memories from short-term to long-term?",
    choices: ["Sleep", "Eating", "Running", "Drawing"],
    answer: "Sleep",
    explanation: "During sleep your brain consolidates and stores memories.",
  },
  {
    id: "56_fc5",
    method: "flashcards",
    type: "mcq",
    difficulty: "medium",
    question: "What is it called when your brain records new information?",
    choices: ["Encoding", "Retrieval", "Forgetting", "Sleeping"],
    answer: "Encoding",
    explanation: "Encoding is the first step — your brain records the input.",
  },
  {
    id: "56_fc6",
    method: "flashcards",
    type: "mcq",
    difficulty: "medium",
    question: "Why do exciting events stick in memory better?",
    choices: [
      "Emotions strengthen memory",
      "They are longer",
      "They happen at school",
      "They involve colours",
    ],
    answer: "Emotions strengthen memory",
    explanation:
      "Emotional events trigger chemicals that reinforce memory traces.",
  },
  {
    id: "56_pr1",
    method: "practice",
    type: "mcq",
    difficulty: "easy",
    question:
      "You meet someone new and forget their name 30 seconds later. Which memory stage failed?",
    choices: [
      "Short-term memory faded",
      "Long-term memory broke",
      "Retrieval was blocked",
      "Encoding never happened",
    ],
    answer: "Short-term memory faded",
    explanation:
      "Names fade from short-term memory in ~20 seconds unless repeated.",
  },
  {
    id: "56_pr2",
    method: "practice",
    type: "mcq",
    difficulty: "easy",
    question:
      "You study for a test but skip sleep. What is most likely to suffer?",
    choices: [
      "Moving facts to long-term memory",
      "Short-term memory capacity",
      "Ability to read",
      "Speed of encoding",
    ],
    answer: "Moving facts to long-term memory",
    explanation:
      "Sleep is when consolidation (short → long-term transfer) happens.",
  },
  {
    id: "56_pr3",
    method: "practice",
    type: "mcq",
    difficulty: "medium",
    question: "Which of these best helps you remember a new phone number?",
    choices: [
      "Repeating it several times",
      "Saying it once quietly",
      "Writing it in a diary next week",
      "Ignoring it",
    ],
    answer: "Repeating it several times",
    explanation: "Repetition extends short-term memory and aids encoding.",
  },
  {
    id: "56_pr4",
    method: "practice",
    type: "mcq",
    difficulty: "medium",
    question:
      "Your teacher tells you 10 facts quickly. Based on memory limits, how many are you likely to remember?",
    choices: ["About 7", "All 10", "About 2", "About 20"],
    answer: "About 7",
    explanation: "Short-term memory capacity is ~7 items.",
  },
  {
    id: "56_pr5",
    method: "practice",
    type: "mcq",
    difficulty: "hard",
    question:
      "A student remembers a sad story better than a boring one. This is because:",
    choices: [
      "Emotions strengthen memory formation",
      "Sad stories are shorter",
      "The brain prefers fiction",
      "The story was repeated more",
    ],
    answer: "Emotions strengthen memory formation",
    explanation:
      "Emotional salience triggers memory-enhancing chemicals in the brain.",
  },
  {
    id: "56_pr6",
    method: "practice",
    type: "mcq",
    difficulty: "hard",
    question: "To retrieve a memory means to:",
    choices: [
      "Bring stored information back into awareness",
      "Record new information",
      "Delete old memories",
      "Transfer memory during sleep",
    ],
    answer: "Bring stored information back into awareness",
    explanation: "Retrieval is the third stage — accessing what was stored.",
  },
  {
    id: "56_vi1",
    method: "visual",
    type: "mcq",
    difficulty: "easy",
    question: "In the memory process diagram, which step comes FIRST?",
    choices: ["Encoding", "Storage", "Retrieval", "Forgetting"],
    answer: "Encoding",
    explanation: "Encoding → Storage → Retrieval is the fixed sequence.",
    context: "Memory Process: [Encoding] → [Storage] → [Retrieval]",
  },
  {
    id: "56_vi2",
    method: "visual",
    type: "mcq",
    difficulty: "easy",
    question:
      "In the diagram, the arrow from short-term to long-term memory is labelled 'Sleep'. What does this show?",
    choices: [
      "Sleep transfers memories to long-term storage",
      "Sleep deletes memories",
      "Sleep creates new memories",
      "Sleep is the same as storage",
    ],
    answer: "Sleep transfers memories to long-term storage",
    explanation: "The sleep arrow represents consolidation.",
    context: "[Short-term memory] --Sleep--> [Long-term memory]",
  },
  {
    id: "56_vi3",
    method: "visual",
    type: "mcq",
    difficulty: "medium",
    question:
      "A diagram shows short-term memory with '7 slots'. Three slots are full. How many are empty?",
    choices: ["4", "7", "3", "10"],
    answer: "4",
    explanation: "7 total minus 3 used = 4 empty slots.",
    context: "Short-term memory capacity = 7 slots. [■][■][■][ ][ ][ ][ ]",
  },
  {
    id: "56_vi4",
    method: "visual",
    type: "mcq",
    difficulty: "medium",
    question:
      "The diagram shows: Emotion → [?] → Stronger memory. What fills the blank?",
    choices: [
      "Memory enhancement signal",
      "Forgetting signal",
      "Short-term limit",
      "Retrieval block",
    ],
    answer: "Memory enhancement signal",
    explanation:
      "Emotions trigger chemical signals that make memories stronger.",
    context:
      "Emotion → [Memory enhancement signal] → Stronger long-term memory",
  },
  {
    id: "56_vi5",
    method: "visual",
    type: "mcq",
    difficulty: "hard",
    question:
      "The flow chart shows: Encoding fails → information goes to [?]. What fills the blank?",
    choices: [
      "Forgotten immediately",
      "Long-term memory",
      "Sleep consolidation",
      "Retrieval stage",
    ],
    answer: "Forgotten immediately",
    explanation:
      "If encoding fails, nothing is stored — the information is lost.",
    context: "Information → Encoding → [Storage] OR [Forgotten immediately]",
  },
  {
    id: "56_vi6",
    method: "visual",
    type: "mcq",
    difficulty: "hard",
    question:
      "Two students learn the same fact. Student A sleeps 8 hours; Student B sleeps 4 hours. Whose long-term memory is stronger?",
    choices: ["Student A", "Student B", "Both equal", "Neither remembers"],
    answer: "Student A",
    explanation:
      "More sleep = more consolidation = stronger long-term storage.",
    context:
      "[Short-term] --Sleep--> [Long-term]. More sleep = stronger transfer.",
  },
  {
    id: "56_tb1",
    method: "teach_back",
    type: "mcq",
    difficulty: "easy",
    question: "Explain in your own words: what is encoding?",
    choices: [
      "Recording new information into the brain",
      "Sleeping to fix memories",
      "Forgetting old memories",
      "Retrieving a fact",
    ],
    answer: "Recording new information into the brain",
    explanation:
      "Encoding is the brain's way of recording incoming information.",
  },
  {
    id: "56_tb2",
    method: "teach_back",
    type: "mcq",
    difficulty: "easy",
    question:
      "A friend asks: 'Why should I sleep after studying?' What do you tell them?",
    choices: [
      "Sleep moves memories from short-term to long-term storage",
      "Sleep creates more short-term memory slots",
      "Sleep deletes bad memories",
      "Sleep is not related to memory",
    ],
    answer: "Sleep moves memories from short-term to long-term storage",
    explanation: "Memory consolidation happens during sleep.",
  },
  {
    id: "56_tb3",
    method: "teach_back",
    type: "mcq",
    difficulty: "medium",
    question:
      "How would you explain short-term memory limits to a younger student?",
    choices: [
      "Your brain can only hold about 7 things at once for a short time",
      "Your brain forgets everything while sleeping",
      "Short-term memory lasts forever",
      "You can remember up to 100 things at once",
    ],
    answer: "Your brain can only hold about 7 things at once for a short time",
    explanation: "Short-term memory is limited in both capacity and duration.",
  },
  {
    id: "56_tb4",
    method: "teach_back",
    type: "mcq",
    difficulty: "medium",
    question:
      "Someone says 'I cried at that film, so I'll never forget it.' Which memory fact explains this?",
    choices: [
      "Emotions strengthen memory",
      "Crying improves encoding",
      "Films are always memorable",
      "Long-term memory only stores emotional events",
    ],
    answer: "Emotions strengthen memory",
    explanation: "Emotional events trigger memory-enhancing neurochemicals.",
  },
  {
    id: "56_tb5",
    method: "teach_back",
    type: "mcq",
    difficulty: "hard",
    question:
      "Explain the full journey of a memory from hearing something new to recalling it a week later.",
    choices: [
      "Encoding → short-term storage → sleep consolidation → long-term storage → retrieval",
      "Hearing → forgetting → sleeping → remembering",
      "Storage → encoding → retrieval",
      "Short-term → emotion → long-term → encoding",
    ],
    answer:
      "Encoding → short-term storage → sleep consolidation → long-term storage → retrieval",
    explanation: "This is the complete memory lifecycle.",
  },
  {
    id: "56_tb6",
    method: "teach_back",
    type: "mcq",
    difficulty: "hard",
    question: "Why does repeating something help you remember it?",
    choices: [
      "Repetition reinforces the memory trace and moves it toward long-term storage",
      "Repetition fills short-term memory faster",
      "Repetition makes encoding unnecessary",
      "Repetition only works during sleep",
    ],
    answer:
      "Repetition reinforces the memory trace and moves it toward long-term storage",
    explanation:
      "The practice effect: repetition = deeper encoding = better retention.",
  },
];

const GRADE_5_6_RECALL: DiagnosticQuestion[] = [
  {
    id: "56_rq1",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "What are the 3 stages of memory?",
    choices: [
      "Encoding, storage, retrieval",
      "See, hear, feel",
      "Think, dream, forget",
      "Read, write, speak",
    ],
    answer: "Encoding, storage, retrieval",
    explanation: "",
  },
  {
    id: "56_rq2",
    method: "practice",
    type: "mcq",
    difficulty: "easy",
    question: "You forget a name 30 seconds later. Which memory stage failed?",
    choices: [
      "Short-term memory faded",
      "Long-term memory broke",
      "Retrieval blocked",
      "Encoding never happened",
    ],
    answer: "Short-term memory faded",
    explanation: "",
  },
  {
    id: "56_rq3",
    method: "visual",
    type: "mcq",
    difficulty: "easy",
    question: "In the memory diagram, which step comes first?",
    choices: ["Encoding", "Storage", "Retrieval", "Forgetting"],
    answer: "Encoding",
    explanation: "",
  },
  {
    id: "56_rq4",
    method: "teach_back",
    type: "mcq",
    difficulty: "easy",
    question: "What is encoding?",
    choices: [
      "Recording new information into the brain",
      "Sleeping to fix memories",
      "Forgetting old memories",
      "Retrieving a fact",
    ],
    answer: "Recording new information into the brain",
    explanation: "",
  },
  {
    id: "56_rq5",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "About how many items can short-term memory hold?",
    choices: ["About 7", "About 20", "About 100", "About 3"],
    answer: "About 7",
    explanation: "",
  },
  {
    id: "56_rq6",
    method: "practice",
    type: "mcq",
    difficulty: "medium",
    question: "What is most likely to suffer if you skip sleep after studying?",
    choices: [
      "Moving facts to long-term memory",
      "Short-term capacity",
      "Reading speed",
      "Encoding speed",
    ],
    answer: "Moving facts to long-term memory",
    explanation: "",
  },
  {
    id: "56_rq7",
    method: "visual",
    type: "mcq",
    difficulty: "medium",
    question:
      "The arrow from short-term to long-term memory is labelled 'Sleep'. What does this mean?",
    choices: [
      "Sleep transfers memories to long-term",
      "Sleep deletes memories",
      "Sleep creates memories",
      "Sleep = storage",
    ],
    answer: "Sleep transfers memories to long-term",
    explanation: "",
  },
  {
    id: "56_rq8",
    method: "teach_back",
    type: "mcq",
    difficulty: "medium",
    question: "Why should you sleep after studying?",
    choices: [
      "Sleep moves memories from short-term to long-term",
      "Sleep makes more short-term slots",
      "Sleep deletes bad memories",
      "Sleep is unrelated to memory",
    ],
    answer: "Sleep moves memories from short-term to long-term",
    explanation: "",
  },
  {
    id: "56_rq9",
    method: "flashcards",
    type: "mcq",
    difficulty: "medium",
    question: "What does retrieval mean?",
    choices: [
      "Bringing stored information back",
      "Recording new info",
      "Deleting memories",
      "Transferring during sleep",
    ],
    answer: "Bringing stored information back",
    explanation: "",
  },
  {
    id: "56_rq10",
    method: "practice",
    type: "mcq",
    difficulty: "medium",
    question: "Which best helps remember a new phone number?",
    choices: [
      "Repeating it several times",
      "Saying it once",
      "Writing it next week",
      "Ignoring it",
    ],
    answer: "Repeating it several times",
    explanation: "",
  },
  {
    id: "56_rq11",
    method: "visual",
    type: "mcq",
    difficulty: "medium",
    question: "Short-term memory has 7 slots. 3 are full. How many are empty?",
    choices: ["4", "7", "3", "10"],
    answer: "4",
    explanation: "",
  },
  {
    id: "56_rq12",
    method: "teach_back",
    type: "mcq",
    difficulty: "medium",
    question: "Why do emotional events stick in memory better?",
    choices: [
      "Emotions strengthen memory",
      "Emotional stories are shorter",
      "Brain prefers fiction",
      "They are repeated more",
    ],
    answer: "Emotions strengthen memory",
    explanation: "",
  },
  {
    id: "56_rq13",
    method: "flashcards",
    type: "mcq",
    difficulty: "hard",
    question: "How long does short-term memory last without review?",
    choices: [
      "About 20 seconds",
      "About 10 minutes",
      "About 1 hour",
      "Forever",
    ],
    answer: "About 20 seconds",
    explanation: "",
  },
  {
    id: "56_rq14",
    method: "practice",
    type: "mcq",
    difficulty: "hard",
    question: "A student remembers a sad story better than a boring one. Why?",
    choices: [
      "Emotions strengthen memory",
      "Sad stories are shorter",
      "Brain prefers fiction",
      "Story was repeated",
    ],
    answer: "Emotions strengthen memory",
    explanation: "",
  },
  {
    id: "56_rq15",
    method: "visual",
    type: "mcq",
    difficulty: "hard",
    question: "Encoding fails → information goes to [?]",
    choices: [
      "Forgotten immediately",
      "Long-term memory",
      "Sleep consolidation",
      "Retrieval stage",
    ],
    answer: "Forgotten immediately",
    explanation: "",
  },
  {
    id: "56_rq16",
    method: "teach_back",
    type: "mcq",
    difficulty: "hard",
    question:
      "Explain the full journey from hearing something new to recalling it a week later.",
    choices: [
      "Encoding → short-term → sleep consolidation → long-term → retrieval",
      "Hearing → forgetting → sleeping → remembering",
      "Storage → encoding → retrieval",
      "Short-term → emotion → long-term",
    ],
    answer:
      "Encoding → short-term → sleep consolidation → long-term → retrieval",
    explanation: "",
  },
  {
    id: "56_rq17",
    method: "flashcards",
    type: "mcq",
    difficulty: "hard",
    question: "What helps move memories from short-term to long-term?",
    choices: ["Sleep", "Eating", "Running", "Drawing"],
    answer: "Sleep",
    explanation: "",
  },
  {
    id: "56_rq18",
    method: "practice",
    type: "mcq",
    difficulty: "hard",
    question: "You learn 10 facts quickly. How many will you likely remember?",
    choices: ["About 7", "All 10", "About 2", "About 20"],
    answer: "About 7",
    explanation: "",
  },
  {
    id: "56_rq19",
    method: "visual",
    type: "mcq",
    difficulty: "hard",
    question:
      "Student A sleeps 8 hours, Student B sleeps 4 hours after learning. Whose long-term memory is stronger?",
    choices: ["Student A", "Student B", "Both equal", "Neither"],
    answer: "Student A",
    explanation: "",
  },
  {
    id: "56_rq20",
    method: "teach_back",
    type: "mcq",
    difficulty: "hard",
    question: "Why does repeating something help you remember it?",
    choices: [
      "Repetition reinforces the memory trace toward long-term storage",
      "Repetition fills short-term faster",
      "Repetition makes encoding unnecessary",
      "Repetition only works during sleep",
    ],
    answer: "Repetition reinforces the memory trace toward long-term storage",
    explanation: "",
  },
];

/* ─────────────────────────────────────────────────────────────────
   GRADE 7–8  |  Topic: How Sleep Repairs the Brain
───────────────────────────────────────────────────────────────── */
const GRADE_7_8_TOPIC = "How Sleep Repairs the Brain";
const GRADE_7_8_INTRO =
  "While you sleep, your brain does critical repair work. A special cleaning system (called the glymphatic system) flushes out toxic waste products that build up during the day. Deep sleep is when your brain consolidates memories — moving what you learned into long-term storage. REM sleep (the dreaming stage) processes emotions and boosts creativity. Teenagers need 8–10 hours of sleep per night; less than this causes poor concentration, lower grades, and worse mood. Blue light from phone and laptop screens delays sleep onset by blocking melatonin — the hormone that makes you sleepy.";

const GRADE_7_8_ROUND: DiagnosticQuestion[] = [
  {
    id: "78_fc1",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "What does the glymphatic system do during sleep?",
    choices: [
      "Flushes toxic waste from the brain",
      "Produces new neurons",
      "Controls dreaming",
      "Stores long-term memories",
    ],
    answer: "Flushes toxic waste from the brain",
    explanation:
      "The glymphatic system is the brain's overnight cleaning crew.",
  },
  {
    id: "78_fc2",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "Which sleep stage is associated with dreaming?",
    choices: ["REM sleep", "Deep sleep", "Light sleep", "Stage 1 sleep"],
    answer: "REM sleep",
    explanation: "REM (Rapid Eye Movement) sleep is the dreaming stage.",
  },
  {
    id: "78_fc3",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "How many hours of sleep do teenagers need per night?",
    choices: ["8–10 hours", "4–5 hours", "6–7 hours", "11–12 hours"],
    answer: "8–10 hours",
    explanation: "Teens need 8–10 hours due to intense brain development.",
  },
  {
    id: "78_fc4",
    method: "flashcards",
    type: "mcq",
    difficulty: "medium",
    question: "Which hormone does blue light suppress?",
    choices: ["Melatonin", "Adrenaline", "Cortisol", "Insulin"],
    answer: "Melatonin",
    explanation: "Blue light blocks melatonin production, delaying sleep.",
  },
  {
    id: "78_fc5",
    method: "flashcards",
    type: "mcq",
    difficulty: "medium",
    question:
      "During which sleep stage does memory consolidation mainly happen?",
    choices: ["Deep sleep", "REM sleep", "Light sleep", "Stage 1"],
    answer: "Deep sleep",
    explanation: "Deep (slow-wave) sleep is when memories are consolidated.",
  },
  {
    id: "78_fc6",
    method: "flashcards",
    type: "mcq",
    difficulty: "medium",
    question: "What does REM sleep help process?",
    choices: [
      "Emotions and creativity",
      "Toxic waste",
      "Blood sugar",
      "Bone repair",
    ],
    answer: "Emotions and creativity",
    explanation:
      "REM sleep is critical for emotional regulation and creative thinking.",
  },
  {
    id: "78_pr1",
    method: "practice",
    type: "mcq",
    difficulty: "easy",
    question:
      "A student uses their phone until midnight then sleeps 6 hours. What is most likely affected?",
    choices: [
      "Concentration and memory next day",
      "Physical height",
      "Ability to read",
      "Digestion",
    ],
    answer: "Concentration and memory next day",
    explanation: "Blue light + insufficient sleep impairs cognition.",
  },
  {
    id: "78_pr2",
    method: "practice",
    type: "mcq",
    difficulty: "easy",
    question: "Why might someone feel 'foggy' after poor sleep?",
    choices: [
      "Toxic waste was not cleared from the brain",
      "They ate too much",
      "Their memory was deleted",
      "REM sleep overwrote their thoughts",
    ],
    answer: "Toxic waste was not cleared from the brain",
    explanation:
      "Without adequate sleep the glymphatic system cannot complete cleanup.",
  },
  {
    id: "78_pr3",
    method: "practice",
    type: "mcq",
    difficulty: "medium",
    question:
      "A student studies hard but sleeps only 4 hours. What is most at risk?",
    choices: [
      "Long-term memory of what they studied",
      "Short-term memory capacity",
      "Ability to read faster",
      "Physical energy only",
    ],
    answer: "Long-term memory of what they studied",
    explanation:
      "Deep sleep consolidation is cut short — memories are not stored properly.",
  },
  {
    id: "78_pr4",
    method: "practice",
    type: "mcq",
    difficulty: "medium",
    question: "Which habit best supports brain repair during sleep?",
    choices: [
      "Avoiding screens 1 hour before bed",
      "Drinking coffee before bed",
      "Sleeping with lights on",
      "Sleeping fewer hours but more deeply",
    ],
    answer: "Avoiding screens 1 hour before bed",
    explanation:
      "Reducing blue light preserves melatonin and improves sleep quality.",
  },
  {
    id: "78_pr5",
    method: "practice",
    type: "mcq",
    difficulty: "hard",
    question:
      "You feel anxious after a bad week and have vivid, emotional dreams. Which sleep stage is likely processing this?",
    choices: ["REM sleep", "Deep sleep", "Stage 1 sleep", "Light sleep"],
    answer: "REM sleep",
    explanation: "REM sleep processes emotional experiences from waking life.",
  },
  {
    id: "78_pr6",
    method: "practice",
    type: "mcq",
    difficulty: "hard",
    question:
      "Why do researchers link insufficient teen sleep with lower academic performance?",
    choices: [
      "Both memory consolidation and waste clearance are disrupted",
      "Teens read slower",
      "Sleep makes students lazy",
      "Teachers prefer well-rested students",
    ],
    answer: "Both memory consolidation and waste clearance are disrupted",
    explanation:
      "Poor sleep = uncleared waste + poor consolidation = impaired cognition.",
  },
  {
    id: "78_vi1",
    method: "visual",
    type: "mcq",
    difficulty: "easy",
    question:
      "The sleep diagram shows waste building up during the day. When does cleanup happen?",
    choices: [
      "During sleep",
      "During school",
      "During exercise",
      "During eating",
    ],
    answer: "During sleep",
    explanation: "The glymphatic system activates primarily during sleep.",
    context:
      "[Wake: waste builds up in brain] → [Sleep: glymphatic system flushes waste] → [Wake: brain clear]",
  },
  {
    id: "78_vi2",
    method: "visual",
    type: "mcq",
    difficulty: "easy",
    question:
      "In the sleep stages diagram, REM sleep appears as the dreaming phase. What else happens in REM?",
    choices: [
      "Emotions and creativity are processed",
      "Toxic waste is flushed",
      "Bones grow",
      "Blood sugar is regulated",
    ],
    answer: "Emotions and creativity are processed",
    explanation: "REM serves emotional processing and creative consolidation.",
    context:
      "Sleep stages: [Light sleep] → [Deep sleep: memory consolidation] → [REM: dreaming, emotions, creativity]",
  },
  {
    id: "78_vi3",
    method: "visual",
    type: "mcq",
    difficulty: "medium",
    question:
      "A graph shows melatonin dropping when a phone is used. What causes the drop?",
    choices: [
      "Blue light suppresses melatonin",
      "Red light increases melatonin",
      "Screen noise blocks hormones",
      "Darkness produces melatonin",
    ],
    answer: "Blue light suppresses melatonin",
    explanation:
      "Blue light wavelengths block pineal gland melatonin secretion.",
    context:
      "Graph: Melatonin level drops sharply when blue light is detected by the eyes.",
  },
  {
    id: "78_vi4",
    method: "visual",
    type: "mcq",
    difficulty: "medium",
    question:
      "The diagram shows 8-hour sleep = full cleanup. A 4-hour sleeper's cleanup bar is 40% full. What is missing?",
    choices: [
      "60% of brain waste still present",
      "60% more deep sleep needed",
      "Extra REM needed only",
      "Nothing — 40% is enough",
    ],
    answer: "60% of brain waste still present",
    explanation:
      "Insufficient sleep means the glymphatic system cannot finish its work.",
    context:
      "8-hour sleep: [██████████ 100% cleaned]. 4-hour sleep: [████░░░░░░ 40% cleaned]. Waste remaining: 60%.",
  },
  {
    id: "78_vi5",
    method: "visual",
    type: "mcq",
    difficulty: "hard",
    question:
      "The diagram shows: Blue light → melatonin suppressed → delayed sleep onset → less deep sleep → [?]. What fills the blank?",
    choices: [
      "Weaker memory consolidation",
      "Better dream quality",
      "Increased creativity",
      "More toxic waste cleared",
    ],
    answer: "Weaker memory consolidation",
    explanation: "Less deep sleep = less memory consolidation.",
    context:
      "Blue light → melatonin suppressed → delayed sleep → less deep sleep → [?]",
  },
  {
    id: "78_vi6",
    method: "visual",
    type: "mcq",
    difficulty: "hard",
    question:
      "Two students' brain scans: Student A has clear, sharp activity; Student B has foggy, slow activity. Student B likely:",
    choices: [
      "Had insufficient sleep and brain waste was not cleared",
      "Read more books",
      "Ate less sugar",
      "Had more REM sleep",
    ],
    answer: "Had insufficient sleep and brain waste was not cleared",
    explanation: "Accumulated brain waste impairs neural signal quality.",
    context:
      "Brain scan: [Student A: clear, sharp neural activity] vs [Student B: foggy, slow activity — excess waste present]",
  },
  {
    id: "78_tb1",
    method: "teach_back",
    type: "mcq",
    difficulty: "easy",
    question: "Explain what the glymphatic system does.",
    choices: [
      "It flushes toxic waste from the brain during sleep",
      "It stores memories",
      "It controls dreaming",
      "It produces melatonin",
    ],
    answer: "It flushes toxic waste from the brain during sleep",
    explanation:
      "Correct — the glymphatic system is the brain's cleaning mechanism.",
  },
  {
    id: "78_tb2",
    method: "teach_back",
    type: "mcq",
    difficulty: "easy",
    question:
      "A younger sibling asks: 'Why do I need to sleep so long?' What do you say?",
    choices: [
      "Your brain repairs itself, clears waste, and stores memories during sleep",
      "Sleep makes you taller only",
      "You need energy for tomorrow",
      "Dreams teach you new things",
    ],
    answer:
      "Your brain repairs itself, clears waste, and stores memories during sleep",
    explanation:
      "Sleep serves multiple critical brain functions simultaneously.",
  },
  {
    id: "78_tb3",
    method: "teach_back",
    type: "mcq",
    difficulty: "medium",
    question:
      "Explain in one sentence why phones before bed are bad for learning.",
    choices: [
      "Blue light suppresses melatonin, delaying sleep and reducing memory consolidation",
      "Phones are distracting",
      "Apps are addictive",
      "Screen light is too bright for the eyes",
    ],
    answer:
      "Blue light suppresses melatonin, delaying sleep and reducing memory consolidation",
    explanation:
      "Complete causal chain: blue light → melatonin → sleep → consolidation.",
  },
  {
    id: "78_tb4",
    method: "teach_back",
    type: "mcq",
    difficulty: "medium",
    question:
      "What is the difference between what deep sleep and REM sleep each do?",
    choices: [
      "Deep sleep consolidates memories; REM processes emotions and creativity",
      "Deep sleep = dreaming; REM = waste removal",
      "Both do the same thing",
      "REM comes first; then deep sleep clears waste",
    ],
    answer:
      "Deep sleep consolidates memories; REM processes emotions and creativity",
    explanation: "Each sleep stage serves a distinct neurological function.",
  },
  {
    id: "78_tb5",
    method: "teach_back",
    type: "mcq",
    difficulty: "hard",
    question:
      "Why might a teenager who consistently sleeps 6 hours perform worse than a peer sleeping 9 hours, even with the same study time?",
    choices: [
      "Less consolidation and more brain waste impair cognition despite equal study",
      "Studying is less important than sleeping",
      "The 9-hour sleeper has a better memory naturally",
      "Concentration is unrelated to sleep",
    ],
    answer:
      "Less consolidation and more brain waste impair cognition despite equal study",
    explanation: "Sleep determines whether studying is actually retained.",
  },
  {
    id: "78_tb6",
    method: "teach_back",
    type: "mcq",
    difficulty: "hard",
    question:
      "Explain the full chain from watching a phone at night to struggling on a test the next day.",
    choices: [
      "Phone → blue light → melatonin suppressed → late sleep → less deep sleep → poor consolidation → test struggle",
      "Phone → distraction → less study → test struggle",
      "Late night → tired → slow reading → test struggle",
      "Phone light → eye strain → headache → test struggle",
    ],
    answer:
      "Phone → blue light → melatonin suppressed → late sleep → less deep sleep → poor consolidation → test struggle",
    explanation:
      "This is the full neurological chain linking screen use to academic performance.",
  },
];

const GRADE_7_8_RECALL: DiagnosticQuestion[] = [
  {
    id: "78_rq1",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "What does the glymphatic system do?",
    choices: [
      "Flushes toxic waste during sleep",
      "Produces new neurons",
      "Controls dreaming",
      "Stores long-term memories",
    ],
    answer: "Flushes toxic waste during sleep",
    explanation: "",
  },
  {
    id: "78_rq2",
    method: "practice",
    type: "mcq",
    difficulty: "easy",
    question: "Why do people feel 'foggy' after poor sleep?",
    choices: [
      "Brain waste was not cleared",
      "They ate too much",
      "Memory was deleted",
      "REM sleep overwrote thoughts",
    ],
    answer: "Brain waste was not cleared",
    explanation: "",
  },
  {
    id: "78_rq3",
    method: "visual",
    type: "mcq",
    difficulty: "easy",
    question: "When does brain waste cleanup happen?",
    choices: [
      "During sleep",
      "During school",
      "During exercise",
      "During eating",
    ],
    answer: "During sleep",
    explanation: "",
  },
  {
    id: "78_rq4",
    method: "teach_back",
    type: "mcq",
    difficulty: "easy",
    question: "What does the glymphatic system do during sleep?",
    choices: [
      "Flushes toxic waste from the brain",
      "Stores memories",
      "Controls dreaming",
      "Produces melatonin",
    ],
    answer: "Flushes toxic waste from the brain",
    explanation: "",
  },
  {
    id: "78_rq5",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "How many hours do teenagers need each night?",
    choices: ["8–10 hours", "4–5 hours", "6–7 hours", "11–12 hours"],
    answer: "8–10 hours",
    explanation: "",
  },
  {
    id: "78_rq6",
    method: "practice",
    type: "mcq",
    difficulty: "medium",
    question:
      "A student uses their phone until midnight then sleeps 6 hours. What is most affected?",
    choices: [
      "Concentration and memory",
      "Physical height",
      "Ability to read",
      "Digestion",
    ],
    answer: "Concentration and memory",
    explanation: "",
  },
  {
    id: "78_rq7",
    method: "visual",
    type: "mcq",
    difficulty: "medium",
    question: "In the sleep stages diagram, what happens during deep sleep?",
    choices: [
      "Memory consolidation",
      "Emotions processed",
      "Waste flushed",
      "Dreaming occurs",
    ],
    answer: "Memory consolidation",
    explanation: "",
  },
  {
    id: "78_rq8",
    method: "teach_back",
    type: "mcq",
    difficulty: "medium",
    question: "Why are phones bad before bed for learning?",
    choices: [
      "Blue light suppresses melatonin, reducing consolidation",
      "Phones are distracting",
      "Apps are addictive",
      "Screen light strains eyes",
    ],
    answer: "Blue light suppresses melatonin, reducing consolidation",
    explanation: "",
  },
  {
    id: "78_rq9",
    method: "flashcards",
    type: "mcq",
    difficulty: "medium",
    question: "Which hormone does blue light suppress?",
    choices: ["Melatonin", "Adrenaline", "Cortisol", "Insulin"],
    answer: "Melatonin",
    explanation: "",
  },
  {
    id: "78_rq10",
    method: "practice",
    type: "mcq",
    difficulty: "medium",
    question: "Which habit best supports brain repair during sleep?",
    choices: [
      "Avoiding screens 1 hour before bed",
      "Drinking coffee before bed",
      "Sleeping with lights on",
      "Sleeping fewer but deeper hours",
    ],
    answer: "Avoiding screens 1 hour before bed",
    explanation: "",
  },
  {
    id: "78_rq11",
    method: "visual",
    type: "mcq",
    difficulty: "medium",
    question: "4-hour sleep cleanup bar is 40% full. What is missing?",
    choices: [
      "60% of brain waste still present",
      "60% more deep sleep needed",
      "Extra REM only",
      "Nothing — 40% is enough",
    ],
    answer: "60% of brain waste still present",
    explanation: "",
  },
  {
    id: "78_rq12",
    method: "teach_back",
    type: "mcq",
    difficulty: "medium",
    question: "What is the difference between deep sleep and REM sleep?",
    choices: [
      "Deep: memory consolidation; REM: emotions and creativity",
      "Deep: dreaming; REM: waste removal",
      "Both same",
      "REM first, then deep clears waste",
    ],
    answer: "Deep: memory consolidation; REM: emotions and creativity",
    explanation: "",
  },
  {
    id: "78_rq13",
    method: "flashcards",
    type: "mcq",
    difficulty: "hard",
    question: "What does REM sleep help process?",
    choices: [
      "Emotions and creativity",
      "Toxic waste",
      "Blood sugar",
      "Bone repair",
    ],
    answer: "Emotions and creativity",
    explanation: "",
  },
  {
    id: "78_rq14",
    method: "practice",
    type: "mcq",
    difficulty: "hard",
    question:
      "You feel anxious after a bad week and have vivid dreams. Which sleep stage processes this?",
    choices: ["REM sleep", "Deep sleep", "Stage 1", "Light sleep"],
    answer: "REM sleep",
    explanation: "",
  },
  {
    id: "78_rq15",
    method: "visual",
    type: "mcq",
    difficulty: "hard",
    question:
      "Blue light → melatonin suppressed → delayed sleep → less deep sleep → [?]",
    choices: [
      "Weaker memory consolidation",
      "Better dream quality",
      "More creativity",
      "More waste cleared",
    ],
    answer: "Weaker memory consolidation",
    explanation: "",
  },
  {
    id: "78_rq16",
    method: "teach_back",
    type: "mcq",
    difficulty: "hard",
    question:
      "Why might a teen sleeping 6 hours perform worse than one sleeping 9 hours with equal study time?",
    choices: [
      "Less consolidation and more waste impair cognition",
      "Studying less important than sleep",
      "9-hour sleeper has better natural memory",
      "Concentration unrelated to sleep",
    ],
    answer: "Less consolidation and more waste impair cognition",
    explanation: "",
  },
  {
    id: "78_rq17",
    method: "flashcards",
    type: "mcq",
    difficulty: "hard",
    question:
      "During which sleep stage does memory consolidation mainly happen?",
    choices: ["Deep sleep", "REM sleep", "Light sleep", "Stage 1"],
    answer: "Deep sleep",
    explanation: "",
  },
  {
    id: "78_rq18",
    method: "practice",
    type: "mcq",
    difficulty: "hard",
    question:
      "Why do researchers link insufficient teen sleep with lower academic performance?",
    choices: [
      "Both consolidation and waste clearance are disrupted",
      "Teens read slower",
      "Sleep makes students lazy",
      "Teachers prefer well-rested students",
    ],
    answer: "Both consolidation and waste clearance are disrupted",
    explanation: "",
  },
  {
    id: "78_rq19",
    method: "visual",
    type: "mcq",
    difficulty: "hard",
    question:
      "Brain scan: Student A has clear activity; Student B has foggy activity. Student B most likely:",
    choices: [
      "Had insufficient sleep — brain waste not cleared",
      "Read more books",
      "Ate less sugar",
      "Had more REM sleep",
    ],
    answer: "Had insufficient sleep — brain waste not cleared",
    explanation: "",
  },
  {
    id: "78_rq20",
    method: "teach_back",
    type: "mcq",
    difficulty: "hard",
    question: "Full chain: phone at night → struggle on test next day?",
    choices: [
      "Phone → blue light → melatonin suppressed → late sleep → less deep sleep → poor consolidation → test struggle",
      "Phone → distraction → less study",
      "Late night → tired → slow reading",
      "Screen → eye strain → headache",
    ],
    answer:
      "Phone → blue light → melatonin suppressed → late sleep → less deep sleep → poor consolidation → test struggle",
    explanation: "",
  },
];

/* ─────────────────────────────────────────────────────────────────
   GRADE 9–10  |  Topic: How Stress Affects Learning
───────────────────────────────────────────────────────────────── */
const GRADE_9_10_TOPIC = "How Stress Affects Learning";
const GRADE_9_10_INTRO =
  "When you feel stressed, your adrenal glands release a hormone called cortisol. In small doses, cortisol sharpens your focus — this is called eustress (positive stress). However, chronic (long-term) stress causes cortisol to stay elevated. This damages the hippocampus, the brain region responsible for forming new memories. High cortisol also blocks the prefrontal cortex — the part of your brain responsible for decision-making, planning, and focusing. Exercise is one of the most effective ways to reduce cortisol levels and restore optimal conditions for learning.";

const GRADE_9_10_ROUND: DiagnosticQuestion[] = [
  {
    id: "910_fc1",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "Which hormone is released when you feel stressed?",
    choices: ["Cortisol", "Melatonin", "Insulin", "Serotonin"],
    answer: "Cortisol",
    explanation: "The adrenal glands release cortisol in response to stress.",
  },
  {
    id: "910_fc2",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "Which gland releases cortisol?",
    choices: ["Adrenal glands", "Pineal gland", "Thyroid", "Pancreas"],
    answer: "Adrenal glands",
    explanation:
      "Cortisol is the primary product of the adrenal cortex under stress.",
  },
  {
    id: "910_fc3",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "Which brain region is the memory centre?",
    choices: ["Hippocampus", "Prefrontal cortex", "Amygdala", "Cerebellum"],
    answer: "Hippocampus",
    explanation:
      "The hippocampus is critical for forming and consolidating memories.",
  },
  {
    id: "910_fc4",
    method: "flashcards",
    type: "mcq",
    difficulty: "medium",
    question: "What is 'eustress'?",
    choices: [
      "Positive, short-term stress that sharpens focus",
      "Chronic damaging stress",
      "A type of cortisol",
      "A brain disorder",
    ],
    answer: "Positive, short-term stress that sharpens focus",
    explanation:
      "Eustress is the beneficial kind of stress — motivating and focus-enhancing.",
  },
  {
    id: "910_fc5",
    method: "flashcards",
    type: "mcq",
    difficulty: "medium",
    question: "Chronic stress shrinks which brain region?",
    choices: ["Hippocampus", "Cerebellum", "Brain stem", "Occipital lobe"],
    answer: "Hippocampus",
    explanation: "Prolonged cortisol exposure reduces hippocampal volume.",
  },
  {
    id: "910_fc6",
    method: "flashcards",
    type: "mcq",
    difficulty: "medium",
    question:
      "High cortisol blocks which brain region associated with decision-making?",
    choices: ["Prefrontal cortex", "Hippocampus", "Amygdala", "Visual cortex"],
    answer: "Prefrontal cortex",
    explanation:
      "Cortisol impairs prefrontal function, reducing rational thinking.",
  },
  {
    id: "910_pr1",
    method: "practice",
    type: "mcq",
    difficulty: "easy",
    question:
      "A student has a big test in 10 minutes and feels alert and focused. This is likely:",
    choices: [
      "Eustress helping them concentrate",
      "Chronic stress damaging their hippocampus",
      "Cortisol blocking their prefrontal cortex",
      "A sign of an anxiety disorder",
    ],
    answer: "Eustress helping them concentrate",
    explanation: "Short-term, positive stress (eustress) sharpens focus.",
  },
  {
    id: "910_pr2",
    method: "practice",
    type: "mcq",
    difficulty: "easy",
    question:
      "A student has been stressed for 3 months straight and struggles to remember new facts. Why?",
    choices: [
      "Chronic cortisol has damaged their hippocampus",
      "They have not slept enough",
      "Their prefrontal cortex grew larger",
      "Eustress blocked their encoding",
    ],
    answer: "Chronic cortisol has damaged their hippocampus",
    explanation:
      "Prolonged cortisol shrinks the hippocampus, impairing memory formation.",
  },
  {
    id: "910_pr3",
    method: "practice",
    type: "mcq",
    difficulty: "medium",
    question:
      "Which activity would most directly reduce cortisol and improve study performance?",
    choices: [
      "30 minutes of exercise",
      "Drinking more coffee",
      "Staying up later to revise",
      "Watching a calming show",
    ],
    answer: "30 minutes of exercise",
    explanation:
      "Exercise is the most evidence-backed cortisol-reduction strategy.",
  },
  {
    id: "910_pr4",
    method: "practice",
    type: "mcq",
    difficulty: "medium",
    question:
      "A stressed student makes poor decisions about their revision schedule. Which brain region is being impaired?",
    choices: ["Prefrontal cortex", "Hippocampus", "Amygdala", "Cerebellum"],
    answer: "Prefrontal cortex",
    explanation:
      "Cortisol blocks prefrontal cortex function, impairing planning and decision-making.",
  },
  {
    id: "910_pr5",
    method: "practice",
    type: "mcq",
    difficulty: "hard",
    question:
      "Why might a student who is chronically stressed perform worse over time even if they study the same amount?",
    choices: [
      "Hippocampal damage reduces new memory formation",
      "Eustress improves then decreases performance",
      "Exercise increases cortisol further",
      "The prefrontal cortex grows but becomes less efficient",
    ],
    answer: "Hippocampal damage reduces new memory formation",
    explanation: "Chronic stress literally shrinks the brain's memory centre.",
  },
  {
    id: "910_pr6",
    method: "practice",
    type: "mcq",
    difficulty: "hard",
    question:
      "Which combination best restores optimal learning conditions after chronic stress?",
    choices: [
      "Exercise + adequate sleep",
      "More study + caffeine",
      "Meditation alone",
      "Removing all challenge from life",
    ],
    answer: "Exercise + adequate sleep",
    explanation:
      "Exercise lowers cortisol; sleep consolidates and repairs — both are needed.",
  },
  {
    id: "910_vi1",
    method: "visual",
    type: "mcq",
    difficulty: "easy",
    question: "In the stress diagram, cortisol is produced by the [?] glands.",
    choices: ["Adrenal", "Pineal", "Thyroid", "Pituitary"],
    answer: "Adrenal",
    explanation: "Adrenal glands sit above the kidneys and secrete cortisol.",
    context:
      "[Stress perceived] → [Brain signals adrenal glands] → [Adrenal glands release cortisol] → [Blood cortisol rises]",
  },
  {
    id: "910_vi2",
    method: "visual",
    type: "mcq",
    difficulty: "easy",
    question:
      "In the diagram, short-term cortisol causes focus to rise; long-term cortisol causes [?].",
    choices: [
      "Hippocampus damage",
      "Better memory",
      "Prefrontal growth",
      "Eustress",
    ],
    answer: "Hippocampus damage",
    explanation: "Chronic cortisol has the opposite effect of acute cortisol.",
    context:
      "Short-term cortisol → [focus↑, performance↑]. Long-term cortisol → [hippocampus shrinks, memory↓]",
  },
  {
    id: "910_vi3",
    method: "visual",
    type: "mcq",
    difficulty: "medium",
    question:
      "A graph shows cortisol spiking during a stressor then dropping after exercise. What does the drop represent?",
    choices: [
      "Exercise reducing cortisol to baseline",
      "Exercise producing more cortisol",
      "Sleep beginning",
      "Hippocampal recovery",
    ],
    answer: "Exercise reducing cortisol to baseline",
    explanation: "Exercise metabolises cortisol and restores baseline levels.",
    context:
      "Graph: [Cortisol level]. Spike during stress → sharp drop after exercise → returns to baseline.",
  },
  {
    id: "910_vi4",
    method: "visual",
    type: "mcq",
    difficulty: "medium",
    question:
      "The diagram shows: high cortisol → prefrontal cortex blocked → [?].",
    choices: [
      "Poor decision-making and focus",
      "Better memory storage",
      "Increased hippocampal growth",
      "Improved creativity",
    ],
    answer: "Poor decision-making and focus",
    explanation: "Prefrontal blockage = impaired executive function.",
    context: "[High cortisol] → [Prefrontal cortex activity blocked] → [?]",
  },
  {
    id: "910_vi5",
    method: "visual",
    type: "mcq",
    difficulty: "hard",
    question:
      "Two brain MRI scans: Brain A has a larger hippocampus; Brain B has a smaller one after one year of chronic stress. Why is it smaller?",
    choices: [
      "Chronic cortisol shrinks the hippocampus",
      "They did not exercise",
      "They ate poorly",
      "REM sleep was excessive",
    ],
    answer: "Chronic cortisol shrinks the hippocampus",
    explanation:
      "This is a documented effect of sustained cortisol exposure on hippocampal volume.",
    context:
      "[Brain A: normal hippocampus size]. [Brain B: reduced hippocampus — 1 year chronic stress → sustained cortisol → tissue reduction]",
  },
  {
    id: "910_vi6",
    method: "visual",
    type: "mcq",
    difficulty: "hard",
    question:
      "The causal chain: chronic stress → cortisol elevated → hippocampus shrinks → [?] → academic decline. What fills the blank?",
    choices: [
      "New memories cannot form properly",
      "Eustress takes over",
      "Prefrontal cortex grows",
      "Sleep improves",
    ],
    answer: "New memories cannot form properly",
    explanation:
      "Hippocampal damage directly impairs the encoding of new memories.",
    context:
      "[Chronic stress] → [cortisol elevated] → [hippocampus shrinks] → [?] → [academic decline]",
  },
  {
    id: "910_tb1",
    method: "teach_back",
    type: "mcq",
    difficulty: "easy",
    question: "Explain what cortisol is and where it comes from.",
    choices: [
      "Cortisol is a stress hormone released by the adrenal glands",
      "It is a sleep hormone from the pineal gland",
      "It is produced in the hippocampus",
      "It is a brain neurotransmitter",
    ],
    answer: "Cortisol is a stress hormone released by the adrenal glands",
    explanation: "Correct physiological definition.",
  },
  {
    id: "910_tb2",
    method: "teach_back",
    type: "mcq",
    difficulty: "easy",
    question: "What is the difference between eustress and chronic stress?",
    choices: [
      "Eustress is short-term and helps; chronic stress is long-term and damages",
      "Both are harmful",
      "Eustress damages the hippocampus; chronic stress helps focus",
      "Both release different hormones",
    ],
    answer:
      "Eustress is short-term and helps; chronic stress is long-term and damages",
    explanation:
      "The duration and intensity determine whether stress helps or harms.",
  },
  {
    id: "910_tb3",
    method: "teach_back",
    type: "mcq",
    difficulty: "medium",
    question:
      "Explain to a friend why chronic stress makes it harder to learn new things.",
    choices: [
      "Elevated cortisol shrinks the hippocampus which stores new memories",
      "Stress makes you tired so you cannot read",
      "Cortisol blocks the amygdala preventing emotions",
      "Chronic stress only affects physical health",
    ],
    answer:
      "Elevated cortisol shrinks the hippocampus which stores new memories",
    explanation: "This is the precise biological mechanism.",
  },
  {
    id: "910_tb4",
    method: "teach_back",
    type: "mcq",
    difficulty: "medium",
    question:
      "Why does exercise help a stressed student perform better academically?",
    choices: [
      "Exercise lowers cortisol, protecting the hippocampus and restoring prefrontal function",
      "Exercise burns energy making students calmer",
      "Exercise replaces studying",
      "Exercise raises melatonin improving sleep only",
    ],
    answer:
      "Exercise lowers cortisol, protecting the hippocampus and restoring prefrontal function",
    explanation:
      "Exercise addresses cortisol at its source, with downstream benefits to learning structures.",
  },
  {
    id: "910_tb5",
    method: "teach_back",
    type: "mcq",
    difficulty: "hard",
    question:
      "Walk through the full biological chain from chronic stress to poor exam results.",
    choices: [
      "Chronic stress → elevated cortisol → hippocampus shrinks + prefrontal blocked → new memories fail to form + poor decisions → exam underperformance",
      "Stress → tired → cannot read → fail exam",
      "Cortisol → sleep loss → poor mood → fail exam",
      "Stress → eustress → focus drops → exam fails",
    ],
    answer:
      "Chronic stress → elevated cortisol → hippocampus shrinks + prefrontal blocked → new memories fail to form + poor decisions → exam underperformance",
    explanation: "This is the complete neurobiological pathway.",
  },
  {
    id: "910_tb6",
    method: "teach_back",
    type: "mcq",
    difficulty: "hard",
    question:
      "A student says 'I perform better under pressure.' When is this true and when does it become harmful?",
    choices: [
      "True for short-term eustress; harmful when stress becomes chronic and cortisol remains elevated",
      "Always true — stress always improves performance",
      "True only for physical tasks, never for mental ones",
      "Harmful immediately — all stress is bad",
    ],
    answer:
      "True for short-term eustress; harmful when stress becomes chronic and cortisol remains elevated",
    explanation:
      "This distinguishes eustress from chronic stress and shows nuanced understanding.",
  },
];

const GRADE_9_10_RECALL: DiagnosticQuestion[] = [
  {
    id: "910_rq1",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "Which hormone is released when stressed?",
    choices: ["Cortisol", "Melatonin", "Insulin", "Serotonin"],
    answer: "Cortisol",
    explanation: "",
  },
  {
    id: "910_rq2",
    method: "practice",
    type: "mcq",
    difficulty: "easy",
    question: "Student alert before a test — this is likely:",
    choices: [
      "Eustress",
      "Chronic stress damaging hippocampus",
      "Cortisol blocking prefrontal",
      "Anxiety disorder",
    ],
    answer: "Eustress",
    explanation: "",
  },
  {
    id: "910_rq3",
    method: "visual",
    type: "mcq",
    difficulty: "easy",
    question: "Cortisol is produced by which glands?",
    choices: ["Adrenal", "Pineal", "Thyroid", "Pituitary"],
    answer: "Adrenal",
    explanation: "",
  },
  {
    id: "910_rq4",
    method: "teach_back",
    type: "mcq",
    difficulty: "easy",
    question: "Where does cortisol come from?",
    choices: ["Adrenal glands", "Pineal gland", "Hippocampus", "Neurons"],
    answer: "Adrenal glands",
    explanation: "",
  },
  {
    id: "910_rq5",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "Which brain region is the memory centre?",
    choices: ["Hippocampus", "Prefrontal cortex", "Amygdala", "Cerebellum"],
    answer: "Hippocampus",
    explanation: "",
  },
  {
    id: "910_rq6",
    method: "practice",
    type: "mcq",
    difficulty: "medium",
    question:
      "Student stressed 3 months, struggles to remember new facts. Why?",
    choices: [
      "Chronic cortisol damaged hippocampus",
      "Not enough sleep",
      "Prefrontal cortex grew larger",
      "Eustress blocked encoding",
    ],
    answer: "Chronic cortisol damaged hippocampus",
    explanation: "",
  },
  {
    id: "910_rq7",
    method: "visual",
    type: "mcq",
    difficulty: "medium",
    question: "Short-term cortisol = focus↑. Long-term cortisol = [?].",
    choices: [
      "Hippocampus damage",
      "Better memory",
      "Prefrontal growth",
      "More eustress",
    ],
    answer: "Hippocampus damage",
    explanation: "",
  },
  {
    id: "910_rq8",
    method: "teach_back",
    type: "mcq",
    difficulty: "medium",
    question: "Why does chronic stress make it harder to learn?",
    choices: [
      "Elevated cortisol shrinks hippocampus",
      "Stress makes you tired",
      "Cortisol blocks amygdala",
      "Only affects physical health",
    ],
    answer: "Elevated cortisol shrinks hippocampus",
    explanation: "",
  },
  {
    id: "910_rq9",
    method: "flashcards",
    type: "mcq",
    difficulty: "medium",
    question: "What is eustress?",
    choices: [
      "Positive short-term stress that sharpens focus",
      "Chronic damaging stress",
      "A type of cortisol",
      "A brain disorder",
    ],
    answer: "Positive short-term stress that sharpens focus",
    explanation: "",
  },
  {
    id: "910_rq10",
    method: "practice",
    type: "mcq",
    difficulty: "medium",
    question: "Which activity most directly reduces cortisol?",
    choices: [
      "30 minutes of exercise",
      "More coffee",
      "Staying up later",
      "Watching a calming show",
    ],
    answer: "30 minutes of exercise",
    explanation: "",
  },
  {
    id: "910_rq11",
    method: "visual",
    type: "mcq",
    difficulty: "medium",
    question: "High cortisol → prefrontal cortex blocked → [?].",
    choices: [
      "Poor decision-making",
      "Better memory",
      "Hippocampal growth",
      "Improved creativity",
    ],
    answer: "Poor decision-making",
    explanation: "",
  },
  {
    id: "910_rq12",
    method: "teach_back",
    type: "mcq",
    difficulty: "medium",
    question: "Why does exercise help a stressed student academically?",
    choices: [
      "Exercise lowers cortisol, protecting hippocampus and restoring prefrontal function",
      "Burns energy making students calmer",
      "Exercise replaces studying",
      "Raises melatonin only",
    ],
    answer:
      "Exercise lowers cortisol, protecting hippocampus and restoring prefrontal function",
    explanation: "",
  },
  {
    id: "910_rq13",
    method: "flashcards",
    type: "mcq",
    difficulty: "hard",
    question: "Chronic stress shrinks which brain region?",
    choices: ["Hippocampus", "Cerebellum", "Brain stem", "Occipital lobe"],
    answer: "Hippocampus",
    explanation: "",
  },
  {
    id: "910_rq14",
    method: "practice",
    type: "mcq",
    difficulty: "hard",
    question:
      "Why might chronically stressed student perform worse over time despite same study hours?",
    choices: [
      "Hippocampal damage reduces new memory formation",
      "Eustress improves then decreases performance",
      "Exercise increases cortisol",
      "Prefrontal cortex grows less efficient",
    ],
    answer: "Hippocampal damage reduces new memory formation",
    explanation: "",
  },
  {
    id: "910_rq15",
    method: "visual",
    type: "mcq",
    difficulty: "hard",
    question:
      "Brain B has smaller hippocampus after 1 year chronic stress. Why?",
    choices: [
      "Chronic cortisol shrinks hippocampus",
      "No exercise",
      "Poor diet",
      "Excessive REM sleep",
    ],
    answer: "Chronic cortisol shrinks hippocampus",
    explanation: "",
  },
  {
    id: "910_rq16",
    method: "teach_back",
    type: "mcq",
    difficulty: "hard",
    question: "Full chain: chronic stress → poor exam results?",
    choices: [
      "Chronic stress → cortisol elevated → hippocampus shrinks + prefrontal blocked → memory fails → exam underperformance",
      "Stress → tired → cannot read → fail",
      "Cortisol → sleep loss → poor mood → fail",
      "Stress → eustress → focus drops → fail",
    ],
    answer:
      "Chronic stress → cortisol elevated → hippocampus shrinks + prefrontal blocked → memory fails → exam underperformance",
    explanation: "",
  },
  {
    id: "910_rq17",
    method: "flashcards",
    type: "mcq",
    difficulty: "hard",
    question: "High cortisol blocks which region linked to decision-making?",
    choices: ["Prefrontal cortex", "Hippocampus", "Amygdala", "Visual cortex"],
    answer: "Prefrontal cortex",
    explanation: "",
  },
  {
    id: "910_rq18",
    method: "practice",
    type: "mcq",
    difficulty: "hard",
    question: "Best combination to restore learning after chronic stress?",
    choices: [
      "Exercise + adequate sleep",
      "More study + caffeine",
      "Meditation alone",
      "Remove all challenge",
    ],
    answer: "Exercise + adequate sleep",
    explanation: "",
  },
  {
    id: "910_rq19",
    method: "visual",
    type: "mcq",
    difficulty: "hard",
    question:
      "Chronic stress → cortisol elevated → hippocampus shrinks → [?] → academic decline.",
    choices: [
      "New memories cannot form properly",
      "Eustress takes over",
      "Prefrontal cortex grows",
      "Sleep improves",
    ],
    answer: "New memories cannot form properly",
    explanation: "",
  },
  {
    id: "910_rq20",
    method: "teach_back",
    type: "mcq",
    difficulty: "hard",
    question:
      "Stress helps performance under pressure — when true, when harmful?",
    choices: [
      "True for short-term eustress; harmful when chronic and cortisol elevated",
      "Always true",
      "True only physical",
      "All stress harmful",
    ],
    answer:
      "True for short-term eustress; harmful when chronic and cortisol elevated",
    explanation: "",
  },
];

/* ─────────────────────────────────────────────────────────────────
   GRADE 11–12  |  Topic: Cognitive Biases
───────────────────────────────────────────────────────────────── */
const GRADE_11_12_TOPIC = "Cognitive Biases";
const GRADE_11_12_INTRO =
  "Cognitive biases are systematic errors in thinking that affect decisions. Confirmation bias makes people seek information that confirms what they already believe and ignore contradicting evidence. The Dunning-Kruger effect describes how people with low competence in a skill overestimate their ability — they don't know enough to know what they don't know. Anchoring bias occurs when people rely too heavily on the first piece of information they receive. The availability heuristic leads people to judge the probability of events by how easily examples come to mind. Psychologist Daniel Kahneman describes two thinking systems: System 1 (fast, automatic, intuitive) and System 2 (slow, effortful, analytical). Most biases arise from over-relying on System 1.";

const GRADE_11_12_ROUND: DiagnosticQuestion[] = [
  {
    id: "1112_fc1",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "What is confirmation bias?",
    choices: [
      "Seeking information that confirms existing beliefs",
      "Overestimating ability due to low competence",
      "Over-relying on the first piece of information",
      "Judging probability by ease of recall",
    ],
    answer: "Seeking information that confirms existing beliefs",
    explanation:
      "Confirmation bias filters information to match pre-existing views.",
  },
  {
    id: "1112_fc2",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "What does the Dunning-Kruger effect describe?",
    choices: [
      "Low competence leading to overconfidence",
      "Seeking confirming information",
      "Over-relying on first information",
      "Fast automatic thinking",
    ],
    answer: "Low competence leading to overconfidence",
    explanation:
      "People with limited knowledge lack the awareness to recognise their own gaps.",
  },
  {
    id: "1112_fc3",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "What is anchoring bias?",
    choices: [
      "Over-relying on the first piece of information received",
      "Overestimating ability",
      "Seeking confirming evidence",
      "Judging probability by ease of recall",
    ],
    answer: "Over-relying on the first piece of information received",
    explanation:
      "The first number or fact encountered becomes a 'cognitive anchor'.",
  },
  {
    id: "1112_fc4",
    method: "flashcards",
    type: "mcq",
    difficulty: "medium",
    question: "What is the availability heuristic?",
    choices: [
      "Judging probability by how easily examples come to mind",
      "Confirming existing beliefs",
      "Overconfidence from low competence",
      "Fast intuitive thinking",
    ],
    answer: "Judging probability by how easily examples come to mind",
    explanation:
      "Vivid or recent events feel more probable because they are easier to recall.",
  },
  {
    id: "1112_fc5",
    method: "flashcards",
    type: "mcq",
    difficulty: "medium",
    question: "Which psychologist described System 1 and System 2 thinking?",
    choices: ["Daniel Kahneman", "Sigmund Freud", "Carl Jung", "B.F. Skinner"],
    answer: "Daniel Kahneman",
    explanation:
      "Kahneman described these two systems in 'Thinking, Fast and Slow'.",
  },
  {
    id: "1112_fc6",
    method: "flashcards",
    type: "mcq",
    difficulty: "medium",
    question: "System 2 thinking is described as:",
    choices: [
      "Slow, effortful, and analytical",
      "Fast and automatic",
      "Intuitive and emotional",
      "Based on first impressions",
    ],
    answer: "Slow, effortful, and analytical",
    explanation:
      "System 2 requires deliberate attention and logical reasoning.",
  },
  {
    id: "1112_pr1",
    method: "practice",
    type: "mcq",
    difficulty: "easy",
    question:
      "A student only reads articles that agree with their current view on climate change. This demonstrates:",
    choices: [
      "Confirmation bias",
      "Dunning-Kruger effect",
      "Anchoring bias",
      "Availability heuristic",
    ],
    answer: "Confirmation bias",
    explanation:
      "They are filtering information to confirm what they already believe.",
  },
  {
    id: "1112_pr2",
    method: "practice",
    type: "mcq",
    difficulty: "easy",
    question:
      "A beginner guitarist says 'I'm basically already good.' This is most likely:",
    choices: [
      "Dunning-Kruger effect",
      "Confirmation bias",
      "Availability heuristic",
      "Anchoring bias",
    ],
    answer: "Dunning-Kruger effect",
    explanation: "Low skill + overconfidence = Dunning-Kruger.",
  },
  {
    id: "1112_pr3",
    method: "practice",
    type: "mcq",
    difficulty: "medium",
    question:
      "A car salesperson shows you a $50,000 car first, then a $30,000 car that feels like a bargain. What bias explains this?",
    choices: [
      "Anchoring bias",
      "Confirmation bias",
      "Availability heuristic",
      "Dunning-Kruger effect",
    ],
    answer: "Anchoring bias",
    explanation: "The first price ($50k) anchors your perception of value.",
  },
  {
    id: "1112_pr4",
    method: "practice",
    type: "mcq",
    difficulty: "medium",
    question:
      "After seeing news coverage of plane crashes, someone believes flying is extremely dangerous. Which bias applies?",
    choices: [
      "Availability heuristic",
      "Confirmation bias",
      "Dunning-Kruger effect",
      "Anchoring bias",
    ],
    answer: "Availability heuristic",
    explanation:
      "Dramatic news stories are easily recalled, making the event seem more probable.",
  },
  {
    id: "1112_pr5",
    method: "practice",
    type: "mcq",
    difficulty: "hard",
    question:
      "You quickly guess the answer to a maths problem without working it out. This is an example of:",
    choices: [
      "System 1 thinking",
      "System 2 thinking",
      "Confirmation bias",
      "Anchoring effect",
    ],
    answer: "System 1 thinking",
    explanation: "Fast, automatic intuition = System 1.",
  },
  {
    id: "1112_pr6",
    method: "practice",
    type: "mcq",
    difficulty: "hard",
    question:
      "Which combination of biases could lead a poorly-informed politician to make overconfident, one-sided policy decisions?",
    choices: [
      "Dunning-Kruger + confirmation bias",
      "Availability heuristic + System 2",
      "Anchoring + System 1 only",
      "None — politicians are trained to avoid biases",
    ],
    answer: "Dunning-Kruger + confirmation bias",
    explanation:
      "Low competence → overconfidence; then seeking only confirming information compounds the error.",
  },
  {
    id: "1112_vi1",
    method: "visual",
    type: "mcq",
    difficulty: "easy",
    question:
      "In the bias map, confirmation bias is shown as a filter. What passes through?",
    choices: [
      "Only confirming evidence",
      "All evidence equally",
      "Only new evidence",
      "Random evidence",
    ],
    answer: "Only confirming evidence",
    explanation:
      "Confirmation bias is a selective filter — it lets through what we already believe.",
    context:
      "[New information] → [Confirmation Bias Filter] → Only confirming evidence reaches beliefs. Contradicting evidence is blocked.",
  },
  {
    id: "1112_vi2",
    method: "visual",
    type: "mcq",
    difficulty: "easy",
    question:
      "The Dunning-Kruger graph shows: low skill = high confidence. What happens as skill increases?",
    choices: [
      "Confidence dips before rising again",
      "Confidence keeps increasing",
      "Confidence stays flat",
      "Confidence drops permanently",
    ],
    answer: "Confidence dips before rising again",
    explanation:
      "Low skill → peak confidence → skill develops → confidence dips → then rises to accurate level.",
    context:
      "Dunning-Kruger curve: [Low skill = high confidence (peak)] → [Growing skill = dropping confidence] → [Expert level = accurate, moderate confidence]",
  },
  {
    id: "1112_vi3",
    method: "visual",
    type: "mcq",
    difficulty: "medium",
    question:
      "Anchor $1000 → estimate $850. Anchor $200 → estimate $350. What does this show?",
    choices: [
      "The anchor pulls estimates toward it",
      "Estimates are random",
      "High anchors produce low estimates only",
      "Anchoring only works with prices",
    ],
    answer: "The anchor pulls estimates toward it",
    explanation: "Both estimates are biased toward their respective anchors.",
    context:
      "[Anchor: $1000] → final guess: $850 (pulled high). [Anchor: $200] → final guess: $350 (pulled low). Anchor effect demonstrated.",
  },
  {
    id: "1112_vi4",
    method: "visual",
    type: "mcq",
    difficulty: "medium",
    question:
      "News coverage of shark attacks is high; actual attacks are rare. People rate shark danger as [?] relative to reality.",
    choices: [
      "Higher than reality",
      "Lower than reality",
      "Accurately equal to reality",
      "Unrelated to media coverage",
    ],
    answer: "Higher than reality",
    explanation:
      "High media coverage makes shark attacks easily recalled, inflating perceived probability.",
    context:
      "[Actual annual deaths: cars 40,000 | sharks 10]. [News stories: cars rarely covered | sharks frequently covered]. [Perceived danger: cars moderate | sharks very high].",
  },
  {
    id: "1112_vi5",
    method: "visual",
    type: "mcq",
    difficulty: "hard",
    question:
      "System 1 leads to a fast answer; System 2 leads to a verified answer. For complex decisions, which should you engage?",
    choices: [
      "System 2",
      "System 1",
      "Either — they produce the same result",
      "Neither — instincts are more reliable",
    ],
    answer: "System 2",
    explanation:
      "Complex decisions require slow, analytical processing to avoid biased errors.",
    context:
      "[Complex decision] → System 1: fast, intuitive answer (often biased) vs System 2: slow, analytical answer (more accurate).",
  },
  {
    id: "1112_vi6",
    method: "visual",
    type: "mcq",
    difficulty: "hard",
    question:
      "The bias chain: novel info → System 1 activates → anchoring bias → estimate distorted → [?].",
    choices: [
      "Poor decision made",
      "System 2 corrects it automatically",
      "Confirmation bias is triggered instead",
      "The estimate becomes accurate",
    ],
    answer: "Poor decision made",
    explanation:
      "Without System 2 engagement, anchored, biased estimates lead directly to poor decisions.",
    context:
      "[New info] → [System 1 fast response] → [Anchoring bias] → [Distorted estimate] → [?]",
  },
  {
    id: "1112_tb1",
    method: "teach_back",
    type: "mcq",
    difficulty: "easy",
    question: "Explain confirmation bias to someone who has never heard of it.",
    choices: [
      "It is when you only seek information that confirms what you already believe and ignore contradicting evidence",
      "It is overestimating your ability",
      "It is relying on the first number you hear",
      "It is judging probability by ease of recall",
    ],
    answer:
      "It is when you only seek information that confirms what you already believe and ignore contradicting evidence",
    explanation: "Complete and accurate lay definition.",
  },
  {
    id: "1112_tb2",
    method: "teach_back",
    type: "mcq",
    difficulty: "easy",
    question: "In one sentence, explain the Dunning-Kruger effect.",
    choices: [
      "People with low competence overestimate their ability because they lack the knowledge to recognise their own gaps",
      "Experts are always overconfident",
      "Low skill leads to low confidence",
      "Confidence always matches skill level",
    ],
    answer:
      "People with low competence overestimate their ability because they lack the knowledge to recognise their own gaps",
    explanation: "This captures the mechanism, not just the outcome.",
  },
  {
    id: "1112_tb3",
    method: "teach_back",
    type: "mcq",
    difficulty: "medium",
    question:
      "Explain to a friend why they might fear flying more than driving, even though driving is statistically more dangerous.",
    choices: [
      "Availability heuristic: dramatic plane crash news is easily recalled, inflating perceived risk",
      "Confirmation bias: they believe flying is dangerous",
      "Anchoring: the first crash they heard about set their perception",
      "Dunning-Kruger: they overestimate their driving ability",
    ],
    answer:
      "Availability heuristic: dramatic plane crash news is easily recalled, inflating perceived risk",
    explanation:
      "This is the textbook application of the availability heuristic.",
  },
  {
    id: "1112_tb4",
    method: "teach_back",
    type: "mcq",
    difficulty: "medium",
    question:
      "Describe a real-world situation where anchoring bias could cause a bad financial decision.",
    choices: [
      "A salesperson shows an expensive item first; the next cheaper item feels like a bargain even if still overpriced",
      "Someone confirms their existing view about prices",
      "Someone overestimates their investment knowledge",
      "A vivid memory of a stock crash influences their estimate",
    ],
    answer:
      "A salesperson shows an expensive item first; the next cheaper item feels like a bargain even if still overpriced",
    explanation: "Classic anchoring effect in retail and negotiation.",
  },
  {
    id: "1112_tb5",
    method: "teach_back",
    type: "mcq",
    difficulty: "hard",
    question:
      "Explain how System 1 and System 2 thinking relate to cognitive biases.",
    choices: [
      "Most biases arise from over-relying on System 1 fast thinking; System 2 analytical thinking can identify and correct them",
      "System 2 causes most biases; System 1 corrects them",
      "Both systems produce the same biases",
      "Biases are unrelated to thinking systems",
    ],
    answer:
      "Most biases arise from over-relying on System 1 fast thinking; System 2 analytical thinking can identify and correct them",
    explanation: "This is Kahneman's central thesis.",
  },
  {
    id: "1112_tb6",
    method: "teach_back",
    type: "mcq",
    difficulty: "hard",
    question:
      "How could a combination of Dunning-Kruger and confirmation bias lead to a dangerous feedback loop?",
    choices: [
      "Low competence → overconfidence → only seeks confirming information → never corrects → stays incompetent",
      "They cancel each other out",
      "Dunning-Kruger improves decision-making over time",
      "Confirmation bias only affects emotional decisions",
    ],
    answer:
      "Low competence → overconfidence → only seeks confirming information → never corrects → stays incompetent",
    explanation:
      "This is a genuine cognitive feedback loop with real-world consequences.",
  },
];

const GRADE_11_12_RECALL: DiagnosticQuestion[] = [
  {
    id: "1112_rq1",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "What is confirmation bias?",
    choices: [
      "Seeking confirming information",
      "Low competence → overconfidence",
      "Over-relying on first info",
      "Judging probability by ease of recall",
    ],
    answer: "Seeking confirming information",
    explanation: "",
  },
  {
    id: "1112_rq2",
    method: "practice",
    type: "mcq",
    difficulty: "easy",
    question: "Student only reads articles agreeing with their view. This is:",
    choices: [
      "Confirmation bias",
      "Dunning-Kruger",
      "Anchoring",
      "Availability heuristic",
    ],
    answer: "Confirmation bias",
    explanation: "",
  },
  {
    id: "1112_rq3",
    method: "visual",
    type: "mcq",
    difficulty: "easy",
    question: "Confirmation bias filter: what passes through?",
    choices: [
      "Only confirming evidence",
      "All evidence",
      "Only new evidence",
      "Random evidence",
    ],
    answer: "Only confirming evidence",
    explanation: "",
  },
  {
    id: "1112_rq4",
    method: "teach_back",
    type: "mcq",
    difficulty: "easy",
    question: "Explain confirmation bias simply.",
    choices: [
      "Only seek info confirming existing beliefs; ignore contradicting evidence",
      "Overestimating ability",
      "Relying on first number",
      "Judging probability by recall",
    ],
    answer:
      "Only seek info confirming existing beliefs; ignore contradicting evidence",
    explanation: "",
  },
  {
    id: "1112_rq5",
    method: "flashcards",
    type: "mcq",
    difficulty: "easy",
    question: "Dunning-Kruger effect describes:",
    choices: [
      "Low competence leading to overconfidence",
      "Seeking confirming info",
      "Over-relying on first info",
      "Fast automatic thinking",
    ],
    answer: "Low competence leading to overconfidence",
    explanation: "",
  },
  {
    id: "1112_rq6",
    method: "practice",
    type: "mcq",
    difficulty: "medium",
    question: "Beginner guitarist says 'I'm basically already good.' This is:",
    choices: [
      "Dunning-Kruger",
      "Confirmation bias",
      "Availability heuristic",
      "Anchoring bias",
    ],
    answer: "Dunning-Kruger",
    explanation: "",
  },
  {
    id: "1112_rq7",
    method: "visual",
    type: "mcq",
    difficulty: "medium",
    question: "Dunning-Kruger curve: as skill grows, confidence:",
    choices: [
      "Dips before rising again",
      "Keeps increasing",
      "Stays flat",
      "Drops permanently",
    ],
    answer: "Dips before rising again",
    explanation: "",
  },
  {
    id: "1112_rq8",
    method: "teach_back",
    type: "mcq",
    difficulty: "medium",
    question: "Why do people fear flying more than driving despite stats?",
    choices: [
      "Availability heuristic — plane crashes are vivid and easily recalled",
      "Confirmation bias",
      "Anchoring",
      "Dunning-Kruger overconfidence in driving",
    ],
    answer:
      "Availability heuristic — plane crashes are vivid and easily recalled",
    explanation: "",
  },
  {
    id: "1112_rq9",
    method: "flashcards",
    type: "mcq",
    difficulty: "medium",
    question: "Anchoring bias is:",
    choices: [
      "Over-relying on first information received",
      "Overconfidence from low skill",
      "Seeking confirming evidence",
      "Judging probability by recall",
    ],
    answer: "Over-relying on first information received",
    explanation: "",
  },
  {
    id: "1112_rq10",
    method: "practice",
    type: "mcq",
    difficulty: "medium",
    question:
      "Car salesperson shows $50k car first, then $30k feels cheap. Which bias?",
    choices: [
      "Anchoring bias",
      "Confirmation bias",
      "Availability heuristic",
      "Dunning-Kruger",
    ],
    answer: "Anchoring bias",
    explanation: "",
  },
  {
    id: "1112_rq11",
    method: "visual",
    type: "mcq",
    difficulty: "medium",
    question:
      "Anchor $1000 → estimate $850. Anchor $200 → estimate $350. This shows:",
    choices: [
      "Anchor pulls estimates toward it",
      "Estimates are random",
      "High anchors produce low estimates only",
      "Anchoring only works with prices",
    ],
    answer: "Anchor pulls estimates toward it",
    explanation: "",
  },
  {
    id: "1112_rq12",
    method: "teach_back",
    type: "mcq",
    difficulty: "medium",
    question: "Describe a financial decision showing anchoring bias.",
    choices: [
      "Expensive item shown first; cheaper item feels like bargain even if still overpriced",
      "Someone confirms price views",
      "Overestimates investment knowledge",
      "Vivid memory influences estimate",
    ],
    answer:
      "Expensive item shown first; cheaper item feels like bargain even if still overpriced",
    explanation: "",
  },
  {
    id: "1112_rq13",
    method: "flashcards",
    type: "mcq",
    difficulty: "hard",
    question: "System 2 thinking is:",
    choices: [
      "Slow, effortful, and analytical",
      "Fast and automatic",
      "Intuitive and emotional",
      "Based on first impressions",
    ],
    answer: "Slow, effortful, and analytical",
    explanation: "",
  },
  {
    id: "1112_rq14",
    method: "practice",
    type: "mcq",
    difficulty: "hard",
    question: "Quickly guessing maths answer without working out is:",
    choices: ["System 1", "System 2", "Confirmation bias", "Anchoring"],
    answer: "System 1",
    explanation: "",
  },
  {
    id: "1112_rq15",
    method: "visual",
    type: "mcq",
    difficulty: "hard",
    question: "For complex decisions, System 1 vs System 2 — use:",
    choices: ["System 2", "System 1", "Either — same result", "Neither"],
    answer: "System 2",
    explanation: "",
  },
  {
    id: "1112_rq16",
    method: "teach_back",
    type: "mcq",
    difficulty: "hard",
    question: "How do System 1 and System 2 relate to biases?",
    choices: [
      "Most biases from over-relying on System 1; System 2 can correct them",
      "System 2 causes most biases",
      "Both produce same biases",
      "Biases unrelated to thinking systems",
    ],
    answer:
      "Most biases from over-relying on System 1; System 2 can correct them",
    explanation: "",
  },
  {
    id: "1112_rq17",
    method: "flashcards",
    type: "mcq",
    difficulty: "hard",
    question: "Who described System 1 and System 2?",
    choices: ["Daniel Kahneman", "Sigmund Freud", "Carl Jung", "B.F. Skinner"],
    answer: "Daniel Kahneman",
    explanation: "",
  },
  {
    id: "1112_rq18",
    method: "practice",
    type: "mcq",
    difficulty: "hard",
    question:
      "Poorly-informed politician makes overconfident one-sided decisions. Which biases?",
    choices: [
      "Dunning-Kruger + confirmation bias",
      "Availability + System 2",
      "Anchoring + System 1",
      "None",
    ],
    answer: "Dunning-Kruger + confirmation bias",
    explanation: "",
  },
  {
    id: "1112_rq19",
    method: "visual",
    type: "mcq",
    difficulty: "hard",
    question: "New info → System 1 → anchoring → distorted estimate → [?]",
    choices: [
      "Poor decision made",
      "System 2 corrects it",
      "Confirmation bias triggered",
      "Estimate becomes accurate",
    ],
    answer: "Poor decision made",
    explanation: "",
  },
  {
    id: "1112_rq20",
    method: "teach_back",
    type: "mcq",
    difficulty: "hard",
    question: "Dunning-Kruger + confirmation bias dangerous feedback loop?",
    choices: [
      "Low competence → overconfidence → seeks only confirming info → never corrects → stays incompetent",
      "They cancel out",
      "DK improves decisions over time",
      "Confirmation bias only affects emotions",
    ],
    answer:
      "Low competence → overconfidence → seeks only confirming info → never corrects → stays incompetent",
    explanation: "",
  },
];

/* ═══════════════════════════════════════════════════════════════
   GRADE BAND SELECTOR
═══════════════════════════════════════════════════════════════ */
function selectContent(gradeBand: string) {
  switch (gradeBand) {
    case "5-6":
      return {
        topic: GRADE_5_6_TOPIC,
        intro: GRADE_5_6_INTRO,
        round: GRADE_5_6_ROUND,
        recall: GRADE_5_6_RECALL,
      };
    case "7-8":
      return {
        topic: GRADE_7_8_TOPIC,
        intro: GRADE_7_8_INTRO,
        round: GRADE_7_8_ROUND,
        recall: GRADE_7_8_RECALL,
      };
    case "9-10":
      return {
        topic: GRADE_9_10_TOPIC,
        intro: GRADE_9_10_INTRO,
        round: GRADE_9_10_ROUND,
        recall: GRADE_9_10_RECALL,
      };
    default:
      return {
        topic: GRADE_11_12_TOPIC,
        intro: GRADE_11_12_INTRO,
        round: GRADE_11_12_ROUND,
        recall: GRADE_11_12_RECALL,
      };
  }
}

/* ═══════════════════════════════════════════════════════════════
   SHUFFLE — randomise choice order so correct answer is never
   always option A. Components compare by string value not index,
   so the answer field stays correct.
═══════════════════════════════════════════════════════════════ */
function shuffleChoices(questions: DiagnosticQuestion[]): DiagnosticQuestion[] {
  return questions.map((q) => {
    const choices = [...q.choices];
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    return { ...q, choices };
  });
}

/* ═══════════════════════════════════════════════════════════════
   SCORING — runs entirely in the browser
═══════════════════════════════════════════════════════════════ */
function calculateScores(
  roundAnswers: DiagnosticAnswer[],
  recallAnswers: DiagnosticAnswer[],
): Record<DiagnosticMethod, MethodScore> {
  const methods: DiagnosticMethod[] = [
    "flashcards",
    "practice",
    "visual",
    "teach_back",
  ];
  const scores = {} as Record<DiagnosticMethod, MethodScore>;

  for (const method of methods) {
    const roundA = roundAnswers.filter((a) => a.method === method);
    const recallA = recallAnswers.filter((a) => a.method === method);

    // Accuracy: % correct in the learning rounds
    const accuracy =
      roundA.length > 0
        ? (roundA.filter((a) => a.correct).length / roundA.length) * 100
        : 0;

    // Retention: % correct in the recall test (measures long-term transfer)
    const retention =
      recallA.length > 0
        ? (recallA.filter((a) => a.correct).length / recallA.length) * 100
        : 0;

    // Speed: linear scale 100 (≤4 s) → 10 (≥20 s)
    // Uses store-measured time_ms — 0 ms means timing failed, treat as average
    const validTimes = roundA.filter((a) => a.time_ms > 0);
    const avgTime =
      validTimes.length > 0
        ? validTimes.reduce((s, a) => s + a.time_ms, 0) / validTimes.length
        : 10_000; // default to mid-range if no valid timings

    const speed =
      avgTime <= 4_000
        ? 100
        : avgTime >= 20_000
          ? 10
          : Math.round(100 - ((avgTime - 4_000) / 16_000) * 90);

    // Final composite: accuracy 60%, speed 20%, retention 20%
    const final = Math.round(accuracy * 0.6 + speed * 0.2 + retention * 0.2);

    scores[method] = {
      accuracy: Math.round(accuracy),
      speed: Math.round(speed),
      retention: Math.round(retention),
      final,
    };
  }
  return scores;
}

function buildLearningProfile(
  scores: Record<DiagnosticMethod, MethodScore>,
): Record<DiagnosticMethod, number> {
  const methods: DiagnosticMethod[] = [
    "flashcards",
    "practice",
    "visual",
    "teach_back",
  ];

  const total = methods.reduce((s, m) => s + scores[m].final, 0);

  // If nobody answered anything, fall back to equal weights
  if (total === 0) {
    return { flashcards: 0.25, practice: 0.25, visual: 0.25, teach_back: 0.25 };
  }

  const profile = {} as Record<DiagnosticMethod, number>;
  for (const m of methods) {
    profile[m] = Math.round((scores[m].final / total) * 100) / 100;
  }
  return profile;
}

/* ═══════════════════════════════════════════════════════════════
   API — public surface used by the diagnostic page

   start()  → returns shuffled questions from local data, no network
   submit() → receives round + recall answers separately (no fragile
              string-matching on IDs), scores locally, saves to server
═══════════════════════════════════════════════════════════════ */
export const diagnosticApi = {
  /*
    start() — no network call.
    Returns shuffled questions so the correct answer isn't always option A.
  */
  start: (payload: {
    subject: string;
    grade_band: string;
  }): Promise<StartDiagnosticResponse> => {
    const { topic, intro, round, recall } = selectContent(payload.grade_band);
    return Promise.resolve({
      attempt_id: `local-${Date.now()}`,
      round_questions: shuffleChoices(round),
      recall_questions: shuffleChoices(recall),
      topic,
      topic_intro: intro,
    });
  },

  /*
    submit() — accepts round and recall answers separately so scoring
    never relies on question ID string patterns.
  */
  submit: async (payload: {
    attempt_id: string;
    round_answers: DiagnosticAnswer[];
    recall_answers: DiagnosticAnswer[];
    grade_band?: string;
  }): Promise<SubmitDiagnosticResponse> => {
    const scores = calculateScores(
      payload.round_answers,
      payload.recall_answers,
    );
    const profile = buildLearningProfile(scores);

    const methods: DiagnosticMethod[] = [
      "flashcards",
      "practice",
      "visual",
      "teach_back",
    ];
    const ranked = [...methods].sort(
      (a, b) => scores[b].final - scores[a].final,
    );

    const result: SubmitDiagnosticResponse = {
      scores,
      primary_method: ranked[0],
      secondary_method: ranked[1],
      learning_profile: profile,
    };

    // Fire-and-forget save to server if backend is configured
    if (process.env.NEXT_PUBLIC_API_URL) {
      const serverPayload: SubmitDiagnosticPayload = {
        grade_band: payload.grade_band ?? "9-10",
        scores,
        learning_profile: profile,
        primary_method: ranked[0],
        secondary_method: ranked[1],
      };
      post<unknown>("/api/diagnostic/submit", serverPayload).catch(() => {
        console.warn("Could not save diagnostic result to server");
      });
    }

    return result;
  },
};
