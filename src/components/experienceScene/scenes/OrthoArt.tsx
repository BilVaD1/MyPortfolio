import React from 'react'

import { SceneArtProps } from '../types'

const CX = 1030
const CY = 430
const R = 175

// meridian ellipses (varying rx) that spin to fake a 3D wireframe globe
const MERIDIANS = [30, 70, 110, 150, 175]
// static latitude bands
const LATITUDES = [-110, -55, 0, 55, 110]

/** A cloud node (AWS-flavoured) with a soft glow and a label. */
const CloudNode = ({ x, y, label }: { x: number; y: number; label: string }) => (
  <g className="exp-a-float-slow" style={{ transformOrigin: `${x}px ${y}px` }}>
    <path
      d={`M${x - 26} ${y + 8} a16 16 0 0 1 4 -31 a20 20 0 0 1 38 -6 a15 15 0 0 1 8 37 Z`}
      fill="none"
      stroke="var(--accent)"
      strokeWidth="1.6"
      opacity="0.85"
    />
    <text
      x={x + 3}
      y={y + 2}
      fill="var(--accent)"
      fontSize="15"
      fontWeight="700"
      textAnchor="middle"
      fontFamily="monospace"
    >
      {label}
    </text>
  </g>
)

/**
 * LightForce · Full Stack Developer — digital orthodontics.
 * A spinning wireframe globe (Three.js), orbiting brackets and AWS cloud nodes.
 */
const OrthoArt = ({ active }: SceneArtProps) => (
  <div className="absolute inset-0 overflow-hidden">
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      {/* halo */}
      <circle cx={CX} cy={CY} r={R + 40} fill="var(--accent)" opacity="0.06" />

      {/* static latitude rings */}
      <g opacity="0.4">
        {LATITUDES.map((dy, i) => {
          const rx = Math.sqrt(Math.max(0, R * R - dy * dy))
          return (
            <ellipse
              key={i}
              cx={CX}
              cy={CY + dy}
              rx={rx}
              ry={rx * 0.22}
              fill="none"
              stroke="var(--accent2)"
              strokeWidth="1"
            />
          )
        })}
      </g>

      {/* spinning meridians */}
      <g
        style={{
          transformBox: 'view-box',
          transformOrigin: `${CX}px ${CY}px`,
          animation: `exp-spin ${active ? 16 : 26}s linear infinite`,
        }}
      >
        {MERIDIANS.map((rx, i) => (
          <ellipse
            key={i}
            cx={CX}
            cy={CY}
            rx={rx}
            ry={R}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.1"
            opacity="0.7"
          />
        ))}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--accent)" strokeWidth="1.4" opacity="0.5" />
      </g>

      {/* orbiting brackets (aligner clips) — each rotates about the globe centre */}
      {[
        { rad: R + 34, dur: 9, size: 16, dash: false },
        { rad: R + 70, dur: 14, size: 12, dash: true },
        { rad: R + 108, dur: 20, size: 10, dash: false },
      ].map((o, i) => (
        <g
          key={i}
          style={{
            transformBox: 'view-box',
            transformOrigin: `${CX}px ${CY}px`,
            animation: `exp-spin${i % 2 ? '-rev' : ''} ${o.dur}s linear infinite`,
          }}
        >
          <ellipse
            cx={CX}
            cy={CY}
            rx={o.rad}
            ry={o.rad * 0.5}
            fill="none"
            stroke="var(--accent2)"
            strokeWidth="1"
            strokeDasharray={o.dash ? '3 10' : undefined}
            opacity="0.3"
          />
          <rect
            x={CX + o.rad - o.size / 2}
            y={CY - o.size / 2}
            width={o.size}
            height={o.size}
            rx="3"
            fill="var(--accent)"
            opacity="0.9"
            style={{ filter: 'drop-shadow(0 0 6px var(--accent))' }}
          />
        </g>
      ))}

      {/* AWS cloud mesh, upper-right, wired to the globe */}
      <g>
        <path
          d={`M${CX} ${CY - R} C 1150 150 1250 150 1300 160`}
          fill="none"
          stroke="var(--accent2)"
          strokeWidth="1.2"
          strokeDasharray="4 8"
          opacity="0.5"
          style={{ animation: 'exp-dash 12s linear infinite' }}
        />
        <path
          d={`M${CX + R} ${CY - 60} C 1280 300 1330 280 1360 320`}
          fill="none"
          stroke="var(--accent2)"
          strokeWidth="1.2"
          strokeDasharray="4 8"
          opacity="0.5"
          style={{ animation: 'exp-dash 9s linear infinite' }}
        />
        <CloudNode x={1300} y={150} label="S3" />
        <CloudNode x={1360} y={320} label="λ" />
      </g>
    </svg>

    {/* drifting code glyphs */}
    {[
      { t: '{ }', left: '46%', top: '22%', dur: 7, delay: 0 },
      { t: '</>', left: '54%', top: '70%', dur: 9, delay: 1.5 },
      { t: '3D', left: '40%', top: '58%', dur: 8, delay: 3 },
    ].map((g, i) => (
      <span
        key={i}
        className="exp-a-float absolute font-mono font-bold"
        style={{
          left: g.left,
          top: g.top,
          color: 'var(--accent)',
          opacity: 0.35,
          fontSize: 22,
          animationDuration: `${g.dur}s`,
          animationDelay: `${g.delay}s`,
        }}
      >
        {g.t}
      </span>
    ))}
  </div>
)

export default OrthoArt
