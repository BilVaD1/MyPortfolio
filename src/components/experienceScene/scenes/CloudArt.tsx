import React from 'react'

import { SceneArtProps } from '../types'

const CX = 980
const CY = 350
const TILES = ['#a78bfa', '#c4b5fd', '#8b5cf6', '#7c3aed', '#ddd6fe']

/** Cloud brand platform — orbiting brand tiles + a WebdriverIO/Postman API call. */
const CloudArt = ({ active }: SceneArtProps) => (
  <div className="absolute inset-0 overflow-hidden">
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      {/* central cloud */}
      <g className="exp-a-float-slow" style={{ transformOrigin: `${CX}px ${CY}px` }}>
        <circle cx={CX} cy={CY} r="60" fill="var(--accent)" opacity="0.12" />
        <path
          d={`M${CX - 78} ${CY + 22} a34 34 0 0 1 6 -66 a44 44 0 0 1 84 -10 a32 32 0 0 1 16 78 Z`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.2"
        />
      </g>

      {/* orbiting brand tiles */}
      {TILES.map((c, i) => {
        const rx = 168
        const ry = 66
        return (
          <g
            key={i}
            style={{
              transformBox: 'view-box',
              transformOrigin: `${CX}px ${CY}px`,
              animation: `exp-spin ${active ? 18 : 28}s linear infinite`,
              animationDelay: `${(-(active ? 18 : 28) / TILES.length) * i}s`,
            }}
          >
            <rect
              x={CX + rx - 11}
              y={CY - 11}
              width="22"
              height="22"
              rx="5"
              fill={c}
              opacity="0.9"
              style={{ filter: `drop-shadow(0 0 6px ${c})` }}
            />
            <ellipse cx={CX} cy={CY} rx={rx} ry={ry} fill="none" stroke="var(--accent2)" strokeWidth="0.8" opacity="0.2" />
          </g>
        )
      })}

      {/* API call rail: client → server */}
      <g>
        {/* client */}
        <rect x="470" y="616" width="70" height="48" rx="8" fill="rgba(26,15,58,0.85)" stroke="var(--accent)" strokeWidth="1.6" />
        <text x="505" y="645" textAnchor="middle" fill="var(--accent)" fontSize="12" fontFamily="monospace">
          client
        </text>

        {/* server rack */}
        <rect x="1160" y="600" width="80" height="80" rx="8" fill="rgba(26,15,58,0.85)" stroke="var(--accent)" strokeWidth="1.6" />
        {[614, 634, 654].map((y) => (
          <rect key={y} x="1170" y={y} width="60" height="10" rx="3" fill="var(--accent2)" opacity="0.6" />
        ))}

        {/* request line + travelling packet */}
        <line x1="540" y1="640" x2="1160" y2="640" stroke="var(--accent2)" strokeWidth="2" opacity="0.4" />
        <line
          x1="540"
          y1="640"
          x2="1160"
          y2="640"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="16 604"
          style={{ animation: 'exp-dash-draw 2.8s linear infinite' }}
        />
        <text x="560" y="626" fill="var(--accent)" fontSize="13" fontFamily="monospace">
          POST /api/brands
        </text>

        {/* 200 OK badge returning */}
        <g style={{ transformOrigin: '1120px 700px', animation: 'exp-pop 2.8s ease-in-out infinite' }}>
          <rect x="1078" y="690" width="84" height="26" rx="13" fill="none" stroke="var(--accent)" strokeWidth="1.6" />
          <text x="1120" y="708" textAnchor="middle" fill="var(--accent)" fontSize="13" fontWeight="700" fontFamily="monospace">
            200 OK
          </text>
        </g>
      </g>
    </svg>

    {/* tool chips */}
    {[
      { t: 'WebdriverIO', left: '44%', top: '40%' },
      { t: 'Postman', left: '56%', top: '62%' },
    ].map((c, i) => (
      <span
        key={i}
        className="exp-a-float absolute rounded-full border px-3 py-1 font-mono text-xs"
        style={{
          left: c.left,
          top: c.top,
          color: 'var(--accent)',
          borderColor: 'var(--accent)',
          background: 'rgba(26,15,58,0.4)',
          opacity: 0.75,
          animationDelay: `${i}s`,
        }}
      >
        {c.t}
      </span>
    ))}
  </div>
)

export default CloudArt
