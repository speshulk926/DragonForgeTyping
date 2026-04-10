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
  // === PHASE 3: DRAKE ARC (Levels 31-40) — Longer sentences ===
  {
    id: 31, levelNumber: 31, title: "Longer Sentences I",
    description: "Full sentences with all keys",
    phase: "Drake", basePoints: 75, minWpmForBonus: null,
    promptTexts: [
      "Jimothy packed his bag and set off down the winding forest path at dawn.",
      "The little dragon tried to keep up, tripping over roots and stones.",
      "Smoke curled from the dragon's nose every time it sneezed in the cold air.",
      "They crossed a bridge made of old rope that swayed above a rushing river.",
    ],
  },
  {
    id: 32, levelNumber: 32, title: "Longer Sentences II",
    description: "Building speed with longer text",
    phase: "Drake", basePoints: 75, minWpmForBonus: null,
    promptTexts: [
      "The forest grew darker as they walked deeper into the ancient woods.",
      "Strange mushrooms glowed with a faint blue light along the narrow trail.",
      "Jimothy held a torch in one hand and kept the dragon close with the other.",
      "Somewhere in the distance, an owl hooted and the dragon hid behind a rock.",
    ],
  },
  {
    id: 33, levelNumber: 33, title: "Longer Sentences III",
    description: "Typing with flow and rhythm",
    phase: "Drake", basePoints: 75, minWpmForBonus: null,
    promptTexts: [
      "By noon they found a clearing with a stream and stopped to rest and eat.",
      "The dragon caught a fish by accident when it fell into the shallow water.",
      "Jimothy laughed so hard that he dropped his sandwich into the mud below.",
      "After lunch they dried off in the sun and continued on their long journey.",
    ],
  },
  {
    id: 34, levelNumber: 34, title: "Questions and Answers",
    description: "Sentences with question marks and dialogue",
    phase: "Drake", basePoints: 75, minWpmForBonus: null,
    promptTexts: [
      "\"Where are we going?\" the dragon seemed to ask with its big round eyes.",
      "Jimothy looked at the map and said, \"We should reach the village by sunset.\"",
      "\"Do you think they will be afraid of you?\" he asked the little dragon.",
      "The dragon tilted its head as if to say, \"Who could be scared of me?\"",
    ],
  },
  {
    id: 35, levelNumber: 35, title: "Dragon Lore I",
    description: "Stories about the world of dragons",
    phase: "Drake", basePoints: 75, minWpmForBonus: null,
    promptTexts: [
      "Long ago, dragons filled the skies and their roars echoed across every land.",
      "They came in every color, from deep ocean blue to bright sunrise gold.",
      "The fire dragons lived near volcanoes and could melt stone with a single breath.",
      "Ice dragons preferred the frozen north where snowflakes danced around their wings.",
    ],
  },
  {
    id: 36, levelNumber: 36, title: "Dragon Lore II",
    description: "The history of dragon riders",
    phase: "Drake", basePoints: 75, minWpmForBonus: null,
    promptTexts: [
      "In the old days, brave heroes would earn a dragon's trust through acts of kindness.",
      "A dragon never forgets someone who helped it, even if many years have passed.",
      "The bond between a rider and dragon was said to be stronger than steel.",
      "Together they could fly faster than the wind and see beyond the horizon.",
    ],
  },
  {
    id: 37, levelNumber: 37, title: "Numbers in Context",
    description: "Sentences with numbers mixed in naturally",
    phase: "Drake", basePoints: 75, minWpmForBonus: null,
    promptTexts: [
      "The castle had 7 towers, each one taller than the last, reaching 200 feet high.",
      "Jimothy counted 14 stars in the sky before the clouds rolled in at midnight.",
      "The dragon ate 3 fish, 2 apples, and about 50 berries for its evening meal.",
      "It took them 5 days to cross the mountain pass and reach the valley below.",
    ],
  },
  {
    id: 38, levelNumber: 38, title: "Exciting Action",
    description: "Fast-paced adventure sentences",
    phase: "Drake", basePoints: 75, minWpmForBonus: null,
    promptTexts: [
      "The ground shook! A massive boulder rolled down the hill straight toward them!",
      "Jimothy grabbed the dragon and dove behind a fallen tree just in time.",
      "The boulder crashed past, taking out three trees and splashing into the lake.",
      "They looked at each other, breathing hard, and then burst out laughing.",
    ],
  },
  {
    id: 39, levelNumber: 39, title: "Descriptions",
    description: "Detailed descriptive sentences",
    phase: "Drake", basePoints: 75, minWpmForBonus: null,
    promptTexts: [
      "The village had small stone houses with red roofs and gardens full of flowers.",
      "A warm golden light spilled from every window into the cool evening air.",
      "The smell of fresh bread and roasting meat drifted down the cobblestone street.",
      "Children played near the fountain while their parents chatted on wooden benches.",
    ],
  },
  {
    id: 40, levelNumber: 40, title: "Complex Sentences",
    description: "Longer sentences with commas and clauses",
    phase: "Drake", basePoints: 75, minWpmForBonus: null,
    promptTexts: [
      "Although the path was steep and the rain made it slippery, they kept climbing.",
      "The dragon, who had grown a little bigger each day, could now glide short distances.",
      "Jimothy knew that if they could reach the top, the view would be worth every step.",
      "When they finally arrived, the sunset painted the whole sky in orange and purple.",
    ],
  },
  // === PHASE 3 continued: Levels 41-50 — Short paragraphs ===
  {
    id: 41, levelNumber: 41, title: "Short Paragraphs I",
    description: "Multiple sentences in a row",
    phase: "Drake", basePoints: 100, minWpmForBonus: null,
    promptTexts: [
      "The dragon woke up early. It stretched its wings and yawned, sending a tiny puff of smoke into the morning air. Jimothy was still asleep by the campfire.",
      "A rabbit hopped past the campsite. The dragon watched it carefully, its tail twitching back and forth. Then it pounced and missed completely.",
    ],
  },
  {
    id: 42, levelNumber: 42, title: "Short Paragraphs II",
    description: "Building endurance with longer text",
    phase: "Drake", basePoints: 100, minWpmForBonus: null,
    promptTexts: [
      "They reached the top of the hill and looked down at the valley below. A river wound through green fields like a silver ribbon. Tiny houses dotted the landscape.",
      "The dragon made a happy sound and flapped its wings. It wanted to fly down, but it was still too small. Jimothy scratched its head and said maybe next week.",
    ],
  },
  {
    id: 43, levelNumber: 43, title: "Short Paragraphs III",
    description: "Telling stories through typing",
    phase: "Drake", basePoints: 100, minWpmForBonus: null,
    promptTexts: [
      "The old blacksmith looked at the dragon and smiled. He had not seen one in forty years. He told them that dragons used to visit his shop to have their scales polished.",
      "Jimothy asked if the blacksmith could make a small collar for the dragon. The old man nodded and got to work. By sunset, the dragon wore a tiny golden tag that read: Friend.",
    ],
  },
  {
    id: 44, levelNumber: 44, title: "Dragon Lore III",
    description: "Legends of the ancient dragons",
    phase: "Drake", basePoints: 100, minWpmForBonus: null,
    promptTexts: [
      "The Elder Dragons were the first creatures to walk the earth. They shaped mountains with their claws and filled oceans with their tears of joy. Every river began as a dragon's gift.",
      "When an Elder Dragon passed away, a new star would appear in the night sky. The dragons believed that their ancestors watched over them from above, guiding them with gentle starlight.",
    ],
  },
  {
    id: 45, levelNumber: 45, title: "Adventures Continue",
    description: "Jimothy and the dragon press on",
    phase: "Drake", basePoints: 100, minWpmForBonus: null,
    promptTexts: [
      "The map showed a shortcut through the Whispering Caves. Jimothy was nervous, but the dragon marched right in. Its scales began to glow softly, lighting the way through the darkness.",
      "Strange crystals hung from the ceiling like frozen raindrops. The dragon touched one with its nose and it chimed like a tiny bell. Soon the whole cave was singing.",
    ],
  },
  {
    id: 46, levelNumber: 46, title: "Weather and Seasons",
    description: "Descriptive paragraphs about nature",
    phase: "Drake", basePoints: 100, minWpmForBonus: null,
    promptTexts: [
      "Autumn had arrived and the leaves were turning brilliant shades of red and gold. The air was crisp and cool, perfect for hiking. The dragon loved crunching through the fallen leaves.",
      "Winter brought snow to the mountains. Jimothy built a shelter while the dragon tried to breathe fire for the first time. All it managed was a warm puff, but it was enough to melt some snow for water.",
    ],
  },
  {
    id: 47, levelNumber: 47, title: "Meeting New Friends",
    description: "Dialogue-heavy paragraphs",
    phase: "Drake", basePoints: 100, minWpmForBonus: null,
    promptTexts: [
      "A girl named Elara spotted them from her farm. \"Is that a real dragon?\" she gasped. Jimothy nodded. \"Don't worry, it's friendly.\" The dragon proved it by gently nuzzling her hand.",
      "Elara invited them inside for soup. While they ate, she told them about the old dragon tower north of the village. \"Nobody goes there anymore,\" she said, \"but I hear it glows at night.\"",
    ],
  },
  {
    id: 48, levelNumber: 48, title: "The Dragon Tower",
    description: "An exciting discovery",
    phase: "Drake", basePoints: 100, minWpmForBonus: null,
    promptTexts: [
      "The tower stood alone on a rocky hill, covered in vines and moss. As they got closer, the dragon became excited, pulling on Jimothy's sleeve. Something about this place felt familiar to it.",
      "Inside, the walls were carved with images of dragons in flight. A spiral staircase led up into the darkness. The dragon began to climb, and Jimothy followed, his torch casting long shadows.",
    ],
  },
  {
    id: 49, levelNumber: 49, title: "Ancient Secrets",
    description: "Discovering dragon history",
    phase: "Beyond", basePoints: 100, minWpmForBonus: null,
    promptTexts: [
      "At the top of the tower, they found a room filled with dragon eggs, all dark and cold. The dragon touched them gently, but none responded. These eggs had been sleeping for a very long time.",
      "A stone tablet on the wall told the story of the last dragons. They had hidden their eggs here to keep them safe, hoping that one day someone kind would find them and bring them home.",
    ],
  },
  {
    id: 50, levelNumber: 50, title: "The Journey Home",
    description: "The final stretch of the adventure",
    phase: "Beyond", basePoints: 100, minWpmForBonus: null,
    promptTexts: [
      "Jimothy carefully packed the sleeping eggs into his bag. The dragon watched proudly, knowing that its family might one day wake up too. Together, they began the long walk home.",
      "As they walked, the dragon flew alongside Jimothy for the first time, strong enough at last to stay in the air. The sun set behind them, painting the sky in every color imaginable.",
    ],
  },
];

export function getAllLevels(): LevelDefinition[] {
  return LEVELS;
}

export function getLevelByNumber(num: number): LevelDefinition | undefined {
  return LEVELS.find((l) => l.levelNumber === num);
}
