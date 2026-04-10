import type { EvolutionStage } from "../types/game";

/**
 * Draw a standalone egg (no runner) centered at (cx, cy) with the given radius.
 * cracks: 0-4
 */
export function drawStandaloneEgg(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  radius: number,
  cracks: number
) {
  const rx = radius * 0.7;
  const ry = radius;

  // Shell
  ctx.fillStyle = "#f5e6ca";
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();

  // Inner glow — warmer with more cracks
  const glowAlpha = 0.08 + cracks * 0.07;
  ctx.fillStyle = `rgba(255, 107, 53, ${glowAlpha})`;
  ctx.beginPath();
  ctx.ellipse(cx, cy + ry * 0.1, rx * 0.75, ry * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cracks
  const s = radius / 22;
  if (cracks >= 1) drawCrack(ctx, cx, cy, s, -5, -7, 8, 12);
  if (cracks >= 2) drawCrack(ctx, cx, cy, s, 4, -10, -6, 9);
  if (cracks >= 3) drawCrack(ctx, cx, cy, s, -8, 2, 9, 8);
  if (cracks >= 4) {
    drawCrack(ctx, cx, cy, s, 2, 5, -8, 6);
    // Bright glow peeking through
    ctx.fillStyle = "rgba(255, 200, 50, 0.3)";
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx * 0.4, ry * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Subtle shell outline
  ctx.strokeStyle = "rgba(139, 105, 20, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
}

function drawCrack(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, s: number,
  x1: number, y1: number, x2: number, y2: number
) {
  ctx.strokeStyle = "#8b6914";
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(cx + x1 * s, cy + y1 * s);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  ctx.lineTo(cx + (mx + 2) * s, cy + (my - 1.5) * s);
  ctx.lineTo(cx + (mx - 1.5) * s, cy + (my + 2) * s);
  ctx.lineTo(cx + x2 * s, cy + y2 * s);
  ctx.stroke();
}

/**
 * Draw a standalone dragon centered at (cx, cy) fitting within the given size.
 * frame is for animation (wings flapping, fire, etc.)
 */
export function drawStandaloneDragon(
  ctx: CanvasRenderingContext2D,
  stage: EvolutionStage,
  cx: number, cy: number,
  size: number,
  frame: number
) {
  // The dragon drawing functions draw relative to a top-left anchor with a 40-unit coordinate system.
  // Center the dragon by offsetting: the body center is roughly at (20*s, 12*s) in the coordinate system.
  const s = size / 40;
  const x = cx - 22 * s;
  const y = cy - 10 * s;

  switch (stage) {
    case "Hatchling": drawHatchlingStatic(ctx, x, y, frame, size); break;
    case "Drake": drawDrakeStatic(ctx, x, y, frame, size); break;
    case "YoungDragon": drawYoungDragonStatic(ctx, x, y, frame, size); break;
    case "FireDrake": drawFireDrakeStatic(ctx, x, y, frame, size); break;
    case "ElderDragon": drawElderDragonStatic(ctx, x, y, frame, size); break;
    case "InfernoDragon": drawInfernoDragonStatic(ctx, x, y, frame, size); break;
    default: break;
  }
}

// Static (non-running) versions of the dragon sprites — no leg animation, just idle with wings

function drawHatchlingStatic(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number) {
  const s = size / 40;
  const bodyColor = "#66cc55";

  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x + 20 * s, y + 14 * s, 14 * s, 12 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#99ee88";
  ctx.beginPath();
  ctx.ellipse(x + 22 * s, y + 16 * s, 8 * s, 8 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x + 32 * s, y + 2 * s, 10 * s, 9 * s, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x + 36 * s, y - 1 * s, 4 * s, 4 * s);
  ctx.fillStyle = "#111";
  ctx.fillRect(x + 38 * s, y, 2 * s, 2 * s);
  // Tiny wings
  const wingBob = Math.sin(frame * 0.08) * 2 * s;
  ctx.fillStyle = "#55aa44";
  ctx.beginPath();
  ctx.moveTo(x + 12 * s, y + 6 * s);
  ctx.lineTo(x + 4 * s, y - 4 * s + wingBob);
  ctx.lineTo(x + 16 * s, y + 2 * s);
  ctx.closePath();
  ctx.fill();
  // Legs
  ctx.fillStyle = bodyColor;
  ctx.fillRect(x + 12 * s, y + 24 * s, 5 * s, 8 * s);
  ctx.fillRect(x + 24 * s, y + 24 * s, 5 * s, 8 * s);
  // Tail
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(x + 6 * s, y + 18 * s);
  ctx.quadraticCurveTo(x - 6 * s, y + 12 * s, x - 4 * s, y + 6 * s);
  ctx.lineTo(x + 4 * s, y + 14 * s);
  ctx.closePath();
  ctx.fill();
}

function drawDrakeStatic(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number) {
  const s = size / 40;
  const bodyColor = "#44aa33";

  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x + 20 * s, y + 12 * s, 16 * s, 14 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#88dd66";
  ctx.beginPath();
  ctx.ellipse(x + 24 * s, y + 16 * s, 10 * s, 9 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x + 36 * s, y - 2 * s, 11 * s, 10 * s, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3d9930";
  ctx.fillRect(x + 42 * s, y - 4 * s, 8 * s, 6 * s);
  ctx.fillStyle = "#ffcc00";
  ctx.fillRect(x + 38 * s, y - 4 * s, 5 * s, 5 * s);
  ctx.fillStyle = "#111";
  ctx.fillRect(x + 40 * s, y - 3 * s, 2 * s, 3 * s);
  // Wings
  const wingFlap = Math.sin(frame * 0.08) * 4 * s;
  ctx.fillStyle = "#338822";
  ctx.beginPath();
  ctx.moveTo(x + 10 * s, y + 4 * s);
  ctx.lineTo(x - 2 * s, y - 14 * s + wingFlap);
  ctx.lineTo(x + 6 * s, y - 6 * s + wingFlap);
  ctx.lineTo(x + 18 * s, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = bodyColor;
  ctx.fillRect(x + 10 * s, y + 24 * s, 6 * s, 10 * s);
  ctx.fillRect(x + 26 * s, y + 24 * s, 6 * s, 10 * s);
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(x + 4 * s, y + 16 * s);
  ctx.quadraticCurveTo(x - 12 * s, y + 8 * s, x - 10 * s, y);
  ctx.lineTo(x + 2 * s, y + 10 * s);
  ctx.closePath();
  ctx.fill();
  drawSmokeStatic(ctx, x + 50 * s, y - 4 * s, frame, s);
}

function drawYoungDragonStatic(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number) {
  const s = size / 40;
  const bodyColor = "#2288cc";

  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x + 20 * s, y + 10 * s, 18 * s, 16 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#66bbee";
  ctx.beginPath();
  ctx.ellipse(x + 24 * s, y + 14 * s, 11 * s, 10 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x + 38 * s, y - 6 * s, 12 * s, 10 * s, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ddc060";
  ctx.beginPath(); ctx.moveTo(x + 34 * s, y - 14 * s); ctx.lineTo(x + 30 * s, y - 24 * s); ctx.lineTo(x + 36 * s, y - 16 * s); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + 40 * s, y - 14 * s); ctx.lineTo(x + 38 * s, y - 22 * s); ctx.lineTo(x + 42 * s, y - 15 * s); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#ffcc00";
  ctx.fillRect(x + 42 * s, y - 9 * s, 5 * s, 5 * s);
  ctx.fillStyle = "#111";
  ctx.fillRect(x + 44 * s, y - 8 * s, 2 * s, 3 * s);
  const wingFlap = Math.sin(frame * 0.08) * 5 * s;
  ctx.fillStyle = "#1166aa";
  ctx.beginPath();
  ctx.moveTo(x + 8 * s, y + 2 * s);
  ctx.lineTo(x - 14 * s, y - 24 * s + wingFlap);
  ctx.lineTo(x - 4 * s, y - 10 * s + wingFlap);
  ctx.lineTo(x + 6 * s, y - 16 * s + wingFlap);
  ctx.lineTo(x + 18 * s, y - 2 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = bodyColor;
  ctx.fillRect(x + 10 * s, y + 24 * s, 7 * s, 10 * s);
  ctx.fillRect(x + 26 * s, y + 24 * s, 7 * s, 10 * s);
  ctx.fillStyle = bodyColor;
  ctx.beginPath(); ctx.moveTo(x + 2 * s, y + 14 * s); ctx.quadraticCurveTo(x - 16 * s, y + 4 * s, x - 14 * s, y - 6 * s); ctx.lineTo(x, y + 6 * s); ctx.closePath(); ctx.fill();
  drawSmokeStatic(ctx, x + 52 * s, y - 8 * s, frame, s);
}

function drawFireDrakeStatic(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number) {
  const s = size / 40;
  const bodyColor = "#cc4422";

  ctx.fillStyle = "rgba(255, 100, 30, 0.12)";
  ctx.beginPath(); ctx.ellipse(x + 20 * s, y + 8 * s, 24 * s, 20 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = bodyColor;
  ctx.beginPath(); ctx.ellipse(x + 20 * s, y + 8 * s, 20 * s, 16 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#ff8844";
  ctx.beginPath(); ctx.ellipse(x + 24 * s, y + 12 * s, 12 * s, 10 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = bodyColor;
  ctx.beginPath(); ctx.ellipse(x + 40 * s, y - 8 * s, 13 * s, 11 * s, 0.1, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#dda030";
  ctx.beginPath(); ctx.moveTo(x + 36 * s, y - 18 * s); ctx.lineTo(x + 32 * s, y - 30 * s); ctx.lineTo(x + 38 * s, y - 20 * s); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#ffdd00";
  ctx.fillRect(x + 44 * s, y - 12 * s, 6 * s, 5 * s);
  ctx.fillStyle = "#111";
  ctx.fillRect(x + 47 * s, y - 11 * s, 2 * s, 3 * s);
  const wingFlap = Math.sin(frame * 0.08) * 6 * s;
  ctx.fillStyle = "#992211";
  ctx.beginPath();
  ctx.moveTo(x + 6 * s, y); ctx.lineTo(x - 20 * s, y - 30 * s + wingFlap); ctx.lineTo(x - 8 * s, y - 14 * s + wingFlap); ctx.lineTo(x + 2 * s, y - 22 * s + wingFlap); ctx.lineTo(x + 16 * s, y - 4 * s);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = bodyColor;
  ctx.fillRect(x + 10 * s, y + 22 * s, 8 * s, 12 * s);
  ctx.fillRect(x + 26 * s, y + 22 * s, 8 * s, 12 * s);
  drawFireBreathStatic(ctx, x + 54 * s, y - 10 * s, frame, s);
}

function drawElderDragonStatic(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number) {
  const s = size / 40;
  const bodyColor = "#6633aa";

  ctx.fillStyle = bodyColor;
  ctx.beginPath(); ctx.ellipse(x + 20 * s, y + 6 * s, 22 * s, 18 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#9966dd";
  ctx.beginPath(); ctx.ellipse(x + 24 * s, y + 10 * s, 13 * s, 11 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = bodyColor;
  ctx.beginPath(); ctx.ellipse(x + 42 * s, y - 10 * s, 14 * s, 12 * s, 0.1, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#ffd700";
  for (let i = 0; i < 3; i++) {
    ctx.beginPath(); ctx.moveTo(x + (34 + i * 4) * s, y - 20 * s); ctx.lineTo(x + (32 + i * 4) * s, y - 32 * s - i * 2 * s); ctx.lineTo(x + (36 + i * 4) * s, y - 22 * s); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = "#ff4444";
  ctx.fillRect(x + 48 * s, y - 14 * s, 6 * s, 5 * s);
  ctx.fillStyle = "#ffdd00";
  ctx.fillRect(x + 50 * s, y - 13 * s, 2 * s, 3 * s);
  const wingFlap = Math.sin(frame * 0.06) * 8 * s;
  ctx.fillStyle = "#4422aa";
  ctx.beginPath();
  ctx.moveTo(x + 4 * s, y - 2 * s); ctx.lineTo(x - 26 * s, y - 36 * s + wingFlap); ctx.lineTo(x - 12 * s, y - 18 * s + wingFlap); ctx.lineTo(x, y - 28 * s + wingFlap); ctx.lineTo(x + 10 * s, y - 14 * s + wingFlap); ctx.lineTo(x + 18 * s, y - 6 * s);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = bodyColor;
  ctx.fillRect(x + 8 * s, y + 22 * s, 8 * s, 12 * s);
  ctx.fillRect(x + 26 * s, y + 22 * s, 8 * s, 12 * s);
  drawFireBreathStatic(ctx, x + 56 * s, y - 12 * s, frame, s * 1.3);
}

function drawInfernoDragonStatic(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, size: number) {
  const s = size / 40;
  const bodyColor = "#1a1a2e";

  ctx.fillStyle = `rgba(255, 60, 20, ${0.06 + Math.sin(frame * 0.05) * 0.03})`;
  ctx.beginPath(); ctx.ellipse(x + 20 * s, y + 6 * s, 34 * s, 28 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = bodyColor;
  ctx.beginPath(); ctx.ellipse(x + 20 * s, y + 6 * s, 22 * s, 18 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#ff4400"; ctx.lineWidth = 1.5 * s;
  ctx.beginPath(); ctx.moveTo(x + 6 * s, y + 10 * s); ctx.quadraticCurveTo(x + 16 * s, y + 2 * s, x + 30 * s, y + 8 * s); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 10 * s, y + 16 * s); ctx.quadraticCurveTo(x + 20 * s, y + 12 * s, x + 34 * s, y + 14 * s); ctx.stroke();
  ctx.fillStyle = bodyColor;
  ctx.beginPath(); ctx.ellipse(x + 42 * s, y - 10 * s, 14 * s, 12 * s, 0.1, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#ffd700";
  for (let i = 0; i < 4; i++) {
    const flicker = Math.sin(frame * 0.15 + i) * 3 * s;
    ctx.beginPath(); ctx.moveTo(x + (32 + i * 4) * s, y - 20 * s); ctx.lineTo(x + (30 + i * 4) * s, y - 36 * s - flicker); ctx.lineTo(x + (34 + i * 4) * s, y - 22 * s); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = "#ff2200"; ctx.shadowColor = "#ff4400"; ctx.shadowBlur = 6 * s;
  ctx.fillRect(x + 48 * s, y - 14 * s, 6 * s, 5 * s);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ffff00";
  ctx.fillRect(x + 50 * s, y - 13 * s, 2 * s, 3 * s);
  const wingFlap = Math.sin(frame * 0.05) * 10 * s;
  ctx.fillStyle = "#0d0d1a";
  ctx.beginPath();
  ctx.moveTo(x + 2 * s, y - 4 * s); ctx.lineTo(x - 30 * s, y - 40 * s + wingFlap); ctx.lineTo(x - 16 * s, y - 20 * s + wingFlap); ctx.lineTo(x - 4 * s, y - 32 * s + wingFlap); ctx.lineTo(x + 8 * s, y - 16 * s + wingFlap); ctx.lineTo(x + 16 * s, y - 24 * s + wingFlap); ctx.lineTo(x + 20 * s, y - 8 * s);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = "rgba(255, 68, 0, 0.15)"; ctx.fill();
  ctx.fillStyle = bodyColor;
  ctx.fillRect(x + 8 * s, y + 22 * s, 8 * s, 12 * s);
  ctx.fillRect(x + 26 * s, y + 22 * s, 8 * s, 12 * s);
  drawFireBreathStatic(ctx, x + 56 * s, y - 12 * s, frame, s * 1.8);
}

function drawSmokeStatic(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, s: number) {
  for (let i = 0; i < 3; i++) {
    const age = (frame + i * 10) % 25;
    const px = x + Math.sin((frame + i * 5) * 0.1) * 3 * s;
    const py = y - age * 1.2 * s;
    const sz = (3 + age * 0.3) * s;
    const alpha = Math.max(0, 0.3 - age / 25);
    ctx.fillStyle = `rgba(180, 180, 200, ${alpha})`;
    ctx.beginPath(); ctx.arc(px, py, sz, 0, Math.PI * 2); ctx.fill();
  }
}

function drawFireBreathStatic(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, s: number) {
  for (let i = 0; i < 6; i++) {
    const age = (frame + i * 5) % 18;
    const px = x + age * 2 * s + Math.sin((frame + i * 3) * 0.2) * 2 * s;
    const py = y + Math.sin((frame + i * 4) * 0.15) * 3 * s;
    const sz = Math.max(1, (5 - age * 0.25) * s);
    const alpha = Math.max(0, 1 - age / 18);
    ctx.fillStyle = i % 3 === 0 ? `rgba(255, 220, 50, ${alpha})` : i % 3 === 1 ? `rgba(255, 107, 53, ${alpha})` : `rgba(255, 50, 20, ${alpha})`;
    ctx.fillRect(px, py, sz, sz);
  }
}
