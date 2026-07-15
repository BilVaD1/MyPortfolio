import React, { useMemo } from 'react'

import { SceneMode } from './types'

const PALETTES: Record<SceneMode, [string, string]> = {
  day: ['#3e6b4f', '#2f5540'],
  night: ['#16233c', '#101b30'],
  sunrise: ['#5a4f6b', '#4a4059'],
  sunset: ['#463349', '#362839'],
}

interface Pine {
  x: number
  h: number
}

/** Deterministic pine placement so the forest doesn't reshuffle between renders. */
const makePines = (count: number): Pine[] => {
  let seed = 7
  const rnd = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  return Array.from({ length: count }, (_, i) => ({
    x: (i / count) * 1440 + rnd() * 26 - 13,
    h: 42 + rnd() * 55,
  }))
}

const BASE_Y = 178

/** Band of pine trees between the mountains and the town. */
const ForestLayer = ({ mode }: { mode: SceneMode }) => {
  const pines = useMemo(() => makePines(48), [])
  const colors = PALETTES[mode]

  return (
    <div className="absolute inset-x-0 bottom-0 h-full">
      <svg viewBox="0 0 1440 180" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {pines.map((pine, i) => {
          const w = pine.h * 0.55
          const fill = colors[i % 2]
          return (
            <g key={i} className="transition-colors duration-1000" style={{ fill }}>
              <polygon points={`${pine.x - w / 2},${BASE_Y} ${pine.x + w / 2},${BASE_Y} ${pine.x},${BASE_Y - pine.h}`} />
              <polygon
                points={`${pine.x - w / 3},${BASE_Y - pine.h * 0.45} ${pine.x + w / 3},${BASE_Y - pine.h * 0.45} ${pine.x},${BASE_Y - pine.h * 1.18}`}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default ForestLayer
