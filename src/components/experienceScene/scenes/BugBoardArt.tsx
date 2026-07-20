import React from 'react'

import { SceneArtProps } from '../types'

const ROWS = ['login flow', 'cart totals', 'checkout', 'promo codes']

/** Magento manual QA — a test-case board ticking off, a bug caught in the crosshair. */
const BugBoardArt = ({ active }: SceneArtProps) => (
  <div className="absolute inset-0 overflow-hidden">
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      {/* test-case board */}
      <g transform="translate(760 250)">
        <rect width="470" height="300" rx="16" fill="rgba(42,22,7,0.7)" stroke="var(--accent2)" strokeWidth="1.4" />
        <text x="28" y="44" fill="var(--accent)" fontSize="18" fontWeight="700" fontFamily="monospace">
          Sprint · Test Cases
        </text>
        <line x1="28" y1="60" x2="442" y2="60" stroke="var(--accent2)" strokeWidth="1" opacity="0.4" />
        {ROWS.map((r, i) => {
          const y = 96 + i * 50
          return (
            <g key={r}>
              <rect x="28" y={y - 20} width="26" height="26" rx="6" fill="none" stroke="var(--accent)" strokeWidth="1.8" />
              <path
                d={`M33 ${y - 8} l7 8 l12 -16`}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="40"
                style={{ animation: `exp-tick 6s ease-in-out ${i * 0.7}s infinite` }}
              />
              <rect x="72" y={y - 12} width={230 - i * 26} height="9" rx="4" fill="var(--accent2)" opacity="0.55" />
              <rect x="72" y={y + 2} width={150 - i * 18} height="7" rx="3" fill="var(--accent2)" opacity="0.3" />
            </g>
          )
        })}
      </g>

      {/* crosshair locking on the bug */}
      <g style={{ transformOrigin: '600px 640px', animation: 'exp-glow 2.4s ease-in-out infinite' }}>
        <circle cx="600" cy="640" r="46" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeDasharray="6 8" />
        <circle cx="600" cy="640" r="30" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.6" />
        <line x1="600" y1="584" x2="600" y2="602" stroke="var(--accent)" strokeWidth="1.6" />
        <line x1="600" y1="678" x2="600" y2="696" stroke="var(--accent)" strokeWidth="1.6" />
        <line x1="544" y1="640" x2="562" y2="640" stroke="var(--accent)" strokeWidth="1.6" />
        <line x1="638" y1="640" x2="656" y2="640" stroke="var(--accent)" strokeWidth="1.6" />
      </g>

      {/* the bug, scurrying inside the crosshair */}
      <g style={{ transformOrigin: '600px 640px', animation: `exp-scurry ${active ? 3.4 : 5}s ease-in-out infinite` }}>
        <g transform="translate(600 640)">
          <ellipse cx="0" cy="0" rx="18" ry="22" fill="#d9534f" />
          <path d="M0 -22 L0 20" stroke="#2a1607" strokeWidth="2" />
          <circle cx="0" cy="-24" r="8" fill="#2a1607" />
          <circle cx="-7" cy="-4" r="3" fill="#2a1607" />
          <circle cx="7" cy="-6" r="3" fill="#2a1607" />
          <circle cx="-6" cy="8" r="2.6" fill="#2a1607" />
          <circle cx="7" cy="6" r="2.6" fill="#2a1607" />
          {/* legs */}
          <g stroke="#2a1607" strokeWidth="2" strokeLinecap="round">
            <line x1="-16" y1="-8" x2="-30" y2="-16" />
            <line x1="-18" y1="2" x2="-32" y2="2" />
            <line x1="-16" y1="12" x2="-30" y2="20" />
            <line x1="16" y1="-8" x2="30" y2="-16" />
            <line x1="18" y1="2" x2="32" y2="2" />
            <line x1="16" y1="12" x2="30" y2="20" />
          </g>
        </g>
      </g>
      <text x="600" y="716" textAnchor="middle" fill="var(--accent)" fontSize="14" fontWeight="700" fontFamily="monospace">
        bug reproduced
      </text>
    </svg>
  </div>
)

export default BugBoardArt
