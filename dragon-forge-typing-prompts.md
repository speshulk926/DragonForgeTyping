# Claude Code Prompt — Dragon Forge Typing

Use this as your initial prompt in Claude Code. Make sure the `dragon-forge-typing-spec.md` file is in the same directory or reference its path.

---

## Prompt

```
Read the file `dragon-forge-typing-spec.md` in this directory. It contains the complete specification for Dragon Forge Typing, a dragon-themed typing tutor for kids.

Start with Phase 1 — Foundation. Specifically:

1. Scaffold the solution structure:
   - ASP.NET Core 10 WebAPI project (`Dragon Forge Typing.Api`) 
   - React + TypeScript + Vite frontend (`dragonforge-client`)
   - Docker-compose with PostgreSQL
   - Solution file at root

2. Set up the database layer:
   - EF Core with Npgsql
   - `LevelDefinition` entity with seed data for the first 15 levels (home row, top row, bottom row, mixed letters, caps, numbers, punctuation — see spec for details)
   - Seed the level prompt texts with actual content (real letter sequences, not placeholder text)

3. Build the typing game engine in React:
   - Hidden input for keystroke capture (onKeyDown, not onChange)
   - Real-time accuracy tracking and WPM calculation
   - Hearts system (20 hearts, lose 1 per mistake)
   - Level complete screen showing accuracy %, WPM, points awarded, hearts remaining
   - Scoring: 100% = 1.5x bonus, 90-99% = base, 70-89% = half, below 70% = 0 points

4. Build the side-scrolling runner:
   - Parallax scrolling background (at least 2 layers)
   - Character that moves forward on correct keystrokes
   - Stumble animation on incorrect keystrokes  
   - Retro pixel-art aesthetic — use Press Start 2P font for game UI
   - Text to type appears on the path ahead of the character
   - Start with a simple placeholder sprite (colored rectangle is fine for now)

5. Simple local-only mode:
   - "Enter your name" screen (no auth yet)
   - Level select showing completed/locked levels
   - Progress saved to localStorage for now (we'll add the API in Phase 2)

Do not build auth, the parent dashboard, or the evolution system yet. Focus on making the core typing game playable and fun. The game should be playable end-to-end for the first 15 levels with real content.
```

---

## Follow-up Prompts (for subsequent phases)

### Phase 2 — Auth & Persistence
```
Continue building Dragon Forge Typing. Reference `dragon-forge-typing-spec.md` for full details. Now implement Phase 2:

1. ASP.NET Identity for parent accounts (email/password + JWT)
2. Child profile CRUD endpoints
3. Child OTP login system — parent generates a 6-digit code, child enters it, gets a 30-day session token stored in localStorage
4. LevelAttempt entity — save attempt results to PostgreSQL after each level
5. Replace localStorage progress with API calls
6. Wire up the React frontend to use the real API (create an API client service)

Keep the game itself unchanged — just add persistence behind it.
```

### Phase 3 — Dragon Evolution
```
Continue building Dragon Forge Typing. Reference `dragon-forge-typing-spec.md` for full details. Now implement Phase 3:

1. EvolutionService — state machine that checks evolution criteria after each level completion
2. Evolution stages: Egg → Hatchling (500pts) → Drake (20wpm) → Young Dragon (30wpm) → Fire Drake (50wpm) → Elder Dragon (70wpm) → Inferno Dragon (90wpm). Post-hatch stages require 95% accuracy sustained over 5 consecutive attempts.
3. Swap the game character sprite based on current evolution stage (create simple pixel-art placeholder sprites for each — even colored shapes with labels work for now)
4. Evolution celebration screen with animation when the player reaches a new stage
5. Add evolution progress indicator to the game HUD
6. Seed levels 16-30 (word-based levels per the spec)
```

### Phase 4 — Parent Dashboard
```
Continue building Dragon Forge Typing. Reference `dragon-forge-typing-spec.md` for full details. Now implement Phase 4:

1. Parent dashboard — mobile-friendly responsive layout
2. Child overview cards showing: dragon stage visual, total points, current level, last played
3. Detailed child view: WPM trend line chart, accuracy trend chart, level history table
4. Session management — list active child device sessions with revoke ability
5. Generate OTP codes from the dashboard
6. Use Recharts for the charts
7. Keep it clean and data-focused — dragon themed but professional
```
