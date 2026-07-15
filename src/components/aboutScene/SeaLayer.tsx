import React from 'react'

import { SceneMode } from './types'

const fade = 'transition-colors duration-1000'

interface SeaPalette {
  back: string
  mid: string
  front: string
  foam: string
  glint: string
}

const SEA: Record<SceneMode, SeaPalette> = {
  day: { back: '#7fc4de', mid: '#4da3c7', front: '#2f86ad', foam: 'rgba(255, 255, 255, 0.65)', glint: 'rgba(255, 240, 180, 0.5)' },
  night: { back: '#2a3a66', mid: '#1f2d52', front: '#141f3d', foam: 'rgba(190, 205, 240, 0.28)', glint: 'rgba(205, 218, 255, 0.35)' },
  sunrise: { back: '#c795b3', mid: '#976b99', front: '#68487a', foam: 'rgba(255, 235, 240, 0.6)', glint: 'rgba(255, 215, 230, 0.5)' },
  sunset: { back: '#e39a63', mid: '#b96248', front: '#7d3f3f', foam: 'rgba(255, 225, 190, 0.55)', glint: 'rgba(255, 190, 120, 0.55)' },
}

interface BoatPalette {
  hull: string
  main: string
  jib: string
  flag: string
  mast: string
  lantern: string
  lanternGlows: boolean
}

const BOATS: Record<SceneMode, BoatPalette> = {
  day: { hull: '#7c4a32', main: '#f8f4e8', jib: '#eadfca', flag: '#d9534f', mast: '#5d3a28', lantern: '#f2d8a0', lanternGlows: false },
  night: { hull: '#232b4f', main: '#c6d0ea', jib: '#a9b5d6', flag: '#8e3c55', mast: '#1a2140', lantern: '#ffd27f', lanternGlows: true },
  sunrise: { hull: '#6e4a5a', main: '#ffe9ef', jib: '#f4d3dc', flag: '#d9536f', mast: '#54394a', lantern: '#f2d8a0', lanternGlows: false },
  sunset: { hull: '#5f3a35', main: '#ffdfb8', jib: '#f2c294', flag: '#c74634', mast: '#4a2f28', lantern: '#ffd27f', lanternGlows: true },
}

/**
 * Seamlessly loopable sine wave: the SVG is 200% wide and the pattern period
 * divides half of the viewBox width, so translateX(-50%) loops perfectly.
 */
const waveLine = (period: number, amp: number): string => {
  let d = `M0 40 Q ${period / 4} ${40 - amp} ${period / 2} 40`
  for (let x = period; x <= 2880; x += period / 2) d += ` T ${x} 40`
  return d
}

const WaveBand = ({
  color,
  foam,
  dur,
  reverse,
  period,
  amp,
  bob,
  vh,
}: {
  color: string
  foam: string
  dur: number
  reverse?: boolean
  period: number
  amp: number
  bob?: number
  /** viewBox height — roughly matched to the band's on-screen height to limit distortion */
  vh: number
}) => {
  const line = waveLine(period, amp)
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ animation: bob ? `wave-bob ${bob}s ease-in-out infinite` : undefined }}
    >
      <svg
        viewBox={`0 0 2880 ${vh}`}
        preserveAspectRatio="none"
        className="block h-full w-[200%]"
        style={{ animation: `wave-drift ${dur}s linear infinite ${reverse ? 'reverse' : ''}` }}
      >
        <path className={fade} d={`${line} V${vh} H0 Z`} style={{ fill: color }} />
        {/* Spume along the crest */}
        <path
          className={fade}
          d={line}
          fill="none"
          style={{ stroke: foam }}
          strokeWidth="5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          className={fade}
          d={line}
          fill="none"
          style={{ stroke: foam }}
          strokeWidth="3"
          strokeDasharray="18 34"
          transform="translate(0 14)"
          opacity="0.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}

const Boat = ({ width, palette }: { width: number; palette: BoatPalette }) => (
  <svg width={width} viewBox="0 0 120 110" fill="none" className="overflow-visible">
    <rect className={fade} x="58" y="14" width="3.5" height="64" rx="1.5" style={{ fill: palette.mast }} />
    <path className={fade} d="M63 22 L63 74 L100 74 Z" style={{ fill: palette.main }} />
    <path className={fade} d="M55 30 L55 74 L24 74 Z" style={{ fill: palette.jib }} />
    <path className={fade} d="M61 14 L61 6 L76 10 Z" style={{ fill: palette.flag }} />
    <path className={fade} d="M12 78 L108 78 L90 100 L30 100 Z" style={{ fill: palette.hull }} />
    <circle
      className={fade}
      cx="60"
      cy="88"
      r="4"
      style={{
        fill: palette.lantern,
        filter: palette.lanternGlows ? 'drop-shadow(0 0 5px rgba(255, 210, 127, 0.9))' : undefined,
      }}
    />
  </svg>
)

const FloatingBoat = ({
  left,
  top,
  width,
  bobDur,
  driftDur,
  delay,
  palette,
}: {
  left: string
  top: string
  width: number
  bobDur: number
  driftDur: number
  delay: number
  palette: BoatPalette
}) => (
  <div
    className="absolute"
    style={{ left, top, animation: `boat-drift ${driftDur}s ease-in-out ${delay}s infinite alternate` }}
  >
    <div style={{ animation: `boat-bob ${bobDur}s ease-in-out ${delay / 2}s infinite` }}>
      <Boat width={width} palette={palette} />
    </div>
  </div>
)

/** Farthest water band: crest glint and a small distant boat. */
export const SeaBackLayer = ({ mode }: { mode: SceneMode }) => (
  <div className="absolute inset-0">
    <WaveBand color={SEA[mode].back} foam={SEA[mode].foam} dur={44} period={288} amp={12} vh={320} />
    {/* Light reflection under the sun / moon */}
    <div
      className="absolute w-[46px] rounded-[50%]"
      style={{
        left: '56.5%',
        top: '6%',
        height: '60%',
        background: `linear-gradient(to bottom, ${SEA[mode].glint}, transparent)`,
        filter: 'blur(7px)',
        animation: 'glint-shimmer 5s ease-in-out infinite',
        transition: 'background 1s',
      }}
    />
    <FloatingBoat left="20%" top="10%" width={48} bobDur={7.5} driftDur={52} delay={-8} palette={BOATS[mode]} />
  </div>
)

/** Middle water band with the main sailboat. */
export const SeaMidLayer = ({ mode }: { mode: SceneMode }) => (
  <div className="absolute inset-0">
    <WaveBand color={SEA[mode].mid} foam={SEA[mode].foam} dur={34} period={240} amp={16} reverse bob={9} vh={240} />
    <FloatingBoat left="66%" top="5%" width={76} bobDur={6.5} driftDur={44} delay={-20} palette={BOATS[mode]} />
  </div>
)

/** Closest water band with the large foreground boat. */
export const SeaFrontLayer = ({ mode }: { mode: SceneMode }) => (
  <div className="absolute inset-0">
    <WaveBand color={SEA[mode].front} foam={SEA[mode].foam} dur={26} period={360} amp={20} bob={7} vh={140} />
    <FloatingBoat left="38%" top="4%" width={110} bobDur={6} driftDur={48} delay={-34} palette={BOATS[mode]} />
  </div>
)
