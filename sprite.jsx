// Sprint figure SVG — abstract motion-blur silhouette
// Exposed globally so app.jsx can use it across multiple Babel scopes.

const SprintFigure = ({ size = 100, color = "#39FF14", blur = true, style = {} }) => (
  <svg
    viewBox="0 0 100 160"
    width={size}
    height={size * 1.6}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {blur && (
        <filter id="mblur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.4 0.2" />
        </filter>
      )}
      <linearGradient id="sprintGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={color} stopOpacity="0" />
        <stop offset="1" stopColor={color} stopOpacity="1" />
      </linearGradient>
    </defs>
    {/* motion-blur trails */}
    <g opacity="0.35" filter={blur ? "url(#mblur)" : ""}>
      <rect x="-30" y="44" width="50" height="3" fill={color} />
      <rect x="-20" y="62" width="40" height="3" fill={color} />
      <rect x="-10" y="92" width="40" height="3" fill={color} />
      <rect x="-10" y="118" width="40" height="3" fill={color} />
    </g>
    {/* body */}
    <g fill={color}>
      {/* head */}
      <circle cx="62" cy="18" r="10" />
      {/* torso - leaning forward */}
      <path d="M 56 26 L 70 30 L 68 64 L 50 72 L 42 60 Z" />
      {/* front arm */}
      <path d="M 68 32 L 92 22 L 96 28 L 72 42 Z" />
      {/* back arm bent */}
      <path d="M 50 36 L 34 56 L 32 50 L 46 30 Z" />
      {/* front leg extended */}
      <path d="M 64 60 L 88 102 L 96 132 L 90 134 L 80 108 L 56 76 Z" />
      {/* back leg pushing */}
      <path d="M 50 64 L 28 92 L 18 130 L 26 132 L 36 100 L 60 76 Z" />
    </g>
  </svg>
);

const Logo = ({ size = 32 }) => (
  <img
    src="apple-touch-icon.png"
    alt="SpeedGate"
    width={size}
    height={size}
    style={{ display: 'block', borderRadius: Math.round(size * 0.22) }}
  />
);

Object.assign(window, { SprintFigure, Logo });
