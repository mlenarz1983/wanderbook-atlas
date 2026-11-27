import type {
  AvatarId,
  ContinentName,
  Destination,
  HistoricalMilestone,
  SceneType,
  SouvenirIconId,
} from '../../types/game';

export interface CompactCitySpec {
  id: string;
  name: string;
  country: string;
  capital: string;
  continent: ContinentName;
  subregion: string;
  coords: [number, number];
  currency: string;
  currencyCode: string;
  languages: string[];
  flagColors: [string, string, string];
  flagDescription: string;
  waterway: string;
  landform: string;
  climate: string;
  borders: string[];
  animalName: string;
  animalAvatar: AvatarId;
  famousFood: string;
  worldWonder: string;
  greeting: string;
  souvenirName: string;
  souvenirId: SouvenirIconId;
  souvenirCategory: 'wildlife' | 'artifact';
  routeLabel: string;
  todayFact: string;
  h1?: [string, string, string];
  h2?: [string, string, string];
  history?: [HistoricalMilestone, HistoricalMilestone];
  sceneType: SceneType;
  skyTop?: string;
  skyBottom?: string;
  accent?: string;
}

export function formatLatLabel([lon, lat]: [number, number]): string {
  const latStr = `${Math.abs(Math.round(lat))}°${lat >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(Math.round(lon))}°${lon >= 0 ? 'E' : 'W'}`;
  return `${latStr} • ${lonStr}`;
}

export function buildDestinations(specs: CompactCitySpec[]): Destination[] {
  return specs.map((s) => {
    const [, lat] = s.coords;
    const hemisphere: Destination['hemisphere'] =
      Math.abs(lat) <= 4 ? 'Equatorial' : lat > 0 ? 'Northern' : 'Southern';
    const history: [HistoricalMilestone, HistoricalMilestone] = s.history ?? [
      { era: s.h1![0], title: s.h1![1], fact: s.h1![2] },
      { era: s.h2![0], title: s.h2![1], fact: s.h2![2] },
    ];
    return {
      id: s.id,
      name: s.name,
      country: s.country,
      capital: s.capital,
      continent: s.continent,
      subregion: s.subregion,
      coords: s.coords,
      latLabel: formatLatLabel(s.coords),
      hemisphere,
      currency: s.currency,
      currencyCode: s.currencyCode,
      languages: s.languages,
      flagColors: s.flagColors,
      flagDescription: s.flagDescription,
      waterway: s.waterway,
      landform: s.landform,
      climate: s.climate,
      borders: s.borders,
      animalName: s.animalName,
      animalAvatar: s.animalAvatar,
      famousFood: s.famousFood,
      worldWonder: s.worldWonder,
      greeting: s.greeting,
      souvenirName: s.souvenirName,
      souvenirId: s.souvenirId,
      souvenirCategory: s.souvenirCategory,
      routeLabel: s.routeLabel,
      todayFact: s.todayFact,
      history,
      sceneType: s.sceneType,
      skyTop: s.skyTop ?? '#5c8fab',
      skyBottom: s.skyBottom ?? '#f0e2c6',
      accent: s.accent ?? '#c4533a',
    };
  });
}
