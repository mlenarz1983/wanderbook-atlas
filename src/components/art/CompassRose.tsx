export function CompassRose({ size = 84 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="44" fill="#FBF5E8" fillOpacity="0.88" stroke="#2B231D" strokeWidth="1.6" />
      <circle cx="50" cy="50" r="38" stroke="#C88A2B" strokeWidth="1.2" strokeDasharray="3 3" />
      {/* Secondary Points */}
      <polygon points="50,50 74,26 57,50" fill="#C88A2B" opacity="0.7" />
      <polygon points="50,50 74,74 50,57" fill="#C88A2B" opacity="0.7" />
      <polygon points="50,50 26,74 43,50" fill="#C88A2B" opacity="0.7" />
      <polygon points="50,50 26,26 50,43" fill="#C88A2B" opacity="0.7" />
      {/* Main Cardinal Star */}
      <polygon points="50,14 58,44 50,50" fill="#C4533A" stroke="#2B231D" strokeWidth="1.2" />
      <polygon points="50,14 42,44 50,50" fill="#E68A73" stroke="#2B231D" strokeWidth="1.2" />
      <polygon points="50,86 58,56 50,50" fill="#1F5A63" stroke="#2B231D" strokeWidth="1.2" />
      <polygon points="50,86 42,56 50,50" fill="#467E87" stroke="#2B231D" strokeWidth="1.2" />
      <polygon points="86,50 56,42 50,50" fill="#1F5A63" stroke="#2B231D" strokeWidth="1.2" />
      <polygon points="86,50 56,58 50,50" fill="#467E87" stroke="#2B231D" strokeWidth="1.2" />
      <polygon points="14,50 44,42 50,50" fill="#467E87" stroke="#2B231D" strokeWidth="1.2" />
      <polygon points="14,50 44,58 50,50" fill="#1F5A63" stroke="#2B231D" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="4.5" fill="#FBF5E8" stroke="#2B231D" strokeWidth="1.6" />
      {/* Cardinal Letters */}
      <text x="50" y="11" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontSize="9.5" fontWeight="800" fill="#C4533A">N</text>
      <text x="50" y="96" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontSize="8.5" fontWeight="700" fill="#2B231D">S</text>
      <text x="92" y="53" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontSize="8.5" fontWeight="700" fill="#2B231D">E</text>
      <text x="8" y="53" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontSize="8.5" fontWeight="700" fill="#2B231D">W</text>
    </svg>
  );
}

export function BalloonEmblem({ size = 38 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Envelope */}
      <path
        d="M32 6 C18 6 11 16 11 27 C11 37 20 44 25 49 L39 49 C44 44 53 37 53 27 C53 16 46 6 32 6 Z"
        fill="#C4533A"
        stroke="#2B231D"
        strokeWidth="2.4"
      />
      {/* Cream Stripes */}
      <path
        d="M32 6 C23 6 20 16 20 27 C20 37 25 44 28 49 L36 49 C39 44 44 37 44 27 C44 16 41 6 32 6 Z"
        fill="#FBF5E8"
        stroke="#2B231D"
        strokeWidth="2"
      />
      <path
        d="M32 6 C29 14 28 24 29.5 49 L34.5 49 C36 24 35 14 32 6 Z"
        fill="#C88A2B"
        stroke="#2B231D"
        strokeWidth="1.6"
      />
      {/* Ropes */}
      <line x1="27" y1="49" x2="28" y2="54" stroke="#2B231D" strokeWidth="1.8" />
      <line x1="37" y1="49" x2="36" y2="54" stroke="#2B231D" strokeWidth="1.8" />
      {/* Wicker Basket */}
      <rect x="26" y="53" width="12" height="7" rx="2" fill="#B67B3E" stroke="#2B231D" strokeWidth="2" />
    </svg>
  );
}
