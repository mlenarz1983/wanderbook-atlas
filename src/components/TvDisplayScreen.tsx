import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  Clock,
  Hourglass,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tv,
  Users,
} from 'lucide-react';
import { SUSPECTS_BY_ID } from '../data/cases';
import {
  DESTINATIONS,
  DESTINATIONS_BY_ID,
  formatDestinationShortLabel,
} from '../data/destinations';
import { ERA_INFO } from '../data/destinations/usStatesMeta';
import { getCityLayout } from '../data/landmarks';
import type { LiveSessionState } from '../types/game';
import { formatTravelClock } from '../utils/storage';
import {
  connectTvToTablet,
  generateRoomCode,
  normalizeRoomCode,
  startTvHost,
  type TvReceiverHandle,
} from '../utils/tvSync';
import { AnimalAvatar } from './art/AnimalAvatar';
import { ClueGlyph } from './art/ClueGlyph';
import { BalloonEmblem } from './art/CompassRose';
import { MiniFlag } from './art/MiniFlag';
import { CityOrientationMap } from './CityOrientationMap';
import { CulpritBadge } from './CulpritBadge';
import { FlightJourneyCard } from './FlightJourneyCard';
import { TimeFlipPostcard } from './TimeFlipPostcard';
import { WorldAtlasMap } from './WorldAtlasMap';

interface TvDisplayScreenProps {
  onExit: () => void;
}

export function TvDisplayScreen({ onExit }: TvDisplayScreenProps) {
  const [roomCode, setRoomCode] = useState<string>(() => generateRoomCode());
  const [qrUrl, setQrUrl] = useState<string>('');
  const [controllerConnected, setControllerConnected] = useState(false);
  const [linkedCode, setLinkedCode] = useState<string | null>(null);
  const [hostNote, setHostNote] = useState<string | null>(null);
  const [liveState, setLiveState] = useState<LiveSessionState | null>(null);

  // Direction 2: TV enters a Tablet's 4-letter code
  const [tabletCodeInput, setTabletCodeInput] = useState('');
  const [joiningTablet, setJoiningTablet] = useState(false);
  const [joinTabletError, setJoinTabletError] = useState<string | null>(null);
  const tabletJoinRef = useRef<TvReceiverHandle | null>(null);

  useEffect(() => {
    const joinUrl = `${window.location.origin}${window.location.pathname}?join=${roomCode}`;
    QRCode.toDataURL(joinUrl, {
      width: 190,
      margin: 1,
      color: { dark: '#2B231D', light: '#FDF9F0' },
    })
      .then(setQrUrl)
      .catch(() => setQrUrl(''));
  }, [roomCode]);

  useEffect(() => {
    const handle = startTvHost(roomCode, {
      onReady: () => setHostNote(null),
      onControllerConnected: () => {
        setControllerConnected(true);
        setLinkedCode(roomCode);
        setHostNote(null);
      },
      onControllerDisconnected: () => {
        setControllerConnected(false);
        setLinkedCode(null);
      },
      onStateReceived: (next) => setLiveState(next),
      onError: (msg) => setHostNote(msg),
    });
    return () => handle.destroy();
  }, [roomCode]);

  useEffect(() => {
    return () => {
      tabletJoinRef.current?.destroy();
    };
  }, []);

  const handleJoinTabletCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = normalizeRoomCode(tabletCodeInput);
    if (clean.length !== 4) return;
    tabletJoinRef.current?.destroy();
    setJoiningTablet(true);
    setJoinTabletError(null);

    const handle = connectTvToTablet(clean, {
      onConnected: () => {
        setJoiningTablet(false);
        setControllerConnected(true);
        setLinkedCode(clean);
        setJoinTabletError(null);
      },
      onDisconnected: () => {
        setControllerConnected(false);
        setLinkedCode(null);
      },
      onStateReceived: (next) => {
        setJoiningTablet(false);
        setControllerConnected(true);
        setLinkedCode(clean);
        setLiveState(next);
      },
      onError: (msg) => {
        setJoiningTablet(false);
        setJoinTabletError(msg);
      },
    });
    tabletJoinRef.current = handle;
  };

  const activeMission = liveState?.activeMission ?? null;
  const missionPlayers =
    activeMission && liveState
      ? activeMission.playerIds
          .map((id) => liveState.players.find((p) => p.id === id))
          .filter((p): p is NonNullable<typeof p> => Boolean(p))
      : liveState?.players ?? [];
  const crewAvatars = missionPlayers.map((p) => p.avatar);

  const currentPlayer =
    activeMission && missionPlayers.length > 0
      ? missionPlayers[activeMission.currentTurnIndex % missionPlayers.length]
      : liveState?.players[0] ?? null;

  const currentDest = activeMission
    ? DESTINATIONS_BY_ID[activeMission.currentDestId] ?? DESTINATIONS[0]
    : DESTINATIONS[0];
  const currentLayout = getCityLayout(currentDest.id);
  const flyingFromDest =
    liveState?.flyingFromId && DESTINATIONS_BY_ID[liveState.flyingFromId]
      ? DESTINATIONS_BY_ID[liveState.flyingFromId]
      : currentDest;
  const flyingToDest =
    liveState?.flyingToId && DESTINATIONS_BY_ID[liveState.flyingToId]
      ? DESTINATIONS_BY_ID[liveState.flyingToId]
      : null;
  const postcardDest =
    liveState?.postcardDestId && DESTINATIONS_BY_ID[liveState.postcardDestId]
      ? DESTINATIONS_BY_ID[liveState.postcardDestId]
      : currentDest;
  const passportInspectDest = liveState?.passportHighlightId
    ? DESTINATIONS_BY_ID[liveState.passportHighlightId]
    : null;
  const clock = activeMission
    ? formatTravelClock(activeMission.hoursElapsed, activeMission.totalHoursBudget)
    : null;
  const culprit = activeMission ? SUSPECTS_BY_ID[activeMission.culpritId] : null;
  const activeQuestion = liveState?.activeQuestion ?? null;

  const currentCityClues = activeMission
    ? activeMission.cluesLog.filter((c) => c.cityId === activeMission.lastValidDestId)
    : [];
  const investigatedHere = activeMission
    ? activeMission.investigatedSpotsByCity[activeMission.currentDestId] ?? []
    : [];
  const isAtFinalTrailCity = Boolean(
    activeMission &&
      !activeMission.isOnColdTrail &&
      !activeMission.isOnWrongEra &&
      activeMission.trailProgressIndex >= activeMission.trailDestIds.length - 1
  );
  const flightDurationMs = liveState?.flightDurationMs ?? 6500;
  const mapMode = activeMission?.missionDifficulty === 'usa' ? 'usa' : 'world';
  const isTimeWarp = activeMission?.missionDifficulty === 'time-warp';

  return (
    <div className="tv-shell">
      <WorldAtlasMap
        currentDestId={activeMission?.currentDestId ?? 'iceland'}
        visitedDestIds={activeMission?.visitedDestIds ?? []}
        discoveredDestIds={liveState?.discoveredDestIds ?? []}
        routeOptions={
          liveState?.screen === 'expedition' &&
          liveState.turnPhase === 'departure-board' &&
          activeMission
            ? activeMission.departureOptions
            : []
        }
        mapMode={mapMode}
        crewAvatars={crewAvatars}
        flyingFromId={liveState?.turnPhase === 'flying' ? liveState.flyingFromId : null}
        flyingToId={liveState?.turnPhase === 'flying' ? liveState.flyingToId : null}
        flightDurationMs={flightDurationMs}
        interactive={false}
        isTvMode
      />

      {/* Top Living Room HUD */}
      <div className="tv-overlay-top">
        <div
          className="tv-floating-card"
          style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <BalloonEmblem size={36} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.08rem' }}>
              {activeMission ? activeMission.title : 'Wanderbook Atlas'}
            </div>
            {clock ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                <span className={`clock-pill ${clock.isUrgent ? 'urgent' : ''}`}>
                  <Clock size={13} /> Day {clock.currentDay} • {clock.daysRemainingText}
                </span>
                {isTimeWarp && activeMission?.currentEra && (
                  <span className="era-pill">
                    <Hourglass size={12} /> {ERA_INFO[activeMission.currentEra].shortLabel}
                  </span>
                )}
              </div>
            ) : (
              <div style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', fontWeight: 700 }}>
                {DESTINATIONS.length}-Destination Detective Atlas • TV Big Screen
              </div>
            )}
          </div>
        </div>

        {/* Active Detective + Culprit Spotlight */}
        {controllerConnected && liveState?.screen === 'expedition' && currentPlayer && activeMission && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              className="tv-floating-card"
              style={{
                padding: '7px 16px 7px 9px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                borderColor: 'var(--terracotta)',
              }}
            >
              <AnimalAvatar avatar={currentPlayer.avatar} size={42} />
              <div>
                <div className="stamp-label" style={{ color: 'var(--terracotta)', fontSize: '0.66rem' }}>
                  ACTIVE DETECTIVE
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.16rem' }}>
                    {currentPlayer.name}
                  </span>
                  <span className={`level-pill ${liveState.activeLevel}`}>
                    {liveState.activeLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="tv-floating-card" style={{ maxWidth: 290 }}>
              <CulpritBadge mission={activeMission} compact />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            className="tv-floating-card"
            style={{
              padding: '9px 15px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontWeight: 800,
              fontSize: '0.9rem',
            }}
          >
            <span className="status-dot" style={{ background: controllerConnected ? '#22c55e' : '#eab308' }} />
            <span>
              {controllerConnected
                ? `Tablet Linked • ${linkedCode ?? roomCode}`
                : `Room ${roomCode}`}
            </span>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onExit}>
            <ArrowLeft size={16} /> Exit TV
          </button>
        </div>
      </div>

      {/* WAITING FOR TWO-WAY PAIRING */}
      {!controllerConnected && (
        <div className="tv-pairing-modal">
          <div
            className="paper-panel"
            style={{
              width: 'min(920px, 100%)',
              padding: '26px 30px',
              display: 'grid',
              gridTemplateColumns: '1.15fr auto 0.95fr',
              gap: 24,
              alignItems: 'center',
            }}
          >
            {/* Option A: TV shows code -> Tablet enters it */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div
                className="stamp-label"
                style={{ color: 'var(--mariner)', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Tv size={16} /> OPTION 1 • ENTER ON TABLET
              </div>
              <h1 style={{ fontSize: '1.78rem', lineHeight: 1.12 }}>
                Connect Your Tablet to Open the Case!
              </h1>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: 1.45, fontWeight: 600 }}>
                On your tablet, tap <strong>“Connect Tablet to a TV”</strong> and enter this code
                (or scan the QR):
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div className="tv-code-digits" style={{ fontSize: '2.5rem', padding: '8px 20px 8px 26px' }}>
                  {roomCode}
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setHostNote(null);
                    setControllerConnected(false);
                    setRoomCode(generateRoomCode());
                  }}
                >
                  <RefreshCw size={15} /> New Code
                </button>
              </div>
              {hostNote && (
                <div style={{ fontSize: '0.84rem', color: 'var(--ochre-dark)', fontWeight: 700 }}>
                  {hostNote}
                </div>
              )}
            </div>

            {/* QR Code */}
            {qrUrl && (
              <div
                style={{
                  background: '#FDF9F0',
                  padding: 12,
                  borderRadius: 16,
                  border: '2px solid rgba(43,35,29,0.2)',
                  textAlign: 'center',
                }}
              >
                <img
                  src={qrUrl}
                  alt={`QR code for room ${roomCode}`}
                  width={158}
                  height={158}
                  style={{ display: 'block', borderRadius: 8 }}
                />
                <div className="stamp-label" style={{ marginTop: 6, color: 'var(--ink-soft)', fontSize: '0.68rem' }}>
                  SCAN ON TABLET
                </div>
              </div>
            )}

            {/* Option B: Tablet already set up -> Type Tablet's Code on TV! */}
            <div
              className="paper-card"
              style={{
                padding: '16px 18px',
                background: 'var(--parchment)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div
                className="stamp-label"
                style={{ color: 'var(--terracotta)', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Smartphone size={15} /> OPTION 2 • HAVE A TABLET CODE?
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', fontWeight: 600, lineHeight: 1.4 }}>
                Already opened <strong>“Show My Tablet Code”</strong> on your tablet? Type its 4
                letters right here:
              </p>
              <form onSubmit={handleJoinTabletCode} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  className="input-field"
                  type="text"
                  maxLength={4}
                  placeholder="MAPS"
                  value={tabletCodeInput}
                  onChange={(e) => setTabletCodeInput(normalizeRoomCode(e.target.value))}
                  style={{
                    textAlign: 'center',
                    fontFamily: 'var(--font-stamp)',
                    fontSize: '1.65rem',
                    letterSpacing: '0.26em',
                    textTransform: 'uppercase',
                    padding: '10px 12px',
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-terracotta"
                  disabled={tabletCodeInput.length !== 4 || joiningTablet}
                >
                  {joiningTablet ? 'Connecting to Tablet...' : 'Connect to Tablet'}
                </button>
              </form>
              {joinTabletError && (
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--terracotta-dark)' }}>
                  {joinTabletError}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PAIRED: HOME */}
      {controllerConnected && liveState?.screen === 'home' && (
        <div className="tv-floating-card tv-stage-panel" style={{ textAlign: 'center' }}>
          <div className="stamp-label" style={{ color: 'var(--mariner)' }}>
            FAMILY PASSPORT SYNCED • {liveState.discoveredDestIds.length} / {DESTINATIONS.length} STOPS STAMPED
          </div>
          <h2 style={{ fontSize: '1.85rem', marginTop: 4 }}>
            Pick or Launch a Detective Case on the Tablet!
          </h2>
        </div>
      )}

      {/* PAIRED: PASSPORT */}
      {controllerConnected &&
        liveState?.screen === 'passport' &&
        (passportInspectDest ? (
          <div className="tv-pairing-modal" style={{ background: 'rgba(21,66,73,0.45)' }}>
            <div style={{ width: 'min(640px, 92vw)' }}>
              <TimeFlipPostcard
                destination={passportInspectDest}
                flipped={liveState.postcardFlipped}
                onToggleFlip={() => {}}
                large
              />
            </div>
          </div>
        ) : (
          <div className="tv-floating-card tv-stage-panel" style={{ textAlign: 'center' }}>
            <div className="stamp-label" style={{ color: 'var(--ochre-dark)' }}>
              BROWSING MASTER PASSPORT
            </div>
            <h2 style={{ fontSize: '1.75rem', marginTop: 4 }}>
              {liveState.discoveredDestIds.length} of {DESTINATIONS.length} World & US Stops Unlocked
            </h2>
          </div>
        ))}

      {/* PAIRED: TOWN HUB — ILLUSTRATED CITY MAP + MINI FLAG + ALWAYS-BOLD CLUES WITH GLYPHS */}
      {controllerConnected &&
        liveState?.screen === 'expedition' &&
        liveState.turnPhase === 'town-hub' &&
        activeMission && (
          <div
            className="tv-floating-card tv-stage-panel"
            style={{
              width: 'min(1040px, calc(100vw - 48px))',
              padding: '18px 22px',
              display: 'grid',
              gridTemplateColumns: 'minmax(300px, 0.95fr) 1.25fr',
              gap: 20,
              alignItems: 'center',
            }}
          >
            <CityOrientationMap
              dest={currentDest}
              layout={currentLayout}
              investigatedSpotIds={investigatedHere}
              crewAvatars={crewAvatars}
              activeSpotId={liveState.activeSpotId}
              lastVisitedSpotId={liveState.lastVisitedSpotId}
              isAtFinalTrailCity={isAtFinalTrailCity}
              interactive={false}
              compact
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
                <MiniFlag dest={currentDest} width={32} />
                <div className="stamp-label" style={{ color: 'var(--mariner)' }}>
                  {formatDestinationShortLabel(currentDest, activeMission.missionDifficulty).toUpperCase()} • STOP{' '}
                  {activeMission.trailProgressIndex + 1} OF {activeMission.trailDestIds.length}
                </div>
              </div>

              {liveState.latestWitnessClue ? (
                <div>
                  <h2 style={{ fontSize: '1.42rem', color: 'var(--sage-dark)' }}>
                    New Lead from {liveState.latestWitnessClue.witnessName} ({liveState.latestWitnessClue.spotTitle})!
                  </h2>
                  <div className="tv-clue-text tv-clue-row" style={{ marginTop: 8 }}>
                    <ClueGlyph kind={liveState.latestWitnessClue.icon} size={24} />
                    <span>{liveState.latestWitnessClue.destinationClue}</span>
                  </div>
                  {liveState.latestWitnessClue.eraClue && (
                    <div
                      className="tv-clue-row"
                      style={{
                        marginTop: 8,
                        padding: '8px 12px',
                        borderRadius: 10,
                        background: 'var(--mariner-soft)',
                        border: '1.5px solid var(--mariner)',
                        color: 'var(--mariner-dark)',
                        fontWeight: 900,
                        fontSize: '1rem',
                      }}
                    >
                      <ClueGlyph kind="era" size={21} />
                      <span>{liveState.latestWitnessClue.eraClue}</span>
                    </div>
                  )}
                  {liveState.latestWitnessClue.suspectClue && (
                    <div
                      className="tv-clue-row"
                      style={{
                        marginTop: 8,
                        padding: '8px 12px',
                        borderRadius: 10,
                        background: 'var(--ochre-soft)',
                        border: '1.5px solid var(--ochre)',
                        color: 'var(--ochre-dark)',
                        fontWeight: 900,
                        fontSize: '1rem',
                      }}
                    >
                      <ClueGlyph kind="suspect" size={21} />
                      <span>Profile Clue: {liveState.latestWitnessClue.suspectClue}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h2 style={{ fontSize: '1.44rem', lineHeight: 1.25 }}>
                    {currentPlayer?.name}, pick any of the 5 real spots in {currentDest.name} on the tablet!
                  </h2>
                  {currentCityClues.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                      <div className="stamp-label" style={{ color: 'var(--terracotta)', fontSize: '0.72rem' }}>
                        CLUES COLLECTED IN {currentDest.name.toUpperCase()}
                      </div>
                      {currentCityClues.map((c, idx) => (
                        <div key={idx} className="tv-clue-text tv-clue-row">
                          <ClueGlyph kind={c.icon ?? 'geography'} size={22} />
                          <span>{c.destinationClue}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      {/* PAIRED: SPOT CHALLENGE (4 CHOICES + SELECTED HIGHLIGHT BEFORE CONFIRM!) */}
      {controllerConnected &&
        liveState?.screen === 'expedition' &&
        liveState.turnPhase === 'spot-challenge' &&
        activeQuestion && (
          <div className="tv-floating-card tv-stage-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <MiniFlag dest={currentDest} width={28} />
                <div className="stamp-label" style={{ color: 'var(--mariner)' }}>
                  {currentLayout.landmarks.find((s) => s.id === liveState.activeSpotId)?.name.toUpperCase() ??
                    currentDest.name.toUpperCase()}{' '}
                  • {liveState.activeLevel.toUpperCase()} CHALLENGE
                </div>
              </div>
              {liveState.crewHelped && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 12px',
                    borderRadius: 999,
                    background: 'var(--terracotta)',
                    color: '#FDF9F0',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                  }}
                >
                  <Users size={15} /> CREW HUDDLE!
                </span>
              )}
            </div>
            <h2 style={{ fontSize: 'clamp(1.25rem, 2vw, 1.65rem)', lineHeight: 1.3, marginBottom: 12 }}>
              {activeQuestion.prompt}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {activeQuestion.choices.map((choice, idx) => {
                const tried = liveState.triedChoiceIndices.includes(idx);
                const selected = liveState.selectedChoiceIndex === idx && !tried;
                return (
                  <div
                    key={`${choice}-${idx}`}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 12,
                      background: selected
                        ? 'var(--mariner-soft)'
                        : tried
                          ? 'var(--parchment-deep)'
                          : 'var(--parchment-bright)',
                      border: selected
                        ? '2.5px solid var(--mariner)'
                        : tried
                          ? '2px dashed rgba(43,35,29,0.2)'
                          : '2px solid rgba(43,35,29,0.28)',
                      opacity: tried ? 0.48 : 1,
                      fontWeight: 800,
                      fontSize: '1.02rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span className="answer-letter">{['A', 'B', 'C', 'D'][idx]}</span>
                    <span>{choice}</span>
                  </div>
                );
              })}
            </div>
            {liveState.crewHelped && (
              <div className="crew-huddle-box" style={{ marginTop: 10 }}>
                {activeQuestion.crewClue}
              </div>
            )}
            {liveState.showGentleHint && !liveState.crewHelped && (
              <div className="hint-box" style={{ marginTop: 10 }}>
                <strong>Compass Nudge:</strong> {activeQuestion.gentleHint}
              </div>
            )}
          </div>
        )}

      {/* PAIRED: DEPARTURE BOARD — ALWAYS-BOLD CLUE SUMMARY WITH GLYPHS */}
      {controllerConnected &&
        liveState?.screen === 'expedition' &&
        liveState.turnPhase === 'departure-board' &&
        activeMission && (
          <div className="tv-floating-card tv-stage-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="stamp-label" style={{ color: 'var(--terracotta)' }}>
                DEPARTURE DEDUCTION — 5 CANDIDATE STOPS ON THE ATLAS
              </div>
              {isTimeWarp && liveState.selectedEra && (
                <span className="era-pill">
                  <Hourglass size={13} /> Chrono-Dial: {ERA_INFO[liveState.selectedEra].label}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.5rem', marginTop: 3 }}>
              {isTimeWarp
                ? 'Which City & Era Match Your Clues?'
                : 'Which Stop Matches Your Clues?'}
            </h2>
            {currentCityClues.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                {currentCityClues.map((c, i) => (
                  <div key={i} className="tv-clue-text tv-clue-row">
                    <ClueGlyph kind={c.icon ?? 'geography'} size={22} />
                    <span>{c.destinationClue}</span>
                  </div>
                ))}
                {isTimeWarp &&
                  currentCityClues
                    .filter((c) => c.eraClue)
                    .slice(0, 1)
                    .map((c, i) => (
                      <div
                        key={`era-${i}`}
                        className="tv-clue-text tv-clue-row"
                        style={{ borderLeftColor: 'var(--mariner)', background: 'var(--mariner-soft)' }}
                      >
                        <ClueGlyph kind="era" size={22} />
                        <span>{c.eraClue}</span>
                      </div>
                    ))}
              </div>
            )}
          </div>
        )}

      {/* PAIRED: FLYING (DISTANCE-ACCURATE BALLOON VOYAGE!) */}
      {controllerConnected &&
        liveState?.screen === 'expedition' &&
        liveState.turnPhase === 'flying' &&
        flyingToDest && (
          <div className="tv-stage-panel" style={{ padding: 0 }}>
            <FlightJourneyCard
              fromDest={flyingFromDest}
              toDest={flyingToDest}
              crewAvatars={crewAvatars}
              durationMs={flightDurationMs}
              compact
            />
          </div>
        )}

      {/* PAIRED: TIME SLIP! */}
      {controllerConnected &&
        liveState?.screen === 'expedition' &&
        liveState.turnPhase === 'time-slip' && (
          <div
            className="tv-floating-card tv-stage-panel"
            style={{ borderColor: 'var(--mariner)', background: 'rgba(218,236,238,0.97)' }}
          >
            <div className="stamp-label" style={{ color: 'var(--mariner-dark)', display: 'flex', alignItems: 'center', gap: 7 }}>
              <ClueGlyph kind="era" size={20} /> TIME SLIP IN {currentDest.name.toUpperCase()}!
            </div>
            <h2 style={{ fontSize: '1.7rem', marginTop: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
              <MiniFlag dest={currentDest} width={34} />
              <span>Right City — Wrong Century! Re-Tune the Chrono-Dial on the Tablet!</span>
            </h2>
          </div>
        )}

      {/* PAIRED: COLD TRAIL */}
      {controllerConnected &&
        liveState?.screen === 'expedition' &&
        liveState.turnPhase === 'cold-trail' && (
          <div
            className="tv-floating-card tv-stage-panel"
            style={{ borderColor: 'var(--terracotta)', background: 'rgba(250,232,226,0.97)' }}
          >
            <div
              className="stamp-label"
              style={{ color: 'var(--terracotta-dark)', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <AlertTriangle size={18} /> COLD TRAIL IN {currentDest.name.toUpperCase()}!
            </div>
            <h2 style={{ fontSize: '1.7rem', marginTop: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
              <MiniFlag dest={currentDest} width={34} />
              <span>Nobody Spotted Them in {currentDest.name}!</span>
            </h2>
            {currentCityClues.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                {currentCityClues.map((c, i) => (
                  <div key={i} className="tv-clue-text tv-clue-row">
                    <ClueGlyph kind={c.icon ?? 'geography'} size={22} />
                    <span>{c.destinationClue}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      {/* PAIRED: POSTCARD */}
      {controllerConnected &&
        liveState?.screen === 'expedition' &&
        liveState.turnPhase === 'postcard' && (
          <div className="tv-pairing-modal" style={{ background: 'rgba(21,66,73,0.44)' }}>
            <div style={{ width: 'min(660px, 92vw)' }}>
              <TimeFlipPostcard
                destination={postcardDest}
                flipped={liveState.postcardFlipped}
                onToggleFlip={() => {}}
                isNewDiscovery={liveState.celebratingNewDiscovery}
                large
              />
            </div>
          </div>
        )}

      {/* PAIRED: FINALE WARRANT */}
      {controllerConnected &&
        liveState?.screen === 'expedition' &&
        liveState.turnPhase === 'finale-warrant' && (
          <div
            className="tv-floating-card tv-stage-panel"
            style={{ textAlign: 'center', borderColor: 'var(--terracotta)' }}
          >
            <div
              className="stamp-label"
              style={{ color: 'var(--terracotta)', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <ShieldCheck size={18} /> FINAL SHOWDOWN IN {currentDest.name.toUpperCase()}!
            </div>
            <h2 style={{ fontSize: '1.9rem', marginTop: 4 }}>
              Issue the Case Warrant on the Tablet!
            </h2>
          </div>
        )}

      {/* PAIRED: CASE COMPLETE */}
      {controllerConnected &&
        liveState?.screen === 'expedition' &&
        liveState.turnPhase === 'case-complete' &&
        activeMission &&
        culprit && (
          <div className="tv-pairing-modal" style={{ background: 'rgba(21,66,73,0.48)' }}>
            <div className="paper-panel" style={{ width: 'min(680px, 92vw)', padding: '32px 36px', textAlign: 'center' }}>
              <AnimalAvatar avatar={culprit.avatar} size={86} />
              <div
                className="stamp-label"
                style={{
                  color: activeMission.status === 'won' ? 'var(--sage-dark)' : 'var(--terracotta)',
                  marginTop: 10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {activeMission.status === 'won' ? <Award size={18} /> : <Sparkles size={18} />}
                {activeMission.status === 'won'
                  ? `CASE SOLVED • ${(activeMission.medal ?? 'gold').toUpperCase()} MEDAL`
                  : 'CLIFFHANGER — TIME EXPIRED!'}
              </div>
              <h1 style={{ fontSize: '2.3rem', marginTop: 6 }}>
                {activeMission.status === 'won' ? `You Caught ${culprit.name}!` : `${culprit.name} Slipped Away!`}
              </h1>
              <p style={{ fontSize: '1.15rem', color: 'var(--ink-soft)', marginTop: 8, fontWeight: 700 }}>
                {culprit.catchphrase}
              </p>
            </div>
          </div>
        )}
    </div>
  );
}
