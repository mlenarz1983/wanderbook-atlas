import type { CityGeoBackdrop, CityLandmark, CityLayout, SpotRole } from '../../types/game';

// Compact tuple: [name, role, district, witnessTitle, x (12..88), y (16..84)]
export type SpotTuple = [string, SpotRole, string, string, number, number];

export interface CompactCityLayoutSpec {
  backdrop: CityGeoBackdrop;
  water?: string;
  feature?: string;
  spots: [SpotTuple, SpotTuple, SpotTuple, SpotTuple, SpotTuple];
}

export function expandCityLayouts(
  raw: Record<string, CompactCityLayoutSpec>
): Record<string, CityLayout> {
  const out: Record<string, CityLayout> = {};
  for (const [cityId, spec] of Object.entries(raw)) {
    const landmarks: CityLandmark[] = spec.spots.map(
      ([name, role, district, witnessTitle, x, y], idx) => ({
        id: `${cityId}-spot-${idx}`,
        name,
        role,
        district,
        witnessTitle,
        x,
        y,
        clockHours: 3,
      })
    );
    out[cityId] = {
      backdrop: spec.backdrop,
      waterLabel: spec.water,
      featureLabel: spec.feature,
      landmarks,
    };
  }
  return out;
}
