import {
  generateCaseEras,
  generateCaseTrail,
  pickCaseTemplate,
  pickSuspectPool,
} from '../data/cases';
import { buildDepartureBoard } from '../data/destinations';
import type {
  AvatarId,
  CaseMission,
  DifficultyLevel,
  MissionDifficulty,
  Player,
  SavedAtlasState,
} from '../types/game';

const STORAGE_KEY = 'wanderbook-atlas-save-v2';
const LEGACY_V1_KEY = 'wanderbook-atlas-save-v1';

export const DEFAULT_PLAYERS: Player[] = [
  {
    id: 'player-1',
    name: 'Explorer 1',
    avatar: 'fox',
    defaultLevel: 'explorer',
  },
  {
    id: 'player-2',
    name: 'Explorer 2',
    avatar: 'otter',
    defaultLevel: 'scholar',
  },
];

function migrateLevel(raw: string | undefined): DifficultyLevel {
  if (raw === 'explorer' || raw === 'navigator' || raw === 'cartographer' || raw === 'scholar') {
    return raw;
  }
  if (raw === 'scout') return 'explorer';
  if (raw === 'trailblazer') return 'cartographer';
  return 'explorer';
}

function migrateMission(raw: Partial<CaseMission>): CaseMission {
  const diff: MissionDifficulty =
    raw.missionDifficulty === 'usa' ||
    raw.missionDifficulty === 'iconic-world' ||
    raw.missionDifficulty === 'full-world' ||
    raw.missionDifficulty === 'time-warp'
      ? raw.missionDifficulty
      : 'full-world';
  return {
    ...(raw as CaseMission),
    kind: 'wonder-chase',
    missionDifficulty: diff,
  };
}

export function createInitialState(): SavedAtlasState {
  return {
    version: 3,
    players: DEFAULT_PLAYERS,
    missions: [],
    activeMissionId: null,
    discoveredDestIds: [],
    flippedHistoryIds: [],
    solvedCaseCount: 0,
    seenQuestionIds: [],
  };
}

export function loadSavedState(): SavedAtlasState {
  if (typeof window === 'undefined') return createInitialState();
  try {
    const rawV2 = window.localStorage.getItem(STORAGE_KEY);
    if (rawV2) {
      const parsed = JSON.parse(rawV2) as Partial<SavedAtlasState>;
      const players =
        Array.isArray(parsed.players) && parsed.players.length > 0
          ? parsed.players.map((p) => ({
              ...p,
              defaultLevel: migrateLevel(p.defaultLevel),
            }))
          : DEFAULT_PLAYERS;
      return {
        version: 3,
        players,
        missions: Array.isArray(parsed.missions)
          ? parsed.missions.map((m) => migrateMission(m))
          : [],
        activeMissionId: parsed.activeMissionId ?? null,
        discoveredDestIds: Array.isArray(parsed.discoveredDestIds)
          ? parsed.discoveredDestIds
          : [],
        flippedHistoryIds: Array.isArray(parsed.flippedHistoryIds)
          ? parsed.flippedHistoryIds
          : [],
        solvedCaseCount:
          typeof parsed.solvedCaseCount === 'number' ? parsed.solvedCaseCount : 0,
        seenQuestionIds: Array.isArray(parsed.seenQuestionIds)
          ? parsed.seenQuestionIds.slice(-400)
          : [],
      };
    }

    const rawV1 = window.localStorage.getItem(LEGACY_V1_KEY);
    if (rawV1) {
      const legacy = JSON.parse(rawV1) as {
        players?: Array<{ id: string; name: string; avatar: AvatarId; defaultLevel?: string }>;
        discoveredDestIds?: string[];
        flippedHistoryIds?: string[];
      };
      const players =
        Array.isArray(legacy.players) && legacy.players.length > 0
          ? legacy.players.map((p) => ({
              id: p.id,
              name: p.name,
              avatar: p.avatar,
              defaultLevel: migrateLevel(p.defaultLevel),
            }))
          : DEFAULT_PLAYERS;
      return {
        ...createInitialState(),
        players,
        discoveredDestIds: Array.isArray(legacy.discoveredDestIds)
          ? legacy.discoveredDestIds
          : [],
        flippedHistoryIds: Array.isArray(legacy.flippedHistoryIds)
          ? legacy.flippedHistoryIds
          : [],
      };
    }

    return createInitialState();
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

export function createCaseMission(params: {
  title?: string;
  missionDifficulty: MissionDifficulty;
  stopsCount: number; // 4, 5, or 7
  playerIds: string[];
}): CaseMission {
  const now = Date.now();
  const { missionDifficulty, stopsCount } = params;
  const template = pickCaseTemplate(missionDifficulty);

  const trail = generateCaseTrail(
    missionDifficulty,
    template.preferredStartIds,
    stopsCount
  );
  const trailEras =
    missionDifficulty === 'time-warp' ? generateCaseEras(trail.length) : undefined;

  const { culpritId, suspectIds } = pickSuspectPool();
  const startId = trail[0];
  const nextId = trail[1] ?? trail[0];

  // Clock tightens progressively from Level 1 (generous USA tour) -> Level 4 (Time-Warp!)
  const hoursPerLeg =
    missionDifficulty === 'usa'
      ? 68
      : missionDifficulty === 'iconic-world'
        ? 60
        : missionDifficulty === 'full-world'
          ? 52
          : 50;
  const totalHoursBudget = Math.max(168, (stopsCount - 1) * hoursPerLeg + 48);

  return {
    id: `case-${now}-${Math.random().toString(36).slice(2, 6)}`,
    title: params.title?.trim() || template.title,
    kind: 'wonder-chase',
    missionDifficulty,
    briefing: template.briefing,
    stolenOrTargetItem: template.stolenOrTargetItem,
    culpritId,
    suspectIds,
    trailDestIds: trail,
    trailEras,
    trailProgressIndex: 0,
    currentDestId: startId,
    currentEra: trailEras?.[0],
    isOnColdTrail: false,
    isOnWrongEra: false,
    lastValidDestId: startId,
    departureOptions: buildDepartureBoard(
      startId,
      nextId,
      [startId],
      missionDifficulty
    ),
    visitedDestIds: [startId],
    investigatedSpotsByCity: {},
    cluesLog: [],
    discoveredSuspectTraits: {},
    selectedWarrantSuspectId: null,
    playerIds: params.playerIds,
    currentTurnIndex: 0,
    totalHoursBudget,
    hoursElapsed: 0,
    wrongFlightsCount: 0,
    crewHelpCount: 0,
    status: 'active',
    createdAt: now,
    updatedAt: now,
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
      version: 3,
      players: parsed.players.map((p) => ({
        ...p,
        defaultLevel: migrateLevel(p.defaultLevel),
      })),
      missions: Array.isArray(parsed.missions)
        ? parsed.missions.map((m) => migrateMission(m))
        : [],
      activeMissionId: parsed.activeMissionId ?? null,
      discoveredDestIds: Array.isArray(parsed.discoveredDestIds)
        ? parsed.discoveredDestIds
        : [],
      flippedHistoryIds: Array.isArray(parsed.flippedHistoryIds)
        ? parsed.flippedHistoryIds
        : [],
      solvedCaseCount:
        typeof parsed.solvedCaseCount === 'number' ? parsed.solvedCaseCount : 0,
      seenQuestionIds: Array.isArray(parsed.seenQuestionIds)
        ? parsed.seenQuestionIds.slice(-400)
        : [],
    };
  } catch {
    return null;
  }
}

export function formatTravelClock(
  hoursElapsed: number,
  totalHoursBudget: number
): {
  currentDay: number;
  timeOfDay: string;
  hoursRemaining: number;
  daysRemainingText: string;
  isUrgent: boolean;
} {
  const remaining = Math.max(0, totalHoursBudget - hoursElapsed);
  const currentDay = Math.floor(hoursElapsed / 24) + 1;
  const hourInDay = (8 + (hoursElapsed % 24)) % 24;
  const period = hourInDay >= 12 ? 'PM' : 'AM';
  const hour12 = hourInDay % 12 === 0 ? 12 : hourInDay % 12;

  const daysLeft = Math.floor(remaining / 24);
  const hrsLeft = remaining % 24;
  const daysRemainingText =
    remaining === 0
      ? 'Time Up!'
      : daysLeft > 0
        ? `${daysLeft}d ${hrsLeft}h left`
        : `${hrsLeft}h left!`;

  return {
    currentDay,
    timeOfDay: `${hour12}:00 ${period}`,
    hoursRemaining: remaining,
    daysRemainingText,
    isUrgent: remaining <= 48,
  };
}
