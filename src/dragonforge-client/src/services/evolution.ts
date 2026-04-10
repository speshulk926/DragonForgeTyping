import type { EvolutionStage, PlayerProfile } from "../types/game";

export interface StageRequirement {
  stage: EvolutionStage;
  label: string;
  minPasses: number;
  minWpm: number | null;
  minAccuracy: number | null;
}

// Ordered lowest to highest
export const STAGE_REQUIREMENTS: StageRequirement[] = [
  { stage: "Egg",           label: "Egg",            minPasses: 0,   minWpm: null, minAccuracy: null },
  { stage: "Hatchling",     label: "Hatchling",      minPasses: 5,   minWpm: null, minAccuracy: null },
  { stage: "Drake",         label: "Drake",          minPasses: 10,  minWpm: 20,   minAccuracy: 95 },
  { stage: "YoungDragon",   label: "Young Dragon",   minPasses: 20,  minWpm: 30,   minAccuracy: 95 },
  { stage: "FireDrake",     label: "Fire Drake",     minPasses: 30,  minWpm: 50,   minAccuracy: 95 },
  { stage: "ElderDragon",   label: "Elder Dragon",   minPasses: 45,  minWpm: 70,   minAccuracy: 95 },
  { stage: "InfernoDragon", label: "Inferno Dragon",  minPasses: 70,  minWpm: 90,   minAccuracy: 95 },
];

function getStats(profile: PlayerProfile) {
  const passed = profile.attempts.filter((a) => a.passed);
  if (passed.length === 0) return { totalPasses: 0, avgWpm: 0, avgAccuracy: 0 };

  // Average the last 10 passed attempts (or fewer if not enough yet)
  const recent = passed.slice(-10);
  const avgWpm = recent.reduce((s, a) => s + a.wpm, 0) / recent.length;
  const avgAccuracy = recent.reduce((s, a) => s + a.accuracy, 0) / recent.length;

  return { totalPasses: passed.length, avgWpm, avgAccuracy };
}

function meetsRequirement(profile: PlayerProfile, req: StageRequirement): boolean {
  const { totalPasses, avgWpm, avgAccuracy } = getStats(profile);

  if (totalPasses < req.minPasses) return false;

  // Hatchling only needs pass count + level completion
  if (req.minWpm === null) return profile.highestLevelCompleted >= req.minPasses;

  return avgWpm >= req.minWpm && avgAccuracy >= (req.minAccuracy ?? 0);
}

export function computeStage(profile: PlayerProfile): EvolutionStage {
  for (let i = STAGE_REQUIREMENTS.length - 1; i >= 0; i--) {
    if (meetsRequirement(profile, STAGE_REQUIREMENTS[i])) {
      return STAGE_REQUIREMENTS[i].stage;
    }
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

export function getStageInfo(stage: EvolutionStage): StageRequirement {
  return STAGE_REQUIREMENTS.find((s) => s.stage === stage) ?? STAGE_REQUIREMENTS[0];
}

export function getNextStageInfo(stage: EvolutionStage): StageRequirement | null {
  const rank = stageRank(stage);
  return STAGE_REQUIREMENTS[rank + 1] ?? null;
}

export interface EvolutionProgress {
  nextStage: StageRequirement;
  passesRequired: number;
  passesCurrent: number;
  passesPercent: number;
  wpmRequired: number | null;
  wpmCurrent: number;
  wpmPercent: number;
  accuracyRequired: number | null;
  accuracyCurrent: number;
  accuracyPercent: number;
  overallPercent: number;
}

export function getEvolutionProgress(profile: PlayerProfile): EvolutionProgress | null {
  const next = getNextStageInfo(profile.currentStage);
  if (!next) return null;

  const { totalPasses, avgWpm, avgAccuracy } = getStats(profile);

  const passesPercent = Math.min(100, (totalPasses / next.minPasses) * 100);
  const wpmPercent = next.minWpm ? Math.min(100, (avgWpm / next.minWpm) * 100) : 100;
  const accuracyPercent = next.minAccuracy ? Math.min(100, (avgAccuracy / next.minAccuracy) * 100) : 100;
  const overallPercent = Math.min(passesPercent, wpmPercent, accuracyPercent);

  return {
    nextStage: next,
    passesRequired: next.minPasses,
    passesCurrent: totalPasses,
    passesPercent,
    wpmRequired: next.minWpm,
    wpmCurrent: Math.round(avgWpm),
    wpmPercent,
    accuracyRequired: next.minAccuracy,
    accuracyCurrent: Math.round(avgAccuracy * 10) / 10,
    accuracyPercent,
    overallPercent,
  };
}

const STAGE_ORDER: EvolutionStage[] = [
  "Egg", "Hatchling", "Drake", "YoungDragon", "FireDrake", "ElderDragon", "InfernoDragon",
];

function stageRank(stage: EvolutionStage): number {
  return STAGE_ORDER.indexOf(stage);
}
