import React from 'react'

import { SceneMode } from './types'

interface MountainPalette {
  far: string
  near: string
  snow: string
}

const PALETTES: Record<SceneMode, MountainPalette> = {
  day: { far: '#a8bfd4', near: '#8098ad', snow: '#f6fafc' },
  night: { far: '#1e2848', near: '#161f3c', snow: '#a9b4d8' },
  sunrise: { far: '#caa2c4', near: '#a678a0', snow: '#ffeaf2' },
  sunset: { far: '#8a5b80', near: '#684063', snow: '#ffd9b3' },
}

const fade = 'transition-colors duration-1000'

/** Zig-zag snowcap polygon points for a peak at (px, py). */
const cap = (px: number, py: number, s = 1): string =>
  `${px},${py} ${px - 30 * s},${py + 30 * s} ${px - 17 * s},${py + 22 * s} ${px - 6 * s},${py + 32 * s} ` +
  `${px + 7 * s},${py + 24 * s} ${px + 18 * s},${py + 33 * s} ${px + 30 * s},${py + 30 * s}`

const FAR_RANGE =
  'M0 520 L0 340 L150 210 L280 315 L420 150 L560 310 L700 225 L840 330 L980 95 ' +
  'L1120 300 L1250 195 L1380 305 L1440 270 L1440 520 Z'

const NEAR_RANGE =
  'M0 520 L0 405 L190 265 L350 378 L520 225 L700 395 L880 275 L1060 405 L1240 305 L1440 385 L1440 520 Z'

const FAR_CAPS: Array<[number, number, number]> = [
  [150, 210, 0.8],
  [420, 150, 0.9],
  [980, 95, 1.1],
  [1250, 195, 0.8],
]

const NEAR_CAPS: Array<[number, number, number]> = [
  [190, 265, 0.9],
  [520, 225, 1.2],
  [880, 275, 1],
]

/** Two mountain ranges with snowcaps behind the town. */
const MountainsLayer = ({ mode }: { mode: SceneMode }) => {
  const p = PALETTES[mode]

  return (
    <div className="absolute inset-x-0 bottom-0 h-full">
      <svg viewBox="0 0 1440 520" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 h-full w-full">
        <path className={fade} d={FAR_RANGE} style={{ fill: p.far }} />
        {FAR_CAPS.map(([x, y, s]) => (
          <polygon key={`f${x}`} className={fade} points={cap(x, y, s)} style={{ fill: p.snow }} opacity="0.9" />
        ))}
        <path className={fade} d={NEAR_RANGE} style={{ fill: p.near }} />
        {NEAR_CAPS.map(([x, y, s]) => (
          <polygon key={`n${x}`} className={fade} points={cap(x, y, s)} style={{ fill: p.snow }} />
        ))}
      </svg>
    </div>
  )
}

export default MountainsLayer
