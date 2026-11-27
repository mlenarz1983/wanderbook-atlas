import { CURATED_QUESTIONS } from '../data/curatedQuestions';
import { DESTINATIONS, DESTINATIONS_BY_ID } from '../data/destinations';
import { getUsStateMeta } from '../data/destinations/usStatesMeta';
import type {
  CaseKind,
  CityLandmark,
  ClueIconKind,
  Destination,
  DifficultyLevel,
  HistoricalEra,
  MissionDifficulty,
  Player,
  QuizQuestion,
  SpotRole,
  SuspectProfile,
  WitnessClue,
} from '../types/game';

const LEVEL_RANK: Record<DifficultyLevel, number> = {
  explorer: 0,
  navigator: 1,
  cartographer: 2,
  scholar: 3,
};

export function getLowestCrewLevel(players: Player[]): DifficultyLevel {
  if (!players || players.length === 0) return 'explorer';
  let lowest: DifficultyLevel = 'scholar';
  for (const p of players) {
    if (LEVEL_RANK[p.defaultLevel] < LEVEL_RANK[lowest]) {
      lowest = p.defaultLevel;
    }
  }
  return lowest;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Removes obvious country-name prefixes from currency names (e.g., "Japanese Yen" -> "the Yen",
 * "Thai Baht" -> "the Baht") so witness clues stay fun puzzles without leaking the answer!
 */
function mysteryCurrencyName(dest: Destination): string {
  if (dest.currencyCode === 'NONE') return 'no official money (it is a peace treaty zone)';
  const parts = dest.currency.split(' ');
  const short = parts.length >= 2 ? parts[parts.length - 1] : dest.currency;
  if (['Dollar', 'Peso', 'Pound', 'Franc', 'Rupee', 'Shilling', 'Dinar', 'Krone', 'Krona', 'Kwacha'].includes(short)) {
    return `${short} (${dest.currencyCode})`;
  }
  return `${short} (${dest.currencyCode})`;
}

/**
 * Picks 3 plausible, non-duplicate distractor strings from other destinations.
 */
function pickPlausibleDistractors(
  target: Destination,
  extractor: (d: Destination) => string,
  level: DifficultyLevel
): [string, string, string] {
  const correct = extractor(target).trim();
  const others = DESTINATIONS.filter(
    (d) => d.id !== target.id && d.country !== target.country
  );

  const sameSubregion = shuffle(
    others.filter((d) => d.subregion === target.subregion)
  );
  const sameContinent = shuffle(
    others.filter(
      (d) => d.continent === target.continent && d.subregion !== target.subregion
    )
  );
  const globalPeers = shuffle(
    others.filter((d) => d.continent !== target.continent)
  );

  const orderedPool =
    level === 'scholar'
      ? [...sameSubregion, ...sameContinent, ...globalPeers]
      : level === 'cartographer'
        ? [...sameContinent, ...sameSubregion, ...globalPeers]
        : level === 'navigator'
          ? [...shuffle([...sameContinent, ...globalPeers])]
          : [...globalPeers, ...sameContinent];

  const picked: string[] = [];
  const seen = new Set<string>([correct.toLowerCase()]);

  for (const cand of orderedPool) {
    const val = extractor(cand).trim();
    if (!val || val.toLowerCase().startsWith('no ') || val.toLowerCase() === 'none') {
      continue;
    }
    const norm = val.toLowerCase();
    if (!seen.has(norm)) {
      seen.add(norm);
      picked.push(val);
      if (picked.length === 3) break;
    }
  }

  while (picked.length < 3) {
    picked.push(`World Option ${picked.length + 2}`);
  }
  return [picked[0], picked[1], picked[2]];
}

function buildFourChoices(
  correct: string,
  distractors: [string, string, string]
): { choices: [string, string, string, string]; correctIndex: number } {
  const list = shuffle([correct, ...distractors]);
  const correctIndex = list.indexOf(correct);
  return {
    choices: [list[0], list[1], list[2], list[3]],
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
  };
}

function mapRoleToDomain(role: SpotRole): 'harbor' | 'market' | 'archive' {
  if (role === 'harbor' || role === 'nature') return 'harbor';
  if (role === 'market') return 'market';
  return 'archive';
}

function buildDynamicQuestionsForSpot(
  dest: Destination,
  level: DifficultyLevel,
  spot: CityLandmark
): QuizQuestion[] {
  const pool: QuizQuestion[] = [];
  const hasRealCapital = !dest.capital.toLowerCase().startsWith('no ');
  const hasRealCurrency = dest.currencyCode !== 'NONE';
  const domain = mapRoleToDomain(spot.role);

  const addQ = (
    suffix: string,
    category: QuizQuestion['category'],
    prompt: string,
    correct: string,
    extractor: (d: Destination) => string,
    gentleHint: string,
    crewClue: string,
    almanacTip: string
  ) => {
    const distractors = pickPlausibleDistractors(dest, extractor, level);
    const { choices, correctIndex } = buildFourChoices(correct, distractors);
    pool.push({
      id: `dyn-${dest.id}-${level}-${suffix}`,
      destId: dest.id,
      level,
      category,
      prompt,
      choices,
      correctIndex,
      gentleHint,
      crewClue,
      almanacTip,
    });
  };

  // GEOGRAPHY / NATURE / WATERWAYS (Harbor & Nature spots)
  if (domain === 'harbor') {
    if (level === 'explorer') {
      addQ(
        'continent',
        'geography',
        `Stopping at ${spot.name} in ${dest.name}! Which continent are we visiting right now?`,
        dest.continent,
        (d) => d.continent,
        `Check where our balloon is parked on the atlas—or look up ${dest.country} in the free Field Guide!`,
        `Crew Tip: ${dest.country} sits in ${dest.subregion}.`,
        `Open ${dest.name} in the Atlas Field Guide.`
      );
      addQ(
        'waterway-exp',
        'geography',
        `At ${spot.name}, ${spot.witnessTitle} asks: which river, sea, or ocean shapes ${dest.name}?`,
        dest.waterway,
        (d) => d.waterway,
        `Check the Waterway line for ${dest.name} in the free Field Guide!`,
        `Crew Tip: Think about the waters bordering ${dest.subregion}.`,
        `Look up ${dest.name} in the Field Guide.`
      );
      addQ(
        'landform-exp',
        'geography',
        `Looking out from ${spot.name}, which famous landform or landscape surrounds ${dest.name}?`,
        dest.landform,
        (d) => d.landform,
        `Think of the climate here: ${dest.climate}!`,
        `Crew Tip: Check Landform under ${dest.name} in the Field Guide.`,
        `Look up ${dest.name} in the Field Guide.`
      );
      addQ(
        'animal-exp',
        'wildlife',
        `Nature check at ${spot.name}! Which native animal friend might you spot near ${dest.name} (${dest.country})?`,
        dest.animalName,
        (d) => d.animalName,
        `Picture wildlife suited for ${dest.climate}!`,
        `Crew Tip: Check ${dest.name} in the Field Guide.`,
        `Look up ${dest.name} in the Field Guide.`
      );
    } else if (level === 'navigator') {
      addQ(
        'waterway-nav',
        'geography',
        `${spot.witnessTitle} at ${spot.name} checks your navigation log: which major waterway connects to ${dest.name}?`,
        dest.waterway,
        (d) => d.waterway,
        `This water belongs to ${dest.subregion} in ${dest.continent}.`,
        `Crew Tip: Verify ${dest.name}’s Waterway in the free Field Guide!`,
        `Check ${dest.name} in the Atlas Field Guide.`
      );
      addQ(
        'landform-nav',
        'geography',
        `Before sharing a clue at ${spot.name}, identify the signature landform of ${dest.name} (${dest.country}):`,
        dest.landform,
        (d) => d.landform,
        `Think about the terrain here: ${dest.climate}.`,
        `Crew Tip: Check ${dest.name} in the Field Guide.`,
        `Look up ${dest.name} in the Field Guide.`
      );
      addQ(
        'subregion-nav',
        'geography',
        `Which world subregion includes ${dest.name} (${dest.country})?`,
        dest.subregion,
        (d) => d.subregion,
        `It lies in ${dest.continent} around ${dest.latLabel}.`,
        `Crew Tip: Notice the latitude & longitude (${dest.latLabel})!`,
        `Check ${dest.country}’s Subregion in the Field Guide.`
      );
    } else {
      addQ(
        'waterway-adv',
        'geography',
        `At ${spot.name}, identify the exact waterway, strait, or sea linked to ${dest.name} (${dest.country}):`,
        dest.waterway,
        (d) => d.waterway,
        `Use the coordinates (${dest.latLabel}) in ${dest.subregion} to narrow it down.`,
        `Crew Tip: Check ${dest.country}’s Waterway in the free Field Guide!`,
        `Look up ${dest.name} in the Field Guide.`
      );
      addQ(
        'landform-adv',
        'geography',
        `Physical geography test at ${spot.name}: which geological feature defines ${dest.name}?`,
        dest.landform,
        (d) => d.landform,
        `Consider the terrain shaping ${dest.subregion} (${dest.climate}).`,
        `Crew Tip: Check ${dest.name}’s Landform in the free Field Guide.`,
        `Open ${dest.name} in the Field Guide.`
      );
      if (dest.borders.length > 0) {
        addQ(
          'borders-adv',
          'geography',
          `Border check at ${spot.name}: which accurately describes the borders or island geography of ${dest.country}?`,
          dest.borders.join(', '),
          (d) => d.borders.join(', '),
          `Picture ${dest.country} on the world atlas in ${dest.subregion}!`,
          `Crew Tip: Check Borders under ${dest.name} in the Field Guide.`,
          `Look up ${dest.name} in the Field Guide.`
        );
      }
      addQ(
        'reverse-geo-adv',
        'geography',
        `Reverse Atlas Challenge: Which destination pairs "${dest.landform}" with "${dest.waterway}"?`,
        `${dest.name} (${dest.country})`,
        (d) => `${d.name} (${d.country})`,
        `Look in ${dest.subregion} (${dest.hemisphere} Hemisphere).`,
        `Crew Tip: Search that waterway in the free Field Guide!`,
        `Search "${dest.waterway.split(' ')[0]}" in the Field Guide.`
      );
    }
  }

  // CULTURE / CURRENCY / FLAGS / FOOD / GREETINGS (Market spots)
  if (domain === 'market') {
    if (level === 'explorer') {
      addQ(
        'food-exp',
        'culture',
        `Mmm! Stopping at ${spot.name} in ${dest.name}—which yummy local food comes from ${dest.country}?`,
        dest.famousFood,
        (d) => d.famousFood,
        `Check Famous Food under ${dest.name} in the free Field Guide!`,
        `Crew Tip: Think about local ingredients grown in ${dest.subregion}.`,
        `Look up ${dest.name} in the Field Guide.`
      );
      addQ(
        'greeting-exp',
        'culture',
        `To say hello politely to ${spot.witnessTitle} at ${spot.name}, which greeting is used in ${dest.languages[0]}?`,
        dest.greeting,
        (d) => d.greeting,
        `This friendly hello comes from ${dest.languages[0]}!`,
        `Crew Tip: Check the Greeting line for ${dest.name} in the Field Guide!`,
        `Look up ${dest.name} in the Field Guide.`
      );
      addQ(
        'lang-exp',
        'culture',
        `Walking through ${spot.name}, which language will you hear people speaking around ${dest.name}?`,
        dest.languages[0],
        (d) => d.languages[0],
        `Think about languages spoken in ${dest.subregion}!`,
        `Crew Tip: Check Languages under ${dest.name} in the Field Guide.`,
        `Look up ${dest.name} in the Field Guide.`
      );
    } else if (level === 'navigator') {
      if (hasRealCurrency) {
        addQ(
          'currency-nav',
          'currency',
          `To trade with ${spot.witnessTitle} at ${spot.name}, which official currency is used in ${dest.country}?`,
          `${dest.currency} (${dest.currencyCode})`,
          (d) => `${d.currency} (${d.currencyCode})`,
          `Notice the 3-letter currency code—or check ${dest.country} in the free Field Guide!`,
          `Crew Tip: Currency is listed right at the top of ${dest.name}’s Field Guide card.`,
          `Look up ${dest.country}’s Currency in the Field Guide.`
        );
      }
      addQ(
        'flag-nav',
        'flag',
        `A banner flies above ${spot.name}! Which description matches the national flag of ${dest.country}?`,
        dest.flagDescription,
        (d) => d.flagDescription,
        `Check the colored flag swatch next to ${dest.country} in the free Field Guide!`,
        `Crew Tip: Look up ${dest.country}’s Flag description in the Field Guide.`,
        `Check ${dest.country} in the Field Guide.`
      );
      addQ(
        'food-nav',
        'culture',
        `Which beloved local dish would ${spot.witnessTitle} offer you at ${spot.name} (${dest.country})?`,
        dest.famousFood,
        (d) => d.famousFood,
        `Think of the culinary flavors of ${dest.subregion}!`,
        `Crew Tip: Look up ${dest.name} in the free Field Guide.`,
        `Check ${dest.name} in the Field Guide.`
      );
    } else {
      if (hasRealCurrency) {
        addQ(
          'currency-adv',
          'currency',
          `Foreign exchange test at ${spot.name}: which exact currency and ISO code are used in ${dest.country}?`,
          `${dest.currency} (${dest.currencyCode})`,
          (d) => `${d.currency} (${d.currencyCode})`,
          `Careful—all four choices are real currencies from neighboring or similar regions!`,
          `Crew Tip: Verify ${dest.country}’s currency code in the free Field Guide.`,
          `Look up ${dest.country} in the Field Guide.`
        );
      }
      addQ(
        'flag-adv',
        'flag',
        `Vexillology check at ${spot.name}! Which exact national flag flies over ${dest.country}?`,
        dest.flagDescription,
        (d) => d.flagDescription,
        `Watch stripe directions and emblems—neighboring nations often share colors!`,
        `Crew Tip: Inspect ${dest.country}’s Flag entry in the free Field Guide.`,
        `Check ${dest.country} in the Field Guide.`
      );
      addQ(
        'lang-adv',
        'culture',
        `Which set of languages is officially or widely spoken around ${dest.name} (${dest.country})?`,
        dest.languages.join(', '),
        (d) => d.languages.join(', '),
        `Remember regional and Indigenous languages of ${dest.subregion}!`,
        `Crew Tip: Check ${dest.name}’s Languages in the Field Guide.`,
        `Look up ${dest.name} in the Field Guide.`
      );
    }
  }

  // HISTORY / WONDERS / CAPITALS (Archive & Landmark spots)
  if (domain === 'archive') {
    const m0 = dest.history[0];
    const m1 = dest.history[1];

    if (level === 'explorer') {
      addQ(
        'wonder-exp',
        'history',
        `Visiting ${spot.name}! Which famous wonder or special sight is ${dest.name} celebrated for?`,
        dest.worldWonder,
        (d) => d.worldWonder,
        `Think about what travelers come from around the world to see in ${dest.country}!`,
        `Crew Tip: Check World Wonder under ${dest.name} in the Field Guide.`,
        `Look up ${dest.name} in the Field Guide.`
      );
      if (hasRealCapital) {
        addQ(
          'capital-exp',
          'capital',
          `${spot.witnessTitle} at ${spot.name} unfolds a map! What is the capital city of ${dest.country}?`,
          dest.capital,
          (d) => d.capital,
          `Check Capital right at the top of ${dest.country}’s Field Guide card!`,
          `Crew Tip: Every country’s capital is listed in the free Field Guide.`,
          `Look up ${dest.country} in the Field Guide.`
        );
      }
      addQ(
        'hist-exp',
        'history',
        `History mystery at ${spot.name} (${m0.era}): which real story from the past happened in ${dest.name}?`,
        m0.title,
        (d) => d.history[0].title,
        `Check ${dest.name}’s Historical Timeline in the free Field Guide!`,
        `Crew Tip: Look for "${m0.era}" under ${dest.name} in the Field Guide.`,
        `Open ${dest.name} in the Field Guide.`
      );
    } else if (level === 'navigator') {
      if (hasRealCapital) {
        addQ(
          'capital-nav',
          'capital',
          `At ${spot.name}, name the official capital city of ${dest.country} to unlock the witness’s note:`,
          dest.capital,
          (d) => d.capital,
          `Watch out—a country’s capital isn’t always its biggest city!`,
          `Crew Tip: Check ${dest.country}’s Capital in the free Field Guide.`,
          `Look up ${dest.country} in the Field Guide.`
        );
      }
      addQ(
        'hist-nav-0',
        'history',
        `${spot.witnessTitle} pulls an archive record from "${m0.era}" in ${dest.name}. Which real event does it describe?`,
        m0.title,
        (d) => d.history[0].title,
        `Think about the history of ${dest.country} (${dest.subregion}).`,
        `Crew Tip: Read ${dest.name}’s Historical Timeline in the Field Guide!`,
        `Check ${dest.name} in the Field Guide.`
      );
      addQ(
        'wonder-nav',
        'history',
        `Which celebrated landmark or natural marvel draws explorers to ${dest.name} (${dest.country})?`,
        dest.worldWonder,
        (d) => d.worldWonder,
        `Check ${dest.name} in the Field Guide!`,
        `Crew Tip: Look at World Wonder under ${dest.name}.`,
        `Look up ${dest.name} in the Field Guide.`
      );
    } else {
      if (hasRealCapital) {
        addQ(
          'capital-adv',
          'capital',
          `Diplomatic archive check at ${spot.name}: what is the official capital city of ${dest.country}?`,
          dest.capital,
          (d) => d.capital,
          `Careful—all four options are real capitals from this region!`,
          `Crew Tip: Verify ${dest.country}’s capital in the free Field Guide.`,
          `Look up ${dest.country} in the Field Guide.`
        );
      }
      addQ(
        'hist-adv-1',
        'history',
        `Archive challenge at ${spot.name} (${m1.era}): which real historical milestone belongs to ${dest.name} (${dest.country})?`,
        m1.title,
        (d) => d.history[1].title,
        `Connect the era (${m1.era}) with ${dest.subregion}’s history.`,
        `Crew Tip: Check ${dest.name}’s second historical milestone in the Field Guide!`,
        `Open ${dest.name} in the Field Guide.`
      );
      addQ(
        'hist-era-adv',
        'history',
        `Chronology test at ${spot.name}: around which era did "${m0.title}" take place in ${dest.country}?`,
        m0.era,
        (d) => d.history[0].era,
        `Place "${m0.title}" on the timeline of world history!`,
        `Crew Tip: Check ${dest.name}’s Historical Timeline in the free Field Guide.`,
        `Look up "${m0.title}" in the Field Guide.`
      );
    }
  }

  return pool;
}

export function selectSpotQuestion(params: {
  destId: string;
  level: DifficultyLevel;
  spot: CityLandmark;
  seenQuestionIds: string[];
}): QuizQuestion {
  const { destId, level, spot, seenQuestionIds } = params;
  const dest = DESTINATIONS_BY_ID[destId] ?? DESTINATIONS[0];
  const seenSet = new Set(seenQuestionIds);

  const exactCurated = CURATED_QUESTIONS.filter(
    (q) => q.destId === dest.id && q.level === level
  );
  const regionalCurated = CURATED_QUESTIONS.filter(
    (q) =>
      q.level === level &&
      q.destId !== dest.id &&
      DESTINATIONS_BY_ID[q.destId]?.continent === dest.continent
  );
  const dynamicSpot = buildDynamicQuestionsForSpot(dest, level, spot);

  const combined = [
    ...exactCurated,
    ...shuffle(dynamicSpot),
    ...shuffle(regionalCurated),
  ];
  const unseen = combined.filter((q) => !seenSet.has(q.id));
  const chosen =
    unseen.length > 0
      ? unseen[0]
      : combined[Math.floor(Math.random() * combined.length)];

  const correctAnswer = chosen.choices[chosen.correctIndex];
  const reshuffled = shuffle([...chosen.choices]);
  return {
    ...chosen,
    choices: [reshuffled[0], reshuffled[1], reshuffled[2], reshuffled[3]],
    correctIndex: reshuffled.indexOf(correctAnswer),
  };
}

/**
 * Generates a witness clue whose phrasing automatically accommodates the LOWEST-LEVEL
 * explorer on the team (`clueLevel`), includes a Spartan SVG icon (`ClueIconKind`),
 * tailors clues specifically for US States in Level 1 (`usa`), and adds Historical Era
 * clues in Level 4 (`time-warp`)!
 */
export function generateWitnessClue(params: {
  spot: CityLandmark;
  nextDest: Destination | null;
  culprit: SuspectProfile;
  caseKind: CaseKind;
  missionDifficulty: MissionDifficulty;
  targetEra?: HistoricalEra | null;
  clueLevel: DifficultyLevel;
  discoveredTraits: Partial<
    Record<'accessory' | 'favoriteTreat' | 'companion' | 'hobby', string>
  >;
  dropSuspectTrait: boolean;
}): WitnessClue {
  const {
    spot,
    nextDest,
    culprit,
    missionDifficulty,
    targetEra,
    clueLevel,
    discoveredTraits,
    dropSuspectTrait,
  } = params;

  let suspectClue: string | null = null;
  let suspectTraitKey: 'accessory' | 'favoriteTreat' | 'companion' | 'hobby' | undefined;
  let suspectTraitValue: string | undefined;

  if (dropSuspectTrait) {
    const allTraits: Array<{
      key: 'accessory' | 'favoriteTreat' | 'companion' | 'hobby';
      value: string;
      line: string;
    }> = [
      {
        key: 'accessory',
        value: culprit.accessory,
        line: `Spotted wearing/carrying ${culprit.accessory}!`,
      },
      {
        key: 'favoriteTreat',
        value: culprit.favoriteTreat,
        line: `Stopped to snack on ${culprit.favoriteTreat}!`,
      },
      {
        key: 'companion',
        value: culprit.companion,
        line: `Traveling right alongside ${culprit.companion}!`,
      },
      {
        key: 'hobby',
        value: culprit.hobby,
        line: `Overheard talking about ${culprit.hobby}!`,
      },
    ];

    const missing = allTraits.filter((t) => !discoveredTraits[t.key]);
    const pick =
      missing.length > 0
        ? missing[Math.floor(Math.random() * missing.length)]
        : allTraits[Math.floor(Math.random() * allTraits.length)];
    suspectClue = pick.line;
    suspectTraitKey = pick.key;
    suspectTraitValue = pick.value;
  }

  // FINAL CITY
  if (!nextDest) {
    return {
      spotId: spot.id,
      spotTitle: spot.name,
      witnessName: spot.witnessTitle,
      icon: 'suspect',
      destinationClue: `“STOP! The culprit never left town! They were just spotted right near ${spot.name}—issue your Case Warrant!”`,
      eraClue: null,
      suspectClue,
      suspectTraitKey,
      suspectTraitValue,
    };
  }

  // Optional Level 4 Time-Warp Era Clue (Ancient / Age of Sail / Modern)
  let eraClue: string | null = null;
  if (missionDifficulty === 'time-warp' && targetEra) {
    if (targetEra === 'ancient') {
      eraClue =
        clueLevel === 'explorer'
          ? 'Chrono-Dial Clue: Their time balloon jumped WAY back to the Ancient World (pyramids, stone temples, before 1200 CE)!'
          : 'Chrono-Dial Clue: Temporal ripple traced to the Ancient World (before 1200 CE — ancient empires, carvings & first cities).';
    } else if (targetEra === 'sail') {
      eraClue =
        clueLevel === 'explorer'
          ? 'Chrono-Dial Clue: They warped into the Age of Sail & Silk (tall wooden ships, castles & caravans, 1200–1840 CE)!'
          : 'Chrono-Dial Clue: Temporal ripple traced to the Age of Sail & Silk (1200–1840 CE — trade caravans, galleons & charters).';
    } else {
      eraClue =
        clueLevel === 'explorer'
          ? 'Chrono-Dial Clue: They jumped into the Industrial & Modern Era (trains, rockets & modern landmarks, 1840–Today)!'
          : 'Chrono-Dial Clue: Temporal ripple traced to the Industrial & Modern Era (1840–Today — railways, bridges & modern wonders).';
    }
  }

  const domain = mapRoleToDomain(spot.role);
  const usMeta = missionDifficulty === 'usa' ? getUsStateMeta(nextDest.id) : null;
  let destinationClue = '';
  let icon: ClueIconKind = 'geography';

  // LEVEL 1: ACROSS THE USA (50 STATES) — tailored US state clues (never redundant USD/North America!)
  if (missionDifficulty === 'usa' && usMeta) {
    if (spot.role === 'harbor' || spot.role === 'nature') {
      icon = spot.role === 'nature' ? 'wildlife' : 'geography';
      destinationClue =
        clueLevel === 'explorer'
          ? `“They flew toward the ${usMeta.region}! Look for a state known as ‘${usMeta.nickname}’ near ${nextDest.waterway}!”`
          : `“Flight path heads to the ${usMeta.region}—aimed right near ${nextDest.waterway} and ${nextDest.landform}.”`;
    } else if (spot.role === 'market') {
      icon = Math.random() < 0.5 ? 'food' : 'flag';
      destinationClue =
        icon === 'food'
          ? `“They were craving ${nextDest.famousFood} and bragging about visiting ‘${usMeta.nickname}’!”`
          : `“Their suitcase bore a state flag with ${nextDest.flagDescription}, headed toward state capital ${usMeta.stateCapital}!”`;
    } else if (spot.role === 'landmark') {
      icon = 'landmark';
      destinationClue = `“They bought a postcard of ${nextDest.worldWonder} and said their next stop is in the ${usMeta.region}!”`;
    } else {
      icon = 'flag';
      const m = nextDest.history[0];
      destinationClue =
        clueLevel === 'explorer'
          ? `“They read a story about ‘${m.title}’ and carried a flag showing ${nextDest.flagDescription}!”`
          : `“Archive request for ‘${m.title}’ (${m.era})—state capital is ${usMeta.stateCapital} (${usMeta.region}).”`;
    }
  } else {
    // GLOBAL WORLD MODES (Iconic World / Full World / Time-Warp)
    const mysteryMoney = mysteryCurrencyName(nextDest);

    if (clueLevel === 'explorer') {
      if (domain === 'harbor') {
        icon = spot.role === 'nature' ? 'wildlife' : 'geography';
        destinationClue = `“I saw the thief flying toward ${nextDest.continent}! Look for a place with ${nextDest.climate} where you might meet a ${nextDest.animalName}!”`;
      } else if (domain === 'market') {
        icon = 'currency';
        destinationClue = `“They traded their coins for ${mysteryMoney}, smiled while saying ‘${nextDest.greeting}’, and packed a flag with ${nextDest.flagDescription}!”`;
      } else {
        icon = spot.role === 'landmark' ? 'landmark' : 'food';
        destinationClue = `“They were super excited to visit ${nextDest.worldWonder} in ${nextDest.continent} and try ${nextDest.famousFood}!”`;
      }
    } else if (clueLevel === 'navigator') {
      if (domain === 'harbor') {
        icon = 'geography';
        destinationClue = `“They charted a flight to ${nextDest.continent} (${nextDest.hemisphere} Hemisphere), heading near ${nextDest.waterway} and ${nextDest.landform}.”`;
      } else if (domain === 'market') {
        icon = 'flag';
        destinationClue = `“They exchanged money for ${mysteryMoney}, practiced saying ‘${nextDest.greeting}’ in ${nextDest.languages[0]}, and carried a flag with ${nextDest.flagDescription}.”`;
      } else {
        icon = 'landmark';
        const m = nextDest.history[0];
        destinationClue = `“They checked out our story about ‘${m.title}’ (${m.era}) and wanted to see ${nextDest.worldWonder}!”`;
      }
    } else {
      if (domain === 'harbor') {
        icon = 'geography';
        destinationClue = `“Flight log points to ${nextDest.subregion} (${nextDest.latLabel})—heading straight toward ${nextDest.waterway} and ${nextDest.landform}.”`;
      } else if (domain === 'market') {
        icon = 'currency';
        destinationClue = `“Currency receipt shows ${mysteryMoney}. Luggage tag featured ${nextDest.flagDescription}, and they spoke ${nextDest.languages[0]}.”`;
      } else {
        icon = missionDifficulty === 'time-warp' ? 'era' : 'landmark';
        const m = Math.random() < 0.5 ? nextDest.history[0] : nextDest.history[1];
        const capBit = !nextDest.capital.toLowerCase().startsWith('no ')
          ? ` near capital ${nextDest.capital}`
          : '';
        destinationClue = `“Archive slip requested records from ${m.era} (‘${m.title}’)${capBit}. Compare your 5 options in the Field Guide!”`;
      }
    }
  }

  return {
    spotId: spot.id,
    spotTitle: spot.name,
    witnessName: spot.witnessTitle,
    icon,
    destinationClue,
    eraClue,
    suspectClue,
    suspectTraitKey,
    suspectTraitValue,
  };
}
