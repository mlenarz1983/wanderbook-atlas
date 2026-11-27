import { useEffect, useMemo, useState } from 'react';
import { geoGraticule10, geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import countriesAtlas from 'world-atlas/countries-110m.json';
import { CONTINENT_FILLS, getContinentForCountryId } from '../data/continentMap';
import { DESTINATIONS, DESTINATIONS_BY_ID } from '../data/destinations';
import type { AvatarId } from '../types/game';
import { AnimalAvatar } from './art/AnimalAvatar';
import { CompassRose } from './art/CompassRose';

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 540;
const DEFAULT_FLIGHT_MS = 6500;

interface WorldAtlasMapProps {
  currentDestId: string;
  visitedDestIds: string[];
  discoveredDestIds: string[];
  routeOptions: string[];
  crewAvatars?: AvatarId[];
  flyingFromId?: string | null;
  flyingToId?: string | null;
  flightDurationMs?: number;
  interactive?: boolean;
  isTvMode?: boolean;
  onSelectRoute?: (destId: string) => void;
  onSelectDestination?: (destId: string) => void;
}

function getArcCurve(
  p1: [number, number],
  p2: [number, number]
): { d: string; mid: [number, number]; cp: [number, number] } {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const dist = Math.hypot(dx, dy);
  const lift = Math.min(96, Math.max(30, dist * 0.25));
  const cx = (p1[0] + p2[0]) / 2;
  const cy = (p1[1] + p2[1]) / 2 - lift;
  return {
    d: `M ${p1[0]} ${p1[1]} Q ${cx} ${cy} ${p2[0]} ${p2[1]}`,
    cp: [cx, cy],
    mid: [0.25 * p1[0] + 0.5 * cx + 0.25 * p2[0], 0.25 * p1[1] + 0.5 * cy + 0.25 * p2[1]],
  };
}

function pointOnQuad(
  p1: [number, number],
  cp: [number, number],
  p2: [number, number],
  t: number
): [number, number] {
  const u = 1 - t;
  return [
    u * u * p1[0] + 2 * u * t * cp[0] + t * t * p2[0],
    u * u * p1[1] + 2 * u * t * cp[1] + t * t * p2[1],
  ];
}

export function WorldAtlasMap({
  currentDestId,
  visitedDestIds,
  discoveredDestIds,
  routeOptions,
  crewAvatars = [],
  flyingFromId = null,
  flyingToId = null,
  flightDurationMs = DEFAULT_FLIGHT_MS,
  interactive = true,
  isTvMode = false,
  onSelectRoute,
  onSelectDestination,
}: WorldAtlasMapProps) {
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  const [flightProgress, setFlightProgress] = useState(0);

  // Animate hot-air balloon smoothly along curved route during the voyage
  useEffect(() => {
    if (!flyingFromId || !flyingToId) {
      return;
    }
    let frameId = 0;
    const duration = flightDurationMs;
    const start = performance.now();

    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / duration);
      // Gentle ease-in-out sine curve so takeoff & landing feel floaty and calm
      const eased = -(Math.cos(Math.PI * raw) - 1) / 2;
      setFlightProgress(eased);
      if (raw < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [flyingFromId, flyingToId, flightDurationMs]);

  const { projection, pathGen, countries, graticulePath, spherePath } = useMemo(() => {
    const proj = geoNaturalEarth1()
      .scale(194)
      .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2 + 16]);
    const generator = geoPath(proj);
    const topology = countriesAtlas as unknown as Topology<{
      countries: GeometryCollection;
    }>;
    const fc = feature(topology, topology.objects.countries);
    return {
      projection: proj,
      pathGen: generator,
      countries: fc.features,
      graticulePath: generator(geoGraticule10()) ?? '',
      spherePath: generator({ type: 'Sphere' }) ?? '',
    };
  }, []);

  const destPositions = useMemo(() => {
    const map: Record<string, [number, number]> = {};
    for (const d of DESTINATIONS) {
      const pt = projection(d.coords);
      if (pt) map[d.id] = [pt[0], pt[1]];
    }
    return map;
  }, [projection]);

  const currentPos = useMemo<[number, number]>(
    () => destPositions[currentDestId] ?? [500, 260],
    [destPositions, currentDestId]
  );
  const discoveredSet = useMemo(() => new Set(discoveredDestIds), [discoveredDestIds]);
  const visitedSet = useMemo(() => new Set(visitedDestIds), [visitedDestIds]);
  const routeSet = useMemo(() => new Set(routeOptions), [routeOptions]);

  // Compute animated balloon coordinates, trailing flight wake & gentle breeze sway
  const flightVisuals = useMemo(() => {
    if (
      flyingFromId &&
      flyingToId &&
      destPositions[flyingFromId] &&
      destPositions[flyingToId]
    ) {
      const p1 = destPositions[flyingFromId];
      const p2 = destPositions[flyingToId];
      const { cp } = getArcCurve(p1, p2);
      const pos = pointOnQuad(p1, cp, p2, flightProgress);

      // Sample points along the arc from 0 up to current flightProgress for a drawn trail
      const steps = 28;
      const wakePts: string[] = [];
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * flightProgress;
        const pt = pointOnQuad(p1, cp, p2, t);
        wakePts.push(`${pt[0].toFixed(1)},${pt[1].toFixed(1)}`);
      }

      // Three trailing sparkle/cloud puffs right behind the balloon
      const puffs = [0.04, 0.085, 0.13]
        .map((lag) => Math.max(0, flightProgress - lag))
        .filter((t) => t > 0.01)
        .map((t, idx) => ({
          pt: pointOnQuad(p1, cp, p2, t),
          r: 4.5 - idx * 1.1,
          opacity: 0.78 - idx * 0.22,
        }));

      const swayDeg = Math.sin(flightProgress * Math.PI * 5) * 6;
      return {
        balloonPos: pos,
        wakePolyline: wakePts.join(' '),
        puffs,
        swayDeg,
      };
    }

    return {
      balloonPos: currentPos,
      wakePolyline: '',
      puffs: [] as { pt: [number, number]; r: number; opacity: number }[],
      swayDeg: 0,
    };
  }, [flyingFromId, flyingToId, destPositions, flightProgress, currentPos]);

  const balloonPos = flightVisuals.balloonPos;

  // Visited trail segments in order
  const visitedSegments = useMemo(() => {
    const segs: string[] = [];
    for (let i = 0; i < visitedDestIds.length - 1; i++) {
      const a = destPositions[visitedDestIds[i]];
      const b = destPositions[visitedDestIds[i + 1]];
      if (a && b) {
        segs.push(getArcCurve(a, b).d);
      }
    }
    return segs;
  }, [visitedDestIds, destPositions]);

  // Deterministic 2D label collision avoidance + leader lines so nearby pins NEVER overlap on TV or tablet!
  const placedLabels = useMemo(() => {
    interface LabelBox {
      id: string;
      text: string;
      px: number;
      py: number;
      lx: number;
      ly: number;
      w: number;
      h: number;
      isHighlight: boolean;
    }

    const boxes: LabelBox[] = [];
    for (const dest of DESTINATIONS) {
      const pos = destPositions[dest.id];
      if (!pos) continue;
      const isCurrent = dest.id === currentDestId && !flyingToId;
      const isFlightTarget = dest.id === flyingToId;
      const isFlightOrigin = dest.id === flyingFromId && Boolean(flyingToId);
      const isRouteOption = routeSet.has(dest.id) && !flyingToId;
      const isHovered = hoveredRoute === dest.id;
      if (!(isRouteOption || isCurrent || isFlightTarget || isFlightOrigin || isHovered)) {
        continue;
      }
      const labelText =
        dest.name !== dest.country && dest.name.length + dest.country.length <= 22
          ? `${dest.name}, ${dest.country}`
          : dest.country;
      const w = Math.max(76, labelText.length * 6.4 + 26);
      const h = 23;
      const defaultDy = pos[1] < 95 ? 26 : -22;
      boxes.push({
        id: dest.id,
        text: labelText,
        px: pos[0],
        py: pos[1],
        lx: pos[0],
        ly: pos[1] + defaultDy,
        w,
        h,
        isHighlight: isRouteOption || isFlightTarget,
      });
    }

    // 18 relaxation passes gently push overlapping bubbles apart and away from pin anchors
    for (let iter = 0; iter < 18; iter++) {
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];
          const overlapX = (a.w + b.w) / 2 + 10 - Math.abs(a.lx - b.lx);
          const overlapY = (a.h + b.h) / 2 + 8 - Math.abs(a.ly - b.ly);
          if (overlapX > 0 && overlapY > 0) {
            if (overlapY <= overlapX * 0.85) {
              const push = overlapY / 2 + 1.5;
              if (a.ly <= b.ly) {
                a.ly -= push;
                b.ly += push;
              } else {
                a.ly += push;
                b.ly -= push;
              }
            } else {
              const push = overlapX / 2 + 1.5;
              if (a.lx <= b.lx) {
                a.lx -= push;
                b.lx += push;
              } else {
                a.lx += push;
                b.lx -= push;
              }
            }
          }
        }

        // Also keep labels from sitting directly on top of another visible pin
        const box = boxes[i];
        for (let k = 0; k < boxes.length; k++) {
          if (k === i) continue;
          const pin = boxes[k];
          const dx = box.lx - pin.px;
          const dy = box.ly - pin.py;
          if (Math.abs(dx) < box.w / 2 + 10 && Math.abs(dy) < box.h / 2 + 10) {
            box.ly += dy >= 0 ? 6 : -6;
          }
        }

        const halfW = box.w / 2;
        box.lx = Math.max(halfW + 18, Math.min(MAP_WIDTH - halfW - 18, box.lx));
        box.ly = Math.max(26, Math.min(MAP_HEIGHT - 26, box.ly));
      }
    }

    return boxes;
  }, [destPositions, currentDestId, flyingFromId, flyingToId, routeSet, hoveredRoute]);

  const basketAvatars = crewAvatars.slice(0, 4);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isTvMode ? '16px 24px 120px' : '10px',
      }}
    >
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        style={{
          width: '100%',
          height: '100%',
          maxHeight: '100%',
          maxWidth: '100%',
          overflow: 'visible',
          filter: 'drop-shadow(0 12px 28px rgba(21, 66, 73, 0.18))',
        }}
        role="img"
        aria-label="Interactive Storybook World Atlas"
      >
        <defs>
          <radialGradient id="atlasOceanGrad" cx="50%" cy="46%" r="58%">
            <stop offset="0%" stopColor="#D6EAEB" />
            <stop offset="70%" stopColor="#BCD8DC" />
            <stop offset="100%" stopColor="#9EC3CB" />
          </radialGradient>
          <filter id="landShadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.2" floodColor="#1F5A63" floodOpacity="0.22" />
          </filter>
          <clipPath id="atlasGlobeClip">
            <path d={spherePath} />
          </clipPath>
        </defs>

        {/* Cartographer Ocean Oval */}
        <path
          d={spherePath}
          fill="url(#atlasOceanGrad)"
          stroke="#2B231D"
          strokeWidth="2.2"
        />
        <path
          d={spherePath}
          fill="none"
          stroke="#FBF5E8"
          strokeWidth="1.2"
          strokeDasharray="6 5"
          opacity="0.7"
        />

        <g clipPath="url(#atlasGlobeClip)">
          {/* Subtle Latitude & Longitude Graticules */}
          <path
            d={graticulePath}
            fill="none"
            stroke="#1F5A63"
            strokeOpacity="0.14"
            strokeWidth="0.75"
          />

          {/* Equator Line */}
          <line
            x1="0"
            y1={projection([0, 0])?.[1] ?? 286}
            x2={MAP_WIDTH}
            y2={projection([0, 0])?.[1] ?? 286}
            stroke="#C88A2B"
            strokeOpacity="0.4"
            strokeWidth="1.2"
            strokeDasharray="6 6"
          />

          {/* Ocean Typography */}
          <g
            fontFamily="Fraunces, Georgia, serif"
            fontStyle="italic"
            fill="#1F5A63"
            opacity="0.48"
            fontSize="14"
            letterSpacing="0.16em"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            <text x="128" y="290">PACIFIC OCEAN</text>
            <text x="342" y="242">ATLANTIC</text>
            <text x="355" y="260">OCEAN</text>
            <text x="645" y="346">INDIAN OCEAN</text>
            <text x="415" y="458" fontSize="12">SOUTHERN OCEAN</text>
            <text x="430" y="64" fontSize="11">ARCTIC OCEAN</text>
          </g>

          {/* Stylized Botanical Continents */}
          <g filter="url(#landShadow)">
            {countries.map((feat, idx) => {
              const cont = getContinentForCountryId(feat.id);
              const d = pathGen(feat);
              if (!d) return null;
              return (
                <path
                  key={`${feat.id ?? idx}`}
                  d={d}
                  fill={CONTINENT_FILLS[cont]}
                  stroke="#5C4E43"
                  strokeOpacity="0.34"
                  strokeWidth="0.65"
                />
              );
            })}
          </g>

          {/* Previously Flown Expedition Trail */}
          {visitedSegments.map((seg, i) => (
            <path
              key={`trail-${i}`}
              d={seg}
              fill="none"
              stroke="#C88A2B"
              strokeWidth="2.8"
              strokeDasharray="6 6"
              strokeLinecap="round"
              opacity="0.78"
            />
          ))}

          {/* Gentle Drifting Storybook Clouds While Flying */}
          {flyingToId && (
            <g opacity="0.68" style={{ pointerEvents: 'none' }}>
              <path
                d="M170 140 C170 132 184 130 190 135 C196 127 214 130 216 138 C224 138 226 146 218 148 L174 148 C168 148 166 142 170 140 Z"
                fill="#FDF9F0"
                transform={`translate(${flightProgress * 58}, 0)`}
              />
              <path
                d="M670 176 C670 169 682 167 688 171 C694 164 710 167 712 174 C719 174 720 181 713 183 L674 183 C668 183 667 178 670 176 Z"
                fill="#FDF9F0"
                transform={`translate(${-flightProgress * 46}, 0)`}
              />
              <path
                d="M410 342 C410 335 422 333 428 337 C434 330 450 333 452 340 C459 340 460 347 453 349 L414 349 C408 349 407 344 410 342 Z"
                fill="#FDF9F0"
                transform={`translate(${flightProgress * 42}, 0)`}
              />
            </g>
          )}

          {/* Active Flight Arc (when flying) — Guide Dotted Line + Progressive Drawn Golden Wake */}
          {flyingFromId && flyingToId && destPositions[flyingFromId] && destPositions[flyingToId] && (
            <g>
              <path
                d={getArcCurve(destPositions[flyingFromId], destPositions[flyingToId]).d}
                fill="none"
                stroke="#C4533A"
                strokeOpacity="0.34"
                strokeWidth="2.8"
                strokeDasharray="6 7"
                strokeLinecap="round"
              />
              {flightVisuals.wakePolyline && (
                <polyline
                  points={flightVisuals.wakePolyline}
                  fill="none"
                  stroke="#C4533A"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {flightVisuals.puffs.map((puff, idx) => (
                <circle
                  key={`puff-${idx}`}
                  cx={puff.pt[0]}
                  cy={puff.pt[1]}
                  r={puff.r}
                  fill="#FDF9F0"
                  stroke="#C88A2B"
                  strokeWidth="1"
                  opacity={puff.opacity}
                />
              ))}
            </g>
          )}

          {/* Available Story Routes Radiating From Current Location */}
          {!flyingToId &&
            routeOptions.map((targetId) => {
              const targetPos = destPositions[targetId];
              const dest = DESTINATIONS_BY_ID[targetId];
              if (!targetPos || !dest) return null;
              const isHovered = hoveredRoute === targetId;
              const { d } = getArcCurve(currentPos, targetPos);
              return (
                <g
                  key={`route-${targetId}`}
                  style={{ cursor: interactive ? 'pointer' : 'default' }}
                  onMouseEnter={() => interactive && setHoveredRoute(targetId)}
                  onMouseLeave={() => setHoveredRoute(null)}
                  onClick={() => interactive && onSelectRoute?.(targetId)}
                >
                  {/* Wide transparent hit zone */}
                  <path d={d} fill="none" stroke="transparent" strokeWidth="18" />
                  <path
                    d={d}
                    fill="none"
                    stroke={isHovered ? '#C4533A' : '#B84A32'}
                    strokeWidth={isHovered ? '4' : '2.8'}
                    strokeDasharray="7 6"
                    strokeLinecap="round"
                    className="route-dash-animated"
                    opacity={isHovered ? 1 : 0.82}
                  />
                </g>
              );
            })}

          {/* All 210 World Destination Pins */}
          {DESTINATIONS.map((dest) => {
            const pos = destPositions[dest.id];
            if (!pos) return null;
            const isCurrent = dest.id === currentDestId && !flyingToId;
            const isFlightTarget = dest.id === flyingToId;
            const isFlightOrigin = dest.id === flyingFromId && Boolean(flyingToId);
            const isRouteOption = routeSet.has(dest.id) && !flyingToId;
            const isDiscovered = discoveredSet.has(dest.id);
            const isVisitedInMission = visitedSet.has(dest.id);
            const isHovered = hoveredRoute === dest.id;

            const canClick =
              interactive && (isRouteOption || Boolean(onSelectDestination));

            return (
              <g
                key={dest.id}
                transform={`translate(${pos[0]}, ${pos[1]})`}
                style={{ cursor: canClick ? 'pointer' : 'default' }}
                onMouseEnter={() => isRouteOption && setHoveredRoute(dest.id)}
                onMouseLeave={() => setHoveredRoute(null)}
                onClick={() => {
                  if (!interactive) return;
                  if (isRouteOption && onSelectRoute) {
                    onSelectRoute(dest.id);
                  } else if (onSelectDestination) {
                    onSelectDestination(dest.id);
                  }
                }}
              >
                {/* Pulsing Beacon for Route Options or Landing Destination */}
                {(isRouteOption || isFlightTarget) && (
                  <circle
                    r={isFlightTarget ? '16' : '13'}
                    fill="#C4533A"
                    opacity="0.38"
                    className="pin-pulse"
                  />
                )}

                {/* Pin Base */}
                <circle
                  r={
                    isFlightTarget
                      ? 9.5
                      : isRouteOption
                        ? isHovered
                          ? 10.5
                          : 8.5
                        : isCurrent || isFlightOrigin
                          ? 7.5
                          : isDiscovered
                            ? 3.8
                            : 2.1
                  }
                  fill={
                    isRouteOption || isFlightTarget
                      ? '#C4533A'
                      : isCurrent || isFlightOrigin
                        ? '#1F5A63'
                        : isDiscovered || isVisitedInMission
                          ? '#C88A2B'
                          : '#FBF5E8'
                  }
                  stroke="#2B231D"
                  strokeWidth={isRouteOption || isCurrent || isFlightTarget ? '2.1' : '0.85'}
                  opacity={isRouteOption || isCurrent || isFlightTarget || isDiscovered ? 1 : 0.65}
                />

                {/* Inner Star/Dot */}
                {(isRouteOption || isFlightTarget) && (
                  <circle r={3} fill="#FBF5E8" />
                )}
              </g>
            );
          })}

          {/* Collision-Free Label Pills with Leader Lines for Nearby Cities */}
          <g style={{ pointerEvents: 'none' }}>
            {placedLabels.map((box) => {
              const dist = Math.hypot(box.lx - box.px, box.ly - box.py);
              return (
                <g key={`label-${box.id}`}>
                  {dist > 25 && (
                    <line
                      x1={box.px}
                      y1={box.py}
                      x2={box.lx}
                      y2={box.ly}
                      stroke="#2B231D"
                      strokeWidth="1.35"
                      strokeDasharray="3 2.5"
                      opacity="0.78"
                    />
                  )}
                  <g transform={`translate(${box.lx}, ${box.ly})`}>
                    <rect
                      x={-box.w / 2}
                      y={-box.h / 2}
                      width={box.w}
                      height={box.h}
                      rx="11"
                      fill={box.isHighlight ? '#FDF9F0' : '#1F5A63'}
                      stroke="#2B231D"
                      strokeWidth="1.5"
                    />
                    <text
                      textAnchor="middle"
                      y="3.8"
                      fontFamily="Nunito, sans-serif"
                      fontWeight="800"
                      fontSize="10.8"
                      fill={box.isHighlight ? '#2B231D' : '#FDF9F0'}
                    >
                      {box.text}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* Crew's Striped Hot-Air Balloon with Tiny Crew Avatars Riding in the Basket! */}
          <g transform={`translate(${balloonPos[0]}, ${balloonPos[1] - 28})`}>
            <g transform={`rotate(${flightVisuals.swayDeg.toFixed(1)})`}>
              <g className="balloon-bob">
                {/* Soft ground shadow */}
                <ellipse
                  cx="0"
                  cy={flyingToId ? 34 : 28}
                  rx={flyingToId ? 8 : 10}
                  ry={flyingToId ? 2.8 : 3.6}
                  fill="#2B231D"
                  opacity={flyingToId ? 0.14 : 0.22}
                />
                {/* Balloon Envelope */}
                <path
                  d="M0 -24 C-12.5 -24 -18 -15 -18 -5 C-18 4 -10 9.5 -5.5 14 L5.5 14 C10 9.5 18 4 18 -5 C18 -15 12.5 -24 0 -24 Z"
                  fill="#C4533A"
                  stroke="#2B231D"
                  strokeWidth="2"
                />
                <path
                  d="M0 -24 C-6.5 -24 -10 -15 -10 -5 C-10 4 -5.5 9.5 -3 14 L3 14 C5.5 9.5 10 4 10 -5 C10 -15 6.5 -24 0 -24 Z"
                  fill="#FBF5E8"
                  stroke="#2B231D"
                  strokeWidth="1.6"
                />
                <path
                  d="M0 -24 C-2.2 -15 -2.8 -5 -1.6 14 L1.6 14 C2.8 -5 2.2 -15 0 -24 Z"
                  fill="#C88A2B"
                />
                {/* Basket Ropes */}
                <line x1="-5" y1="14" x2="-8" y2="21" stroke="#2B231D" strokeWidth="1.35" />
                <line x1="5" y1="14" x2="8" y2="21" stroke="#2B231D" strokeWidth="1.35" />
                {/* Tiny Crew Avatars Peeking Above Basket Rim! */}
                {basketAvatars.length > 0 && (
                  <g>
                    {basketAvatars.map((av, idx) => {
                      const spread = basketAvatars.length === 1 ? 0 : 8.5;
                      const xOff =
                        idx * spread - ((basketAvatars.length - 1) * spread) / 2 - 6;
                      return (
                        <AnimalAvatar
                          key={`balloon-av-${av}-${idx}`}
                          avatar={av}
                          size={12}
                          x={xOff}
                          y={11.5}
                        />
                      );
                    })}
                  </g>
                )}
                {/* Wicker Basket */}
                <rect
                  x={basketAvatars.length > 1 ? -11 : -7}
                  y="20.5"
                  width={basketAvatars.length > 1 ? 22 : 14}
                  height="6.5"
                  rx="2.2"
                  fill="#B67B3E"
                  stroke="#2B231D"
                  strokeWidth="1.6"
                />
                <line
                  x1={basketAvatars.length > 1 ? -9.5 : -5.5}
                  y1="23.8"
                  x2={basketAvatars.length > 1 ? 9.5 : 5.5}
                  y2="23.8"
                  stroke="#7D5024"
                  strokeWidth="1"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>

      {/* Ornate Compass Rose in Bottom-Left */}
      <div
        style={{
          position: 'absolute',
          left: isTvMode ? 32 : 16,
          bottom: isTvMode ? 128 : 14,
          pointerEvents: 'none',
          opacity: 0.92,
        }}
      >
        <CompassRose size={isTvMode ? 94 : 68} />
      </div>
    </div>
  );
}
