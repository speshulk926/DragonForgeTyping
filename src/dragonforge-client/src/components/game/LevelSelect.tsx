import { getAllLevels } from "../../services/levels";
import { getStageInfo, getNextStageInfo } from "../../services/evolution";
import type { PlayerProfile } from "../../types/game";
import DragonAvatar from "../shared/DragonAvatar";

interface Props {
  profile: PlayerProfile;
  onSelectLevel: (levelNumber: number) => void;
  onLogout: () => void;
}

export default function LevelSelect({ profile, onSelectLevel, onLogout }: Props) {
  const levels = getAllLevels();

  return (
    <div className="level-select-screen">
      <div className="level-select-header">
        <div className="player-info">
          <DragonAvatar stage={profile.currentStage} highestLevelCompleted={profile.highestLevelCompleted} size={56} />
          <div className="player-info-text">
            <span className="player-name">{profile.name}</span>
            <span className="player-points">{profile.totalPoints} pts &middot; {getStageInfo(profile.currentStage).label}</span>
          </div>
        </div>
        <button className="btn btn-logout" onClick={onLogout}>
          Change Player
        </button>
      </div>

      {(() => {
        const next = getNextStageInfo(profile.currentStage);
        if (!next) return null;
        return (
          <div className="evolution-hint">
            Next evolution: {next.label} — {next.description}
          </div>
        );
      })()}

      <h2 className="level-select-title">Select a Level</h2>

      <div className="level-grid">
        {levels.map((level) => {
          const isUnlocked = level.levelNumber <= profile.highestLevelCompleted + 1;
          const isCompleted = level.levelNumber <= profile.highestLevelCompleted;

          // Find best attempt for this level
          const attempts = profile.attempts.filter(
            (a) => a.levelNumber === level.levelNumber && a.passed
          );
          const bestAttempt = attempts.length > 0
            ? attempts.reduce((best, a) => (a.pointsAwarded > best.pointsAwarded ? a : best))
            : null;

          return (
            <button
              key={level.id}
              className={`level-card ${isCompleted ? "completed" : ""} ${
                !isUnlocked ? "locked" : ""
              } ${isUnlocked && !isCompleted ? "current" : ""}`}
              onClick={() => isUnlocked && onSelectLevel(level.levelNumber)}
              disabled={!isUnlocked}
            >
              <span className="level-number">{level.levelNumber}</span>
              <span className="level-name">{level.title}</span>
              {isCompleted && bestAttempt && (
                <span className="level-score">
                  {bestAttempt.pointsAwarded}pts · {bestAttempt.wpm}wpm
                </span>
              )}
              {!isUnlocked && <span className="lock-icon">🔒</span>}
              {isCompleted && <span className="check-icon">✅</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
