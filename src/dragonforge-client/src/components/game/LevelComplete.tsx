import { useEffect } from "react";
import type { EvolutionStage } from "../../types/game";
import DragonAvatar from "../shared/DragonAvatar";

interface Props {
  accuracy: number;
  wpm: number;
  pointsAwarded: number;
  heartsRemaining: number;
  maxHearts: number;
  badge: string | null;
  failed: boolean;
  stage: EvolutionStage;
  highestLevelCompleted: number;
  onNext: () => void;
  onRetry: () => void;
  onBack: () => void;
}

export default function LevelComplete({
  accuracy,
  wpm,
  pointsAwarded,
  heartsRemaining,
  maxHearts,
  badge,
  failed,
  stage,
  highestLevelCompleted,
  onNext,
  onRetry,
  onBack,
}: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (failed) {
          onRetry();
        } else {
          onNext();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [failed, onNext, onRetry]);

  return (
    <div className="level-complete-overlay">
      <div className="level-complete-card">
        {failed ? (
          <>
            <h2 className="level-complete-title failed">Level Failed!</h2>
            <p className="level-complete-subtitle">You ran out of hearts. Try again!</p>
          </>
        ) : (
          <>
            <h2 className="level-complete-title success">Level Complete!</h2>
            {badge && <div className="badge">{badge}</div>}
          </>
        )}

        <div className="level-complete-avatar">
          <DragonAvatar stage={stage} highestLevelCompleted={highestLevelCompleted} size={100} />
        </div>

        <div className="stats-grid">
          <div className="stat">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{accuracy}%</span>
          </div>
          <div className="stat">
            <span className="stat-label">Speed</span>
            <span className="stat-value">{wpm} WPM</span>
          </div>
          <div className="stat">
            <span className="stat-label">Points</span>
            <span className="stat-value">+{pointsAwarded}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Hearts</span>
            <span className="stat-value">
              {heartsRemaining}/{maxHearts} ❤️
            </span>
          </div>
        </div>

        <div className="level-complete-actions">
          <button className="btn btn-back-card" onClick={onBack}>
            ←
          </button>
          <button className="btn btn-retry" onClick={onRetry}>
            Retry
          </button>
          {!failed && (
            <button className="btn btn-next" onClick={onNext}>
              Next Level
            </button>
          )}
        </div>
        <p className="enter-hint">Press Enter to continue</p>
      </div>
    </div>
  );
}
