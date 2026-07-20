import React from 'react'

import { SceneArtProps } from '../types'

const PRODUCTS = [
  { left: '52%', top: '34%', hue: '#7ee787', dur: 11, delay: 0 },
  { left: '64%', top: '30%', hue: '#4cd6a0', dur: 13, delay: 2.4 },
  { left: '76%', top: '36%', hue: '#a7f3d0', dur: 12, delay: 4.1 },
  { left: '86%', top: '32%', hue: '#5eead4', dur: 14, delay: 1.2 },
]

/** Shopify headless commerce — floating product cards + visual-regression diff. */
const StorefrontArt = ({ active }: SceneArtProps) => (
  <div className="absolute inset-0 overflow-hidden">
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      {/* shopping bag, upper-right */}
      <g className="exp-a-float" style={{ transformOrigin: '1230px 190px' }}>
        <path
          d="M1190 200 h80 l-8 96 h-64 Z"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.2"
        />
        <path d="M1206 200 a24 24 0 0 1 48 0" fill="none" stroke="var(--accent)" strokeWidth="2.2" />
      </g>

      {/* visual-regression comparator */}
      <g transform="translate(560 560)">
        {[0, 210].map((dx, i) => (
          <g key={i} transform={`translate(${dx} 0)`}>
            <rect width="180" height="150" rx="8" fill="rgba(5,46,26,0.6)" stroke="var(--accent2)" strokeWidth="1.4" />
            <rect x="16" y="18" width="148" height="66" rx="4" fill="var(--accent)" opacity="0.35" />
            <rect x="16" y="96" width="120" height="9" rx="4" fill="var(--accent2)" opacity="0.6" />
            <rect x="16" y="114" width="80" height="9" rx="4" fill="var(--accent2)" opacity="0.4" />
            <text x="10" y="-10" fill="var(--accent)" fontSize="12" fontFamily="monospace">
              {i === 0 ? 'baseline' : 'current'}
            </text>
          </g>
        ))}
        {/* scanning line sweeping the current frame */}
        <g style={{ clipPath: 'inset(0 round 8px)' }}>
          <rect
            x="210"
            y="0"
            width="4"
            height="150"
            fill="#ffffff"
            opacity="0.85"
            style={{ animation: `exp-slidey ${active ? 2.4 : 3.6}s ease-in-out infinite` }}
          />
        </g>
        <text x="196" y="182" textAnchor="middle" fill="var(--accent)" fontSize="14" fontWeight="700">
          diff 0.0% ✓
        </text>
      </g>

      {/* React atom mark, faint */}
      <g transform="translate(470 300)" opacity="0.4" className="exp-a-spin">
        <circle r="6" fill="var(--accent)" />
        {[0, 60, 120].map((a) => (
          <ellipse key={a} rx="46" ry="17" fill="none" stroke="var(--accent)" strokeWidth="1.4" transform={`rotate(${a})`} />
        ))}
      </g>
    </svg>

    {/* rising product cards */}
    {PRODUCTS.map((p, i) => (
      <div
        key={i}
        className="absolute w-28 rounded-xl border p-2 backdrop-blur-sm"
        style={{
          left: p.left,
          top: p.top,
          borderColor: 'rgba(126,231,135,0.4)',
          background: 'rgba(5,46,26,0.45)',
          animation: `exp-rise-y ${p.dur}s ease-in-out ${p.delay}s infinite`,
        }}
      >
        <div className="h-14 w-full rounded-md" style={{ background: p.hue, opacity: 0.55 }} />
        <div className="mt-2 h-2 w-3/4 rounded-full bg-white/40" />
        <div className="mt-1.5 h-2 w-1/2 rounded-full" style={{ background: 'var(--accent)' }} />
      </div>
    ))}
  </div>
)

export default StorefrontArt
