import { useEffect, useRef } from "react";
import type { EvolutionStage } from "../../types/game";
import DragonAvatar from "../shared/DragonAvatar";
import { playPerfectForgeSound } from "../../services/sounds";

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

  // Perfect Forge particles
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPerfect = badge === "Perfect Forge!";

  useEffect(() => {
    if (!isPerfect) return;
    playPerfectForgeSound();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 440;
    canvas.height = 500;

    type Particle = { x: number; y: number; vx: number; vy: number; size: number; color: string; life: number };
    const particles: Particle[] = [];

    // Burst of particles from center
    for (let i = 0; i < 40; i++) {
      const angle = (Math.PI * 2 * i) / 40 + Math.random() * 0.3;
      const speed = 2 + Math.random() * 4;
      particles.push({
        x: 220, y: 200,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: 2 + Math.random() * 4,
        color: ["#ffd700", "#ff6b35", "#ff4400", "#ffaa00", "#ffee44"][Math.floor(Math.random() * 5)],
        life: 60 + Math.random() * 40,
      });
    }

    let frame = 0;
    let animId: number;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, 440, 500);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        p.life--;
        const alpha = Math.max(0, p.life / 80);
        ctx.fillStyle = p.color.replace(")", `, ${alpha})`).replace("rgb", "rgba").replace("#", "");
        // Hex to rgba workaround
        ctx.globalAlpha = alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
      if (frame < 120) animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [isPerfect, badge]);

  return (
    <div className="level-complete-overlay">
      {isPerfect && <canvas ref={canvasRef} className="perfect-forge-particles" />}
      <div className={`level-complete-card ${isPerfect ? "perfect-forge" : ""}`}>
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
