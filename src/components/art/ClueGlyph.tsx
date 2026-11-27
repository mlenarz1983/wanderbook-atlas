import type { ClueIconKind } from '../../types/game';

interface ClueGlyphProps {
  kind: ClueIconKind;
  size?: number;
}

/**
 * Spartan, minimalist SVG clue symbols for instant visual scanning on tablet & TV.
 */
export function ClueGlyph({ kind, size = 22 }: ClueGlyphProps) {
  const ink = '#2B231D';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {kind === 'flag' && (
        <g>
          <line x1="5" y1="3" x2="5" y2="21" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          <path
            d="M5 4.5 L19 4.5 L16 9.5 L19 14.5 L5 14.5 Z"
            fill="#C4533A"
            stroke={ink}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <circle cx="10.5" cy="9.5" r="1.6" fill="#FDF9F0" />
        </g>
      )}

      {kind === 'currency' && (
        <g>
          <circle cx="12" cy="12" r="9" fill="#E9C46A" stroke={ink} strokeWidth="1.8" />
          <circle cx="12" cy="12" r="5.8" fill="none" stroke={ink} strokeWidth="1.1" strokeDasharray="2 2" />
          <path d="M12 7.5 V16.5 M9.8 10 C9.8 8.8 14.2 8.8 14.2 10.5 C14.2 12 9.8 12 9.8 13.8 C9.8 15.2 14.2 15.2 14.2 13.8" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}

      {kind === 'geography' && (
        <g>
          <circle cx="12" cy="12" r="9" fill="#D4EAEC" stroke={ink} strokeWidth="1.8" />
          <polygon points="12,5 14.5,12 12,10.5 9.5,12" fill="#C4533A" />
          <polygon points="12,19 14.5,12 12,13.5 9.5,12" fill="#1F5A63" />
          <circle cx="12" cy="12" r="1.4" fill={ink} />
        </g>
      )}

      {kind === 'landmark' && (
        <g>
          <polygon points="12,3.5 3.5,8.5 20.5,8.5" fill="#C88A2B" stroke={ink} strokeWidth="1.7" strokeLinejoin="round" />
          <line x1="6.5" y1="8.5" x2="6.5" y2="17.5" stroke={ink} strokeWidth="2" />
          <line x1="12" y1="8.5" x2="12" y2="17.5" stroke={ink} strokeWidth="2" />
          <line x1="17.5" y1="8.5" x2="17.5" y2="17.5" stroke={ink} strokeWidth="2" />
          <rect x="3.5" y="17.5" width="17" height="3" rx="1" fill="#EBD7B4" stroke={ink} strokeWidth="1.6" />
        </g>
      )}

      {kind === 'food' && (
        <g>
          <path d="M4 12.5 H20 C19.5 17 16.2 19.5 12 19.5 C7.8 19.5 4.5 17 4 12.5 Z" fill="#D98A4E" stroke={ink} strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M8.5 9 C8.5 7.2 9.8 7 9.8 5.2 M12 9 C12 7.2 13.3 7 13.3 5.2 M15.5 9 C15.5 7.2 16.8 7 16.8 5.2" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}

      {kind === 'wildlife' && (
        <g>
          <circle cx="7.5" cy="8.5" r="2.1" fill="#467856" stroke={ink} strokeWidth="1.4" />
          <circle cx="12" cy="6.8" r="2.1" fill="#467856" stroke={ink} strokeWidth="1.4" />
          <circle cx="16.5" cy="8.5" r="2.1" fill="#467856" stroke={ink} strokeWidth="1.4" />
          <path d="M7 15.5 C7 12.5 9.2 11 12 11 C14.8 11 17 12.5 17 15.5 C17 18 14.8 19.2 12 19.2 C9.2 19.2 7 18 7 15.5 Z" fill="#467856" stroke={ink} strokeWidth="1.6" />
        </g>
      )}

      {kind === 'era' && (
        <g>
          <line x1="6" y1="3.5" x2="18" y2="3.5" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          <line x1="6" y1="20.5" x2="18" y2="20.5" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          <path
            d="M7.5 3.5 C7.5 8.5 10.5 10.5 12 12 C13.5 10.5 16.5 8.5 16.5 3.5 Z"
            fill="#F2D08A"
            stroke={ink}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M7.5 20.5 C7.5 15.5 10.5 13.5 12 12 C13.5 13.5 16.5 15.5 16.5 20.5 Z"
            fill="#C4533A"
            stroke={ink}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </g>
      )}

      {kind === 'suspect' && (
        <g>
          <ellipse cx="12" cy="14" rx="9" ry="2.6" fill="#2B231D" />
          <path d="M6.5 13.5 L8.2 6.5 C10 5.8 14 5.8 15.8 6.5 L17.5 13.5 Z" fill="#2B231D" stroke="#C88A2B" strokeWidth="1.2" />
          <rect x="7.5" y="10.8" width="9" height="1.8" fill="#C4533A" />
          <circle cx="9.8" cy="18.2" r="1.3" fill={ink} />
          <circle cx="14.2" cy="18.2" r="1.3" fill={ink} />
        </g>
      )}
    </svg>
  );
}
