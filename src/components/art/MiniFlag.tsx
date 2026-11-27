import { getUsStateMeta } from '../../data/destinations/usStatesMeta';
import type { Destination } from '../../types/game';

interface MiniFlagProps {
  dest: Destination;
  width?: number;
  className?: string;
}

type FlagLayout =
  | 'h-tri'
  | 'v-tri'
  | 'nordic'
  | 'sun-disc'
  | 'swiss-cross'
  | 'canton-stripes'
  | 'canada-pale'
  | 'brazil-diamond'
  | 'saltire'
  | 'us-state'
  | 'chevron';

function detectFlagLayout(dest: Destination): FlagLayout {
  const us = getUsStateMeta(dest.id);
  if (us) return 'us-state';

  const desc = dest.flagDescription.toLowerCase();
  const c = dest.country.toLowerCase();

  if (c.includes('japan') || c.includes('bangladesh') || c.includes('palau') || c.includes('laos')) {
    return 'sun-disc';
  }
  if (c.includes('switzerland')) return 'swiss-cross';
  if (c.includes('canada') || c.includes('peru') || c.includes('guatemala')) return 'canada-pale';
  if (c.includes('brazil')) return 'brazil-diamond';
  if (
    c.includes('iceland') ||
    c.includes('norway') ||
    c.includes('sweden') ||
    c.includes('denmark') ||
    c.includes('finland') ||
    c.includes('faroe')
  ) {
    return 'nordic';
  }
  if (c.includes('scotland') || c.includes('jamaica') || c.includes('united kingdom')) {
    return 'saltire';
  }
  if (
    c.includes('united states') ||
    c.includes('greece') ||
    c.includes('malaysia') ||
    c.includes('chile') ||
    c.includes('uruguay') ||
    c.includes('liberia') ||
    c.includes('togo') ||
    c.includes('australia') ||
    c.includes('new zealand') ||
    c.includes('fiji')
  ) {
    return 'canton-stripes';
  }
  if (
    c.includes('cuba') ||
    c.includes('czech') ||
    c.includes('philippines') ||
    c.includes('jordan') ||
    c.includes('south africa') ||
    c.includes('bahamas') ||
    c.includes('zimbabwe') ||
    c.includes('mozambique') ||
    c.includes('sudan') ||
    c.includes('djibouti') ||
    desc.includes('triangle') ||
    desc.includes('chevron')
  ) {
    return 'chevron';
  }
  if (
    c.includes('france') ||
    c.includes('italy') ||
    c.includes('ireland') ||
    c.includes('belgium') ||
    c.includes('mexico') ||
    c.includes('romania') ||
    c.includes('nigeria') ||
    c.includes('senegal') ||
    c.includes('cameroon') ||
    c.includes('mali') ||
    c.includes('guinea') ||
    c.includes('ivory') ||
    c.includes('chad') ||
    c.includes('mongolia') ||
    c.includes('portugal') ||
    c.includes('malta') ||
    desc.includes('vertical')
  ) {
    return 'v-tri';
  }
  return 'h-tri';
}

/**
 * Spartan, heirloom-styled miniature SVG flag for every country & all 50 US states.
 */
export function MiniFlag({ dest, width = 30, className = '' }: MiniFlagProps) {
  const height = Math.round(width * 0.68);
  const [c1, c2, c3] = dest.flagColors;
  const layout = detectFlagLayout(dest);
  const us = getUsStateMeta(dest.id);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 24"
      className={className}
      aria-label={`Flag of ${us ? us.stateName : dest.country}`}
      style={{
        flexShrink: 0,
        borderRadius: 3,
        boxShadow: '0 1px 3px rgba(43, 35, 29, 0.24)',
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
    >
      {layout === 'us-state' && us && (
        <g>
          <rect width="36" height="24" fill={c1} />
          <rect x="0" y="0" width="36" height="4.5" fill={c2} opacity="0.92" />
          <rect x="0" y="19.5" width="36" height="4.5" fill={c3} opacity="0.92" />
          <circle
            cx="18"
            cy="12"
            r="6.8"
            fill="#FDF9F0"
            stroke="#2B231D"
            strokeWidth="0.9"
          />
          <text
            x="18"
            y="14.7"
            textAnchor="middle"
            fontFamily="Nunito, sans-serif"
            fontWeight="900"
            fontSize="7.4"
            fill="#2B231D"
          >
            {us.code}
          </text>
        </g>
      )}

      {layout === 'h-tri' && (
        <g>
          <rect x="0" y="0" width="36" height="8" fill={c1} />
          <rect x="0" y="8" width="36" height="8" fill={c2} />
          <rect x="0" y="16" width="36" height="8" fill={c3} />
        </g>
      )}

      {layout === 'v-tri' && (
        <g>
          <rect x="0" y="0" width="12" height="24" fill={c1} />
          <rect x="12" y="0" width="12" height="24" fill={c2} />
          <rect x="24" y="0" width="12" height="24" fill={c3} />
        </g>
      )}

      {layout === 'nordic' && (
        <g>
          <rect width="36" height="24" fill={c1} />
          <rect x="10" y="0" width="5.5" height="24" fill={c2} />
          <rect x="0" y="9.2" width="36" height="5.5" fill={c2} />
          <rect x="11.4" y="0" width="2.7" height="24" fill={c3} />
          <rect x="0" y="10.6" width="36" height="2.7" fill={c3} />
        </g>
      )}

      {layout === 'sun-disc' && (
        <g>
          <rect width="36" height="24" fill={c1} />
          <circle cx="18" cy="12" r="6" fill={c2} />
        </g>
      )}

      {layout === 'swiss-cross' && (
        <g>
          <rect width="36" height="24" fill={c1} />
          <rect x="15" y="5" width="6" height="14" fill={c2} />
          <rect x="11" y="9" width="14" height="6" fill={c2} />
        </g>
      )}

      {layout === 'canada-pale' && (
        <g>
          <rect x="0" y="0" width="9" height="24" fill={c1} />
          <rect x="9" y="0" width="18" height="24" fill={c2} />
          <rect x="27" y="0" width="9" height="24" fill={c1} />
          <circle cx="18" cy="12" r="3.4" fill={c3} />
        </g>
      )}

      {layout === 'brazil-diamond' && (
        <g>
          <rect width="36" height="24" fill={c1} />
          <polygon points="18,3 32,12 18,21 4,12" fill={c2} />
          <circle cx="18" cy="12" r="4.5" fill={c3} />
        </g>
      )}

      {layout === 'saltire' && (
        <g>
          <rect width="36" height="24" fill={c1} />
          <path d="M0 0 L36 24 M36 0 L0 24" stroke={c2} strokeWidth="4.2" />
          <path d="M18 0 L18 24 M0 12 L36 12" stroke={c3} strokeWidth="2.8" />
        </g>
      )}

      {layout === 'canton-stripes' && (
        <g>
          <rect width="36" height="24" fill={c2} />
          <rect x="0" y="0" width="36" height="4" fill={c1} />
          <rect x="0" y="8" width="36" height="4" fill={c1} />
          <rect x="0" y="16" width="36" height="4" fill={c1} />
          <rect x="0" y="0" width="16" height="13" fill={c3} />
          <circle cx="5" cy="4.5" r="1.2" fill="#FFFFFF" />
          <circle cx="11" cy="4.5" r="1.2" fill="#FFFFFF" />
          <circle cx="8" cy="8.8" r="1.2" fill="#FFFFFF" />
        </g>
      )}

      {layout === 'chevron' && (
        <g>
          <rect x="0" y="0" width="36" height="12" fill={c1} />
          <rect x="0" y="12" width="36" height="12" fill={c2} />
          <polygon points="0,0 16,12 0,24" fill={c3} />
        </g>
      )}

      {/* Subtle Heirloom Ink Frame */}
      <rect
        x="0.6"
        y="0.6"
        width="34.8"
        height="22.8"
        rx="2.2"
        fill="none"
        stroke="#2B231D"
        strokeOpacity="0.45"
        strokeWidth="1.2"
      />
    </svg>
  );
}
