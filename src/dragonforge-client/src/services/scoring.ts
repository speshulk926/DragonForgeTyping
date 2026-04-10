export function calculatePoints(
  accuracy: number,
  basePoints: number
): { points: number; badge: string | null } {
  if (accuracy >= 100) {
    return { points: Math.round(basePoints * 1.5), badge: "Perfect Forge!" };
  }
  if (accuracy >= 90) {
    return { points: basePoints, badge: null };
  }
  if (accuracy >= 70) {
    return { points: Math.round(basePoints * 0.5), badge: null };
  }
  return { points: 0, badge: null };
}
