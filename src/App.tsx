import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  Clock,
  Compass,
  Play,
  Plus,
  Settings,
  ShieldCheck,
  Trash2,
  Tv,
  Unlink,
  Users,
} from 'lucide-react';
import { AnimalAvatar } from './components/art/AnimalAvatar';
import { BalloonEmblem } from './components/art/CompassRose';
import { SouvenirArt } from './components/art/SouvenirArt';
import { CaseNotebookModal } from './components/CaseNotebookModal';
import { CrewModal } from './components/CrewModal';
import { ExpeditionScreen } from './components/ExpeditionScreen';
import { FieldGuideModal } from './components/FieldGuideModal';
import { NewMissionModal } from './components/NewMissionModal';
import { PassportView } from './components/PassportView';
import { SettingsModal } from './components/SettingsModal';
import { TvConnectModal } from './components/TvConnectModal';
import { TvDisplayScreen } from './components/TvDisplayScreen';
import { SUSPECTS_BY_ID } from './data/cases';
import {
  DESTINATIONS,
  DESTINATIONS_BY_ID,
  buildDepartureBoard,
  computeFlightAnimationMs,
  computeFlightHours,
} from './data/destinations';
import { MISSION_DIFFICULTY_INFO } from './data/destinations/usStatesMeta';
import { getCityLayout } from './data/landmarks';
import {
  generateWitnessClue,
  getLowestCrewLevel,
  selectSpotQuestion,
} from './engine/questionEngine';
import type {
  AvatarId,
  CaseMission,
  CityLandmark,
  DifficultyLevel,
  HistoricalEra,
  LiveSessionState,
  MissionDifficulty,
  Player,
  QuizQuestion,
  SavedAtlasState,
  TurnPhase,
  WitnessClue,
} from './types/game';
import {
  createCaseMission,
  createPlayer,
  formatTravelClock,
  loadSavedState,
  persistState,
} from './utils/storage';
import {
  connectTabletToTv,
  generateRoomCode,
  normalizeRoomCode,
  startTabletHost,
  type TabletControllerHandle,
} from './utils/tvSync';

function getInitialUrlParams() {
  if (typeof window === 'undefined') return { isTv: false, joinCode: '' };
  const params = new URLSearchParams(window.location.search);
  return {
    isTv: params.get('tv') === '1',
    joinCode: normalizeRoomCode(params.get('join') ?? ''),
  };
}

export function App() {
  const urlInit = useMemo(() => getInitialUrlParams(), []);

  // Persistent Family Atlas State (Tablet = Keeper of the Passport)
  const [savedState, setSavedState] = useState<SavedAtlasState>(() => loadSavedState());

  // Navigation & Modals
  const [isTvDisplayMode, setIsTvDisplayMode] = useState<boolean>(urlInit.isTv);
  const [screen, setScreen] = useState<'home' | 'expedition'>('home');
  const [passportOpen, setPassportOpen] = useState(false);
  const [passportHighlightId, setPassportHighlightId] = useState<string | null>(null);
  const [fieldGuideOpen, setFieldGuideOpen] = useState(false);
  const [fieldGuideCompareIds, setFieldGuideCompareIds] = useState<string[]>([]);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newMissionOpen, setNewMissionOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | 'new' | null>(null);

  // Live Case Turn State
  const [turnPhase, setTurnPhase] = useState<TurnPhase>('town-hub');
  const [activeSpotId, setActiveSpotId] = useState<string | null>(null);
  const [lastVisitedSpotId, setLastVisitedSpotId] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<QuizQuestion | null>(null);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
  const [selectedEra, setSelectedEra] = useState<HistoricalEra>('modern');
  const [latestWitnessClue, setLatestWitnessClue] = useState<WitnessClue | null>(null);
  const [flyingFromId, setFlyingFromId] = useState<string | null>(null);
  const [flyingToId, setFlyingToId] = useState<string | null>(null);
  const [flightDurationMs, setFlightDurationMs] = useState<number>(6500);
  const [flyingIsReturn, setFlyingIsReturn] = useState(false);
  const [flyingTargetEra, setFlyingTargetEra] = useState<HistoricalEra>('modern');
  const [activeLevel, setActiveLevel] = useState<DifficultyLevel>('explorer');
  const [crewHelped, setCrewHelped] = useState(false);
  const [triedChoiceIndices, setTriedChoiceIndices] = useState<number[]>([]);
  const [showGentleHint, setShowGentleHint] = useState(false);
  const [postcardDestId, setPostcardDestId] = useState<string | null>(null);
  const [postcardFlipped, setPostcardFlipped] = useState(false);
  const [celebratingNewDiscovery, setCelebratingNewDiscovery] = useState(false);
  const [warrantFeedback, setWarrantFeedback] = useState<string | null>(null);

  // Two-Way TV Pairing (Android Tablet <-> Google TV Streamer)
  const [tvModalOpen, setTvModalOpen] = useState<boolean>(Boolean(urlInit.joinCode));
  const [tvConnecting, setTvConnecting] = useState(false);
  const [tvConnectedCode, setTvConnectedCode] = useState<string | null>(null);
  const [tabletHostCode, setTabletHostCode] = useState<string | null>(null);
  const [tvError, setTvError] = useState<string | null>(null);
  const tvHandleRef = useRef<TabletControllerHandle | null>(null);
  const flyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    persistState(savedState);
  }, [savedState]);

  useEffect(() => {
    return () => {
      if (flyTimerRef.current) window.clearTimeout(flyTimerRef.current);
      tvHandleRef.current?.disconnect();
    };
  }, []);

  const activeMission: CaseMission | null = useMemo(
    () => savedState.missions.find((m) => m.id === savedState.activeMissionId) ?? null,
    [savedState.missions, savedState.activeMissionId]
  );

  const missionPlayers: Player[] = useMemo(() => {
    if (!activeMission) return savedState.players;
    const list = activeMission.playerIds
      .map((id) => savedState.players.find((p) => p.id === id))
      .filter((p): p is Player => Boolean(p));
    return list.length > 0 ? list : savedState.players;
  }, [activeMission, savedState.players]);

  const currentPlayer: Player = useMemo(() => {
    if (!activeMission || missionPlayers.length === 0) return savedState.players[0];
    return missionPlayers[activeMission.currentTurnIndex % missionPlayers.length];
  }, [activeMission, missionPlayers, savedState.players]);

  const nextPlayer: Player = useMemo(() => {
    if (!activeMission || missionPlayers.length === 0) return savedState.players[0];
    return missionPlayers[(activeMission.currentTurnIndex + 1) % missionPlayers.length];
  }, [activeMission, missionPlayers, savedState.players]);

  // Live TV Sync Payload
  const liveSessionState: LiveSessionState = useMemo(
    () => ({
      screen: passportOpen ? 'passport' : screen,
      activeMission,
      players: savedState.players,
      discoveredDestIds: savedState.discoveredDestIds,
      flippedHistoryIds: savedState.flippedHistoryIds,
      turnPhase,
      activeSpotId,
      lastVisitedSpotId,
      activeQuestion,
      selectedChoiceIndex,
      selectedEra,
      latestWitnessClue,
      flyingFromId,
      flyingToId,
      flightDurationMs,
      activeLevel,
      crewHelped,
      triedChoiceIndices,
      showGentleHint,
      postcardDestId,
      postcardFlipped,
      celebratingNewDiscovery,
      passportHighlightId,
    }),
    [
      passportOpen,
      screen,
      activeMission,
      savedState.players,
      savedState.discoveredDestIds,
      savedState.flippedHistoryIds,
      turnPhase,
      activeSpotId,
      lastVisitedSpotId,
      activeQuestion,
      selectedChoiceIndex,
      selectedEra,
      latestWitnessClue,
      flyingFromId,
      flyingToId,
      flightDurationMs,
      activeLevel,
      crewHelped,
      triedChoiceIndices,
      showGentleHint,
      postcardDestId,
      postcardFlipped,
      celebratingNewDiscovery,
      passportHighlightId,
    ]
  );

  const liveSessionStateRef = useRef<LiveSessionState>(liveSessionState);
  useEffect(() => {
    liveSessionStateRef.current = liveSessionState;
  }, [liveSessionState]);

  useEffect(() => {
    if ((tvConnectedCode || tabletHostCode) && tvHandleRef.current) {
      tvHandleRef.current.sendState(liveSessionState);
    }
  }, [tvConnectedCode, tabletHostCode, liveSessionState]);

  const handleConnectToTv = useCallback((code: string) => {
    const clean = normalizeRoomCode(code);
    if (clean.length !== 4) return;
    tvHandleRef.current?.disconnect();
    setTabletHostCode(null);
    setTvConnecting(true);
    setTvError(null);

    const handle = connectTabletToTv(clean, {
      onConnected: () => {
        setTvConnecting(false);
        setTvConnectedCode(clean);
        setTvModalOpen(false);
        setTvError(null);
        handle.sendState(liveSessionStateRef.current);
      },
      onDisconnected: () => setTvConnectedCode(null),
      onError: (msg) => {
        setTvConnecting(false);
        setTvError(msg);
      },
    });
    tvHandleRef.current = handle;
  }, []);

  const startHostingFromTablet = useCallback(() => {
    const freshCode = generateRoomCode();
    tvHandleRef.current?.disconnect();
    setTvConnectedCode(null);
    setTvConnecting(false);
    setTvError(null);
    setTabletHostCode(freshCode);

    const handle = startTabletHost(freshCode, {
      onReady: () => {
        setTvError(null);
        handle.sendState(liveSessionStateRef.current);
      },
      onTvConnected: () => {
        setTvConnectedCode(freshCode);
        setTvModalOpen(false);
        setTvError(null);
        handle.sendState(liveSessionStateRef.current);
      },
      onTvDisconnected: () => setTvConnectedCode(null),
      onError: (msg) => setTvError(msg),
    });
    tvHandleRef.current = handle;
  }, []);

  const handleStopTabletHost = useCallback(() => {
    tvHandleRef.current?.disconnect();
    tvHandleRef.current = null;
    setTabletHostCode(null);
    setTvConnectedCode(null);
  }, []);

  const handleDisconnectTv = () => {
    tvHandleRef.current?.disconnect();
    tvHandleRef.current = null;
    setTvConnectedCode(null);
    setTabletHostCode(null);
  };

  // Open or Resume a Mystery Case
  const openMission = (mission: CaseMission) => {
    const pilotId =
      mission.playerIds[mission.currentTurnIndex % mission.playerIds.length];
    const pilot =
      savedState.players.find((p) => p.id === pilotId) ?? savedState.players[0];

    setSavedState((prev) => ({
      ...prev,
      activeMissionId: mission.id,
      discoveredDestIds: prev.discoveredDestIds.includes(mission.currentDestId)
        ? prev.discoveredDestIds
        : [...prev.discoveredDestIds, mission.currentDestId],
    }));

    setActiveLevel(pilot.defaultLevel);
    setActiveSpotId(null);
    setLastVisitedSpotId(null);
    setActiveQuestion(null);
    setSelectedChoiceIndex(null);
    setSelectedEra(mission.currentEra ?? 'modern');
    setLatestWitnessClue(null);
    setFlyingFromId(null);
    setFlyingToId(null);
    setFlyingIsReturn(false);
    setCrewHelped(false);
    setTriedChoiceIndices([]);
    setShowGentleHint(false);
    setPostcardDestId(null);
    setPostcardFlipped(false);
    setWarrantFeedback(null);

    if (mission.status !== 'active') {
      setTurnPhase('case-complete');
    } else if (mission.isOnWrongEra) {
      setTurnPhase('time-slip');
    } else if (mission.isOnColdTrail) {
      setTurnPhase('cold-trail');
    } else {
      setTurnPhase('town-hub');
    }
    setScreen('expedition');
  };

  const handleCreateMission = (params: {
    title?: string;
    missionDifficulty: MissionDifficulty;
    stopsCount: number;
    playerIds: string[];
  }) => {
    const mission = createCaseMission(params);
    setSavedState((prev) => ({
      ...prev,
      missions: [mission, ...prev.missions],
      activeMissionId: mission.id,
      discoveredDestIds: prev.discoveredDestIds.includes(mission.currentDestId)
        ? prev.discoveredDestIds
        : [...prev.discoveredDestIds, mission.currentDestId],
    }));
    setNewMissionOpen(false);

    const firstPilot =
      savedState.players.find((p) => p.id === mission.playerIds[0]) ??
      savedState.players[0];
    setActiveLevel(firstPilot.defaultLevel);
    setActiveSpotId(null);
    setLastVisitedSpotId(null);
    setActiveQuestion(null);
    setSelectedChoiceIndex(null);
    setSelectedEra(mission.currentEra ?? 'modern');
    setLatestWitnessClue(null);
    setFlyingFromId(null);
    setFlyingToId(null);
    setFlyingIsReturn(false);
    setCrewHelped(false);
    setTriedChoiceIndices([]);
    setShowGentleHint(false);
    setPostcardDestId(null);
    setPostcardFlipped(false);
    setWarrantFeedback(null);
    setTurnPhase('town-hub');
    setScreen('expedition');
  };

  const handleDeleteMission = (missionId: string) => {
    setSavedState((prev) => ({
      ...prev,
      missions: prev.missions.filter((m) => m.id !== missionId),
      activeMissionId: prev.activeMissionId === missionId ? null : prev.activeMissionId,
    }));
  };

  // Crew Profile CRUD
  const handleSavePlayer = (data: {
    name: string;
    avatar: AvatarId;
    defaultLevel: DifficultyLevel;
  }) => {
    if (editingPlayer === 'new') {
      const added = createPlayer(data.name, data.avatar, data.defaultLevel);
      setSavedState((prev) => ({ ...prev, players: [...prev.players, added] }));
    } else if (editingPlayer) {
      setSavedState((prev) => ({
        ...prev,
        players: prev.players.map((p) =>
          p.id === editingPlayer.id ? { ...p, ...data } : p
        ),
      }));
    }
    setEditingPlayer(null);
  };

  const handleDeletePlayer = () => {
    if (!editingPlayer || editingPlayer === 'new') return;
    if (savedState.players.length <= 1) return;
    const removeId = editingPlayer.id;
    setSavedState((prev) => {
      const nextPlayers = prev.players.filter((p) => p.id !== removeId);
      return {
        ...prev,
        players: nextPlayers,
        missions: prev.missions.map((m) => {
          const remaining = m.playerIds.filter((id) => id !== removeId);
          return {
            ...m,
            playerIds: remaining.length > 0 ? remaining : [nextPlayers[0].id],
          };
        }),
      };
    });
    setEditingPlayer(null);
  };

  // =========================================================================
  // GAMEPLAY HANDLERS (TOWN HUB -> 2-STEP CHALLENGE -> DEPARTURE -> FLIGHT -> FINALE)
  // =========================================================================

  const handleSelectSpot = (spot: CityLandmark) => {
    if (!activeMission || turnPhase !== 'town-hub') return;
    const q = selectSpotQuestion({
      destId: activeMission.currentDestId,
      level: activeLevel,
      spot,
      seenQuestionIds: savedState.seenQuestionIds,
    });
    setActiveSpotId(spot.id);
    setLastVisitedSpotId(spot.id);
    setActiveQuestion(q);
    setSelectedChoiceIndex(null);
    setLatestWitnessClue(null);
    setCrewHelped(false);
    setTriedChoiceIndices([]);
    setShowGentleHint(false);
    setTurnPhase('spot-challenge');
  };

  const handleChangeLevel = (level: DifficultyLevel) => {
    setActiveLevel(level);
    if (turnPhase === 'spot-challenge' && activeMission && activeSpotId) {
      const layout = getCityLayout(activeMission.currentDestId);
      const spot =
        layout.landmarks.find((s) => s.id === activeSpotId) ?? layout.landmarks[0];
      if (!spot) return;
      const q = selectSpotQuestion({
        destId: activeMission.currentDestId,
        level,
        spot,
        seenQuestionIds: savedState.seenQuestionIds,
      });
      setActiveQuestion(q);
      setSelectedChoiceIndex(null);
      setTriedChoiceIndices([]);
      setShowGentleHint(false);
    }
  };

  const handleSelectChoice = (choiceIdx: number) => {
    if (triedChoiceIndices.includes(choiceIdx)) return;
    setSelectedChoiceIndex(choiceIdx);
  };

  const handleConfirmAnswer = () => {
    if (
      !activeMission ||
      !activeQuestion ||
      !activeSpotId ||
      selectedChoiceIndex === null ||
      turnPhase !== 'spot-challenge'
    ) {
      return;
    }

    const choiceIdx = selectedChoiceIndex;
    setSelectedChoiceIndex(null);

    if (choiceIdx === activeQuestion.correctIndex) {
      const layout = getCityLayout(activeMission.currentDestId);
      const spot =
        layout.landmarks.find((s) => s.id === activeSpotId) ?? layout.landmarks[0];

      const isFinalStop =
        activeMission.trailProgressIndex >= activeMission.trailDestIds.length - 1;
      const nextDestId = isFinalStop
        ? null
        : activeMission.trailDestIds[activeMission.trailProgressIndex + 1];
      const nextDest = nextDestId ? DESTINATIONS_BY_ID[nextDestId] ?? null : null;
      const targetEra = isFinalStop
        ? null
        : activeMission.trailEras?.[activeMission.trailProgressIndex + 1] ?? null;

      const culprit = SUSPECTS_BY_ID[activeMission.culpritId];
      const spotsHere = activeMission.investigatedSpotsByCity[activeMission.currentDestId] ?? [];
      const traitsFound = Object.keys(activeMission.discoveredSuspectTraits).length;
      const shouldDropTrait =
        traitsFound < 4 && (spotsHere.length === 0 || isFinalStop);

      const clueLevel = getLowestCrewLevel(missionPlayers);

      const witnessClue = generateWitnessClue({
        spot,
        nextDest,
        culprit,
        caseKind: activeMission.kind,
        missionDifficulty: activeMission.missionDifficulty,
        targetEra,
        clueLevel,
        discoveredTraits: activeMission.discoveredSuspectTraits,
        dropSuspectTrait: shouldDropTrait,
      });

      const nextHours = activeMission.hoursElapsed + spot.clockHours;
      const outOfTime = nextHours >= activeMission.totalHoursBudget;

      setSavedState((prev) => {
        const nextSeen = [...prev.seenQuestionIds, activeQuestion.id].slice(-400);
        const updatedMissions = prev.missions.map((m) => {
          if (m.id !== activeMission.id) return m;
          const prevSpots = m.investigatedSpotsByCity[m.currentDestId] ?? [];
          const nextSpots = prevSpots.includes(activeSpotId)
            ? prevSpots
            : [...prevSpots, activeSpotId];
          const nextTraits = { ...m.discoveredSuspectTraits };
          if (witnessClue.suspectTraitKey && witnessClue.suspectTraitValue) {
            nextTraits[witnessClue.suspectTraitKey] = witnessClue.suspectTraitValue;
          }
          return {
            ...m,
            hoursElapsed: nextHours,
            crewHelpCount: m.crewHelpCount + (crewHelped ? 1 : 0),
            investigatedSpotsByCity: {
              ...m.investigatedSpotsByCity,
              [m.currentDestId]: nextSpots,
            },
            cluesLog: [
              ...m.cluesLog,
              {
                cityId: m.currentDestId,
                spotId: activeSpotId,
                spotTitle: witnessClue.spotTitle,
                witnessName: witnessClue.witnessName,
                icon: witnessClue.icon,
                destinationClue: witnessClue.destinationClue,
                eraClue: witnessClue.eraClue,
                suspectClue: witnessClue.suspectClue,
              },
            ],
            discoveredSuspectTraits: nextTraits,
            status: outOfTime ? ('escaped' as const) : m.status,
            updatedAt: Date.now(),
          };
        });
        return {
          ...prev,
          seenQuestionIds: nextSeen,
          missions: updatedMissions,
        };
      });

      setLatestWitnessClue(witnessClue);
      setLastVisitedSpotId(activeSpotId);
      setActiveQuestion(null);
      setActiveSpotId(null);
      setTurnPhase(outOfTime ? 'case-complete' : 'town-hub');
    } else {
      setTriedChoiceIndices((prev) =>
        prev.includes(choiceIdx) ? prev : [...prev, choiceIdx]
      );
      setShowGentleHint(true);
    }
  };

  const handleDismissWitnessClue = () => {
    if (!activeMission) return;
    setLatestWitnessClue(null);

    const nextIdx =
      (activeMission.currentTurnIndex + 1) % activeMission.playerIds.length;
    const nextPilotId = activeMission.playerIds[nextIdx];
    const nextPilot =
      savedState.players.find((p) => p.id === nextPilotId) ?? savedState.players[0];

    setSavedState((prev) => ({
      ...prev,
      missions: prev.missions.map((m) =>
        m.id === activeMission.id
          ? { ...m, currentTurnIndex: nextIdx, updatedAt: Date.now() }
          : m
      ),
    }));
    setActiveLevel(nextPilot.defaultLevel);
  };

  // Shared helper for advancing to a verified next city (+ era in Time-Warp!)
  const advanceHotTrailArrival = useCallback(
    (targetDestId: string, nextHours: number, landedEra?: HistoricalEra) => {
      if (!activeMission) return;
      const nextProgress = activeMission.trailProgressIndex + 1;
      const isFinal = nextProgress >= activeMission.trailDestIds.length - 1;
      const nextHopTarget = isFinal
        ? targetDestId
        : activeMission.trailDestIds[nextProgress + 1];
      const nextVisited = activeMission.visitedDestIds.includes(targetDestId)
        ? activeMission.visitedDestIds
        : [...activeMission.visitedDestIds, targetDestId];
      const nextBoard = isFinal
        ? []
        : buildDepartureBoard(
            targetDestId,
            nextHopTarget,
            nextVisited,
            activeMission.missionDifficulty
          );

      const isNewDiscovery = !savedState.discoveredDestIds.includes(targetDestId);
      setCelebratingNewDiscovery(isNewDiscovery);
      setPostcardDestId(targetDestId);
      setPostcardFlipped(false);
      setLatestWitnessClue(null);
      setLastVisitedSpotId(null);

      const nextTurnIdx =
        (activeMission.currentTurnIndex + 1) % activeMission.playerIds.length;
      const nextPilot =
        savedState.players.find(
          (p) => p.id === activeMission.playerIds[nextTurnIdx]
        ) ?? savedState.players[0];
      setActiveLevel(nextPilot.defaultLevel);

      setSavedState((prev) => ({
        ...prev,
        discoveredDestIds: isNewDiscovery
          ? [...prev.discoveredDestIds, targetDestId]
          : prev.discoveredDestIds,
        missions: prev.missions.map((m) =>
          m.id === activeMission.id
            ? {
                ...m,
                currentDestId: targetDestId,
                currentEra: landedEra ?? m.currentEra,
                lastValidDestId: targetDestId,
                isOnColdTrail: false,
                isOnWrongEra: false,
                trailProgressIndex: nextProgress,
                departureOptions: nextBoard,
                visitedDestIds: nextVisited,
                currentTurnIndex: nextTurnIdx,
                hoursElapsed: nextHours,
                updatedAt: Date.now(),
              }
            : m
        ),
      }));
      setTurnPhase('postcard');
    },
    [activeMission, savedState.discoveredDestIds, savedState.players]
  );

  const completeFlightLanding = useCallback(
    (targetDestId: string, isReturnFlight: boolean, chosenEra: HistoricalEra) => {
      if (flyTimerRef.current) {
        window.clearTimeout(flyTimerRef.current);
        flyTimerRef.current = null;
      }

      if (!activeMission) return;
      const fromId = flyingFromId ?? activeMission.currentDestId;
      const flightHours = isReturnFlight
        ? 8
        : computeFlightHours(fromId, targetDestId);
      const nextHours = activeMission.hoursElapsed + flightHours;
      const outOfTime = nextHours >= activeMission.totalHoursBudget;

      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      if (outOfTime) {
        setSavedState((prev) => ({
          ...prev,
          missions: prev.missions.map((m) =>
            m.id === activeMission.id
              ? {
                  ...m,
                  currentDestId: targetDestId,
                  hoursElapsed: nextHours,
                  status: 'escaped',
                  updatedAt: Date.now(),
                }
              : m
          ),
        }));
        setTurnPhase('case-complete');
        return;
      }

      if (isReturnFlight) {
        setLastVisitedSpotId(null);
        setSavedState((prev) => ({
          ...prev,
          missions: prev.missions.map((m) =>
            m.id === activeMission.id
              ? {
                  ...m,
                  currentDestId: targetDestId,
                  isOnColdTrail: false,
                  isOnWrongEra: false,
                  visitedDestIds: [...m.visitedDestIds, targetDestId],
                  hoursElapsed: nextHours,
                  updatedAt: Date.now(),
                }
              : m
          ),
        }));
        setTurnPhase('town-hub');
        return;
      }

      const expectedNextId =
        activeMission.trailDestIds[activeMission.trailProgressIndex + 1];
      const isCorrectCity = targetDestId === expectedNextId;

      if (isCorrectCity) {
        // Level 4 Time-Warp check: did they ALSO dial the right Historical Era?
        const expectedEra =
          activeMission.missionDifficulty === 'time-warp'
            ? activeMission.trailEras?.[activeMission.trailProgressIndex + 1]
            : undefined;

        if (expectedEra && chosenEra !== expectedEra) {
          setLastVisitedSpotId(null);
          setSelectedEra(chosenEra);
          setSavedState((prev) => ({
            ...prev,
            missions: prev.missions.map((m) =>
              m.id === activeMission.id
                ? {
                    ...m,
                    currentDestId: targetDestId,
                    isOnColdTrail: false,
                    isOnWrongEra: true,
                    visitedDestIds: [...m.visitedDestIds, targetDestId],
                    hoursElapsed: nextHours,
                    wrongFlightsCount: m.wrongFlightsCount + 1,
                    updatedAt: Date.now(),
                  }
                : m
            ),
          }));
          setTurnPhase('time-slip');
          return;
        }

        advanceHotTrailArrival(targetDestId, nextHours, expectedEra);
      } else {
        // COLD TRAIL DRAMA!
        const isNewDiscovery = !savedState.discoveredDestIds.includes(targetDestId);
        setLastVisitedSpotId(null);
        setSavedState((prev) => ({
          ...prev,
          discoveredDestIds: isNewDiscovery
            ? [...prev.discoveredDestIds, targetDestId]
            : prev.discoveredDestIds,
          missions: prev.missions.map((m) =>
            m.id === activeMission.id
              ? {
                  ...m,
                  currentDestId: targetDestId,
                  isOnColdTrail: true,
                  isOnWrongEra: false,
                  visitedDestIds: [...m.visitedDestIds, targetDestId],
                  hoursElapsed: nextHours,
                  wrongFlightsCount: m.wrongFlightsCount + 1,
                  updatedAt: Date.now(),
                }
              : m
          ),
        }));
        setTurnPhase('cold-trail');
      }
    },
    [activeMission, flyingFromId, savedState.discoveredDestIds, advanceHotTrailArrival]
  );

  const handleJumpEraInCity = (era: HistoricalEra) => {
    if (!activeMission || turnPhase !== 'time-slip') return;
    const nextHours = activeMission.hoursElapsed + 6;
    const outOfTime = nextHours >= activeMission.totalHoursBudget;

    if (outOfTime) {
      setSavedState((prev) => ({
        ...prev,
        missions: prev.missions.map((m) =>
          m.id === activeMission.id
            ? { ...m, hoursElapsed: nextHours, status: 'escaped', updatedAt: Date.now() }
            : m
        ),
      }));
      setTurnPhase('case-complete');
      return;
    }

    const expectedEra = activeMission.trailEras?.[activeMission.trailProgressIndex + 1];
    setSelectedEra(era);

    if (!expectedEra || era === expectedEra) {
      advanceHotTrailArrival(activeMission.currentDestId, nextHours, era);
    } else {
      setSavedState((prev) => ({
        ...prev,
        missions: prev.missions.map((m) =>
          m.id === activeMission.id
            ? {
                ...m,
                hoursElapsed: nextHours,
                wrongFlightsCount: m.wrongFlightsCount + 1,
                updatedAt: Date.now(),
              }
            : m
        ),
      }));
    }
  };

  const launchFlight = (targetDestId: string, isReturnFlight = false) => {
    if (!activeMission) return;
    const fromId = activeMission.currentDestId;
    const durationMs = computeFlightAnimationMs(fromId, targetDestId);
    const chosenEra = selectedEra;
    setFlyingFromId(fromId);
    setFlyingToId(targetDestId);
    setFlightDurationMs(durationMs);
    setFlyingIsReturn(isReturnFlight);
    setFlyingTargetEra(chosenEra);
    setLatestWitnessClue(null);
    setTurnPhase('flying');

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (flyTimerRef.current) window.clearTimeout(flyTimerRef.current);
    flyTimerRef.current = window.setTimeout(() => {
      completeFlightLanding(targetDestId, isReturnFlight, chosenEra);
    }, durationMs);
  };

  const handleLandEarly = () => {
    if (turnPhase !== 'flying' || !flyingToId) return;
    completeFlightLanding(flyingToId, flyingIsReturn, flyingTargetEra);
  };

  const handleMarkHistoryFlipped = (destId: string) => {
    setSavedState((prev) =>
      prev.flippedHistoryIds.includes(destId)
        ? prev
        : { ...prev, flippedHistoryIds: [...prev.flippedHistoryIds, destId] }
    );
  };

  const handleTogglePostcardFlip = () => {
    setPostcardFlipped((prev) => {
      const next = !prev;
      if (next && postcardDestId) {
        handleMarkHistoryFlipped(postcardDestId);
      }
      return next;
    });
  };

  const handleSelectWarrantSuspect = (suspectId: string) => {
    if (!activeMission) return;
    setWarrantFeedback(null);
    setSavedState((prev) => ({
      ...prev,
      missions: prev.missions.map((m) =>
        m.id === activeMission.id
          ? { ...m, selectedWarrantSuspectId: suspectId, updatedAt: Date.now() }
          : m
      ),
    }));
  };

  const handleSubmitWarrant = () => {
    if (!activeMission || !activeMission.selectedWarrantSuspectId) return;
    if (activeMission.selectedWarrantSuspectId === activeMission.culpritId) {
      const medal =
        activeMission.wrongFlightsCount === 0
          ? 'gold'
          : activeMission.wrongFlightsCount === 1
            ? 'silver'
            : 'bronze';
      setSavedState((prev) => ({
        ...prev,
        solvedCaseCount: prev.solvedCaseCount + 1,
        missions: prev.missions.map((m) =>
          m.id === activeMission.id
            ? { ...m, status: 'won', medal, updatedAt: Date.now() }
            : m
        ),
      }));
      setWarrantFeedback(null);
      setTurnPhase('case-complete');
    } else {
      const nextHours = activeMission.hoursElapsed + 6;
      const outOfTime = nextHours >= activeMission.totalHoursBudget;
      setSavedState((prev) => ({
        ...prev,
        missions: prev.missions.map((m) =>
          m.id === activeMission.id
            ? {
                ...m,
                hoursElapsed: nextHours,
                status: outOfTime ? 'escaped' : m.status,
                updatedAt: Date.now(),
              }
            : m
        ),
      }));
      if (outOfTime) {
        setTurnPhase('case-complete');
      } else {
        setWarrantFeedback(
          'Not quite! That suspect doesn’t match all your collected profile traits (-6 hours). Double-check the traits above or interview another witness in town!'
        );
      }
    }
  };

  // TV BIG SCREEN MODE
  if (isTvDisplayMode) {
    return <TvDisplayScreen onExit={() => setIsTvDisplayMode(false)} />;
  }

  // EXPEDITION / MYSTERY CASE SCREEN
  if (screen === 'expedition' && activeMission) {
    return (
      <>
        <ExpeditionScreen
          mission={activeMission}
          currentPlayer={currentPlayer}
          nextPlayer={nextPlayer}
          crewAvatars={missionPlayers.map((p) => p.avatar)}
          discoveredDestIds={savedState.discoveredDestIds}
          turnPhase={turnPhase}
          activeSpotId={activeSpotId}
          lastVisitedSpotId={lastVisitedSpotId}
          activeQuestion={activeQuestion}
          selectedChoiceIndex={selectedChoiceIndex}
          selectedEra={selectedEra}
          latestWitnessClue={latestWitnessClue}
          flyingFromId={flyingFromId}
          flyingToId={flyingToId}
          flightDurationMs={flightDurationMs}
          activeLevel={activeLevel}
          crewHelped={crewHelped}
          triedChoiceIndices={triedChoiceIndices}
          showGentleHint={showGentleHint}
          postcardDestId={postcardDestId}
          postcardFlipped={postcardFlipped}
          celebratingNewDiscovery={celebratingNewDiscovery}
          warrantFeedback={warrantFeedback}
          tvConnectedCode={tvConnectedCode}
          onSelectSpot={handleSelectSpot}
          onChangeLevel={handleChangeLevel}
          onSelectChoice={handleSelectChoice}
          onConfirmAnswer={handleConfirmAnswer}
          onSelectEra={setSelectedEra}
          onJumpEraInCity={handleJumpEraInCity}
          onAskCrew={() => setCrewHelped(true)}
          onDismissWitnessClue={handleDismissWitnessClue}
          onOpenDepartureBoard={() => setTurnPhase('departure-board')}
          onBackToTownHub={() => {
            setWarrantFeedback(null);
            setTurnPhase('town-hub');
          }}
          onFlyToDestination={(destId) => launchFlight(destId, false)}
          onLandEarly={handleLandEarly}
          onFlyBackToLastValid={() => launchFlight(activeMission.lastValidDestId, true)}
          onTogglePostcardFlip={handleTogglePostcardFlip}
          onFinishPostcard={() => setTurnPhase('town-hub')}
          onOpenFinaleWarrant={() => {
            setWarrantFeedback(null);
            setTurnPhase('finale-warrant');
          }}
          onSelectWarrantSuspect={handleSelectWarrantSuspect}
          onSubmitWarrant={handleSubmitWarrant}
          onOpenFieldGuide={(compareIds) => {
            setFieldGuideCompareIds(compareIds ?? []);
            setFieldGuideOpen(true);
          }}
          onOpenNotebook={() => setNotebookOpen(true)}
          onOpenPassport={() => setPassportOpen(true)}
          onStartNewCase={() => setNewMissionOpen(true)}
          onExitHome={() => setScreen('home')}
        />

        {fieldGuideOpen && (
          <FieldGuideModal
            compareDestIds={fieldGuideCompareIds}
            onClose={() => setFieldGuideOpen(false)}
          />
        )}

        {notebookOpen && (
          <CaseNotebookModal
            mission={activeMission}
            onSelectWarrant={handleSelectWarrantSuspect}
            onClose={() => setNotebookOpen(false)}
          />
        )}

        {passportOpen && (
          <PassportView
            discoveredDestIds={savedState.discoveredDestIds}
            flippedHistoryIds={savedState.flippedHistoryIds}
            onFlipHistory={handleMarkHistoryFlipped}
            onHighlightDest={setPassportHighlightId}
            onClose={() => {
              setPassportHighlightId(null);
              setPassportOpen(false);
            }}
          />
        )}

        {newMissionOpen && (
          <NewMissionModal
            players={savedState.players}
            onCreate={handleCreateMission}
            onClose={() => setNewMissionOpen(false)}
          />
        )}
      </>
    );
  }

  // HOME / FAMILY DETECTIVE ATLAS HUB
  const recentDiscovered = savedState.discoveredDestIds
    .slice(-5)
    .reverse()
    .map((id) => DESTINATIONS_BY_ID[id])
    .filter(Boolean);

  return (
    <div className="home-shell">
      <div className="home-container">
        {/* Top Masthead */}
        <header className="home-topbar">
          <div className="brand-lockup">
            <div className="brand-emblem">
              <BalloonEmblem size={42} />
            </div>
            <div>
              <h1 className="brand-title">Wanderbook Atlas</h1>
              <p className="brand-subtitle">
                {DESTINATIONS.length} World & US Cities (All 50 States!) • 1,235 Real Landmarks • 4-Level Detective Chase
              </p>
            </div>
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="btn btn-sage btn-sm"
              onClick={() => {
                setFieldGuideCompareIds([]);
                setFieldGuideOpen(true);
              }}
            >
              <BookOpen size={17} /> Field Guide ({DESTINATIONS.length})
            </button>
            <button
              type="button"
              className="btn btn-ochre btn-sm"
              onClick={() => setPassportOpen(true)}
            >
              <Award size={17} /> Passport ({savedState.discoveredDestIds.length}/{DESTINATIONS.length})
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings size={17} /> Save & TV Tips
            </button>
          </div>
        </header>

        {/* Main 2-Column Storybook Dashboard */}
        <div className="home-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Crew Roster */}
            <section className="paper-panel section-card" aria-label="Family Detective Crew">
              <div className="section-header">
                <h2 className="section-title">
                  <Users size={22} color="var(--mariner)" /> Your Detective Crew
                </h2>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditingPlayer('new')}
                >
                  <Plus size={16} /> Add Explorer
                </button>
              </div>

              <div className="crew-row">
                {savedState.players.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="crew-card"
                    onClick={() => setEditingPlayer(p)}
                  >
                    <AnimalAvatar avatar={p.avatar} size={46} />
                    <div style={{ textAlign: 'left' }}>
                      <div className="crew-card-name">{p.name}</div>
                      <span
                        className={`level-pill ${p.defaultLevel}`}
                        style={{ marginTop: 4, fontSize: '0.72rem', padding: '2px 8px' }}
                      >
                        {p.defaultLevel === 'explorer'
                          ? 'Explorer'
                          : p.defaultLevel === 'navigator'
                            ? 'Navigator'
                            : p.defaultLevel === 'cartographer'
                              ? 'Cartographer'
                              : 'Master Scholar'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--ink-muted)', fontWeight: 600, marginTop: 12 }}>
                Tap any explorer to customize their name, companion, and personal question difficulty tier.
              </p>
            </section>

            {/* Saved Mystery Cases */}
            <section className="paper-panel section-card" aria-label="Mystery Case Files">
              <div className="section-header">
                <h2 className="section-title">
                  <ShieldCheck size={22} color="var(--terracotta)" /> Active Detective Cases
                </h2>
                <button
                  type="button"
                  className="btn btn-terracotta btn-sm"
                  onClick={() => setNewMissionOpen(true)}
                >
                  <Plus size={16} /> Open New Case
                </button>
              </div>

              {savedState.missions.length === 0 ? (
                <div
                  className="paper-card"
                  style={{
                    padding: '24px 20px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12,
                    background: 'var(--parchment)',
                  }}
                >
                  <BalloonEmblem size={54} />
                  <h3 style={{ fontSize: '1.38rem' }}>Your First Detective Chase Awaits!</h3>
                  <p style={{ color: 'var(--ink-soft)', maxWidth: 460, lineHeight: 1.5, fontWeight: 600 }}>
                    Choose your Mission Scope—from <strong>Across the USA (All 50 States)</strong> to{' '}
                    <strong>Iconic World</strong>, <strong>Full World ({DESTINATIONS.length} Cities)</strong>, or{' '}
                    <strong>Time-Warp Chase</strong> across historical eras!
                  </p>
                  <button
                    type="button"
                    className="btn btn-terracotta btn-lg"
                    onClick={() => setNewMissionOpen(true)}
                  >
                    <Play size={19} /> Launch Detective Case
                  </button>
                </div>
              ) : (
                <div className="missions-list">
                  {savedState.missions.map((mission) => {
                    const currentDest = DESTINATIONS_BY_ID[mission.currentDestId];
                    const clk = formatTravelClock(
                      mission.hoursElapsed,
                      mission.totalHoursBudget
                    );
                    const pilotId =
                      mission.playerIds[
                        mission.currentTurnIndex % mission.playerIds.length
                      ];
                    const pilot =
                      savedState.players.find((p) => p.id === pilotId) ??
                      savedState.players[0];
                    const diffLabel =
                      MISSION_DIFFICULTY_INFO[mission.missionDifficulty]?.shortLabel ??
                      'World';

                    return (
                      <div key={mission.id} className="mission-slot">
                        <div className="mission-slot-meta">
                          <div className="mission-slot-title">
                            <span>{mission.title}</span>
                            <span className="level-pill navigator">{diffLabel}</span>
                            {mission.status === 'won' && (
                              <span className="level-pill explorer">
                                Solved ({mission.medal?.toUpperCase()})
                              </span>
                            )}
                            {mission.status === 'escaped' && (
                              <span className="level-pill scholar">Escaped</span>
                            )}
                            {mission.isOnColdTrail && mission.status === 'active' && (
                              <span className="level-pill scholar">Cold Trail!</span>
                            )}
                            {mission.isOnWrongEra && mission.status === 'active' && (
                              <span className="level-pill cartographer">Time Slip!</span>
                            )}
                          </div>
                          <div className="mission-slot-sub">
                            Stop {mission.trailProgressIndex + 1}/{mission.trailDestIds.length} •{' '}
                            In <strong>{currentDest?.name ?? 'Earth'}</strong> •{' '}
                            <Clock size={12} style={{ verticalAlign: 'middle' }} />{' '}
                            {clk.daysRemainingText} • Up next: <strong>{pilot?.name}</strong>
                          </div>
                        </div>

                        <div className="mission-slot-actions">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => openMission(mission)}
                          >
                            <Play size={15} /> {mission.status === 'active' ? 'Investigate' : 'View'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => handleDeleteMission(mission.id)}
                            aria-label={`Delete ${mission.title}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN: TV + PASSPORT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <section className="tv-card" aria-label="TV and Tablet Living Room Mode">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div className="stamp-label" style={{ color: '#F6DFB1' }}>LIVING ROOM MODE</div>
                {tvConnectedCode ? (
                  <span className="tv-status-pill">
                    <span className="status-dot" /> Linked • {tvConnectedCode}
                  </span>
                ) : tabletHostCode ? (
                  <span className="tv-status-pill">
                    <span className="status-dot" style={{ background: '#facc15' }} /> Hosting • {tabletHostCode}
                  </span>
                ) : null}
              </div>

              <h3>Watch on TV, Pass the Tablet!</h3>
              <p>
                Link your Android tablet to your Google TV Streamer either way—enter your TV’s code
                here, or display a Tablet Code for your TV to type in!
              </p>

              {tvConnectedCode ? (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleDisconnectTv}
                >
                  <Unlink size={16} /> Unlink TV ({tvConnectedCode})
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    type="button"
                    className="btn btn-ochre"
                    onClick={() => {
                      setTvError(null);
                      setTvModalOpen(true);
                    }}
                  >
                    <Tv size={18} />{' '}
                    {tabletHostCode
                      ? `Tablet Code Ready (${tabletHostCode}) — Open Link`
                      : 'Connect Tablet to a TV'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsTvDisplayMode(true)}
                  >
                    Open TV Big Screen on This Device
                  </button>
                </div>
              )}
            </section>

            {/* Master Family Passport Preview */}
            <section className="paper-panel section-card" aria-label="Master Family Passport">
              <div className="section-header" style={{ marginBottom: 12 }}>
                <h2 className="section-title">
                  <Compass size={22} color="var(--ochre)" /> Family Atlas Record
                </h2>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPassportOpen(true)}
                >
                  Open Book
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.9rem', marginBottom: 7, flexWrap: 'wrap', gap: 6 }}>
                <span>{savedState.discoveredDestIds.length} / {DESTINATIONS.length} Places Stamped</span>
                <span style={{ color: 'var(--sage-dark)' }}>
                  {savedState.solvedCaseCount} {savedState.solvedCaseCount === 1 ? 'Case' : 'Cases'} Solved
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(savedState.discoveredDestIds.length / DESTINATIONS.length) * 100}%`,
                  }}
                />
              </div>

              {recentDiscovered.length > 0 ? (
                <div style={{ marginTop: 14 }}>
                  <div className="stamp-label" style={{ color: 'var(--ink-muted)', marginBottom: 8 }}>
                    RECENT SOUVENIRS COLLECTED
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {recentDiscovered.map((dest) => (
                      <div
                        key={dest.id}
                        title={`${dest.souvenirName} (${dest.name})`}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
                      >
                        <SouvenirArt id={dest.souvenirId} size={46} />
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--ink-soft)' }}>
                          {dest.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '0.86rem', color: 'var(--ink-soft)', marginTop: 12, lineHeight: 1.45, fontWeight: 600 }}>
                  Explore all 50 US states and {DESTINATIONS.length} total destinations, solve mystery
                  chases, and collect every Time-Flip Postcard and Souvenir!
                </p>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {editingPlayer && (
        <CrewModal
          player={editingPlayer === 'new' ? null : editingPlayer}
          canDelete={savedState.players.length > 1}
          onSave={handleSavePlayer}
          onDelete={handleDeletePlayer}
          onClose={() => setEditingPlayer(null)}
        />
      )}

      {newMissionOpen && (
        <NewMissionModal
          players={savedState.players}
          onCreate={handleCreateMission}
          onClose={() => setNewMissionOpen(false)}
        />
      )}

      {fieldGuideOpen && (
        <FieldGuideModal
          compareDestIds={fieldGuideCompareIds}
          onClose={() => setFieldGuideOpen(false)}
        />
      )}

      {passportOpen && (
        <PassportView
          discoveredDestIds={savedState.discoveredDestIds}
          flippedHistoryIds={savedState.flippedHistoryIds}
          onFlipHistory={handleMarkHistoryFlipped}
          onHighlightDest={setPassportHighlightId}
          onClose={() => {
            setPassportHighlightId(null);
            setPassportOpen(false);
          }}
        />
      )}

      {settingsOpen && (
        <SettingsModal
          state={savedState}
          onImportState={(next) => setSavedState(next)}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {tvModalOpen && (
        <TvConnectModal
          initialCode={urlInit.joinCode}
          isConnecting={tvConnecting}
          tabletHostCode={tabletHostCode}
          errorMsg={tvError}
          onConnectToTvCode={handleConnectToTv}
          onStartTabletHost={startHostingFromTablet}
          onRefreshTabletHost={startHostingFromTablet}
          onStopTabletHost={handleStopTabletHost}
          onClose={() => setTvModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
