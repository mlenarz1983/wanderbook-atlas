import { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  ExternalLink,
  FileText,
  Hourglass,
  Landmark,
  Map as MapIcon,
  MapPin,
  Plane,
  ShieldCheck,
  Sparkles,
  Store,
  Trees,
  Tv,
  Users,
} from 'lucide-react';
import { SUSPECTS_BY_ID } from '../data/cases';
import {
  DESTINATIONS,
  DESTINATIONS_BY_ID,
  computeDistanceMiles,
  computeFlightHours,
  formatDestinationShortLabel,
} from '../data/destinations';
import {
  ERA_INFO,
  MISSION_DIFFICULTY_INFO,
  getUsStateMeta,
} from '../data/destinations/usStatesMeta';
import { getCityLayout } from '../data/landmarks';
import type {
  AvatarId,
  CaseMission,
  CityLandmark,
  DifficultyLevel,
  HistoricalEra,
  Player,
  QuizQuestion,
  SpotRole,
  TurnPhase,
  WitnessClue,
} from '../types/game';
import { formatTravelClock } from '../utils/storage';
import { AnimalAvatar } from './art/AnimalAvatar';
import { ClueGlyph } from './art/ClueGlyph';
import { MiniFlag } from './art/MiniFlag';
import { SouvenirArt } from './art/SouvenirArt';
import { CityOrientationMap } from './CityOrientationMap';
import { CulpritBadge } from './CulpritBadge';
import { FlightJourneyCard } from './FlightJourneyCard';
import { TimeFlipPostcard } from './TimeFlipPostcard';
import { WorldAtlasMap } from './WorldAtlasMap';

interface ExpeditionScreenProps {
  mission: CaseMission;
  currentPlayer: Player;
  nextPlayer: Player;
  crewAvatars: AvatarId[];
  discoveredDestIds: string[];
  turnPhase: TurnPhase;
  activeSpotId: string | null;
  lastVisitedSpotId: string | null;
  activeQuestion: QuizQuestion | null;
  selectedChoiceIndex: number | null;
  selectedEra: HistoricalEra;
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
  warrantFeedback: string | null;
  tvConnectedCode: string | null;
  onSelectSpot: (spot: CityLandmark) => void;
  onChangeLevel: (level: DifficultyLevel) => void;
  onSelectChoice: (index: number) => void;
  onConfirmAnswer: () => void;
  onSelectEra: (era: HistoricalEra) => void;
  onJumpEraInCity: (era: HistoricalEra) => void;
  onAskCrew: () => void;
  onDismissWitnessClue: () => void;
  onOpenDepartureBoard: () => void;
  onBackToTownHub: () => void;
  onFlyToDestination: (destId: string) => void;
  onLandEarly: () => void;
  onFlyBackToLastValid: () => void;
  onTogglePostcardFlip: () => void;
  onFinishPostcard: () => void;
  onOpenFinaleWarrant: () => void;
  onSelectWarrantSuspect: (suspectId: string) => void;
  onSubmitWarrant: () => void;
  onOpenFieldGuide: (compareIds?: string[]) => void;
  onOpenNotebook: () => void;
  onOpenPassport: () => void;
  onStartNewCase: () => void;
  onExitHome: () => void;
}

const LEVEL_TABS: { id: DifficultyLevel; short: string; full: string }[] = [
  { id: 'explorer', short: 'Explorer', full: 'Explorer (6–8)' },
  { id: 'navigator', short: 'Navigator', full: 'Navigator (8–11)' },
  { id: 'cartographer', short: 'Cartog.', full: 'Cartographer' },
  { id: 'scholar', short: 'Scholar', full: 'Master Scholar' },
];

const ALL_ERAS: HistoricalEra[] = ['ancient', 'sail', 'modern'];

export function ExpeditionScreen({
  mission,
  currentPlayer,
  nextPlayer,
  crewAvatars,
  discoveredDestIds,
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
  warrantFeedback,
  tvConnectedCode,
  onSelectSpot,
  onChangeLevel,
  onSelectChoice,
  onConfirmAnswer,
  onSelectEra,
  onJumpEraInCity,
  onAskCrew,
  onDismissWitnessClue,
  onOpenDepartureBoard,
  onBackToTownHub,
  onFlyToDestination,
  onLandEarly,
  onFlyBackToLastValid,
  onTogglePostcardFlip,
  onFinishPostcard,
  onOpenFinaleWarrant,
  onSelectWarrantSuspect,
  onSubmitWarrant,
  onOpenFieldGuide,
  onOpenNotebook,
  onOpenPassport,
  onStartNewCase,
  onExitHome,
}: ExpeditionScreenProps) {
  const [showMapInController, setShowMapInController] = useState(false);
  const [mapOverride, setMapOverride] = useState<{
    phase: TurnPhase;
    expanded: boolean;
  } | null>(null);

  const isCompactViewport =
    typeof window !== 'undefined' && window.innerWidth <= 1024;

  const defaultMapExpanded =
    turnPhase === 'departure-board' ||
    turnPhase === 'flying' ||
    !isCompactViewport;

  const isMapExpanded =
    mapOverride && mapOverride.phase === turnPhase
      ? mapOverride.expanded
      : defaultMapExpanded;

  const toggleMapExpanded = () =>
    setMapOverride({ phase: turnPhase, expanded: !isMapExpanded });

  const currentDest = DESTINATIONS_BY_ID[mission.currentDestId];
  const currentCityLayout = getCityLayout(mission.currentDestId);
  const lastValidDest = DESTINATIONS_BY_ID[mission.lastValidDestId];
  const flyingFromDest = flyingFromId ? DESTINATIONS_BY_ID[flyingFromId] : currentDest;
  const flyingToDest = flyingToId ? DESTINATIONS_BY_ID[flyingToId] : null;
  const postcardDest = postcardDestId ? DESTINATIONS_BY_ID[postcardDestId] : currentDest;

  const clock = formatTravelClock(mission.hoursElapsed, mission.totalHoursBudget);
  const isControllerMode = Boolean(tvConnectedCode) && !showMapInController;
  const isMultiPlayer = mission.playerIds.length > 1;
  const isTimeWarp = mission.missionDifficulty === 'time-warp';
  const mapMode = mission.missionDifficulty === 'usa' ? 'usa' : 'world';
  const diffMeta = MISSION_DIFFICULTY_INFO[mission.missionDifficulty];
  const isAtFinalTrailCity =
    !mission.isOnColdTrail &&
    !mission.isOnWrongEra &&
    mission.trailProgressIndex >= mission.trailDestIds.length - 1;

  const investigatedHere = mission.investigatedSpotsByCity[mission.currentDestId] ?? [];
  const currentCityClues = mission.cluesLog.filter(
    (c) => c.cityId === mission.lastValidDestId
  );
  const discoveredTraitCount = Object.keys(mission.discoveredSuspectTraits).length;
  const culprit = SUSPECTS_BY_ID[mission.culpritId];
  const activeSpotObj =
    currentCityLayout.landmarks.find((s) => s.id === activeSpotId) ?? null;

  const spotIcon = (role: SpotRole) => {
    if (role === 'harbor') return <Compass size={21} color="var(--mariner)" />;
    if (role === 'market') return <Store size={21} color="var(--ochre-dark)" />;
    if (role === 'archive') return <Landmark size={21} color="#8B4A3B" />;
    if (role === 'nature') return <Trees size={21} color="var(--sage)" />;
    return <MapPin size={21} color="var(--terracotta)" />;
  };

  const renderTurnContent = (isControllerLayout: boolean) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Visual Culprit Portrait & Discovered Traits */}
      {turnPhase !== 'case-complete' && (
        <CulpritBadge mission={mission} onOpenNotebook={onOpenNotebook} />
      )}

      {/* Active Explorer + Per-Player 4-Tier Quiz Switcher */}
      {turnPhase !== 'case-complete' && (
        <div
          className="paper-card"
          style={{
            padding: isControllerLayout ? '14px 16px' : '11px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 9,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AnimalAvatar avatar={currentPlayer.avatar} size={isControllerLayout ? 50 : 42} />
              <div>
                <div className="stamp-label" style={{ color: 'var(--terracotta)', fontSize: '0.68rem' }}>
                  {isMultiPlayer ? 'ACTIVE DETECTIVE' : 'LEAD DETECTIVE'}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: isControllerLayout ? '1.3rem' : '1.12rem',
                  }}
                >
                  {currentPlayer.name}
                </div>
              </div>
            </div>
            <span className={`level-pill ${activeLevel}`}>
              {LEVEL_TABS.find((t) => t.id === activeLevel)?.full}
            </span>
          </div>

          {(turnPhase === 'town-hub' || turnPhase === 'spot-challenge') && (
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--ink-muted)', marginBottom: 4 }}>
                Personal question tier (switch anytime):
              </div>
              <div className="level-switcher">
                {LEVEL_TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`level-tab ${t.id} ${activeLevel === t.id ? 'active' : ''}`}
                    onClick={() => onChangeLevel(t.id)}
                  >
                    {t.short}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          PHASE 1: TOWN INVESTIGATION HUB — CITY ORIENTATION MAP + 5 REAL STOPS
         ==================================================================== */}
      {turnPhase === 'town-hub' && currentDest && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="paper-card" style={{ padding: '14px 16px', background: 'var(--parchment)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <div className="stamp-label" style={{ color: 'var(--mariner)' }}>
                {isAtFinalTrailCity
                  ? `★ FINAL HIDEOUT • STOP ${mission.trailProgressIndex + 1} OF ${mission.trailDestIds.length}`
                  : `ON THE TRAIL • STOP ${mission.trailProgressIndex + 1} OF ${mission.trailDestIds.length}`}
              </div>
              {isTimeWarp && mission.currentEra && (
                <span className="era-pill">
                  <Hourglass size={12} /> {ERA_INFO[mission.currentEra].label}
                </span>
              )}
            </div>
            <h2
              style={{
                fontSize: isControllerLayout ? '1.48rem' : '1.26rem',
                marginTop: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                flexWrap: 'wrap',
              }}
            >
              <MiniFlag dest={currentDest} width={32} />
              <span>{formatDestinationShortLabel(currentDest, mission.missionDifficulty)}</span>
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--ink-soft)', fontWeight: 600, marginTop: 4 }}>
              “{currentDest.greeting}” — Explore any of 5 real landmarks around {currentDest.name} to
              gather clues about{' '}
              {isAtFinalTrailCity
                ? 'who is hiding right here!'
                : isTimeWarp
                  ? 'where—and WHICH ERA—they warped to next!'
                  : 'where the trail leads next!'}
            </p>
          </div>

          {/* Illustrated Spatial City Orientation Map with Strolling Crew Avatars */}
          <CityOrientationMap
            dest={currentDest}
            layout={currentCityLayout}
            investigatedSpotIds={investigatedHere}
            crewAvatars={crewAvatars}
            activeSpotId={activeSpotId}
            lastVisitedSpotId={lastVisitedSpotId}
            isAtFinalTrailCity={isAtFinalTrailCity}
            interactive
            onSelectSpot={onSelectSpot}
          />

          {/* Latest Witness Clue Spotlight (Spartan ClueGlyph + Bold Text) */}
          {latestWitnessClue && (
            <div
              className="paper-card"
              style={{
                padding: '14px 16px',
                background: 'var(--sage-soft)',
                border: '2px solid var(--sage)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div className="stamp-label" style={{ color: 'var(--sage-dark)' }}>
                ✓ NEW CLUE FROM {latestWitnessClue.witnessName.toUpperCase()} ({latestWitnessClue.spotTitle.toUpperCase()})
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <ClueGlyph kind={latestWitnessClue.icon} size={24} />
                <p style={{ fontWeight: 800, fontSize: '0.98rem', lineHeight: 1.45, margin: 0 }}>
                  {latestWitnessClue.destinationClue}
                </p>
              </div>
              {latestWitnessClue.eraClue && (
                <div
                  style={{
                    padding: '8px 11px',
                    borderRadius: 10,
                    background: 'var(--mariner-soft)',
                    border: '1.5px solid var(--mariner)',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    color: 'var(--mariner-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <ClueGlyph kind="era" size={20} />
                  <span>{latestWitnessClue.eraClue}</span>
                </div>
              )}
              {latestWitnessClue.suspectClue && (
                <div
                  style={{
                    padding: '8px 11px',
                    borderRadius: 10,
                    background: 'var(--ochre-soft)',
                    border: '1.5px solid var(--ochre)',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    color: 'var(--ochre-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <ClueGlyph kind="suspect" size={20} />
                  <span>Profile Trait Logged: {latestWitnessClue.suspectClue}</span>
                </div>
              )}
              <button
                type="button"
                className="btn btn-sage btn-sm"
                style={{ alignSelf: 'flex-end' }}
                onClick={onDismissWitnessClue}
              >
                {isMultiPlayer ? `Pass Tablet to ${nextPlayer.name} →` : 'Got It! →'}
              </button>
            </div>
          )}

          {/* 5 Unique Real Confirmed Local Stops */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="stamp-label" style={{ color: 'var(--ink-muted)' }}>
              5 REAL LANDMARKS IN {currentDest.name.toUpperCase()} (3 HOURS EACH)
            </div>
            {currentCityLayout.landmarks.map((spot, idx) => {
              const visited = investigatedHere.includes(spot.id);
              const existingClue = currentCityClues.find((c) => c.spotId === spot.id);
              const mapsSpotUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${spot.name}, ${currentDest.name}, ${currentDest.country}`
              )}`;

              return (
                <div
                  key={spot.id}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'stretch',
                    gap: 6,
                  }}
                >
                  <button
                    type="button"
                    disabled={visited}
                    onClick={() => onSelectSpot(spot)}
                    className="route-choice-btn"
                    style={{
                      flex: 1,
                      padding: '11px 13px',
                      opacity: visited ? 0.92 : 1,
                      background: visited ? 'var(--parchment)' : 'var(--parchment-bright)',
                      borderColor: visited ? 'rgba(70,120,86,0.45)' : undefined,
                      cursor: visited ? 'default' : 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: visited ? 'var(--sage-soft)' : 'var(--parchment-deep)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        position: 'relative',
                      }}
                    >
                      {visited ? (
                        <CheckCircle2 size={21} color="var(--sage)" />
                      ) : (
                        spotIcon(spot.role)
                      )}
                      {!visited && (
                        <span
                          style={{
                            position: 'absolute',
                            top: -5,
                            left: -5,
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            background: 'var(--ink)',
                            color: '#FDF9F0',
                            fontSize: '0.68rem',
                            fontWeight: 900,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.01rem' }}>
                          {spot.name}
                        </span>
                        <span
                          className="stamp-label"
                          style={{
                            fontSize: '0.68rem',
                            color: visited ? 'var(--sage-dark)' : 'var(--terracotta)',
                            flexShrink: 0,
                          }}
                        >
                          {visited ? 'VISITED' : `+${spot.clockHours}H`}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--mariner)', fontWeight: 800, marginTop: 1 }}>
                        {spot.district} • Ask the {spot.witnessTitle}
                      </div>
                      {existingClue && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 6,
                            fontSize: '0.84rem',
                            color: 'var(--ink)',
                            fontWeight: 800,
                            marginTop: 5,
                            lineHeight: 1.4,
                          }}
                        >
                          <ClueGlyph kind={existingClue.icon ?? 'geography'} size={17} />
                          <span>{existingClue.destinationClue}</span>
                        </div>
                      )}
                    </div>
                  </button>

                  <a
                    href={mapsSpotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="spot-gmaps-btn"
                    title={`See ${spot.name} on Google Maps`}
                    aria-label={`Open ${spot.name} in Google Maps`}
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              );
            })}
          </div>

          {/* Primary Action: Departure Board OR Final Warrant Showdown */}
          {isAtFinalTrailCity ? (
            <button
              type="button"
              className="btn btn-terracotta btn-lg"
              style={{ width: '100%' }}
              onClick={onOpenFinaleWarrant}
            >
              <ShieldCheck size={20} /> Issue Case Warrant & Catch Them!
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                onClick={onOpenDepartureBoard}
              >
                <Plane size={20} />
                {currentCityClues.length === 0
                  ? 'Peek at 5-Stop Departure Board'
                  : `Ready to Deduce? Open Departure Board (${currentCityClues.length}/5 Clues)`}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onOpenFieldGuide(mission.departureOptions)}
              >
                <BookOpen size={16} /> Compare My 5 Candidate Stops in Free Field Guide
              </button>
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          PHASE 2: SPOT CHALLENGE — 2-STEP CONFIRM ANSWER (NO ACCIDENTAL TAPS!)
         ==================================================================== */}
      {turnPhase === 'spot-challenge' && activeQuestion && activeSpotObj && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <div className="stamp-label" style={{ color: 'var(--mariner)' }}>
              {activeSpotObj.name.toUpperCase()} • {activeQuestion.category.toUpperCase()}
            </div>
            <button
              type="button"
              className="btn btn-sage btn-sm"
              onClick={() => onOpenFieldGuide()}
              title="Always free to research!"
            >
              <BookOpen size={15} /> Field Guide (Free)
            </button>
          </div>

          <h2 style={{ fontSize: isControllerLayout ? '1.35rem' : '1.14rem', lineHeight: 1.36 }}>
            {activeQuestion.prompt}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {activeQuestion.choices.map((choice, idx) => {
              const tried = triedChoiceIndices.includes(idx);
              const selected = selectedChoiceIndex === idx && !tried;
              return (
                <button
                  key={`${choice}-${idx}`}
                  type="button"
                  disabled={tried}
                  className={`answer-btn ${tried ? 'tried' : ''} ${selected ? 'selected' : ''}`}
                  style={{ fontSize: isControllerLayout ? '1.08rem' : '0.96rem', padding: '12px 14px' }}
                  onClick={() => onSelectChoice(idx)}
                >
                  <span className="answer-letter">{['A', 'B', 'C', 'D'][idx]}</span>
                  <span style={{ flex: 1 }}>{choice}</span>
                  {selected && (
                    <span className="stamp-label" style={{ fontSize: '0.68rem', color: 'var(--mariner-dark)' }}>
                      SELECTED
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Dedicated Confirm Answer Step */}
          <button
            type="button"
            className="btn btn-terracotta btn-lg"
            style={{ width: '100%' }}
            disabled={selectedChoiceIndex === null}
            onClick={onConfirmAnswer}
          >
            <Check size={20} />
            {selectedChoiceIndex !== null
              ? `Confirm Answer (${['A', 'B', 'C', 'D'][selectedChoiceIndex]})`
              : 'Tap an Option Above, Then Confirm'}
          </button>

          {showGentleHint && !crewHelped && (
            <div className="hint-box">
              <strong>Compass Nudge:</strong> {activeQuestion.gentleHint}
              <div style={{ marginTop: 4, fontSize: '0.84rem', color: 'var(--mariner-dark)' }}>
                Tip: {activeQuestion.almanacTip}
              </div>
            </div>
          )}

          {crewHelped ? (
            <div className="crew-huddle-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, color: 'var(--terracotta-dark)' }}>
                <Users size={16} /> <strong>Crew Huddle! Solve it together!</strong>
              </div>
              {activeQuestion.crewClue}
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ borderColor: 'var(--terracotta)', color: 'var(--terracotta-dark)' }}
              onClick={onAskCrew}
            >
              <Users size={17} /> Ask the Crew for Help (Team Huddle!)
            </button>
          )}
        </div>
      )}

      {/* ====================================================================
          PHASE 3: 5-STOP DEPARTURE BOARD (+ CHRONO-DIAL IN LEVEL 4 TIME-WARP!)
         ==================================================================== */}
      {turnPhase === 'departure-board' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div>
              <div className="stamp-label" style={{ color: 'var(--terracotta)' }}>
                DEPARTURE BOARD • {diffMeta.shortLabel.toUpperCase()}
              </div>
              <h2 style={{ fontSize: '1.3rem', marginTop: 2 }}>
                {isTimeWarp ? 'Set Chrono-Dial & Choose Destination!' : 'Where Did the Trail Go Next?'}
              </h2>
            </div>
            {!mission.isOnColdTrail && (
              <button type="button" className="btn btn-secondary btn-sm" onClick={onBackToTownHub}>
                ← Back to Town
              </button>
            )}
          </div>

          {/* Inline Bold Clue Recap with Spartan ClueGlyphs */}
          <div className="paper-card" style={{ padding: '11px 13px', background: 'var(--ochre-soft)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span className="stamp-label" style={{ color: 'var(--ochre-dark)', fontSize: '0.7rem' }}>
                YOUR CLUES FROM {lastValidDest?.name.toUpperCase()} ({currentCityClues.length}/5)
              </span>
              <button
                type="button"
                className="btn btn-sage btn-sm"
                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                onClick={() => onOpenFieldGuide(mission.departureOptions)}
              >
                <BookOpen size={14} /> Compare 5 in Field Guide
              </button>
            </div>
            {currentCityClues.length === 0 ? (
              <p style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--ink-soft)' }}>
                You haven’t gathered any town clues yet! Flying blind risks a Cold Trail—head back to town to interview locals first!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {currentCityClues.map((c, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.88rem', fontWeight: 800, lineHeight: 1.4 }}>
                      <ClueGlyph kind={c.icon ?? 'geography'} size={18} />
                      <span>{c.destinationClue}</span>
                    </div>
                    {c.eraClue && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.84rem', fontWeight: 800, color: 'var(--mariner-dark)', paddingLeft: 6 }}>
                        <ClueGlyph kind="era" size={17} />
                        <span>{c.eraClue}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LEVEL 4 TIME-WARP: CHRONO-DIAL ERA SELECTOR */}
          {isTimeWarp && (
            <div className="paper-card" style={{ padding: '12px 14px', background: 'var(--mariner-soft)', borderColor: 'var(--mariner)' }}>
              <div className="stamp-label" style={{ color: 'var(--mariner-dark)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <ClueGlyph kind="era" size={18} /> STEP 1: SET YOUR CHRONO-DIAL ERA BEFORE LAUNCH
              </div>
              <div className="chrono-dial-grid">
                {ALL_ERAS.map((eraId) => {
                  const info = ERA_INFO[eraId];
                  const active = selectedEra === eraId;
                  return (
                    <button
                      key={eraId}
                      type="button"
                      className={`chrono-btn ${active ? 'active' : ''}`}
                      onClick={() => onSelectEra(eraId)}
                    >
                      <div style={{ fontWeight: 900, fontSize: '0.86rem' }}>{info.shortLabel}</div>
                      <div style={{ fontSize: '0.7rem', opacity: active ? 0.92 : 0.78 }}>{info.years}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5 Spread-Out Candidate Flights with Miniature Flags */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {isTimeWarp && (
              <div className="stamp-label" style={{ color: 'var(--ink-muted)' }}>
                STEP 2: LAUNCH BALLOON TO TARGET CITY ({ERA_INFO[selectedEra].label.toUpperCase()})
              </div>
            )}
            {mission.departureOptions.map((destId) => {
              const dest = DESTINATIONS_BY_ID[destId];
              if (!dest || !currentDest) return null;
              const miles = computeDistanceMiles(currentDest.coords, dest.coords);
              const hours = computeFlightHours(currentDest.id, dest.id);
              const us = getUsStateMeta(dest.id);
              return (
                <button
                  key={dest.id}
                  type="button"
                  className="route-choice-btn"
                  onClick={() => onFlyToDestination(dest.id)}
                >
                  <MiniFlag dest={dest} width={38} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem' }}>
                      {mission.missionDifficulty === 'usa' && us
                        ? `${us.stateName} — ${dest.name}`
                        : `${dest.country} — ${dest.name}`}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', fontWeight: 700 }}>
                      {mission.missionDifficulty === 'usa' && us ? us.region : dest.continent} •{' '}
                      {miles.toLocaleString()} mi • Flight: <strong>{hours}h</strong>
                    </div>
                  </div>
                  <Plane size={19} color="var(--terracotta)" style={{ flexShrink: 0 }} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================================
          PHASE 4: DISTANCE-ACCURATE STORYBOOK HOT-AIR BALLOON VOYAGE
         ==================================================================== */}
      {turnPhase === 'flying' && flyingFromDest && flyingToDest && (
        <FlightJourneyCard
          fromDest={flyingFromDest}
          toDest={flyingToDest}
          crewAvatars={crewAvatars}
          durationMs={flightDurationMs}
          onLandEarly={onLandEarly}
        />
      )}

      {/* ====================================================================
          PHASE 5A: TIME SLIP! (LEVEL 4 RIGHT CITY, WRONG CENTURY!)
         ==================================================================== */}
      {turnPhase === 'time-slip' && currentDest && (
        <div
          className="paper-card"
          style={{
            padding: '20px 18px',
            background: 'var(--mariner-soft)',
            border: '2px solid var(--mariner)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div className="stamp-label" style={{ color: 'var(--mariner-dark)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <ClueGlyph kind="era" size={20} /> TIME SLIP — RIGHT CITY, WRONG CENTURY!
          </div>
          <h2 style={{ fontSize: '1.42rem', display: 'flex', alignItems: 'center', gap: 9 }}>
            <MiniFlag dest={currentDest} width={32} />
            <span>You Found {currentDest.name}, But Not in {ERA_INFO[selectedEra].label}!</span>
          </h2>
          <p style={{ fontSize: '0.94rem', lineHeight: 1.5, fontWeight: 700, color: 'var(--ink)' }}>
            Great geography deduction—the Chrono-Balloon definitely landed right here in{' '}
            <strong>{currentDest.name}</strong>! Re-read your Chrono-Dial clue below and re-tune your
            era right here (costs 6 hours):
          </p>

          {currentCityClues.some((c) => c.eraClue) && (
            <div className="paper-card" style={{ padding: 12 }}>
              {currentCityClues
                .filter((c) => c.eraClue)
                .map((c, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontWeight: 800, fontSize: '0.9rem' }}>
                    <ClueGlyph kind="era" size={19} />
                    <span>{c.eraClue}</span>
                  </div>
                ))}
            </div>
          )}

          <div className="chrono-dial-grid">
            {ALL_ERAS.map((eraId) => {
              const info = ERA_INFO[eraId];
              const triedCurrent = eraId === selectedEra;
              return (
                <button
                  key={eraId}
                  type="button"
                  disabled={triedCurrent}
                  className={`chrono-btn ${triedCurrent ? 'tried' : ''}`}
                  onClick={() => onJumpEraInCity(eraId)}
                >
                  <div style={{ fontWeight: 900, fontSize: '0.88rem' }}>{info.shortLabel}</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>{info.years}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================================
          PHASE 5B: COLD TRAIL DRAMA (WRONG CITY!)
         ==================================================================== */}
      {turnPhase === 'cold-trail' && currentDest && lastValidDest && (
        <div
          className="paper-card"
          style={{
            padding: '20px 18px',
            background: 'var(--terracotta-soft)',
            border: '2px solid var(--terracotta)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div className="stamp-label" style={{ color: 'var(--terracotta-dark)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={17} /> COLD TRAIL — WRONG DESTINATION!
          </div>
          <h2 style={{ fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: 9 }}>
            <MiniFlag dest={currentDest} width={32} />
            <span>Nobody Spotted Them in {currentDest.name}!</span>
          </h2>
          <p style={{ fontSize: '0.94rem', lineHeight: 1.5, fontWeight: 700, color: 'var(--ink)' }}>
            We searched the landmarks of <strong>{formatDestinationShortLabel(currentDest, mission.missionDifficulty)}</strong>,
            but the trail is completely cold! Compare your <strong>{lastValidDest.name}</strong> clues
            against the free Field Guide!
          </p>

          {currentCityClues.length > 0 && (
            <div className="paper-card" style={{ padding: 12 }}>
              <div className="stamp-label" style={{ color: 'var(--mariner)', fontSize: '0.7rem', marginBottom: 6 }}>
                RE-READ YOUR CLUES FROM {lastValidDest.name.toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {currentCityClues.map((c, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.88rem', fontWeight: 800, lineHeight: 1.45 }}>
                    <ClueGlyph kind={c.icon ?? 'geography'} size={18} />
                    <span>{c.destinationClue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              type="button"
              className="btn btn-sage"
              onClick={() => onOpenFieldGuide(mission.departureOptions)}
            >
              <BookOpen size={18} /> Compare the 5 Candidate Stops in Free Field Guide
            </button>
            <button
              type="button"
              className="btn btn-terracotta"
              onClick={onOpenDepartureBoard}
            >
              <Plane size={18} /> Reroute Directly to Another Candidate Stop
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onFlyBackToLastValid}
            >
              Fly Back to {lastValidDest.name} to Gather More Clues (8h)
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          PHASE 6: HOT TRAIL ARRIVAL — 3D TIME-FLIP POSTCARD & SOUVENIR!
         ==================================================================== */}
      {turnPhase === 'postcard' && postcardDest && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              padding: '9px 14px',
              borderRadius: 12,
              background: 'var(--sage-soft)',
              border: '1.5px solid var(--sage)',
              color: 'var(--sage-dark)',
              fontWeight: 800,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Sparkles size={17} />
            {isAtFinalTrailCity
              ? `JACKPOT! You tracked the culprit all the way to ${postcardDest.name}!`
              : `HOT TRAIL! Witnesses just spotted them in ${postcardDest.name}!`}
          </div>

          <TimeFlipPostcard
            destination={postcardDest}
            flipped={postcardFlipped}
            onToggleFlip={onTogglePostcardFlip}
            isNewDiscovery={celebratingNewDiscovery}
          />

          <button
            type="button"
            className="btn btn-terracotta btn-lg"
            style={{ width: '100%' }}
            onClick={onFinishPostcard}
          >
            {isAtFinalTrailCity
              ? 'Search Final Hideout & Issue Warrant →'
              : `Begin Investigation in ${postcardDest.name} →`}
          </button>
        </div>
      )}

      {/* ====================================================================
          PHASE 7: FINALE — ISSUE THE SUSPECT WARRANT!
         ==================================================================== */}
      {turnPhase === 'finale-warrant' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="paper-card" style={{ padding: '14px 16px', background: 'var(--ochre-soft)' }}>
            <div className="stamp-label" style={{ color: 'var(--terracotta)' }}>
              ★ FINAL SHOWDOWN IN {currentDest?.name.toUpperCase()} ★
            </div>
            <h2 style={{ fontSize: '1.42rem', marginTop: 3 }}>
              Issue the Warrant to Catch the Thief!
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', fontWeight: 700, marginTop: 4 }}>
              Match the profile traits your crew collected across the journey and lock in the right suspect:
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {Object.values(mission.discoveredSuspectTraits).length === 0 ? (
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--terracotta-dark)' }}>
                  No traits collected yet — tap “More Clues” to interview witnesses here first!
                </span>
              ) : (
                Object.values(mission.discoveredSuspectTraits).map((val, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 999,
                      background: '#FDF9F0',
                      border: '1.5px solid var(--ochre)',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                    }}
                  >
                    ✓ {val}
                  </span>
                ))
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mission.suspectIds.map((sid) => {
              const s = SUSPECTS_BY_ID[sid];
              if (!s) return null;
              const selected = mission.selectedWarrantSuspectId === sid;
              return (
                <button
                  key={sid}
                  type="button"
                  onClick={() => onSelectWarrantSuspect(sid)}
                  className="paper-card"
                  style={{
                    padding: '11px 13px',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 11,
                    border: selected
                      ? '2.5px solid var(--terracotta)'
                      : '1.5px solid rgba(43,35,29,0.2)',
                    background: selected ? 'var(--terracotta-soft)' : 'var(--parchment-bright)',
                  }}
                >
                  <AnimalAvatar avatar={s.avatar} size={46} />
                  <div style={{ flex: 1, fontSize: '0.82rem', lineHeight: 1.4 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem' }}>
                      {s.name} —{' '}
                      <span style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--ink-soft)' }}>
                        {s.title}
                      </span>
                    </div>
                    <div>
                      <strong>{s.accessory}</strong> • loves {s.favoriteTreat} • with {s.companion} • {s.hobby}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {warrantFeedback && (
            <div className="hint-box" style={{ background: 'var(--terracotta-soft)', borderColor: 'var(--terracotta)' }}>
              {warrantFeedback}
            </div>
          )}

          <div style={{ display: 'flex', gap: 9 }}>
            <button type="button" className="btn btn-secondary" onClick={onBackToTownHub}>
              ← More Clues
            </button>
            <button
              type="button"
              className="btn btn-terracotta btn-lg"
              style={{ flex: 1 }}
              disabled={!mission.selectedWarrantSuspectId}
              onClick={onSubmitWarrant}
            >
              <ShieldCheck size={20} /> Crack the Case!
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          PHASE 8: CASE COMPLETE (VICTORY OR DRAMATIC ESCAPE!)
         ==================================================================== */}
      {turnPhase === 'case-complete' && culprit && (
        <div
          className="paper-card"
          style={{
            padding: '22px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <AnimalAvatar avatar={culprit.avatar} size={74} />
          {mission.status === 'won' ? (
            <>
              <div className="stamp-label" style={{ color: 'var(--sage-dark)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Award size={17} /> CASE SOLVED • {(mission.medal ?? 'gold').toUpperCase()} SLEUTH MEDAL!
              </div>
              <h2 style={{ fontSize: '1.7rem' }}>You Caught {culprit.name}!</h2>
              <p style={{ fontStyle: 'italic', color: 'var(--mariner-dark)', fontWeight: 700, fontSize: '1rem' }}>
                {culprit.catchphrase}
              </p>
              <p style={{ color: 'var(--ink-soft)', fontWeight: 600, lineHeight: 1.5, fontSize: '0.94rem' }}>
                Your detective crew recovered <strong>{mission.stolenOrTargetItem}</strong> across{' '}
                <strong>{mission.trailDestIds.length} stops</strong> ({diffMeta.label}) with{' '}
                <strong>{clock.daysRemainingText}</strong> to spare!
              </p>
            </>
          ) : (
            <>
              <div className="stamp-label" style={{ color: 'var(--terracotta)' }}>
                TRAVEL CLOCK EXPIRED — CLIFFHANGER!
              </div>
              <h2 style={{ fontSize: '1.65rem' }}>
                {culprit.name} Slipped Into the Clouds!
              </h2>
              <p style={{ fontStyle: 'italic', color: 'var(--ink-soft)', fontWeight: 700 }}>
                {culprit.catchphrase}
              </p>
              <p style={{ color: 'var(--ink-soft)', fontWeight: 600, lineHeight: 1.5, fontSize: '0.94rem' }}>
                So close! Every postcard and souvenir you stamped along the way is still saved in
                your Family Passport—ready for an epic rematch?
              </p>
            </>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 8,
              padding: '10px 8px',
              background: 'var(--parchment)',
              borderRadius: 14,
              width: '100%',
            }}
          >
            {[...new Set(mission.visitedDestIds)].map((id) => {
              const d = DESTINATIONS_BY_ID[id];
              return d ? <SouvenirArt key={id} id={d.souvenirId} size={42} /> : null;
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, width: '100%' }}>
            <button type="button" className="btn btn-terracotta btn-lg" onClick={onStartNewCase}>
              <Sparkles size={19} /> Launch Next Mystery Case
            </button>
            <button type="button" className="btn btn-ochre" onClick={onOpenPassport}>
              <BookOpen size={18} /> View {DESTINATIONS.length}-Stop Family Passport
            </button>
            <button type="button" className="btn btn-secondary" onClick={onExitHome}>
              Return to Expedition Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // STICKY EXPEDITION HEADER
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
              fontSize: '1.02rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {mission.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginTop: 2 }}>
            <span className={`clock-pill ${clock.isUrgent ? 'urgent' : ''}`}>
              <Clock size={13} /> Day {clock.currentDay} • {clock.timeOfDay} • {clock.daysRemainingText}
            </span>
            <span className="stamp-label" style={{ fontSize: '0.68rem', color: 'var(--mariner)' }}>
              {diffMeta.shortLabel}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn btn-sage btn-sm"
          onClick={() => onOpenFieldGuide(mission.departureOptions)}
          title="Always Free Illustrated Atlas Almanac"
        >
          <BookOpen size={15} /> Field Guide
        </button>
        <button type="button" className="btn btn-ochre btn-sm" onClick={onOpenNotebook}>
          <FileText size={15} /> Dossier ({discoveredTraitCount}/4)
        </button>
        {tvConnectedCode ? (
          <>
            <span className="level-pill navigator" style={{ background: 'var(--mariner)', color: '#FDF9F0' }}>
              <Tv size={13} /> TV • {tvConnectedCode}
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowMapInController((s) => !s)}
            >
              <MapIcon size={15} /> {showMapInController ? 'Controller' : 'Peek Map'}
            </button>
          </>
        ) : (
          <button type="button" className="btn btn-secondary btn-sm" onClick={toggleMapExpanded}>
            <MapIcon size={15} /> {isMapExpanded ? 'Hide Map' : 'Show Map'}
          </button>
        )}
      </div>
    </header>
  );

  // CO-PILOT TABLET CONTROLLER MODE (LINKED TO TV)
  if (isControllerMode) {
    return (
      <div className="controller-shell">
        {headerBar}
        <main className="controller-main">{renderTurnContent(true)}</main>
      </div>
    );
  }

  // SINGLE-SCREEN / CAST MODE
  return (
    <div className={`expedition-shell ${isMapExpanded ? 'split-open' : ''}`}>
      {headerBar}
      <div className={`expedition-body ${isMapExpanded ? '' : 'map-collapsed'}`}>
        {isMapExpanded ? (
          <div className="map-stage">
            <button type="button" className="map-collapse-pill" onClick={toggleMapExpanded}>
              <ChevronUp size={16} /> Collapse Map
            </button>
            <WorldAtlasMap
              currentDestId={mission.currentDestId}
              visitedDestIds={mission.visitedDestIds}
              discoveredDestIds={discoveredDestIds}
              routeOptions={turnPhase === 'departure-board' ? mission.departureOptions : []}
              mapMode={mapMode}
              crewAvatars={crewAvatars}
              flyingFromId={turnPhase === 'flying' ? flyingFromId : null}
              flyingToId={turnPhase === 'flying' ? flyingToId : null}
              flightDurationMs={flightDurationMs}
              interactive={turnPhase === 'departure-board'}
              onSelectRoute={onFlyToDestination}
            />
          </div>
        ) : (
          <div className="map-collapsed-bar">
            <button type="button" className="map-collapsed-btn" onClick={toggleMapExpanded}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                {currentDest && <MiniFlag dest={currentDest} width={24} />}
                <span>
                  {mapMode === 'usa' ? '50-State USA Map' : 'World Atlas Map'} Collapsed (
                  {currentDest ? formatDestinationShortLabel(currentDest, mission.missionDifficulty) : ''})
                </span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Show Map <ChevronDown size={17} />
              </span>
            </button>
          </div>
        )}

        <aside className="turn-sidebar">{renderTurnContent(false)}</aside>
      </div>
    </div>
  );
}
