import React, { useMemo } from 'react'

import { useStateContext } from '../../contexts/ContextProvider'
import { SceneMode } from './types'

interface Star {
  left: number
  top: number
  size: number
  delay: number
  dur: number
}

/** Deterministic pseudo-random generator so stars don't jump between renders. */
const makeStars = (count: number): Star[] => {
  let seed = 42
  const rnd = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  return Array.from({ length: count }, () => ({
    left: rnd() * 100,
    top: rnd() * 55,
    size: 1 + rnd() * 2.2,
    delay: rnd() * 4,
    dur: 2.5 + rnd() * 3,
  }))
}

const CLOUD_TINTS: Record<SceneMode, string> = {
  day: '#ffffff',
  night: '#ffffff',
  sunrise: '#ffe4ee',
  sunset: '#ffd2a8',
}

const Cloud = ({ top, scale, dur, delay, mode }: { top: string; scale: number; dur: number; delay: number; mode: SceneMode }) => (
  <div
    className="absolute left-[-220px]"
    style={{ top, animation: `cloud-drift ${dur}s linear ${delay}s infinite` }}
  >
    <svg
      width={190 * scale}
      viewBox="0 0 100 48"
      className={`transition-opacity duration-1000 ${mode === 'night' ? 'opacity-0' : 'opacity-90'}`}
    >
      <path
        className="transition-colors duration-1000"
        d="M25 44 Q10 44 10 33 Q10 23 22 23 Q26 10 42 10 Q58 10 62 21 Q76 19 80 30 Q92 31 90 39 Q88 44 78 44 Z"
        style={{ fill: CLOUD_TINTS[mode] }}
        opacity="0.85"
      />
    </svg>
  </div>
)

/** Sun placement / look per time of day. At sunrise & sunset it hangs low over the mountains. */
const SUN_CFG: Record<Exclude<SceneMode, 'night'>, { top: string; topSm: string; size: number; color: string; glow: string }> = {
  day: { top: '9%', topSm: '2%', size: 104, color: '#ffd75e', glow: 'rgba(255, 200, 90, 0.5)' },
  sunrise: { top: '24%', topSm: '8%', size: 120, color: '#ffb3c1', glow: 'rgba(255, 170, 195, 0.5)' },
  sunset: { top: '29%', topSm: '10%', size: 132, color: '#ff9248', glow: 'rgba(255, 140, 70, 0.55)' },
}

const cycleMouseStyle = JSON.stringify({ width: '20px', height: '20px', color: 'rgba(255, 180, 60, 0.8)' })

/**
 * Sun (day / sunrise / sunset) or Moon + stars (night). Clicking the sun or the
 * moon cycles the scene through day → sunset → night → sunrise.
 */
const CelestialLayer = ({ mode, onCycle }: { mode: SceneMode; onCycle: () => void }) => {
  const { screenSize } = useStateContext()
  const stars = useMemo(() => makeStars(60), [])
  const isNight = mode === 'night'
  const md = (screenSize ?? 1024) >= 768
  const sun = SUN_CFG[isNight ? 'day' : mode]

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Stars */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isNight ? 'opacity-100' : 'opacity-0'}`}>
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
        {/* Shooting star */}
        <span
          className="absolute h-[2px] w-[90px] rounded-full"
          style={{
            left: '68%',
            top: '9%',
            background: 'linear-gradient(to left, rgba(255,255,255,0.95), transparent)',
            animation: 'shoot 9s ease-in 3s infinite',
          }}
        />
      </div>

      {/* Sun — click to change the time of day */}
      <button
        type="button"
        onClick={onCycle}
        aria-label="Change time of day"
        title="Click to change the time of day"
        className={`absolute cursor-none rounded-full transition-all duration-1000 ${
          isNight ? 'pointer-events-none translate-y-24 scale-75 opacity-0' : 'pointer-events-auto translate-y-0 scale-100 opacity-100'
        }`}
        style={{ left: '55%', top: md ? sun.top : sun.topSm, width: sun.size, height: sun.size }}
        data-mousecustom={cycleMouseStyle}
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: `0 0 60px 24px ${sun.glow}, 0 0 150px 64px ${sun.glow.replace(/[\d.]+\)$/, '0.22)')}`,
            transition: 'box-shadow 1s',
            animation: 'glow-breathe 7s ease-in-out infinite',
          }}
        />
        <span
          className="absolute inset-0 rounded-full transition-colors duration-1000"
          style={{ backgroundColor: sun.color }}
        />
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.75), transparent 62%)' }}
        />
      </button>

      {/* Moon — click to change the time of day */}
      <button
        type="button"
        onClick={onCycle}
        aria-label="Change time of day"
        title="Click to change the time of day"
        className={`absolute left-[56%] top-[2%] cursor-none transition-all duration-1000 md:top-[8%] ${
          isNight ? 'pointer-events-auto translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-24 scale-75 opacity-0'
        }`}
        data-mousecustom={cycleMouseStyle}
      >
        <svg
          viewBox="0 0 100 100"
          className="h-20 w-20 md:h-24 md:w-24"
          style={{ filter: 'drop-shadow(0 0 20px rgba(240, 235, 190, 0.55))' }}
        >
          <defs>
            <mask id="about-moon-cut">
              <rect width="100" height="100" fill="#fff" />
              <circle cx="68" cy="36" r="33" fill="#000" />
            </mask>
          </defs>
          <g mask="url(#about-moon-cut)">
            <circle cx="50" cy="50" r="38" fill="#f2ecc8" />
            <circle cx="34" cy="42" r="6" fill="#ddd5a8" />
            <circle cx="44" cy="66" r="8" fill="#e2dab0" />
            <circle cx="26" cy="60" r="4" fill="#ddd5a8" />
          </g>
        </svg>
      </button>

      {/* Clouds */}
      <Cloud top="10%" scale={1} dur={95} delay={-30} mode={mode} />
      <Cloud top="24%" scale={0.65} dur={130} delay={-85} mode={mode} />
    </div>
  )
}

export default CelestialLayer
