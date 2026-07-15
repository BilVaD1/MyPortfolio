import React from 'react'

import { SceneMode } from './types'

interface BirdConfig {
  top: string
  delay: number
  dur: number
  scale: number
  flapDelay: number
}

const BIRDS: BirdConfig[] = [
  { top: '14%', delay: -4, dur: 40, scale: 1, flapDelay: 0 },
  { top: '26%', delay: -14, dur: 48, scale: 0.7, flapDelay: 0.2 },
  { top: '9%', delay: -26, dur: 44, scale: 0.85, flapDelay: 0.45 },
  { top: '33%', delay: -33, dur: 52, scale: 0.6, flapDelay: 0.1 },
  { top: '20%', delay: -45, dur: 46, scale: 0.75, flapDelay: 0.3 },
]

const COLORS: Record<SceneMode, string> = {
  day: '#3a4a5c',
  night: '#8794b8',
  sunrise: '#6e4a63',
  sunset: '#4a3040',
}

const Bird = ({ cfg, color }: { cfg: BirdConfig; color: string }) => (
  <div
    className="absolute left-[-90px]"
    style={{ top: cfg.top, animation: `bird-fly ${cfg.dur}s linear ${cfg.delay}s infinite` }}
  >
    <div style={{ animation: `bird-bob ${4 + cfg.scale * 2}s ease-in-out infinite` }}>
      <svg width={44 * cfg.scale} height={22 * cfg.scale} viewBox="0 0 64 32" fill="none" className="overflow-visible">
        <path
          className="bird-wing-l transition-colors duration-1000"
          d="M32 22 Q 16 2 2 12"
          style={{ stroke: color, animationDelay: `${cfg.flapDelay}s` }}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          className="bird-wing-r transition-colors duration-1000"
          d="M32 22 Q 48 2 62 12"
          style={{ stroke: color, animationDelay: `${cfg.flapDelay}s` }}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  </div>
)

/** Flock of birds flying across the upper part of the scene. */
const BirdsLayer = ({ mode }: { mode: SceneMode }) => (
  <div className="absolute inset-x-0 top-0 h-[55%]">
    {BIRDS.map((cfg, i) => (
      <Bird key={i} cfg={cfg} color={COLORS[mode]} />
    ))}
  </div>
)

export default BirdsLayer
