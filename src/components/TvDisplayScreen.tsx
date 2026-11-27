import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  Clock,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Tv,
  Users,
} from 'lucide-react';
import { SUSPECTS_BY_ID } from '../data/cases';
import { DESTINATIONS, DESTINATIONS_BY_ID } from '../data/destinations';
import type { LiveSessionState } from '../types/game';
import { formatTravelClock } from '../utils/storage';
import { generateRoomCode, startTvHost } from '../utils/tvSync';
import { AnimalAvatar } from './art/AnimalAvatar';
import { BalloonEmblem } from './art/CompassRose';
import { FLIGHT_DURATION_MS, FlightJourneyCard } from './FlightJourneyCard';
import { TimeFlipPostcard } from './TimeFlipPostcard';
import { WorldAtlasMap } from './WorldAtlasMap';

interface TvDisplayScreenProps {
  onExit: () => void;
}

export function TvDisplayScreen({ onExit }: TvDisplayScreenProps) {
  const [roomCode, setRoomCode] = useState<string>(() => generateRoomCode());
  const [qrUrl, setQrUrl] = useState<string>('');
  const [controllerConnected, setControllerConnected] = useState(false);
  const [hostNote, setHostNote] = useState<string | null>(null);
  const [liveState, setLiveState] = useState<LiveSessionState | null>(null);

  useEffect(() => {
    const joinUrl = `${window.location.origin}${window.location.pathname}?join=${roomCode}`;
    QRCode.toDataURL(joinUrl, {
      width: 210,
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
        setHostNote(null);
      },
      onControllerDisconnected: () => setControllerConnected(false),
      onStateReceived: (next) => setLiveState(next),
      onError: (msg) => setHostNote(msg),
    });
    return () => handle.destroy();
  }, [roomCode]);

  const activeMission = liveState?.activeMission ?? null;
  const currentPlayer =
    activeMission && liveState
      ? liveState.players.find(
          (p) =>
            p.id ===
            activeMission.playerIds[
              activeMission.currentTurnIndex % activeMission.playerIds.length
            ]
        ) ?? liveState.players[0]
      : null;

  const currentDest = activeMission
    ? DESTINATIONS_BY_ID[activeMission.currentDestId] ?? DESTINATIONS[0]
    : DESTINATIONS[0];
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
        flyingFromId={liveState?.turnPhase === 'flying' ? liveState.flyingFromId : null}
        flyingToId={liveState?.turnPhase === 'flying' ? liveState.flyingToId : null}
        flightDurationMs={FLIGHT_DURATION_MS}
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
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.12rem' }}>
              {activeMission ? activeMission.title : 'Wanderbook Atlas 2.0'}
            </div>
            {clock ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                <span className={`clock-pill ${clock.isUrgent ? 'urgent' : ''}`}>
                  <Clock size={13} /> Day {clock.currentDay} • {clock.daysRemainingText}
                </span>
              </div>
            ) : (
              <div style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', fontWeight: 700 }}>
                100-Destination Detective Atlas • TV Big Screen
              </div>
            )}
          </div>
        </div>

        {/* Active Detective Spotlight */}
        {controllerConnected && liveState?.screen === 'expedition' && currentPlayer && (
          <div
            className="tv-floating-card"
            style={{
              padding: '8px 20px 8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              borderColor: 'var(--terracotta)',
            }}
          >
            <AnimalAvatar avatar={currentPlayer.avatar} size={46} />
            <div>
              <div className="stamp-label" style={{ color: 'var(--terracotta)', fontSize: '0.7rem' }}>
                ACTIVE DETECTIVE
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.28rem' }}>
                  {currentPlayer.name}
                </span>
                <span className={`level-pill ${liveState.activeLevel}`}>
                  {liveState.activeLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            className="tv-floating-card"
            style={{ padding: '9px 15px', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: '0.9rem' }}
          >
            <span className="status-dot" style={{ background: controllerConnected ? '#22c55e' : '#eab308' }} />
            <span>{controllerConnected ? `Tablet Linked • ${roomCode}` : `Room ${roomCode}`}</span>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onExit}>
            <ArrowLeft size={16} /> Exit TV
          </button>
        </div>
      </div>

      {/* WAITING FOR PAIRING */}
      {!controllerConnected && (
        <div className="tv-pairing-modal">
          <div
            className="paper-panel"
            style={{
              width: 'min(760px, 100%)',
              padding: '30px 34px',
              display: 'grid',
              gridTemplateColumns: '1.2fr auto',
              gap: 28,
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="stamp-label" style={{ color: 'var(--mariner)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Tv size={16} /> JACKBOX TV + TABLET MODE
              </div>
              <h1 style={{ fontSize: '2.1rem', lineHeight: 1.1 }}>
                Connect Your Tablet to Open the Case!
              </h1>
              <p style={{ fontSize: '1.02rem', color: 'var(--ink-soft)', lineHeight: 1.5, fontWeight: 600 }}>
                Open <strong>Wanderbook Atlas</strong> on your Android tablet, tap{' '}
                <strong>“Connect Tablet to a TV”</strong>, and enter this 4-letter code (or scan the
                QR code):
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 4 }}>
                <div className="tv-code-digits">{roomCode}</div>
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
              {hostNote && <div style={{ fontSize: '0.86rem', color: 'var(--ochre-dark)', fontWeight: 700 }}>{hostNote}</div>}
            </div>

            {qrUrl && (
              <div style={{ background: '#FDF9F0', padding: 14, borderRadius: 18, border: '2px solid rgba(43,35,29,0.22)', textAlign: 'center' }}>
                <img src={qrUrl} alt={`QR code for room ${roomCode}`} width={184} height={184} style={{ display: 'block', borderRadius: 8 }} />
                <div className="stamp-label" style={{ marginTop: 8, color: 'var(--ink-soft)' }}>SCAN ON TABLET</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAIRED: HOME */}
      {controllerConnected && liveState?.screen === 'home' && (
        <div className="tv-floating-card tv-stage-panel" style={{ textAlign: 'center' }}>
          <div className="stamp-label" style={{ color: 'var(--mariner)' }}>
            FAMILY PASSPORT SYNCED • {liveState.discoveredDestIds.length} / {DESTINATIONS.length} WORLD STOPS STAMPED
          </div>
          <h2 style={{ fontSize: '1.85rem', marginTop: 4 }}>
            Pick or Launch a Mystery Case on the Tablet!
          </h2>
        </div>
      )}

      {/* PAIRED: PASSPORT */}
      {controllerConnected && liveState?.screen === 'passport' && (
        passportInspectDest ? (
          <div className="tv-pairing-modal" style={{ background: 'rgba(21,66,73,0.45)' }}>
            <div style={{ width: 'min(640px, 92vw)' }}>
              <TimeFlipPostcard destination={passportInspectDest} flipped={liveState.postcardFlipped} onToggleFlip={() => {}} large />
            </div>
          </div>
        ) : (
          <div className="tv-floating-card tv-stage-panel" style={{ textAlign: 'center' }}>
            <div className="stamp-label" style={{ color: 'var(--ochre-dark)' }}>BROWSING MASTER PASSPORT</div>
            <h2 style={{ fontSize: '1.75rem', marginTop: 4 }}>
              {liveState.discoveredDestIds.length} of {DESTINATIONS.length} World Wonders Unlocked
            </h2>
          </div>
        )
      )}

      {/* PAIRED: TOWN HUB */}
      {controllerConnected && liveState?.screen === 'expedition' && liveState.turnPhase === 'town-hub' && activeMission && (
        <div className="tv-floating-card tv-stage-panel">
          <div className="stamp-label" style={{ color: 'var(--mariner)' }}>
            INVESTIGATING {currentDest.name.toUpperCase()}, {currentDest.country.toUpperCase()} • CITY {activeMission.trailProgressIndex + 1} OF {activeMission.trailDestIds.length}
          </div>
          {liveState.latestWitnessClue ? (
            <div style={{ marginTop: 6 }}>
              <h2 style={{ fontSize: '1.55rem', color: 'var(--sage-dark)' }}>
                New Lead from {liveState.latestWitnessClue.witnessName}!
              </h2>
              <p style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: 6, lineHeight: 1.4 }}>
                {liveState.latestWitnessClue.destinationClue}
              </p>
              {liveState.latestWitnessClue.suspectClue && (
                <div style={{ marginTop: 8, color: 'var(--ochre-dark)', fontWeight: 800, fontSize: '1.05rem' }}>
                  ★ Profile Clue: {liveState.latestWitnessClue.suspectClue}
                </div>
              )}
            </div>
          ) : (
            <div style={{ marginTop: 4 }}>
              <h2 style={{ fontSize: '1.65rem' }}>
                {currentPlayer?.name}, pick a local spot on the tablet to gather clues!
              </h2>
              {currentCityClues.length > 0 && (
                <div style={{ marginTop: 8, fontSize: '0.98rem', fontWeight: 700, color: 'var(--ink-soft)' }}>
                  Clues collected here: {currentCityClues.map((c) => c.destinationClue).join(' • ')}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* PAIRED: SPOT CHALLENGE (4 CHOICES ON TV!) */}
      {controllerConnected && liveState?.screen === 'expedition' && liveState.turnPhase === 'spot-challenge' && activeQuestion && (
        <div className="tv-floating-card tv-stage-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div className="stamp-label" style={{ color: 'var(--mariner)' }}>
              {currentDest.name.toUpperCase()} • {liveState.activeLevel.toUpperCase()} CHALLENGE
            </div>
            {liveState.crewHelped && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'var(--terracotta)', color: '#FDF9F0', fontWeight: 800, fontSize: '0.86rem' }}>
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
              return (
                <div
                  key={`${choice}-${idx}`}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: tried ? 'var(--parchment-deep)' : 'var(--parchment-bright)',
                    border: tried ? '2px dashed rgba(43,35,29,0.2)' : '2px solid rgba(43,35,29,0.28)',
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
          {liveState.crewHelped && <div className="crew-huddle-box" style={{ marginTop: 10 }}>{activeQuestion.crewClue}</div>}
          {liveState.showGentleHint && !liveState.crewHelped && (
            <div className="hint-box" style={{ marginTop: 10 }}><strong>Compass Nudge:</strong> {activeQuestion.gentleHint}</div>
          )}
        </div>
      )}

      {/* PAIRED: DEPARTURE BOARD */}
      {controllerConnected && liveState?.screen === 'expedition' && liveState.turnPhase === 'departure-board' && activeMission && (
        <div className="tv-floating-card tv-stage-panel">
          <div className="stamp-label" style={{ color: 'var(--terracotta)' }}>
            DEPARTURE DEDUCTION — 5 CANDIDATE CITIES ON THE ATLAS
          </div>
          <h2 style={{ fontSize: '1.6rem', marginTop: 3 }}>
            Which City Matches Your Clues?
          </h2>
          {currentCityClues.length > 0 && (
            <div style={{ marginTop: 8, fontSize: '0.98rem', fontWeight: 700, color: 'var(--ink)' }}>
              {currentCityClues.map((c, i) => (
                <div key={i} style={{ marginBottom: 3 }}>• {c.destinationClue}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PAIRED: FLYING (7.5s STORYBOOK VOYAGE) */}
      {controllerConnected && liveState?.screen === 'expedition' && liveState.turnPhase === 'flying' && flyingToDest && (
        <div className="tv-stage-panel" style={{ padding: 0 }}>
          <FlightJourneyCard fromDest={flyingFromDest} toDest={flyingToDest} durationMs={FLIGHT_DURATION_MS} compact />
        </div>
      )}

      {/* PAIRED: COLD TRAIL */}
      {controllerConnected && liveState?.screen === 'expedition' && liveState.turnPhase === 'cold-trail' && (
        <div className="tv-floating-card tv-stage-panel" style={{ borderColor: 'var(--terracotta)', background: 'rgba(250,232,226,0.97)' }}>
          <div className="stamp-label" style={{ color: 'var(--terracotta-dark)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={18} /> COLD TRAIL IN {currentDest.country.toUpperCase()}!
          </div>
          <h2 style={{ fontSize: '1.8rem', marginTop: 4 }}>
            Nobody Spotted Them in {currentDest.name}!
          </h2>
          <p style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--ink-soft)', marginTop: 4 }}>
            Check the Free Field Guide on the tablet and reroute to the true destination!
          </p>
        </div>
      )}

      {/* PAIRED: POSTCARD */}
      {controllerConnected && liveState?.screen === 'expedition' && liveState.turnPhase === 'postcard' && (
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
      {controllerConnected && liveState?.screen === 'expedition' && liveState.turnPhase === 'finale-warrant' && (
        <div className="tv-floating-card tv-stage-panel" style={{ textAlign: 'center', borderColor: 'var(--terracotta)' }}>
          <div className="stamp-label" style={{ color: 'var(--terracotta)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={18} /> FINAL SHOWDOWN IN {currentDest.name.toUpperCase()}!
          </div>
          <h2 style={{ fontSize: '1.9rem', marginTop: 4 }}>
            Issue the Case Warrant on the Tablet!
          </h2>
        </div>
      )}

      {/* PAIRED: CASE COMPLETE */}
      {controllerConnected && liveState?.screen === 'expedition' && liveState.turnPhase === 'case-complete' && activeMission && culprit && (
        <div className="tv-pairing-modal" style={{ background: 'rgba(21,66,73,0.48)' }}>
          <div className="paper-panel" style={{ width: 'min(680px, 92vw)', padding: '32px 36px', textAlign: 'center' }}>
            <AnimalAvatar avatar={culprit.avatar} size={86} />
            <div className="stamp-label" style={{ color: activeMission.status === 'won' ? 'var(--sage-dark)' : 'var(--terracotta)', marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {activeMission.status === 'won' ? <Award size={18} /> : <Sparkles size={18} />}
              {activeMission.status === 'won' ? `CASE SOLVED • ${(activeMission.medal ?? 'gold').toUpperCase()} MEDAL` : 'CLIFFHANGER — TIME EXPIRED!'}
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
