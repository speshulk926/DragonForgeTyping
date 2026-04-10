import { useEffect, useRef } from "react";
import type { EvolutionStage } from "../../types/game";
import { drawStandaloneEgg, drawStandaloneDragon } from "../../services/sprites";

interface Props {
  stage: EvolutionStage;
  highestLevelCompleted: number;
  /** CSS pixel size of the avatar (square) */
  size: number;
  className?: string;
}

export default function DragonAvatar({ stage, highestLevelCompleted, size, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let animId: number;
    const draw = () => {
      frameRef.current++;
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;

      if (stage === "Egg") {
        const cracks = Math.min(highestLevelCompleted, 4);
        drawStandaloneEgg(ctx, cx, cy, size * 0.38, cracks);
      } else {
        drawStandaloneDragon(ctx, stage, cx, cy, size * 0.65, frameRef.current);
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [stage, highestLevelCompleted, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
