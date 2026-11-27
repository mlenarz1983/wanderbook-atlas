import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  Map as MapIcon,
  Sparkles,
  Tv,
  Users,
  Volume2,
} from 'lucide-react';
import { DESTINATIONS_BY_ID } from '../data/destinations';
import type {
  DifficultyLevel,
  Mission,
  Player,
  TurnPhase,
} from '../types/game';
import { AnimalAvatar } from './art/AnimalAvatar';
import { SouvenirArt } from './art/SouvenirArt';
import { FLIGHT_DURATION_MS, FlightJourneyCard } from './FlightJourneyCard';
import { TimeFlipPostcard } from './TimeFlipPostcard';
import { WorldAtlasMap } from './WorldAtlasMap';

interface ExpeditionScreenProps {
  mission: Mission;
  players: Player[];
  currentPlayer: Player;
  nextPlayer: Player;
  discoveredDestIds: string[];
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
  tvConnectedCode: string | null;
  onSelectRoute: (destId: string) => void;
  onLandEarly: () => void;
  onChangeLevel: (level: DifficultyLevel) => void;
  onPickAnswer: (index: number) => void;
  onAskCrew: () => void;
  onTogglePostcardFlip: () => void;
  onAdvanceTurn: () => void;
  onContinueEndless: () => void;
  onReadAloud: (text: string) => void;
  onOpenPassport: () => void;
  onExitHome: () => void;
}

const LEVEL_LABELS: { id: DifficultyLevel; label: string }[] = [
  { id: 'scout', label: 'Scout' },
  { id: 'navigator', label: 'Navigator' },
  { id: 'trailblazer', label: 'Trailblazer' },
];

export function ExpeditionScreen({
  mission,
  currentPlayer,
  nextPlayer,
  discoveredDestIds,
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
  tvConnectedCode,
  onSelectRoute,
  onLandEarly,
  onChangeLevel,
  onPickAnswer,
  onAskCrew,
  onTogglePostcardFlip,
  onAdvanceTurn,
  onContinueEndless,
  onReadAloud,
  onOpenPassport,
  onExitHome,
}: ExpeditionScreenProps) {
  const [showMapInController, setShowMapInController] = useState(false);
  // Explicit user override for map visibility in Single-Screen mode (resets cleanly per phase)
  const [mapOverride, setMapOverride] = useState<{
    phase: TurnPhase;
    expanded: boolean;
  } | null>(null);

  const isCompactViewport =
    typeof window !== 'undefined' && window.innerWidth <= 1024;

  // Smart default: show map during route choice & flying; on tablets/smaller screens,
  // auto-collapse map during question & postcard so content has full room (with 1-tap expand!).
  const defaultMapExpanded =
    turnPhase === 'choose-route' ||
    turnPhase === 'flying' ||
    !isCompactViewport;

  const isMapExpanded =
    mapOverride && mapOverride.phase === turnPhase
      ? mapOverride.expanded
      : defaultMapExpanded;

  const toggleMapExpanded = () => {
    setMapOverride({ phase: turnPhase, expanded: !isMapExpanded });
  };

  const currentDest = DESTINATIONS_BY_ID[mission.currentDestId];
  const flyingFromDest = flyingFromId
    ? DESTINATIONS_BY_ID[flyingFromId]
    : currentDest;
  const pendingDest = pendingDestId ? DESTINATIONS_BY_ID[pendingDestId] : null;
  const activeQuestion = pendingDest ? pendingDest.questions[activeLevel] : null;
  const isControllerMode = Boolean(tvConnectedCode) && !showMapInController;

  const isMultiPlayer = mission.playerIds.length > 1;
  const stopsCount = mission.visitedDestIds.length;
  const isLastStop =
    mission.targetStops !== null && stopsCount >= mission.targetStops;

  const renderTurnControls = (isControllerLayout: boolean) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Active Player & Opt-In Level Strip */}
      {turnPhase !== 'mission-complete' && (
        <div
          className="paper-card"
          style={{
            padding: isControllerLayout ? '14px 16px' : '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AnimalAvatar avatar={currentPlayer.avatar} size={isControllerLayout ? 52 : 44} />
              <div>
                <div className="stamp-label" style={{ color: 'var(--terracotta)', fontSize: '0.7rem' }}>
                  {isMultiPlayer ? 'YOUR TURN TO PILOT' : 'PILOT AT THE HELM'}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: isControllerLayout ? '1.35rem' : '1.15rem' }}>
                  {currentPlayer.name}
                </div>
              </div>
            </div>
            <span className={`level-pill ${activeLevel}`}>
              {activeLevel === 'scout'
                ? 'Scout'
                : activeLevel === 'navigator'
                  ? 'Navigator'
                  : 'Trailblazer'}
            </span>
          </div>

          {(turnPhase === 'choose-route' || turnPhase === 'question') && (
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--ink-muted)', marginBottom: 5 }}>
                Opt-in comfort level (change anytime!):
              </div>
              <div className="level-switcher">
                {LEVEL_LABELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    className={`level-tab ${lvl.id} ${activeLevel === lvl.id ? 'active' : ''}`}
                    onClick={() => onChangeLevel(lvl.id)}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PHASE 1: CHOOSE NEXT STORY ROUTE */}
      {turnPhase === 'choose-route' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <div className="stamp-label" style={{ color: 'var(--mariner)' }}>
              CURRENTLY IN {currentDest?.name.toUpperCase()}
            </div>
            <h2 style={{ fontSize: isControllerLayout ? '1.5rem' : '1.26rem', marginTop: 3 }}>
              Where shall we fly next, {currentPlayer.name}?
            </h2>
            {!isControllerLayout && isMapExpanded && (
              <p style={{ fontSize: '0.86rem', color: 'var(--ink-soft)', marginTop: 3, fontWeight: 600 }}>
                Tap a glowing pin on the atlas or pick a story route below!
              </p>
            )}
          </div>

          {routeOptions.map((destId) => {
            const dest = DESTINATIONS_BY_ID[destId];
            if (!dest) return null;
            const alreadyInPassport = discoveredDestIds.includes(dest.id);
            return (
              <button
                key={dest.id}
                type="button"
                className="route-choice-btn"
                onClick={() => onSelectRoute(dest.id)}
              >
                <AnimalAvatar avatar={dest.animalAvatar} size={isControllerLayout ? 50 : 42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="route-choice-badge">{dest.routeLabel}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: isControllerLayout ? '1.18rem' : '1.04rem' }}>
                    {dest.country} — {dest.name}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', fontWeight: 700 }}>
                    {dest.continent} • {dest.biome}
                    {!alreadyInPassport && (
                      <span style={{ color: 'var(--terracotta)', marginLeft: 6 }}>★ New Stamp!</span>
                    )}
                  </div>
                </div>
                <ArrowRight size={20} color="var(--terracotta)" style={{ flexShrink: 0 }} />
              </button>
            );
          })}
        </div>
      )}

      {/* PHASE 2: STORYBOOK BALLOON VOYAGE (~7.5 SECONDS) */}
      {turnPhase === 'flying' && flyingFromDest && pendingDest && (
        <FlightJourneyCard
          fromDest={flyingFromDest}
          toDest={pendingDest}
          durationMs={FLIGHT_DURATION_MS}
          onLandEarly={onLandEarly}
        />
      )}

      {/* PHASE 3: CONFIDENCE-FIRST QUESTION */}
      {turnPhase === 'question' && pendingDest && activeQuestion && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div className="stamp-label" style={{ color: 'var(--mariner)' }}>
              LANDING AT {pendingDest.name.toUpperCase()}
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() =>
                onReadAloud(
                  `${activeQuestion.prompt} Choices are: ${activeQuestion.choices.join(', or ')}.`
                )
              }
              title="Read clue aloud"
            >
              <Volume2 size={15} /> Read Aloud
            </button>
          </div>

          <h2 style={{ fontSize: isControllerLayout ? '1.42rem' : '1.2rem', lineHeight: 1.35 }}>
            {activeQuestion.prompt}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {activeQuestion.choices.map((choice, idx) => {
              const tried = triedChoiceIndices.includes(idx);
              return (
                <button
                  key={choice}
                  type="button"
                  disabled={tried}
                  className={`answer-btn ${tried ? 'tried' : ''}`}
                  style={{ fontSize: isControllerLayout ? '1.15rem' : '1.02rem' }}
                  onClick={() => onPickAnswer(idx)}
                >
                  <span className="answer-letter">{['A', 'B', 'C'][idx]}</span>
                  <span>{choice}</span>
                </button>
              );
            })}
          </div>

          {/* Gentle Compass Nudge on Missed Guess */}
          {showGentleHint && !crewHelped && (
            <div className="hint-box">
              <strong>Warm Compass Nudge:</strong> {activeQuestion.gentleHint}
            </div>
          )}

          {/* Ask the Crew Cooperative Lifeline */}
          {crewHelped ? (
            <div className="crew-huddle-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4, color: 'var(--terracotta-dark)' }}>
                <Users size={17} /> <strong>Crew Huddle! Solve it together!</strong>
              </div>
              {activeQuestion.crewClue}
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ borderColor: 'var(--terracotta)', color: 'var(--terracotta-dark)' }}
              onClick={onAskCrew}
            >
              <Users size={18} /> Ask the Crew for Help (Team Huddle!)
            </button>
          )}
        </div>
      )}

      {/* PHASE 4: POSTCARD & SOUVENIR CELEBRATION */}
      {turnPhase === 'postcard' && pendingDest && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TimeFlipPostcard
            destination={pendingDest}
            flipped={postcardFlipped}
            onToggleFlip={onTogglePostcardFlip}
            onReadAloud={onReadAloud}
            isNewDiscovery={celebratingNewDiscovery}
          />

          {tvConnectedCode && (
            <div style={{ textAlign: 'center', fontSize: '0.84rem', color: 'var(--ink-soft)', fontWeight: 700 }}>
              <Clock size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Flipping this postcard flips it live on your TV too!
            </div>
          )}

          <button
            type="button"
            className="btn btn-terracotta btn-lg"
            style={{ width: '100%' }}
            onClick={onAdvanceTurn}
          >
            {isLastStop ? (
              <>
                <Sparkles size={20} /> Celebrate Expedition Complete!
              </>
            ) : isMultiPlayer ? (
              <>
                Pass to {nextPlayer.name} <ArrowRight size={20} />
              </>
            ) : (
              <>
                Pick Next Destination <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      )}

      {/* PHASE 5: MISSION COMPLETE */}
      {turnPhase === 'mission-complete' && (
        <div
          className="paper-card"
          style={{
            padding: '22px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div className="stamp-label" style={{ color: 'var(--terracotta)' }}>
            ★ EXPEDITION COMPLETE ★
          </div>
          <h2 style={{ fontSize: '1.65rem' }}>Way to Go, Crew!</h2>
          <p style={{ color: 'var(--ink-soft)', fontWeight: 600, lineHeight: 1.5 }}>
            You completed <strong>{mission.title}</strong> across{' '}
            <strong>{mission.visitedDestIds.length} stops</strong>! Every postcard and souvenir you
            collected is stamped forever in your Family Passport.
          </p>

          {/* Souvenir Row Earned on This Trip */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 8,
              padding: '10px 6px',
              background: 'var(--parchment)',
              borderRadius: 14,
            }}
          >
            {mission.visitedDestIds.map((id) => {
              const d = DESTINATIONS_BY_ID[id];
              return d ? <SouvenirArt key={id} id={d.souvenirId} size={44} /> : null;
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <button type="button" className="btn btn-primary" onClick={onContinueEndless}>
              <Compass size={18} /> Keep Flying in Open Atlas Mode
            </button>
            <button type="button" className="btn btn-ochre" onClick={onOpenPassport}>
              <BookOpen size={18} /> Admire Family Passport
            </button>
            <button type="button" className="btn btn-secondary" onClick={onExitHome}>
              Return to Expedition Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // HEADER BAR (SHARED)
  const headerBar = (
    <header className="expedition-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onExitHome}>
          <ArrowLeft size={16} /> Hub
        </button>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.08rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {mission.title}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', fontWeight: 700 }}>
            {mission.targetStops
              ? `Stop ${stopsCount} of ${mission.targetStops}`
              : `${stopsCount} Stops Explored (Open Atlas)`}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {tvConnectedCode ? (
          <>
            <span
              className="level-pill navigator"
              style={{ background: 'var(--mariner)', color: '#FDF9F0' }}
            >
              <Tv size={13} /> TV • {tvConnectedCode}
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowMapInController((s) => !s)}
            >
              <MapIcon size={15} /> {showMapInController ? 'Controller View' : 'Peek Map'}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={toggleMapExpanded}
            aria-expanded={isMapExpanded}
          >
            <MapIcon size={15} /> {isMapExpanded ? 'Hide Map' : 'Show Map'}
          </button>
        )}
        <button type="button" className="btn btn-secondary btn-sm" onClick={onOpenPassport}>
          <BookOpen size={15} /> Passport ({discoveredDestIds.length})
        </button>
      </div>
    </header>
  );

  // CO-PILOT TABLET CONTROLLER LAYOUT (WHEN LINKED TO TV)
  if (isControllerMode) {
    return (
      <div className="controller-shell">
        {headerBar}
        <main className="controller-main">{renderTurnControls(true)}</main>
      </div>
    );
  }

  // FULL INTERACTIVE SINGLE-SCREEN / CAST LAYOUT (NATURAL SCROLL + COLLAPSIBLE MAP)
  return (
    <div className={`expedition-shell ${isMapExpanded ? 'split-open' : ''}`}>
      {headerBar}
      <div className={`expedition-body ${isMapExpanded ? '' : 'map-collapsed'}`}>
        {isMapExpanded ? (
          <div className="map-stage">
            <button
              type="button"
              className="map-collapse-pill"
              onClick={toggleMapExpanded}
              title="Collapse map for more reading space"
            >
              <ChevronUp size={16} /> Collapse Map
            </button>
            <WorldAtlasMap
              currentDestId={mission.currentDestId}
              visitedDestIds={mission.visitedDestIds}
              discoveredDestIds={discoveredDestIds}
              routeOptions={turnPhase === 'choose-route' ? routeOptions : []}
              flyingFromId={turnPhase === 'flying' ? flyingFromId : null}
              flyingToId={turnPhase === 'flying' ? pendingDestId : null}
              flightDurationMs={FLIGHT_DURATION_MS}
              interactive={turnPhase === 'choose-route'}
              onSelectRoute={onSelectRoute}
            />
          </div>
        ) : (
          <div className="map-collapsed-bar">
            <button
              type="button"
              className="map-collapsed-btn"
              onClick={toggleMapExpanded}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <MapIcon size={17} />
                World Atlas Map Collapsed ({pendingDest ? pendingDest.country : currentDest?.country})
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Show Map <ChevronDown size={17} />
              </span>
            </button>
          </div>
        )}
        <aside className="turn-sidebar">{renderTurnControls(false)}</aside>
      </div>
    </div>
  );
}
