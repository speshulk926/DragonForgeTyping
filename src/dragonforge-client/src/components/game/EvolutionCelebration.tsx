import { useEffect } from "react";
import type { EvolutionStage } from "../../types/game";
import { getStageInfo } from "../../services/evolution";
import DragonAvatar from "../shared/DragonAvatar";

interface Props {
  newStage: EvolutionStage;
  highestLevelCompleted: number;
  onContinue: () => void;
}

export default function EvolutionCelebration({ newStage, highestLevelCompleted, onContinue }: Props) {
  const info = getStageInfo(newStage);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onContinue();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onContinue]);

  return (
    <div className="evolution-overlay">
      <div className="evolution-card">
        <div className="evolution-sparkles">✨</div>
        <h2 className="evolution-title">Evolution!</h2>
        <div className="evolution-avatar">
          <DragonAvatar stage={newStage} highestLevelCompleted={highestLevelCompleted} size={140} />
        </div>
        <h3 className="evolution-stage-name">{info.label}</h3>
        <p className="evolution-description">
          Your dragon has evolved into a {info.label}!
        </p>
        <button className="btn btn-next" onClick={onContinue}>
          Continue
        </button>
        <p className="enter-hint">Press Enter to continue</p>
      </div>
    </div>
  );
}
