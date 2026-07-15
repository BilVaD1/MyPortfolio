import React from 'react'

import { SceneMode } from './types'

interface PlanePalette {
  body: string
  accent: string
  window: string
  trail: string
}

const PALETTES: Record<SceneMode, PlanePalette> = {
  day: { body: '#eef2f6', accent: '#c74634', window: '#7d8a99', trail: 'rgba(255, 255, 255, 0.55)' },
  night: { body: '#556188', accent: '#39456b', window: '#aab4d4', trail: 'rgba(190, 200, 235, 0.22)' },
  sunrise: { body: '#ffe9f0', accent: '#c76a8a', window: '#9a7f92', trail: 'rgba(255, 235, 244, 0.5)' },
  sunset: { body: '#ffdcb4', accent: '#b0543f', window: '#8a6a5a', trail: 'rgba(255, 225, 185, 0.45)' },
}

const fade = 'transition-colors duration-1000'

const PLANES = [
  { top: '7%', dur: 75, delay: -18, scale: 1, reverse: false },
  { top: '16%', dur: 95, delay: -55, scale: 0.62, reverse: true },
]

const Plane = ({
  cfg,
  palette,
  isNight,
}: {
  cfg: (typeof PLANES)[number]
  palette: PlanePalette
  isNight: boolean
}) => (
  <div
    className="absolute left-[-180px]"
    style={{
      top: cfg.top,
      animation: `bird-fly ${cfg.dur}s linear ${cfg.delay}s infinite ${cfg.reverse ? 'reverse' : ''}`,
    }}
  >
    <div className="relative" style={{ transform: cfg.reverse ? 'scaleX(-1)' : undefined }}>
      {/* Contrail */}
      <div
        className="absolute right-full top-1/2 h-[3px] w-[130px] -translate-y-1/2 rounded-full"
        style={{ background: `linear-gradient(to left, ${palette.trail}, transparent)`, transition: 'background 1s' }}
      />
      <svg width={110 * cfg.scale} viewBox="0 0 120 40" fill="none" className="overflow-visible">
        <path className={fade} d="M20 15 L 10 3 L 22 5 L 32 14 Z" style={{ fill: palette.accent }} />
        <path className={fade} d="M56 15 L 44 5 L 54 5 L 68 14 Z" style={{ fill: palette.accent }} />
        <path
          className={fade}
          d="M8 22 C 14 16 24 14 34 14 L 82 14 C 96 15 106 18 112 21 C 106 25 96 27 82 27 L 34 27 C 24 27 14 26 8 22 Z"
          style={{ fill: palette.body }}
        />
        <path className={fade} d="M52 21 L 30 36 L 44 36 L 68 22 Z" style={{ fill: palette.accent }} />
        <rect className={fade} x="38" y="17" width="42" height="3" rx="1.5" style={{ fill: palette.window }} opacity="0.85" />
        {isNight && <circle cx="113" cy="21" r="2.5" fill="#ff5a5a" style={{ animation: 'blink 1.4s linear infinite' }} />}
      </svg>
    </div>
  </div>
)

/** Small planes crossing the upper sky with contrails (blinking light at night). */
const PlanesLayer = ({ mode }: { mode: SceneMode }) => (
  <div className="absolute inset-x-0 top-0 h-[45%]">
    {PLANES.map((cfg, i) => (
      <Plane key={i} cfg={cfg} palette={PALETTES[mode]} isNight={mode === 'night'} />
    ))}
  </div>
)

export default PlanesLayer
