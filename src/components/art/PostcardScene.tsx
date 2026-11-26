import type { Destination } from '../../types/game';
import { AnimalAvatar } from './AnimalAvatar';

interface PostcardSceneProps {
  destination: Destination;
  compact?: boolean;
}

export function PostcardScene({ destination, compact = false }: PostcardSceneProps) {
  const { postcard, animalAvatar } = destination;
  const gradId = `sky-${destination.id}`;
  const ink = '#2B231D';

  return (
    <div
      className="postcard-art-box"
      style={{
        background: `linear-gradient(180deg, ${postcard.skyTop} 0%, ${postcard.skyBottom} 100%)`,
      }}
    >
      <svg
        viewBox="0 0 320 200"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`Illustrated postcard of ${destination.name}`}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={postcard.skyTop} />
            <stop offset="100%" stopColor={postcard.skyBottom} />
          </linearGradient>
        </defs>

        <rect width="320" height="200" fill={`url(#${gradId})`} />

        {/* Storybook Sun or Moon */}
        {postcard.sceneType === 'aurora-pines' ||
        postcard.sceneType === 'sahara-dunes' ||
        postcard.sceneType === 'fjord-stars' ? (
          <g>
            <circle cx="264" cy="42" r="16" fill="#FBF1D5" opacity="0.92" />
            <circle cx="48" cy="30" r="2" fill="#FFF" opacity="0.85" />
            <circle cx="96" cy="22" r="1.6" fill="#FFF" opacity="0.8" />
            <circle cx="152" cy="36" r="2.2" fill="#FFF" opacity="0.9" />
            <circle cx="212" cy="26" r="1.8" fill="#FFF" opacity="0.8" />
            <circle cx="184" cy="52" r="1.5" fill="#FFF" opacity="0.7" />
          </g>
        ) : (
          <g>
            <circle cx="256" cy="44" r="24" fill="#FBF0C9" opacity="0.88" />
            <circle cx="256" cy="44" r="32" fill="#FBF0C9" opacity="0.25" />
            {/* Soft storybook clouds */}
            <path
              d="M36 52 C36 44 48 42 54 46 C60 39 76 41 78 49 C86 49 88 58 80 60 L40 60 C34 60 32 54 36 52 Z"
              fill="#FBF7EE"
              opacity="0.78"
            />
            <path
              d="M150 36 C150 30 160 28 166 32 C171 26 184 28 186 35 C192 35 194 42 186 44 L154 44 C148 44 147 38 150 36 Z"
              fill="#FBF7EE"
              opacity="0.65"
            />
          </g>
        )}

        {/* Scene-Specific Landmarks & Biomes */}
        {postcard.sceneType === 'pyramids-nile' && (
          <g>
            <path d="M0 148 Q160 135 320 148 L320 200 L0 200 Z" fill="#E4BA78" />
            <polygon points="78,154 146,66 212,154" fill="#D59E56" stroke={ink} strokeWidth="2" />
            <polygon points="146,66 212,154 166,154" fill="#BA823F" />
            <polygon points="184,158 232,96 280,158" fill="#DFAD65" stroke={ink} strokeWidth="1.8" />
            <path d="M0 168 Q120 154 220 172 T320 166 L320 200 L0 200 Z" fill="#4B8FA1" opacity="0.85" />
          </g>
        )}

        {postcard.sceneType === 'geyser-viking' && (
          <g>
            <polygon points="0,150 68,86 135,150" fill="#7D99A1" stroke={ink} strokeWidth="1.8" />
            <polygon points="48,105 68,86 88,105" fill="#FBF7EE" />
            <polygon points="185,152 252,78 320,152" fill="#6F8C96" stroke={ink} strokeWidth="1.8" />
            <polygon points="234,98 252,78 272,98" fill="#FBF7EE" />
            {/* Steaming Geyser */}
            <path d="M150 152 Q144 102 156 64 Q168 102 162 152 Z" fill="#FBF7EE" opacity="0.88" />
            <circle cx="156" cy="58" r="14" fill="#FBF7EE" opacity="0.82" />
            <rect x="0" y="148" width="320" height="52" fill="#3C7383" />
            {/* Tiny Viking Longship */}
            <path d="M84 166 Q116 176 146 164 L140 156 Q114 164 90 156 Z" fill="#8C5332" stroke={ink} strokeWidth="1.6" />
            <rect x="108" y="138" width="16" height="18" fill="#C4533A" stroke={ink} strokeWidth="1.4" />
          </g>
        )}

        {postcard.sceneType === 'volcano-bay' && (
          <g>
            <polygon points="100,152 190,66 286,152" fill="#7C776B" stroke={ink} strokeWidth="2" />
            <path d="M174 82 L190 66 L206 82 Q190 88 174 82 Z" fill="#5A534B" />
            <circle cx="196" cy="54" r="10" fill="#FBF7EE" opacity="0.7" />
            <circle cx="208" cy="43" r="13" fill="#FBF7EE" opacity="0.55" />
            <rect x="0" y="148" width="320" height="52" fill="#3B839B" />
            {/* Colorful Coastal Houses */}
            <rect x="26" y="124" width="28" height="28" fill="#E89E68" stroke={ink} strokeWidth="1.6" />
            <rect x="54" y="116" width="26" height="36" fill="#F6DFB1" stroke={ink} strokeWidth="1.6" />
            <rect x="80" y="128" width="24" height="24" fill="#D57359" stroke={ink} strokeWidth="1.6" />
          </g>
        )}

        {postcard.sceneType === 'parthenon' && (
          <g>
            <path d="M0 156 Q160 120 320 156 L320 200 L0 200 Z" fill="#B9A686" stroke={ink} strokeWidth="1.8" />
            {/* Temple */}
            <polygon points="86,98 160,72 234,98" fill="#F5ECD9" stroke={ink} strokeWidth="2" />
            <rect x="92" y="98" width="136" height="8" fill="#E8DAC0" stroke={ink} strokeWidth="1.6" />
            {[102, 122, 142, 162, 182, 202, 218].map((x) => (
              <rect key={x} x={x} y="106" width="8" height="36" fill="#FBF6EA" stroke={ink} strokeWidth="1.5" />
            ))}
            <rect x="86" y="142" width="148" height="8" fill="#E5D5B7" stroke={ink} strokeWidth="1.6" />
            <rect x="0" y="172" width="320" height="28" fill="#3D87A0" />
          </g>
        )}

        {postcard.sceneType === 'alps-peaks' && (
          <g>
            <polygon points="10,164 92,64 176,164" fill="#7D96A3" stroke={ink} strokeWidth="2" />
            <polygon points="62,100 92,64 122,100 105,94 92,106 78,94" fill="#FBF8F0" />
            <polygon points="132,164 218,54 306,164" fill="#688494" stroke={ink} strokeWidth="2" />
            <polygon points="184,96 218,54 252,96 232,88 218,103 200,90" fill="#FBF8F0" />
            <path d="M0 154 Q160 134 320 154 L320 200 L0 200 Z" fill="#6F9B6E" />
            {/* Red Alpine Train */}
            <rect x="96" y="156" width="42" height="14" rx="3" fill="#C4533A" stroke={ink} strokeWidth="1.6" />
            <rect x="142" y="156" width="38" height="14" rx="3" fill="#C4533A" stroke={ink} strokeWidth="1.6" />
          </g>
        )}

        {postcard.sceneType === 'savanna-acacia' && (
          <g>
            <path d="M0 144 Q160 132 320 146 L320 200 L0 200 Z" fill="#D4A351" />
            <path d="M0 168 Q160 158 320 170 L320 200 L0 200 Z" fill="#BC873A" />
            {/* Iconic Acacia Tree */}
            <path d="M188 154 L188 106 M188 122 L156 106 M188 120 L220 104" stroke="#4D3728" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="188" cy="100" rx="58" ry="13" fill="#5D7D47" stroke={ink} strokeWidth="1.8" />
          </g>
        )}

        {postcard.sceneType === 'baobab-island' && (
          <g>
            <rect x="0" y="152" width="320" height="48" fill="#C78A57" />
            {/* Giant Baobab Trees */}
            {[92, 186].map((x) => (
              <g key={x}>
                <path d={`M${x - 16} 164 C${x - 14} 118 ${x - 12} 96 ${x - 10} 82 L${x + 10} 82 C${x + 12} 96 ${x + 14} 118 ${x + 16} 164 Z`} fill="#8E6040" stroke={ink} strokeWidth="2" />
                <path d={`M${x - 8} 84 L${x - 24} 66 M${x} 82 L${x} 62 M${x + 8} 84 L${x + 26} 68`} stroke="#8E6040" strokeWidth="4" strokeLinecap="round" />
                <circle cx={x - 22} cy="64" r="10" fill="#5A8350" />
                <circle cx={x} cy="60" r="12" fill="#69925B" />
                <circle cx={x + 24} cy="66" r="10" fill="#5A8350" />
              </g>
            ))}
          </g>
        )}

        {postcard.sceneType === 'sahara-dunes' && (
          <g>
            <path d="M0 132 Q80 96 170 132 T320 124 L320 200 L0 200 Z" fill="#D98B4C" stroke={ink} strokeWidth="1.6" />
            <path d="M0 156 Q110 126 224 162 T320 150 L320 200 L0 200 Z" fill="#E7A766" stroke={ink} strokeWidth="1.6" />
            <path d="M0 176 Q140 160 320 182 L320 200 L0 200 Z" fill="#C9773E" />
          </g>
        )}

        {postcard.sceneType === 'bamboo-wall' && (
          <g>
            <path d="M0 140 Q90 88 180 128 T320 112 L320 200 L0 200 Z" fill="#6E9470" />
            {/* Winding Great Wall */}
            <path d="M56 122 Q132 102 212 134 T306 108" stroke="#E9DEC4" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M56 122 Q132 102 212 134 T306 108" stroke={ink} strokeWidth="1.6" strokeDasharray="6 6" fill="none" />
            {/* Bamboo Stalks */}
            {[24, 42, 282, 298].map((x) => (
              <line key={x} x1={x} y1="200" x2={x} y2="62" stroke="#3F6E4A" strokeWidth="6" strokeDasharray="24 4" />
            ))}
          </g>
        )}

        {postcard.sceneType === 'fuji-pagoda' && (
          <g>
            {/* Mount Fuji */}
            <polygon points="72,158 176,66 280,158" fill="#5D7D94" stroke={ink} strokeWidth="2" />
            <polygon points="145,94 176,66 207,94 190,89 176,99 162,89" fill="#FBF7EE" />
            <rect x="0" y="156" width="320" height="44" fill="#6A9AA8" />
            {/* Red Pagoda */}
            <rect x="52" y="102" width="24" height="54" fill="#FBF3E4" stroke={ink} strokeWidth="1.6" />
            <polygon points="40,104 64,90 88,104" fill="#C4533A" stroke={ink} strokeWidth="1.6" />
            <polygon points="42,122 64,110 86,122" fill="#C4533A" stroke={ink} strokeWidth="1.6" />
            <polygon points="44,140 64,128 84,140" fill="#C4533A" stroke={ink} strokeWidth="1.6" />
            {/* Floating Cherry Petals */}
            <circle cx="116" cy="84" r="3" fill="#F7B7C2" />
            <circle cx="138" cy="112" r="2.6" fill="#F7B7C2" />
            <circle cx="242" cy="96" r="3" fill="#F7B7C2" />
          </g>
        )}

        {postcard.sceneType === 'monsoon-palace' && (
          <g>
            <rect x="0" y="156" width="320" height="44" fill="#4D8E9B" />
            {/* Marble Palace / Taj Dome */}
            <rect x="106" y="114" width="108" height="44" fill="#FBF5E8" stroke={ink} strokeWidth="1.8" />
            <path d="M132 114 C132 76 188 76 188 114 Z" fill="#FBF5E8" stroke={ink} strokeWidth="2" />
            <path d="M148 158 L148 132 Q160 120 172 132 L172 158 Z" fill="#C88A2B" opacity="0.7" />
            <rect x="86" y="96" width="10" height="62" fill="#FBF5E8" stroke={ink} strokeWidth="1.5" />
            <rect x="224" y="96" width="10" height="62" fill="#FBF5E8" stroke={ink} strokeWidth="1.5" />
          </g>
        )}

        {postcard.sceneType === 'himalaya-peaks' && (
          <g>
            <polygon points="0,168 96,62 192,168" fill="#658296" stroke={ink} strokeWidth="2" />
            <polygon points="104,168 206,46 312,168" fill="#516F85" stroke={ink} strokeWidth="2" />
            <polygon points="168,90 206,46 246,90 226,82 206,96 186,82" fill="#FBF9F4" />
            <polygon points="64,98 96,62 128,98 110,92 96,102 82,92" fill="#FBF9F4" />
            {/* Prayer flags */}
            <path d="M14 134 Q160 156 306 126" stroke={ink} strokeWidth="1.6" fill="none" />
            {[60, 100, 140, 180, 220, 260].map((x, idx) => (
              <rect
                key={x}
                x={x}
                y={136 + (idx % 2) * 3}
                width="14"
                height="16"
                fill={['#3B7EA1', '#FBF5E8', '#C4533A', '#467856', '#D99B38'][idx % 5]}
                stroke={ink}
                strokeWidth="1.2"
              />
            ))}
          </g>
        )}

        {postcard.sceneType === 'borneo-canopy' && (
          <g>
            <rect x="0" y="138" width="320" height="62" fill="#3B6E4C" />
            {[40, 105, 175, 245, 295].map((x, i) => (
              <g key={x}>
                <rect x={x - 7} y="106" width="14" height="94" fill="#6E4B32" />
                <circle cx={x} cy={98 + (i % 2) * 10} r="36" fill={i % 2 === 0 ? '#4B8258' : '#5D9566'} stroke={ink} strokeWidth="1.6" />
              </g>
            ))}
          </g>
        )}

        {postcard.sceneType === 'coral-reef' && (
          <g>
            <rect x="0" y="96" width="320" height="104" fill="#3E94A8" />
            <path d="M0 100 Q40 90 80 100 T160 100 T240 100 T320 100" stroke="#FBF7EE" strokeWidth="3" fill="none" opacity="0.6" />
            {/* Coral branches */}
            <path d="M62 200 L62 150 M62 172 L46 156 M62 166 L78 152" stroke="#D96B52" strokeWidth="8" strokeLinecap="round" />
            <path d="M230 200 L230 144 M230 166 L212 148 M230 162 L248 148" stroke="#E8A24A" strokeWidth="8" strokeLinecap="round" />
            <circle cx="152" cy="144" r="6" fill="#F5A64A" stroke={ink} strokeWidth="1.4" />
            <circle cx="176" cy="158" r="5" fill="#F5A64A" stroke={ink} strokeWidth="1.4" />
          </g>
        )}

        {postcard.sceneType === 'uluru-outback' && (
          <g>
            <rect x="0" y="146" width="320" height="54" fill="#D58A52" />
            {/* Giant Red Uluru Monolith */}
            <path d="M64 152 L88 94 Q160 82 234 94 L256 152 Z" fill="#B94E33" stroke={ink} strokeWidth="2.2" />
            <path d="M116 96 L110 150 M162 92 L160 150 M208 96 L216 150" stroke="#8C3620" strokeWidth="2" opacity="0.5" />
          </g>
        )}

        {postcard.sceneType === 'fjord-stars' && (
          <g>
            <polygon points="0,152 0,72 126,152" fill="#466F6B" stroke={ink} strokeWidth="2" />
            <polygon points="320,152 320,66 196,152" fill="#3B625F" stroke={ink} strokeWidth="2" />
            <rect x="0" y="150" width="320" height="50" fill="#2A6375" />
            <path d="M126 150 Q160 162 196 150" stroke="#B5DFE6" strokeWidth="2" fill="none" />
          </g>
        )}

        {postcard.sceneType === 'pacific-volcano' && (
          <g>
            <polygon points="94,154 176,74 264,154" fill="#4E7858" stroke={ink} strokeWidth="2" />
            <path d="M164 86 Q176 76 188 86" stroke="#E06238" strokeWidth="5" strokeLinecap="round" fill="none" />
            <rect x="0" y="150" width="320" height="50" fill="#2D83A0" />
            <path d="M0 166 Q40 156 80 166 T160 166 T240 166 T320 166" stroke="#FBF7EE" strokeWidth="2.4" fill="none" opacity="0.65" />
          </g>
        )}

        {postcard.sceneType === 'maya-jungle' && (
          <g>
            <rect x="0" y="146" width="320" height="54" fill="#467856" />
            {/* Stepped Pyramid */}
            <rect x="96" y="132" width="128" height="20" fill="#D9C59B" stroke={ink} strokeWidth="1.8" />
            <rect x="112" y="112" width="96" height="20" fill="#E3D1AB" stroke={ink} strokeWidth="1.8" />
            <rect x="128" y="92" width="64" height="20" fill="#D9C59B" stroke={ink} strokeWidth="1.8" />
            <rect x="144" y="76" width="32" height="16" fill="#EDE0C2" stroke={ink} strokeWidth="1.8" />
            <rect x="150" y="92" width="20" height="60" fill="#C4AD82" stroke={ink} strokeWidth="1.4" />
          </g>
        )}

        {postcard.sceneType === 'red-canyon' && (
          <g>
            <path d="M0 112 L92 112 L114 148 L208 148 L228 106 L320 106 L320 200 L0 200 Z" fill="#C96442" stroke={ink} strokeWidth="2" />
            <path d="M0 132 L102 132 M218 126 L320 126" stroke="#E69E68" strokeWidth="6" />
            <path d="M132 148 Q160 174 148 200 L180 200 Q188 174 176 148 Z" fill="#3B879E" />
          </g>
        )}

        {postcard.sceneType === 'aurora-pines' && (
          <g>
            {/* Aurora Ribbon */}
            <path d="M0 78 Q90 36 176 74 T320 52" stroke="#7AE5B8" strokeWidth="20" strokeLinecap="round" fill="none" opacity="0.45" />
            <path d="M14 90 Q106 46 196 86 T320 66" stroke="#A6F2D4" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.55" />
            <polygon points="0,164 88,98 176,164" fill="#325263" />
            <polygon points="148,164 236,92 320,164" fill="#2A4656" />
            <rect x="0" y="156" width="320" height="44" fill="#234B54" />
            {/* Pines */}
            {[28, 56, 266, 294].map((x) => (
              <polygon key={x} points={`${x},118 ${x - 16},162 ${x + 16},162`} fill="#2C5A46" stroke={ink} strokeWidth="1.4" />
            ))}
          </g>
        )}

        {postcard.sceneType === 'amazon-river' && (
          <g>
            <rect x="0" y="128" width="320" height="72" fill="#467856" />
            <path d="M90 128 Q186 144 128 168 T216 200 L120 200 Q60 172 110 152 Q126 140 62 128 Z" fill="#3F8D9E" />
            {[36, 94, 248, 296].map((x) => (
              <circle key={x} cx={x} cy="122" r="32" fill="#3A6B49" stroke={ink} strokeWidth="1.5" />
            ))}
          </g>
        )}

        {postcard.sceneType === 'andes-citadel' && (
          <g>
            <polygon points="154,158 228,58 308,158" fill="#527D5E" stroke={ink} strokeWidth="2" />
            <path d="M0 154 Q96 112 200 154 L200 200 L0 200 Z" fill="#6A9466" stroke={ink} strokeWidth="1.8" />
            {/* Terraces */}
            <path d="M36 148 L156 148 M28 162 L166 162 M20 176 L176 176" stroke="#D9C59E" strokeWidth="4" />
            <rect x="78" y="122" width="22" height="16" fill="#E6D8BA" stroke={ink} strokeWidth="1.5" />
            <rect x="106" y="118" width="24" height="20" fill="#E6D8BA" stroke={ink} strokeWidth="1.5" />
          </g>
        )}

        {postcard.sceneType === 'tortoise-isle' && (
          <g>
            <rect x="0" y="142" width="320" height="58" fill="#398DA2" />
            <path d="M56 150 Q148 92 246 150 Z" fill="#6F8C58" stroke={ink} strokeWidth="2" />
            <ellipse cx="152" cy="150" rx="108" ry="12" fill="#E3CCA0" />
          </g>
        )}

        {postcard.sceneType === 'patagonia-fossils' && (
          <g>
            <polygon points="56,156 96,60 132,156" fill="#7D8891" stroke={ink} strokeWidth="2" />
            <polygon points="116,156 152,48 186,156" fill="#6A7782" stroke={ink} strokeWidth="2" />
            <polygon points="172,156 206,68 242,156" fill="#7D8891" stroke={ink} strokeWidth="2" />
            <rect x="0" y="152" width="320" height="48" fill="#C9A87C" />
            <path d="M0 154 Q80 144 160 156 L160 200 L0 200 Z" fill="#6CA9BD" opacity="0.85" />
          </g>
        )}

        {postcard.sceneType === 'antarctic-ice' && (
          <g>
            <rect x="0" y="138" width="320" height="62" fill="#3A7891" />
            {/* Icebergs */}
            <polygon points="28,154 72,88 128,108 152,154" fill="#F2F9FA" stroke={ink} strokeWidth="1.8" />
            <polygon points="196,158 232,96 296,112 312,158" fill="#E1F0F4" stroke={ink} strokeWidth="1.8" />
            <path d="M0 166 Q160 154 320 168 L320 200 L0 200 Z" fill="#F8FCFD" stroke={ink} strokeWidth="1.6" />
          </g>
        )}

        {/* Vintage Postcard Corner Frame Line */}
        <rect
          x="7"
          y="7"
          width="306"
          height="186"
          rx="6"
          fill="none"
          stroke="#FBF5E8"
          strokeOpacity="0.68"
          strokeWidth="1.6"
        />
      </svg>

      {/* Cute Native Animal Peeking in the Corner */}
      <div
        style={{
          position: 'absolute',
          bottom: compact ? 6 : 10,
          right: compact ? 6 : 10,
          filter: 'drop-shadow(0 3px 6px rgba(43,35,29,0.28))',
        }}
      >
        <AnimalAvatar avatar={animalAvatar} size={compact ? 42 : 56} />
      </div>

      {/* Location Ribbon */}
      {!compact && (
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            background: 'rgba(253, 249, 240, 0.92)',
            border: '1.5px solid rgba(43, 35, 29, 0.3)',
            borderRadius: 10,
            padding: '4px 10px',
            fontFamily: 'var(--font-stamp)',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--ink)',
            letterSpacing: '0.04em',
          }}
        >
          {destination.country.toUpperCase()} • {destination.latLabel}
        </div>
      )}
    </div>
  );
}
