import type { LevelDefinition } from "../types/game";

const LEVELS: LevelDefinition[] = [
  // === PHASE 1: EGG ARC (Levels 1-15) — Individual keys ===
  {
    id: 1, levelNumber: 1, title: "Home Row Left Hand",
    description: "Practice the left home row keys: a s d f",
    phase: "Egg", basePoints: 10, minWpmForBonus: null,
    promptTexts: [
      "aaaa ssss dddd ffff",
      "aass ddff ssdd ffaa",
      "asdf fdsa asdf fdsa",
      "afaf sdsd dfdf saas",
    ],
  },
  {
    id: 2, levelNumber: 2, title: "Home Row Right Hand",
    description: "Practice the right home row keys: j k l ;",
    phase: "Egg", basePoints: 10, minWpmForBonus: null,
    promptTexts: [
      "jjjj kkkk llll ;;;;",
      "jjkk ll;; kkjj ;;ll",
      "jkl; ;lkj jkl; ;lkj",
      "jljl k;k; jkkj l;;l",
    ],
  },
  {
    id: 3, levelNumber: 3, title: "Home Row Full",
    description: "Combine left and right home row: a s d f j k l ;",
    phase: "Egg", basePoints: 10, minWpmForBonus: null,
    promptTexts: [
      "ask all fall lads flask salad",
      "dad jak lad ask sad fall",
      "falls asks salads flasks lads",
      "a sad lad asks dad for salad",
    ],
  },
  {
    id: 4, levelNumber: 4, title: "Home Row Complete",
    description: "All home row keys including g and h",
    phase: "Egg", basePoints: 10, minWpmForBonus: null,
    promptTexts: [
      "gash hash glad flag shag half",
      "flash flags gash halls shall glass",
      "had has gal lag hag jag sag dag",
      "a glad gal shall dash half a flag",
    ],
  },
  {
    id: 5, levelNumber: 5, title: "Top Row Left",
    description: "Learn the top row left hand: q w e r t",
    phase: "Egg", basePoints: 10, minWpmForBonus: null,
    promptTexts: [
      "we wet rew tree were quest",
      "tree wet rew west were qwert",
      "we were free tree wet quest",
      "the tree grew wet where we rest",
    ],
  },
  {
    id: 6, levelNumber: 6, title: "Top Row Right",
    description: "Learn the top row right hand: y u i o p",
    phase: "Egg", basePoints: 10, minWpmForBonus: null,
    promptTexts: [
      "you your yip poi you yup",
      "pop pip you your yup poi",
      "you pour your iou yip poi",
      "you pour up yup pop poiopy",
    ],
  },
  {
    id: 7, levelNumber: 7, title: "Top Row Full",
    description: "Full top row: q w e r t y u i o p",
    phase: "Egg", basePoints: 10, minWpmForBonus: null,
    promptTexts: [
      "typewriter your power quite wire poetry",
      "write your quote type power rope",
      "quiet poetry typewriter proper routine",
      "you write poetry with power quite proper",
    ],
  },
  {
    id: 8, levelNumber: 8, title: "Home + Top Mixed",
    description: "Mix home row and top row keys together",
    phase: "Egg", basePoints: 15, minWpmForBonus: null,
    promptTexts: [
      "the quick red fish just helped sort",
      "quest for gold right where they left",
      "quite right she sold the purple silk",
      "after the quiet hike up the top ridge",
    ],
  },
  {
    id: 9, levelNumber: 9, title: "Bottom Row Left",
    description: "Learn the bottom row left hand: z x c v b",
    phase: "Egg", basePoints: 10, minWpmForBonus: null,
    promptTexts: [
      "box cab vex czar vc bx zap",
      "excavate brace cave vex box cab",
      "brave cave cab box vex czar",
      "the brave cub excavated a cave by a box",
    ],
  },
  {
    id: 10, levelNumber: 10, title: "Bottom Row Right",
    description: "Learn the bottom row right hand: n m , . /",
    phase: "Egg", basePoints: 10, minWpmForBonus: null,
    promptTexts: [
      "man men mine moon nom",
      "moon name mine noon moan man",
      "the man ran nine more moon men",
      "no man can name the moon in a mine",
    ],
  },
  {
    id: 11, levelNumber: 11, title: "Bottom Row Full",
    description: "Full bottom row: z x c v b n m , . /",
    phase: "Egg", basePoints: 10, minWpmForBonus: null,
    promptTexts: [
      "machine verb combine zone mix ban",
      "the brave zombie came back from camp",
      "a boxing van drove next to the cabin",
      "combine zinc and mix the vitamin batch",
    ],
  },
  {
    id: 12, levelNumber: 12, title: "All Rows Mixed",
    description: "Random letters from all three rows",
    phase: "Egg", basePoints: 15, minWpmForBonus: null,
    promptTexts: [
      "the quick brown fox jumps over a lazy dog",
      "pack my box with five dozen liquor jugs",
      "crazy viking joked with bad flux tempo",
      "how quickly jumping zebras vex fond dogs",
    ],
  },
  {
    id: 13, levelNumber: 13, title: "Capital Letters",
    description: "Introducing the shift key for capital letters",
    phase: "Egg", basePoints: 15, minWpmForBonus: null,
    promptTexts: [
      "The dog sat down and ate his food.",
      "Jack went up the hill to get water.",
      "Sam ran fast but Zoe was even faster.",
      "My friend Alex lives near the big park.",
    ],
  },
  {
    id: 14, levelNumber: 14, title: "Numbers Row",
    description: "Practice the number keys: 1 2 3 4 5 6 7 8 9 0",
    phase: "Egg", basePoints: 15, minWpmForBonus: null,
    promptTexts: [
      "12345 67890 13579 24680",
      "I have 3 cats and 2 dogs at home.",
      "Room 42 has 7 desks and 10 chairs.",
      "She scored 95 out of 100 on test 4.",
    ],
  },
  {
    id: 15, levelNumber: 15, title: "Common Punctuation",
    description: "Practice common punctuation in real sentences",
    phase: "Egg", basePoints: 15, minWpmForBonus: null,
    promptTexts: [
      "Hello, how are you? I'm doing fine!",
      "Wait, what? No way! That's so cool.",
      "She said, \"Let's go to the park today.\"",
      "Can you help me? Yes, I'd love to!",
    ],
  },
  // === PHASE 2: HATCHLING ARC (Levels 16-30) — Words & Phrases ===
  {
    id: 16, levelNumber: 16, title: "Two-Letter Words",
    description: "Short and sweet two-letter words",
    phase: "Hatchling", basePoints: 25, minWpmForBonus: null,
    promptTexts: [
      "to is an it on at in or we do",
      "he me be us no so up if my am",
      "go by of as ox is to an it we",
      "do me no he up at in on so am",
    ],
  },
  {
    id: 17, levelNumber: 17, title: "Three-Letter Words",
    description: "Common three-letter words",
    phase: "Hatchling", basePoints: 25, minWpmForBonus: null,
    promptTexts: [
      "the and for cat dog run big hat",
      "red hot cup map set fox bat sun",
      "top hit fun bed log pen web van",
      "sit mix hop dig rub cut zip yam",
    ],
  },
  {
    id: 18, levelNumber: 18, title: "Four-Letter Words",
    description: "Building up to four-letter words",
    phase: "Hatchling", basePoints: 35, minWpmForBonus: null,
    promptTexts: [
      "jump fire bold lake home star book",
      "game fish land dark moon tree bird",
      "rain snow wind hill path road rock",
      "king gold cave song bell drum flag",
    ],
  },
  {
    id: 19, levelNumber: 19, title: "Five-Letter Words",
    description: "Longer words that build fluency",
    phase: "Hatchling", basePoints: 35, minWpmForBonus: null,
    promptTexts: [
      "brave flame sword quest storm light",
      "magic river tower stone water dream",
      "power cloud shine scale guard heart",
      "blaze torch forge ember lucky world",
    ],
  },
  {
    id: 20, levelNumber: 20, title: "Mixed Short Words",
    description: "A mix of two to four-letter words",
    phase: "Hatchling", basePoints: 25, minWpmForBonus: null,
    promptTexts: [
      "the big red fox ran to his den",
      "a cat sat on top of my old hat",
      "go fly up and see the hot sun",
      "one day she won a new pet dog",
    ],
  },
  {
    id: 21, levelNumber: 21, title: "Mixed Medium Words",
    description: "A mix of four to six-letter words",
    phase: "Hatchling", basePoints: 35, minWpmForBonus: null,
    promptTexts: [
      "dragon flame castle knight bridge tower",
      "forest meadow stream garden shield armor",
      "battle wizard scroll potion bottle hammer",
      "dungeon portal secret hidden golden silver",
    ],
  },
  {
    id: 22, levelNumber: 22, title: "Common Sight Words",
    description: "Words you see all the time in reading",
    phase: "Hatchling", basePoints: 25, minWpmForBonus: null,
    promptTexts: [
      "about their would could people other",
      "should every after where before little",
      "because again different another through right",
      "between never under still always found",
    ],
  },
  {
    id: 23, levelNumber: 23, title: "Two-Word Combos",
    description: "Simple two-word pairs to build flow",
    phase: "Hatchling", basePoints: 25, minWpmForBonus: null,
    promptTexts: [
      "big cat red dog old map hot sun",
      "my home one day new game go fast",
      "blue sky dark cave long road top hill",
      "fire ball ice cold gold ring red star",
    ],
  },
  {
    id: 24, levelNumber: 24, title: "Three-Word Phrases",
    description: "Short phrases to build rhythm",
    phase: "Hatchling", basePoints: 25, minWpmForBonus: null,
    promptTexts: [
      "run very fast eat some food find the gold",
      "see the moon pet the cat fly a kite",
      "ride the wave read a book make some art",
      "find the key open the door start the fire",
    ],
  },
  {
    id: 25, levelNumber: 25, title: "Four-Word Phrases",
    description: "Slightly longer phrases for building speed",
    phase: "Hatchling", basePoints: 35, minWpmForBonus: null,
    promptTexts: [
      "the dragon flew high over the dark forest",
      "a brave knight stood ready for the fight",
      "the egg began to glow with warm light",
      "a tiny flame burned inside the old cave",
    ],
  },
  {
    id: 26, levelNumber: 26, title: "Short Sentences",
    description: "Simple sentences without punctuation",
    phase: "Hatchling", basePoints: 50, minWpmForBonus: null,
    promptTexts: [
      "the small dragon ran across the green field",
      "a warm wind blew through the open window",
      "the old wizard found a glowing blue stone",
      "five birds flew over the tall castle wall",
    ],
  },
  {
    id: 27, levelNumber: 27, title: "Sentences with Capitals",
    description: "Short sentences with proper capitalization",
    phase: "Hatchling", basePoints: 50, minWpmForBonus: null,
    promptTexts: [
      "The little dragon ate three fish for lunch.",
      "Anna found a shiny coin under the bridge.",
      "My best friend Max has a pet lizard.",
      "Every morning the sun rises over the hill.",
    ],
  },
  {
    id: 28, levelNumber: 28, title: "Sentences with Periods",
    description: "Sentences ending with periods",
    phase: "Hatchling", basePoints: 50, minWpmForBonus: null,
    promptTexts: [
      "The cave was dark. A torch lit the way.",
      "Rain fell all day. The river rose fast.",
      "The knight drew his sword. He was ready.",
      "Stars filled the sky. The moon was full.",
    ],
  },
  {
    id: 29, levelNumber: 29, title: "Mixed Punctuation",
    description: "Sentences with commas, periods, and questions",
    phase: "Hatchling", basePoints: 50, minWpmForBonus: null,
    promptTexts: [
      "The dragon roared, and the ground shook hard.",
      "Where did the wizard go? Nobody knows for sure.",
      "Run, jump, and fly! The race has begun.",
      "After the rain stopped, a rainbow filled the sky.",
    ],
  },
  {
    id: 30, levelNumber: 30, title: "Medium Sentences",
    description: "Longer sentences to test your speed",
    phase: "Hatchling", basePoints: 75, minWpmForBonus: null,
    promptTexts: [
      "The brave dragon flew over the mountains and landed near a quiet lake.",
      "A young wizard opened an old book and found a map to hidden treasure.",
      "The knight rode through the forest until he reached the stone castle.",
      "Every night the stars told stories about the dragons of long ago.",
    ],
  },
];

export function getAllLevels(): LevelDefinition[] {
  return LEVELS;
}

export function getLevelByNumber(num: number): LevelDefinition | undefined {
  return LEVELS.find((l) => l.levelNumber === num);
}
