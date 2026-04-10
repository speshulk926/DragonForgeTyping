import { useState, useEffect, useRef } from "react";
import { getAllLevels } from "../../services/levels";
import { getStageInfo, getEvolutionProgress } from "../../services/evolution";
import type { PlayerProfile } from "../../types/game";
import DragonAvatar from "../shared/DragonAvatar";

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

interface Props {
  profile: PlayerProfile;
  onSelectLevel: (levelNumber: number) => void;
  onLogout: () => void;
}

export default function LevelSelect({ profile, onSelectLevel, onLogout }: Props) {
  const levels = getAllLevels();
  const progress = getEvolutionProgress(profile);
  const [allUnlocked, setAllUnlocked] = useState(false);
  const konamiIndex = useRef(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === KONAMI[konamiIndex.current]) {
        konamiIndex.current++;
        if (konamiIndex.current === KONAMI.length) {
          setAllUnlocked((prev) => !prev);
          konamiIndex.current = 0;
        }
      } else {
        konamiIndex.current = 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

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

      {/* Evolution Progress */}
      {progress && (
        <div className="evolution-progress-card">
          <div className="evo-progress-header">
            <span className="evo-progress-label">Next: {progress.nextStage.label}</span>
            <span className="evo-progress-pct">{Math.round(progress.overallPercent)}%</span>
          </div>
          <div className="evo-progress-bar-track">
            <div
              className="evo-progress-bar-fill"
              style={{ width: `${progress.overallPercent}%` }}
            />
          </div>
          <div className="evo-progress-details">
            <div className={`evo-detail ${progress.passesPercent >= 100 ? "met" : ""}`}>
              <span className="evo-detail-icon">{progress.passesPercent >= 100 ? "✓" : "○"}</span>
              <span>{progress.passesCurrent}/{progress.passesRequired} attempts</span>
            </div>
            {progress.wpmRequired && (
              <div className={`evo-detail ${progress.wpmPercent >= 100 ? "met" : ""}`}>
                <span className="evo-detail-icon">{progress.wpmPercent >= 100 ? "✓" : "○"}</span>
                <span>{progress.wpmCurrent}/{progress.wpmRequired} WPM</span>
              </div>
            )}
            {progress.accuracyRequired && (
              <div className={`evo-detail ${progress.accuracyPercent >= 100 ? "met" : ""}`}>
                <span className="evo-detail-icon">{progress.accuracyPercent >= 100 ? "✓" : "○"}</span>
                <span>{progress.accuracyCurrent}/{progress.accuracyRequired}% accuracy</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Level Completion Progress */}
      <div className="level-progress-card">
        <div className="evo-progress-header">
          <span className="evo-progress-label">Levels Completed</span>
          <span className="evo-progress-pct">{profile.highestLevelCompleted}/{levels.length}</span>
        </div>
        <div className="evo-progress-bar-track">
          <div
            className="level-progress-bar-fill"
            style={{ width: `${(profile.highestLevelCompleted / levels.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="level-select-title">Select a Level</h2>

      <div className="level-grid">
        {levels.map((level) => {
          const isUnlocked = allUnlocked || level.levelNumber <= profile.highestLevelCompleted + 1;
          const isCompleted = level.levelNumber <= profile.highestLevelCompleted;

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
