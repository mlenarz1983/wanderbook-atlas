import type {
  HistoricalEra,
  MissionDifficulty,
  SuspectProfile,
} from '../types/game';
import {
  DESTINATIONS_BY_ID,
  computeDistanceMiles,
  getDestinationPool,
} from './destinations';

export const SUSPECT_PROFILES: SuspectProfile[] = [
  {
    id: 'barnaby-magpie',
    name: 'Captain Barnaby',
    title: 'The Velvet Sky-Pirate',
    avatar: 'puffin',
    caseKind: 'wonder-chase',
    accessory: 'a gleaming brass monocle',
    favoriteTreat: 'spiced dark chocolate',
    companion: 'a whistling green parrot',
    hobby: 'collecting antique pocket compasses',
    catchphrase: '“You’ll never catch my zeppelin before sunset!”',
  },
  {
    id: 'vespera-fox',
    name: 'Duchess Vespera',
    title: 'The Phantom Cartographer',
    avatar: 'fox',
    caseKind: 'wonder-chase',
    accessory: 'a crimson silk scarf',
    favoriteTreat: 'pistachio honey baklava',
    companion: 'a tiny clockwork beetle',
    hobby: 'folding miniature origami cranes',
    catchphrase: '“Every great map hides a secret detour!”',
  },
  {
    id: 'otto-owl',
    name: 'Professor Hoot',
    title: 'The Midnight Collector',
    avatar: 'owl',
    caseKind: 'wonder-chase',
    accessory: 'silver-rimmed spectacles',
    favoriteTreat: 'warm cinnamon pastries',
    companion: 'a sleepy hedgehog in a satchel',
    hobby: 'sketching ancient constellation star-charts',
    catchphrase: '“Knowledge belongs in my secret library—catch me if you can!”',
  },
  {
    id: 'cleo-lion',
    name: 'Countess Cleo',
    title: 'The Gilded Trickster',
    avatar: 'lion',
    caseKind: 'wonder-chase',
    accessory: 'an emerald-studded sun hat',
    favoriteTreat: 'sweet mango sticky rice',
    companion: 'a mischievous striped lemur',
    hobby: 'painting vintage airmail postcards',
    catchphrase: '“Ta-ta, detectives—I’ve already caught the next trade wind!”',
  },
  {
    id: 'marco-otter',
    name: 'Sly Marco',
    title: 'The Riverboat Rascal',
    avatar: 'otter',
    caseKind: 'wonder-chase',
    accessory: 'a checkered sailor’s cap',
    favoriteTreat: 'wood-fired Margherita pizza',
    companion: 'a juggling sea otter pup',
    hobby: 'tuning brass ship bells',
    catchphrase: '“Smooth sailing to whoever reads the Atlas fastest!”',
  },
  {
    id: 'opal-panda',
    name: 'Baroness Bamboo',
    title: 'The Cloud-Chaser',
    avatar: 'panda',
    caseKind: 'wonder-chase',
    accessory: 'a jade dragon hairpin',
    favoriteTreat: 'steamed sweet bao buns',
    companion: 'a ribbon-tailed kite hawk',
    hobby: 'flying silk kites in mountain gales',
    catchphrase: '“Only true world explorers can follow my wind trail!”',
  },
  {
    id: 'jasper-alpaca',
    name: 'Baron Jasper',
    title: 'The Highland Artful Dodger',
    avatar: 'alpaca',
    caseKind: 'wonder-chase',
    accessory: 'a woven Andean cloak',
    favoriteTreat: 'warm maple cider donuts',
    companion: 'a pocket-sized mountain chinchilla',
    hobby: 'polishing antique railroad watches',
    catchphrase: '“Catch my balloon across the ridge if your compass holds true!”',
  },
  {
    id: 'coral-turtle',
    name: 'Admiral Drift',
    title: 'The Chrono-Navigator',
    avatar: 'turtle',
    caseKind: 'wonder-chase',
    accessory: 'a carved wooden star-compass',
    favoriteTreat: 'key lime tart',
    companion: 'a tiny brass astrolabe crab',
    hobby: 'charting lost hourglass currents',
    catchphrase: '“You’ll have to outsmart both the map and the clock to nab me!”',
  },
];

export const SUSPECTS_BY_ID: Record<string, SuspectProfile> = Object.fromEntries(
  SUSPECT_PROFILES.map((s) => [s.id, s])
);

export interface CaseTemplate {
  id: string;
  title: string;
  scope: 'usa' | 'world' | 'time-warp';
  stolenOrTargetItem: string;
  briefing: string;
  preferredStartIds: string[];
}

export const CASE_TEMPLATES: CaseTemplate[] = [
  // USA 50-State Cases
  {
    id: 'case-us-liberty',
    title: 'The Mystery of the Missing Golden Spike',
    scope: 'usa',
    stolenOrTargetItem: 'The Ceremonial Golden Railroad Spike',
    briefing:
      'A mischievous balloon bandit slipped out of the museum with the historic Golden Spike! Follow their trail across America’s 50 states, interview local witnesses, and lock in your Warrant before the Travel Clock runs out!',
    preferredStartIds: ['us-pa', 'us-ut', 'us-mo', 'new-york', 'boston'],
  },
  {
    id: 'case-us-compass',
    title: 'The Coast-to-Coast Star-Spangled Caper',
    scope: 'usa',
    stolenOrTargetItem: 'Lewis & Clark’s Brass Field Compass',
    briefing:
      'Someone swiped the explorers’ legendary pocket compass right off its velvet cushion! Track clues from state to state using your free Field Guide and catch the thief!',
    preferredStartIds: ['us-va', 'us-md', 'chicago', 'seattle', 'san-francisco'],
  },
  {
    id: 'case-us-rocket',
    title: 'The Great Apollo Flight-Log Heist',
    scope: 'usa',
    stolenOrTargetItem: 'The Signed Apollo Lunar Flight Log',
    briefing:
      'A clever rogue zipped off across the United States with an original Moon-mission notebook! Piece together state landmarks, waterways, and suspect traits to solve the case!',
    preferredStartIds: ['us-al', 'us-tx', 'miami', 'us-oh', 'denver'],
  },

  // Global World Cases
  {
    id: 'case-sunstone',
    title: 'The Mystery of the Missing Viking Sunstone',
    scope: 'world',
    stolenOrTargetItem: 'The Glowing Viking Sunstone',
    briefing:
      'A mischievous sky-bandit swiped the legendary Viking Sunstone from the Atlas Museum! Follow their trail across the globe, gather clues in each city, identify the culprit, and recover it before time runs out!',
    preferredStartIds: ['iceland', 'norway', 'uk', 'scotland'],
  },
  {
    id: 'case-silk-kite',
    title: 'The Great Silk Road Kite Caper',
    scope: 'world',
    stolenOrTargetItem: 'The Imperial Golden Silk Kite',
    briefing:
      'The Imperial Silk Kite—woven with secret star-maps—vanished overnight! Interview local witnesses, consult your free Atlas Field Guide, and chase the culprit down!',
    preferredStartIds: ['china', 'turkey', 'venice', 'japan'],
  },
  {
    id: 'case-chocolate-codex',
    title: 'The Stolen Cacao Codex',
    scope: 'world',
    stolenOrTargetItem: 'The Ancient Maya Cacao Codex',
    briefing:
      'Someone slipped out the window with the oldest recipe for spiced chocolate on Earth! Follow their currency exchanges, flags, and landmarks across continents!',
    preferredStartIds: ['mexico', 'peru', 'colombia', 'brazil'],
  },
  {
    id: 'case-zero-tablet',
    title: 'The Case of the Vanishing Zero',
    scope: 'world',
    stolenOrTargetItem: 'The Ancient Sandstone Zero Tablet',
    briefing:
      'Disaster in the math archives—the priceless stone tablet showing the world’s first Zero (0) is gone! Track the culprit through bustling markets and historic sites before they disappear!',
    preferredStartIds: ['india', 'jordan', 'egypt', 'greece'],
  },
  {
    id: 'case-star-chart',
    title: 'The Wayfinder’s Stolen Star Chart',
    scope: 'world',
    stolenOrTargetItem: 'The Polynesian Shell Star Chart',
    briefing:
      'A daring rogue took off with a master wayfinder’s shell star-chart! Use geography, flags, waterways, and history clues to deduce every hop before time runs dry!',
    preferredStartIds: ['new-zealand', 'honolulu', 'tahiti', 'fiji'],
  },

  // Level 4 Time-Warp Cases
  {
    id: 'case-chrono-astrolabe',
    title: 'The Chrono-Balloon Astrolabe Heist',
    scope: 'time-warp',
    stolenOrTargetItem: 'The Brass Time-Keeper’s Astrolabe',
    briefing:
      'Alert! The thief hijacked a Chrono-Balloon that jumps across BOTH geography and history! In every city, deduce WHERE they flew AND WHICH ERA (Ancient World, Age of Sail, or Modern Era) they warped into!',
    preferredStartIds: ['egypt', 'greece', 'uk', 'japan', 'peru', 'italy'],
  },
  {
    id: 'case-chrono-hourglass',
    title: 'Chasing the Stolen Hourglass of Alexandria',
    scope: 'time-warp',
    stolenOrTargetItem: 'The Star-Sand Hourglass of Alexandria',
    briefing:
      'A time-hopping trickster is rewriting history one landmark at a time! Match every geographic clue and era clue, dial in the right century, and capture the culprit before the clock hits zero!',
    preferredStartIds: ['france', 'china', 'india', 'mexico', 'turkey', 'us-pa'],
  },
];

export function pickCaseTemplate(difficulty: MissionDifficulty): CaseTemplate {
  const scope =
    difficulty === 'usa'
      ? 'usa'
      : difficulty === 'time-warp'
        ? 'time-warp'
        : 'world';
  const pool = CASE_TEMPLATES.filter((t) => t.scope === scope);
  return pool[Math.floor(Math.random() * pool.length)] ?? CASE_TEMPLATES[0];
}

/**
 * Generates an exciting trail within the active Mission Difficulty pool!
 */
export function generateCaseTrail(
  difficulty: MissionDifficulty,
  startCandidates: string[],
  length: number
): string[] {
  const pool = getDestinationPool(difficulty);
  const poolSet = new Set(pool.map((d) => d.id));
  const validStarts = startCandidates.filter((id) => poolSet.has(id));
  const startId =
    validStarts.length > 0
      ? validStarts[Math.floor(Math.random() * validStarts.length)]
      : pool[Math.floor(Math.random() * pool.length)].id;

  const isUsaMode = difficulty === 'usa';
  const trail: string[] = [startId];
  const usedKeys = new Set<string>([
    isUsaMode ? startId : DESTINATIONS_BY_ID[startId].country,
  ]);

  const minHop = isUsaMode ? 400 : 650;
  const maxHop = isUsaMode ? 2400 : 6200;

  while (trail.length < length) {
    const prev = DESTINATIONS_BY_ID[trail[trail.length - 1]];
    const filtered = pool.filter((d) => {
      const key = isUsaMode ? d.id : d.country;
      if (usedKeys.has(key)) return false;
      const dist = computeDistanceMiles(prev.coords, d.coords);
      return dist >= minHop && dist <= maxHop;
    });
    const fallback = pool.filter(
      (d) => !usedKeys.has(isUsaMode ? d.id : d.country)
    );
    const source = filtered.length >= 3 ? filtered : fallback;
    const pick = source[Math.floor(Math.random() * source.length)];
    if (!pick) break;
    trail.push(pick.id);
    usedKeys.add(isUsaMode ? pick.id : pick.country);
  }

  return trail;
}

/** Generates a varied sequence of historical eras for Level 4 Time-Warp cases! */
export function generateCaseEras(length: number): HistoricalEra[] {
  const all: HistoricalEra[] = ['ancient', 'sail', 'modern'];
  const eras: HistoricalEra[] = ['modern']; // Always start the investigation in the present!
  for (let i = 1; i < length; i++) {
    const prev = eras[i - 1];
    const options = all.filter((e) => e !== prev);
    eras.push(options[Math.floor(Math.random() * options.length)]);
  }
  return eras;
}

export function pickSuspectPool(): {
  culpritId: string;
  suspectIds: string[];
} {
  const shuffled = [...SUSPECT_PROFILES].sort(() => Math.random() - 0.5);
  const chosenFour = shuffled.slice(0, 4);
  const culprit = chosenFour[Math.floor(Math.random() * chosenFour.length)];
  return {
    culpritId: culprit.id,
    suspectIds: chosenFour.map((s) => s.id),
  };
}
