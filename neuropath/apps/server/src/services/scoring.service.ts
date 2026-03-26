import type {
  DiagnosticAnswer,
  DiagnosticScores,
  MethodScore,
  LearningMethod,
  LearningProfile,
} from "@neuropath/types";

/*
  THE SCORING ALGORITHM
  =====================
  This is the scientific heart of NeuroPath.

  For each learning method (flashcards, practice, visual, teach_back):
  1. Calculate accuracy  = correct answers / total answers × 100
  2. Calculate speed     = how fast they answered vs the max time allowed × 100
  3. Calculate retention = their score on recall questions for this method × 100

  Final score per method:
    score = (accuracy × 0.6) + (speed × 0.2) + (retention × 0.2)

  Learning profile:
    Normalize the four final scores so they sum to 1.0
    This gives us the percentage weights for study pack generation.
*/

const MAX_TIME_MS       = 25_000; // 25 seconds per question
const ACCURACY_WEIGHT   = 0.6;
const SPEED_WEIGHT      = 0.2;
const RETENTION_WEIGHT  = 0.2;

export const scoringService = {

  /* Score all answers and return the full breakdown + learning profile */
  score: (answers: DiagnosticAnswer[]): {
    scores:           DiagnosticScores;
    primary_method:   LearningMethod;
    secondary_method: LearningMethod;
    learning_profile: LearningProfile;
  } => {
    const methods: LearningMethod[] = ["flashcards", "practice", "visual", "teach_back"];

    /* Separate learning round answers from recall answers */
    const recallAnswers  = answers.slice(-20); // Last 20 are recall
    const learningAnswers = answers.slice(0, -20);

    const scores: DiagnosticScores = {} as DiagnosticScores;

    for (const method of methods) {
      /* Learning round answers for this method */
      const roundAnswers  = learningAnswers.filter(a => a.method === method);
      /* Recall answers for this method */
      const methodRecalls = recallAnswers.filter(a => a.method === method);

      scores[method] = calculateMethodScore(roundAnswers, methodRecalls);
    }

    /* Sort methods by final score descending */
    const sorted = methods.sort((a, b) => scores[b].final - scores[a].final);

    /* Build learning profile — normalize scores to sum to 1.0 */
    const total = methods.reduce((sum, m) => sum + scores[m].final, 0);
    const learning_profile: LearningProfile = {
      flashcards:  total > 0 ? parseFloat((scores.flashcards.final  / total).toFixed(3)) : 0.25,
      practice:    total > 0 ? parseFloat((scores.practice.final    / total).toFixed(3)) : 0.25,
      visual:      total > 0 ? parseFloat((scores.visual.final      / total).toFixed(3)) : 0.25,
      teach_back:  total > 0 ? parseFloat((scores.teach_back.final  / total).toFixed(3)) : 0.25,
    };

    /* Fix any rounding errors so profile sums exactly to 1.0 */
    const profileTotal = Object.values(learning_profile).reduce((s, v) => s + v, 0);
    if (Math.abs(profileTotal - 1.0) > 0.001) {
      learning_profile[sorted[0]] += parseFloat((1.0 - profileTotal).toFixed(3));
    }

    return {
      scores,
      primary_method:   sorted[0],
      secondary_method: sorted[1],
      learning_profile,
    };
  },
};

/* ── Helper: score a single method ── */
function calculateMethodScore(
  roundAnswers:  DiagnosticAnswer[],
  recallAnswers: DiagnosticAnswer[],
): MethodScore {
  /* Accuracy — from learning round */
  const accuracy = roundAnswers.length > 0
    ? (roundAnswers.filter(a => a.correct).length / roundAnswers.length) * 100
    : 0;

  /* Speed — faster answers = higher score */
  const avgTimeMs = roundAnswers.length > 0
    ? roundAnswers.reduce((sum, a) => sum + a.time_ms, 0) / roundAnswers.length
    : MAX_TIME_MS;
  const speed = Math.max(0, Math.min(100, (1 - avgTimeMs / MAX_TIME_MS) * 100));

  /* Retention — from delayed recall test */
  const retention = recallAnswers.length > 0
    ? (recallAnswers.filter(a => a.correct).length / recallAnswers.length) * 100
    : 0;

  /* Weighted composite */
  const final = parseFloat(
    ((accuracy * ACCURACY_WEIGHT) + (speed * SPEED_WEIGHT) + (retention * RETENTION_WEIGHT)).toFixed(2)
  );

  return {
    accuracy:  parseFloat(accuracy.toFixed(2)),
    speed:     parseFloat(speed.toFixed(2)),
    retention: parseFloat(retention.toFixed(2)),
    final,
  };
}
