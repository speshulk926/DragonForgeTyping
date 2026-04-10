import type { EvolutionStage, PlayerProfile } from "../types/game";

interface StageRequirement {
  stage: EvolutionStage;
  label: string;
  description: string;
  check: (profile: PlayerProfile) => boolean;
}

// Ordered from highest to lowest — first match wins
const STAGES: StageRequirement[] = [
  {
    stage: "InfernoDragon",
    label: "Inferno Dragon",
    description: "Avg 90+ WPM, 95%+ accuracy (last 10 attempts)",
    check: (p) => hasAveragePerformance(p, 90, 95),
  },
  {
    stage: "ElderDragon",
    label: "Elder Dragon",
    description: "Avg 70+ WPM, 95%+ accuracy (last 10 attempts)",
    check: (p) => hasAveragePerformance(p, 70, 95),
  },
  {
    stage: "FireDrake",
    label: "Fire Drake",
    description: "Avg 50+ WPM, 95%+ accuracy (last 10 attempts)",
    check: (p) => hasAveragePerformance(p, 50, 95),
  },
  {
    stage: "YoungDragon",
    label: "Young Dragon",
    description: "Avg 30+ WPM, 95%+ accuracy (last 10 attempts)",
    check: (p) => hasAveragePerformance(p, 30, 95),
  },
  {
    stage: "Drake",
    label: "Drake",
    description: "Avg 20+ WPM, 95%+ accuracy (last 10 attempts)",
    check: (p) => hasAveragePerformance(p, 20, 95),
  },
  {
    stage: "Hatchling",
    label: "Hatchling",
    description: "Complete 5 levels",
    check: (p) => p.highestLevelCompleted >= 5,
  },
  {
    stage: "Egg",
    label: "Egg",
    description: "Starting stage",
    check: () => true,
  },
];

/**
 * Only count passed attempts from the player's 5 highest-numbered levels,
 * then check if the average of the last 10 of those meets the threshold.
 */
function hasAveragePerformance(
  profile: PlayerProfile,
  minWpm: number,
  minAccuracy: number
): boolean {
  const passed = profile.attempts.filter((a) => a.passed);
  if (passed.length === 0) return false;

  // Find the 5 highest distinct level numbers the player has attempted
  const distinctLevels = [...new Set(passed.map((a) => a.levelNumber))];
  distinctLevels.sort((a, b) => b - a);
  const topLevels = new Set(distinctLevels.slice(0, 5));

  // Filter to only attempts from those top levels
  const relevant = passed.filter((a) => topLevels.has(a.levelNumber));
  if (relevant.length < 10) return false;

  // Average the last 10
  const last10 = relevant.slice(-10);
  const avgWpm = last10.reduce((sum, a) => sum + a.wpm, 0) / last10.length;
  const avgAccuracy = last10.reduce((sum, a) => sum + a.accuracy, 0) / last10.length;

  return avgWpm >= minWpm && avgAccuracy >= minAccuracy;
}

export function computeStage(profile: PlayerProfile): EvolutionStage {
  for (const req of STAGES) {
    if (req.check(profile)) return req.stage;
  }
  return "Egg";
}

export function checkEvolution(profile: PlayerProfile): EvolutionStage | null {
  const newStage = computeStage(profile);
  if (newStage !== profile.currentStage && stageRank(newStage) > stageRank(profile.currentStage)) {
    return newStage;
  }
  return null;
}

export function getStageInfo(stage: EvolutionStage) {
  return STAGES.find((s) => s.stage === stage) ?? STAGES[STAGES.length - 1];
}

export function getNextStageInfo(stage: EvolutionStage) {
  const rank = stageRank(stage);
  return STAGES.find((s) => stageRank(s.stage) === rank + 1) ?? null;
}

const STAGE_ORDER: EvolutionStage[] = [
  "Egg", "Hatchling", "Drake", "YoungDragon", "FireDrake", "ElderDragon", "InfernoDragon",
];

function stageRank(stage: EvolutionStage): number {
  return STAGE_ORDER.indexOf(stage);
}
