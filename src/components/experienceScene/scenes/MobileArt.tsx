import React from 'react'

import { SceneArtProps } from '../types'

const SCREENS = ['#22d3ee', '#38bdf8', '#2dd4bf']

/** Cross-platform mobile QA — a swiping device, iOS/Android, Charles-proxy traffic. */
const MobileArt = ({ active }: SceneArtProps) => (
  <div className="absolute inset-0 overflow-hidden">
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      {/* proxy node (Charles) */}
      <g>
        <rect x="470" y="360" width="96" height="96" rx="12" fill="rgba(11,18,32,0.85)" stroke="var(--accent)" strokeWidth="1.6" />
        <path d="M498 420 q20 -34 40 0" fill="none" stroke="var(--accent)" strokeWidth="2" />
        <circle cx="518" cy="398" r="7" fill="none" stroke="var(--accent)" strokeWidth="2" />
        <text x="518" y="476" textAnchor="middle" fill="var(--accent)" fontSize="13" fontFamily="monospace">
          proxy
        </text>
      </g>

      {/* traffic rails between proxy and device */}
      {[398, 418].map((y, i) => (
        <g key={y}>
          <line x1="566" y1={y} x2="900" y2={y} stroke="var(--accent2)" strokeWidth="1.6" opacity="0.35" />
          <line
            x1={i ? 900 : 566}
            y1={y}
            x2={i ? 566 : 900}
            y2={y}
            stroke="var(--accent)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeDasharray="12 322"
            style={{ animation: `exp-dash-draw ${i ? 3.4 : 2.6}s linear infinite` }}
          />
        </g>
      ))}

      {/* throttled queue — packets bunching up (slower blink) */}
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={600 + i * 16}
          cy={456}
          r="4"
          fill="var(--accent)"
          style={{ animation: `exp-glow ${active ? 1.8 : 2.6}s ease-in-out ${i * 0.3}s infinite` }}
        />
      ))}

      {/* platform marks */}
      <g fill="var(--accent2)" opacity="0.6">
        {/* apple */}
        <g transform="translate(470 250)">
          <path d="M18 8 a10 10 0 0 0 -16 4 a11 11 0 0 0 6 18 a9 9 0 0 0 10 0 a11 11 0 0 0 6 -18 a10 10 0 0 0 -12 -4 Z" />
          <path d="M18 6 q6 -6 10 -4 q-1 6 -8 6 Z" />
        </g>
        {/* android */}
        <g transform="translate(560 252)" stroke="var(--accent2)" strokeWidth="2" fill="none">
          <path d="M2 18 a13 13 0 0 1 26 0 Z" />
          <line x1="6" y1="8" x2="2" y2="3" />
          <line x1="24" y1="8" x2="28" y2="3" />
        </g>
      </g>
    </svg>

    {/* the device */}
    <div
      className="absolute"
      style={{ left: '62%', top: '20%', width: 190, height: 380 }}
    >
      <div
        className="exp-a-float relative h-full w-full rounded-[30px] border-2 p-2.5"
        style={{ borderColor: 'var(--accent)', background: 'rgba(11,18,32,0.9)', boxShadow: '0 0 40px -8px var(--accent)' }}
      >
        {/* notch */}
        <div className="absolute left-1/2 top-2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-white/25" />
        <div className="mt-4 h-full w-full overflow-hidden rounded-[20px]">
          <div className="flex h-full w-[300%]" style={{ animation: `exp-swipe ${active ? 8 : 12}s ease-in-out infinite` }}>
            {SCREENS.map((c, i) => (
              <div key={i} className="flex h-full w-1/3 flex-col gap-2 p-3">
                <div className="h-20 w-full rounded-lg" style={{ background: c, opacity: 0.5 }} />
                <div className="h-2.5 w-3/4 rounded-full bg-white/40" />
                <div className="h-2.5 w-1/2 rounded-full" style={{ background: c }} />
                <div className="mt-2 h-9 w-full rounded-lg border" style={{ borderColor: c }} />
                <div className="mt-auto h-8 w-full rounded-lg" style={{ background: c, opacity: 0.35 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default MobileArt
