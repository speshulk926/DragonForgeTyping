# Dragon Forge Typing — Project Specification

## Overview

Dragon Forge Typing is a dragon-themed typing tutor web application for kids. Players start as an egg and evolve into a fire-breathing dragon as they improve their typing skills. The game uses a 2D side-scrolling runner mechanic where typing correctly moves the character forward through levels.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | ASP.NET Core 10 WebAPI (C#) |
| Frontend (Game) | React + TypeScript with HTML5 Canvas (or Phaser.js for the 2D runner) |
| Frontend (Parent Dashboard) | React + TypeScript, mobile-friendly responsive design |
| Database | PostgreSQL (local for dev, cloud later) |
| ORM | Entity Framework Core with Npgsql provider |
| Auth | ASP.NET Identity with JWT tokens (parent accounts) + one-time passcode system for kids |
| Styling | Tailwind CSS for UI chrome; pixel-art/retro aesthetic for the game canvas |

---

## Core Concept — The Dragon Evolution

The player begins as an **egg** and evolves through dragon growth stages as they accumulate points and demonstrate typing proficiency.

### Evolution Stages

| Stage | Visual | Unlock Criteria |
|-------|--------|----------------|
| Egg (carried by a runner) | A character running while cradling an egg | Starting state |
| Hatchling | Tiny baby dragon running | Accumulate 500 total points |
| Drake | Medium dragon, small wings | Sustain 20 WPM at 95% accuracy over 5 consecutive attempts |
| Young Dragon | Larger dragon, wings spread, smoke puffs | Sustain 30 WPM at 95% accuracy over 5 consecutive attempts |
| Fire Drake | Large dragon, glowing embers | Sustain 50 WPM at 95% accuracy over 5 consecutive attempts |
| Elder Dragon | Massive fire-breathing dragon, full wingspan | Sustain 70 WPM at 95% accuracy over 5 consecutive attempts |
| Inferno Dragon | Final form — epic flames, screen effects | Sustain 90+ WPM at 95% accuracy over 5 consecutive attempts |

> **Note:** "5 consecutive attempts" means the last 5 completed levels must ALL meet the WPM + accuracy threshold. Failing one resets the counter for that evolution stage.

---

## Game Mechanics

### Side-Scrolling Runner

- The screen scrolls left-to-right as the player types.
- Text to type appears on the "path" ahead of the character (like road signs, floating stones, banners, etc.).
- Each **correct keystroke** moves the character forward with a smooth running/flying animation.
- Each **incorrect keystroke** causes the character to stumble (brief animation) and costs **1 heart**.
- The level ends when the player reaches the end of the scrolling path (all text typed).

### Hearts System

- Each level starts with **20 hearts** (displayed as dragon heart icons at the top).
- A wrong keystroke = lose 1 heart.
- If hearts reach 0, the level **fails** and must be retried.
- Hearts remaining at the end factor into bonus scoring.

### Scoring System

| Accuracy | Points Awarded | Bonus |
|----------|---------------|-------|
| 100% | Full points + bonus multiplier (1.5x) | "Perfect Forge!" badge |
| 90–99% | Full base points | None |
| 70–89% | Half points | None |
| Below 70% | 0 points (level still completable) | None |

Base points per level scale with difficulty — early letter-only levels award fewer points than sentence levels.

**Suggested base point scale:**
- Home row / single key levels: 10 pts base
- Mixed letter levels: 15 pts base
- 2–3 letter words: 25 pts base
- 4–5 letter words: 35 pts base
- Short sentences: 50 pts base
- Full sentences: 75 pts base
- Paragraph levels (endgame): 100 pts base

### WPM Tracking

- WPM is calculated per-level: `(characters typed / 5) / minutes elapsed`
- Only count characters after the first keystroke (don't penalize reaction time).
- Store WPM per attempt for evolution gating and parent dashboard analytics.

---

## Level Progression

Levels are predefined and sequential. A player must complete a level (even with 0 points) to unlock the next one.

### Level Curriculum

**Phase 1 — The Egg Arc (Levels 1–15ish)**
Focus: Individual keys, building muscle memory.

1. Home row left hand: `a s d f`
2. Home row right hand: `j k l ;`
3. Home row full: `a s d f j k l ;`
4. Home row with `g h`: all home row keys
5. Top row left: `q w e r t`
6. Top row right: `y u i o p`
7. Top row full
8. Home + top row mixed
9. Bottom row left: `z x c v b`
10. Bottom row right: `n m , . /`
11. Bottom row full
12. All three rows mixed — random letters
13. Capital letters introduced (shift key)
14. Numbers row
15. Common punctuation: `. , ! ? ' "`

**Phase 2 — Hatchling Arc (Levels 16–30ish)**
Focus: Words, building fluency.

16. 2-letter words (`to`, `is`, `an`, `it`, `on`, etc.)
17. 3-letter words (`the`, `and`, `for`, `cat`, `dog`, etc.)
18. 4-letter words
19. 5-letter words
20. Mixed short words (2–4 letters)
21. Mixed medium words (4–6 letters)
22. Common sight words
23. Simple two-word combos (`the cat`, `a dog`)
24. Three-word phrases
25. Four-word phrases
26. Short sentences (3–5 words, no caps/punctuation yet)
27. Short sentences with capitalization
28. Short sentences with periods
29. Short sentences with mixed punctuation
30. Medium sentences (6–10 words)

**Phase 3 — Drake Arc and Beyond (Levels 31+)**
Focus: Fluency, speed, real-world text.

31–40. Progressively longer sentences
41–50. Short paragraphs (2–3 sentences)
51+. Longer paragraphs, mixed content, dragon lore snippets

> **Content note:** Build a `LevelContent` seed system so level text can be easily added/modified. Store level definitions in the database or as JSON seed files. Each level has: `levelNumber`, `title`, `description`, `promptTexts` (array of strings to type), `basePoints`, `phase`.

---

## Authentication & User Management

### Parent Accounts

- Standard email/password registration via ASP.NET Identity.
- JWT token auth for API access.
- Must be 13+ (or parent) to create an account.
- Can create/manage multiple child profiles.

### Child Profiles (NOT full accounts)

- A parent creates a child profile: `displayName`, optional `avatarChoice`.
- To log in, the child uses a **one-time passcode** (OTP) system:
  - Parent navigates to "Kid Login" in their dashboard and clicks "Generate Login Code" for a child.
  - A 6-digit numeric code is generated, valid for 5 minutes.
  - The child enters the code on the login screen — no email, no password.
  - On success, the child's browser receives a **long-lived session token** (30-day expiry, stored in localStorage) so they don't have to log in again on that device.
  - Parent dashboard shows which devices have active sessions and can revoke them.

### Data Model (Core Entities)

```
Parent
├── Id (GUID)
├── Email
├── PasswordHash (ASP.NET Identity)
├── DisplayName
└── CreatedAt

ChildProfile
├── Id (GUID)
├── ParentId (FK → Parent)
├── DisplayName
├── AvatarChoice
├── CurrentStage (enum: Egg, Hatchling, Drake, YoungDragon, FireDrake, ElderDragon, InfernoDragon)
├── TotalPoints
├── HighestLevelCompleted
├── CreatedAt
└── UpdatedAt

LevelDefinition
├── Id
├── LevelNumber
├── Title
├── Description
├── Phase (enum: Egg, Hatchling, Drake, Beyond)
├── PromptTexts (jsonb — array of strings)
├── BasePoints
└── MinWpmForBonus (nullable, used in later levels)

LevelAttempt
├── Id (GUID)
├── ChildProfileId (FK → ChildProfile)
├── LevelDefinitionId (FK → LevelDefinition)
├── StartedAt
├── CompletedAt
├── WPM (decimal)
├── Accuracy (decimal, 0-100)
├── HeartsRemaining (int)
├── PointsAwarded (int)
├── Passed (bool)
└── KeystrokeLog (jsonb — optional, for detailed analytics later)

DeviceSession
├── Id (GUID)
├── ChildProfileId (FK → ChildProfile)
├── TokenHash
├── DeviceName (user-agent derived)
├── CreatedAt
├── ExpiresAt
├── RevokedAt (nullable)
```

---

## Parent Dashboard

Mobile-friendly responsive design. Accessible after parent login.

### Features

- **Child Overview Cards**: Each child shows current dragon stage (with visual), total points, current level, last played date.
- **Detailed Child View**:
  - Dragon evolution progress bar (visual — shows current stage and how close to next)
  - WPM trend chart (line graph over last 30 attempts)
  - Accuracy trend chart
  - Level completion history (table: level name, date, WPM, accuracy, points, hearts remaining)
  - Time spent practicing (derived from attempt timestamps)
- **Child Management**: Add child, edit display name, generate login codes, view/revoke active sessions.
- **No gamification on the parent side** — keep it clean, informational, data-focused.

---

## Visual & Aesthetic Direction

### Game Aesthetic: Retro Pixel Art Side-Scroller

- **Art style**: 16-bit pixel art (think SNES-era platformers). Sprite-based characters and backgrounds.
- **Color palette**: Rich, warm fantasy colors — deep greens, oranges, golds, dark purples for backgrounds. Fire effects in bright orange/yellow/red.
- **Scrolling backgrounds**: Parallax layers — distant mountains/castles, midground trees/ruins, foreground path where the character runs.
- **Character sprites**: Can be simple — 3-4 frame run animations per stage. The egg stage has a hooded adventurer carrying an egg. Post-hatch stages show progressively larger dragons.
- **UI chrome**: Styled like a retro game HUD — hearts in top-left, score in top-right, level name centered, typing prompt in a stylized text box at the bottom third of the screen.
- **Fonts**: Use a pixel/retro font for game UI (like Press Start 2P from Google Fonts) and a clean readable font for the typing prompts (kids need to clearly distinguish letters).

### Parent Dashboard Aesthetic

- Clean, modern, mobile-first.
- Dragon-themed but professional — subtle scale textures, warm color accents, dragon iconography in headers.
- Responsive: works on phone screens for quick check-ins.

---

## API Endpoints (Suggested Structure)

```
POST   /api/auth/register          — Parent registration
POST   /api/auth/login             — Parent login (returns JWT)
POST   /api/auth/child-code        — Generate OTP for child (parent auth required)
POST   /api/auth/child-login       — Child OTP login (returns session token)
POST   /api/auth/child-logout      — Revoke child session

GET    /api/children                — List parent's children (parent auth)
POST   /api/children                — Create child profile (parent auth)
PUT    /api/children/{id}           — Update child profile (parent auth)
GET    /api/children/{id}/progress  — Child progress summary (parent auth)
GET    /api/children/{id}/attempts  — Level attempt history (parent auth)

GET    /api/levels                  — List all level definitions
GET    /api/levels/{id}             — Get level detail + prompt texts

GET    /api/game/profile            — Get child's game profile (child auth)
GET    /api/game/current-level      — Get next level to play (child auth)
POST   /api/game/attempt            — Submit level attempt results (child auth)
GET    /api/game/evolution          — Get evolution status + progress to next stage (child auth)
```

---

## Project Structure

```
dragon-forge-typing/
├── src/
│   ├── DragonForge.Api/              — ASP.NET Core WebAPI project
│   │   ├── Controllers/
│   │   ├── Models/
│   │   │   ├── Entities/             — EF Core entities
│   │   │   └── DTOs/                 — Request/response DTOs
│   │   ├── Services/
│   │   │   ├── AuthService.cs
│   │   │   ├── GameService.cs
│   │   │   ├── EvolutionService.cs
│   │   │   └── LevelService.cs
│   │   ├── Data/
│   │   │   ├── AppDbContext.cs
│   │   │   ├── Migrations/
│   │   │   └── Seed/
│   │   │       └── LevelSeedData.json
│   │   ├── Middleware/
│   │   ├── Program.cs
│   │   └── appsettings.json
│   │
│   └── dragonforge-client/           — React + TypeScript frontend
│       ├── src/
│       │   ├── components/
│       │   │   ├── game/             — Game canvas, HUD, typing input
│       │   │   ├── auth/             — Login screens
│       │   │   ├── parent/           — Dashboard components
│       │   │   └── shared/           — Common UI components
│       │   ├── hooks/
│       │   ├── services/             — API client
│       │   ├── assets/
│       │   │   ├── sprites/          — Character sprite sheets
│       │   │   ├── backgrounds/      — Parallax background layers
│       │   │   └── fonts/
│       │   ├── types/
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── public/
│       ├── package.json
│       ├── tsconfig.json
│       ├── tailwind.config.js
│       └── vite.config.ts
│
├── docker-compose.yml                — PostgreSQL + API for local dev
├── README.md
└── DragonForgeTyping.sln
```

---

## Development Phases

Build in this order so the game is playable at each milestone:

### Phase 1 — Foundation (Get a playable prototype)
1. Scaffold ASP.NET Core API + React app + PostgreSQL via docker-compose.
2. Implement `LevelDefinition` entity + seed data for first 15 levels (Phase 1 curriculum).
3. Build the core typing game engine in React:
   - Text prompt rendering
   - Keystroke capture + validation
   - WPM + accuracy calculation
   - Hearts system
   - Level pass/fail logic
4. Simple side-scrolling background (parallax CSS or canvas) with a placeholder character sprite that moves on correct keystrokes.
5. No auth yet — just a "pick your name" screen for local testing.

### Phase 2 — Auth & Persistence
6. Parent registration + login (ASP.NET Identity + JWT).
7. Child profile CRUD.
8. Child OTP login system + long-lived session tokens.
9. Wire up `LevelAttempt` storage — save results after each level.
10. Track `HighestLevelCompleted` and `TotalPoints` on child profile.

### Phase 3 — Dragon Evolution
11. Implement evolution state machine in `EvolutionService`.
12. Create/source pixel art sprites for each dragon stage (or use placeholder colored shapes initially).
13. Swap character sprite based on current evolution stage.
14. Add evolution celebration screen when player levels up.

### Phase 4 — Parent Dashboard
15. Child overview cards with dragon stage visuals.
16. WPM + accuracy charts (use Recharts or Chart.js).
17. Level history table.
18. Session management (view/revoke child device sessions).

### Phase 5 — Polish & Content
19. Add remaining levels (Phase 2 + 3 curriculum, levels 16–50+).
20. Parallax background improvements — different biomes per phase (forest → mountains → volcanic → sky castle).
21. Sound effects (optional, with mute toggle).
22. "Perfect Hatch" badge animations.
23. Leaderboard between siblings (optional fun feature).

---

## Local Development Setup

### Prerequisites
- .NET 10 SDK
- Node.js 20+
- PostgreSQL (local instance)
- Docker (optional, for containerized PostgreSQL)

### Database Connection
Configure in `appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=dragonforge;Username=postgres;Password=postgres"
  },
  "Jwt": {
    "Secret": "dev-secret-key-change-in-production-minimum-32-chars!!",
    "Issuer": "DragonForgeTyping",
    "Audience": "DragonForgeTyping",
    "ExpirationInMinutes": 1440
  }
}
```

### Startup
```bash
# Terminal 1 — API
cd src/DragonForge.Api
dotnet ef database update
dotnet run

# Terminal 2 — Frontend
cd src/dragonforge-client
npm install
npm run dev
```

---

## Key Implementation Notes

- **Typing input**: Use a hidden `<input>` element that stays focused during gameplay. Capture `onKeyDown` events for real-time keystroke processing. Do NOT use `onChange` — you need per-key granularity.
- **Side-scroll movement**: Tie character X-position to `(correctKeystrokes / totalKeystrokes) * levelWidth`. Smooth with CSS transitions or requestAnimationFrame.
- **Sprite animation**: Use CSS sprite sheets with `background-position` stepping, or a lightweight canvas renderer. Phaser.js is an option if canvas complexity grows, but start simple.
- **Hearts display**: Animate heart loss (shake + fade) on incorrect keystroke for satisfying feedback.
- **Evolution checks**: Run evolution eligibility check after each level completion, not in real-time. Query the last 5 `LevelAttempt` records for the child.
- **Content safety**: All typing content is predefined and seed-loaded. No user-generated content in typing prompts.
