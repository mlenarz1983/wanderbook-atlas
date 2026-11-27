import type { ContinentName, Destination, MissionDifficulty } from '../../types/game';
import { AFRICA_DESTINATIONS } from './africa';
import { ASIA_DESTINATIONS } from './asia';
import { EUROPE_DESTINATIONS } from './europe';
import { MORE_AMERICAS_OCEANIA } from './moreAmericasOceania';
import { MORE_ASIA } from './moreAsia';
import { MORE_EUROPE_AFRICA } from './moreEuropeAfrica';
import { NORTH_AMERICA_DESTINATIONS } from './northAmerica';
import { OCEANIA_ANTARCTICA_DESTINATIONS } from './oceaniaAntarctica';
import { SOUTH_AMERICA_DESTINATIONS } from './southAmerica';
import { US_STATE_DESTINATIONS } from './usStates';
import {
  ICONIC_WORLD_IDS,
  US_50_STATE_DEST_IDS,
  getUsStateMeta,
} from './usStatesMeta';

export const DESTINATIONS: Destination[] = [
  ...EUROPE_DESTINATIONS,
  ...AFRICA_DESTINATIONS,
  ...ASIA_DESTINATIONS,
  ...NORTH_AMERICA_DESTINATIONS,
  ...SOUTH_AMERICA_DESTINATIONS,
  ...OCEANIA_ANTARCTICA_DESTINATIONS,
  ...MORE_EUROPE_AFRICA,
  ...MORE_ASIA,
  ...MORE_AMERICAS_OCEANIA,
  ...US_STATE_DESTINATIONS,
];

export const DESTINATIONS_BY_ID: Record<string, Destination> = Object.fromEntries(
  DESTINATIONS.map((d) => [d.id, d])
);

export const CONTINENT_ORDER: readonly ContinentName[] = [
  'North America',
  'South America',
  'Europe',
  'Africa',
  'Asia',
  'Oceania',
  'Antarctica',
] as const;

/** Returns the exact destination pool for a given Mission Difficulty tier. */
export function getDestinationPool(difficulty: MissionDifficulty): Destination[] {
  if (difficulty === 'usa') {
    return US_50_STATE_DEST_IDS.map((id) => DESTINATIONS_BY_ID[id]).filter(
      (d): d is Destination => Boolean(d)
    );
  }
  if (difficulty === 'iconic-world') {
    return ICONIC_WORLD_IDS.map((id) => DESTINATIONS_BY_ID[id]).filter(
      (d): d is Destination => Boolean(d)
    );
  }
  return DESTINATIONS;
}

/** Clean display label for maps & cards: "Savannah, GA" in USA mode or "City, Country" globally */
export function formatDestinationShortLabel(
  dest: Destination,
  difficulty?: MissionDifficulty
): string {
  const us = getUsStateMeta(dest.id);
  if (difficulty === 'usa' && us) {
    return `${dest.name}, ${us.code}`;
  }
  if (us) {
    return `${dest.name}, ${us.code} (USA)`;
  }
  return dest.name === dest.country ? dest.country : `${dest.name}, ${dest.country}`;
}

export function computeDistanceMiles(
  c1: [number, number],
  c2: [number, number]
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const [lon1, lat1] = c1;
  const [lon2, lat2] = c2;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const miles = 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(250, Math.round(miles / 10) * 10);
}

/** Flight time on the Travel Clock (5h to 28h scaled accurately to real miles) */
export function computeFlightHours(fromId: string, toId: string): number {
  const a = DESTINATIONS_BY_ID[fromId];
  const b = DESTINATIONS_BY_ID[toId];
  if (!a || !b) return 12;
  const miles = computeDistanceMiles(a.coords, b.coords);
  if (miles < 550) return 5;
  if (miles < 1100) return 8;
  if (miles < 2200) return 11;
  if (miles < 3800) return 15;
  if (miles < 6000) return 19;
  if (miles < 8500) return 24;
  return 28;
}

/**
 * Distance-accurate animated flight duration (milliseconds)!
 * Short regional hop (~400mi) -> ~3.2s
 * Medium hop (~2,200mi)       -> ~5.8s
 * Ocean crossing (~4,800mi)   -> ~8.6s
 * Halfway around Earth (8,500+mi) -> ~12.5s
 */
export function computeFlightAnimationMs(fromId: string, toId: string): number {
  const a = DESTINATIONS_BY_ID[fromId];
  const b = DESTINATIONS_BY_ID[toId];
  if (!a || !b) return 6500;
  const miles = computeDistanceMiles(a.coords, b.coords);
  const scaled = Math.round(2800 + Math.min(miles, 10000) * 0.98);
  return Math.max(3000, Math.min(12600, scaled));
}

/**
 * Generates 5 SPREAD-OUT, plausible flight destinations from `currentId` within the
 * active Mission Difficulty pool!
 * - USA mode: spreads 5 states across different US regions (~450–650+ miles apart)
 * - World modes: spreads 5 countries ~1,300–1,800+ miles apart so TV labels never cluster!
 */
export function buildDepartureBoard(
  currentId: string,
  trueNextId: string,
  alreadyVisitedIds: string[],
  difficulty: MissionDifficulty = 'full-world'
): string[] {
  const target = DESTINATIONS_BY_ID[trueNextId];
  const origin = DESTINATIONS_BY_ID[currentId];
  if (!target) return [trueNextId];

  const pool = getDestinationPool(difficulty);
  const excluded = new Set<string>([currentId, trueNextId, ...alreadyVisitedIds]);

  const isUsaMode = difficulty === 'usa';
  const candidates = pool.filter((d) => {
    if (excluded.has(d.id)) return false;
    if (!isUsaMode && d.country === target.country) return false;
    return true;
  });

  const chosen: Destination[] = [target];
  const usedKeys = new Set<string>([isUsaMode ? target.id : target.country]);

  const isWellSpaced = (cand: Destination, minMiles: number): boolean => {
    if (origin && computeDistanceMiles(origin.coords, cand.coords) < minMiles * 0.65) {
      return false;
    }
    return chosen.every(
      (existing) => computeDistanceMiles(existing.coords, cand.coords) >= minMiles
    );
  };

  const pickFrom = (list: Destination[], maxAdd: number, minMiles: number) => {
    let added = 0;
    for (const d of list) {
      if (added >= maxAdd || chosen.length >= 5) break;
      const uniqKey = isUsaMode ? d.id : d.country;
      if (!usedKeys.has(uniqKey) && isWellSpaced(d, minMiles)) {
        chosen.push(d);
        usedKeys.add(uniqKey);
        added++;
      }
    }
  };

  if (isUsaMode) {
    // Spread across diverse US regions so pins stay crisp on the 50-state US map
    const sameRegion = candidates
      .filter((d) => d.subregion === target.subregion)
      .sort(() => Math.random() - 0.5);
    const diffRegion = candidates
      .filter((d) => d.subregion !== target.subregion)
      .sort(() => Math.random() - 0.5);
    pickFrom(sameRegion, 1, 350);
    pickFrom(diffRegion, 4, 580);
    if (chosen.length < 5) {
      pickFrom(candidates.sort(() => Math.random() - 0.5), 5 - chosen.length, 300);
    }
    if (chosen.length < 5) {
      pickFrom(candidates, 5 - chosen.length, 0);
    }
  } else {
    const sameCont = candidates
      .filter((d) => d.continent === target.continent)
      .sort(() => Math.random() - 0.5);
    const diffCont = candidates
      .filter((d) => d.continent !== target.continent)
      .sort(() => Math.random() - 0.5);
    pickFrom(sameCont, 1, 1300);
    pickFrom(diffCont, 3, 1800);
    if (chosen.length < 5) {
      pickFrom(candidates.sort(() => Math.random() - 0.5), 5 - chosen.length, 1000);
    }
    if (chosen.length < 5) {
      pickFrom(candidates, 5 - chosen.length, 0);
    }
  }

  return chosen.map((d) => d.id).sort(() => Math.random() - 0.5);
}
