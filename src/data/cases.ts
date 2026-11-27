import type { CaseKind, SuspectProfile } from '../types/game';
import { DESTINATIONS, DESTINATIONS_BY_ID, computeDistanceMiles } from './destinations';

export const SUSPECT_PROFILES: SuspectProfile[] = [
  // 6 Carmen Sandiego-style Mischievous World-Wonder Culprits
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

  // 4 Legendary Lost Explorers (for Lost Explorer Trails)
  {
    id: 'amelia-alpaca',
    name: 'Dr. Clara Cloud',
    title: 'High-Altitude Botanist',
    avatar: 'alpaca',
    caseKind: 'lost-explorer',
    accessory: 'a woven Andean poncho',
    favoriteTreat: 'warm herbal mint tea',
    companion: 'a woolly mountain alpaca',
    hobby: 'pressing rare mountain flowers into journals',
    catchphrase: '“Thank goodness you followed my field notes!”',
  },
  {
    id: 'theo-turtle',
    name: 'Captain Theo Tide',
    title: 'Ocean Wayfinder',
    avatar: 'turtle',
    caseKind: 'lost-explorer',
    accessory: 'a carved wooden star-compass',
    favoriteTreat: 'roasted coconut & pineapple',
    companion: 'a friendly reef sea turtle',
    hobby: 'mapping secret ocean currents',
    catchphrase: '“Brilliant navigation, crew—you read every current right!”',
  },
  {
    id: 'nadia-fox',
    name: 'Archivist Nadia',
    title: 'Ancient Script Decoder',
    avatar: 'fox',
    caseKind: 'lost-explorer',
    accessory: 'a leather satchel of rubbings',
    favoriteTreat: 'honey-dipped dates',
    companion: 'a big-eared fennec fox',
    hobby: 'translating ancient stone inscriptions',
    catchphrase: '“What a relief! Wait until you see the ruin I found!”',
  },
  {
    id: 'soren-puffin',
    name: 'Polar Ranger Soren',
    title: 'Glacier Cartographer',
    avatar: 'puffin',
    caseKind: 'lost-explorer',
    accessory: 'a fur-lined brass spyglass',
    favoriteTreat: 'hot station cocoa',
    companion: 'a cheerful puffin lookout',
    hobby: 'photographing shimmering auroras',
    catchphrase: '“My radio froze—thank you for tracking my coordinates!”',
  },

  // 4 Rare Migrating Wildlife Legends (for Wildlife Trail cases)
  {
    id: 'aurora-turtle',
    name: 'Starlight the Voyager',
    title: 'Centurion Sea Turtle',
    avatar: 'turtle',
    caseKind: 'wildlife-trail',
    accessory: 'a golden barnacle crescent on her shell',
    favoriteTreat: 'sparkling seagrass ribbons',
    companion: 'a playful school of pilot fish',
    hobby: 'surfing warm equatorial currents',
    catchphrase: '“She glided safely back to her ancient nesting cove!”',
  },
  {
    id: 'zephyr-owl',
    name: 'Zephyr the Wanderer',
    title: 'Snowy Sky-Glider',
    avatar: 'owl',
    caseKind: 'wildlife-trail',
    accessory: 'a silver banded ankle tag',
    favoriteTreat: 'highland mountain berries',
    companion: 'a flock of soaring swallows',
    hobby: 'riding high-altitude jet streams',
    catchphrase: '“Your crew tracked Zephyr’s record migration all the way home!”',
  },
  {
    id: 'sol-lion',
    name: 'Kibo the Golden',
    title: 'Savanna & Highland Roamer',
    avatar: 'lion',
    caseKind: 'wildlife-trail',
    accessory: 'a tiny white star tuft on his ear',
    favoriteTreat: 'cool river oasis water',
    companion: 'a chorus of oxpecker birds',
    hobby: 'following seasonal monsoon rains',
    catchphrase: '“Kibo reunited safely with his wild sanctuary!”',
  },
  {
    id: 'mei-panda',
    name: 'Misty the Cloud-Walker',
    title: 'Rare Highland Wanderer',
    avatar: 'panda',
    caseKind: 'wildlife-trail',
    accessory: 'a rusty-red tail stripe',
    favoriteTreat: 'tender spring bamboo shoots',
    companion: 'a chattering mountain squirrel',
    hobby: 'napping in misty cedar canopies',
    catchphrase: '“Misty made it safely to the protected sanctuary!”',
  },
];

export const SUSPECTS_BY_ID: Record<string, SuspectProfile> = Object.fromEntries(
  SUSPECT_PROFILES.map((s) => [s.id, s])
);

export interface CaseTemplate {
  id: string;
  title: string;
  kind: CaseKind;
  stolenOrTargetItem: string;
  briefing: string;
  preferredStartIds: string[];
}

export const CASE_TEMPLATES: CaseTemplate[] = [
  {
    id: 'case-sunstone',
    title: 'The Mystery of the Missing Viking Sunstone',
    kind: 'wonder-chase',
    stolenOrTargetItem: 'The Glowing Viking Sunstone',
    briefing:
      'A mischievous sky-bandit swiped the legendary Viking Sunstone from the Atlas Museum! Follow their trail across the globe, gather clues in each town, identify the culprit, and recover it before the Travel Clock runs out!',
    preferredStartIds: ['iceland', 'norway', 'uk', 'scotland'],
  },
  {
    id: 'case-silk-kite',
    title: 'The Great Silk Road Kite Caper',
    kind: 'wonder-chase',
    stolenOrTargetItem: 'The Imperial Golden Silk Kite',
    briefing:
      'The Imperial Silk Kite—woven with secret star-maps—vanished from a museum vault overnight! Interview local witnesses, consult your free Atlas Field Guide, and chase the culprit down!',
    preferredStartIds: ['china', 'uzbekistan', 'turkey', 'venice'],
  },
  {
    id: 'case-chocolate-codex',
    title: 'The Stolen Cacao Codex',
    kind: 'wonder-chase',
    stolenOrTargetItem: 'The Ancient Maya Cacao Codex',
    briefing:
      'Someone slipped out the window with the oldest recipe for spiced chocolate on Earth! Follow their currency exchanges, border crossings, and snack crumbs across continents!',
    preferredStartIds: ['mexico', 'oaxaca', 'peru', 'colombia'],
  },
  {
    id: 'case-zero-tablet',
    title: 'The Case of the Vanishing Zero',
    kind: 'wonder-chase',
    stolenOrTargetItem: 'The Ancient Sandstone Zero Tablet',
    briefing:
      'Disaster in the math archives—the priceless stone tablet showing the world’s first Zero (0) is gone! Track the culprit through bustling markets and ancient libraries before they disappear!',
    preferredStartIds: ['india', 'jaipur', 'jordan', 'egypt'],
  },
  {
    id: 'case-star-chart',
    title: 'The Wayfinder’s Stolen Star Chart',
    kind: 'wonder-chase',
    stolenOrTargetItem: 'The Polynesian Shell Star Chart',
    briefing:
      'A daring rogue took off with a master wayfinder’s shell star-chart! Use geography, flags, waterways, and history clues to deduce every hop before time runs dry!',
    preferredStartIds: ['new-zealand', 'hawaii', 'tahiti', 'fiji'],
  },
  {
    id: 'case-lost-botanist',
    title: 'Search for the Missing Expedition Journal',
    kind: 'lost-explorer',
    stolenOrTargetItem: 'The Lost Cloud-Forest Explorer',
    briefing:
      'One of our bravest Wanderbook explorers lost radio contact while chasing a legendary discovery! Follow the field notes they left behind at harbors, markets, and archives to find them!',
    preferredStartIds: ['peru', 'costa-rica', 'nepal', 'ethiopia'],
  },
  {
    id: 'case-polar-signal',
    title: 'Mystery Signal From the Ends of the Earth',
    kind: 'lost-explorer',
    stolenOrTargetItem: 'The Stranded Polar Cartographer',
    briefing:
      'A faint Morse-code beacon just echoed across our radio! Piece together local clues across wild peaks and icy harbors to track down which explorer sent the signal!',
    preferredStartIds: ['canada', 'alaska', 'greenland', 'patagonia'],
  },
  {
    id: 'case-great-migration',
    title: 'The Legendary Migration Mystery',
    kind: 'wildlife-trail',
    stolenOrTargetItem: 'The Rare Migrating Legend',
    briefing:
      'Biologists spotted a legendary migratory creature far from its usual route! Interview harbors, markets, and wildlife archives to follow its trail and guide it safely to sanctuary!',
    preferredStartIds: ['tanzania', 'madagascar', 'great-barrier-reef', 'galapagos'],
  },
];

/**
 * Generates a fresh, exciting 4-to-7-stop global trail where every hop is
 * geographically varied and uses distinct countries!
 */
export function generateCaseTrail(
  startCandidates: string[],
  length: number
): string[] {
  const validStarts = startCandidates.filter((id) => Boolean(DESTINATIONS_BY_ID[id]));
  const startId =
    validStarts.length > 0
      ? validStarts[Math.floor(Math.random() * validStarts.length)]
      : DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)].id;

  const trail: string[] = [startId];
  const usedCountries = new Set<string>([DESTINATIONS_BY_ID[startId].country]);

  while (trail.length < length) {
    const prev = DESTINATIONS_BY_ID[trail[trail.length - 1]];
    // Prefer exciting hops between 700 and 5,800 miles so the balloon crosses oceans & continents
    const pool = DESTINATIONS.filter((d) => {
      if (usedCountries.has(d.country)) return false;
      const dist = computeDistanceMiles(prev.coords, d.coords);
      return dist >= 650 && dist <= 6200;
    });
    const fallbackPool = DESTINATIONS.filter((d) => !usedCountries.has(d.country));
    const source = pool.length >= 4 ? pool : fallbackPool;
    const pick = source[Math.floor(Math.random() * source.length)];
    if (!pick) break;
    trail.push(pick.id);
    usedCountries.add(pick.country);
  }

  return trail;
}

export function pickSuspectPool(kind: CaseKind): {
  culpritId: string;
  suspectIds: string[];
} {
  const matching = SUSPECT_PROFILES.filter((s) => s.caseKind === kind);
  const shuffled = [...matching].sort(() => Math.random() - 0.5);
  const chosenFour = shuffled.slice(0, 4);
  const culprit = chosenFour[Math.floor(Math.random() * chosenFour.length)];
  return {
    culpritId: culprit.id,
    suspectIds: chosenFour.map((s) => s.id),
  };
}
