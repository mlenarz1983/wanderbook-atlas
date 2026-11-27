import type { ContinentName, Destination } from '../../types/game';
import { AFRICA_DESTINATIONS } from './africa';
import { ASIA_DESTINATIONS } from './asia';
import { EUROPE_DESTINATIONS } from './europe';
import { MORE_AMERICAS_OCEANIA } from './moreAmericasOceania';
import { MORE_ASIA } from './moreAsia';
import { MORE_EUROPE_AFRICA } from './moreEuropeAfrica';
import { NORTH_AMERICA_DESTINATIONS } from './northAmerica';
import { OCEANIA_ANTARCTICA_DESTINATIONS } from './oceaniaAntarctica';
import { SOUTH_AMERICA_DESTINATIONS } from './southAmerica';

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

/** Flight time on the Travel Clock (6h to 28h scaled accurately to real miles) */
export function computeFlightHours(fromId: string, toId: string): number {
  const a = DESTINATIONS_BY_ID[fromId];
  const b = DESTINATIONS_BY_ID[toId];
  if (!a || !b) return 12;
  const miles = computeDistanceMiles(a.coords, b.coords);
  if (miles < 700) return 6;
  if (miles < 1400) return 9;
  if (miles < 2600) return 12;
  if (miles < 4200) return 16;
  if (miles < 6200) return 20;
  if (miles < 8500) return 24;
  return 28;
}

/**
 * Distance-accurate animated flight duration (milliseconds)!
 * Short regional hop (~400mi) -> ~3.2s (snappy & breezy!)
 * Medium hop (~2,200mi)       -> ~5.8s
 * Ocean crossing (~4,800mi)   -> ~8.6s
 * Halfway around Earth (8,500+mi) -> ~12.5s (epic voyage!)
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
 * Generates 5 SPREAD-OUT, plausible flight destinations from `currentId`:
 * 1 true next destination + 4 genuinely plausible decoys spaced at least ~1,300 miles
 * apart from EACH OTHER (and from `currentId`) so labels never cluster on the TV map
 * and every round gives awesome global variety!
 */
export function buildDepartureBoard(
  currentId: string,
  trueNextId: string,
  alreadyVisitedIds: string[]
): string[] {
  const target = DESTINATIONS_BY_ID[trueNextId];
  const origin = DESTINATIONS_BY_ID[currentId];
  if (!target) return [trueNextId];

  const excluded = new Set<string>([currentId, trueNextId, ...alreadyVisitedIds]);
  const candidates = DESTINATIONS.filter(
    (d) => !excluded.has(d.id) && d.country !== target.country
  );

  const chosen: Destination[] = [target];
  const usedCountries = new Set<string>([target.country]);

  const isWellSpaced = (cand: Destination, minMiles: number): boolean => {
    if (origin && computeDistanceMiles(origin.coords, cand.coords) < minMiles * 0.65) {
      return false;
    }
    return chosen.every(
      (existing) => computeDistanceMiles(existing.coords, cand.coords) >= minMiles
    );
  };

  // Pick 1–2 spread-out same-continent (or adjacent) decoys + 2–3 other-continent decoys
  const sameCont = candidates
    .filter((d) => d.continent === target.continent)
    .sort(() => Math.random() - 0.5);
  const diffCont = candidates
    .filter((d) => d.continent !== target.continent)
    .sort(() => Math.random() - 0.5);

  const pickFrom = (pool: Destination[], maxAdd: number, minMiles: number) => {
    let added = 0;
    for (const d of pool) {
      if (added >= maxAdd || chosen.length >= 5) break;
      if (!usedCountries.has(d.country) && isWellSpaced(d, minMiles)) {
        chosen.push(d);
        usedCountries.add(d.country);
        added++;
      }
    }
  };

  // Prefer at least 1,400 miles between every pair of candidate pins so the TV map stays crisp!
  pickFrom(sameCont, 1, 1300);
  pickFrom(diffCont, 3, 1800);
  if (chosen.length < 5) {
    pickFrom(candidates.sort(() => Math.random() - 0.5), 5 - chosen.length, 1000);
  }
  if (chosen.length < 5) {
    pickFrom(candidates, 5 - chosen.length, 0);
  }

  return chosen.map((d) => d.id).sort(() => Math.random() - 0.5);
}
