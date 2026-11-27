import { useMemo } from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import type {
  AvatarId,
  CityGeoBackdrop,
  CityLandmark,
  CityLayout,
  Destination,
  SpotRole,
} from '../types/game';
import { AnimalAvatar } from './art/AnimalAvatar';

interface CityOrientationMapProps {
  dest: Destination;
  layout: CityLayout;
  investigatedSpotIds: string[];
  crewAvatars: AvatarId[];
  activeSpotId?: string | null;
  lastVisitedSpotId?: string | null;
  isAtFinalTrailCity?: boolean;
  interactive?: boolean;
  compact?: boolean;
  onSelectSpot?: (spot: CityLandmark) => void;
}

const W = 480;
const H = 285;

const ROLE_COLORS: Record<SpotRole, { fill: string; ring: string }> = {
  harbor: { fill: '#1F5A63', ring: '#CFE3E5' },
  market: { fill: '#C88A2B', ring: '#F6E7C8' },
  archive: { fill: '#8B4A3B', ring: '#F4DFDA' },
  landmark: { fill: '#C4533A', ring: '#FAE2DC' },
  nature: { fill: '#467856', ring: '#DCECE1' },
};

function renderGeoBackdrop(backdrop: CityGeoBackdrop) {
  switch (backdrop) {
    case 'river-ew':
      return (
        <g>
          <path
            d="M -10 155 C 95 128, 175 182, 260 150 C 345 118, 410 165, 495 142 L 495 178 C 410 200, 345 154, 260 184 C 175 216, 95 162, -10 190 Z"
            fill="#B7D7DC"
            stroke="#598992"
            strokeWidth="1.5"
          />
          <path
            d="M 10 168 C 110 144, 185 194, 265 164 C 345 135, 415 178, 475 158"
            fill="none"
            stroke="#FDF9F0"
            strokeWidth="1.2"
            strokeDasharray="8 8"
            opacity="0.7"
          />
        </g>
      );
    case 'river-ns':
      return (
        <g>
          <path
            d="M 225 -10 C 200 70, 265 135, 232 200 C 212 242, 235 270, 224 295 L 266 295 C 276 268, 254 242, 272 200 C 304 134, 240 68, 266 -10 Z"
            fill="#B7D7DC"
            stroke="#598992"
            strokeWidth="1.5"
          />
          <path
            d="M 245 0 C 222 72, 282 135, 250 202 C 234 240, 252 268, 244 290"
            fill="none"
            stroke="#FDF9F0"
            strokeWidth="1.2"
            strokeDasharray="7 8"
            opacity="0.7"
          />
        </g>
      );
    case 'coast-south':
      return (
        <g>
          <path
            d="M -10 222 C 95 204, 180 236, 285 214 C 365 198, 425 224, 495 210 L 495 295 L -10 295 Z"
            fill="#B7D7DC"
            stroke="#598992"
            strokeWidth="1.5"
          />
          <path
            d="M 20 250 Q 65 244 110 250 M 220 258 Q 270 252 320 258 M 380 248 Q 425 242 465 248"
            fill="none"
            stroke="#FDF9F0"
            strokeWidth="1.3"
            opacity="0.7"
          />
        </g>
      );
    case 'coast-north':
      return (
        <g>
          <path
            d="M -10 -10 L 495 -10 L 495 66 C 415 80, 345 50, 250 68 C 165 84, 85 52, -10 70 Z"
            fill="#B7D7DC"
            stroke="#598992"
            strokeWidth="1.5"
          />
          <path
            d="M 40 34 Q 90 28 140 34 M 270 38 Q 320 32 370 38"
            fill="none"
            stroke="#FDF9F0"
            strokeWidth="1.3"
            opacity="0.7"
          />
        </g>
      );
    case 'coast-west':
      return (
        <g>
          <path
            d="M -10 -10 L 106 -10 C 86 78, 128 148, 92 222 C 82 252, 96 276, 102 295 L -10 295 Z"
            fill="#B7D7DC"
            stroke="#598992"
            strokeWidth="1.5"
          />
          <path
            d="M 24 85 Q 52 80 76 85 M 22 195 Q 52 190 78 195"
            fill="none"
            stroke="#FDF9F0"
            strokeWidth="1.3"
            opacity="0.7"
          />
        </g>
      );
    case 'coast-east':
      return (
        <g>
          <path
            d="M 382 -10 L 495 -10 L 495 295 L 382 295 C 396 232, 356 168, 392 92 C 402 52, 386 18, 382 -10 Z"
            fill="#B7D7DC"
            stroke="#598992"
            strokeWidth="1.5"
          />
          <path
            d="M 404 95 Q 434 90 462 95 M 404 205 Q 434 200 462 205"
            fill="none"
            stroke="#FDF9F0"
            strokeWidth="1.3"
            opacity="0.7"
          />
        </g>
      );
    case 'harbor-bay':
      return (
        <g>
          <path
            d="M -10 198 C 90 185, 165 210, 245 190 C 315 172, 352 146, 396 154 C 435 162, 458 190, 495 184 L 495 295 L -10 295 Z"
            fill="#B7D7DC"
            stroke="#598992"
            strokeWidth="1.5"
          />
          <path
            d="M 60 245 Q 115 238 170 245 M 310 232 Q 365 225 420 232"
            fill="none"
            stroke="#FDF9F0"
            strokeWidth="1.3"
            opacity="0.7"
          />
        </g>
      );
    case 'island':
      return (
        <g>
          <rect x="0" y="0" width={W} height={H} fill="#BBD9DE" />
          <path
            d="M 62 72 C 115 26, 215 24, 315 36 C 395 45, 444 96, 434 166 C 425 232, 342 262, 232 258 C 122 254, 48 220, 44 150 C 42 114, 48 86, 62 72 Z"
            fill="#F4E7CE"
            stroke="#598992"
            strokeWidth="2"
          />
          <path
            d="M 52 68 C 108 18, 218 16, 322 28 C 406 38, 456 92, 444 168 C 434 240, 348 272, 230 268 C 114 264, 38 226, 34 150 C 32 110, 38 82, 52 68 Z"
            fill="none"
            stroke="#FDF9F0"
            strokeWidth="1.4"
            strokeDasharray="6 6"
            opacity="0.7"
          />
        </g>
      );
    case 'mountains-north':
      return (
        <g opacity="0.75">
          <path
            d="M 15 62 L 62 18 L 104 62 Z M 82 66 L 146 12 L 204 66 Z M 184 62 L 246 18 L 306 62 Z M 292 64 L 356 14 L 418 64 Z M 392 60 L 442 20 L 478 60 Z"
            fill="#D8C8AE"
            stroke="#8A765F"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M 52 28 L 62 18 L 72 28 Z M 134 24 L 146 12 L 158 24 Z M 344 26 L 356 14 L 368 26 Z"
            fill="#FDF9F0"
          />
        </g>
      );
    case 'desert-oasis':
      return (
        <g>
          <path
            d="M -10 218 Q 110 188 235 215 T 495 204 L 495 295 L -10 295 Z"
            fill="#EBD4A7"
            opacity="0.65"
          />
          <path
            d="M -10 72 Q 125 46 260 70 T 495 58 L 495 -10 L -10 -10 Z"
            fill="#EBD4A7"
            opacity="0.52"
          />
          <ellipse
            cx="240"
            cy="145"
            rx="54"
            ry="22"
            fill="#B7D7DC"
            stroke="#6C997B"
            strokeWidth="3"
            opacity="0.75"
          />
        </g>
      );
    case 'glacier-fjord':
      return (
        <g>
          <path
            d="M -10 -10 L 495 -10 L 495 82 C 425 96, 365 60, 295 82 C 258 94, 240 158, 205 162 C 165 166, 152 104, 108 82 C 58 58, 22 92, -10 78 Z"
            fill="#C7E1E8"
            stroke="#6E9AA6"
            strokeWidth="1.6"
          />
          <path
            d="M 28 248 L 88 214 L 145 248 Z M 352 252 L 414 212 L 468 252 Z"
            fill="#EAF4F7"
            stroke="#8BAFB9"
            strokeWidth="1.3"
          />
        </g>
      );
    case 'rainforest-river':
      return (
        <g>
          <circle cx="48" cy="48" r="34" fill="#CBE0C6" opacity="0.62" />
          <circle cx="96" cy="36" r="26" fill="#BFD8BA" opacity="0.56" />
          <circle cx="428" cy="236" r="38" fill="#CBE0C6" opacity="0.62" />
          <circle cx="384" cy="252" r="28" fill="#BFD8BA" opacity="0.55" />
          <path
            d="M -10 194 C 110 170, 185 110, 280 132 C 365 152, 415 95, 495 104 L 495 138 C 412 128, 360 184, 272 166 C 180 146, 110 205, -10 228 Z"
            fill="#AED2D6"
            stroke="#598992"
            strokeWidth="1.5"
          />
        </g>
      );
  }
}

export function CityOrientationMap({
  dest,
  layout,
  investigatedSpotIds,
  crewAvatars,
  activeSpotId = null,
  lastVisitedSpotId = null,
  isAtFinalTrailCity = false,
  interactive = true,
  compact = false,
  onSelectSpot,
}: CityOrientationMapProps) {
  const investigatedSet = useMemo(
    () => new Set(investigatedSpotIds),
    [investigatedSpotIds]
  );

  // Convert normalized 0..100 coordinates to SVG viewport coordinates
  const points = useMemo(
    () =>
      layout.landmarks.map((spot) => ({
        spot,
        px: Math.round((spot.x / 100) * W),
        py: Math.round((spot.y / 100) * H),
      })),
    [layout.landmarks]
  );

  // Deterministic collision-free label placement for the 5 real landmarks
  const placedLabels = useMemo(() => {
    const boxes = points.map((p) => {
      const shortName =
        p.spot.name.length > 21 ? `${p.spot.name.slice(0, 19)}…` : p.spot.name;
      const w = Math.max(66, shortName.length * 5.6 + 18);
      const h = 19;
      const preferBelow = p.py < 60;
      return {
        id: p.spot.id,
        shortName,
        px: p.px,
        py: p.py,
        lx: p.px,
        ly: preferBelow ? p.py + 22 : p.py - 20,
        w,
        h,
      };
    });

    for (let iter = 0; iter < 14; iter++) {
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];
          const overlapX = (a.w + b.w) / 2 + 6 - Math.abs(a.lx - b.lx);
          const overlapY = (a.h + b.h) / 2 + 4 - Math.abs(a.ly - b.ly);
          if (overlapX > 0 && overlapY > 0) {
            if (overlapY <= overlapX) {
              const push = overlapY / 2 + 1;
              if (a.ly <= b.ly) {
                a.ly -= push;
                b.ly += push;
              } else {
                a.ly += push;
                b.ly -= push;
              }
            } else {
              const push = overlapX / 2 + 1;
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
        // Clamp inside safe city-map frame (leave top-right corner clear for Compass Rose)
        const box = boxes[i];
        const halfW = box.w / 2;
        box.lx = Math.max(halfW + 8, Math.min(W - halfW - 8, box.lx));
        box.ly = Math.max(20, Math.min(H - 16, box.ly));
      }
    }

    return Object.fromEntries(boxes.map((b) => [b.id, b]));
  }, [points]);

  // Where the family crew is currently standing on the city map!
  const crewAnchor = useMemo(() => {
    const targetId =
      activeSpotId ?? lastVisitedSpotId ?? layout.landmarks[0]?.id ?? null;
    const found = points.find((p) => p.spot.id === targetId) ?? points[0];
    return found ? { x: found.px, y: found.py } : { x: W / 2, y: H / 2 };
  }, [activeSpotId, lastVisitedSpotId, layout.landmarks, points]);

  // Culprit shadow peeking at an unvisited spot when we reach the final city!
  const culpritPeekAnchor = useMemo(() => {
    if (!isAtFinalTrailCity) return null;
    const unvisited = points.find((p) => !investigatedSet.has(p.spot.id));
    return unvisited ?? points[points.length - 1] ?? null;
  }, [isAtFinalTrailCity, points, investigatedSet]);

  // Connect landmarks in a gentle storybook walking loop
  const roadPath = useMemo(() => {
    if (points.length < 2) return '';
    return points
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.px} ${p.py}`)
      .join(' ');
  }, [points]);

  const googleMapsCityUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${dest.name}, ${dest.country}`
  )}`;

  const shownAvatars = crewAvatars.slice(0, 4);

  return (
    <div className={`city-map-card ${compact ? 'compact' : ''}`}>
      <div className="city-map-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <MapPin size={15} color="var(--terracotta)" style={{ flexShrink: 0 }} />
          <span className="stamp-label" style={{ color: 'var(--mariner-dark)', fontSize: '0.7rem' }}>
            {dest.name.toUpperCase()} CITY ORIENTATION MAP • 5 REAL STOPS
          </span>
        </div>
        {interactive && (
          <a
            href={googleMapsCityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="city-gmaps-link"
            title={`Explore ${dest.name} in Google Maps`}
          >
            Google Maps <ExternalLink size={12} />
          </a>
        )}
      </div>

      <div className="city-map-svg-wrap">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          role="img"
          aria-label={`Illustrated orientation map of ${dest.name}, ${dest.country} with 5 real landmarks`}
        >
          {/* Warm Parchment Base */}
          <rect x="0" y="0" width={W} height={H} fill="#F5E9D0" />

          {/* Subtle Cartographer Street / Lat-Lon Grid */}
          <g stroke="#B89E74" strokeOpacity="0.22" strokeWidth="0.8">
            {[60, 120, 180, 240, 300, 360, 420].map((gx) => (
              <line key={`gx-${gx}`} x1={gx} y1="0" x2={gx} y2={H} />
            ))}
            {[55, 110, 165, 220].map((gy) => (
              <line key={`gy-${gy}`} x1="0" y1={gy} x2={W} y2={gy} />
            ))}
          </g>

          {/* Real City Geographic Backdrop */}
          {renderGeoBackdrop(layout.backdrop)}

          {/* Water / Geography Label */}
          {(layout.waterLabel || layout.featureLabel) && (
            <text
              x={layout.backdrop === 'coast-east' ? 425 : layout.backdrop === 'coast-west' ? 54 : 240}
              y={
                layout.backdrop === 'coast-north' || layout.backdrop === 'mountains-north'
                  ? 34
                  : layout.backdrop === 'coast-south' || layout.backdrop === 'harbor-bay'
                    ? 268
                    : 162
              }
              textAnchor="middle"
              fontFamily="Fraunces, Georgia, serif"
              fontStyle="italic"
              fontSize="11.5"
              letterSpacing="0.08em"
              fill="#1F5A63"
              opacity="0.62"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {(layout.waterLabel ?? layout.featureLabel ?? '').toUpperCase()}
            </text>
          )}

          {/* Storybook Walking Trail Between the 5 Landmarks */}
          <path
            d={roadPath}
            fill="none"
            stroke="#8B6F4E"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
          />
          <path
            d={roadPath}
            fill="none"
            stroke="#5E4833"
            strokeWidth="1.6"
            strokeDasharray="5 5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />

          {/* Mini Compass Rose (Top-Right Corner) */}
          <g transform="translate(448, 32)" style={{ pointerEvents: 'none' }}>
            <circle cx="0" cy="0" r="19" fill="#FDF9F0" fillOpacity="0.9" stroke="#2B231D" strokeWidth="1.3" />
            <path d="M0 -13 L3.2 -2 L0 -5 L-3.2 -2 Z" fill="#C4533A" />
            <path d="M0 13 L3.2 2 L0 5 L-3.2 2 Z" fill="#2B231D" opacity="0.55" />
            <path d="M-13 0 L-2 -3.2 L-5 0 L-2 3.2 Z" fill="#2B231D" opacity="0.55" />
            <path d="M13 0 L2 -3.2 L5 0 L2 3.2 Z" fill="#2B231D" opacity="0.55" />
            <text
              x="0"
              y="-14.5"
              textAnchor="middle"
              fontFamily="Special Elite, serif"
              fontSize="7.5"
              fontWeight="700"
              fill="#C4533A"
            >
              N
            </text>
          </g>

          {/* Leader Lines for Shifted Landmark Labels */}
          {points.map(({ spot, px, py }) => {
            const box = placedLabels[spot.id];
            if (!box) return null;
            const dist = Math.hypot(box.lx - px, box.ly - py);
            if (dist < 24) return null;
            return (
              <line
                key={`leader-${spot.id}`}
                x1={px}
                y1={py}
                x2={box.lx}
                y2={box.ly}
                stroke="#2B231D"
                strokeWidth="1.2"
                strokeDasharray="2 2"
                opacity="0.7"
              />
            );
          })}

          {/* 5 Real Confirmed Landmark Pins */}
          {points.map(({ spot, px, py }, idx) => {
            const visited = investigatedSet.has(spot.id);
            const isActive = activeSpotId === spot.id;
            const palette = ROLE_COLORS[spot.role];
            const clickable = interactive && !visited && Boolean(onSelectSpot);

            return (
              <g
                key={spot.id}
                transform={`translate(${px}, ${py})`}
                style={{ cursor: clickable ? 'pointer' : 'default' }}
                onClick={() => clickable && onSelectSpot?.(spot)}
              >
                {isActive && (
                  <circle r="16" fill="#C4533A" opacity="0.34" className="pin-pulse" />
                )}
                <circle
                  r={visited ? 9.5 : 11}
                  fill={visited ? '#467856' : palette.fill}
                  stroke="#FDF9F0"
                  strokeWidth="2.4"
                />
                <circle
                  r={visited ? 10.6 : 12.1}
                  fill="none"
                  stroke="#2B231D"
                  strokeWidth="1.2"
                />
                {visited ? (
                  <path
                    d="M -4 0.5 L -1 3.5 L 4.5 -3"
                    fill="none"
                    stroke="#FDF9F0"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <text
                    y="3.8"
                    textAnchor="middle"
                    fontFamily="Nunito, sans-serif"
                    fontWeight="900"
                    fontSize="10.5"
                    fill="#FDF9F0"
                  >
                    {idx + 1}
                  </text>
                )}
              </g>
            );
          })}

          {/* Culprit Shadow Marker on Final Hideout City */}
          {culpritPeekAnchor && (
            <g
              transform={`translate(${Math.min(W - 24, culpritPeekAnchor.px + 22)}, ${Math.max(26, culpritPeekAnchor.py - 16)})`}
              style={{ pointerEvents: 'none' }}
            >
              <circle r="13" fill="#C4533A" opacity="0.26" className="pin-pulse" />
              <circle r="10.5" fill="#2B231D" stroke="#F6DFB1" strokeWidth="1.6" />
              <ellipse cx="0" cy="-2" rx="7.5" ry="2" fill="#14100E" stroke="#C88A2B" strokeWidth="0.9" />
              <path d="M-4.5 -2.5 L-3.2 -7.5 L3.2 -7.5 L4.5 -2.5 Z" fill="#14100E" />
              <circle cx="-2.4" cy="2" r="1.2" fill="#F6DFB1" />
              <circle cx="2.4" cy="2" r="1.2" fill="#F6DFB1" />
            </g>
          )}

          {/* Landmark Labels (Collision-Free Bubbles) */}
          {points.map(({ spot }) => {
            const box = placedLabels[spot.id];
            if (!box) return null;
            const visited = investigatedSet.has(spot.id);
            const clickable = interactive && !visited && Boolean(onSelectSpot);
            return (
              <g
                key={`lbl-${spot.id}`}
                transform={`translate(${box.lx}, ${box.ly})`}
                style={{ cursor: clickable ? 'pointer' : 'default' }}
                onClick={() => clickable && onSelectSpot?.(spot)}
              >
                <rect
                  x={-box.w / 2}
                  y={-box.h / 2}
                  width={box.w}
                  height={box.h}
                  rx="9"
                  fill={visited ? '#E8F2EB' : '#FDF9F0'}
                  stroke={visited ? '#467856' : '#2B231D'}
                  strokeWidth="1.25"
                />
                <text
                  textAnchor="middle"
                  y="3.5"
                  fontFamily="Nunito, sans-serif"
                  fontWeight="800"
                  fontSize="9.3"
                  fill={visited ? '#2B5138' : '#2B231D'}
                >
                  {box.shortName}
                </text>
              </g>
            );
          })}

          {/* Crew Avatars Strolling Together Around the City! */}
          <g
            style={{
              transform: `translate(${Math.min(W - 44, Math.max(24, crewAnchor.x + 14))}px, ${Math.min(H - 26, Math.max(24, crewAnchor.y + 4))}px)`,
              transition: 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
              pointerEvents: 'none',
            }}
          >
            {shownAvatars.map((avatar, idx) => (
              <g
                key={`crew-city-${avatar}-${idx}`}
                transform={`translate(${idx * 14 - ((shownAvatars.length - 1) * 14) / 2 - 11}, -11)`}
              >
                <AnimalAvatar avatar={avatar} size={22} />
              </g>
            ))}
          </g>

          {/* Subtle Double Ink Inner Border */}
          <rect
            x="2"
            y="2"
            width={W - 4}
            height={H - 4}
            fill="none"
            stroke="#2B231D"
            strokeOpacity="0.28"
            strokeWidth="1.5"
            rx="6"
          />
        </svg>
      </div>
    </div>
  );
}
