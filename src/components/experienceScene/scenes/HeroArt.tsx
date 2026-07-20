import React from 'react'

import { SceneArtProps } from '../types'

// Deterministic starfield so the layout is stable across renders.
const STARS = [
  [140, 120, 1.6, 0], [320, 80, 1.1, 1.2], [520, 180, 1.9, 0.6], [700, 90, 1.2, 2.1],
  [880, 160, 1.5, 1.6], [1040, 70, 1.1, 0.9], [1220, 150, 1.8, 2.4], [1340, 90, 1.3, 1.1],
  [220, 300, 1.2, 1.8], [430, 360, 1.6, 0.4], [640, 280, 1.1, 2.7], [980, 330, 1.7, 1.3],
  [1180, 300, 1.2, 0.7], [1300, 380, 1.5, 2.0], [80, 420, 1.4, 1.5], [560, 460, 1.2, 0.2],
] as const

const EMBERS = [
  { left: '62%', size: 5, dur: 9, delay: 0, drift: '20px' },
  { left: '72%', size: 3, dur: 11, delay: 2.5, drift: '-14px' },
  { left: '82%', size: 6, dur: 8, delay: 1.2, drift: '26px' },
  { left: '90%', size: 4, dur: 12, delay: 3.4, drift: '-18px' },
  { left: '68%', size: 3, dur: 10, delay: 4.1, drift: '10px' },
  { left: '78%', size: 5, dur: 9.5, delay: 5.0, drift: '-22px' },
]

/** Opening scene: quiet starfield, a slow orbit ring and rising embers. */
const HeroArt = ({ active }: SceneArtProps) => (
  <div className="absolute inset-0 overflow-hidden">
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      {/* twinkling stars */}
      <g className="exp-par-slow">
        {STARS.map(([cx, cy, r, delay], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="#ffffff"
            style={{ animation: `exp-glow 4s ease-in-out ${delay}s infinite` }}
          />
        ))}
      </g>

      {/* slow dashed orbit rings, lower-right */}
      <g
        style={{
          transformBox: 'view-box',
          transformOrigin: '1080px 640px',
          animation: `exp-spin ${active ? 60 : 90}s linear infinite`,
        }}
      >
        <ellipse
          cx="1080"
          cy="640"
          rx="360"
          ry="150"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.4"
          strokeDasharray="2 14"
          opacity="0.5"
        />
        <ellipse
          cx="1080"
          cy="640"
          rx="250"
          ry="250"
          fill="none"
          stroke="var(--accent2)"
          strokeWidth="1"
          strokeDasharray="2 12"
          opacity="0.35"
        />
      </g>
    </svg>

    {/* rising embers */}
    {EMBERS.map((e, i) => (
      <span
        key={i}
        className="absolute rounded-full"
        style={
          {
            left: e.left,
            bottom: '18%',
            width: e.size,
            height: e.size,
            background: 'var(--accent)',
            boxShadow: '0 0 10px 2px var(--accent)',
            ['--drift' as string]: e.drift,
            animation: `exp-ember ${e.dur}s ease-in ${e.delay}s infinite`,
          } as React.CSSProperties
        }
      />
    ))}
  </div>
)

export default HeroArt
