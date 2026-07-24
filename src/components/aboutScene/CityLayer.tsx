import React, { useEffect, useState } from 'react'

import { SceneMode } from './types'

/** What shows through the glass of a window. */
type WindowContent = 'plain' | 'curtains' | 'blinds' | 'plant' | 'cat'

interface House {
  x: number
  w: number
  h: number
  /** Facade cladding — brick, clapboard siding, plain stucco, fachwerk timber or a stone ground floor. */
  texture: 'brick' | 'siding' | 'stucco' | 'timber' | 'stone'
  roof: 'gable' | 'hip'
  /** Window storeys. */
  rows: 1 | 2
  /** Window dressing, cycled across the windows. */
  win: WindowContent[]
  door?: boolean
  chimney?: boolean
  /** Little roof dormer with its own window. */
  dormer?: boolean
  /** Round oculus window up in the gable. */
  attic?: boolean
  shutters?: boolean
  /** Arched windows, echoing the clock tower's lancet. */
  arched?: boolean
  /** Shop front: big display window with a striped awning. */
  shop?: boolean
  /** Dressed corner stones like the tower's. */
  quoins?: boolean
  antenna?: boolean
}

const HOUSES: House[] = [
  { x: 60, w: 70, h: 60, texture: 'brick', roof: 'gable', rows: 1, win: ['curtains', 'plant'], door: true, chimney: true, shutters: true },
  { x: 150, w: 55, h: 78, texture: 'timber', roof: 'gable', rows: 2, win: ['blinds', 'curtains', 'plant'], attic: true },
  { x: 225, w: 80, h: 55, texture: 'siding', roof: 'hip', rows: 1, win: ['plant', 'curtains', 'blinds'], door: true, shutters: true, antenna: true },
  { x: 330, w: 60, h: 85, texture: 'stone', roof: 'gable', rows: 2, win: ['curtains', 'blinds'], arched: true, attic: true },
  { x: 410, w: 90, h: 62, texture: 'brick', roof: 'hip', rows: 1, win: ['curtains', 'plant', 'curtains'], door: true, dormer: true, chimney: true },
  { x: 545, w: 65, h: 72, texture: 'timber', roof: 'gable', rows: 2, win: ['plant', 'curtains'], door: true },
  { x: 645, w: 75, h: 58, texture: 'siding', roof: 'gable', rows: 1, win: ['plant', 'cat', 'curtains'], chimney: true, shutters: true },
  { x: 760, w: 60, h: 80, texture: 'stucco', roof: 'gable', rows: 1, win: ['blinds', 'plain'] },
  { x: 850, w: 85, h: 60, texture: 'brick', roof: 'gable', rows: 1, win: ['curtains', 'curtains'], door: true, shop: true },
  { x: 970, w: 65, h: 70, texture: 'stucco', roof: 'gable', rows: 1, win: ['curtains', 'plant'], arched: true, attic: true, quoins: true },
  { x: 1080, w: 75, h: 56, texture: 'siding', roof: 'hip', rows: 1, win: ['plant', 'blinds', 'curtains'], door: true, shutters: true, antenna: true },
  { x: 1190, w: 60, h: 74, texture: 'timber', roof: 'gable', rows: 2, win: ['curtains', 'plant'], door: true, chimney: true },
]

/** Picket fences (parkans) filling the gaps between the houses. */
const FENCES: [number, number][] = [
  [132, 149],
  [207, 223],
  [307, 328],
  [503, 541],
  [613, 641],
  [723, 757],
  [937, 967],
  [1038, 1077],
  [1253, 1292],
]

const BUSHES = [
  { x: 154, r: 5 },
  { x: 399, r: 5.5 },
  { x: 543, r: 4.5 },
  { x: 935, r: 5 },
  { x: 1078, r: 4.5 },
  { x: 1256, r: 5.5 },
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
  /** Mortar joints, window frames, sills and cladding seams. */
  wallShade: string
  /** Fachwerk beam colour. */
  timber: string
  shutter: string
  /** Curtain fabric seen through the glass. */
  curtain: string
  fence: string
  fenceShade: string
  tree: string
  trunk: string
  church: string
  spire: string
  /** Clock tower masonry + slate spire + illuminated dial. */
  stone: string
  stoneShade: string
  stoneLight: string
  towerRoof: string
  towerRoofLight: string
  clockFace: string
  clockRim: string
  clockDial: string
  clockHands: string
  clockSecond: string
  clockGlows: boolean
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
    wallShade: '#b9a081',
    timber: '#6b4a2f',
    shutter: '#5d7a52',
    curtain: '#d97f6a',
    fence: '#efe3c6',
    fenceShade: '#b3a180',
    tree: '#4e7d4e',
    trunk: '#6b4a2f',
    church: '#f3ead8',
    spire: '#a85638',
    stone: '#dccdae',
    stoneShade: '#ab9575',
    stoneLight: '#efe4c8',
    towerRoof: '#586977',
    towerRoofLight: '#728490',
    clockFace: '#f6efdd',
    clockRim: '#b28a3c',
    clockDial: '#3a3326',
    clockHands: '#2a2318',
    clockSecond: '#b0402a',
    clockGlows: false,
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
    wallShade: '#3a4270',
    timber: '#151c38',
    shutter: '#1e2749',
    curtain: '#c07440',
    fence: '#2e365e',
    fenceShade: '#1b2242',
    tree: '#1d2c48',
    trunk: '#141c36',
    church: '#272f54',
    spire: '#151c38',
    stone: '#2b3357',
    stoneShade: '#1c2340',
    stoneLight: '#3a4470',
    towerRoof: '#161d3a',
    towerRoofLight: '#232c52',
    clockFace: '#ffe6a0',
    clockRim: '#caa24e',
    clockDial: '#5a4a20',
    clockHands: '#3a2f12',
    clockSecond: '#c85a3a',
    clockGlows: true,
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
    wallShade: '#c3a2a6',
    timber: '#6f575e',
    shutter: '#5c7a6a',
    curtain: '#d87f92',
    fence: '#f4e6e8',
    fenceShade: '#bb9c9f',
    tree: '#4e6b5c',
    trunk: '#6b4a3f',
    church: '#f5e6e6',
    spire: '#a85a6b',
    stone: '#e6d2ce',
    stoneShade: '#bb9f9b',
    stoneLight: '#f5e6e1',
    towerRoof: '#6a5c72',
    towerRoofLight: '#877690',
    clockFace: '#faeede',
    clockRim: '#c08a5a',
    clockDial: '#5a4436',
    clockHands: '#3a2c24',
    clockSecond: '#c25a4a',
    clockGlows: false,
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
    wallShade: '#a87f58',
    timber: '#4f3628',
    shutter: '#55603f',
    curtain: '#c2604a',
    fence: '#e6cba4',
    fenceShade: '#a87c54',
    tree: '#4a5238',
    trunk: '#4f3628',
    church: '#e8d4b8',
    spire: '#7a3a2a',
    stone: '#d9b78f',
    stoneShade: '#a67c56',
    stoneLight: '#eccaa2',
    towerRoof: '#453b48',
    towerRoofLight: '#5e5162',
    clockFace: '#f7e4c2',
    clockRim: '#bd7d38',
    clockDial: '#4a3524',
    clockHands: '#3a2718',
    clockSecond: '#c14a20',
    clockGlows: true,
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

/** Whatever lives behind the glass — curtains, blinds, a potted plant or the town cat. */
const WindowDressing = ({ wx, wy, p, content }: { wx: number; wy: number; p: CityPalette; content: WindowContent }) => {
  switch (content) {
    case 'curtains':
      return (
        <g className={fade} style={{ fill: p.curtain }}>
          <path d={`M${wx} ${wy} L${wx + 3.4} ${wy} Q${wx + 1.6} ${wy + 4.5} ${wx + 1.3} ${wy + 10.5} L${wx} ${wy + 10.5} Z`} />
          <path d={`M${wx + 10} ${wy} L${wx + 6.6} ${wy} Q${wx + 8.4} ${wy + 4.5} ${wx + 8.7} ${wy + 10.5} L${wx + 10} ${wy + 10.5} Z`} />
          <rect x={wx} y={wy} width="10" height="1.6" />
        </g>
      )
    case 'blinds':
      return (
        <path
          className={fade}
          d={`M${wx + 0.6} ${wy + 2.2} H${wx + 9.4} M${wx + 0.6} ${wy + 4.4} H${wx + 9.4} M${wx + 0.6} ${wy + 6.6} H${wx + 9.4}`}
          style={{ stroke: p.wallShade }}
          strokeWidth="1"
          opacity="0.9"
          fill="none"
        />
      )
    case 'plant':
      return (
        <g>
          <circle className={fade} cx={wx + 3.6} cy={wy + 8} r="1.5" style={{ fill: p.tree }} />
          <circle className={fade} cx={wx + 6.4} cy={wy + 8} r="1.5" style={{ fill: p.tree }} />
          <circle className={fade} cx={wx + 5} cy={wy + 6.8} r="1.9" style={{ fill: p.tree }} />
          <polygon
            className={fade}
            points={`${wx + 3.1},${wy + 9.2} ${wx + 6.9},${wy + 9.2} ${wx + 6.3},${wy + 12} ${wx + 3.7},${wy + 12}`}
            style={{ fill: p.door }}
          />
        </g>
      )
    case 'cat':
      return (
        <g className={fade} style={{ fill: p.door }}>
          <path
            d={`M${wx + 3.9} ${wy + 11} q-1.9 -0.6 -1.1 -2.8`}
            className={fade}
            style={{ stroke: p.door }}
            strokeWidth="1.1"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx={wx + 6.4} cy={wy + 10} rx="2.5" ry="2" />
          <circle cx={wx + 6.4} cy={wy + 6.9} r="1.8" />
          <polygon points={`${wx + 4.9},${wy + 6} ${wx + 5.5},${wy + 4.4} ${wx + 6.2},${wy + 5.6}`} />
          <polygon points={`${wx + 6.6},${wy + 5.6} ${wx + 7.3},${wy + 4.4} ${wx + 7.9},${wy + 6}`} />
        </g>
      )
    default:
      return null
  }
}

/** A framed house window: frame, glass, dressing, mullion cross and sill (optionally arched / shuttered). */
const TownWindow = ({
  p,
  wx,
  wy,
  lit,
  content = 'plain',
  arched,
  shutters,
}: {
  p: CityPalette
  wx: number
  wy: number
  lit: boolean
  content?: WindowContent
  arched?: boolean
  shutters?: boolean
}) => (
  <g>
    {shutters && (
      <>
        <rect className={fade} x={wx - 5.8} y={wy - 0.6} width="4.2" height="13.2" rx="0.8" style={{ fill: p.shutter }} />
        <rect className={fade} x={wx + 11.6} y={wy - 0.6} width="4.2" height="13.2" rx="0.8" style={{ fill: p.shutter }} />
      </>
    )}
    {arched ? (
      <path
        className={fade}
        d={`M${wx - 1.6} ${wy + 13.2} L${wx - 1.6} ${wy + 5} A6.6 6.6 0 0 1 ${wx + 11.6} ${wy + 5} L${wx + 11.6} ${wy + 13.2} Z`}
        style={{ fill: p.wallShade }}
      />
    ) : (
      <rect className={fade} x={wx - 1.4} y={wy - 1.4} width="12.8" height="14.6" rx="1.6" style={{ fill: p.wallShade }} />
    )}
    <g style={{ filter: lit ? `drop-shadow(0 0 4px ${p.windowLit})` : undefined, transition: 'filter 1s' }}>
      {arched ? (
        <path
          className={fade}
          d={`M${wx} ${wy + 12} L${wx} ${wy + 5} A5 5 0 0 1 ${wx + 10} ${wy + 5} L${wx + 10} ${wy + 12} Z`}
          style={{ fill: lit ? p.windowLit : p.windowOff }}
        />
      ) : (
        <rect className={fade} x={wx} y={wy} width="10" height="12" rx="1" style={{ fill: lit ? p.windowLit : p.windowOff }} />
      )}
      <WindowDressing wx={wx} wy={wy} p={p} content={content} />
      <path
        className={fade}
        d={`M${wx + 5} ${wy} V${wy + 12} M${wx} ${wy + 5.4} H${wx + 10}`}
        style={{ stroke: p.wallShade }}
        strokeWidth="0.8"
        opacity="0.9"
        fill="none"
      />
    </g>
    <rect className={fade} x={wx - 2.4} y={wy + 13.2} width="14.8" height="1.6" style={{ fill: p.wallShade }} />
  </g>
)

/** A stretch of picket fence between two houses. */
const Fence = ({ x1, x2, p }: { x1: number; x2: number; p: CityPalette }) => {
  const pickets: number[] = []
  for (let px = x1 + 1; px + 3.2 <= x2 - 1; px += 6) pickets.push(px)
  return (
    <g>
      <rect className={fade} x={x1 + 1} y={GROUND_Y - 11.5} width={x2 - x1 - 2} height="1.8" style={{ fill: p.fenceShade }} />
      <rect className={fade} x={x1 + 1} y={GROUND_Y - 6} width={x2 - x1 - 2} height="1.8" style={{ fill: p.fenceShade }} />
      {pickets.map((px) => (
        <polygon
          key={px}
          className={fade}
          points={`${px},${GROUND_Y} ${px},${GROUND_Y - 12.5} ${px + 1.6},${GROUND_Y - 15} ${px + 3.2},${GROUND_Y - 12.5} ${px + 3.2},${GROUND_Y}`}
          style={{ fill: p.fence, stroke: p.fenceShade }}
          strokeWidth="0.5"
        />
      ))}
    </g>
  )
}

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

const TOWER_CX = 486
const CLOCK_CY = 107
/** Slide the whole tower right, into the open sky between the text panel and the photo. */
const TOWER_SHIFT = 320

/** The three clock hands, ticking once a second at the viewer's local time. */
const ClockHands = ({ p }: { p: CityPalette }) => {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const s = now.getSeconds()
  const m = now.getMinutes()
  const h = now.getHours() % 12
  const hourDeg = h * 30 + m * 0.5
  const minDeg = m * 6 + s * 0.1
  const secDeg = s * 6

  return (
    <g strokeLinecap="round">
      {/* hour */}
      <line
        x1={TOWER_CX}
        y1={CLOCK_CY}
        x2={TOWER_CX}
        y2={CLOCK_CY - 8.5}
        transform={`rotate(${hourDeg} ${TOWER_CX} ${CLOCK_CY})`}
        stroke={p.clockHands}
        strokeWidth="2.4"
      />
      {/* minute */}
      <line
        x1={TOWER_CX}
        y1={CLOCK_CY}
        x2={TOWER_CX}
        y2={CLOCK_CY - 12.6}
        transform={`rotate(${minDeg} ${TOWER_CX} ${CLOCK_CY})`}
        stroke={p.clockHands}
        strokeWidth="1.6"
      />
      {/* second (with a short counterweight tail) */}
      <line
        x1={TOWER_CX}
        y1={CLOCK_CY + 3.4}
        x2={TOWER_CX}
        y2={CLOCK_CY - 13.4}
        transform={`rotate(${secDeg} ${TOWER_CX} ${CLOCK_CY})`}
        stroke={p.clockSecond}
        strokeWidth="0.8"
      />
      <circle cx={TOWER_CX} cy={CLOCK_CY} r="1.7" style={{ fill: p.clockHands }} />
      <circle cx={TOWER_CX} cy={CLOCK_CY} r="0.8" style={{ fill: p.clockSecond }} />
    </g>
  )
}

/** A tall stone clock tower: masonry shaft with quoins, a belfry clock and a slate spire. */
const ClockTower = ({ p }: { p: CityPalette }) => (
  <g transform={`translate(${TOWER_SHIFT} 0)`}>
    {/* Foundation & stepped plinth */}
    <rect className={fade} x="452" y="242" width="68" height="10" style={{ fill: p.stoneShade }} />
    <rect className={fade} x="457" y="234" width="58" height="9" style={{ fill: p.stoneLight }} />

    {/* Masonry shaft */}
    <rect x="462" y="132" width="48" height="102" fill="url(#tower-stone)" />
    {/* Corner quoins — dressed stones catching / losing the light */}
    {Array.from({ length: 7 }).map((_, i) => {
      const y = 132 + i * 14.6
      const light = i % 2 === 0
      return (
        <g key={i}>
          <rect
            className={fade}
            x="462"
            y={y}
            width="9"
            height="14.6"
            style={{ fill: light ? p.stoneLight : p.stone, stroke: p.stoneShade }}
            strokeWidth="0.5"
          />
          <rect
            className={fade}
            x="501"
            y={y}
            width="9"
            height="14.6"
            style={{ fill: light ? p.stone : p.stoneLight, stroke: p.stoneShade }}
            strokeWidth="0.5"
          />
        </g>
      )
    })}
    {/* Tall lancet window — glows at dusk / night */}
    <path className={fade} d="M478 210 L478 172 A8 8 0 0 1 494 172 L494 210 Z" style={{ fill: p.stoneShade }} />
    <path
      className={fade}
      d="M480 209 L480 173 A6 6 0 0 1 492 173 L492 209 Z"
      style={{
        fill: p.clockGlows ? p.windowLit : p.windowOff,
        filter: p.clockGlows ? `drop-shadow(0 0 3px ${p.windowLit})` : undefined,
      }}
    />
    {/* Volume shading over the shaft (lit left, shaded right) */}
    <rect x="462" y="132" width="48" height="102" fill="url(#tower-shade)" />

    {/* Projecting string course below the clock */}
    <rect className={fade} x="458" y="126" width="56" height="6" style={{ fill: p.stoneLight }} />

    {/* Belfry / clock stage */}
    <rect x="461" y="88" width="50" height="38" fill="url(#tower-stone)" />
    <rect className={fade} x="461" y="88" width="6" height="38" style={{ fill: p.stoneLight }} opacity="0.6" />
    <rect className={fade} x="505" y="88" width="6" height="38" style={{ fill: p.stoneShade }} opacity="0.5" />
    <rect x="461" y="88" width="50" height="38" fill="url(#tower-shade)" />

    {/* Upper cornice */}
    <rect className={fade} x="456" y="80" width="60" height="8" style={{ fill: p.stoneLight }} />

    {/* Slate spire — two facets for a 3D ridge, with shingle courses */}
    <polygon className={fade} points={`${TOWER_CX},38 456,80 ${TOWER_CX},80`} style={{ fill: p.towerRoofLight }} />
    <polygon className={fade} points={`${TOWER_CX},38 ${TOWER_CX},80 516,80`} style={{ fill: p.towerRoof }} />
    <path
      className={fade}
      d="M468.9 56 H503.1 M477.4 68 H494.6"
      style={{ stroke: p.towerRoofLight }}
      strokeWidth="0.7"
      opacity="0.45"
    />
    {/* Finial */}
    <line
      className={fade}
      x1={TOWER_CX}
      y1="40"
      x2={TOWER_CX}
      y2="24"
      style={{ stroke: p.clockRim }}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <circle className={fade} cx={TOWER_CX} cy="40" r="3" style={{ fill: p.clockRim }} />
    <circle className={fade} cx={TOWER_CX} cy="22.5" r="2" style={{ fill: p.clockRim }} />

    {/* Clock face */}
    <g
      style={{
        filter: p.clockGlows ? 'drop-shadow(0 0 5px rgba(255, 222, 140, 0.85))' : undefined,
        transition: 'filter 1s',
      }}
    >
      <circle className={fade} cx={TOWER_CX} cy={CLOCK_CY} r="17" style={{ fill: p.clockRim }} />
      <circle className={fade} cx={TOWER_CX} cy={CLOCK_CY} r="15.3" style={{ fill: p.clockFace }} />
      {/* Hour ticks — the four cardinals bolder */}
      {Array.from({ length: 12 }).map((_, i) => {
        const ang = (i * 30 * Math.PI) / 180
        const major = i % 3 === 0
        const outer = 14.4
        const inner = major ? 10.8 : 12.4
        return (
          <line
            key={i}
            x1={TOWER_CX + Math.sin(ang) * inner}
            y1={CLOCK_CY - Math.cos(ang) * inner}
            x2={TOWER_CX + Math.sin(ang) * outer}
            y2={CLOCK_CY - Math.cos(ang) * outer}
            className={fade}
            style={{ stroke: p.clockDial }}
            strokeWidth={major ? 1.4 : 0.8}
            strokeLinecap="round"
          />
        )
      })}
      <ClockHands p={p} />
    </g>
  </g>
)

/** Cozy town on a rocky cliff over the sea: textured houses, picket fences, clock tower, lighthouse and hot-air balloons. */
const CityLayer = ({ mode }: { mode: SceneMode }) => {
  const p = PALETTES[mode]

  return (
    <div className="absolute inset-x-0 bottom-0 h-full">
      <svg viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 h-full w-full">
        <defs>
          {/* Ashlar masonry (running bond) for the clock tower */}
          <pattern id="tower-stone" x="0" y="0" width="26" height="14" patternUnits="userSpaceOnUse">
            <rect className={fade} width="26" height="14" style={{ fill: p.stone }} />
            <path
              className={fade}
              d="M0 7 H26 M0 14 H26 M13 0 V7 M6.5 7 V14 M19.5 7 V14"
              style={{ stroke: p.stoneShade }}
              strokeWidth="1"
              opacity="0.65"
            />
            <rect className={fade} x="0.8" y="0.8" width="11.4" height="5.4" style={{ fill: p.stoneLight }} opacity="0.2" />
            <rect className={fade} x="13.8" y="7.8" width="11.4" height="5.4" style={{ fill: p.stoneLight }} opacity="0.14" />
          </pattern>
          {/* Left-lit / right-shaded overlay to give the tower cylindrical volume */}
          <linearGradient id="tower-shade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="0.42" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.6" stopColor="#000000" stopOpacity="0" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.22" />
          </linearGradient>
          {/* Transparent cladding overlays — laid over each house's own wall colour */}
          <pattern id="house-brick" x="0" y="0" width="14" height="8" patternUnits="userSpaceOnUse">
            <path
              className={fade}
              d="M0 0 H14 M0 4 H14 M7 0 V4 M3.5 4 V8 M10.5 4 V8"
              style={{ stroke: p.wallShade }}
              strokeWidth="0.7"
              opacity="0.4"
              fill="none"
            />
          </pattern>
          <pattern id="house-siding" x="0" y="0" width="16" height="5" patternUnits="userSpaceOnUse">
            <path className={fade} d="M0 4.5 H16" style={{ stroke: p.wallShade }} strokeWidth="0.8" opacity="0.38" fill="none" />
          </pattern>
          <pattern id="house-stucco" x="0" y="0" width="18" height="16" patternUnits="userSpaceOnUse">
            <g className={fade} style={{ fill: p.wallShade }} opacity="0.22">
              <circle cx="4" cy="4" r="0.7" />
              <circle cx="13" cy="7" r="0.55" />
              <circle cx="8" cy="13" r="0.65" />
              <circle cx="16" cy="2" r="0.5" />
            </g>
          </pattern>
          {/* Shingle courses for the house roofs — mode-agnostic shadow lines */}
          <pattern id="roof-shingle" x="0" y="0" width="10" height="4.6" patternUnits="userSpaceOnUse">
            <path d="M0 4.2 H10" stroke="#000" strokeWidth="0.7" opacity="0.16" fill="none" />
          </pattern>
        </defs>
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
          const apexX = house.x + house.w / 2
          const ridgeY = house.roof === 'hip' ? top - roofH * 0.8 : top - roofH
          const roofPts =
            house.roof === 'hip'
              ? `${house.x - 7},${top} ${house.x + house.w + 7},${top} ${house.x + house.w - 13},${ridgeY} ${house.x + 13},${ridgeY}`
              : `${house.x - 7},${top} ${house.x + house.w + 7},${top} ${apexX},${ridgeY}`
          const winXs = house.shop
            ? [house.x + house.w * 0.18, house.x + house.w * 0.62]
            : house.w >= 75
              ? [house.x + house.w * 0.14, house.x + house.w * 0.43, house.x + house.w * 0.72]
              : [house.x + house.w * 0.2, house.x + house.w * 0.62]
          const rowYs = house.shop
            ? [top + 5]
            : house.rows === 2
              ? [top + house.h * 0.16, top + house.h * 0.55]
              : [top + house.h * 0.3]
          const chimneyX = house.x + house.w * 0.72
          const chimneyBase =
            house.roof === 'hip' ? ridgeY + 6 : top - roofH + ((chimneyX - apexX) / (house.w / 2 + 7)) * roofH + 4
          const doorX = house.shop ? house.x + house.w * 0.78 : apexX
          const dormerY = top - roofH * 0.62
          const shopLit = house.shop ? p.isLit(i * 2 + 1) : false
          return (
            <g key={i}>
              {/* Walls + cladding */}
              <rect className={fade} x={house.x} y={top} width={house.w} height={house.h} style={{ fill: wall }} />
              {house.texture === 'brick' && (
                <rect x={house.x} y={top} width={house.w} height={house.h} fill="url(#house-brick)" />
              )}
              {house.texture === 'siding' && (
                <rect x={house.x} y={top} width={house.w} height={house.h} fill="url(#house-siding)" />
              )}
              {(house.texture === 'stucco' || house.texture === 'stone' || house.texture === 'timber') && (
                <rect x={house.x} y={top} width={house.w} height={house.h} fill="url(#house-stucco)" />
              )}
              {/* Stone ground floor in the tower's masonry, with a string course */}
              {house.texture === 'stone' && (
                <>
                  <rect x={house.x} y={top + house.h * 0.5} width={house.w} height={house.h * 0.5} fill="url(#tower-stone)" />
                  <rect
                    className={fade}
                    x={house.x - 1.5}
                    y={top + house.h * 0.5 - 2}
                    width={house.w + 3}
                    height="2.6"
                    style={{ fill: p.stoneLight }}
                  />
                </>
              )}
              {/* Fachwerk timber frame */}
              {house.texture === 'timber' && (
                <g>
                  <g className={fade} style={{ fill: p.timber }}>
                    <rect x={house.x} y={top} width="2.6" height={house.h} />
                    <rect x={house.x + house.w - 2.6} y={top} width="2.6" height={house.h} />
                    <rect x={house.x} y={top} width={house.w} height="2.6" />
                    <rect x={house.x} y={top + house.h * 0.47} width={house.w} height="2.2" />
                    <rect x={apexX - 1.1} y={top} width="2.2" height={house.h * 0.47} />
                  </g>
                  <path
                    className={fade}
                    d={`M${house.x + 2.2} ${top + house.h} L${house.x + house.w * 0.3} ${top + house.h * 0.52} M${house.x + house.w - 2.2} ${top + house.h} L${house.x + house.w * 0.7} ${top + house.h * 0.52}`}
                    style={{ stroke: p.timber }}
                    strokeWidth="2.2"
                    fill="none"
                  />
                </g>
              )}
              {/* Corner quoins, like the tower's */}
              {house.quoins &&
                Array.from({ length: 6 }).map((_, k) => {
                  const qh = house.h / 6
                  const qy = top + k * qh
                  return (
                    <g key={k}>
                      <rect
                        className={fade}
                        x={house.x}
                        y={qy}
                        width="5.5"
                        height={qh}
                        style={{ fill: k % 2 === 0 ? p.stoneLight : p.stone, stroke: p.stoneShade }}
                        strokeWidth="0.4"
                      />
                      <rect
                        className={fade}
                        x={house.x + house.w - 5.5}
                        y={qy}
                        width="5.5"
                        height={qh}
                        style={{ fill: k % 2 === 0 ? p.stone : p.stoneLight, stroke: p.stoneShade }}
                        strokeWidth="0.4"
                      />
                    </g>
                  )
                })}
              {/* Chimney — drawn before the roof so its base tucks behind the slope */}
              {house.chimney && (
                <g>
                  <rect className={fade} x={chimneyX - 4} y={chimneyBase - 16} width="8" height="16" style={{ fill: p.stone }} />
                  <rect className={fade} x={chimneyX - 5.2} y={chimneyBase - 18} width="10.4" height="2.6" style={{ fill: p.stoneShade }} />
                </g>
              )}
              {/* Roof + shingle courses */}
              <polygon className={fade} points={roofPts} style={{ fill: roof }} />
              <polygon points={roofPts} fill="url(#roof-shingle)" />
              {house.antenna && (
                <path
                  className={fade}
                  d={`M${house.x + house.w * 0.62} ${ridgeY + 2} V${ridgeY - 11} M${house.x + house.w * 0.62 - 4.5} ${ridgeY - 9} H${house.x + house.w * 0.62 + 4.5} M${house.x + house.w * 0.62 - 3} ${ridgeY - 6} H${house.x + house.w * 0.62 + 3}`}
                  style={{ stroke: p.trunk }}
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
              {house.dormer && (
                <g>
                  <rect className={fade} x={apexX - 7} y={dormerY} width="14" height="12" style={{ fill: wall }} />
                  <polygon
                    className={fade}
                    points={`${apexX - 9},${dormerY} ${apexX + 9},${dormerY} ${apexX},${dormerY - 7.5}`}
                    style={{ fill: roof }}
                  />
                  <rect className={fade} x={apexX - 4} y={dormerY + 1.6} width="8" height="9" rx="1" style={{ fill: p.wallShade }} />
                  <rect
                    className={fade}
                    x={apexX - 3}
                    y={dormerY + 2.6}
                    width="6"
                    height="7"
                    style={{
                      fill: p.isLit(i * 2 + 3) ? p.windowLit : p.windowOff,
                      filter: p.isLit(i * 2 + 3) ? `drop-shadow(0 0 3px ${p.windowLit})` : undefined,
                    }}
                  />
                </g>
              )}
              {/* Round oculus in the gable */}
              {house.attic && (
                <g>
                  <circle className={fade} cx={apexX} cy={top - roofH * 0.42} r="4.4" style={{ fill: p.wallShade }} />
                  <circle
                    className={fade}
                    cx={apexX}
                    cy={top - roofH * 0.42}
                    r="3.2"
                    style={{
                      fill: p.isLit(i * 2 + 5) ? p.windowLit : p.windowOff,
                      filter: p.isLit(i * 2 + 5) ? `drop-shadow(0 0 3px ${p.windowLit})` : undefined,
                    }}
                  />
                  <path
                    className={fade}
                    d={`M${apexX} ${top - roofH * 0.42 - 3.2} V${top - roofH * 0.42 + 3.2} M${apexX - 3.2} ${top - roofH * 0.42} H${apexX + 3.2}`}
                    style={{ stroke: p.wallShade }}
                    strokeWidth="0.7"
                    fill="none"
                  />
                </g>
              )}
              {/* Windows */}
              {rowYs.map((wy, row) =>
                winXs.map((wx, j) => (
                  <TownWindow
                    key={`${row}-${j}`}
                    p={p}
                    wx={wx}
                    wy={wy}
                    lit={p.isLit(i * 2 + j + row)}
                    content={house.win[(row * winXs.length + j) % house.win.length]}
                    arched={house.arched}
                    shutters={house.shutters}
                  />
                )),
              )}
              {/* Shop front: display window + striped awning */}
              {house.shop && (
                <g>
                  <rect className={fade} x={house.x + 8} y={GROUND_Y - 27} width="34" height="23" rx="1.5" style={{ fill: p.wallShade }} />
                  <rect
                    className={fade}
                    x={house.x + 9.6}
                    y={GROUND_Y - 25.4}
                    width="30.8"
                    height="20"
                    rx="1"
                    style={{
                      fill: shopLit ? p.windowLit : p.windowOff,
                      filter: shopLit ? `drop-shadow(0 0 5px ${p.windowLit})` : undefined,
                    }}
                  />
                  <path
                    className={fade}
                    d={`M${house.x + 19.9} ${GROUND_Y - 25.4} V${GROUND_Y - 5.4} M${house.x + 30.2} ${GROUND_Y - 25.4} V${GROUND_Y - 5.4}`}
                    style={{ stroke: p.wallShade }}
                    strokeWidth="0.9"
                    fill="none"
                  />
                  {Array.from({ length: 6 }).map((_, k) => (
                    <polygon
                      key={k}
                      className={fade}
                      points={`${house.x + 11 + k * 4.67},${GROUND_Y - 40} ${house.x + 11 + (k + 1) * 4.67},${GROUND_Y - 40} ${house.x + 7 + (k + 1) * 6},${GROUND_Y - 29} ${house.x + 7 + k * 6},${GROUND_Y - 29}`}
                      style={{ fill: k % 2 === 0 ? p.lhStripe : p.lhBody }}
                    />
                  ))}
                </g>
              )}
              {/* Front door with frame and a brass handle */}
              {house.door && (
                <g>
                  <rect className={fade} x={doorX - 7.4} y={GROUND_Y - 21.4} width="14.8" height="21.4" rx="2.6" style={{ fill: p.wallShade }} />
                  <rect className={fade} x={doorX - 6} y={GROUND_Y - 20} width="12" height="20" rx="2" style={{ fill: p.door }} />
                  <circle className={fade} cx={doorX + 3.4} cy={GROUND_Y - 10} r="0.9" style={{ fill: p.clockRim }} />
                </g>
              )}
            </g>
          )
        })}

        {/* Picket fences + garden bushes between the houses */}
        {FENCES.map(([x1, x2]) => (
          <Fence key={x1} x1={x1} x2={x2} p={p} />
        ))}
        {BUSHES.map((b) => (
          <g key={b.x}>
            <circle className={fade} cx={b.x} cy={GROUND_Y - b.r + 1.5} r={b.r} style={{ fill: p.tree }} />
            <circle className={fade} cx={b.x + b.r * 0.9} cy={GROUND_Y - b.r * 0.6 + 1.5} r={b.r * 0.65} style={{ fill: p.tree }} />
          </g>
        ))}

        {/* Clock tower — stone masonry with a live clock */}
        <ClockTower p={p} />

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
