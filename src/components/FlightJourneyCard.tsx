import { useEffect, useMemo, useState } from 'react';
import { FastForward, Wind } from 'lucide-react';
import type { Destination } from '../types/game';
import { AnimalAvatar } from './art/AnimalAvatar';
import { BalloonEmblem } from './art/CompassRose';

export const FLIGHT_DURATION_MS = 7500;

function computeMiles(c1: [number, number], c2: [number, number]): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const [lon1, lat1] = c1;
  const [lon2, lat2] = c2;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const miles = 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(250, Math.round(miles / 10) * 10);
}

interface FlightJourneyCardProps {
  fromDest: Destination;
  toDest: Destination;
  durationMs?: number;
  compact?: boolean;
  onLandEarly?: () => void;
}

export function FlightJourneyCard({
  fromDest,
  toDest,
  durationMs = FLIGHT_DURATION_MS,
  compact = false,
  onLandEarly,
}: FlightJourneyCardProps) {
  const [progress, setProgress] = useState(0);

  const totalMiles = useMemo(
    () => computeMiles(fromDest.coords, toDest.coords),
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

  const stage =
    progress < 0.34
      ? {
          tag: 'LIFTING OFF',
          headline: `Leaving ${fromDest.country} behind...`,
          caption: `Warm breezes lift our balloon high above ${fromDest.name}!`,
        }
      : progress < 0.72
        ? {
            tag: toDest.routeLabel.toUpperCase(),
            headline: `Cruising toward ${toDest.continent}!`,
            caption: `Floating past drifting clouds on our ${totalMiles.toLocaleString()}-mile voyage.`,
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
        gap: 14,
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
              fontWeight: 600,
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
            fontSize: '0.78rem',
            fontWeight: 800,
            color: 'var(--ink-soft)',
            marginBottom: 8,
          }}
        >
          <span>{fromDest.country}</span>
          <span>{toDest.country}</span>
        </div>

        <div style={{ position: 'relative', padding: '8px 0' }}>
          <div className="progress-track" style={{ height: 12 }}>
            <div
              className="progress-fill"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, var(--ochre) 0%, var(--terracotta) 100%)',
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
