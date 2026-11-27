import type { CityLayout } from '../../types/game';
import { AFRICA_LANDMARKS } from './africaLandmarks';
import { AMERICAS_OCEANIA_LANDMARKS } from './americasOceaniaLandmarks';
import { ASIA_LANDMARKS } from './asiaLandmarks';
import { EUROPE_LANDMARKS } from './europeLandmarks';
import { US_STATE_LANDMARKS } from './usStatesLandmarks';

export const CITY_LAYOUTS: Record<string, CityLayout> = {
  ...EUROPE_LANDMARKS,
  ...AFRICA_LANDMARKS,
  ...ASIA_LANDMARKS,
  ...AMERICAS_OCEANIA_LANDMARKS,
  ...US_STATE_LANDMARKS,
};

export function getCityLayout(destId: string): CityLayout {
  return (
    CITY_LAYOUTS[destId] ?? {
      backdrop: 'harbor-bay',
      waterLabel: 'Harbor Waters',
      featureLabel: 'Historic Center',
      landmarks: [
        { id: `${destId}-0`, name: 'Old Town Square', role: 'landmark', district: 'Central', witnessTitle: 'Local Guide', x: 50, y: 50, clockHours: 3 },
        { id: `${destId}-1`, name: 'Waterfront Pier', role: 'harbor', district: 'Harborfront', witnessTitle: 'Harbor Master', x: 26, y: 66, clockHours: 3 },
        { id: `${destId}-2`, name: 'Central Market', role: 'market', district: 'Market Quarter', witnessTitle: 'Market Vendor', x: 74, y: 54, clockHours: 3 },
        { id: `${destId}-3`, name: 'Heritage Museum', role: 'archive', district: 'North Quarter', witnessTitle: 'Curator', x: 46, y: 26, clockHours: 3 },
        { id: `${destId}-4`, name: 'Botanical Overlook', role: 'nature', district: 'East Ridge', witnessTitle: 'Park Ranger', x: 76, y: 28, clockHours: 3 },
      ],
    }
  );
}
