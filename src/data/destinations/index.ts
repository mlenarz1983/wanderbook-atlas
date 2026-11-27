import type { ContinentName, Destination } from '../../types/game';
import { AFRICA_DESTINATIONS } from './africa';
import { ASIA_DESTINATIONS } from './asia';
import { EUROPE_DESTINATIONS } from './europe';
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

/** Flight time on the Travel Clock (8h to 24h based on real-world distance) */
export function computeFlightHours(fromId: string, toId: string): number {
  const a = DESTINATIONS_BY_ID[fromId];
  const b = DESTINATIONS_BY_ID[toId];
  if (!a || !b) return 12;
  const miles = computeDistanceMiles(a.coords, b.coords);
  if (miles < 1200) return 8;
  if (miles < 2800) return 12;
  if (miles < 5000) return 16;
  if (miles < 7500) return 20;
  return 24;
}

/**
 * Generates 5 plausible flight destinations from `currentId`:
 * 1 true next destination + 4 genuinely plausible decoys (mix of nearby regional
 * neighbors + visually similar countries so players must actually use their clues!).
 */
export function buildDepartureBoard(
  currentId: string,
  trueNextId: string,
  alreadyVisitedIds: string[]
): string[] {
  const target = DESTINATIONS_BY_ID[trueNextId];
  if (!target) return [trueNextId];

  const excluded = new Set<string>([currentId, trueNextId, ...alreadyVisitedIds]);
  const candidates = DESTINATIONS.filter(
    (d) => !excluded.has(d.id) && d.country !== target.country
  );

  // Rank candidates: 2 plausible regional/same-continent decoys + 2 global/similar-biome decoys
  const sameContinent = candidates
    .filter((d) => d.continent === target.continent)
    .sort((a, b) => {
      const da = computeDistanceMiles(target.coords, a.coords);
      const db = computeDistanceMiles(target.coords, b.coords);
      return da - db;
    });

  const otherContinent = candidates
    .filter((d) => d.continent !== target.continent)
    .sort(() => Math.random() - 0.5);

  const decoys: string[] = [];
  const usedCountries = new Set<string>([target.country]);

  const tryAdd = (pool: Destination[], maxAdd: number) => {
    let added = 0;
    // Shuffle slightly among top candidates so decoys vary every game
    const slice = pool.slice(0, Math.min(pool.length, 10)).sort(() => Math.random() - 0.5);
    for (const d of slice) {
      if (added >= maxAdd || decoys.length >= 4) break;
      if (!usedCountries.has(d.country)) {
        decoys.push(d.id);
        usedCountries.add(d.country);
        added++;
      }
    }
  };

  tryAdd(sameContinent, 2);
  tryAdd(otherContinent, 2);
  if (decoys.length < 4) {
    tryAdd(candidates, 4 - decoys.length);
  }

  return [trueNextId, ...decoys].sort(() => Math.random() - 0.5);
}
