import type { AvatarId } from '../../types/game';

interface AnimalAvatarProps {
  avatar: AvatarId;
  size?: number;
  className?: string;
}

export function AnimalAvatar({ avatar, size = 48, className = '' }: AnimalAvatarProps) {
  const ink = '#2B231D';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {/* Medallion Backdrop */}
      <circle
        cx="32"
        cy="32"
        r="30"
        fill={
          avatar === 'fox'
            ? '#F6E7CF'
            : avatar === 'otter'
              ? '#D9ECEE'
              : avatar === 'panda'
                ? '#E2EFE4'
                : avatar === 'owl'
                  ? '#EFE7D8'
                  : avatar === 'turtle'
                    ? '#D4EAEC'
                    : avatar === 'puffin'
                      ? '#DCEAEF'
                      : avatar === 'alpaca'
                        ? '#F4E8D8'
                        : '#F9E8C8'
        }
        stroke={ink}
        strokeWidth="2.4"
      />

      {avatar === 'fox' && (
        <g>
          {/* Ears */}
          <path d="M16 30 L14 12 L27 22 Z" fill="#D4643B" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M48 30 L50 12 L37 22 Z" fill="#D4643B" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M17.5 25 L16.8 16.5 L23.5 22 Z" fill="#FBF3E4" />
          <path d="M46.5 25 L47.2 16.5 L40.5 22 Z" fill="#FBF3E4" />
          {/* Head */}
          <path d="M14 34 C14 23 22 19 32 19 C42 19 50 23 50 34 C50 43 40 50 32 51 C24 50 14 43 14 34 Z" fill="#D96B40" stroke={ink} strokeWidth="2.2" />
          {/* Cream Cheeks */}
          <path d="M15 35 C20 35 25 40 32 50 C22 49 15 42 15 35 Z" fill="#FBF5E8" />
          <path d="M49 35 C44 35 39 40 32 50 C42 49 49 42 49 35 Z" fill="#FBF5E8" />
          {/* Eyes & Nose */}
          <circle cx="24.5" cy="33" r="2.6" fill={ink} />
          <circle cx="39.5" cy="33" r="2.6" fill={ink} />
          <circle cx="25.3" cy="32.2" r="0.9" fill="#FFF" />
          <circle cx="40.3" cy="32.2" r="0.9" fill="#FFF" />
          <circle cx="20.5" cy="38.5" r="2.6" fill="#E89A84" opacity="0.7" />
          <circle cx="43.5" cy="38.5" r="2.6" fill="#E89A84" opacity="0.7" />
          <ellipse cx="32" cy="40.5" rx="3.4" ry="2.4" fill={ink} />
          <path d="M29 44.5 Q32 47 35 44.5" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {avatar === 'otter' && (
        <g>
          {/* Round Ears */}
          <circle cx="17" cy="24" r="6" fill="#8E6244" stroke={ink} strokeWidth="2.2" />
          <circle cx="47" cy="24" r="6" fill="#8E6244" stroke={ink} strokeWidth="2.2" />
          {/* Head */}
          <ellipse cx="32" cy="35" rx="18" ry="16" fill="#9E7151" stroke={ink} strokeWidth="2.2" />
          {/* Cream Muzzle */}
          <ellipse cx="32" cy="40" rx="11.5" ry="9" fill="#F5E7D2" />
          {/* Eyes */}
          <circle cx="24" cy="31" r="2.6" fill={ink} />
          <circle cx="40" cy="31" r="2.6" fill={ink} />
          <circle cx="24.8" cy="30.2" r="0.9" fill="#FFF" />
          <circle cx="40.8" cy="30.2" r="0.9" fill="#FFF" />
          {/* Rosy cheeks */}
          <circle cx="19" cy="37" r="2.5" fill="#E69A87" opacity="0.65" />
          <circle cx="45" cy="37" r="2.5" fill="#E69A87" opacity="0.65" />
          {/* Nose & Whiskers */}
          <path d="M28.5 36.5 Q32 34.5 35.5 36.5 Q32 40.5 28.5 36.5 Z" fill={ink} />
          <path d="M28 42.5 Q32 45 36 42.5" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          <path d="M16 39 L22 39.5 M17 43 L22.5 42" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M48 39 L42 39.5 M47 43 L41.5 42" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}

      {avatar === 'panda' && (
        <g>
          {/* Ears */}
          <circle cx="17" cy="20" r="6.8" fill={ink} />
          <circle cx="47" cy="20" r="6.8" fill={ink} />
          {/* Head */}
          <ellipse cx="32" cy="35" rx="18.5" ry="16" fill="#FBF7EE" stroke={ink} strokeWidth="2.2" />
          {/* Eye Patches */}
          <ellipse cx="23.5" cy="33" rx="6" ry="5" transform="rotate(-18 23.5 33)" fill={ink} />
          <ellipse cx="40.5" cy="33" rx="6" ry="5" transform="rotate(18 40.5 33)" fill={ink} />
          <circle cx="24.3" cy="32.3" r="2" fill="#FFF" />
          <circle cx="39.7" cy="32.3" r="2" fill="#FFF" />
          <circle cx="24.5" cy="32.3" r="0.9" fill={ink} />
          <circle cx="39.5" cy="32.3" r="0.9" fill={ink} />
          {/* Cheeks & Nose */}
          <circle cx="19" cy="40" r="2.7" fill="#E89D91" opacity="0.7" />
          <circle cx="45" cy="40" r="2.7" fill="#E89D91" opacity="0.7" />
          <ellipse cx="32" cy="39" rx="3.5" ry="2.3" fill={ink} />
          <path d="M28.5 43.5 Q32 46 35.5 43.5" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {avatar === 'owl' && (
        <g>
          {/* Tuft Ears */}
          <path d="M16 26 L14 14 L25 21 Z" fill="#A6825C" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M48 26 L50 14 L39 21 Z" fill="#A6825C" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
          {/* Round Body/Head */}
          <ellipse cx="32" cy="36" rx="18" ry="17" fill="#B69169" stroke={ink} strokeWidth="2.2" />
          {/* Belly Feather Arc */}
          <path d="M20 46 Q32 39 44 46 Q32 53 20 46 Z" fill="#F5EBDA" />
          {/* Big Facial Discs */}
          <circle cx="24" cy="33" r="7.5" fill="#FBF5E8" stroke={ink} strokeWidth="1.8" />
          <circle cx="40" cy="33" r="7.5" fill="#FBF5E8" stroke={ink} strokeWidth="1.8" />
          <circle cx="24.5" cy="33" r="3" fill={ink} />
          <circle cx="39.5" cy="33" r="3" fill={ink} />
          <circle cx="25.5" cy="32" r="1.1" fill="#FFF" />
          <circle cx="40.5" cy="32" r="1.1" fill="#FFF" />
          {/* Beak */}
          <path d="M29 37 L35 37 L32 42.5 Z" fill="#D89232" stroke={ink} strokeWidth="1.8" strokeLinejoin="round" />
        </g>
      )}

      {avatar === 'turtle' && (
        <g>
          {/* Shell Hint Behind */}
          <path d="M15 45 C15 34 49 34 49 45 C49 52 15 52 15 45 Z" fill="#467856" stroke={ink} strokeWidth="2.2" />
          {/* Head */}
          <circle cx="32" cy="31" r="14.5" fill="#77AA7B" stroke={ink} strokeWidth="2.2" />
          {/* Gentle Spot */}
          <circle cx="21" cy="27" r="2.2" fill="#5A8C60" opacity="0.6" />
          <circle cx="43" cy="28" r="2" fill="#5A8C60" opacity="0.6" />
          {/* Eyes */}
          <circle cx="26" cy="29.5" r="2.6" fill={ink} />
          <circle cx="38" cy="29.5" r="2.6" fill={ink} />
          <circle cx="26.8" cy="28.7" r="0.9" fill="#FFF" />
          <circle cx="38.8" cy="28.7" r="0.9" fill="#FFF" />
          {/* Cheeks & Smile */}
          <circle cx="22" cy="34.5" r="2.5" fill="#E89D8B" opacity="0.65" />
          <circle cx="42" cy="34.5" r="2.5" fill="#E89D8B" opacity="0.65" />
          <path d="M27.5 36 Q32 39.5 36.5 36" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {avatar === 'puffin' && (
        <g>
          {/* Black Hood */}
          <ellipse cx="32" cy="35" rx="17" ry="17.5" fill="#2E3538" stroke={ink} strokeWidth="2.2" />
          {/* White Face Patch */}
          <ellipse cx="32" cy="36.5" rx="12.5" ry="12" fill="#FBF7EE" />
          {/* Eyes */}
          <circle cx="25.5" cy="31" r="2.5" fill={ink} />
          <circle cx="38.5" cy="31" r="2.5" fill={ink} />
          <circle cx="26.2" cy="30.2" r="0.9" fill="#FFF" />
          <circle cx="39.2" cy="30.2" r="0.9" fill="#FFF" />
          {/* Colorful Striped Beak */}
          <path d="M25.5 36 C28 33 36 33 38.5 36 C37 42.5 34.5 45 32 45.5 C29.5 45 27 42.5 25.5 36 Z" fill="#D95B38" stroke={ink} strokeWidth="2" />
          <path d="M27.5 36 C30 34.5 34 34.5 36.5 36 L35.2 39.5 L28.8 39.5 Z" fill="#E9B44C" />
          <circle cx="21" cy="37" r="2.3" fill="#E89A8A" opacity="0.65" />
          <circle cx="43" cy="37" r="2.3" fill="#E89A8A" opacity="0.65" />
        </g>
      )}

      {avatar === 'alpaca' && (
        <g>
          {/* Tall Ears */}
          <ellipse cx="21" cy="17" rx="4" ry="8.5" transform="rotate(-14 21 17)" fill="#F3E5CE" stroke={ink} strokeWidth="2.2" />
          <ellipse cx="43" cy="17" rx="4" ry="8.5" transform="rotate(14 43 17)" fill="#F3E5CE" stroke={ink} strokeWidth="2.2" />
          {/* Fluffy Head */}
          <path d="M17 34 C16 24 22 19 32 19 C42 19 48 24 47 34 C48 44 41 51 32 51 C23 51 16 44 17 34 Z" fill="#FBF3E4" stroke={ink} strokeWidth="2.2" />
          {/* Fluffy Top Curl */}
          <circle cx="28" cy="21" r="4" fill="#FBF3E4" stroke={ink} strokeWidth="1.8" />
          <circle cx="34" cy="20" r="4.5" fill="#FBF3E4" stroke={ink} strokeWidth="1.8" />
          {/* Eyes */}
          <circle cx="25" cy="33" r="2.5" fill={ink} />
          <circle cx="39" cy="33" r="2.5" fill={ink} />
          <circle cx="25.7" cy="32.2" r="0.9" fill="#FFF" />
          <circle cx="39.7" cy="32.2" r="0.9" fill="#FFF" />
          {/* Cheeks & Snout */}
          <circle cx="20.5" cy="38" r="2.6" fill="#E89D8B" opacity="0.7" />
          <circle cx="43.5" cy="38" r="2.6" fill="#E89D8B" opacity="0.7" />
          <path d="M29 39.5 L32 37.5 L35 39.5" stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M32 37.5 L32 42.5 M29.5 43 Q32 45 34.5 43" stroke={ink} strokeWidth="1.9" strokeLinecap="round" />
        </g>
      )}

      {avatar === 'lion' && (
        <g>
          {/* Scalloped Mane */}
          <circle cx="32" cy="33" r="20" fill="#B86B2B" stroke={ink} strokeWidth="2.2" strokeDasharray="7 3" />
          <circle cx="32" cy="33" r="19" fill="#C47430" stroke={ink} strokeWidth="2" />
          {/* Ears */}
          <circle cx="19" cy="22" r="4.5" fill="#E4A94B" stroke={ink} strokeWidth="2" />
          <circle cx="45" cy="22" r="4.5" fill="#E4A94B" stroke={ink} strokeWidth="2" />
          {/* Face */}
          <circle cx="32" cy="34" r="14" fill="#EAB254" stroke={ink} strokeWidth="2.2" />
          {/* Muzzle */}
          <ellipse cx="32" cy="39.5" rx="7.5" ry="5.5" fill="#FBF1DC" />
          {/* Eyes */}
          <circle cx="26" cy="31.5" r="2.4" fill={ink} />
          <circle cx="38" cy="31.5" r="2.4" fill={ink} />
          <circle cx="26.7" cy="30.8" r="0.85" fill="#FFF" />
          <circle cx="38.7" cy="30.8" r="0.85" fill="#FFF" />
          {/* Nose & Smile */}
          <path d="M28.8 37 L35.2 37 L32 40.5 Z" fill={ink} />
          <path d="M28.5 42.5 Q32 45 35.5 42.5" stroke={ink} strokeWidth="1.9" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
