import { callOrMock, post } from "./client";

type DiagnosticMethod = "flashcards" | "practice" | "visual" | "teach_back";

export interface DiagnosticQuestion {
  id: string;
  method: DiagnosticMethod;
  type: "mcq";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
  context?: string;
  chunk_index: number;
}

export interface DiagnosticAnswer {
  question_id: string;
  method: DiagnosticMethod;
  correct: boolean;
  time_ms: number;
  user_answer?: string;
  chunk_index?: number;
}

export interface MethodScore {
  accuracy: number;
  speed: number;
  retention: number;
  final: number;
}

export interface StartDiagnosticResponse {
  attempt_id: string;
  round_questions: DiagnosticQuestion[];
  recall_questions: DiagnosticQuestion[];
  topic: string;
  topic_intro: string;
  chunk_order: number[];
  chunk_intros: string[];
}

type WorldChunk = {
  intro: string;
  round: DiagnosticQuestion[];
  recall: DiagnosticQuestion[];
};

// ── WORLD A — The Velari of Oros ──────────────────────────────────
const WORLD_A_CHUNKS: WorldChunk[] = [
  {
    intro:
      "Everything below is completely made up.\n\nThe Velari live on a small island called Oros. Oros has no trees, only tall blue rocks. The Velari have four fingers on each hand. They eat dried river moss every morning. They travel by strapping large flat leaves to their feet and sliding on wet ground. Their one rule: never speak before sunrise. Exactly 400 Velari live on Oros.",
    round: [
      {
        id: "wa_c0_r1",
        method: "flashcards",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 0,
        question: "Where do the Velari live?",
        choices: [
          "On an island called Oros",
          "In a forest called Oros",
          "Under a sea called Oros",
          "On a mountain called Oros",
        ],
        answer: "On an island called Oros",
        explanation: "Oros is an island with blue rocks and no trees.",
      },
      {
        id: "wa_c0_r2",
        method: "flashcards",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 0,
        question: "How many fingers do the Velari have on each hand?",
        choices: ["Four", "Five", "Three", "Six"],
        answer: "Four",
        explanation: "Velari have four fingers per hand.",
      },
      {
        id: "wa_c0_r3",
        method: "flashcards",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 0,
        question: "What do the Velari eat every morning?",
        choices: [
          "Dried river moss",
          "Blue rock dust",
          "Leaf soup",
          "Sand berries",
        ],
        answer: "Dried river moss",
        explanation: "Dried river moss is the morning food.",
      },
      {
        id: "wa_c0_r4",
        method: "flashcards",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 0,
        question: "How do the Velari travel?",
        choices: [
          "Strapping flat leaves to feet and sliding",
          "Riding blue rocks",
          "Swimming",
          "Jumping between rocks",
        ],
        answer: "Strapping flat leaves to feet and sliding",
        explanation: "Flat leaves on wet ground act as sleds.",
      },
      {
        id: "wa_c0_r5",
        method: "flashcards",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 0,
        question: "What is the one rule on Oros?",
        choices: [
          "Never speak before sunrise",
          "Never touch blue rocks",
          "Never eat alone",
          "Never travel at night",
        ],
        answer: "Never speak before sunrise",
        explanation: "Speaking before sunrise is forbidden.",
      },
      {
        id: "wa_c0_r6",
        method: "flashcards",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 0,
        question: "How many Velari live on Oros?",
        choices: ["400", "40", "4000", "140"],
        answer: "400",
        explanation: "Exactly 400 Velari.",
      },
    ],
    recall: [
      {
        id: "wa_c0_q1",
        method: "flashcards",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 0,
        question: "Where do the Velari live?",
        choices: [
          "Island of Oros",
          "Forest of Oros",
          "Sea of Oros",
          "Mountain of Oros",
        ],
        answer: "Island of Oros",
        explanation: "",
      },
      {
        id: "wa_c0_q2",
        method: "flashcards",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 0,
        question: "What do Velari eat every morning?",
        choices: [
          "Dried river moss",
          "Blue rock dust",
          "Leaf soup",
          "Sand berries",
        ],
        answer: "Dried river moss",
        explanation: "",
      },
      {
        id: "wa_c0_q3",
        method: "flashcards",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 0,
        question: "How do the Velari travel?",
        choices: [
          "Flat leaves on feet",
          "Riding blue rocks",
          "Swimming",
          "Jumping",
        ],
        answer: "Flat leaves on feet",
        explanation: "",
      },
      {
        id: "wa_c0_q4",
        method: "flashcards",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 0,
        question: "What is the Velari rule?",
        choices: [
          "Never speak before sunrise",
          "Never touch blue rocks",
          "Never eat alone",
          "No travel at night",
        ],
        answer: "Never speak before sunrise",
        explanation: "",
      },
      {
        id: "wa_c0_q5",
        method: "flashcards",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 0,
        question: "How many Velari live on Oros?",
        choices: ["400", "40", "4000", "140"],
        answer: "400",
        explanation: "",
      },
    ],
  },
  {
    intro:
      "Everything below is completely made up.\n\nThe Druun are the Velari's neighbours on Oros. They have bright orange hair that glows at night. They drink warm sand-water — river water mixed with fine sand. They travel by holding onto large flying beetles called Bors. Their rule: every Druun must give away one object each week. 250 Druun live on Oros.",
    round: [
      {
        id: "wa_c1_r1",
        method: "practice",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 1,
        question:
          "You see a creature on Oros with glowing orange hair at night. It is most likely a:",
        choices: ["Druun", "Velari", "Bor", "River moss"],
        answer: "Druun",
        explanation: "Orange glowing hair is the Druun's defining feature.",
      },
      {
        id: "wa_c1_r2",
        method: "practice",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 1,
        question: "A Druun is thirsty. Which drink would they reach for?",
        choices: [
          "Warm sand-water",
          "Dried river moss juice",
          "Blue rock liquid",
          "Plain cold water",
        ],
        answer: "Warm sand-water",
        explanation: "Sand-water is river water with fine sand, served warm.",
      },
      {
        id: "wa_c1_r3",
        method: "practice",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 1,
        question: "A Druun needs to cross Oros quickly. What do they use?",
        choices: [
          "A flying beetle called a Bor",
          "Flat leaves on the ground",
          "Swimming",
          "Jumping",
        ],
        answer: "A flying beetle called a Bor",
        explanation: "Druun travel by holding onto Bors.",
      },
      {
        id: "wa_c1_r4",
        method: "practice",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 1,
        question: "It is the end of the week. What must every Druun do?",
        choices: [
          "Give away one object",
          "Speak before sunrise",
          "Eat river moss",
          "Count all Druun",
        ],
        answer: "Give away one object",
        explanation: "Giving one object per week is the Druun rule.",
      },
      {
        id: "wa_c1_r5",
        method: "practice",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 1,
        question:
          "Velari number 400. Druun number 250. How many more Velari are there?",
        choices: ["150", "250", "650", "50"],
        answer: "150",
        explanation: "400 minus 250 equals 150.",
      },
      {
        id: "wa_c1_r6",
        method: "practice",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 1,
        question:
          "A Bor is injured and cannot fly. What problem does this create for a Druun?",
        choices: [
          "No way to travel",
          "They borrow flat leaves",
          "They swim",
          "They walk slowly",
        ],
        answer: "No way to travel",
        explanation: "Bors are the only Druun transport method.",
      },
    ],
    recall: [
      {
        id: "wa_c1_q1",
        method: "practice",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 1,
        question: "What is special about Druun hair?",
        choices: [
          "Glows orange at night",
          "It is blue",
          "Made of moss",
          "It falls out",
        ],
        answer: "Glows orange at night",
        explanation: "",
      },
      {
        id: "wa_c1_q2",
        method: "practice",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 1,
        question: "What do the Druun drink?",
        choices: [
          "Warm sand-water",
          "River moss juice",
          "Blue rock liquid",
          "Cold plain water",
        ],
        answer: "Warm sand-water",
        explanation: "",
      },
      {
        id: "wa_c1_q3",
        method: "practice",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 1,
        question: "How do the Druun travel?",
        choices: [
          "Holding onto flying beetles called Bors",
          "Flat leaves",
          "Swimming",
          "Running",
        ],
        answer: "Holding onto flying beetles called Bors",
        explanation: "",
      },
      {
        id: "wa_c1_q4",
        method: "practice",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 1,
        question: "What must every Druun do each week?",
        choices: [
          "Give away one object",
          "Speak before sunrise",
          "Eat river moss",
          "Count Druun",
        ],
        answer: "Give away one object",
        explanation: "",
      },
      {
        id: "wa_c1_q5",
        method: "practice",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 1,
        question: "How many Druun live on Oros?",
        choices: ["250", "400", "150", "500"],
        answer: "250",
        explanation: "",
      },
    ],
  },
  {
    intro:
      "Everything below is completely made up.\n\nOros has three zones: the Wet Zone near the river, the Dry Zone in the middle, and the Rock Zone near the blue rocks. River moss grows only in the Wet Zone. The Druun live in the Dry Zone. The Velari sleep in the Rock Zone. The river runs north to south and splits into two streams before the sea. 7 Bors live in the Rock Zone.",
    round: [
      {
        id: "wa_c2_r1",
        method: "visual",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 2,
        question: "Which zone is closest to the river?",
        choices: ["Wet Zone", "Dry Zone", "Rock Zone", "Blue Zone"],
        answer: "Wet Zone",
        explanation: "The Wet Zone sits beside the river.",
      },
      {
        id: "wa_c2_r2",
        method: "visual",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 2,
        question: "Where do the Druun live?",
        choices: ["Dry Zone", "Wet Zone", "Rock Zone", "River"],
        answer: "Dry Zone",
        explanation: "The Druun home is the middle Dry Zone.",
      },
      {
        id: "wa_c2_r3",
        method: "visual",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 2,
        question:
          "The river flows north to south. Before reaching the sea, what happens?",
        choices: [
          "It splits into two streams",
          "It turns blue",
          "It dries up",
          "It flows north again",
        ],
        answer: "It splits into two streams",
        explanation: "The river splits just before the sea.",
      },
      {
        id: "wa_c2_r4",
        method: "visual",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 2,
        question:
          "You are standing in the Rock Zone. Whose sleeping area are you in?",
        choices: ["Velari", "Druun", "Bors", "Neither"],
        answer: "Velari",
        explanation: "The Velari sleep in the Rock Zone.",
      },
      {
        id: "wa_c2_r5",
        method: "visual",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 2,
        question:
          "A Druun wants river moss. Which direction from the Dry Zone?",
        choices: [
          "Toward the Wet Zone",
          "Toward the Rock Zone",
          "Toward the sea",
          "They don't need to move",
        ],
        answer: "Toward the Wet Zone",
        explanation: "Moss grows only in the Wet Zone.",
      },
      {
        id: "wa_c2_r6",
        method: "visual",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 2,
        question:
          "7 Bors live in the Rock Zone. 3 move to Dry Zone. How many remain?",
        choices: ["4", "7", "3", "10"],
        answer: "4",
        explanation: "7 minus 3 equals 4.",
      },
    ],
    recall: [
      {
        id: "wa_c2_q1",
        method: "visual",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 2,
        question: "Which zone is closest to the river?",
        choices: ["Wet Zone", "Dry Zone", "Rock Zone", "Blue Zone"],
        answer: "Wet Zone",
        explanation: "",
      },
      {
        id: "wa_c2_q2",
        method: "visual",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 2,
        question: "Where do the Druun live?",
        choices: ["Dry Zone", "Wet Zone", "Rock Zone", "River"],
        answer: "Dry Zone",
        explanation: "",
      },
      {
        id: "wa_c2_q3",
        method: "visual",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 2,
        question: "What does the river do before reaching the sea?",
        choices: [
          "Splits into two streams",
          "Turns blue",
          "Dries up",
          "Flows back north",
        ],
        answer: "Splits into two streams",
        explanation: "",
      },
      {
        id: "wa_c2_q4",
        method: "visual",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 2,
        question: "Where do the Velari sleep?",
        choices: ["Rock Zone", "Dry Zone", "Wet Zone", "River bank"],
        answer: "Rock Zone",
        explanation: "",
      },
      {
        id: "wa_c2_q5",
        method: "visual",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 2,
        question: "How many Bors live in the Rock Zone?",
        choices: ["7", "3", "4", "10"],
        answer: "7",
        explanation: "",
      },
    ],
  },
  {
    intro:
      "Everything below is completely made up.\n\nLong ago the Velari and Druun were one group called the Ori. The Ori split after a flood called the Great Wet destroyed half of Oros. The Velari moved to the Rock Zone — the only dry area left. The Druun stayed in the Dry Zone where the flood never reached. Both kept one shared tradition: the Giving Festival, held every 100 days. The last one was 60 days ago.",
    round: [
      {
        id: "wa_c3_r1",
        method: "teach_back",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 3,
        question: "What were the Velari and Druun called before they split?",
        choices: ["The Ori", "The Bors", "The Wet Ones", "The Rock People"],
        answer: "The Ori",
        explanation: "Both were once the Ori before the Great Wet.",
      },
      {
        id: "wa_c3_r2",
        method: "teach_back",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 3,
        question: "What caused the Ori to split?",
        choices: [
          "A flood called the Great Wet",
          "A battle over food",
          "A new law",
          "The Bors flying away",
        ],
        answer: "A flood called the Great Wet",
        explanation: "The Great Wet flood split them apart.",
      },
      {
        id: "wa_c3_r3",
        method: "teach_back",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 3,
        question:
          "Why did the Velari move to the Rock Zone after the Great Wet?",
        choices: [
          "It was the only dry area left",
          "It was closest to river moss",
          "The Druun asked them to leave",
          "The Bors lived there",
        ],
        answer: "It was the only dry area left",
        explanation: "The flood covered other areas; Rock Zone stayed dry.",
      },
      {
        id: "wa_c3_r4",
        method: "teach_back",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 3,
        question:
          "Why do both groups still share the Giving Festival after splitting apart?",
        choices: [
          "It reminds them they were once the same people",
          "It was required by Bors",
          "It was the only way to get river moss",
          "The flood made them forget everything else",
        ],
        answer: "It reminds them they were once the same people",
        explanation: "Shared traditions preserve the original bond.",
      },
      {
        id: "wa_c3_r5",
        method: "teach_back",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 3,
        question:
          "The Giving Festival is every 100 days. Last one was 60 days ago. Days until the next?",
        choices: ["40 days", "60 days", "100 days", "160 days"],
        answer: "40 days",
        explanation: "100 minus 60 equals 40.",
      },
      {
        id: "wa_c3_r6",
        method: "teach_back",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 3,
        question:
          "If the Great Wet never happened, what would most likely be true today?",
        choices: [
          "Velari and Druun would still be one group called the Ori",
          "Druun would have moved to the Rock Zone anyway",
          "There would be no Giving Festival",
          "The Bors would not exist",
        ],
        answer: "Velari and Druun would still be one group called the Ori",
        explanation: "The flood was the sole cause of the split.",
      },
    ],
    recall: [
      {
        id: "wa_c3_q1",
        method: "teach_back",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 3,
        question: "What were Velari and Druun originally called?",
        choices: ["The Ori", "The Bors", "The Wet Ones", "The Rock People"],
        answer: "The Ori",
        explanation: "",
      },
      {
        id: "wa_c3_q2",
        method: "teach_back",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 3,
        question: "What caused the Ori to split?",
        choices: [
          "A flood called the Great Wet",
          "A battle",
          "A new law",
          "Bors flying away",
        ],
        answer: "A flood called the Great Wet",
        explanation: "",
      },
      {
        id: "wa_c3_q3",
        method: "teach_back",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 3,
        question: "How often is the Giving Festival held?",
        choices: [
          "Every 100 days",
          "Every 60 days",
          "Every year",
          "Every week",
        ],
        answer: "Every 100 days",
        explanation: "",
      },
      {
        id: "wa_c3_q4",
        method: "teach_back",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 3,
        question: "Last Giving Festival was 60 days ago. Days until next?",
        choices: ["40 days", "60 days", "100 days", "160 days"],
        answer: "40 days",
        explanation: "",
      },
      {
        id: "wa_c3_q5",
        method: "teach_back",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 3,
        question: "Why did the Velari move to the Rock Zone?",
        choices: [
          "Only dry area after the flood",
          "Closest to river moss",
          "Druun told them to",
          "Bors lived there",
        ],
        answer: "Only dry area after the flood",
        explanation: "",
      },
    ],
  },
];

// ── WORLD B — The Mavu of Kelm ────────────────────────────────────
const WORLD_B_CHUNKS: WorldChunk[] = [
  {
    intro:
      "Everything below is completely made up.\n\nThe Mavu live on a floating island called Kelm. They have two sets of ears — one high on their head, one low near their jaw. They eat boiled cloud-fruit, a spongy food that falls from the sky when Kelm passes through low clouds. They travel by jumping across large moss-pads connected by rope lines. Their rule: no Mavu may own more than 5 objects at once. 300 Mavu live on Kelm.",
    round: [
      {
        id: "wb_c0_r1",
        method: "flashcards",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 0,
        question: "Where do the Mavu live?",
        choices: [
          "A floating island called Kelm",
          "An underground cave called Kelm",
          "A sunken ship called Kelm",
          "A tall tower called Kelm",
        ],
        answer: "A floating island called Kelm",
        explanation: "Kelm is a floating island drifting through the sky.",
      },
      {
        id: "wb_c0_r2",
        method: "flashcards",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 0,
        question: "What is unusual about Mavu ears?",
        choices: [
          "They have two sets of ears",
          "They have no ears",
          "Their ears glow blue",
          "Their ears are on their feet",
        ],
        answer: "They have two sets of ears",
        explanation:
          "One set sits high on the head; the other low near the jaw.",
      },
      {
        id: "wb_c0_r3",
        method: "flashcards",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 0,
        question: "What do the Mavu eat?",
        choices: [
          "Boiled cloud-fruit",
          "Dried river moss",
          "Warm sand-water",
          "Blue rock dust",
        ],
        answer: "Boiled cloud-fruit",
        explanation:
          "Cloud-fruit falls from the sky when Kelm passes through low clouds.",
      },
      {
        id: "wb_c0_r4",
        method: "flashcards",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 0,
        question: "How do the Mavu travel?",
        choices: [
          "Jumping across moss-pads on rope lines",
          "Sliding on flat leaves",
          "Holding onto flying beetles",
          "Swimming through clouds",
        ],
        answer: "Jumping across moss-pads on rope lines",
        explanation: "Rope-connected moss-pads form the Mavu travel network.",
      },
      {
        id: "wb_c0_r5",
        method: "flashcards",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 0,
        question: "What is the Mavu ownership rule?",
        choices: [
          "No Mavu may own more than 5 objects",
          "No Mavu may own more than 10 objects",
          "No Mavu may own anything",
          "Every Mavu must give one object weekly",
        ],
        answer: "No Mavu may own more than 5 objects",
        explanation: "Owning more than 5 objects breaks Mavu law.",
      },
      {
        id: "wb_c0_r6",
        method: "flashcards",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 0,
        question: "How many Mavu live on Kelm?",
        choices: ["300", "400", "250", "30"],
        answer: "300",
        explanation: "Exactly 300 Mavu live on Kelm.",
      },
    ],
    recall: [
      {
        id: "wb_c0_q1",
        method: "flashcards",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 0,
        question: "Where do the Mavu live?",
        choices: [
          "Floating island called Kelm",
          "Underground cave called Kelm",
          "Sunken ship called Kelm",
          "Tall tower called Kelm",
        ],
        answer: "Floating island called Kelm",
        explanation: "",
      },
      {
        id: "wb_c0_q2",
        method: "flashcards",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 0,
        question: "What do the Mavu eat?",
        choices: [
          "Boiled cloud-fruit",
          "Dried river moss",
          "Warm sand-water",
          "Blue rock dust",
        ],
        answer: "Boiled cloud-fruit",
        explanation: "",
      },
      {
        id: "wb_c0_q3",
        method: "flashcards",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 0,
        question: "How do the Mavu travel?",
        choices: [
          "Jumping across moss-pads on rope lines",
          "Sliding on flat leaves",
          "Holding flying beetles",
          "Swimming",
        ],
        answer: "Jumping across moss-pads on rope lines",
        explanation: "",
      },
      {
        id: "wb_c0_q4",
        method: "flashcards",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 0,
        question: "What is the Mavu ownership rule?",
        choices: [
          "Max 5 objects each",
          "Max 10 objects each",
          "No ownership allowed",
          "Give one away weekly",
        ],
        answer: "Max 5 objects each",
        explanation: "",
      },
      {
        id: "wb_c0_q5",
        method: "flashcards",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 0,
        question: "How many Mavu live on Kelm?",
        choices: ["300", "400", "250", "30"],
        answer: "300",
        explanation: "",
      },
    ],
  },
  {
    intro:
      "Everything below is completely made up.\n\nThe Tovi are Kelm's neighbours — they live on the edge of Kelm and sometimes visit the Mavu. The Tovi have silver fingers that bend backwards. They drink fog-water, collected from the mist that surrounds Kelm each morning. They travel by wrapping long reed-ropes around trees and swinging. Their rule: every Tovi must sing at sunset. 180 Tovi live on Kelm.",
    round: [
      {
        id: "wb_c1_r1",
        method: "practice",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 1,
        question:
          "You meet a creature on Kelm with silver backwards-bending fingers. It is most likely a:",
        choices: ["Tovi", "Mavu", "Cloud-fruit", "Rope-moss"],
        answer: "Tovi",
        explanation:
          "Silver backward-bending fingers are the Tovi's signature.",
      },
      {
        id: "wb_c1_r2",
        method: "practice",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 1,
        question: "A Tovi is thirsty in the morning. What do they collect?",
        choices: [
          "Fog-water from the mist",
          "Boiled cloud-fruit juice",
          "River water",
          "Rain from below",
        ],
        answer: "Fog-water from the mist",
        explanation: "Tovi collect fog-water from Kelm's morning mist.",
      },
      {
        id: "wb_c1_r3",
        method: "practice",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 1,
        question:
          "A Tovi wants to travel quickly across Kelm. What do they do?",
        choices: [
          "Wrap reed-ropes around trees and swing",
          "Jump across moss-pads",
          "Slide on flat leaves",
          "Hold onto beetles",
        ],
        answer: "Wrap reed-ropes around trees and swing",
        explanation: "Reed-rope swinging is the Tovi travel method.",
      },
      {
        id: "wb_c1_r4",
        method: "practice",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 1,
        question:
          "The sun is setting on Kelm. What must every Tovi do right now?",
        choices: [
          "Sing",
          "Collect fog-water",
          "Give away an object",
          "Count their objects",
        ],
        answer: "Sing",
        explanation: "Singing at sunset is the Tovi rule.",
      },
      {
        id: "wb_c1_r5",
        method: "practice",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 1,
        question:
          "Mavu number 300. Tovi number 180. How many more Mavu are there?",
        choices: ["120", "180", "300", "480"],
        answer: "120",
        explanation: "300 minus 180 equals 120.",
      },
      {
        id: "wb_c1_r6",
        method: "practice",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 1,
        question:
          "A Tovi forgot to sing at sunset. According to Tovi rules, what did they do wrong?",
        choices: [
          "Broke the sing-at-sunset rule",
          "Owned too many objects",
          "Drank river water instead of fog-water",
          "Jumped on a moss-pad",
        ],
        answer: "Broke the sing-at-sunset rule",
        explanation: "Singing at sunset is obligatory for all Tovi.",
      },
    ],
    recall: [
      {
        id: "wb_c1_q1",
        method: "practice",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 1,
        question: "What is distinctive about Tovi fingers?",
        choices: [
          "Silver and bend backwards",
          "They glow orange",
          "They have six fingers",
          "They are webbed",
        ],
        answer: "Silver and bend backwards",
        explanation: "",
      },
      {
        id: "wb_c1_q2",
        method: "practice",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 1,
        question: "What do the Tovi drink?",
        choices: [
          "Fog-water",
          "Boiled cloud-fruit juice",
          "River water",
          "Sand-water",
        ],
        answer: "Fog-water",
        explanation: "",
      },
      {
        id: "wb_c1_q3",
        method: "practice",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 1,
        question: "How do the Tovi travel?",
        choices: [
          "Reed-rope swinging",
          "Moss-pad jumping",
          "Flat leaves",
          "Flying beetles",
        ],
        answer: "Reed-rope swinging",
        explanation: "",
      },
      {
        id: "wb_c1_q4",
        method: "practice",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 1,
        question: "What must every Tovi do at sunset?",
        choices: [
          "Sing",
          "Collect fog-water",
          "Give an object away",
          "Count their things",
        ],
        answer: "Sing",
        explanation: "",
      },
      {
        id: "wb_c1_q5",
        method: "practice",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 1,
        question: "How many Tovi live on Kelm?",
        choices: ["180", "300", "120", "250"],
        answer: "180",
        explanation: "",
      },
    ],
  },
  {
    intro:
      "Everything below is completely made up.\n\nKelm has three layers: the Top Layer (open sky, where cloud-fruit falls), the Middle Layer (where most Mavu live), and the Bottom Shelf (a flat rocky ledge underneath). The Calm Side is the east side of Kelm — the Rough Side is the west where wind shakes the island. The two sides are connected by 12 rope-lines.",
    round: [
      {
        id: "wb_c2_r1",
        method: "visual",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 2,
        question: "Where does cloud-fruit fall on Kelm?",
        choices: [
          "The Top Layer",
          "The Middle Layer",
          "The Bottom Shelf",
          "The Rough Side",
        ],
        answer: "The Top Layer",
        explanation: "Cloud-fruit falls from the sky into the open Top Layer.",
      },
      {
        id: "wb_c2_r2",
        method: "visual",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 2,
        question: "Where do most Mavu live on Kelm?",
        choices: ["Middle Layer", "Top Layer", "Bottom Shelf", "Rough Side"],
        answer: "Middle Layer",
        explanation: "Most Mavu make their homes in the Middle Layer.",
      },
      {
        id: "wb_c2_r3",
        method: "visual",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 2,
        question: "Which side of Kelm is windy and rough?",
        choices: [
          "Rough Side (west)",
          "Calm Side (east)",
          "Top Layer",
          "Bottom Shelf",
        ],
        answer: "Rough Side (west)",
        explanation: "The Rough Side is the western face of Kelm.",
      },
      {
        id: "wb_c2_r4",
        method: "visual",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 2,
        question:
          "You are on the Bottom Shelf looking up. What layer is directly above you?",
        choices: ["Middle Layer", "Top Layer", "The sky", "The Calm Side"],
        answer: "Middle Layer",
        explanation: "Bottom Shelf is below the Middle Layer.",
      },
      {
        id: "wb_c2_r5",
        method: "visual",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 2,
        question:
          "A Mavu wants to collect cloud-fruit but lives in the Middle Layer. Where must they go?",
        choices: [
          "Up to the Top Layer",
          "Down to the Bottom Shelf",
          "To the Rough Side",
          "To the Calm Side",
        ],
        answer: "Up to the Top Layer",
        explanation: "Cloud-fruit only falls in the Top Layer.",
      },
      {
        id: "wb_c2_r6",
        method: "visual",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 2,
        question:
          "12 rope-lines connect Calm and Rough sides. 5 snap in a storm. How many remain?",
        choices: ["7", "5", "12", "17"],
        answer: "7",
        explanation: "12 minus 5 equals 7.",
      },
    ],
    recall: [
      {
        id: "wb_c2_q1",
        method: "visual",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 2,
        question: "Where does cloud-fruit fall?",
        choices: ["Top Layer", "Middle Layer", "Bottom Shelf", "Rough Side"],
        answer: "Top Layer",
        explanation: "",
      },
      {
        id: "wb_c2_q2",
        method: "visual",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 2,
        question: "Where do most Mavu live?",
        choices: ["Middle Layer", "Top Layer", "Bottom Shelf", "Calm Side"],
        answer: "Middle Layer",
        explanation: "",
      },
      {
        id: "wb_c2_q3",
        method: "visual",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 2,
        question: "Which side of Kelm is rough and windy?",
        choices: [
          "Rough Side (west)",
          "Calm Side (east)",
          "Top Layer",
          "Bottom Shelf",
        ],
        answer: "Rough Side (west)",
        explanation: "",
      },
      {
        id: "wb_c2_q4",
        method: "visual",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 2,
        question: "What is the flat rocky ledge at the bottom of Kelm called?",
        choices: ["Bottom Shelf", "Middle Layer", "Top Layer", "Calm Base"],
        answer: "Bottom Shelf",
        explanation: "",
      },
      {
        id: "wb_c2_q5",
        method: "visual",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 2,
        question: "How many rope-lines connect the two sides of Kelm?",
        choices: ["12", "5", "7", "20"],
        answer: "12",
        explanation: "",
      },
    ],
  },
  {
    intro:
      "Everything below is completely made up.\n\nLong ago, the Mavu and Tovi were one group called the Keln. They split after a powerful storm called the Long Shake cracked Kelm in two. The Mavu stayed in the larger middle section. The Tovi moved to the edges because they liked the wind. Both groups share the Rope Festival, held every 50 days to repair the rope-lines together. The last Rope Festival was 20 days ago.",
    round: [
      {
        id: "wb_c3_r1",
        method: "teach_back",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 3,
        question: "What were the Mavu and Tovi called before they split?",
        choices: ["The Keln", "The Bors", "The Ori", "The Fog People"],
        answer: "The Keln",
        explanation: "Before the Long Shake, both peoples were the Keln.",
      },
      {
        id: "wb_c3_r2",
        method: "teach_back",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 3,
        question: "What event caused the Keln to split?",
        choices: [
          "A storm called the Long Shake",
          "A food shortage",
          "A new law",
          "A Tovi rebellion",
        ],
        answer: "A storm called the Long Shake",
        explanation: "The Long Shake cracked Kelm and divided the Keln.",
      },
      {
        id: "wb_c3_r3",
        method: "teach_back",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 3,
        question:
          "Why did the Tovi move to the edges of Kelm after the Long Shake?",
        choices: [
          "They liked the wind",
          "The Mavu forced them out",
          "The cloud-fruit was better there",
          "They needed fog-water",
        ],
        answer: "They liked the wind",
        explanation: "The windy edges suited the Tovi's preference.",
      },
      {
        id: "wb_c3_r4",
        method: "teach_back",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 3,
        question: "What is the purpose of the Rope Festival?",
        choices: [
          "To repair rope-lines together",
          "To share cloud-fruit",
          "To sing at sunset together",
          "To count all Mavu and Tovi",
        ],
        answer: "To repair rope-lines together",
        explanation:
          "Both groups maintain Kelm's rope infrastructure together.",
      },
      {
        id: "wb_c3_r5",
        method: "teach_back",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 3,
        question:
          "Rope Festival is every 50 days. Last one was 20 days ago. Days until the next?",
        choices: ["30 days", "20 days", "50 days", "70 days"],
        answer: "30 days",
        explanation: "50 minus 20 equals 30.",
      },
      {
        id: "wb_c3_r6",
        method: "teach_back",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 3,
        question:
          "If the Long Shake never happened, what would most likely be true?",
        choices: [
          "Mavu and Tovi would still be one group called the Keln",
          "Tovi would have moved anyway",
          "There would be no Rope Festival",
          "The rope-lines would not exist",
        ],
        answer: "Mavu and Tovi would still be one group called the Keln",
        explanation: "The storm was the sole cause of the split.",
      },
    ],
    recall: [
      {
        id: "wb_c3_q1",
        method: "teach_back",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 3,
        question: "What were Mavu and Tovi originally called?",
        choices: ["The Keln", "The Bors", "The Ori", "The Fog People"],
        answer: "The Keln",
        explanation: "",
      },
      {
        id: "wb_c3_q2",
        method: "teach_back",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 3,
        question: "What caused the Keln to split?",
        choices: [
          "Storm called the Long Shake",
          "Food shortage",
          "A new law",
          "A rebellion",
        ],
        answer: "Storm called the Long Shake",
        explanation: "",
      },
      {
        id: "wb_c3_q3",
        method: "teach_back",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 3,
        question: "What do both groups do at the Rope Festival?",
        choices: [
          "Repair rope-lines together",
          "Share cloud-fruit",
          "Sing at sunset",
          "Count their objects",
        ],
        answer: "Repair rope-lines together",
        explanation: "",
      },
      {
        id: "wb_c3_q4",
        method: "teach_back",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 3,
        question: "How often is the Rope Festival held?",
        choices: [
          "Every 50 days",
          "Every 20 days",
          "Every 100 days",
          "Every week",
        ],
        answer: "Every 50 days",
        explanation: "",
      },
      {
        id: "wb_c3_q5",
        method: "teach_back",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 3,
        question: "Last Rope Festival was 20 days ago. Days until next?",
        choices: ["30 days", "20 days", "50 days", "70 days"],
        answer: "30 days",
        explanation: "",
      },
    ],
  },
];

// ── WORLD C — The Sorath of Venn ─────────────────────────────────
const WORLD_C_CHUNKS: WorldChunk[] = [
  {
    intro:
      "Everything below is completely made up.\n\nThe Sorath live inside a hollow volcano called Venn. They have long tails they use to climb the inner walls. They eat steamed heat-pods — small red pods that cook themselves from the volcano's warmth. They travel by climbing and swinging on the inner walls using their tails. Their rule: every Sorath must greet every person they pass. 500 Sorath live inside Venn.",
    round: [
      {
        id: "wc_c0_r1",
        method: "flashcards",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 0,
        question: "Where do the Sorath live?",
        choices: [
          "Inside a hollow volcano called Venn",
          "On top of a volcano called Venn",
          "Beside a river called Venn",
          "On a floating island called Venn",
        ],
        answer: "Inside a hollow volcano called Venn",
        explanation: "Venn is a hollow volcano and the Sorath home.",
      },
      {
        id: "wc_c0_r2",
        method: "flashcards",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 0,
        question: "What body part do the Sorath use to climb walls?",
        choices: ["Their tail", "Their feet", "Their hands", "Their ears"],
        answer: "Their tail",
        explanation:
          "Sorath tails are strong and used for climbing inner walls.",
      },
      {
        id: "wc_c0_r3",
        method: "flashcards",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 0,
        question: "What do the Sorath eat?",
        choices: [
          "Steamed heat-pods",
          "Dried river moss",
          "Boiled cloud-fruit",
          "Blue rock dust",
        ],
        answer: "Steamed heat-pods",
        explanation: "Heat-pods self-cook from the volcano's warmth.",
      },
      {
        id: "wc_c0_r4",
        method: "flashcards",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 0,
        question: "How do the Sorath travel inside Venn?",
        choices: [
          "Climbing and swinging on walls using their tails",
          "Jumping across moss-pads",
          "Sliding on flat leaves",
          "Holding onto flying beetles",
        ],
        answer: "Climbing and swinging on walls using their tails",
        explanation: "Tail-climbing is the Sorath travel method.",
      },
      {
        id: "wc_c0_r5",
        method: "flashcards",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 0,
        question: "What is the Sorath rule?",
        choices: [
          "Greet every person they pass",
          "Never speak before sunrise",
          "Never own more than 5 objects",
          "Give away one object weekly",
        ],
        answer: "Greet every person they pass",
        explanation: "Greeting every passerby is obligatory for Sorath.",
      },
      {
        id: "wc_c0_r6",
        method: "flashcards",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 0,
        question: "How many Sorath live inside Venn?",
        choices: ["500", "400", "300", "50"],
        answer: "500",
        explanation: "Exactly 500 Sorath live in Venn.",
      },
    ],
    recall: [
      {
        id: "wc_c0_q1",
        method: "flashcards",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 0,
        question: "Where do the Sorath live?",
        choices: [
          "Inside hollow volcano Venn",
          "On top of volcano Venn",
          "Beside river Venn",
          "On floating island Venn",
        ],
        answer: "Inside hollow volcano Venn",
        explanation: "",
      },
      {
        id: "wc_c0_q2",
        method: "flashcards",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 0,
        question: "What do the Sorath eat?",
        choices: [
          "Steamed heat-pods",
          "Dried river moss",
          "Boiled cloud-fruit",
          "Blue rock dust",
        ],
        answer: "Steamed heat-pods",
        explanation: "",
      },
      {
        id: "wc_c0_q3",
        method: "flashcards",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 0,
        question: "How do Sorath travel?",
        choices: [
          "Tail-climbing on walls",
          "Moss-pad jumping",
          "Flat leaves",
          "Flying beetles",
        ],
        answer: "Tail-climbing on walls",
        explanation: "",
      },
      {
        id: "wc_c0_q4",
        method: "flashcards",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 0,
        question: "What is the Sorath rule?",
        choices: [
          "Greet everyone they pass",
          "Never speak at sunrise",
          "Max 5 objects",
          "Give one away weekly",
        ],
        answer: "Greet everyone they pass",
        explanation: "",
      },
      {
        id: "wc_c0_q5",
        method: "flashcards",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 0,
        question: "How many Sorath live in Venn?",
        choices: ["500", "400", "300", "250"],
        answer: "500",
        explanation: "",
      },
    ],
  },
  {
    intro:
      "Everything below is completely made up.\n\nThe Renn are neighbours of the Sorath inside Venn. The Renn have webbed hands they use to glide sideways along the walls. They drink rim-water — water that seeps through cracks in the volcano rim at the top. They travel by pressing their webbed hands against the walls and gliding sideways. Their rule: every Renn must stay silent for one hour after waking. 220 Renn live in Venn.",
    round: [
      {
        id: "wc_c1_r1",
        method: "practice",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 1,
        question:
          "You see a creature in Venn gliding sideways along a wall with webbed hands. It is most likely a:",
        choices: ["Renn", "Sorath", "Heat-pod", "Vennari"],
        answer: "Renn",
        explanation:
          "Webbed hands and sideways wall-gliding identify the Renn.",
      },
      {
        id: "wc_c1_r2",
        method: "practice",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 1,
        question: "A Renn is thirsty. Where does their water come from?",
        choices: [
          "Rim-water seeping through volcano cracks",
          "Steamed heat-pod juice",
          "River below",
          "Cloud-fruit moisture",
        ],
        answer: "Rim-water seeping through volcano cracks",
        explanation: "Renn drink rim-water from the volcano rim cracks.",
      },
      {
        id: "wc_c1_r3",
        method: "practice",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 1,
        question: "A Renn wants to cross Venn quickly. What do they do?",
        choices: [
          "Press webbed hands to walls and glide sideways",
          "Climb with their tail",
          "Jump across moss-pads",
          "Hold onto beetles",
        ],
        answer: "Press webbed hands to walls and glide sideways",
        explanation: "Renn glide sideways using their webbed hands.",
      },
      {
        id: "wc_c1_r4",
        method: "practice",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 1,
        question:
          "A Renn just woke up. According to their rule, what must they do for one hour?",
        choices: [
          "Stay completely silent",
          "Greet everyone they pass",
          "Collect rim-water",
          "Count their objects",
        ],
        answer: "Stay completely silent",
        explanation: "One silent hour after waking is the Renn rule.",
      },
      {
        id: "wc_c1_r5",
        method: "practice",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 1,
        question:
          "Sorath number 500. Renn number 220. How many more Sorath are there?",
        choices: ["280", "220", "500", "720"],
        answer: "280",
        explanation: "500 minus 220 equals 280.",
      },
      {
        id: "wc_c1_r6",
        method: "practice",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 1,
        question:
          "A Renn speaks 30 minutes after waking. What did they violate?",
        choices: [
          "The silent-hour-after-waking rule",
          "The greeting rule",
          "The ownership rule",
          "Nothing — 30 minutes is fine",
        ],
        answer: "The silent-hour-after-waking rule",
        explanation:
          "They must be silent for a full hour, not just 30 minutes.",
      },
    ],
    recall: [
      {
        id: "wc_c1_q1",
        method: "practice",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 1,
        question: "What is distinctive about Renn hands?",
        choices: [
          "They are webbed",
          "They are silver",
          "They bend backwards",
          "They glow orange",
        ],
        answer: "They are webbed",
        explanation: "",
      },
      {
        id: "wc_c1_q2",
        method: "practice",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 1,
        question: "What do the Renn drink?",
        choices: ["Rim-water", "Heat-pod juice", "River water", "Sand-water"],
        answer: "Rim-water",
        explanation: "",
      },
      {
        id: "wc_c1_q3",
        method: "practice",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 1,
        question: "How do the Renn travel?",
        choices: [
          "Sideways wall-gliding with webbed hands",
          "Tail-climbing",
          "Moss-pad jumping",
          "Flying beetles",
        ],
        answer: "Sideways wall-gliding with webbed hands",
        explanation: "",
      },
      {
        id: "wc_c1_q4",
        method: "practice",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 1,
        question: "What must a Renn do for one hour after waking?",
        choices: [
          "Stay silent",
          "Greet everyone",
          "Collect rim-water",
          "Count objects",
        ],
        answer: "Stay silent",
        explanation: "",
      },
      {
        id: "wc_c1_q5",
        method: "practice",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 1,
        question: "How many Renn live in Venn?",
        choices: ["220", "500", "280", "300"],
        answer: "220",
        explanation: "",
      },
    ],
  },
  {
    intro:
      "Everything below is completely made up.\n\nVenn has three sections: the Hot Base at the bottom (hottest, where heat-pods grow), the Warm Middle where most Sorath and Renn live, and the Cool Top near the rim. The boundary between Warm Middle and Cool Top is called the Chill Line. The rim has 9 cracks where rim-water seeps through.",
    round: [
      {
        id: "wc_c2_r1",
        method: "visual",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 2,
        question: "Where do heat-pods grow inside Venn?",
        choices: ["Hot Base", "Warm Middle", "Cool Top", "At the Chill Line"],
        answer: "Hot Base",
        explanation: "Heat-pods need the intense heat of the Hot Base.",
      },
      {
        id: "wc_c2_r2",
        method: "visual",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 2,
        question: "Where do most Sorath and Renn live?",
        choices: ["Warm Middle", "Hot Base", "Cool Top", "Chill Line"],
        answer: "Warm Middle",
        explanation: "The Warm Middle is the main living area.",
      },
      {
        id: "wc_c2_r3",
        method: "visual",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 2,
        question:
          "What is the boundary between the Warm Middle and Cool Top called?",
        choices: ["Chill Line", "Heat Divide", "The Rim", "The Crack Line"],
        answer: "Chill Line",
        explanation: "The Chill Line is the boundary name.",
      },
      {
        id: "wc_c2_r4",
        method: "visual",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 2,
        question:
          "You are at the Cool Top looking down. What section is directly below you?",
        choices: ["Warm Middle", "Hot Base", "Chill Line", "The rim"],
        answer: "Warm Middle",
        explanation: "The order is Cool Top > Warm Middle > Hot Base.",
      },
      {
        id: "wc_c2_r5",
        method: "visual",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 2,
        question:
          "A Renn needs rim-water. They live in the Warm Middle. Which direction must they travel?",
        choices: [
          "Up toward the Cool Top and rim",
          "Down toward the Hot Base",
          "Sideways to the Chill Line",
          "They stay put — water comes to them",
        ],
        answer: "Up toward the Cool Top and rim",
        explanation: "Rim-water seeps from the rim at the top.",
      },
      {
        id: "wc_c2_r6",
        method: "visual",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 2,
        question:
          "The rim has 9 cracks. 4 get blocked by rock. How many still seep rim-water?",
        choices: ["5", "9", "4", "13"],
        answer: "5",
        explanation: "9 minus 4 equals 5.",
      },
    ],
    recall: [
      {
        id: "wc_c2_q1",
        method: "visual",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 2,
        question: "Where do heat-pods grow?",
        choices: ["Hot Base", "Warm Middle", "Cool Top", "Chill Line"],
        answer: "Hot Base",
        explanation: "",
      },
      {
        id: "wc_c2_q2",
        method: "visual",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 2,
        question: "Where do most Sorath and Renn live?",
        choices: ["Warm Middle", "Hot Base", "Cool Top", "The rim"],
        answer: "Warm Middle",
        explanation: "",
      },
      {
        id: "wc_c2_q3",
        method: "visual",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 2,
        question: "What is the boundary between Warm Middle and Cool Top?",
        choices: ["Chill Line", "Heat Divide", "The Rim", "Crack Line"],
        answer: "Chill Line",
        explanation: "",
      },
      {
        id: "wc_c2_q4",
        method: "visual",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 2,
        question: "How many cracks does the rim have?",
        choices: ["9", "4", "5", "12"],
        answer: "9",
        explanation: "",
      },
      {
        id: "wc_c2_q5",
        method: "visual",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 2,
        question:
          "To get rim-water, which direction does a Renn from the Warm Middle travel?",
        choices: [
          "Up to Cool Top",
          "Down to Hot Base",
          "Sideways to Chill Line",
          "Nowhere",
        ],
        answer: "Up to Cool Top",
        explanation: "",
      },
    ],
  },
  {
    intro:
      "Everything below is completely made up.\n\nLong ago the Sorath and Renn were one group called the Vennari. They split after a heat burst deep in Venn called the Deep Roar melted the paths between their living areas. The Sorath stayed near the walls where tails were most useful. The Renn moved higher up to cooler air they preferred. Both groups share the Wall Meet, held every 80 days where all repair walls together. The last Wall Meet was 30 days ago.",
    round: [
      {
        id: "wc_c3_r1",
        method: "teach_back",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 3,
        question: "What were the Sorath and Renn called before they split?",
        choices: ["The Vennari", "The Keln", "The Ori", "The Rim People"],
        answer: "The Vennari",
        explanation: "Both peoples were once called the Vennari.",
      },
      {
        id: "wc_c3_r2",
        method: "teach_back",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 3,
        question: "What event caused the Vennari to split?",
        choices: [
          "A heat burst called the Deep Roar",
          "A flood",
          "A new law",
          "A storm called the Long Shake",
        ],
        answer: "A heat burst called the Deep Roar",
        explanation: "The Deep Roar melted paths, forcing the Vennari apart.",
      },
      {
        id: "wc_c3_r3",
        method: "teach_back",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 3,
        question:
          "Why did the Renn move higher up inside Venn after the Deep Roar?",
        choices: [
          "They preferred cooler air",
          "They needed rim-water only found up top",
          "The Sorath pushed them out",
          "They liked the Chill Line",
        ],
        answer: "They preferred cooler air",
        explanation: "The Renn preferred the cooler upper sections.",
      },
      {
        id: "wc_c3_r4",
        method: "teach_back",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 3,
        question: "What is the purpose of the Wall Meet?",
        choices: [
          "All repair walls together",
          "Share heat-pods",
          "Sing together",
          "Count the Vennari",
        ],
        answer: "All repair walls together",
        explanation: "Both groups maintain Venn's walls as a shared task.",
      },
      {
        id: "wc_c3_r5",
        method: "teach_back",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 3,
        question:
          "Wall Meet is every 80 days. Last one was 30 days ago. Days until next?",
        choices: ["50 days", "30 days", "80 days", "110 days"],
        answer: "50 days",
        explanation: "80 minus 30 equals 50.",
      },
      {
        id: "wc_c3_r6",
        method: "teach_back",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 3,
        question:
          "If the Deep Roar never happened, what would most likely be true today?",
        choices: [
          "Sorath and Renn would still be one group called the Vennari",
          "Renn would have moved higher anyway",
          "There would be no Wall Meet",
          "The heat-pods would not exist",
        ],
        answer: "Sorath and Renn would still be one group called the Vennari",
        explanation: "The heat burst was the only cause of the split.",
      },
    ],
    recall: [
      {
        id: "wc_c3_q1",
        method: "teach_back",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 3,
        question: "What were Sorath and Renn originally called?",
        choices: ["The Vennari", "The Keln", "The Ori", "The Rim People"],
        answer: "The Vennari",
        explanation: "",
      },
      {
        id: "wc_c3_q2",
        method: "teach_back",
        type: "mcq",
        difficulty: "easy",
        chunk_index: 3,
        question: "What caused the Vennari to split?",
        choices: [
          "Heat burst called Deep Roar",
          "A flood",
          "A new law",
          "A storm",
        ],
        answer: "Heat burst called Deep Roar",
        explanation: "",
      },
      {
        id: "wc_c3_q3",
        method: "teach_back",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 3,
        question: "What do both groups do at the Wall Meet?",
        choices: [
          "Repair walls together",
          "Share heat-pods",
          "Sing together",
          "Count everyone",
        ],
        answer: "Repair walls together",
        explanation: "",
      },
      {
        id: "wc_c3_q4",
        method: "teach_back",
        type: "mcq",
        difficulty: "medium",
        chunk_index: 3,
        question: "How often is the Wall Meet held?",
        choices: [
          "Every 80 days",
          "Every 30 days",
          "Every 50 days",
          "Every 100 days",
        ],
        answer: "Every 80 days",
        explanation: "",
      },
      {
        id: "wc_c3_q5",
        method: "teach_back",
        type: "mcq",
        difficulty: "hard",
        chunk_index: 3,
        question: "Last Wall Meet was 30 days ago. Days until next?",
        choices: ["50 days", "30 days", "80 days", "110 days"],
        answer: "50 days",
        explanation: "",
      },
    ],
  },
];

// ── Registry & helpers ────────────────────────────────────────────
const WORLDS = [
  { name: "The Velari of Oros", chunks: WORLD_A_CHUNKS },
  { name: "The Mavu of Kelm", chunks: WORLD_B_CHUNKS },
  { name: "The Sorath of Venn", chunks: WORLD_C_CHUNKS },
];

const METHODS: DiagnosticMethod[] = [
  "flashcards",
  "practice",
  "visual",
  "teach_back",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DECAY = [1.3, 1.2, 1.1, 1.0]; // position 0 shown earliest → most decay

function calculateScores(
  roundAnswers: DiagnosticAnswer[],
  recallAnswers: DiagnosticAnswer[],
  chunkOrder: number[],
): Record<DiagnosticMethod, MethodScore> {
  const result = {} as Record<DiagnosticMethod, MethodScore>;

  for (const method of METHODS) {
    const rnd = roundAnswers.filter((a) => a.method === method);
    const acc =
      rnd.length > 0
        ? (rnd.filter((a) => a.correct).length / rnd.length) * 100
        : 0;

    const times = rnd.map((a) => a.time_ms).filter((t) => t > 0);
    const avgTime =
      times.length > 0 ? times.reduce((s, t) => s + t, 0) / times.length : 8500;
    const spd =
      avgTime < 5000
        ? 100
        : avgTime > 12000
          ? 50
          : 100 - ((avgTime - 5000) / 7000) * 50;

    const methodChunkIdx = METHODS.indexOf(method);
    const chunkIdx = chunkOrder[methodChunkIdx] ?? methodChunkIdx;
    const positionInOrder = chunkOrder.indexOf(chunkIdx);
    const decay = DECAY[positionInOrder] ?? 1.0;

    const rec = recallAnswers.filter((a) => a.chunk_index === chunkIdx);
    const rawRet =
      rec.length > 0
        ? (rec.filter((a) => a.correct).length / rec.length) * 100
        : 0;
    const ret = Math.min(100, rawRet * decay);

    result[method] = {
      accuracy: Math.round(acc),
      speed: Math.round(spd),
      retention: Math.round(ret),
      final: Math.round(acc * 0.6 + spd * 0.2 + ret * 0.2),
    };
  }
  return result;
}

function buildLearningProfile(
  scores: Record<DiagnosticMethod, MethodScore>,
): Record<DiagnosticMethod, number> {
  const finals = METHODS.map((m) => scores[m]?.final ?? 0);
  const total = finals.reduce((s, v) => s + v, 0) || 1;
  const profile = {} as Record<DiagnosticMethod, number>;
  METHODS.forEach((m, i) => {
    profile[m] = Math.round((finals[i] / total) * 100) / 100;
  });
  return profile;
}

// ── Public API ────────────────────────────────────────────────────
export const diagnosticApi = {
  start: (payload: {
    subject: string;
    grade_band: string;
    attempt_number?: number;
  }): Promise<StartDiagnosticResponse> => {
    const worldIdx = (payload.attempt_number ?? 0) % 3;
    const world = WORLDS[worldIdx];
    const chunkOrder = shuffle([0, 1, 2, 3]);

    const roundQuestions: DiagnosticQuestion[] = METHODS.flatMap(
      (method, mi) => {
        const chunkIdx = chunkOrder[mi];
        return world.chunks[chunkIdx].round.map((q) => ({ ...q, method }));
      },
    );

    const recallQuestions: DiagnosticQuestion[] = shuffle(
      world.chunks.flatMap((chunk) => chunk.recall),
    );

    const chunkIntros = chunkOrder.map((ci) => world.chunks[ci].intro);

    const mockResponse: StartDiagnosticResponse = {
      attempt_id: `local-${Date.now()}`,
      round_questions: roundQuestions,
      recall_questions: recallQuestions,
      topic: world.name,
      topic_intro: "",
      chunk_order: chunkOrder,
      chunk_intros: chunkIntros,
    };

    // Questions live entirely in the browser — always resolve locally.
    // Server endpoint not needed until backend supports fictional worlds.
    return Promise.resolve(mockResponse);
  },

  submit: (payload: {
    attempt_id: string;
    answers: DiagnosticAnswer[];
    chunk_order: number[];
    grade_band?: string;
  }): Promise<{
    scores: Record<DiagnosticMethod, MethodScore>;
    primary_method: DiagnosticMethod;
    secondary_method: DiagnosticMethod;
    learning_profile: Record<DiagnosticMethod, number>;
  }> => {
    const roundAnswers = payload.answers.filter(
      (a) => !a.question_id.includes("_q"),
    );
    const recallAnswers = payload.answers.filter((a) =>
      a.question_id.includes("_q"),
    );
    const scores = calculateScores(
      roundAnswers,
      recallAnswers,
      payload.chunk_order,
    );
    const profile = buildLearningProfile(scores);

    const sorted = [...METHODS].sort(
      (a, b) => (scores[b]?.final ?? 0) - (scores[a]?.final ?? 0),
    );
    const primary_method = sorted[0];
    const secondary_method = sorted[1];

    const result = {
      scores,
      primary_method,
      secondary_method,
      learning_profile: profile,
    };

    if (process.env.NEXT_PUBLIC_API_URL) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/diagnostic/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          scores,
          primary_method,
          secondary_method,
          learning_profile: profile,
        }),
      }).catch(() => {
        /* fire and forget */
      });
    }

    return Promise.resolve(result);
  },

  getAttempt: (_attemptId: string): Promise<unknown> => {
    return Promise.resolve(null);
  },
};
