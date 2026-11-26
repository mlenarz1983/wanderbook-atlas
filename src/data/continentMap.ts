import type { ContinentName } from '../types/game';

export const CONTINENT_FILLS: Record<ContinentName, string> = {
  'North America': '#dcc89d',
  'South America': '#b8cba4',
  Europe: '#dfc2aa',
  Africa: '#e4c58e',
  Asia: '#c8d1b2',
  Oceania: '#d9b9a0',
  Antarctica: '#eef4f3',
};

// Maps Natural Earth ISO-3166 numeric IDs (string, 3 digits) to ContinentName
const EUROPE_IDS = new Set([
  '008', '020', '040', '056', '070', '100', '112', '191', '203', '208',
  '233', '246', '250', '276', '300', '348', '352', '372', '380', '428',
  '440', '442', '498', '499', '528', '578', '616', '620', '642', '688',
  '703', '705', '724', '752', '756', '804', '807', '826', '-99',
]);

const NORTH_AMERICA_IDS = new Set([
  '044', '084', '124', '188', '192', '214', '222', '304', '320', '332',
  '340', '388', '484', '558', '591', '630', '780', '840',
]);

const SOUTH_AMERICA_IDS = new Set([
  '032', '068', '076', '152', '170', '218', '238', '254', '328', '600',
  '604', '740', '858', '862',
]);

const AFRICA_IDS = new Set([
  '012', '024', '072', '108', '120', '140', '148', '178', '180', '204',
  '226', '231', '232', '262', '266', '270', '288', '324', '384', '404',
  '426', '430', '434', '450', '454', '466', '478', '504', '508', '516',
  '562', '566', '624', '646', '686', '694', '706', '710', '716', '728',
  '729', '732', '748', '768', '788', '800', '818', '834', '854', '894',
]);

const OCEANIA_IDS = new Set([
  '036', '090', '242', '540', '548', '554', '598',
]);

const ANTARCTICA_IDS = new Set(['010', '260']);

export function getContinentForCountryId(id: string | number | undefined): ContinentName {
  const padded = String(id ?? '').padStart(3, '0');
  if (ANTARCTICA_IDS.has(padded)) return 'Antarctica';
  if (NORTH_AMERICA_IDS.has(padded)) return 'North America';
  if (SOUTH_AMERICA_IDS.has(padded)) return 'South America';
  if (AFRICA_IDS.has(padded)) return 'Africa';
  if (OCEANIA_IDS.has(padded)) return 'Oceania';
  if (EUROPE_IDS.has(padded)) return 'Europe';
  return 'Asia';
}
