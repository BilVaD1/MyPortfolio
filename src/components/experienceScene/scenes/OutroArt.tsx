import React from 'react'

import { SceneArtProps } from '../types'

const EMBERS = [
  { left: '30%', size: 5, dur: 10, delay: 0, drift: '18px' },
  { left: '44%', size: 3, dur: 12, delay: 2.2, drift: '-12px' },
  { left: '58%', size: 6, dur: 9, delay: 1.1, drift: '22px' },
  { left: '70%', size: 4, dur: 13, delay: 3.3, drift: '-20px' },
  { left: '82%', size: 3, dur: 11, delay: 4.4, drift: '14px' },
  { left: '38%', size: 4, dur: 10.5, delay: 5.1, drift: '-16px' },
]

/** Closing scene: a warm glowing node and rising embers mirroring the hero. */
const OutroArt = ({ active }: SceneArtProps) => (
  <div className="absolute inset-0 overflow-hidden">
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      {/* soft glow orb, centre */}
      <circle cx="720" cy="430" r="150" fill="var(--accent)" opacity="0.1" className="exp-a-glow" />
      <circle cx="720" cy="430" r="10" fill="var(--accent)" style={{ filter: 'drop-shadow(0 0 16px var(--accent))' }} />

      {/* concentric drawn rings, like ripples closing the journey */}
      {[70, 130, 200].map((r, i) => (
        <circle
          key={r}
          cx="720"
          cy="430"
          r={r}
          fill="none"
          stroke="var(--accent2)"
          strokeWidth="1"
          strokeDasharray="3 12"
          opacity="0.4"
          style={{
            transformBox: 'view-box',
            transformOrigin: '720px 430px',
            animation: `exp-spin${i % 2 ? '-rev' : ''} ${(active ? 24 : 36) + i * 6}s linear infinite`,
          }}
        />
      ))}
    </svg>

    {EMBERS.map((e, i) => (
      <span
        key={i}
        className="absolute rounded-full"
        style={
          {
            left: e.left,
            bottom: '20%',
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

export default OutroArt
