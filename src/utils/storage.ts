import type {
  AvatarId,
  DifficultyLevel,
  Mission,
  MissionTheme,
  Player,
  SavedAtlasState,
} from '../types/game';

const STORAGE_KEY = 'wanderbook-atlas-save-v1';

export const DEFAULT_PLAYERS: Player[] = [
  {
    id: 'player-1',
    name: 'Explorer 1',
    avatar: 'fox',
    defaultLevel: 'scout',
  },
  {
    id: 'player-2',
    name: 'Explorer 2',
    avatar: 'otter',
    defaultLevel: 'navigator',
  },
];

export function createInitialState(): SavedAtlasState {
  return {
    version: 1,
    players: DEFAULT_PLAYERS,
    missions: [],
    activeMissionId: null,
    discoveredDestIds: [],
    flippedHistoryIds: [],
    preferences: {
      soundEnabled: true,
      readAloudEnabled: false,
    },
  };
}

export function loadSavedState(): SavedAtlasState {
  if (typeof window === 'undefined') return createInitialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<SavedAtlasState>;
    const players =
      Array.isArray(parsed.players) && parsed.players.length > 0
        ? parsed.players
        : DEFAULT_PLAYERS;
    return {
      version: 1,
      players,
      missions: Array.isArray(parsed.missions) ? parsed.missions : [],
      activeMissionId: parsed.activeMissionId ?? null,
      discoveredDestIds: Array.isArray(parsed.discoveredDestIds)
        ? parsed.discoveredDestIds
        : [],
      flippedHistoryIds: Array.isArray(parsed.flippedHistoryIds)
        ? parsed.flippedHistoryIds
        : [],
      preferences: {
        soundEnabled: parsed.preferences?.soundEnabled ?? true,
        readAloudEnabled: parsed.preferences?.readAloudEnabled ?? false,
      },
    };
  } catch {
    return createInitialState();
  }
}

export function persistState(state: SavedAtlasState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

export function createMission(params: {
  title: string;
  theme: MissionTheme;
  targetStops: number | null;
  playerIds: string[];
  startDestId: string;
}): Mission {
  const now = Date.now();
  return {
    id: `mission-${now}-${Math.random().toString(36).slice(2, 6)}`,
    title: params.title.trim() || 'Family World Expedition',
    theme: params.theme,
    targetStops: params.targetStops,
    playerIds: params.playerIds,
    currentTurnIndex: 0,
    currentDestId: params.startDestId,
    visitedDestIds: [params.startDestId],
    crewHelpCount: 0,
    createdAt: now,
    updatedAt: now,
    completed: false,
  };
}

export function createPlayer(
  name: string,
  avatar: AvatarId,
  defaultLevel: DifficultyLevel
): Player {
  return {
    id: `player-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    name: name.trim() || 'New Explorer',
    avatar,
    defaultLevel,
  };
}

export function validateImportedState(jsonText: string): SavedAtlasState | null {
  try {
    const parsed = JSON.parse(jsonText) as Partial<SavedAtlasState>;
    if (!parsed || typeof parsed !== 'object') return null;
    if (!Array.isArray(parsed.players) || parsed.players.length === 0) return null;
    return {
      version: 1,
      players: parsed.players,
      missions: Array.isArray(parsed.missions) ? parsed.missions : [],
      activeMissionId: parsed.activeMissionId ?? null,
      discoveredDestIds: Array.isArray(parsed.discoveredDestIds)
        ? parsed.discoveredDestIds
        : [],
      flippedHistoryIds: Array.isArray(parsed.flippedHistoryIds)
        ? parsed.flippedHistoryIds
        : [],
      preferences: {
        soundEnabled: parsed.preferences?.soundEnabled ?? true,
        readAloudEnabled: parsed.preferences?.readAloudEnabled ?? false,
      },
    };
  } catch {
    return null;
  }
}
