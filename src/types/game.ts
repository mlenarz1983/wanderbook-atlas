export type DifficultyLevel = 'scout' | 'navigator' | 'trailblazer';

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

export type MissionTheme =
  | 'grand-tour'
  | 'animal-safari'
  | 'time-travel'
  | 'open-atlas';

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

export interface DestinationQuestion {
  prompt: string;
  choices: [string, string, string];
  correctIndex: number;
  gentleHint: string;
  crewClue: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: ContinentName;
  coords: [number, number]; // [longitude, latitude]
  latLabel: string;
  biome: string;
  animalName: string;
  animalAvatar: AvatarId;
  souvenirName: string;
  souvenirId: SouvenirIconId;
  souvenirCategory: 'wildlife' | 'artifact';
  routeLabel: string;
  themes: MissionTheme[];
  postcard: {
    headline: string;
    todayFact: string;
    timeEra: string;
    historyTitle: string;
    historyFact: string;
    skyTop: string;
    skyBottom: string;
    accent: string;
    sceneType: SceneType;
  };
  questions: Record<DifficultyLevel, DestinationQuestion>;
  neighbors: string[];
}

export interface Mission {
  id: string;
  title: string;
  theme: MissionTheme;
  targetStops: number | null; // null = Open Atlas (Endless)
  playerIds: string[];
  currentTurnIndex: number;
  currentDestId: string;
  visitedDestIds: string[];
  crewHelpCount: number;
  createdAt: number;
  updatedAt: number;
  completed: boolean;
}

export type TurnPhase =
  | 'choose-route'
  | 'flying'
  | 'question'
  | 'postcard'
  | 'mission-complete';

export interface AppPreferences {
  soundEnabled: boolean;
  readAloudEnabled: boolean;
}

export interface SavedAtlasState {
  version: number;
  players: Player[];
  missions: Mission[];
  activeMissionId: string | null;
  discoveredDestIds: string[];
  flippedHistoryIds: string[];
  preferences: AppPreferences;
}

export interface LiveSessionState {
  screen: 'home' | 'expedition' | 'passport';
  activeMission: Mission | null;
  players: Player[];
  discoveredDestIds: string[];
  flippedHistoryIds: string[];
  turnPhase: TurnPhase;
  routeOptions: string[];
  flyingFromId: string | null;
  pendingDestId: string | null;
  activeLevel: DifficultyLevel;
  crewHelped: boolean;
  triedChoiceIndices: number[];
  showGentleHint: boolean;
  postcardFlipped: boolean;
  celebratingNewDiscovery: boolean;
  passportHighlightId: string | null;
}
