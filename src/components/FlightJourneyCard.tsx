import { useEffect, useMemo, useState } from 'react';
import { FastForward, Wind } from 'lucide-react';
import { computeDistanceMiles } from '../data/destinations';
import type { AvatarId, Destination } from '../types/game';
import { AnimalAvatar } from './art/AnimalAvatar';
import { BalloonEmblem } from './art/CompassRose';
import { MiniFlag } from './art/MiniFlag';

interface FlightJourneyCardProps {
  fromDest: Destination;
  toDest: Destination;
  crewAvatars?: AvatarId[];
  durationMs?: number;
  compact?: boolean;
  onLandEarly?: () => void;
}

export function FlightJourneyCard({
  fromDest,
  toDest,
  crewAvatars = [],
  durationMs = 6500,
  compact = false,
  onLandEarly,
}: FlightJourneyCardProps) {
  const [progress, setProgress] = useState(0);

  const totalMiles = useMemo(
    () => computeDistanceMiles(fromDest.coords, toDest.coords),
    [fromDest.coords, toDest.coords]
  );

  useEffect(() => {
    let frameId = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      setProgress(p);
      if (p < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [fromDest.id, toDest.id, durationMs]);

  const milesFlown = Math.round(totalMiles * progress);
  const pct = Math.round(progress * 100);
  const paceLabel =
    totalMiles < 1200
      ? 'Quick Regional Hop'
      : totalMiles < 3600
        ? 'Continental Crossing'
        : 'Epic Long-Haul Voyage';

  const stage =
    progress < 0.34
      ? {
          tag: 'LIFTING OFF',
          headline: `Leaving ${fromDest.name}, ${fromDest.country}...`,
          caption: `Warm breezes lift our crew high above ${fromDest.name}!`,
        }
      : progress < 0.72
        ? {
            tag: toDest.routeLabel.toUpperCase(),
            headline: `Cruising toward ${toDest.continent}!`,
            caption: `${paceLabel} — ${totalMiles.toLocaleString()} miles across the sky.`,
          }
        : {
            tag: 'LANDING APPROACH',
            headline: `Spotting ${toDest.name} below!`,
            caption: `Look down—a friendly ${toDest.animalName} is waving to welcome our crew!`,
          };

  return (
    <div
      className="paper-card"
      style={{
        padding: compact ? '16px 20px' : '20px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 13,
        background: 'linear-gradient(180deg, #FDF9F0 0%, #F6EAD2 100%)',
      }}
    >
      {/* Route Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        <div
          className="stamp-label"
          style={{
            color: 'var(--terracotta)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Wind size={15} /> {stage.tag}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {crewAvatars.length > 0 && (
            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
              {crewAvatars.slice(0, 4).map((av, idx) => (
                <div
                  key={`${av}-${idx}`}
                  style={{ marginLeft: idx === 0 ? 0 : -6 }}
                >
                  <AnimalAvatar avatar={av} size={26} />
                </div>
              ))}
            </div>
          )}
          <div
            className="stamp-label"
            style={{
              color: 'var(--mariner)',
              background: 'var(--mariner-soft)',
              padding: '4px 10px',
              borderRadius: 999,
            }}
          >
            {milesFlown.toLocaleString()} / {totalMiles.toLocaleString()} MI
          </div>
        </div>
      </div>

      {/* Storybook Narrative Beat */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <div className="balloon-bob" style={{ flexShrink: 0 }}>
          {progress >= 0.72 ? (
            <AnimalAvatar avatar={toDest.animalAvatar} size={compact ? 54 : 48} />
          ) : (
            <BalloonEmblem size={compact ? 54 : 48} />
          )}
        </div>
        <div>
          <h3 style={{ fontSize: compact ? '1.45rem' : '1.22rem', lineHeight: 1.2 }}>
            {stage.headline}
          </h3>
          <p
            style={{
              fontSize: compact ? '1rem' : '0.9rem',
              color: 'var(--ink-soft)',
              fontWeight: 700,
              marginTop: 4,
              lineHeight: 1.4,
            }}
          >
            {stage.caption}
          </p>
        </div>
      </div>

      {/* Visual Flight Track Gauge */}
      <div style={{ paddingTop: 10 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.78rem',
            fontWeight: 800,
            color: 'var(--ink-soft)',
            marginBottom: 8,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <MiniFlag dest={fromDest} width={24} />
            <span>{fromDest.name}</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span>{toDest.name}</span>
            <MiniFlag dest={toDest} width={24} />
          </span>
        </div>

        <div style={{ position: 'relative', padding: '8px 0' }}>
          <div className="progress-track" style={{ height: 12 }}>
            <div
              className="progress-fill"
              style={{
                width: `${pct}%`,
                background:
                  'linear-gradient(90deg, var(--ochre) 0%, var(--terracotta) 100%)',
                transition: 'none',
              }}
            />
          </div>
          {/* Gliding Mini Balloon Marker */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: `${pct}%`,
              transform: 'translate(-50%, -58%)',
              pointerEvents: 'none',
            }}
          >
            <BalloonEmblem size={28} />
          </div>
        </div>
      </div>

      {onLandEarly && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onLandEarly}
          >
            <FastForward size={15} /> Land Now
          </button>
        </div>
      )}
    </div>
  );
}
