import React from 'react'

import { SceneMode } from './types'

interface House {
  x: number
  w: number
  h: number
}

const HOUSES: House[] = [
  { x: 60, w: 70, h: 60 },
  { x: 150, w: 55, h: 78 },
  { x: 225, w: 80, h: 55 },
  { x: 330, w: 60, h: 85 },
  { x: 410, w: 90, h: 62 },
  { x: 545, w: 65, h: 72 },
  { x: 645, w: 75, h: 58 },
  { x: 760, w: 60, h: 80 },
  { x: 850, w: 85, h: 60 },
  { x: 970, w: 65, h: 70 },
  { x: 1080, w: 75, h: 56 },
  { x: 1190, w: 60, h: 74 },
]

const GROUND_Y = 252

interface CityPalette {
  plateau: string
  cliff: string
  cliffShade: string
  walls: string[]
  roofs: string[]
  windowOff: string
  windowLit: string
  door: string
  tree: string
  trunk: string
  church: string
  spire: string
  lhBody: string
  lhStripe: string
  lamp: string
  lampGlows: boolean
  beams: boolean
  balloonFilter: string
  flameOpacity: number
  /** Which windows are lit: receives (houseIndex + windowIndex). */
  isLit: (n: number) => boolean
}

const PALETTES: Record<SceneMode, CityPalette> = {
  day: {
    plateau: '#9cb87f',
    cliff: '#8d7b6a',
    cliffShade: '#75655a',
    walls: ['#f6ead4', '#eed7c0', '#f3efdf', '#e4e9da', '#f0dcc8'],
    roofs: ['#c96f4a', '#a85638', '#bd6b4f', '#8f5244', '#b25c41'],
    windowOff: '#5d6f8a',
    windowLit: '#5d6f8a',
    door: '#7a5236',
    tree: '#4e7d4e',
    trunk: '#6b4a2f',
    church: '#f3ead8',
    spire: '#a85638',
    lhBody: '#f6f1e6',
    lhStripe: '#d9534f',
    lamp: '#fff3c4',
    lampGlows: false,
    beams: false,
    balloonFilter: '',
    flameOpacity: 0,
    isLit: () => false,
  },
  night: {
    plateau: '#141d3c',
    cliff: '#20284a',
    cliffShade: '#181f3a',
    walls: ['#262e52', '#2b3358', '#232b4d', '#293155', '#252d50'],
    roofs: ['#161d3a', '#131a34', '#181f3e', '#121831', '#171e3c'],
    windowOff: '#1a2140',
    windowLit: '#ffd27f',
    door: '#10162e',
    tree: '#1d2c48',
    trunk: '#141c36',
    church: '#272f54',
    spire: '#151c38',
    lhBody: '#2e365c',
    lhStripe: '#5c2f45',
    lamp: '#ffe27a',
    lampGlows: true,
    beams: true,
    balloonFilter: 'brightness(0.55) saturate(0.75)',
    flameOpacity: 1,
    isLit: (n) => n % 3 !== 0,
  },
  sunrise: {
    plateau: '#9aa585',
    cliff: '#8a6f74',
    cliffShade: '#6f575e',
    walls: ['#f8e3e6', '#f2d5cf', '#f9ece6', '#eedde0', '#f5dbd8'],
    roofs: ['#c76a6e', '#a85a6b', '#bb6a7d', '#8f5468', '#b25c6e'],
    windowOff: '#7a6a8a',
    windowLit: '#ffd9a0',
    door: '#7a5266',
    tree: '#4e6b5c',
    trunk: '#6b4a3f',
    church: '#f5e6e6',
    spire: '#a85a6b',
    lhBody: '#f8eef0',
    lhStripe: '#d9536f',
    lamp: '#ffe9c4',
    lampGlows: false,
    beams: false,
    balloonFilter: 'brightness(0.95)',
    flameOpacity: 0,
    isLit: (n) => n % 5 === 0,
  },
  sunset: {
    plateau: '#8a8560',
    cliff: '#7d5a4f',
    cliffShade: '#644739',
    walls: ['#e8c9a8', '#dfb894', '#eed4b4', '#dcc0a0', '#e5c39d'],
    roofs: ['#8f4632', '#7a3a2a', '#a04f38', '#6e3526', '#94422e'],
    windowOff: '#4a3a52',
    windowLit: '#ffc46b',
    door: '#5c3a2f',
    tree: '#4a5238',
    trunk: '#4f3628',
    church: '#e8d4b8',
    spire: '#7a3a2a',
    lhBody: '#efe0d0',
    lhStripe: '#c74634',
    lamp: '#ffe27a',
    lampGlows: true,
    beams: false,
    balloonFilter: 'brightness(0.85) sepia(0.2)',
    flameOpacity: 0.7,
    isLit: (n) => n % 4 !== 0,
  },
}

const fade = 'transition-colors duration-1000'

const CLIFF_FACETS = [
  'M100 262 L160 262 L145 320 L80 320 Z',
  'M420 260 L470 260 L490 320 L430 320 Z',
  'M760 262 L820 262 L800 320 L745 320 Z',
  'M1090 260 L1140 260 L1160 320 L1105 320 Z',
  'M1320 260 L1370 260 L1355 320 L1300 320 Z',
]

const Balloon = ({
  left,
  bottom,
  width,
  dur,
  delay,
  colors,
  palette,
}: {
  left: string
  bottom: string
  width: number
  dur: number
  delay: number
  colors: [string, string]
  palette: CityPalette
}) => (
  <div
    className="absolute"
    style={{ left, bottom, animation: `balloon-float ${dur}s ease-in-out ${delay}s infinite alternate` }}
  >
    <svg
      width={width}
      viewBox="0 0 100 118"
      fill="none"
      className="overflow-visible"
      style={{ filter: palette.balloonFilter || undefined, transition: 'filter 1s' }}
    >
      <path
        d="M50 4 C 27 4 12 22 12 44 C 12 64 30 80 40 92 L 60 92 C 70 80 88 64 88 44 C 88 22 73 4 50 4 Z"
        fill={colors[0]}
      />
      <path
        d="M50 4 C 42 4 36 22 36 44 C 36 66 43 82 46 92 L 54 92 C 57 82 64 66 64 44 C 64 22 58 4 50 4 Z"
        fill={colors[1]}
      />
      <path d="M40 92 L44 104 M60 92 L56 104" stroke="#6b4a2f" strokeWidth="1.6" />
      <rect x="42" y="104" width="16" height="12" rx="2.5" fill="#8a5a2b" />
    </svg>
    {/* Burner flame — visible at night / dusk */}
    <span
      className="absolute rounded-full transition-opacity duration-1000"
      style={{
        left: '46%',
        bottom: width * 0.21,
        width: width * 0.09,
        height: width * 0.09,
        opacity: palette.flameOpacity,
        background: '#ffb347',
        boxShadow: '0 0 10px 4px rgba(255, 179, 71, 0.6)',
        animation: 'flame-flicker 1.6s ease-in-out infinite',
      }}
    />
  </div>
)

/** Cozy town on a rocky cliff over the sea: houses, church, lighthouse and hot-air balloons. */
const CityLayer = ({ mode }: { mode: SceneMode }) => {
  const p = PALETTES[mode]

  return (
    <div className="absolute inset-x-0 bottom-0 h-full">
      <svg viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 h-full w-full">
        {/* Grass plateau the town stands on */}
        <path
          className={fade}
          d="M0 320 L0 250 Q 180 244 360 249 T 720 247 T 1080 250 T 1440 247 L1440 320 Z"
          style={{ fill: p.plateau }}
        />
        {/* Rocky cliff face dropping to the sea */}
        <path
          className={fade}
          d="M0 320 L0 262 Q 120 258 240 261 T 480 259 T 720 261 T 960 259 T 1200 261 T 1440 259 L1440 320 Z"
          style={{ fill: p.cliff }}
        />
        {CLIFF_FACETS.map((d) => (
          <path key={d} className={fade} d={d} style={{ fill: p.cliffShade }} opacity="0.85" />
        ))}
        <path
          d="M60 268 L52 320 M340 266 L352 320 M620 268 L610 320 M900 266 L912 320 M1180 268 L1170 320"
          className={fade}
          style={{ stroke: p.cliffShade }}
          strokeWidth="2"
          opacity="0.7"
        />

        {/* Trees */}
        {[30, 640, 1150].map((tx) => (
          <g key={tx}>
            <rect className={fade} x={tx + 13} y={GROUND_Y - 16} width="5" height="18" style={{ fill: p.trunk }} />
            <circle className={fade} cx={tx + 15.5} cy={GROUND_Y - 24} r="15" style={{ fill: p.tree }} />
          </g>
        ))}

        {/* Houses */}
        {HOUSES.map((house, i) => {
          const wall = p.walls[i % p.walls.length]
          const roof = p.roofs[i % p.roofs.length]
          const roofH = Math.min(34, house.w * 0.5)
          const top = GROUND_Y - house.h
          const winY = top + house.h * 0.3
          const winXs = [house.x + house.w * 0.2, house.x + house.w * 0.62]
          return (
            <g key={i}>
              <rect className={fade} x={house.x} y={top} width={house.w} height={house.h} style={{ fill: wall }} />
              <polygon
                className={fade}
                points={`${house.x - 7},${top} ${house.x + house.w + 7},${top} ${house.x + house.w / 2},${top - roofH}`}
                style={{ fill: roof }}
              />
              {winXs.map((wx, j) => {
                const lit = p.isLit(i + j)
                return (
                  <rect
                    key={j}
                    className={fade}
                    x={wx}
                    y={winY}
                    width="10"
                    height="12"
                    rx="1.5"
                    style={{
                      fill: lit ? p.windowLit : p.windowOff,
                      filter: lit ? `drop-shadow(0 0 4px ${p.windowLit})` : undefined,
                    }}
                  />
                )
              })}
              {i % 3 === 0 && (
                <rect
                  className={fade}
                  x={house.x + house.w / 2 - 6}
                  y={GROUND_Y - 20}
                  width="12"
                  height="20"
                  rx="2"
                  style={{ fill: p.door }}
                />
              )}
            </g>
          )
        })}

        {/* Church tower */}
        <g>
          <rect className={fade} x="468" y="190" width="36" height="62" style={{ fill: p.church }} />
          <polygon className={fade} points="462,190 510,190 486,148" style={{ fill: p.spire }} />
          <circle className={fade} cx="486" cy="208" r="7" style={{ fill: mode === 'night' ? '#c8cfe8' : '#fffdf4' }} />
          <path
            d="M486 208 L486 203 M486 208 L490 210"
            stroke={mode === 'night' ? '#333c60' : '#6b6250'}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>

        {/* Lighthouse */}
        <g>
          {p.beams && (
            <>
              <polygon points="1325,164 1120,118 1120,192" fill="#ffe9a8" style={{ animation: 'beam-pulse 5s ease-in-out infinite' }} />
              <polygon points="1325,164 1440,132 1440,206" fill="#ffe9a8" style={{ animation: 'beam-pulse 5s ease-in-out 2.5s infinite' }} />
            </>
          )}
          <polygon className={fade} points="1306,252 1312,175 1338,175 1344,252" style={{ fill: p.lhBody }} />
          <rect className={fade} x="1309" y="196" width="32" height="14" style={{ fill: p.lhStripe }} />
          <rect className={fade} x="1307" y="226" width="36" height="14" style={{ fill: p.lhStripe }} />
          <rect className={fade} x="1314" y="158" width="22" height="17" style={{ fill: mode === 'night' ? '#1c2445' : '#3a3f4a' }} />
          <circle
            className={fade}
            cx="1325"
            cy="166"
            r="6"
            style={{ fill: p.lamp, filter: p.lampGlows ? 'drop-shadow(0 0 6px rgba(255, 226, 122, 0.9))' : undefined }}
          />
          <polygon className={fade} points="1310,158 1340,158 1325,144" style={{ fill: mode === 'night' ? '#151c38' : p.spire }} />
        </g>
      </svg>

      {/* Hot-air balloons — clustered in the open sky between the text panel and the avatar */}
      <Balloon left="49%" bottom="46%" width={54} dur={7} delay={0} colors={['#e63946', '#f1c453']} palette={p} />
      <Balloon left="59%" bottom="64%" width={40} dur={9} delay={-3} colors={['#457b9d', '#f4f1de']} palette={p} />
      <Balloon left="67%" bottom="50%" width={48} dur={8} delay={-5.5} colors={['#e76f51', '#e9c46a']} palette={p} />
    </div>
  )
}

export default CityLayer
