import { CURATED_QUESTIONS } from '../data/curatedQuestions';
import { DESTINATIONS, DESTINATIONS_BY_ID } from '../data/destinations';
import type {
  CaseKind,
  Destination,
  DifficultyLevel,
  QuizQuestion,
  SuspectProfile,
  TownSpotId,
  WitnessClue,
} from '../types/game';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Picks 3 plausible, non-duplicate distractor strings from other destinations.
 * On Cartographer & Master Scholar, heavily prioritizes same-continent / same-subregion
 * peers so distractors are genuinely challenging and never silly giveaways!
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

  // Fallback just in case
  while (picked.length < 3) {
    picked.push(`Option ${picked.length + 2}`);
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

/**
 * Dynamically builds a rich pool of multi-facet, real-world questions for ANY
 * of our 100 destinations across all 4 serious skill tiers.
 */
function buildDynamicQuestionsForDestination(
  dest: Destination,
  level: DifficultyLevel,
  spotId: TownSpotId
): QuizQuestion[] {
  const pool: QuizQuestion[] = [];
  const hasRealCapital = !dest.capital.toLowerCase().startsWith('no ');
  const hasRealCurrency = dest.currencyCode !== 'NONE';

  // Helper to push a constructed question cleanly
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

  // -------------------------------------------------------------------------
  // HARBOR / STATION SPOT — Geography, Waterways, Landforms, Continents, Borders
  // -------------------------------------------------------------------------
  if (spotId === 'harbor') {
    if (level === 'explorer') {
      addQ(
        'continent',
        'geography',
        `Look at our World Atlas! Which continent are we visiting right now in ${dest.name} (${dest.country})?`,
        dest.continent,
        (d) => d.continent,
        `Check where our hot-air balloon is parked on the atlas—or look up ${dest.country} in the free Field Guide!`,
        `Crew Tip: ${dest.country} is in ${dest.subregion}.`,
        `Open ${dest.name} in the Atlas Field Guide.`
      );
      addQ(
        'waterway-exp',
        'geography',
        `Harbor check in ${dest.name}! Which famous waterway, river, or sea shapes this destination?`,
        dest.waterway,
        (d) => d.waterway,
        `Sailors around ${dest.country} know this water well—peek at ${dest.name} in the Field Guide!`,
        `Crew Tip: Think about what waters lie beside ${dest.subregion}.`,
        `Look at "Waterway" under ${dest.name} in the Field Guide.`
      );
      addQ(
        'landform-exp',
        'geography',
        `Looking out from our hot-air balloon over ${dest.name}, which dramatic landform rises across this landscape?`,
        dest.landform,
        (d) => d.landform,
        `Picture the scenery of ${dest.country} (${dest.climate})!`,
        `Crew Tip: Check the Landform line for ${dest.name} in the free Field Guide.`,
        `Look up ${dest.name} in the Atlas Field Guide.`
      );
    }

    if (level === 'navigator') {
      addQ(
        'waterway-nav',
        'geography',
        `Before the Harbor Master shares a travel lead in ${dest.country}, identify the major waterway connected to ${dest.name}:`,
        dest.waterway,
        (d) => d.waterway,
        `This waterway is closely tied to ${dest.subregion} in ${dest.continent}.`,
        `Crew Tip: Open the free Field Guide and look up ${dest.name}’s Waterway!`,
        `Check ${dest.name} in the Atlas Field Guide.`
      );
      addQ(
        'landform-nav',
        'geography',
        `Which signature natural landform defines the region around ${dest.name} (${dest.country})?`,
        dest.landform,
        (d) => d.landform,
        `Think about the climate here: ${dest.climate}.`,
        `Crew Tip: Check ${dest.country} in the Field Guide to compare landforms.`,
        `Look up ${dest.name} in the Atlas Field Guide.`
      );
      addQ(
        'subregion-nav',
        'geography',
        `In cartography, which specific world subregion includes ${dest.name} (${dest.country})?`,
        dest.subregion,
        (d) => d.subregion,
        `It is part of ${dest.continent}, located at ${dest.latLabel}.`,
        `Crew Tip: Notice the latitude & longitude (${dest.latLabel})!`,
        `Check ${dest.country}’s Subregion in the Field Guide.`
      );
    }

    if (level === 'cartographer' || level === 'scholar') {
      addQ(
        'waterway-adv',
        'geography',
        `Harbor navigation check: which waterway, strait, or sea is directly associated with ${dest.name} (${dest.country})?`,
        dest.waterway,
        (d) => d.waterway,
        `Consider the exact coordinates (${dest.latLabel}) in ${dest.subregion}.`,
        `Crew Tip: Compare ${dest.country}’s neighbors in the Field Guide to pinpoint the water!`,
        `Verify ${dest.name}’s Waterway in the Atlas Field Guide.`
      );
      addQ(
        'landform-adv',
        'geography',
        `Physical geography test: which defining geological feature or landform lies in ${dest.name} (${dest.country})?`,
        dest.landform,
        (d) => d.landform,
        `Think of the terrain shaping ${dest.subregion} (${dest.climate}).`,
        `Crew Tip: Use the free Field Guide if you want to verify the exact landform name!`,
        `Open ${dest.name} in the Atlas Field Guide.`
      );
      if (dest.borders.length > 0) {
        const borderText = dest.borders.join(', ');
        addQ(
          'borders-adv',
          'geography',
          `Border cartography check! Which of these accurately describes the borders or island geography of ${dest.country}?`,
          borderText,
          (d) => d.borders.join(', '),
          `Picture ${dest.country} on the world map in ${dest.subregion}!`,
          `Crew Tip: Trace ${dest.country}’s boundaries on the Atlas or in the Field Guide.`,
          `Check "Borders" under ${dest.name} in the Field Guide.`
        );
      }
      addQ(
        'reverse-geo-adv',
        'geography',
        `Cartographer’s Reverse Lookup: Which destination features "${dest.landform}" alongside "${dest.waterway}"?`,
        `${dest.name} (${dest.country})`,
        (d) => `${d.name} (${d.country})`,
        `This spot sits in ${dest.subregion} (${dest.hemisphere} Hemisphere).`,
        `Crew Tip: Search that landform or waterway right inside the free Atlas Field Guide!`,
        `Use the Field Guide search bar to look up "${dest.waterway.split(' ')[0]}".`
      );
    }
  }

  // -------------------------------------------------------------------------
  // MARKET / BAKERY SPOT — Currencies, Languages, Flags, Wildlife, Cuisine
  // -------------------------------------------------------------------------
  if (spotId === 'market') {
    if (level === 'explorer') {
      addQ(
        'food-exp',
        'culture',
        `Mmm—something smells delicious at the local market in ${dest.name}! Which famous local dish or treat belongs to ${dest.country}?`,
        dest.famousFood,
        (d) => d.famousFood,
        `Ask the local baker—or check ${dest.country}’s Famous Food in the free Field Guide!`,
        `Crew Tip: Think about ingredients grown in ${dest.subregion}.`,
        `Look up ${dest.name} in the Atlas Field Guide.`
      );
      addQ(
        'greeting-exp',
        'culture',
        `To be polite at the market in ${dest.name} (${dest.country}), how do locals say hello in ${dest.languages[0]}?`,
        dest.greeting,
        (d) => d.greeting,
        `This friendly greeting comes from ${dest.languages[0]}!`,
        `Crew Tip: Open ${dest.name} in the free Field Guide to practice saying hello!`,
        `Check "Local Greeting" under ${dest.name} in the Field Guide.`
      );
      addQ(
        'lang-exp',
        'culture',
        `Listen to the bustling market chatter in ${dest.name}! Which language is widely spoken in ${dest.country}?`,
        dest.languages[0],
        (d) => d.languages[0],
        `Think about what people speak in ${dest.subregion}!`,
        `Crew Tip: Check ${dest.country}’s Languages in the Field Guide.`,
        `Look up ${dest.name} in the Atlas Field Guide.`
      );
    }

    if (level === 'navigator') {
      if (hasRealCurrency) {
        addQ(
          'currency-nav',
          'currency',
          `To buy a snack and chat with the market vendor in ${dest.country}, which official currency will you need?`,
          `${dest.currency} (${dest.currencyCode})`,
          (d) => `${d.currency} (${d.currencyCode})`,
          `Notice the 3-letter currency code—or check ${dest.country} in the free Field Guide!`,
          `Crew Tip: Every country’s official currency is listed right at the top of its Field Guide card.`,
          `Look up ${dest.country}’s Currency in the Field Guide.`
        );
      }
      addQ(
        'flag-nav',
        'flag',
        `A banner flutters above the market square in ${dest.country}! Which description matches the national flag of ${dest.country}?`,
        dest.flagDescription,
        (d) => d.flagDescription,
        `Picture the flag colors of ${dest.country}—or peek at its flag swatch in the Field Guide!`,
        `Crew Tip: Open the Field Guide and check the colored flag icon next to ${dest.country}.`,
        `Check ${dest.country}’s Flag in the Atlas Field Guide.`
      );
      addQ(
        'food-nav',
        'culture',
        `Which beloved culinary specialty would a local market stall proudly serve you in ${dest.name} (${dest.country})?`,
        dest.famousFood,
        (d) => d.famousFood,
        `Think of the flavors and traditions of ${dest.subregion}.`,
        `Crew Tip: Check ${dest.name}’s Culinary Highlight in the Field Guide!`,
        `Look up ${dest.name} in the Field Guide.`
      );
    }

    if (level === 'cartographer' || level === 'scholar') {
      if (hasRealCurrency) {
        addQ(
          'currency-adv',
          'currency',
          `Foreign exchange desk challenge: which exact currency and ISO code are used in ${dest.country}?`,
          `${dest.currency} (${dest.currencyCode})`,
          (d) => `${d.currency} (${d.currencyCode})`,
          `Be careful—all four choices are real currencies from similar or neighboring regions!`,
          `Crew Tip: Verify ${dest.country}’s currency code in the free Field Guide.`,
          `Look up ${dest.country} in the Atlas Field Guide.`
        );
      }
      addQ(
        'flag-adv',
        'flag',
        `Vexillology check! Which exact flag design flies over ${dest.country}?`,
        dest.flagDescription,
        (d) => d.flagDescription,
        `Look closely at the symbols and stripe directions—regional neighbors often share colors!`,
        `Crew Tip: Open ${dest.country} in the Field Guide to inspect its flag description.`,
        `Check ${dest.country}’s Flag in the Field Guide.`
      );
      addQ(
        'lang-adv',
        'culture',
        `Which combination of languages is officially or widely spoken in ${dest.name} (${dest.country})?`,
        dest.languages.join(', '),
        (d) => d.languages.join(', '),
        `Think about both national and regional/Indigenous languages of ${dest.subregion}.`,
        `Crew Tip: Check ${dest.name}’s Languages in the Field Guide.`,
        `Look up ${dest.name} in the Field Guide.`
      );
    }
  }

  // -------------------------------------------------------------------------
  // ARCHIVE / MUSEUM SPOT — Real History, World Wonders, Capitals
  // -------------------------------------------------------------------------
  if (spotId === 'archive') {
    const m0 = dest.history[0];
    const m1 = dest.history[1];

    if (level === 'explorer') {
      addQ(
        'wonder-exp',
        'history',
        `Inside the ${dest.name} museum, the archivist asks: which famous World Wonder or landmark is ${dest.name} celebrated for?`,
        dest.worldWonder,
        (d) => d.worldWonder,
        `Think about what travelers from all over Earth come to ${dest.country} to see!`,
        `Crew Tip: Check ${dest.name}’s World Wonder in the free Field Guide.`,
        `Look up ${dest.name} in the Atlas Field Guide.`
      );
      if (hasRealCapital) {
        addQ(
          'capital-exp',
          'capital',
          `The Archivist opens a map of ${dest.country}! What is the capital city of ${dest.country}?`,
          dest.capital,
          (d) => d.capital,
          `Every country’s capital is marked with a star—check ${dest.country} in the Field Guide!`,
          `Crew Tip: Look right at the top of ${dest.country}’s Almanac card!`,
          `Look up ${dest.country}’s Capital in the Field Guide.`
        );
      }
      addQ(
        'hist-exp',
        'history',
        `Archive story check (${m0.era})! Which real historical milestone belongs right here to ${dest.name} (${dest.country})?`,
        m0.title,
        (d) => d.history[0].title,
        `Think about ${dest.country}’s past—or read ${dest.name}’s Time-Travel Archive in the Field Guide!`,
        `Crew Tip: Open ${dest.name} in the Field Guide and check the "${m0.era}" milestone.`,
        `Check ${dest.name}’s History section in the Field Guide.`
      );
    }

    if (level === 'navigator') {
      if (hasRealCapital) {
        addQ(
          'capital-nav',
          'capital',
          `To unlock the museum ledger in ${dest.name}, name the official capital city of ${dest.country}:`,
          dest.capital,
          (d) => d.capital,
          `Careful—the capital isn’t always the largest or most famous city!`,
          `Crew Tip: Check ${dest.country}’s Almanac entry in the free Field Guide.`,
          `Look up ${dest.country}’s Capital in the Field Guide.`
        );
      }
      addQ(
        'hist-nav-0',
        'history',
        `The Archivist pulls a scroll dated "${m0.era}" from ${dest.name}. Which real historical event does it describe?`,
        m0.title,
        (d) => d.history[0].title,
        `Remember where we are: ${dest.name}, ${dest.country} (${dest.subregion}).`,
        `Crew Tip: Look up ${dest.name} in the Field Guide to read its historical timeline!`,
        `Check ${dest.name}’s History milestones in the Field Guide.`
      );
      addQ(
        'wonder-nav',
        'history',
        `Which UNESCO-caliber wonder or landmark draws explorers to ${dest.name} (${dest.country})?`,
        dest.worldWonder,
        (d) => d.worldWonder,
        `Think of ${dest.country}’s iconic sites and natural marvels!`,
        `Crew Tip: Check ${dest.name} in the Field Guide.`,
        `Look up ${dest.name} in the Atlas Field Guide.`
      );
    }

    if (level === 'cartographer' || level === 'scholar') {
      if (hasRealCapital) {
        addQ(
          'capital-adv',
          'capital',
          `Diplomatic archive check: what is the official capital city of ${dest.country}?`,
          dest.capital,
          (d) => d.capital,
          `Watch out for tricky capitals—all four options are real capitals from this part of the world!`,
          `Crew Tip: Check ${dest.country}’s card in the free Field Guide.`,
          `Look up ${dest.country} in the Atlas Field Guide.`
        );
      }
      addQ(
        'hist-adv-1',
        'history',
        `Historical archive challenge (${m1.era}): which real historical milestone is tied to ${dest.name} (${dest.country})?`,
        m1.title,
        (d) => d.history[1].title,
        `Connect the date (${m1.era}) with the history of ${dest.subregion}.`,
        `Crew Tip: Open ${dest.name}’s History Timeline in the Field Guide to learn the full story!`,
        `Check ${dest.name}’s second historical milestone in the Field Guide.`
      );
      addQ(
        'hist-era-adv',
        'history',
        `Chronology check! Around which era did "${m0.title}" take place in ${dest.country}?`,
        m0.era,
        (d) => d.history[0].era,
        `Place "${m0.title}" on the grand timeline of world history!`,
        `Crew Tip: Check ${dest.name}’s Historical Timeline in the free Field Guide.`,
        `Look up "${m0.title}" under ${dest.name} in the Field Guide.`
      );
    }
  }

  return pool;
}

/**
 * Selects the best unseen 4-choice challenge for the current city, town spot, and opt-in skill tier.
 * Prioritizes bespoke curated questions matching the destination & tier, then our massive dynamic bank,
 * always avoiding recently seen question IDs!
 */
export function selectSpotQuestion(params: {
  destId: string;
  level: DifficultyLevel;
  spotId: TownSpotId;
  seenQuestionIds: string[];
}): QuizQuestion {
  const { destId, level, spotId, seenQuestionIds } = params;
  const dest = DESTINATIONS_BY_ID[destId] ?? DESTINATIONS[0];
  const seenSet = new Set(seenQuestionIds);

  // 1. Check bespoke curated questions for this exact destination & tier first
  const exactCurated = CURATED_QUESTIONS.filter(
    (q) => q.destId === dest.id && q.level === level
  );

  // 2. Also include nearby curated questions of the same tier on Scholar/Cartographer for extra spice!
  const regionalCurated = CURATED_QUESTIONS.filter(
    (q) =>
      q.level === level &&
      q.destId !== dest.id &&
      DESTINATIONS_BY_ID[q.destId]?.continent === dest.continent
  );

  // 3. Build all dynamic questions for this destination + spot + tier
  const dynamicSpot = buildDynamicQuestionsForDestination(dest, level, spotId);

  // Combine with priority: exact curated -> dynamic spot -> regional curated
  const combined = [...exactCurated, ...shuffle(dynamicSpot), ...shuffle(regionalCurated)];
  const unseen = combined.filter((q) => !seenSet.has(q.id));

  const chosen =
    unseen.length > 0
      ? unseen[0]
      : combined[Math.floor(Math.random() * combined.length)];

  // Re-shuffle choices on curated questions too so correct answer isn't always index 0!
  const correctAnswer = chosen.choices[chosen.correctIndex];
  const reshuffled = shuffle([...chosen.choices]);
  return {
    ...chosen,
    choices: [reshuffled[0], reshuffled[1], reshuffled[2], reshuffled[3]],
    correctIndex: reshuffled.indexOf(correctAnswer),
  };
}

const WITNESS_NAMES: Record<TownSpotId, string[]> = {
  harbor: ['Harbor Master Kai', 'Station Chief Elena', 'Pilot Mateo', 'Dockkeeper Nuru'],
  market: ['Baker Sofia', 'Spice Merchant Tariq', 'Bookbinder Hana', 'Florist Mei'],
  archive: ['Curator Dr. Vance', 'Archivist Priya', 'Historian Tomas', 'Librarian Amara'],
};

export const TOWN_SPOTS: {
  id: TownSpotId;
  title: string;
  subtitle: string;
  clockHours: number;
}[] = [
  {
    id: 'harbor',
    title: 'Harbor & Airfield',
    subtitle: 'Geography, waterways & flight logs',
    clockHours: 3,
  },
  {
    id: 'market',
    title: 'Grand Market & Bakery',
    subtitle: 'Currencies, flags, foods & wildlife',
    clockHours: 3,
  },
  {
    id: 'archive',
    title: 'History Archive & Museum',
    subtitle: 'Ancient timelines, wonders & capitals',
    clockHours: 3,
  },
];

/**
 * Generates a genuine Carmen Sandiego-style deductive witness clue!
 * Points to `nextDest` WITHOUT giving away the country name directly on higher tiers,
 * rewarding players who think geographically OR consult the free Atlas Field Guide!
 */
export function generateWitnessClue(params: {
  spotId: TownSpotId;
  nextDest: Destination | null; // null when ALREADY at the final city!
  culprit: SuspectProfile;
  caseKind: CaseKind;
  level: DifficultyLevel;
  discoveredTraits: Partial<
    Record<'accessory' | 'favoriteTreat' | 'companion' | 'hobby', string>
  >;
  dropSuspectTrait: boolean;
}): WitnessClue {
  const {
    spotId,
    nextDest,
    culprit,
    caseKind,
    level,
    discoveredTraits,
    dropSuspectTrait,
  } = params;

  const spotMeta = TOWN_SPOTS.find((s) => s.id === spotId) ?? TOWN_SPOTS[0];
  const witnessList = WITNESS_NAMES[spotId];
  const witnessName = witnessList[Math.floor(Math.random() * witnessList.length)];

  const subjectWord =
    caseKind === 'wonder-chase'
      ? 'the sneaky suspect'
      : caseKind === 'lost-explorer'
        ? 'the missing explorer'
        : 'the rare creature’s tracker';

  // Pick an undiscovered suspect trait to drop if requested
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
        line: `Spotted a distinctive detail: they had ${culprit.accessory}!`,
      },
      {
        key: 'favoriteTreat',
        value: culprit.favoriteTreat,
        line: `They couldn’t resist stopping for ${culprit.favoriteTreat}!`,
      },
      {
        key: 'companion',
        value: culprit.companion,
        line: `Right beside them was ${culprit.companion}!`,
      },
      {
        key: 'hobby',
        value: culprit.hobby,
        line: `A bystander overheard them talking about ${culprit.hobby}!`,
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

  // FINAL CITY: Confirm the target is right here in town!
  if (!nextDest) {
    const finaleLines: Record<TownSpotId, string> = {
      harbor: `“Hold your balloon ropes! No outward flights departed—${subjectWord} is STILL hiding right here in town!”`,
      market: `“Just ten minutes ago ${subjectWord} darted past my stall! Check your Case Dossier and issue the Warrant!”`,
      archive: `“They haven’t left! Footprints lead straight toward the main landmark here—lock in your Suspect Warrant to finish the case!”`,
    };
    return {
      spotId,
      spotTitle: spotMeta.title,
      witnessName,
      destinationClue: finaleLines[spotId],
      suspectClue,
      suspectTraitKey,
      suspectTraitValue,
    };
  }

  // INTERMEDIATE CITY: Generate a real Carmen Sandiego geographical/cultural/historical deduction clue!
  let destinationClue = '';

  if (spotId === 'harbor') {
    if (level === 'explorer') {
      destinationClue = `“I saw ${subjectWord} heading toward ${nextDest.continent}! They packed gear for ${nextDest.climate} and asked for maps of ${nextDest.landform}.”`;
    } else if (level === 'navigator') {
      destinationClue = `“They charted a course toward ${nextDest.subregion} in the ${nextDest.hemisphere} Hemisphere—mentioning ${nextDest.waterway} and ${nextDest.landform}.”`;
    } else {
      destinationClue = `“Flight manifest shows a crossing toward ${nextDest.subregion} (${nextDest.latLabel}). They inquired about navigating near ${nextDest.waterway} and ${nextDest.landform}.”`;
    }
  } else if (spotId === 'market') {
    const currencyPart =
      nextDest.currencyCode !== 'NONE'
        ? `exchanged travel coins for ${nextDest.currency} (${nextDest.currencyCode})`
        : `packed thermal gear for a treaty zone with no official currency`;

    if (level === 'explorer') {
      destinationClue = `“${subjectWord.charAt(0).toUpperCase() + subjectWord.slice(1)} ${currencyPart}, raved about ${nextDest.famousFood}, and had a luggage tag showing ${nextDest.flagDescription}!”`;
    } else if (level === 'navigator') {
      destinationClue = `“They ${currencyPart}, practiced saying ‘${nextDest.greeting}’ in ${nextDest.languages[0]}, and carried a patch with ${nextDest.flagDescription}.”`;
    } else {
      destinationClue = `“Currency exchange receipt: ${currencyPart}. Witness also spotted ${nextDest.flagDescription} on their satchel and heard them practicing ${nextDest.languages[0]}.”`;
    }
  } else {
    // Archive / History clue!
    const m = Math.random() < 0.5 ? nextDest.history[0] : nextDest.history[1];
    if (level === 'explorer') {
      destinationClue = `“They borrowed a picture book about ${nextDest.worldWonder} and were super excited to learn about ‘${m.title}’ (${m.era})!”`;
    } else if (level === 'navigator') {
      destinationClue = `“They checked out our archive file on ‘${m.title}’ (${m.era}) and asked about visiting ${nextDest.worldWonder}!”`;
    } else {
      const capBit = !nextDest.capital.toLowerCase().startsWith('no ')
        ? ` and checked train routes linked to ${nextDest.capital}`
        : '';
      destinationClue = `“They requested manuscripts dated ${m.era} concerning ‘${m.title}’${capBit}. Check your Field Guide if you need to trace the history!”`;
    }
  }

  return {
    spotId,
    spotTitle: spotMeta.title,
    witnessName,
    destinationClue,
    suspectClue,
    suspectTraitKey,
    suspectTraitValue,
  };
}
