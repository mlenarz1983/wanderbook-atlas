import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  Compass,
  Play,
  Plus,
  Settings,
  Trash2,
  Tv,
  Unlink,
  Users,
} from 'lucide-react';
import { AnimalAvatar } from './components/art/AnimalAvatar';
import { BalloonEmblem } from './components/art/CompassRose';
import { SouvenirArt } from './components/art/SouvenirArt';
import { CrewModal } from './components/CrewModal';
import { ExpeditionScreen } from './components/ExpeditionScreen';
import { NewMissionModal } from './components/NewMissionModal';
import { PassportView } from './components/PassportView';
import { SettingsModal } from './components/SettingsModal';
import { TvConnectModal } from './components/TvConnectModal';
import { TvDisplayScreen } from './components/TvDisplayScreen';
import {
  DESTINATIONS,
  DESTINATIONS_BY_ID,
  getSuggestedNextRoutes,
} from './data/destinations';
import type {
  AvatarId,
  DifficultyLevel,
  LiveSessionState,
  Mission,
  MissionTheme,
  Player,
  SavedAtlasState,
  TurnPhase,
} from './types/game';
import {
  playCardFlip,
  playClick,
  playCrewHuddle,
  playDiscoveryFanfare,
  playFly,
  playGentleNudge,
  speakText,
  stopSpeaking,
} from './utils/audio';
import {
  createMission,
  createPlayer,
  loadSavedState,
  persistState,
} from './utils/storage';
import {
  connectTabletToTv,
  normalizeRoomCode,
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

  // Navigation & Mode State
  const [isTvDisplayMode, setIsTvDisplayMode] = useState<boolean>(urlInit.isTv);
  const [screen, setScreen] = useState<'home' | 'expedition'>('home');
  const [passportOpen, setPassportOpen] = useState(false);
  const [passportHighlightId, setPassportHighlightId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newMissionOpen, setNewMissionOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | 'new' | null>(null);

  // Live Expedition Turn State
  const [turnPhase, setTurnPhase] = useState<TurnPhase>('choose-route');
  const [flyingFromId, setFlyingFromId] = useState<string | null>(null);
  const [pendingDestId, setPendingDestId] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState<DifficultyLevel>('scout');
  const [crewHelped, setCrewHelped] = useState(false);
  const [triedChoiceIndices, setTriedChoiceIndices] = useState<number[]>([]);
  const [showGentleHint, setShowGentleHint] = useState(false);
  const [postcardFlipped, setPostcardFlipped] = useState(false);
  const [celebratingNewDiscovery, setCelebratingNewDiscovery] = useState(false);

  // TV Pairing (Android Tablet -> Google TV Streamer)
  const [tvModalOpen, setTvModalOpen] = useState<boolean>(Boolean(urlInit.joinCode));
  const [tvConnecting, setTvConnecting] = useState(false);
  const [tvConnectedCode, setTvConnectedCode] = useState<string | null>(null);
  const [tvError, setTvError] = useState<string | null>(null);
  const tvHandleRef = useRef<TabletControllerHandle | null>(null);
  const flyTimerRef = useRef<number | null>(null);

  // Persist family state whenever it updates
  useEffect(() => {
    persistState(savedState);
  }, [savedState]);

  // Clean up timers & peer connections on unmount
  useEffect(() => {
    return () => {
      if (flyTimerRef.current) window.clearTimeout(flyTimerRef.current);
      tvHandleRef.current?.disconnect();
    };
  }, []);

  const soundOn = savedState.preferences.soundEnabled;

  const activeMission: Mission | null = useMemo(
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

  const routeOptions: string[] = useMemo(() => {
    if (!activeMission) return [];
    return getSuggestedNextRoutes(
      activeMission.currentDestId,
      activeMission.visitedDestIds,
      activeMission.theme
    );
  }, [activeMission]);

  // Construct LiveSessionState and stream to paired TV whenever anything changes
  const liveSessionState: LiveSessionState = useMemo(
    () => ({
      screen: passportOpen ? 'passport' : screen,
      activeMission,
      players: savedState.players,
      discoveredDestIds: savedState.discoveredDestIds,
      flippedHistoryIds: savedState.flippedHistoryIds,
      turnPhase,
      routeOptions,
      flyingFromId,
      pendingDestId,
      activeLevel,
      crewHelped,
      triedChoiceIndices,
      showGentleHint,
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
      routeOptions,
      flyingFromId,
      pendingDestId,
      activeLevel,
      crewHelped,
      triedChoiceIndices,
      showGentleHint,
      postcardFlipped,
      celebratingNewDiscovery,
      passportHighlightId,
    ]
  );

  useEffect(() => {
    if (tvConnectedCode && tvHandleRef.current) {
      tvHandleRef.current.sendState(liveSessionState);
    }
  }, [tvConnectedCode, liveSessionState]);

  // Connect Tablet to TV handler
  const handleConnectToTv = useCallback(
    (code: string) => {
      const clean = normalizeRoomCode(code);
      if (clean.length !== 4) return;
      tvHandleRef.current?.disconnect();
      setTvConnecting(true);
      setTvError(null);

      const handle = connectTabletToTv(clean, {
        onConnected: () => {
          setTvConnecting(false);
          setTvConnectedCode(clean);
          setTvModalOpen(false);
          setTvError(null);
          playDiscoveryFanfare(soundOn);
        },
        onDisconnected: () => {
          setTvConnectedCode(null);
        },
        onError: (msg) => {
          setTvConnecting(false);
          setTvError(msg);
        },
      });
      tvHandleRef.current = handle;
    },
    [soundOn]
  );

  const handleDisconnectTv = () => {
    tvHandleRef.current?.disconnect();
    tvHandleRef.current = null;
    setTvConnectedCode(null);
  };

  // Start or Resume an Expedition
  const openMission = (mission: Mission) => {
    stopSpeaking();
    playClick(soundOn);
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
    setFlyingFromId(null);
    setPendingDestId(null);
    setCrewHelped(false);
    setTriedChoiceIndices([]);
    setShowGentleHint(false);
    setPostcardFlipped(false);
    setCelebratingNewDiscovery(false);
    setTurnPhase(mission.completed ? 'mission-complete' : 'choose-route');
    setScreen('expedition');
  };

  const handleCreateMission = (params: {
    title: string;
    theme: MissionTheme;
    targetStops: number | null;
    playerIds: string[];
    startDestId: string;
  }) => {
    const mission = createMission(params);
    setSavedState((prev) => ({
      ...prev,
      missions: [mission, ...prev.missions],
      activeMissionId: mission.id,
      discoveredDestIds: prev.discoveredDestIds.includes(params.startDestId)
        ? prev.discoveredDestIds
        : [...prev.discoveredDestIds, params.startDestId],
    }));
    setNewMissionOpen(false);

    const firstPilot =
      savedState.players.find((p) => p.id === mission.playerIds[0]) ??
      savedState.players[0];
    setActiveLevel(firstPilot.defaultLevel);
    setFlyingFromId(null);
    setPendingDestId(null);
    setCrewHelped(false);
    setTriedChoiceIndices([]);
    setShowGentleHint(false);
    setPostcardFlipped(false);
    setTurnPhase('choose-route');
    setScreen('expedition');
    playFly(soundOn);
  };

  const handleDeleteMission = (missionId: string) => {
    playClick(soundOn);
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
    playClick(soundOn);
    if (editingPlayer === 'new') {
      const added = createPlayer(data.name, data.avatar, data.defaultLevel);
      setSavedState((prev) => ({
        ...prev,
        players: [...prev.players, added],
      }));
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
    playClick(soundOn);
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

  // Gameplay Turn Handlers
  const handleSelectRoute = (destId: string) => {
    if (!activeMission || turnPhase !== 'choose-route') return;
    stopSpeaking();
    playFly(soundOn);
    const fromId = activeMission.currentDestId;
    setFlyingFromId(fromId);
    setPendingDestId(destId);
    setCrewHelped(false);
    setTriedChoiceIndices([]);
    setShowGentleHint(false);
    setPostcardFlipped(false);
    setTurnPhase('flying');

    if (flyTimerRef.current) window.clearTimeout(flyTimerRef.current);
    flyTimerRef.current = window.setTimeout(() => {
      setTurnPhase('question');
      const targetDest = DESTINATIONS_BY_ID[destId];
      if (savedState.preferences.readAloudEnabled && targetDest) {
        const q = targetDest.questions[activeLevel];
        speakText(q.prompt);
      }
    }, 1300);
  };

  const handleChangeLevel = (level: DifficultyLevel) => {
    playClick(soundOn);
    setActiveLevel(level);
    // Reset tried answers if switching level mid-question so choices stay fresh
    setTriedChoiceIndices([]);
    setShowGentleHint(false);
  };

  const handlePickAnswer = (choiceIdx: number) => {
    if (!activeMission || !pendingDestId || turnPhase !== 'question') return;
    const dest = DESTINATIONS_BY_ID[pendingDestId];
    if (!dest) return;
    const q = dest.questions[activeLevel];

    if (choiceIdx === q.correctIndex) {
      stopSpeaking();
      playDiscoveryFanfare(soundOn);
      const isNew = !savedState.discoveredDestIds.includes(dest.id);
      setCelebratingNewDiscovery(isNew);
      setPostcardFlipped(false);

      setSavedState((prev) => {
        const updatedMissions = prev.missions.map((m) => {
          if (m.id !== activeMission.id) return m;
          const nextVisited = m.visitedDestIds.includes(dest.id)
            ? m.visitedDestIds
            : [...m.visitedDestIds, dest.id];
          return {
            ...m,
            currentDestId: dest.id,
            visitedDestIds: nextVisited,
            crewHelpCount: m.crewHelpCount + (crewHelped ? 1 : 0),
            updatedAt: Date.now(),
          };
        });
        return {
          ...prev,
          missions: updatedMissions,
          discoveredDestIds: isNew
            ? [...prev.discoveredDestIds, dest.id]
            : prev.discoveredDestIds,
        };
      });

      setTurnPhase('postcard');
    } else {
      playGentleNudge(soundOn);
      setTriedChoiceIndices((prev) =>
        prev.includes(choiceIdx) ? prev : [...prev, choiceIdx]
      );
      setShowGentleHint(true);
    }
  };

  const handleAskCrew = () => {
    playCrewHuddle(soundOn);
    setCrewHelped(true);
  };

  const handleMarkHistoryFlipped = (destId: string) => {
    setSavedState((prev) => {
      if (prev.flippedHistoryIds.includes(destId)) return prev;
      return {
        ...prev,
        flippedHistoryIds: [...prev.flippedHistoryIds, destId],
      };
    });
  };

  const handleTogglePostcardFlip = () => {
    playCardFlip(soundOn);
    setPostcardFlipped((prev) => {
      const next = !prev;
      if (next && pendingDestId) {
        handleMarkHistoryFlipped(pendingDestId);
      }
      return next;
    });
  };

  const handleAdvanceTurn = () => {
    if (!activeMission) return;
    stopSpeaking();
    playClick(soundOn);

    const reachedGoal =
      activeMission.targetStops !== null &&
      activeMission.visitedDestIds.length >= activeMission.targetStops;

    if (reachedGoal) {
      playDiscoveryFanfare(soundOn);
      setSavedState((prev) => ({
        ...prev,
        missions: prev.missions.map((m) =>
          m.id === activeMission.id
            ? { ...m, completed: true, updatedAt: Date.now() }
            : m
        ),
      }));
      setTurnPhase('mission-complete');
      return;
    }

    const nextIndex =
      (activeMission.currentTurnIndex + 1) % activeMission.playerIds.length;
    const nextPilotId = activeMission.playerIds[nextIndex];
    const nextPilot =
      savedState.players.find((p) => p.id === nextPilotId) ??
      savedState.players[0];

    setSavedState((prev) => ({
      ...prev,
      missions: prev.missions.map((m) =>
        m.id === activeMission.id
          ? { ...m, currentTurnIndex: nextIndex, updatedAt: Date.now() }
          : m
      ),
    }));

    setActiveLevel(nextPilot.defaultLevel);
    setFlyingFromId(null);
    setPendingDestId(null);
    setCrewHelped(false);
    setTriedChoiceIndices([]);
    setShowGentleHint(false);
    setPostcardFlipped(false);
    setTurnPhase('choose-route');
  };

  const handleContinueEndless = () => {
    if (!activeMission) return;
    playFly(soundOn);
    const nextIndex =
      (activeMission.currentTurnIndex + 1) % activeMission.playerIds.length;
    const nextPilotId = activeMission.playerIds[nextIndex];
    const nextPilot =
      savedState.players.find((p) => p.id === nextPilotId) ??
      savedState.players[0];

    setSavedState((prev) => ({
      ...prev,
      missions: prev.missions.map((m) =>
        m.id === activeMission.id
          ? {
              ...m,
              targetStops: null,
              theme: 'open-atlas',
              completed: false,
              currentTurnIndex: nextIndex,
              updatedAt: Date.now(),
            }
          : m
      ),
    }));

    setActiveLevel(nextPilot.defaultLevel);
    setFlyingFromId(null);
    setPendingDestId(null);
    setCrewHelped(false);
    setTriedChoiceIndices([]);
    setShowGentleHint(false);
    setPostcardFlipped(false);
    setTurnPhase('choose-route');
  };

  // TV BIG SCREEN MODE
  if (isTvDisplayMode) {
    return <TvDisplayScreen onExit={() => setIsTvDisplayMode(false)} />;
  }

  // EXPEDITION GAMEPLAY SCREEN
  if (screen === 'expedition' && activeMission) {
    return (
      <>
        <ExpeditionScreen
          mission={activeMission}
          players={missionPlayers}
          currentPlayer={currentPlayer}
          nextPlayer={nextPlayer}
          discoveredDestIds={savedState.discoveredDestIds}
          turnPhase={turnPhase}
          routeOptions={routeOptions}
          flyingFromId={flyingFromId}
          pendingDestId={pendingDestId}
          activeLevel={activeLevel}
          crewHelped={crewHelped}
          triedChoiceIndices={triedChoiceIndices}
          showGentleHint={showGentleHint}
          postcardFlipped={postcardFlipped}
          celebratingNewDiscovery={celebratingNewDiscovery}
          tvConnectedCode={tvConnectedCode}
          onSelectRoute={handleSelectRoute}
          onChangeLevel={handleChangeLevel}
          onPickAnswer={handlePickAnswer}
          onAskCrew={handleAskCrew}
          onTogglePostcardFlip={handleTogglePostcardFlip}
          onAdvanceTurn={handleAdvanceTurn}
          onContinueEndless={handleContinueEndless}
          onReadAloud={speakText}
          onOpenPassport={() => {
            playClick(soundOn);
            setPassportOpen(true);
          }}
          onExitHome={() => {
            stopSpeaking();
            playClick(soundOn);
            setScreen('home');
          }}
        />

        {passportOpen && (
          <PassportView
            discoveredDestIds={savedState.discoveredDestIds}
            flippedHistoryIds={savedState.flippedHistoryIds}
            onFlipHistory={handleMarkHistoryFlipped}
            onReadAloud={speakText}
            onHighlightDest={setPassportHighlightId}
            onClose={() => {
              setPassportHighlightId(null);
              setPassportOpen(false);
            }}
          />
        )}
      </>
    );
  }

  // HOME / FAMILY EXPEDITION HUB
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
                Cooperative Family World Expedition • Stories, Animals & Time-Flip Postcards
              </p>
            </div>
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="btn btn-ochre btn-sm"
              onClick={() => {
                playClick(soundOn);
                setPassportOpen(true);
              }}
            >
              <BookOpen size={17} /> Passport ({savedState.discoveredDestIds.length}/{DESTINATIONS.length})
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                playClick(soundOn);
                setSettingsOpen(true);
              }}
            >
              <Settings size={17} /> Preferences & Save
            </button>
          </div>
        </header>

        {/* Main 2-Column Storybook Dashboard */}
        <div className="home-grid">
          {/* LEFT COLUMN: CREW + ACTIVE EXPEDITIONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Crew Roster */}
            <section className="paper-panel section-card" aria-label="Family Crew Roster">
              <div className="section-header">
                <h2 className="section-title">
                  <Users size={22} color="var(--mariner)" /> Your Explorer Crew
                </h2>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    playClick(soundOn);
                    setEditingPlayer('new');
                  }}
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
                    onClick={() => {
                      playClick(soundOn);
                      setEditingPlayer(p);
                    }}
                    title={`Edit ${p.name}`}
                  >
                    <AnimalAvatar avatar={p.avatar} size={46} />
                    <div style={{ textAlign: 'left' }}>
                      <div className="crew-card-name">{p.name}</div>
                      <span
                        className={`level-pill ${p.defaultLevel}`}
                        style={{ marginTop: 4, fontSize: '0.72rem', padding: '2px 8px' }}
                      >
                        {p.defaultLevel === 'scout'
                          ? 'Scout'
                          : p.defaultLevel === 'navigator'
                            ? 'Navigator'
                            : 'Trailblazer'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--ink-muted)', fontWeight: 600, marginTop: 12 }}>
                Tap any explorer to rename them, change their animal friend, or pick their default comfort level.
              </p>
            </section>

            {/* Active Missions / Save Slots */}
            <section className="paper-panel section-card" aria-label="Saved Expeditions">
              <div className="section-header">
                <h2 className="section-title">
                  <Compass size={22} color="var(--terracotta)" /> Your Expeditions
                </h2>
                <button
                  type="button"
                  className="btn btn-terracotta btn-sm"
                  onClick={() => {
                    playClick(soundOn);
                    setNewMissionOpen(true);
                  }}
                >
                  <Plus size={16} /> New Expedition
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
                  <h3 style={{ fontSize: '1.35rem' }}>Ready to Lift Off?</h3>
                  <p style={{ color: 'var(--ink-soft)', maxWidth: 420, lineHeight: 1.5, fontWeight: 600 }}>
                    Take turns piloting your shared hot-air balloon around Earth! Pick story routes,
                    collect postcards & souvenirs, and keep multiple family adventures saved at once.
                  </p>
                  <button
                    type="button"
                    className="btn btn-terracotta btn-lg"
                    onClick={() => {
                      playClick(soundOn);
                      setNewMissionOpen(true);
                    }}
                  >
                    <Play size={19} /> Launch First Expedition
                  </button>
                </div>
              ) : (
                <div className="missions-list">
                  {savedState.missions.map((mission) => {
                    const currentDest = DESTINATIONS_BY_ID[mission.currentDestId];
                    const pilotId =
                      mission.playerIds[
                        mission.currentTurnIndex % mission.playerIds.length
                      ];
                    const pilot =
                      savedState.players.find((p) => p.id === pilotId) ??
                      savedState.players[0];

                    return (
                      <div key={mission.id} className="mission-slot">
                        <div className="mission-slot-meta">
                          <div className="mission-slot-title">
                            <span>{mission.title}</span>
                            {mission.completed && (
                              <span className="level-pill scout">Completed!</span>
                            )}
                          </div>
                          <div className="mission-slot-sub">
                            {mission.targetStops
                              ? `${mission.visitedDestIds.length} / ${mission.targetStops} stops`
                              : `${mission.visitedDestIds.length} stops • Open Atlas`}{' '}
                            • Currently in <strong>{currentDest?.country ?? 'Earth'}</strong> • Up next:{' '}
                            <strong>{pilot?.name}</strong>
                          </div>
                        </div>

                        <div className="mission-slot-actions">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => openMission(mission)}
                          >
                            <Play size={15} /> {mission.completed ? 'View' : 'Fly'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => handleDeleteMission(mission.id)}
                            title="Delete mission slot"
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

          {/* RIGHT COLUMN: TV + TABLET MODE & MASTER PASSPORT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* TV + Android Tablet Card */}
            <section className="tv-card" aria-label="TV and Tablet Living Room Mode">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div className="stamp-label" style={{ color: '#F6DFB1' }}>
                  LIVING ROOM MODE
                </div>
                {tvConnectedCode && (
                  <span className="tv-status-pill">
                    <span className="status-dot" /> Linked • {tvConnectedCode}
                  </span>
                )}
              </div>

              <h3>Watch on TV, Pass the Tablet!</h3>
              <p>
                Link your Android tablet to your Google TV Streamer Jackbox-style: the big map &
                postcards shine on the TV while kids pass the tablet to choose routes & answers.
              </p>

              {tvConnectedCode ? (
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleDisconnectTv}
                  >
                    <Unlink size={16} /> Unlink TV ({tvConnectedCode})
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    type="button"
                    className="btn btn-ochre"
                    onClick={() => {
                      playClick(soundOn);
                      setTvError(null);
                      setTvModalOpen(true);
                    }}
                  >
                    <Tv size={18} /> Connect Tablet to a TV
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      playClick(soundOn);
                      setIsTvDisplayMode(true);
                    }}
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
                  <Award size={22} color="var(--ochre)" /> Family Passport
                </h2>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    playClick(soundOn);
                    setPassportOpen(true);
                  }}
                >
                  Open Book
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.92rem', marginBottom: 7 }}>
                <span>{savedState.discoveredDestIds.length} of {DESTINATIONS.length} Places Stamped</span>
                <span style={{ color: 'var(--ochre-dark)' }}>
                  {savedState.flippedHistoryIds.length} Time-Flips
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
                <div style={{ marginTop: 16 }}>
                  <div className="stamp-label" style={{ color: 'var(--ink-muted)', marginBottom: 8 }}>
                    RECENT SOUVENIRS COLLECTED
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {recentDiscovered.map((dest) => (
                      <div
                        key={dest.id}
                        title={`${dest.souvenirName} (${dest.country})`}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
                      >
                        <SouvenirArt id={dest.souvenirId} size={48} />
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--ink-soft)' }}>
                          {dest.country}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', marginTop: 12, lineHeight: 1.45, fontWeight: 600 }}>
                  Every stop your family visits across any expedition permanently stamps a postcard
                  and adds a souvenir right here!
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

      {passportOpen && (
        <PassportView
          discoveredDestIds={savedState.discoveredDestIds}
          flippedHistoryIds={savedState.flippedHistoryIds}
          onFlipHistory={handleMarkHistoryFlipped}
          onReadAloud={speakText}
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
          onUpdatePrefs={(preferences) =>
            setSavedState((prev) => ({ ...prev, preferences }))
          }
          onImportState={(next) => setSavedState(next)}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {tvModalOpen && (
        <TvConnectModal
          initialCode={urlInit.joinCode}
          isConnecting={tvConnecting}
          errorMsg={tvError}
          onConnect={handleConnectToTv}
          onClose={() => setTvModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
