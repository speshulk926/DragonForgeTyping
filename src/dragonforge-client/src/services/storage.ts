import type { PlayerProfile, LevelAttemptResult } from "../types/game";

const PROFILE_KEY = "dragonforge_profile";

export function getProfile(): PlayerProfile | null {
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  const profile = JSON.parse(raw) as PlayerProfile;
  // Migration: add currentStage if missing (old profiles)
  if (!profile.currentStage) profile.currentStage = "Egg";
  return profile;
}

export function saveProfile(profile: PlayerProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function createProfile(name: string): PlayerProfile {
  const profile: PlayerProfile = {
    name,
    highestLevelCompleted: 0,
    totalPoints: 0,
    currentStage: "Egg",
    attempts: [],
  };
  saveProfile(profile);
  return profile;
}

export function saveAttempt(result: LevelAttemptResult): PlayerProfile {
  const profile = getProfile();
  if (!profile) throw new Error("No profile found");

  profile.attempts.push(result);
  profile.totalPoints += result.pointsAwarded;

  if (result.passed && result.levelNumber > profile.highestLevelCompleted) {
    profile.highestLevelCompleted = result.levelNumber;
  }

  saveProfile(profile);
  return profile;
}

export function updateStage(profile: PlayerProfile): void {
  saveProfile(profile);
}

export function clearProfile(): void {
  localStorage.removeItem(PROFILE_KEY);
}
