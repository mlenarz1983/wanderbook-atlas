import type { HistoricalEra, MissionDifficulty } from '../../types/game';

export interface UsStateMeta {
  code: string;
  stateName: string;
  nickname: string;
  stateCapital: string;
  region: string;
}

/**
 * Exact 50-state lookup mapping every US state's canonical destination ID
 * (13 already in the Atlas + 37 newly added states = all 50 US states!).
 */
export const US_STATE_BY_DEST_ID: Record<string, UsStateMeta> = {
  'us-al': { code: 'AL', stateName: 'Alabama', nickname: 'The Yellowhammer State', stateCapital: 'Montgomery', region: 'Deep South' },
  alaska: { code: 'AK', stateName: 'Alaska', nickname: 'The Last Frontier', stateCapital: 'Juneau', region: 'Arctic Pacific' },
  'grand-canyon': { code: 'AZ', stateName: 'Arizona', nickname: 'The Grand Canyon State', stateCapital: 'Phoenix', region: 'American Southwest' },
  'us-ar': { code: 'AR', stateName: 'Arkansas', nickname: 'The Natural State', stateCapital: 'Little Rock', region: 'Ozark South' },
  'san-francisco': { code: 'CA', stateName: 'California', nickname: 'The Golden State', stateCapital: 'Sacramento', region: 'Pacific West Coast' },
  denver: { code: 'CO', stateName: 'Colorado', nickname: 'The Centennial State', stateCapital: 'Denver', region: 'Rocky Mountains' },
  'us-ct': { code: 'CT', stateName: 'Connecticut', nickname: 'The Constitution State', stateCapital: 'Hartford', region: 'New England' },
  'us-de': { code: 'DE', stateName: 'Delaware', nickname: 'The First State', stateCapital: 'Dover', region: 'Mid-Atlantic' },
  miami: { code: 'FL', stateName: 'Florida', nickname: 'The Sunshine State', stateCapital: 'Tallahassee', region: 'Atlantic Southeast' },
  'us-ga': { code: 'GA', stateName: 'Georgia', nickname: 'The Peach State', stateCapital: 'Atlanta', region: 'Atlantic Southeast' },
  honolulu: { code: 'HI', stateName: 'Hawaii', nickname: 'The Aloha State', stateCapital: 'Honolulu', region: 'Pacific Islands' },
  'us-id': { code: 'ID', stateName: 'Idaho', nickname: 'The Gem State', stateCapital: 'Boise', region: 'Mountain Northwest' },
  chicago: { code: 'IL', stateName: 'Illinois', nickname: 'The Prairie State', stateCapital: 'Springfield', region: 'Great Lakes Midwest' },
  'us-in': { code: 'IN', stateName: 'Indiana', nickname: 'The Hoosier State', stateCapital: 'Indianapolis', region: 'Great Lakes Midwest' },
  'us-ia': { code: 'IA', stateName: 'Iowa', nickname: 'The Hawkeye State', stateCapital: 'Des Moines', region: 'Heartland Plains' },
  'us-ks': { code: 'KS', stateName: 'Kansas', nickname: 'The Sunflower State', stateCapital: 'Topeka', region: 'Great Plains' },
  'us-ky': { code: 'KY', stateName: 'Kentucky', nickname: 'The Bluegrass State', stateCapital: 'Frankfort', region: 'Appalachian South' },
  'new-orleans': { code: 'LA', stateName: 'Louisiana', nickname: 'The Pelican State', stateCapital: 'Baton Rouge', region: 'Gulf Coast' },
  'us-me': { code: 'ME', stateName: 'Maine', nickname: 'The Pine Tree State', stateCapital: 'Augusta', region: 'New England' },
  'us-md': { code: 'MD', stateName: 'Maryland', nickname: 'The Old Line State', stateCapital: 'Annapolis', region: 'Chesapeake Mid-Atlantic' },
  boston: { code: 'MA', stateName: 'Massachusetts', nickname: 'The Bay State', stateCapital: 'Boston', region: 'New England' },
  'us-mi': { code: 'MI', stateName: 'Michigan', nickname: 'The Great Lakes State', stateCapital: 'Lansing', region: 'Great Lakes Midwest' },
  'us-mn': { code: 'MN', stateName: 'Minnesota', nickname: 'Land of 10,000 Lakes', stateCapital: 'Saint Paul', region: 'Upper Midwest' },
  'us-ms': { code: 'MS', stateName: 'Mississippi', nickname: 'The Magnolia State', stateCapital: 'Jackson', region: 'Mississippi River South' },
  'us-mo': { code: 'MO', stateName: 'Missouri', nickname: 'The Show-Me State', stateCapital: 'Jefferson City', region: 'Midwest Confluence' },
  'us-mt': { code: 'MT', stateName: 'Montana', nickname: 'Big Sky Country', stateCapital: 'Helena', region: 'Northern Rockies' },
  'us-ne': { code: 'NE', stateName: 'Nebraska', nickname: 'The Cornhusker State', stateCapital: 'Lincoln', region: 'Great Plains' },
  'us-nv': { code: 'NV', stateName: 'Nevada', nickname: 'The Silver State', stateCapital: 'Carson City', region: 'Mojave & Great Basin' },
  'us-nh': { code: 'NH', stateName: 'New Hampshire', nickname: 'The Granite State', stateCapital: 'Concord', region: 'New England' },
  'us-nj': { code: 'NJ', stateName: 'New Jersey', nickname: 'The Garden State', stateCapital: 'Trenton', region: 'Mid-Atlantic' },
  'santa-fe': { code: 'NM', stateName: 'New Mexico', nickname: 'Land of Enchantment', stateCapital: 'Santa Fe', region: 'American Southwest' },
  'new-york': { code: 'NY', stateName: 'New York', nickname: 'The Empire State', stateCapital: 'Albany', region: 'Atlantic Northeast' },
  'us-nc': { code: 'NC', stateName: 'North Carolina', nickname: 'The Tar Heel State', stateCapital: 'Raleigh', region: 'Blue Ridge & Coast' },
  'us-nd': { code: 'ND', stateName: 'North Dakota', nickname: 'The Peace Garden State', stateCapital: 'Bismarck', region: 'Northern Plains' },
  'us-oh': { code: 'OH', stateName: 'Ohio', nickname: 'The Buckeye State', stateCapital: 'Columbus', region: 'Great Lakes Midwest' },
  'us-ok': { code: 'OK', stateName: 'Oklahoma', nickname: 'The Sooner State', stateCapital: 'Oklahoma City', region: 'Southern Plains' },
  'us-or': { code: 'OR', stateName: 'Oregon', nickname: 'The Beaver State', stateCapital: 'Salem', region: 'Pacific Northwest' },
  'us-pa': { code: 'PA', stateName: 'Pennsylvania', nickname: 'The Keystone State', stateCapital: 'Harrisburg', region: 'Mid-Atlantic' },
  'us-ri': { code: 'RI', stateName: 'Rhode Island', nickname: 'The Ocean State', stateCapital: 'Providence', region: 'New England' },
  'us-sc': { code: 'SC', stateName: 'South Carolina', nickname: 'The Palmetto State', stateCapital: 'Columbia', region: 'Lowcountry Atlantic' },
  'us-sd': { code: 'SD', stateName: 'South Dakota', nickname: 'The Mount Rushmore State', stateCapital: 'Pierre', region: 'Black Hills & Plains' },
  'us-tn': { code: 'TN', stateName: 'Tennessee', nickname: 'The Volunteer State', stateCapital: 'Nashville', region: 'Appalachian South' },
  'us-tx': { code: 'TX', stateName: 'Texas', nickname: 'The Lone Star State', stateCapital: 'Austin', region: 'Gulf & Southwest' },
  'us-ut': { code: 'UT', stateName: 'Utah', nickname: 'The Beehive State', stateCapital: 'Salt Lake City', region: 'Canyonlands Rockies' },
  'us-vt': { code: 'VT', stateName: 'Vermont', nickname: 'The Green Mountain State', stateCapital: 'Montpelier', region: 'New England' },
  'us-va': { code: 'VA', stateName: 'Virginia', nickname: 'The Old Dominion', stateCapital: 'Richmond', region: 'Chesapeake & Blue Ridge' },
  seattle: { code: 'WA', stateName: 'Washington', nickname: 'The Evergreen State', stateCapital: 'Olympia', region: 'Pacific Northwest' },
  'us-wv': { code: 'WV', stateName: 'West Virginia', nickname: 'The Mountain State', stateCapital: 'Charleston', region: 'Appalachian Mountains' },
  'us-wi': { code: 'WI', stateName: 'Wisconsin', nickname: 'America’s Dairyland', stateCapital: 'Madison', region: 'Great Lakes Midwest' },
  yellowstone: { code: 'WY', stateName: 'Wyoming', nickname: 'The Equality State', stateCapital: 'Cheyenne', region: 'Northern Rockies' },
};

export const US_50_STATE_DEST_IDS: string[] = Object.keys(US_STATE_BY_DEST_ID);

/** Extra US destinations (DC, Yosemite, Big Island) that also belong to USA metadata for flag display */
export const EXTRA_US_FLAGS: Record<string, UsStateMeta> = {
  'washington-dc': { code: 'DC', stateName: 'Washington, D.C.', nickname: 'The Nation’s Capital', stateCapital: 'Washington, D.C.', region: 'Mid-Atlantic' },
  yosemite: { code: 'CA', stateName: 'California', nickname: 'The Golden State', stateCapital: 'Sacramento', region: 'Sierra Nevada' },
  hawaii: { code: 'HI', stateName: 'Hawaii', nickname: 'The Aloha State', stateCapital: 'Honolulu', region: 'Pacific Islands' },
};

export function getUsStateMeta(destId: string): UsStateMeta | null {
  return US_STATE_BY_DEST_ID[destId] ?? EXTRA_US_FLAGS[destId] ?? null;
}

/**
 * Curated pool of ~72 recognizable world capitals & famous icons for Level 2 (Iconic World).
 */
export const ICONIC_WORLD_IDS: string[] = [
  // Europe
  'uk', 'france', 'italy', 'greece', 'spain', 'berlin', 'amsterdam', 'switzerland',
  'iceland', 'norway', 'sweden', 'ireland', 'portugal', 'austria', 'czechia', 'venice',
  'scotland', 'copenhagen', 'helsinki', 'turkey',
  // Africa
  'egypt', 'morocco', 'kenya', 'tanzania', 'south-africa', 'madagascar', 'ethiopia',
  'ghana', 'namibia', 'zambia', 'tunisia', 'rwanda',
  // Asia
  'japan', 'china', 'india', 'thailand', 'vietnam', 'south-korea', 'singapore',
  'bali', 'nepal', 'jordan', 'dubai', 'cambodia', 'philippines', 'kuala-lumpur', 'sri-lanka',
  // North America
  'new-york', 'san-francisco', 'washington-dc', 'grand-canyon', 'alaska', 'honolulu',
  'canada', 'mexico', 'costa-rica', 'cuba', 'jamaica',
  // South America
  'peru', 'brazil', 'rio', 'buenos-aires', 'galapagos', 'chile', 'colombia', 'patagonia',
  // Oceania & Antarctica
  'sydney', 'outback', 'great-barrier-reef', 'new-zealand', 'fiji', 'tahiti', 'antarctica',
];

export const MISSION_DIFFICULTY_INFO: Record<
  MissionDifficulty,
  {
    levelNum: number;
    label: string;
    shortLabel: string;
    scopeBadge: string;
    description: string;
  }
> = {
  usa: {
    levelNum: 1,
    label: 'Level 1 • Across the USA',
    shortLabel: '1. USA (50 States)',
    scopeBadge: '50 US STATES • ZOOMED US MAP',
    description:
      'Chase the thief across all 50 US states on a dedicated illustrated US map with a generous clock and state-level clues.',
  },
  'iconic-world': {
    levelNum: 2,
    label: 'Level 2 • Iconic World Tour',
    shortLabel: '2. Iconic World',
    scopeBadge: '70+ FAMOUS WORLD CITIES',
    description:
      'Classic global chase across recognizable capitals and wonders on every continent with a balanced Travel Clock.',
  },
  'full-world': {
    levelNum: 3,
    label: 'Level 3 • Full World Atlas',
    shortLabel: '3. Full World (247)',
    scopeBadge: 'ALL 247 GLOBAL & US CITIES',
    description:
      'Every corner of Earth is fair game—deep-cut countries, island chains, and a tighter Travel Clock!',
  },
  'time-warp': {
    levelNum: 4,
    label: 'Level 4 • Time-Warp Chase',
    shortLabel: '4. Time-Warp!',
    scopeBadge: '247 CITIES + 3 HISTORICAL ERAS',
    description:
      'The thief stole a Chrono-Balloon! Deduce BOTH which city they flew to AND which era (Ancient, Age of Sail, or Modern) to catch them!',
  },
};

export const ERA_INFO: Record<
  HistoricalEra,
  {
    id: HistoricalEra;
    label: string;
    shortLabel: string;
    years: string;
    tagline: string;
  }
> = {
  ancient: {
    id: 'ancient',
    label: 'Ancient World',
    shortLabel: 'Ancient',
    years: 'Before 1200 CE',
    tagline: 'Pyramids, empires, temples & first civilizations',
  },
  sail: {
    id: 'sail',
    label: 'Age of Sail & Silk',
    shortLabel: 'Age of Sail',
    years: '1200 – 1840 CE',
    tagline: 'Caravans, tall ships, castles & grand voyages',
  },
  modern: {
    id: 'modern',
    label: 'Industrial & Modern Era',
    shortLabel: 'Modern Era',
    years: '1840 – Today',
    tagline: 'Railways, rockets, bridges & living landmarks',
  },
};
