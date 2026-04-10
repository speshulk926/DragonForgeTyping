import { useEffect, useRef } from "react";
import type { EvolutionStage } from "../../types/game";

interface Props {
  progress: number; // 0 to 1
  isStumbling: boolean;
  promptText: string;
  currentIndex: number;
  stage: EvolutionStage;
  highestLevelCompleted: number;
  currentLevelNumber: number;
}

interface Biome {
  skyTop: string;
  skyBottom: string;
  mountain: string;
  hill: string;
  ground: string;
  path: string;
  stars: string;
  textColor: string;
  textGlow: string;
  particles?: (ctx: CanvasRenderingContext2D, W: number, H: number, frame: number, scrollX: number) => void;
}

const BIOME_FOREST: Biome = {
  skyTop: "#0a1a0a", skyBottom: "#1a3a1a",
  mountain: "#0d2a0d", hill: "#1a4a1a",
  ground: "#2a5a2a", path: "#4a7a3a",
  stars: "#ffffff22", textColor: "#aaee66", textGlow: "#44aa22",
};

const BIOME_MOUNTAINS: Biome = {
  skyTop: "#1a0a2e", skyBottom: "#2d1b69",
  mountain: "#2a1a4e", hill: "#3d2b6b",
  ground: "#4a3580", path: "#6b4f9e",
  stars: "#ffffff44", textColor: "#ffd700", textGlow: "#ff6b35",
};

const BIOME_VOLCANIC: Biome = {
  skyTop: "#1a0500", skyBottom: "#3a1008",
  mountain: "#2a0a04", hill: "#4a1a0a",
  ground: "#3a2010", path: "#6a3a1a",
  stars: "#ff660022", textColor: "#ffaa33", textGlow: "#ff4400",
  particles: (ctx, W, H, frame) => {
    // Floating embers
    for (let i = 0; i < 12; i++) {
      const age = (frame * 0.5 + i * 23) % 60;
      const px = (i * 173 + frame * 0.3) % W;
      const py = H * 0.7 - age * H * 0.01;
      const alpha = Math.max(0, 0.6 - age / 60);
      const size = 1.5 + Math.sin(i) * 0.5;
      ctx.fillStyle = i % 2 === 0 ? `rgba(255, 100, 20, ${alpha})` : `rgba(255, 200, 50, ${alpha})`;
      ctx.fillRect(px, py, size, size);
    }
  },
};

const BIOME_SKY_CASTLE: Biome = {
  skyTop: "#0a0a2e", skyBottom: "#2244aa",
  mountain: "#1a2a6a", hill: "#2a3a8a",
  ground: "#bbccee", path: "#dde4ff",
  stars: "#ffffff66", textColor: "#ffffff", textGlow: "#88bbff",
  particles: (ctx, W, H, frame) => {
    // Drifting clouds
    for (let i = 0; i < 6; i++) {
      const cx = (i * 200 + frame * 0.2) % (W + 100) - 50;
      const cy = H * 0.15 + (i * 47) % (H * 0.3);
      const alpha = 0.12 + Math.sin(i * 2) * 0.04;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 40 + i * 8, 12 + i * 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  },
};

function getBiome(levelNumber: number): Biome {
  if (levelNumber <= 15) return BIOME_FOREST;
  if (levelNumber <= 30) return BIOME_MOUNTAINS;
  if (levelNumber <= 48) return BIOME_VOLCANIC;
  return BIOME_SKY_CASTLE;
}

export default function Runner({ progress, isStumbling, promptText, currentIndex, stage, highestLevelCompleted, currentLevelNumber }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stumbleTimer = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const runFrame = useRef<number>(0);

  useEffect(() => {
    if (isStumbling) {
      stumbleTimer.current = 12;
    }
  }, [isStumbling]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const draw = () => {
      // Resize canvas to match its CSS layout size
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Use CSS pixel dimensions for drawing
      const W = rect.width;
      const H = rect.height;
      const groundY = H * 0.77;
      const charSize = Math.min(40, H * 0.15);

      frameRef.current++;
      if (frameRef.current % 3 === 0) runFrame.current++;

      const scrollX = progress * 2000;
      const biome = getBiome(currentLevelNumber);

      // Sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, biome.skyTop);
      grad.addColorStop(1, biome.skyBottom);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Stars / sky particles
      ctx.fillStyle = biome.stars;
      for (let i = 0; i < 30; i++) {
        const sx = ((i * 137 + 50) % W + scrollX * 0.02) % W;
        const sy = (i * 97 + 20) % (H * 0.5);
        ctx.fillRect(sx, sy, 2, 2);
      }

      // Mountains (parallax layer 1)
      drawMountains(ctx, scrollX * 0.1, biome.mountain, H * 0.53, H * 0.27, W, H);
      // Hills (parallax layer 2)
      drawHills(ctx, scrollX * 0.3, biome.hill, H * 0.63, H * 0.17, W, H);

      // Biome-specific atmospheric particles
      biome.particles?.(ctx, W, H, frameRef.current, scrollX);

      // Ground
      ctx.fillStyle = biome.ground;
      ctx.fillRect(0, groundY, W, H - groundY);

      // Path
      ctx.fillStyle = biome.path;
      ctx.fillRect(0, groundY, W, 8);

      // Text on path
      drawPathText(ctx, promptText, currentIndex, W, groundY, biome);

      // Characters
      const bobY = Math.sin(runFrame.current * 0.3) * 3;
      const isStumble = stumbleTimer.current > 0;
      if (isStumble) stumbleTimer.current--;

      const showCompanion = stage !== "Egg";
      if (showCompanion) {
        // Dragon + Jimothy side by side
        const jimothyInFront = currentLevelNumber <= 10;
        const frontX = W * 0.18;
        const backX = W * 0.06;

        if (jimothyInFront) {
          // Jimothy runs in front, dragon chases behind
          drawJimothyCompanion(ctx, frontX, groundY - charSize + bobY, runFrame.current, charSize, isStumble);
          drawStageCharacter(ctx, stage, backX, groundY - charSize + bobY, runFrame.current, charSize, isStumble, highestLevelCompleted);
        } else {
          // Dragon leads, Jimothy follows
          drawStageCharacter(ctx, stage, frontX, groundY - charSize + bobY, runFrame.current, charSize, isStumble, highestLevelCompleted);
          drawJimothyCompanion(ctx, backX, groundY - charSize + bobY, runFrame.current, charSize, isStumble);
        }
      } else {
        // Egg stage — just Jimothy with egg
        const charX = W * 0.15;
        drawStageCharacter(ctx, stage, charX, groundY - charSize + bobY, runFrame.current, charSize, isStumble, highestLevelCompleted);
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [progress, isStumbling, promptText, currentIndex, stage, highestLevelCompleted, currentLevelNumber]);

  return (
    <canvas
      ref={canvasRef}
      className="runner-canvas"
    />
  );
}

function drawMountains(ctx: CanvasRenderingContext2D, offset: number, color: string, baseY: number, height: number, W: number, H: number) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, baseY + height);
  for (let x = 0; x <= W; x += 5) {
    const mx = x + offset;
    const y = baseY + Math.sin(mx * 0.005) * height * 0.5 + Math.sin(mx * 0.012) * height * 0.3;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
}

function drawHills(ctx: CanvasRenderingContext2D, offset: number, color: string, baseY: number, height: number, W: number, H: number) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, baseY + height);
  for (let x = 0; x <= W; x += 5) {
    const mx = x + offset;
    const y = baseY + Math.sin(mx * 0.008) * height * 0.6 + Math.sin(mx * 0.02) * height * 0.4;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
}

// === Stage-aware character rendering ===

function drawStageCharacter(
  ctx: CanvasRenderingContext2D,
  stage: EvolutionStage,
  x: number, y: number,
  frame: number, size: number,
  isStumble: boolean,
  highestLevelCompleted: number
) {
  const shake = isStumble ? Math.random() * 4 - 2 : 0;
  const sx = x + shake;

  switch (stage) {
    case "Egg":
      drawEggRunner(ctx, sx, y, frame, size, isStumble, Math.min(highestLevelCompleted, 4));
      break;
    case "Hatchling":
      drawHatchling(ctx, sx, y, frame, size, isStumble);
      break;
    case "Drake":
      drawDrake(ctx, sx, y, frame, size, isStumble);
      break;
    case "YoungDragon":
      drawYoungDragon(ctx, sx, y, frame, size, isStumble);
      break;
    case "FireDrake":
      drawFireDrakeSprite(ctx, sx, y, frame, size, isStumble);
      break;
    case "ElderDragon":
      drawElderDragon(ctx, sx, y, frame, size, isStumble);
      break;
    case "InfernoDragon":
      drawInfernoDragon(ctx, sx, y, frame, size, isStumble);
      break;
  }
}

function drawJimothyCompanion(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number, isStumble: boolean) {
  const s = size / 40;
  const legOffset = isStumble ? 0 : Math.sin(frame * 0.4) * 6 * s;
  const shake = isStumble ? Math.random() * 3 - 1.5 : 0;

  // Body
  ctx.fillStyle = "#e8a87c";
  ctx.fillRect(x + 8 * s + shake, y + 4 * s, 24 * s, 20 * s);
  // Hood/head
  ctx.fillStyle = "#8b4513";
  ctx.fillRect(x + 10 * s + shake, y - 8 * s, 20 * s, 14 * s);
  // Eyes
  if (isStumble) {
    ctx.fillStyle = "#ff0000";
    ctx.font = `${8 * s}px monospace`;
    ctx.fillText("×", x + 24 * s + shake, y + 2 * s);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 24 * s, y - 2 * s, 4 * s, 4 * s);
    ctx.fillStyle = "#000000";
    ctx.fillRect(x + 26 * s, y - 1 * s, 2 * s, 2 * s);
  }
  // Arms (swinging)
  ctx.fillStyle = "#e8a87c";
  const armSwing = Math.sin(frame * 0.4) * 4 * s;
  ctx.fillRect(x + 4 * s + shake, y + 8 * s + armSwing, 6 * s, 4 * s);
  ctx.fillRect(x + 28 * s + shake, y + 8 * s - armSwing, 6 * s, 4 * s);
  // Legs
  ctx.fillStyle = "#654321";
  ctx.fillRect(x + 10 * s + shake, y + 24 * s, 6 * s, 12 * s + legOffset);
  ctx.fillRect(x + 24 * s + shake, y + 24 * s, 6 * s, 12 * s - legOffset);
}

function drawEggRunner(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number, isStumble: boolean, cracks: number) {
  const s = size / 40;
  const legOffset = isStumble ? 0 : Math.sin(frame * 0.4) * 6 * s;

  // Body
  ctx.fillStyle = "#e8a87c";
  ctx.fillRect(x + 8 * s, y + 4 * s, 24 * s, 20 * s);
  // Hood/head
  ctx.fillStyle = "#8b4513";
  ctx.fillRect(x + 10 * s, y - 8 * s, 20 * s, 14 * s);
  // Eyes
  if (isStumble) {
    ctx.fillStyle = "#ff0000";
    ctx.font = `${8 * s}px monospace`;
    ctx.fillText("×", x + 24 * s, y + 2 * s);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 24 * s, y - 2 * s, 4 * s, 4 * s);
    ctx.fillStyle = "#000000";
    ctx.fillRect(x + 26 * s, y - 1 * s, 2 * s, 2 * s);
  }
  // Legs
  ctx.fillStyle = "#654321";
  ctx.fillRect(x + 10 * s, y + 24 * s, 6 * s, 12 * s + legOffset);
  ctx.fillRect(x + 24 * s, y + 24 * s, 6 * s, 12 * s - legOffset);
  // Egg
  const ex = x + 36 * s;
  const ey = y + 10 * s;
  ctx.fillStyle = "#f5e6ca";
  ctx.beginPath();
  ctx.ellipse(ex, ey, 8 * s, 11 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // Inner glow — gets warmer with more cracks
  const glowAlpha = 0.08 + cracks * 0.06;
  ctx.fillStyle = `rgba(255, 107, 53, ${glowAlpha})`;
  ctx.beginPath();
  ctx.ellipse(ex, ey + 2 * s, 6 * s, 8 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // Cracks
  if (cracks >= 1) drawEggCrack(ctx, ex, ey, s, -3, -4, 5, 8);
  if (cracks >= 2) drawEggCrack(ctx, ex, ey, s, 2, -6, -4, 6);
  if (cracks >= 3) drawEggCrack(ctx, ex, ey, s, -5, 1, 6, 5);
  if (cracks >= 4) {
    drawEggCrack(ctx, ex, ey, s, 1, 3, -5, 4);
    // Bright glow peeking through at 4 cracks
    ctx.fillStyle = "rgba(255, 200, 50, 0.25)";
    ctx.beginPath();
    ctx.ellipse(ex, ey, 4 * s, 5 * s, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Arm holding egg
  ctx.fillStyle = "#e8a87c";
  ctx.fillRect(x + 28 * s, y + 8 * s, 8 * s, 6 * s);
}

function drawEggCrack(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, s: number,
  x1: number, y1: number, x2: number, y2: number
) {
  ctx.strokeStyle = "#8b6914";
  ctx.lineWidth = 1.2 * s;
  ctx.beginPath();
  ctx.moveTo(cx + x1 * s, cy + y1 * s);
  // Zigzag crack
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  ctx.lineTo(cx + (mx + 1.5) * s, cy + (my - 1) * s);
  ctx.lineTo(cx + (mx - 1) * s, cy + (my + 1.5) * s);
  ctx.lineTo(cx + x2 * s, cy + y2 * s);
  ctx.stroke();
}

function drawHatchling(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number, isStumble: boolean) {
  const s = size / 40;
  const legOffset = isStumble ? 0 : Math.sin(frame * 0.4) * 4 * s;
  const bodyColor = "#66cc55";
  const bellyColor = "#99ee88";

  // Body (small round)
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x + 20 * s, y + 14 * s, 14 * s, 12 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // Belly
  ctx.fillStyle = bellyColor;
  ctx.beginPath();
  ctx.ellipse(x + 22 * s, y + 16 * s, 8 * s, 8 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x + 32 * s, y + 2 * s, 10 * s, 9 * s, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // Eye
  if (isStumble) {
    ctx.fillStyle = "#ff0000";
    ctx.font = `${7 * s}px monospace`;
    ctx.fillText("×", x + 36 * s, y + 4 * s);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 36 * s, y - 1 * s, 4 * s, 4 * s);
    ctx.fillStyle = "#111";
    ctx.fillRect(x + 38 * s, y, 2 * s, 2 * s);
  }
  // Tiny wings
  ctx.fillStyle = "#55aa44";
  ctx.beginPath();
  ctx.moveTo(x + 12 * s, y + 6 * s);
  ctx.lineTo(x + 4 * s, y - 4 * s);
  ctx.lineTo(x + 16 * s, y + 2 * s);
  ctx.closePath();
  ctx.fill();
  // Legs
  ctx.fillStyle = bodyColor;
  ctx.fillRect(x + 12 * s, y + 24 * s, 5 * s, 10 * s + legOffset);
  ctx.fillRect(x + 24 * s, y + 24 * s, 5 * s, 10 * s - legOffset);
  // Tail
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(x + 6 * s, y + 18 * s);
  ctx.quadraticCurveTo(x - 6 * s, y + 12 * s, x - 4 * s, y + 6 * s);
  ctx.lineTo(x + 4 * s, y + 14 * s);
  ctx.closePath();
  ctx.fill();
}

function drawDrake(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number, isStumble: boolean) {
  const s = size / 40;
  const legOffset = isStumble ? 0 : Math.sin(frame * 0.4) * 5 * s;
  const bodyColor = "#44aa33";
  const wingColor = "#338822";

  // Body
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x + 20 * s, y + 12 * s, 16 * s, 14 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // Belly
  ctx.fillStyle = "#88dd66";
  ctx.beginPath();
  ctx.ellipse(x + 24 * s, y + 16 * s, 10 * s, 9 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x + 36 * s, y - 2 * s, 11 * s, 10 * s, 0.15, 0, Math.PI * 2);
  ctx.fill();
  // Snout
  ctx.fillStyle = "#3d9930";
  ctx.fillRect(x + 42 * s, y - 4 * s, 8 * s, 6 * s);
  // Eye
  if (isStumble) {
    ctx.fillStyle = "#ff0000";
    ctx.font = `${8 * s}px monospace`;
    ctx.fillText("×", x + 38 * s, y + 1 * s);
  } else {
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(x + 38 * s, y - 4 * s, 5 * s, 5 * s);
    ctx.fillStyle = "#111";
    ctx.fillRect(x + 40 * s, y - 3 * s, 2 * s, 3 * s);
  }
  // Wings (small)
  ctx.fillStyle = wingColor;
  ctx.beginPath();
  ctx.moveTo(x + 10 * s, y + 4 * s);
  ctx.lineTo(x - 2 * s, y - 14 * s);
  ctx.lineTo(x + 6 * s, y - 6 * s);
  ctx.lineTo(x + 18 * s, y);
  ctx.closePath();
  ctx.fill();
  // Legs
  ctx.fillStyle = bodyColor;
  ctx.fillRect(x + 10 * s, y + 24 * s, 6 * s, 12 * s + legOffset);
  ctx.fillRect(x + 26 * s, y + 24 * s, 6 * s, 12 * s - legOffset);
  // Tail
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(x + 4 * s, y + 16 * s);
  ctx.quadraticCurveTo(x - 12 * s, y + 8 * s, x - 10 * s, y);
  ctx.lineTo(x + 2 * s, y + 10 * s);
  ctx.closePath();
  ctx.fill();
  // Smoke puff
  if (!isStumble) {
    drawSmoke(ctx, x + 50 * s, y - 4 * s, frame, s);
  }
}

function drawYoungDragon(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number, isStumble: boolean) {
  const s = size / 40;
  const legOffset = isStumble ? 0 : Math.sin(frame * 0.4) * 5 * s;
  const bodyColor = "#2288cc";
  const wingColor = "#1166aa";

  // Body (larger)
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x + 20 * s, y + 10 * s, 18 * s, 16 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // Belly
  ctx.fillStyle = "#66bbee";
  ctx.beginPath();
  ctx.ellipse(x + 24 * s, y + 14 * s, 11 * s, 10 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x + 38 * s, y - 6 * s, 12 * s, 10 * s, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Horns
  ctx.fillStyle = "#ddc060";
  ctx.beginPath();
  ctx.moveTo(x + 34 * s, y - 14 * s);
  ctx.lineTo(x + 30 * s, y - 24 * s);
  ctx.lineTo(x + 36 * s, y - 16 * s);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 40 * s, y - 14 * s);
  ctx.lineTo(x + 38 * s, y - 22 * s);
  ctx.lineTo(x + 42 * s, y - 15 * s);
  ctx.closePath();
  ctx.fill();
  // Eye
  if (!isStumble) {
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(x + 42 * s, y - 9 * s, 5 * s, 5 * s);
    ctx.fillStyle = "#111";
    ctx.fillRect(x + 44 * s, y - 8 * s, 2 * s, 3 * s);
  } else {
    ctx.fillStyle = "#ff0000";
    ctx.font = `${8 * s}px monospace`;
    ctx.fillText("×", x + 42 * s, y - 4 * s);
  }
  // Wings (spread)
  const wingFlap = Math.sin(frame * 0.15) * 6 * s;
  ctx.fillStyle = wingColor;
  ctx.beginPath();
  ctx.moveTo(x + 8 * s, y + 2 * s);
  ctx.lineTo(x - 14 * s, y - 24 * s + wingFlap);
  ctx.lineTo(x - 4 * s, y - 10 * s + wingFlap);
  ctx.lineTo(x + 6 * s, y - 16 * s + wingFlap);
  ctx.lineTo(x + 18 * s, y - 2 * s);
  ctx.closePath();
  ctx.fill();
  // Legs
  ctx.fillStyle = bodyColor;
  ctx.fillRect(x + 10 * s, y + 24 * s, 7 * s, 12 * s + legOffset);
  ctx.fillRect(x + 26 * s, y + 24 * s, 7 * s, 12 * s - legOffset);
  // Tail
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(x + 2 * s, y + 14 * s);
  ctx.quadraticCurveTo(x - 16 * s, y + 4 * s, x - 14 * s, y - 6 * s);
  ctx.lineTo(x, y + 6 * s);
  ctx.closePath();
  ctx.fill();
  // Smoke
  if (!isStumble) {
    drawSmoke(ctx, x + 52 * s, y - 8 * s, frame, s);
  }
}

function drawFireDrakeSprite(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number, isStumble: boolean) {
  const s = size / 40;
  const legOffset = isStumble ? 0 : Math.sin(frame * 0.4) * 5 * s;
  const bodyColor = "#cc4422";
  const wingColor = "#992211";

  // Body
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x + 20 * s, y + 8 * s, 20 * s, 16 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // Belly
  ctx.fillStyle = "#ff8844";
  ctx.beginPath();
  ctx.ellipse(x + 24 * s, y + 12 * s, 12 * s, 10 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // Ember glow
  ctx.fillStyle = "rgba(255, 100, 30, 0.15)";
  ctx.beginPath();
  ctx.ellipse(x + 20 * s, y + 8 * s, 24 * s, 20 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x + 40 * s, y - 8 * s, 13 * s, 11 * s, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Horns
  ctx.fillStyle = "#dda030";
  ctx.beginPath();
  ctx.moveTo(x + 36 * s, y - 18 * s);
  ctx.lineTo(x + 32 * s, y - 30 * s);
  ctx.lineTo(x + 38 * s, y - 20 * s);
  ctx.closePath();
  ctx.fill();
  // Eye
  if (!isStumble) {
    ctx.fillStyle = "#ffdd00";
    ctx.fillRect(x + 44 * s, y - 12 * s, 6 * s, 5 * s);
    ctx.fillStyle = "#111";
    ctx.fillRect(x + 47 * s, y - 11 * s, 2 * s, 3 * s);
  }
  // Wings
  const wingFlap = Math.sin(frame * 0.15) * 8 * s;
  ctx.fillStyle = wingColor;
  ctx.beginPath();
  ctx.moveTo(x + 6 * s, y);
  ctx.lineTo(x - 20 * s, y - 30 * s + wingFlap);
  ctx.lineTo(x - 8 * s, y - 14 * s + wingFlap);
  ctx.lineTo(x + 2 * s, y - 22 * s + wingFlap);
  ctx.lineTo(x + 16 * s, y - 4 * s);
  ctx.closePath();
  ctx.fill();
  // Legs
  ctx.fillStyle = bodyColor;
  ctx.fillRect(x + 10 * s, y + 22 * s, 8 * s, 14 * s + legOffset);
  ctx.fillRect(x + 26 * s, y + 22 * s, 8 * s, 14 * s - legOffset);
  // Fire breath
  if (!isStumble) {
    drawFireBreath(ctx, x + 54 * s, y - 10 * s, frame, s);
  }
}

function drawElderDragon(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number, isStumble: boolean) {
  // Reuse FireDrake body with purple/gold coloring and larger wings
  const s = size / 40;
  const legOffset = isStumble ? 0 : Math.sin(frame * 0.4) * 5 * s;
  const bodyColor = "#6633aa";
  const wingColor = "#4422aa";

  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x + 20 * s, y + 6 * s, 22 * s, 18 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#9966dd";
  ctx.beginPath();
  ctx.ellipse(x + 24 * s, y + 10 * s, 13 * s, 11 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x + 42 * s, y - 10 * s, 14 * s, 12 * s, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Crown horns
  ctx.fillStyle = "#ffd700";
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(x + (34 + i * 4) * s, y - 20 * s);
    ctx.lineTo(x + (32 + i * 4) * s, y - 32 * s - i * 2 * s);
    ctx.lineTo(x + (36 + i * 4) * s, y - 22 * s);
    ctx.closePath();
    ctx.fill();
  }
  // Eye
  if (!isStumble) {
    ctx.fillStyle = "#ff4444";
    ctx.fillRect(x + 48 * s, y - 14 * s, 6 * s, 5 * s);
    ctx.fillStyle = "#ffdd00";
    ctx.fillRect(x + 50 * s, y - 13 * s, 2 * s, 3 * s);
  }
  // Wings (large)
  const wingFlap = Math.sin(frame * 0.12) * 10 * s;
  ctx.fillStyle = wingColor;
  ctx.beginPath();
  ctx.moveTo(x + 4 * s, y - 2 * s);
  ctx.lineTo(x - 26 * s, y - 36 * s + wingFlap);
  ctx.lineTo(x - 12 * s, y - 18 * s + wingFlap);
  ctx.lineTo(x, y - 28 * s + wingFlap);
  ctx.lineTo(x + 10 * s, y - 14 * s + wingFlap);
  ctx.lineTo(x + 18 * s, y - 6 * s);
  ctx.closePath();
  ctx.fill();
  // Legs
  ctx.fillStyle = bodyColor;
  ctx.fillRect(x + 8 * s, y + 22 * s, 8 * s, 14 * s + legOffset);
  ctx.fillRect(x + 26 * s, y + 22 * s, 8 * s, 14 * s - legOffset);
  // Fire
  if (!isStumble) {
    drawFireBreath(ctx, x + 56 * s, y - 12 * s, frame, s * 1.3);
  }
}

function drawInfernoDragon(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number, isStumble: boolean) {
  // Epic final form — dark body with fire effects everywhere
  const s = size / 40;
  const legOffset = isStumble ? 0 : Math.sin(frame * 0.4) * 5 * s;

  // Aura
  ctx.fillStyle = `rgba(255, 60, 20, ${0.06 + Math.sin(frame * 0.1) * 0.03})`;
  ctx.beginPath();
  ctx.ellipse(x + 20 * s, y + 6 * s, 34 * s, 28 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  const bodyColor = "#1a1a2e";
  const wingColor = "#0d0d1a";

  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x + 20 * s, y + 6 * s, 22 * s, 18 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // Lava veins
  ctx.strokeStyle = "#ff4400";
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(x + 6 * s, y + 10 * s);
  ctx.quadraticCurveTo(x + 16 * s, y + 2 * s, x + 30 * s, y + 8 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 10 * s, y + 16 * s);
  ctx.quadraticCurveTo(x + 20 * s, y + 12 * s, x + 34 * s, y + 14 * s);
  ctx.stroke();
  // Head
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x + 42 * s, y - 10 * s, 14 * s, 12 * s, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Flame crown
  ctx.fillStyle = "#ffd700";
  for (let i = 0; i < 4; i++) {
    const flicker = Math.sin(frame * 0.3 + i) * 3 * s;
    ctx.beginPath();
    ctx.moveTo(x + (32 + i * 4) * s, y - 20 * s);
    ctx.lineTo(x + (30 + i * 4) * s, y - 36 * s - flicker);
    ctx.lineTo(x + (34 + i * 4) * s, y - 22 * s);
    ctx.closePath();
    ctx.fill();
  }
  // Eye (glowing)
  if (!isStumble) {
    ctx.fillStyle = "#ff2200";
    ctx.shadowColor = "#ff4400";
    ctx.shadowBlur = 6 * s;
    ctx.fillRect(x + 48 * s, y - 14 * s, 6 * s, 5 * s);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffff00";
    ctx.fillRect(x + 50 * s, y - 13 * s, 2 * s, 3 * s);
  }
  // Wings (massive)
  const wingFlap = Math.sin(frame * 0.1) * 12 * s;
  ctx.fillStyle = wingColor;
  ctx.beginPath();
  ctx.moveTo(x + 2 * s, y - 4 * s);
  ctx.lineTo(x - 30 * s, y - 40 * s + wingFlap);
  ctx.lineTo(x - 16 * s, y - 20 * s + wingFlap);
  ctx.lineTo(x - 4 * s, y - 32 * s + wingFlap);
  ctx.lineTo(x + 8 * s, y - 16 * s + wingFlap);
  ctx.lineTo(x + 16 * s, y - 24 * s + wingFlap);
  ctx.lineTo(x + 20 * s, y - 8 * s);
  ctx.closePath();
  ctx.fill();
  // Wing membrane glow
  ctx.fillStyle = "rgba(255, 68, 0, 0.15)";
  ctx.fill();
  // Legs
  ctx.fillStyle = bodyColor;
  ctx.fillRect(x + 8 * s, y + 22 * s, 8 * s, 14 * s + legOffset);
  ctx.fillRect(x + 26 * s, y + 22 * s, 8 * s, 14 * s - legOffset);
  // Massive fire breath
  if (!isStumble) {
    drawFireBreath(ctx, x + 56 * s, y - 12 * s, frame, s * 1.8);
    drawFireParticles(ctx, x + 20 * s, y - 20 * s, frame);
  }
}

// === Effect helpers ===

function drawSmoke(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, s: number) {
  for (let i = 0; i < 3; i++) {
    const age = (frame + i * 10) % 25;
    const px = x + Math.sin((frame + i * 5) * 0.2) * 3 * s;
    const py = y - age * 1.2 * s;
    const size = (3 + age * 0.3) * s;
    const alpha = Math.max(0, 0.3 - age / 25);
    ctx.fillStyle = `rgba(180, 180, 200, ${alpha})`;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFireBreath(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, s: number) {
  for (let i = 0; i < 6; i++) {
    const age = (frame + i * 5) % 18;
    const px = x + age * 2 * s + Math.sin((frame + i * 3) * 0.4) * 2 * s;
    const py = y + Math.sin((frame + i * 4) * 0.3) * 3 * s;
    const size = Math.max(1, (5 - age * 0.25) * s);
    const alpha = Math.max(0, 1 - age / 18);
    ctx.fillStyle = i % 3 === 0
      ? `rgba(255, 220, 50, ${alpha})`
      : i % 3 === 1
        ? `rgba(255, 107, 53, ${alpha})`
        : `rgba(255, 50, 20, ${alpha})`;
    ctx.fillRect(px, py, size, size);
  }
}

function drawPathText(
  ctx: CanvasRenderingContext2D,
  text: string,
  currentIndex: number,
  W: number,
  groundY: number,
  biome: Biome
) {
  const upcoming = text.slice(currentIndex, currentIndex + 40);
  const fontSize = Math.max(12, Math.min(16, W * 0.014));
  ctx.font = `${fontSize}px "Press Start 2P", monospace`;
  ctx.fillStyle = biome.textColor;
  ctx.shadowColor = biome.textGlow;
  ctx.shadowBlur = 8;

  let drawX = W * 0.25;
  const charSpacing = fontSize * 1.15;
  for (let i = 0; i < upcoming.length && drawX < W - 20; i++) {
    const floatY = groundY - 20 + Math.sin((i + currentIndex) * 0.5) * 4;
    ctx.fillText(upcoming[i], drawX, floatY);
    drawX += charSpacing;
  }
  ctx.shadowBlur = 0;
}

function drawFireParticles(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  for (let i = 0; i < 5; i++) {
    const age = (frame + i * 7) % 20;
    const px = x + Math.sin((frame + i * 3) * 0.3) * 4;
    const py = y - age * 1.5;
    const size = Math.max(1, 4 - age * 0.2);
    const alpha = Math.max(0, 1 - age / 20);

    ctx.fillStyle =
      i % 2 === 0
        ? `rgba(255, 107, 53, ${alpha})`
        : `rgba(255, 200, 50, ${alpha})`;
    ctx.fillRect(px, py, size, size);
  }
}
