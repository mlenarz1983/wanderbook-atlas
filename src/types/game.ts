export type DifficultyLevel = 'explorer' | 'navigator' | 'cartographer' | 'scholar';

export type AvatarId =
  | 'fox'
  | 'otter'
  | 'panda'
  | 'owl'
  | 'turtle'
  | 'puffin'
  | 'alpaca'
  | 'lion';

export type ContinentName =
  | 'North America'
  | 'South America'
  | 'Europe'
  | 'Africa'
  | 'Asia'
  | 'Oceania'
  | 'Antarctica';

export type CaseKind = 'wonder-chase' | 'lost-explorer' | 'wildlife-trail';

export type SpotRole = 'harbor' | 'market' | 'archive' | 'landmark' | 'nature';

export type CityGeoBackdrop =
  | 'river-ew'
  | 'river-ns'
  | 'coast-south'
  | 'coast-west'
  | 'coast-east'
  | 'coast-north'
  | 'harbor-bay'
  | 'island'
  | 'mountains-north'
  | 'desert-oasis'
  | 'glacier-fjord'
  | 'rainforest-river';

export interface CityLandmark {
  id: string;
  name: string; // Real, confirmed local place
  role: SpotRole;
  district: string; // e.g., "West Bank", "Old Town North", "Harborfront"
  witnessTitle: string; // e.g., "Museum Curator", "Ferry Captain", "Spice Vendor"
  x: number; // 12..88 normalized city map X (West -> East)
  y: number; // 16..84 normalized city map Y (North -> South)
  clockHours: number;
}

export interface CityLayout {
  backdrop: CityGeoBackdrop;
  waterLabel?: string;
  featureLabel?: string;
  landmarks: CityLandmark[];
}

export type SceneType =
  | 'geyser-viking'
  | 'volcano-bay'
  | 'parthenon'
  | 'alps-peaks'
  | 'pyramids-nile'
  | 'savanna-acacia'
  | 'baobab-island'
  | 'sahara-dunes'
  | 'bamboo-wall'
  | 'fuji-pagoda'
  | 'monsoon-palace'
  | 'himalaya-peaks'
  | 'borneo-canopy'
  | 'coral-reef'
  | 'uluru-outback'
  | 'fjord-stars'
  | 'pacific-volcano'
  | 'maya-jungle'
  | 'red-canyon'
  | 'aurora-pines'
  | 'amazon-river'
  | 'andes-citadel'
  | 'tortoise-isle'
  | 'patagonia-fossils'
  | 'antarctic-ice';

export type SouvenirIconId =
  | 'viking-compass'
  | 'pizza-peel'
  | 'olive-wreath'
  | 'alpine-bell'
  | 'scarab'
  | 'savanna-drum'
  | 'baobab-pod'
  | 'star-lantern'
  | 'silk-kite'
  | 'origami-crane'
  | 'zero-tablet'
  | 'prayer-flags'
  | 'spice-compass'
  | 'coral-shell'
  | 'boomerang'
  | 'star-chart'
  | 'lava-stone'
  | 'cacao-pod'
  | 'canyon-feather'
  | 'aurora-crystal'
  | 'river-paddle'
  | 'inca-quipu'
  | 'spyglass'
  | 'dino-tooth'
  | 'sled-bell';

export interface Player {
  id: string;
  name: string;
  avatar: AvatarId;
  defaultLevel: DifficultyLevel;
}

export interface HistoricalMilestone {
  era: string;
  title: string;
  fact: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  capital: string;
  continent: ContinentName;
  subregion: string;
  coords: [number, number]; // [lon, lat]
  latLabel: string;
  hemisphere: 'Northern' | 'Southern' | 'Equatorial';
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
  history: [HistoricalMilestone, HistoricalMilestone];
  sceneType: SceneType;
  skyTop: string;
  skyBottom: string;
  accent: string;
}

export interface QuizQuestion {
  id: string;
  destId: string;
  level: DifficultyLevel;
  category:
    | 'geography'
    | 'culture'
    | 'history'
    | 'wildlife'
    | 'currency'
    | 'capital'
    | 'flag';
  prompt: string;
  choices: [string, string, string, string];
  correctIndex: number;
  gentleHint: string;
  crewClue: string;
  almanacTip: string;
}

export interface SuspectProfile {
  id: string;
  name: string;
  title: string;
  avatar: AvatarId;
  caseKind: CaseKind;
  accessory: string;
  favoriteTreat: string;
  companion: string;
  hobby: string;
  catchphrase: string;
}

export interface WitnessClue {
  spotId: string;
  spotTitle: string;
  witnessName: string;
  destinationClue: string;
  suspectClue: string | null;
  suspectTraitKey?: 'accessory' | 'favoriteTreat' | 'companion' | 'hobby';
  suspectTraitValue?: string;
}

export interface TownClueLogEntry {
  cityId: string;
  spotId: string;
  spotTitle: string;
  witnessName: string;
  destinationClue: string;
  suspectClue: string | null;
}

export interface CaseMission {
  id: string;
  title: string;
  kind: CaseKind;
  briefing: string;
  stolenOrTargetItem: string;
  culpritId: string;
  suspectIds: string[];
  trailDestIds: string[];
  trailProgressIndex: number;
  currentDestId: string;
  isOnColdTrail: boolean;
  lastValidDestId: string;
  departureOptions: string[];
  visitedDestIds: string[];
  investigatedSpotsByCity: Record<string, string[]>;
  cluesLog: TownClueLogEntry[];
  discoveredSuspectTraits: Partial<
    Record<'accessory' | 'favoriteTreat' | 'companion' | 'hobby', string>
  >;
  selectedWarrantSuspectId: string | null;
  playerIds: string[];
  currentTurnIndex: number;
  totalHoursBudget: number;
  hoursElapsed: number;
  wrongFlightsCount: number;
  crewHelpCount: number;
  status: 'active' | 'won' | 'escaped';
  medal?: 'gold' | 'silver' | 'bronze';
  createdAt: number;
  updatedAt: number;
}

export type TurnPhase =
  | 'town-hub'
  | 'spot-challenge'
  | 'departure-board'
  | 'flying'
  | 'cold-trail'
  | 'postcard'
  | 'finale-warrant'
  | 'case-complete';

export interface AppPreferences {
  soundEnabled: boolean;
  readAloudEnabled: boolean;
}

export interface SavedAtlasState {
  version: number;
  players: Player[];
  missions: CaseMission[];
  activeMissionId: string | null;
  discoveredDestIds: string[];
  flippedHistoryIds: string[];
  solvedCaseCount: number;
  seenQuestionIds: string[];
  preferences: AppPreferences;
}

export interface LiveSessionState {
  screen: 'home' | 'expedition' | 'passport';
  activeMission: CaseMission | null;
  players: Player[];
  discoveredDestIds: string[];
  flippedHistoryIds: string[];
  turnPhase: TurnPhase;
  activeSpotId: string | null;
  lastVisitedSpotId: string | null;
  activeQuestion: QuizQuestion | null;
  latestWitnessClue: WitnessClue | null;
  flyingFromId: string | null;
  flyingToId: string | null;
  flightDurationMs: number;
  activeLevel: DifficultyLevel;
  crewHelped: boolean;
  triedChoiceIndices: number[];
  showGentleHint: boolean;
  postcardDestId: string | null;
  postcardFlipped: boolean;
  celebratingNewDiscovery: boolean;
  passportHighlightId: string | null;
}
