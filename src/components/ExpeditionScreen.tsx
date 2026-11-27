import { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  FileText,
  Landmark,
  Map as MapIcon,
  Plane,
  ShieldCheck,
  Sparkles,
  Store,
  Tv,
  Users,
  Volume2,
} from 'lucide-react';
import { SUSPECTS_BY_ID } from '../data/cases';
import {
  DESTINATIONS_BY_ID,
  computeDistanceMiles,
  computeFlightHours,
} from '../data/destinations';
import { TOWN_SPOTS } from '../engine/questionEngine';
import type {
  CaseMission,
  DifficultyLevel,
  Player,
  QuizQuestion,
  TownSpotId,
  TurnPhase,
  WitnessClue,
} from '../types/game';
import { formatTravelClock } from '../utils/storage';
import { AnimalAvatar } from './art/AnimalAvatar';
import { SouvenirArt } from './art/SouvenirArt';
import { FLIGHT_DURATION_MS, FlightJourneyCard } from './FlightJourneyCard';
import { TimeFlipPostcard } from './TimeFlipPostcard';
import { WorldAtlasMap } from './WorldAtlasMap';

interface ExpeditionScreenProps {
  mission: CaseMission;
  currentPlayer: Player;
  nextPlayer: Player;
  discoveredDestIds: string[];
  turnPhase: TurnPhase;
  activeSpotId: TownSpotId | null;
  activeQuestion: QuizQuestion | null;
  latestWitnessClue: WitnessClue | null;
  flyingFromId: string | null;
  flyingToId: string | null;
  activeLevel: DifficultyLevel;
  crewHelped: boolean;
  triedChoiceIndices: number[];
  showGentleHint: boolean;
  postcardDestId: string | null;
  postcardFlipped: boolean;
  celebratingNewDiscovery: boolean;
  warrantFeedback: string | null;
  tvConnectedCode: string | null;
  onSelectSpot: (spotId: TownSpotId) => void;
  onChangeLevel: (level: DifficultyLevel) => void;
  onPickAnswer: (index: number) => void;
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
  onReadAloud: (text: string) => void;
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

export function ExpeditionScreen({
  mission,
  currentPlayer,
  nextPlayer,
  discoveredDestIds,
  turnPhase,
  activeSpotId,
  activeQuestion,
  latestWitnessClue,
  flyingFromId,
  flyingToId,
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
  onPickAnswer,
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
  onReadAloud,
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

  // Show atlas prominently during Departure Board & Flying; auto-collapse on tablets
  // during town reading, questions, postcards, and finale so nothing is obscured!
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
  const lastValidDest = DESTINATIONS_BY_ID[mission.lastValidDestId];
  const flyingFromDest = flyingFromId ? DESTINATIONS_BY_ID[flyingFromId] : currentDest;
  const flyingToDest = flyingToId ? DESTINATIONS_BY_ID[flyingToId] : null;
  const postcardDest = postcardDestId ? DESTINATIONS_BY_ID[postcardDestId] : currentDest;

  const clock = formatTravelClock(mission.hoursElapsed, mission.totalHoursBudget);
  const isControllerMode = Boolean(tvConnectedCode) && !showMapInController;
  const isMultiPlayer = mission.playerIds.length > 1;
  const isAtFinalTrailCity =
    !mission.isOnColdTrail &&
    mission.trailProgressIndex >= mission.trailDestIds.length - 1;

  const investigatedHere = mission.investigatedSpotsByCity[mission.currentDestId] ?? [];
  const currentCityClues = mission.cluesLog.filter(
    (c) => c.cityId === mission.lastValidDestId
  );
  const discoveredTraitCount = Object.keys(mission.discoveredSuspectTraits).length;
  const culprit = SUSPECTS_BY_ID[mission.culpritId];

  const spotIcon = (id: TownSpotId) => {
    if (id === 'harbor') return <Compass size={22} color="var(--mariner)" />;
    if (id === 'market') return <Store size={22} color="var(--ochre-dark)" />;
    return <Landmark size={22} color="var(--terracotta)" />;
  };

  const renderTurnContent = (isControllerLayout: boolean) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Active Explorer + 4-Tier Opt-In Switcher */}
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
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: isControllerLayout ? '1.3rem' : '1.12rem' }}>
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
                Opt-in difficulty tier (switch anytime):
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
          PHASE 1: TOWN INVESTIGATION HUB (MULTI-TURN PER CITY!)
         ==================================================================== */}
      {turnPhase === 'town-hub' && currentDest && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="paper-card" style={{ padding: '14px 16px', background: 'var(--parchment)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <div>
                <div className="stamp-label" style={{ color: 'var(--mariner)' }}>
                  {isAtFinalTrailCity
                    ? `★ FINAL HIDEOUT CITY • STOP ${mission.trailProgressIndex + 1} OF ${mission.trailDestIds.length}`
                    : `ON THE TRAIL • CITY ${mission.trailProgressIndex + 1} OF ${mission.trailDestIds.length}`}
                </div>
                <h2 style={{ fontSize: isControllerLayout ? '1.5rem' : '1.28rem', marginTop: 2 }}>
                  {currentDest.name}, {currentDest.country}
                </h2>
                <p style={{ fontSize: '0.86rem', color: 'var(--ink-soft)', fontWeight: 600, marginTop: 3 }}>
                  “{currentDest.greeting}” — Investigate local spots to gather clues about{' '}
                  {isAtFinalTrailCity ? 'who is hiding right here!' : 'where the trail went next!'}
                </p>
              </div>
            </div>
          </div>

          {/* Latest Witness Clue Spotlight (just unlocked!) */}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <div className="stamp-label" style={{ color: 'var(--sage-dark)' }}>
                  ✓ NEW CLUE FROM {latestWitnessClue.witnessName.toUpperCase()}
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() =>
                    onReadAloud(
                      `${latestWitnessClue.destinationClue} ${latestWitnessClue.suspectClue ?? ''}`
                    )
                  }
                >
                  <Volume2 size={14} />
                </button>
              </div>
              <p style={{ fontWeight: 800, fontSize: '0.98rem', lineHeight: 1.45 }}>
                {latestWitnessClue.destinationClue}
              </p>
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
                  }}
                >
                  ★ Profile Trait Logged: {latestWitnessClue.suspectClue}
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

          {/* 3 Local Investigation Spots */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <div className="stamp-label" style={{ color: 'var(--ink-muted)' }}>
              LOCAL SPOTS TO INVESTIGATE (3 HOURS EACH)
            </div>
            {TOWN_SPOTS.map((spot) => {
              const visited = investigatedHere.includes(spot.id);
              const existingClue = currentCityClues.find((c) => c.spotId === spot.id);
              return (
                <button
                  key={spot.id}
                  type="button"
                  disabled={visited}
                  onClick={() => onSelectSpot(spot.id)}
                  className="route-choice-btn"
                  style={{
                    opacity: visited ? 0.88 : 1,
                    background: visited ? 'var(--parchment)' : 'var(--parchment-bright)',
                    borderColor: visited ? 'rgba(70,120,86,0.45)' : undefined,
                    cursor: visited ? 'default' : 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: visited ? 'var(--sage-soft)' : 'var(--parchment-deep)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {visited ? <CheckCircle2 size={22} color="var(--sage)" /> : spotIcon(spot.id)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem' }}>
                        {spot.title}
                      </span>
                      <span className="stamp-label" style={{ fontSize: '0.7rem', color: visited ? 'var(--sage-dark)' : 'var(--terracotta)' }}>
                        {visited ? 'INVESTIGATED' : `+${spot.clockHours}H`}
                      </span>
                    </div>
                    {existingClue ? (
                      <div style={{ fontSize: '0.84rem', color: 'var(--ink)', fontWeight: 700, marginTop: 4, lineHeight: 1.4 }}>
                        {existingClue.destinationClue}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', fontWeight: 600, marginTop: 2 }}>
                        {spot.subtitle}
                      </div>
                    )}
                  </div>
                </button>
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
                  ? 'Peek at 5-City Departure Board'
                  : `Ready to Deduce? Open Departure Board (${currentCityClues.length}/3 Clues)`}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onOpenFieldGuide(mission.departureOptions)}
              >
                <BookOpen size={16} /> Compare My 5 Candidate Cities in Free Field Guide
              </button>
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          PHASE 2: SPOT CHALLENGE (SERIOUS 4-CHOICE CHALLENGE + FREE ALMANAC!)
         ==================================================================== */}
      {turnPhase === 'spot-challenge' && activeQuestion && activeSpotId && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <div className="stamp-label" style={{ color: 'var(--mariner)' }}>
              {TOWN_SPOTS.find((s) => s.id === activeSpotId)?.title.toUpperCase()} • {activeQuestion.category.toUpperCase()}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() =>
                  onReadAloud(
                    `${activeQuestion.prompt} Options: ${activeQuestion.choices.join(', ')}`
                  )
                }
              >
                <Volume2 size={15} /> Read
              </button>
              <button
                type="button"
                className="btn btn-sage btn-sm"
                onClick={() => onOpenFieldGuide()}
                title="Always free to research!"
              >
                <BookOpen size={15} /> Field Guide (Free)
              </button>
            </div>
          </div>

          <h2 style={{ fontSize: isControllerLayout ? '1.35rem' : '1.14rem', lineHeight: 1.36 }}>
            {activeQuestion.prompt}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {activeQuestion.choices.map((choice, idx) => {
              const tried = triedChoiceIndices.includes(idx);
              return (
                <button
                  key={`${choice}-${idx}`}
                  type="button"
                  disabled={tried}
                  className={`answer-btn ${tried ? 'tried' : ''}`}
                  style={{ fontSize: isControllerLayout ? '1.08rem' : '0.96rem', padding: '12px 14px' }}
                  onClick={() => onPickAnswer(idx)}
                >
                  <span className="answer-letter">{['A', 'B', 'C', 'D'][idx]}</span>
                  <span>{choice}</span>
                </button>
              );
            })}
          </div>

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
          PHASE 3: 5-DESTINATION DEPARTURE BOARD (DEDUCE THE RIGHT TRAIL!)
         ==================================================================== */}
      {turnPhase === 'departure-board' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div>
              <div className="stamp-label" style={{ color: 'var(--terracotta)' }}>
                DEPARTURE BOARD • DEDUCE THE NEXT CITY
              </div>
              <h2 style={{ fontSize: '1.3rem', marginTop: 2 }}>
                Where Did the Trail Go Next?
              </h2>
            </div>
            {!mission.isOnColdTrail && (
              <button type="button" className="btn btn-secondary btn-sm" onClick={onBackToTownHub}>
                ← Back to Town
              </button>
            )}
          </div>

          {/* Inline Clue Recap from Last Valid City */}
          <div className="paper-card" style={{ padding: '11px 13px', background: 'var(--ochre-soft)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span className="stamp-label" style={{ color: 'var(--ochre-dark)', fontSize: '0.7rem' }}>
                YOUR CLUES FROM {lastValidDest?.name.toUpperCase()} ({currentCityClues.length}/3)
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
              <p style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--ink-soft)' }}>
                You haven’t gathered any town clues yet! Flying blind risks a Cold Trail—head back to town to interview locals first!
              </p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.86rem', fontWeight: 700, lineHeight: 1.45 }}>
                {currentCityClues.map((c, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>{c.destinationClue}</li>
                ))}
              </ul>
            )}
          </div>

          {/* 5 Plausible Candidate Flights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mission.departureOptions.map((destId) => {
              const dest = DESTINATIONS_BY_ID[destId];
              if (!dest || !currentDest) return null;
              const miles = computeDistanceMiles(currentDest.coords, dest.coords);
              const hours = computeFlightHours(currentDest.id, dest.id);
              return (
                <button
                  key={dest.id}
                  type="button"
                  className="route-choice-btn"
                  onClick={() => onFlyToDestination(dest.id)}
                >
                  <AnimalAvatar avatar={dest.animalAvatar} size={42} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem' }}>
                      {dest.country} — {dest.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', fontWeight: 700 }}>
                      {dest.continent} • {miles.toLocaleString()} mi • Flight time: <strong>{hours}h</strong>
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
          PHASE 4: 7.5-SECOND STORYBOOK HOT-AIR BALLOON VOYAGE
         ==================================================================== */}
      {turnPhase === 'flying' && flyingFromDest && flyingToDest && (
        <FlightJourneyCard
          fromDest={flyingFromDest}
          toDest={flyingToDest}
          durationMs={FLIGHT_DURATION_MS}
          onLandEarly={onLandEarly}
        />
      )}

      {/* ====================================================================
          PHASE 5: COLD TRAIL DRAMA (WRONG CITY!)
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
          <h2 style={{ fontSize: '1.45rem' }}>
            Nobody Spotted Them in {currentDest.name}!
          </h2>
          <p style={{ fontSize: '0.94rem', lineHeight: 1.5, fontWeight: 700, color: 'var(--ink)' }}>
            We searched the docks and markets of <strong>{currentDest.country}</strong>, but the
            trail is completely cold! That detour burned precious hours on the Travel Clock—let’s
            compare our <strong>{lastValidDest.name}</strong> clues against the free Field Guide!
          </p>

          {currentCityClues.length > 0 && (
            <div className="paper-card" style={{ padding: 12 }}>
              <div className="stamp-label" style={{ color: 'var(--mariner)', fontSize: '0.7rem', marginBottom: 4 }}>
                RE-READ YOUR CLUES FROM {lastValidDest.name.toUpperCase()}
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.86rem', fontWeight: 700, lineHeight: 1.45 }}>
                {currentCityClues.map((c, idx) => (
                  <li key={idx}>{c.destinationClue}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              type="button"
              className="btn btn-sage"
              onClick={() => onOpenFieldGuide(mission.departureOptions)}
            >
              <BookOpen size={18} /> Compare the 5 Candidate Cities in Free Field Guide
            </button>
            <button
              type="button"
              className="btn btn-terracotta"
              onClick={onOpenDepartureBoard}
            >
              <Plane size={18} /> Reroute Directly to Another Candidate City
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
              ? `JACKPOT! You tracked the trail all the way to ${postcardDest.country}!`
              : `HOT TRAIL! Witnesses just spotted them in ${postcardDest.country}!`}
          </div>

          <TimeFlipPostcard
            destination={postcardDest}
            flipped={postcardFlipped}
            onToggleFlip={onTogglePostcardFlip}
            onReadAloud={onReadAloud}
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
              Name the Match to Crack the Case!
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', fontWeight: 700, marginTop: 4 }}>
              Review the profile traits your crew collected across the journey and lock in the matching dossier card:
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {Object.values(mission.discoveredSuspectTraits).length === 0 ? (
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--terracotta-dark)' }}>
                  No traits collected yet — tap “Back to Town” to interview witnesses here first!
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
                      {s.name} — <span style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--ink-soft)' }}>{s.title}</span>
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
              <h2 style={{ fontSize: '1.7rem' }}>
                {mission.kind === 'wonder-chase'
                  ? `You Caught ${culprit.name}!`
                  : `You Found ${culprit.name}!`}
              </h2>
              <p style={{ fontStyle: 'italic', color: 'var(--mariner-dark)', fontWeight: 700, fontSize: '1rem' }}>
                {culprit.catchphrase}
              </p>
              <p style={{ color: 'var(--ink-soft)', fontWeight: 600, lineHeight: 1.5, fontSize: '0.94rem' }}>
                Your detective crew recovered <strong>{mission.stolenOrTargetItem}</strong> across{' '}
                <strong>{mission.trailDestIds.length} world cities</strong> with{' '}
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
              <BookOpen size={18} /> View 100-Stop Family Passport
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
            <span className={`clock-pill ${clock.isUrgent ? 'urgent' : ''}`}>
              <Clock size={13} /> Day {clock.currentDay} • {clock.timeOfDay} • {clock.daysRemainingText}
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
        <button
          type="button"
          className="btn btn-ochre btn-sm"
          onClick={onOpenNotebook}
        >
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

  // SINGLE-SCREEN / CAST MODE (NATURAL SCROLL + COLLAPSIBLE ATLAS)
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
            >
              <ChevronUp size={16} /> Collapse Map
            </button>
            <WorldAtlasMap
              currentDestId={mission.currentDestId}
              visitedDestIds={mission.visitedDestIds}
              discoveredDestIds={discoveredDestIds}
              routeOptions={turnPhase === 'departure-board' ? mission.departureOptions : []}
              flyingFromId={turnPhase === 'flying' ? flyingFromId : null}
              flyingToId={turnPhase === 'flying' ? flyingToId : null}
              flightDurationMs={FLIGHT_DURATION_MS}
              interactive={turnPhase === 'departure-board'}
              onSelectRoute={onFlyToDestination}
            />
          </div>
        ) : (
          <div className="map-collapsed-bar">
            <button type="button" className="map-collapsed-btn" onClick={toggleMapExpanded}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <MapIcon size={17} />
                World Atlas Map Collapsed ({currentDest?.name}, {currentDest?.country})
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
