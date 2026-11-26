import type { SouvenirIconId } from '../../types/game';

interface SouvenirArtProps {
  id: SouvenirIconId;
  size?: number;
}

export function SouvenirArt({ id, size = 48 }: SouvenirArtProps) {
  const ink = '#2B231D';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {/* Vintage Enamel Pin Medallion */}
      <circle cx="32" cy="32" r="29" fill="#FBF5E8" stroke={ink} strokeWidth="2.2" />
      <circle cx="32" cy="32" r="24.5" fill="#F3E7CF" stroke="#C88A2B" strokeWidth="1.2" strokeDasharray="3 2.5" />

      {id === 'viking-compass' && (
        <g>
          <polygon points="32,12 48,32 32,52 16,32" fill="#89B4C4" stroke={ink} strokeWidth="2" />
          <polygon points="32,19 41,32 32,45 23,32" fill="#D4ECF2" stroke={ink} strokeWidth="1.4" />
          <circle cx="32" cy="32" r="3" fill="#C4533A" />
        </g>
      )}

      {id === 'pizza-peel' && (
        <g>
          <rect x="29.5" y="42" width="5" height="13" rx="2" fill="#B57B42" stroke={ink} strokeWidth="1.8" />
          <circle cx="32" cy="29" r="15" fill="#D9A45B" stroke={ink} strokeWidth="2" />
          <circle cx="32" cy="29" r="11.5" fill="#C85037" />
          <circle cx="32" cy="29" r="9.5" fill="#F6D77E" />
          <circle cx="28" cy="26" r="2.2" fill="#C4533A" />
          <circle cx="36" cy="27" r="2.2" fill="#C4533A" />
          <circle cx="32" cy="33" r="2.2" fill="#C4533A" />
          <ellipse cx="32" cy="28" rx="3" ry="1.6" transform="rotate(-25 32 28)" fill="#467856" />
        </g>
      )}

      {id === 'olive-wreath' && (
        <g>
          <path d="M22 46 C14 36 16 20 28 15" stroke="#467856" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M42 46 C50 36 48 20 36 15" stroke="#467856" strokeWidth="2.8" strokeLinecap="round" />
          <ellipse cx="18" cy="32" rx="5" ry="2.6" transform="rotate(-35 18 32)" fill="#C88A2B" stroke={ink} strokeWidth="1.4" />
          <ellipse cx="22" cy="21" rx="5" ry="2.6" transform="rotate(-10 22 21)" fill="#C88A2B" stroke={ink} strokeWidth="1.4" />
          <ellipse cx="46" cy="32" rx="5" ry="2.6" transform="rotate(35 46 32)" fill="#C88A2B" stroke={ink} strokeWidth="1.4" />
          <ellipse cx="42" cy="21" rx="5" ry="2.6" transform="rotate(10 42 21)" fill="#C88A2B" stroke={ink} strokeWidth="1.4" />
          <circle cx="32" cy="46" r="3.5" fill="#C4533A" stroke={ink} strokeWidth="1.5" />
        </g>
      )}

      {id === 'alpine-bell' && (
        <g>
          <rect x="24" y="14" width="16" height="6" rx="3" fill="#C4533A" stroke={ink} strokeWidth="1.8" />
          <path d="M20 20 L44 20 L48 44 L16 44 Z" fill="#D9A03C" stroke={ink} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="32" cy="46" r="4" fill="#8C5E1C" stroke={ink} strokeWidth="1.8" />
          <path d="M26 30 L38 30 M32 25 L32 35" stroke="#FBF5E8" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      )}

      {id === 'scarab' && (
        <g>
          <ellipse cx="32" cy="34" rx="11" ry="14" fill="#2A7B88" stroke={ink} strokeWidth="2" />
          <line x1="32" y1="22" x2="32" y2="48" stroke={ink} strokeWidth="1.8" />
          <circle cx="32" cy="18" r="5" fill="#D99B38" stroke={ink} strokeWidth="1.8" />
          <path d="M21 28 L15 24 M21 36 L14 38 M43 28 L49 24 M43 36 L50 38" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {id === 'savanna-drum' && (
        <g>
          <path d="M20 18 L44 18 L39 34 L43 48 L21 48 L25 34 Z" fill="#C47436" stroke={ink} strokeWidth="2" strokeLinejoin="round" />
          <ellipse cx="32" cy="18" rx="12" ry="4" fill="#F6E5C6" stroke={ink} strokeWidth="2" />
          <path d="M22 22 L28 32 L32 22 L36 32 L42 22" stroke={ink} strokeWidth="1.6" />
        </g>
      )}

      {id === 'baobab-pod' && (
        <g>
          <path d="M32 14 C23 18 20 34 25 46 C28 50 36 50 39 46 C44 34 41 18 32 14 Z" fill="#8D613C" stroke={ink} strokeWidth="2" />
          <path d="M28 24 C27 32 28 40 30 45 M36 24 C37 32 36 40 34 45" stroke="#D9B78C" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M32 14 C34 10 39 10 41 13" stroke="#467856" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      )}

      {id === 'star-lantern' && (
        <g>
          <path d="M24 22 L40 22 L44 40 L32 49 L20 40 Z" fill="#E39D3B" stroke={ink} strokeWidth="2" strokeLinejoin="round" />
          <polygon points="32,26 34.5,32 41,32 36,36 38,42 32,38.5 26,42 28,36 23,32 29.5,32" fill="#FFF7DF" stroke={ink} strokeWidth="1.3" />
          <path d="M27 22 Q32 14 37 22" stroke={ink} strokeWidth="2" />
        </g>
      )}

      {id === 'silk-kite' && (
        <g>
          <polygon points="32,12 47,29 32,45 17,29" fill="#C4533A" stroke={ink} strokeWidth="2" />
          <line x1="32" y1="12" x2="32" y2="45" stroke="#FBF5E8" strokeWidth="1.8" />
          <line x1="17" y1="29" x2="47" y2="29" stroke="#FBF5E8" strokeWidth="1.8" />
          <path d="M32 45 Q38 51 30 55" stroke={ink} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="32" cy="29" r="3.2" fill="#E9B44C" stroke={ink} strokeWidth="1.4" />
        </g>
      )}

      {id === 'origami-crane' && (
        <g>
          <polygon points="14,31 32,25 50,20 38,37 26,37" fill="#E8B24B" stroke={ink} strokeWidth="1.9" strokeLinejoin="round" />
          <polygon points="26,37 32,16 38,37" fill="#F7D47A" stroke={ink} strokeWidth="1.9" strokeLinejoin="round" />
          <polygon points="14,31 19,25 23,33" fill="#D49532" stroke={ink} strokeWidth="1.7" />
        </g>
      )}

      {id === 'zero-tablet' && (
        <g>
          <rect x="18" y="15" width="28" height="34" rx="5" fill="#D9B684" stroke={ink} strokeWidth="2" />
          <ellipse cx="32" cy="32" rx="8" ry="11" stroke="#C4533A" strokeWidth="3.6" />
          <circle cx="24" cy="21" r="1.5" fill={ink} />
          <circle cx="40" cy="43" r="1.5" fill={ink} />
        </g>
      )}

      {id === 'prayer-flags' && (
        <g>
          <path d="M12 22 Q32 30 52 22" stroke={ink} strokeWidth="2" />
          <rect x="15" y="23" width="8" height="11" fill="#3B7EA1" stroke={ink} strokeWidth="1.4" />
          <rect x="24" y="25" width="8" height="11" fill="#FBF5E8" stroke={ink} strokeWidth="1.4" />
          <rect x="33" y="25" width="8" height="11" fill="#C4533A" stroke={ink} strokeWidth="1.4" />
          <rect x="42" y="23" width="8" height="11" fill="#467856" stroke={ink} strokeWidth="1.4" />
        </g>
      )}

      {id === 'spice-compass' && (
        <g>
          <circle cx="32" cy="32" r="14" fill="#D99B38" stroke={ink} strokeWidth="2" />
          <circle cx="32" cy="32" r="10.5" fill="#FBF5E8" stroke={ink} strokeWidth="1.4" />
          <polygon points="32,22 35,32 32,34 29,32" fill="#C4533A" />
          <polygon points="32,42 35,32 32,30 29,32" fill="#1F5A63" />
        </g>
      )}

      {id === 'coral-shell' && (
        <g>
          <path d="M16 38 C16 22 23 15 32 15 C41 15 48 22 48 38 C44 44 38 47 32 47 C26 47 20 44 16 38 Z" fill="#E68B73" stroke={ink} strokeWidth="2" />
          <path d="M32 47 L32 16 M32 47 L23 20 M32 47 L41 20" stroke="#FBF5E8" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      )}

      {id === 'boomerang' && (
        <g>
          <path d="M17 42 C18 27 28 17 45 17 C48 17 49 22 45 23 C33 24 26 31 24 43 C23 47 17 46 17 42 Z" fill="#C4533A" stroke={ink} strokeWidth="2" />
          <circle cx="29" cy="28" r="2" fill="#FBF5E8" />
          <circle cx="35" cy="23" r="2" fill="#E9B44C" />
          <circle cx="24" cy="35" r="2" fill="#E9B44C" />
        </g>
      )}

      {id === 'star-chart' && (
        <g>
          <circle cx="32" cy="32" r="15" fill="#1F5A63" stroke={ink} strokeWidth="2" />
          <path d="M22 36 L30 25 L41 28 L35 40" stroke="#E9B44C" strokeWidth="1.8" strokeDasharray="2 2" />
          <circle cx="22" cy="36" r="2.3" fill="#FFF7DF" />
          <circle cx="30" cy="25" r="2.8" fill="#FFF7DF" />
          <circle cx="41" cy="28" r="2.3" fill="#FFF7DF" />
          <circle cx="35" cy="40" r="2.1" fill="#FFF7DF" />
        </g>
      )}

      {id === 'lava-stone' && (
        <g>
          <path d="M18 39 C16 29 22 19 33 18 C43 18 48 27 46 38 C44 45 22 46 18 39 Z" fill="#474240" stroke={ink} strokeWidth="2" />
          <path d="M24 31 Q31 27 38 32" stroke="#E36D3B" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="29" cy="37" r="2" fill="#E9A243" />
        </g>
      )}

      {id === 'cacao-pod' && (
        <g>
          <ellipse cx="32" cy="33" rx="11" ry="15" fill="#8C4B2D" stroke={ink} strokeWidth="2" />
          <path d="M27 20 C24 28 24 38 27 46 M37 20 C40 28 40 38 37 46 M32 18 L32 48" stroke="#D99B58" strokeWidth="1.6" />
          <path d="M32 18 L35 13" stroke="#467856" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      )}

      {id === 'canyon-feather' && (
        <g>
          <path d="M20 46 C22 28 32 16 46 15 C45 30 35 41 20 46 Z" fill="#C4533A" stroke={ink} strokeWidth="2" />
          <path d="M20 46 L42 19" stroke="#FBF5E8" strokeWidth="2" strokeLinecap="round" />
          <path d="M30 24 L37 29 M25 32 L32 37" stroke="#E9B44C" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {id === 'aurora-crystal' && (
        <g>
          <polygon points="32,12 42,27 37,49 27,49 22,27" fill="#6BB8A6" stroke={ink} strokeWidth="2" strokeLinejoin="round" />
          <polygon points="32,12 37,27 32,49 27,27" fill="#B5E6D8" opacity="0.8" />
        </g>
      )}

      {id === 'river-paddle' && (
        <g>
          <line x1="17" y1="47" x2="36" y2="28" stroke="#8C5934" strokeWidth="3.8" strokeLinecap="round" />
          <path d="M32 25 C38 17 45 14 48 17 C51 20 48 27 40 33 L32 25 Z" fill="#C4533A" stroke={ink} strokeWidth="2" />
          <path d="M38 22 L43 27" stroke="#FBF5E8" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {id === 'inca-quipu' && (
        <g>
          <path d="M16 22 Q32 17 48 22" stroke="#8C5934" strokeWidth="3" strokeLinecap="round" />
          <line x1="22" y1="22" x2="22" y2="45" stroke="#C4533A" strokeWidth="2.4" />
          <line x1="32" y1="20" x2="32" y2="48" stroke="#1F5A63" strokeWidth="2.4" />
          <line x1="42" y1="22" x2="42" y2="44" stroke="#C88A2B" strokeWidth="2.4" />
          <circle cx="22" cy="34" r="3" fill="#C4533A" stroke={ink} strokeWidth="1.3" />
          <circle cx="32" cy="30" r="3" fill="#1F5A63" stroke={ink} strokeWidth="1.3" />
          <circle cx="32" cy="40" r="3" fill="#1F5A63" stroke={ink} strokeWidth="1.3" />
          <circle cx="42" cy="35" r="3" fill="#C88A2B" stroke={ink} strokeWidth="1.3" />
        </g>
      )}

      {id === 'spyglass' && (
        <g>
          <path d="M16 40 L26 30 L32 36 L22 46 Z" fill="#B57B42" stroke={ink} strokeWidth="2" />
          <path d="M26 30 L38 18 L45 25 L33 37 Z" fill="#D9A03C" stroke={ink} strokeWidth="2" />
          <ellipse cx="42.5" cy="20.5" rx="4.5" ry="2.6" transform="rotate(45 42.5 20.5)" fill="#9AD0DE" stroke={ink} strokeWidth="1.8" />
        </g>
      )}

      {id === 'dino-tooth' && (
        <g>
          <path d="M23 16 C35 16 44 26 42 48 C34 42 25 32 23 16 Z" fill="#EFE4CC" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M29 22 C33 26 36 33 37 40" stroke="#B6A382" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      )}

      {id === 'sled-bell' && (
        <g>
          <circle cx="32" cy="34" r="13" fill="#D9A03C" stroke={ink} strokeWidth="2" />
          <path d="M22 36 L42 36" stroke={ink} strokeWidth="2.2" />
          <circle cx="26" cy="36" r="2.2" fill={ink} />
          <circle cx="38" cy="36" r="2.2" fill={ink} />
          <path d="M27 21 Q32 14 37 21" stroke="#C4533A" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
