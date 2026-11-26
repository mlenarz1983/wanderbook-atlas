import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ArrowLeft, RefreshCw, Sparkles, Tv, Users } from 'lucide-react';
import { DESTINATIONS, DESTINATIONS_BY_ID } from '../data/destinations';
import type { LiveSessionState } from '../types/game';
import { generateRoomCode, startTvHost } from '../utils/tvSync';
import { AnimalAvatar } from './art/AnimalAvatar';
import { BalloonEmblem } from './art/CompassRose';
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
      color: {
        dark: '#2B231D',
        light: '#FDF9F0',
      },
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
      onControllerDisconnected: () => {
        setControllerConnected(false);
      },
      onStateReceived: (next) => {
        setLiveState(next);
      },
      onError: (msg) => {
        setHostNote(msg);
      },
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
  const pendingDest = liveState?.pendingDestId
    ? DESTINATIONS_BY_ID[liveState.pendingDestId]
    : null;
  const activeQuestion =
    pendingDest && liveState ? pendingDest.questions[liveState.activeLevel] : null;
  const passportInspectDest = liveState?.passportHighlightId
    ? DESTINATIONS_BY_ID[liveState.passportHighlightId]
    : null;

  return (
    <div className="tv-shell">
      {/* Always-live Scenic Heirloom World Atlas Background */}
      <WorldAtlasMap
        currentDestId={activeMission?.currentDestId ?? 'iceland'}
        visitedDestIds={activeMission?.visitedDestIds ?? []}
        discoveredDestIds={liveState?.discoveredDestIds ?? []}
        routeOptions={
          liveState?.screen === 'expedition' && liveState.turnPhase === 'choose-route'
            ? liveState.routeOptions
            : []
        }
        flyingFromId={liveState?.turnPhase === 'flying' ? liveState.flyingFromId : null}
        flyingToId={liveState?.turnPhase === 'flying' ? liveState.pendingDestId : null}
        interactive={false}
        isTvMode
      />

      {/* Top Floating Living Room Bar */}
      <div className="tv-overlay-top">
        <div
          className="tv-floating-card"
          style={{
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <BalloonEmblem size={36} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem' }}>
              {activeMission ? activeMission.title : 'Wanderbook Atlas'}
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--ink-soft)', fontWeight: 700 }}>
              {activeMission
                ? activeMission.targetStops
                  ? `Stop ${activeMission.visitedDestIds.length} of ${activeMission.targetStops}`
                  : `${activeMission.visitedDestIds.length} Stops Explored`
                : 'TV Big Screen'}
            </div>
          </div>
        </div>

        {/* Center Active Player Turn Spotlight */}
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
              <div className="stamp-label" style={{ color: 'var(--terracotta)', fontSize: '0.72rem' }}>
                NOW PILOTING
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem' }}>
                  {currentPlayer.name}
                </span>
                <span className={`level-pill ${liveState.activeLevel}`}>
                  {liveState.activeLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Right Status + Room Code */}
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
            <span
              className="status-dot"
              style={{
                background: controllerConnected ? '#22c55e' : '#eab308',
              }}
            />
            <span>
              {controllerConnected ? `Tablet Linked • ${roomCode}` : `Room ${roomCode}`}
            </span>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onExit}>
            <ArrowLeft size={16} /> Exit TV
          </button>
        </div>
      </div>

      {/* WAITING FOR TABLET PAIRING MODAL */}
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
                Connect Your Tablet to Take Off!
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--ink-soft)', lineHeight: 1.5, fontWeight: 600 }}>
                Open <strong>Wanderbook Atlas</strong> on your Android tablet, tap{' '}
                <strong>“Connect to TV”</strong>, and enter this 4-letter code (or scan the QR
                code with your tablet camera):
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

              {hostNote && (
                <div style={{ fontSize: '0.86rem', color: 'var(--ochre-dark)', fontWeight: 700 }}>
                  {hostNote}
                </div>
              )}
            </div>

            {qrUrl && (
              <div
                style={{
                  background: '#FDF9F0',
                  padding: 14,
                  borderRadius: 18,
                  border: '2px solid rgba(43,35,29,0.22)',
                  textAlign: 'center',
                }}
              >
                <img
                  src={qrUrl}
                  alt={`QR code for room ${roomCode}`}
                  width={184}
                  height={184}
                  style={{ display: 'block', borderRadius: 8 }}
                />
                <div className="stamp-label" style={{ marginTop: 8, color: 'var(--ink-soft)' }}>
                  SCAN ON TABLET
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAIRED: HOME / IDLE BANNER */}
      {controllerConnected && liveState && liveState.screen === 'home' && (
        <div className="tv-floating-card tv-stage-panel" style={{ textAlign: 'center' }}>
          <div className="stamp-label" style={{ color: 'var(--mariner)' }}>
            FAMILY PASSPORT SYNCED • {liveState.discoveredDestIds.length} / {DESTINATIONS.length} POSTCARDS STAMPED
          </div>
          <h2 style={{ fontSize: '1.85rem', marginTop: 4 }}>
            Choose or Launch an Expedition on the Tablet!
          </h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', marginTop: 6, fontWeight: 600 }}>
            Every golden pin on the atlas marks a place your crew has already explored together.
          </p>
        </div>
      )}

      {/* PAIRED: PASSPORT BROWSING */}
      {controllerConnected && liveState && liveState.screen === 'passport' && (
        passportInspectDest ? (
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
              {liveState.discoveredDestIds.length} of {DESTINATIONS.length} World Wonders Unlocked
            </h2>
            <p style={{ color: 'var(--ink-soft)', marginTop: 4, fontWeight: 600 }}>
              Tap any collected postcard on the tablet to display it big on the TV!
            </p>
          </div>
        )
      )}

      {/* PAIRED: EXPEDITION — CHOOSE ROUTE */}
      {controllerConnected &&
        liveState?.screen === 'expedition' &&
        liveState.turnPhase === 'choose-route' &&
        currentPlayer && (
          <div className="tv-floating-card tv-stage-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div className="stamp-label" style={{ color: 'var(--terracotta)' }}>
                  CURRENTLY IN {currentDest.name.toUpperCase()}
                </div>
                <h2 style={{ fontSize: '1.7rem', marginTop: 2 }}>
                  Where should we fly next, {currentPlayer.name}?
                </h2>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {liveState.routeOptions.map((id) => {
                  const d = DESTINATIONS_BY_ID[id];
                  if (!d) return null;
                  return (
                    <div
                      key={id}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 14,
                        background: 'var(--parchment)',
                        border: '1.5px solid rgba(43,35,29,0.22)',
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-stamp)', color: 'var(--terracotta)', fontWeight: 700 }}>
                        {d.routeLabel}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>{d.country}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      {/* PAIRED: EXPEDITION — FLYING */}
      {controllerConnected &&
        liveState?.screen === 'expedition' &&
        liveState.turnPhase === 'flying' &&
        pendingDest && (
          <div className="tv-floating-card tv-stage-panel" style={{ textAlign: 'center' }}>
            <div className="stamp-label" style={{ color: 'var(--terracotta)' }}>
              {pendingDest.routeLabel.toUpperCase()}
            </div>
            <h2 style={{ fontSize: '2rem', marginTop: 4 }}>
              Flying to {pendingDest.name}, {pendingDest.country}!
            </h2>
          </div>
        )}

      {/* PAIRED: EXPEDITION — QUESTION */}
      {controllerConnected &&
        liveState?.screen === 'expedition' &&
        liveState.turnPhase === 'question' &&
        pendingDest &&
        activeQuestion && (
          <div className="tv-floating-card tv-stage-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
              <div className="stamp-label" style={{ color: 'var(--mariner)' }}>
                ARRIVING IN {pendingDest.name.toUpperCase()} • {liveState.activeLevel.toUpperCase()} CLUE
              </div>
              {liveState.crewHelped && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 12px',
                    borderRadius: 999,
                    background: 'var(--terracotta)',
                    color: '#FDF9F0',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                  }}
                >
                  <Users size={15} /> CREW HUDDLE ACTIVE!
                </div>
              )}
            </div>

            <h2 style={{ fontSize: 'clamp(1.35rem, 2.3vw, 1.85rem)', lineHeight: 1.28, marginBottom: 14 }}>
              {activeQuestion.prompt}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {activeQuestion.choices.map((choice, idx) => {
                const tried = liveState.triedChoiceIndices.includes(idx);
                return (
                  <div
                    key={choice}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 14,
                      background: tried ? 'var(--parchment-deep)' : 'var(--parchment-bright)',
                      border: tried
                        ? '2px dashed rgba(43,35,29,0.22)'
                        : '2px solid rgba(43,35,29,0.28)',
                      opacity: tried ? 0.5 : 1,
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span className="answer-letter">{['A', 'B', 'C'][idx]}</span>
                    <span>{choice}</span>
                  </div>
                );
              })}
            </div>

            {liveState.crewHelped && (
              <div className="crew-huddle-box" style={{ marginTop: 12, fontSize: '1.05rem' }}>
                {activeQuestion.crewClue}
              </div>
            )}

            {liveState.showGentleHint && !liveState.crewHelped && (
              <div className="hint-box" style={{ marginTop: 12, fontSize: '1.05rem' }}>
                <strong>Compass Nudge:</strong> {activeQuestion.gentleHint}
              </div>
            )}
          </div>
        )}

      {/* PAIRED: EXPEDITION — POSTCARD CELEBRATION */}
      {controllerConnected &&
        liveState?.screen === 'expedition' &&
        liveState.turnPhase === 'postcard' &&
        pendingDest && (
          <div className="tv-pairing-modal" style={{ background: 'rgba(21,66,73,0.44)' }}>
            <div style={{ width: 'min(660px, 92vw)' }}>
              <TimeFlipPostcard
                destination={pendingDest}
                flipped={liveState.postcardFlipped}
                onToggleFlip={() => {}}
                isNewDiscovery={liveState.celebratingNewDiscovery}
                large
              />
            </div>
          </div>
        )}

      {/* PAIRED: MISSION COMPLETE */}
      {controllerConnected &&
        liveState?.screen === 'expedition' &&
        liveState.turnPhase === 'mission-complete' &&
        activeMission && (
          <div className="tv-pairing-modal" style={{ background: 'rgba(21,66,73,0.48)' }}>
            <div
              className="paper-panel"
              style={{
                width: 'min(680px, 92vw)',
                padding: '32px 36px',
                textAlign: 'center',
              }}
            >
              <div
                className="stamp-label"
                style={{ color: 'var(--terracotta)', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Sparkles size={16} /> EXPEDITION COMPLETE!
              </div>
              <h1 style={{ fontSize: '2.4rem', marginTop: 6 }}>{activeMission.title}</h1>
              <p style={{ fontSize: '1.15rem', color: 'var(--ink-soft)', marginTop: 10, fontWeight: 700 }}>
                Amazing teamwork! Your crew explored {activeMission.visitedDestIds.length} wonderful
                places and stamped {liveState.discoveredDestIds.length} total postcards into your
                Family Passport!
              </p>
            </div>
          </div>
        )}
    </div>
  );
}
