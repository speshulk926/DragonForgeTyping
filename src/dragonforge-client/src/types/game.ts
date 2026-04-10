export interface LevelDefinition {
  id: number;
  levelNumber: number;
  title: string;
  description: string;
  phase: string;
  promptTexts: string[];
  basePoints: number;
  minWpmForBonus: number | null;
}

export interface LevelSummary {
  id: number;
  levelNumber: number;
  title: string;
  description: string;
  phase: string;
  basePoints: number;
  promptCount: number;
}

export interface LevelAttemptResult {
  levelNumber: number;
  wpm: number;
  accuracy: number;
  heartsRemaining: number;
  pointsAwarded: number;
  passed: boolean;
}

export interface PlayerProfile {
  name: string;
  highestLevelCompleted: number;
  totalPoints: number;
  currentStage: EvolutionStage;
  attempts: LevelAttemptResult[];
}

export type EvolutionStage =
  | "Egg"
  | "Hatchling"
  | "Drake"
  | "YoungDragon"
  | "FireDrake"
  | "ElderDragon"
  | "InfernoDragon";
