import React from 'react'

import { SceneArtProps } from '../types'

const STAGES = ['commit', 'build', 'test', 'deploy']
const PIPE_X = 560
const PIPE_GAP = 210
const PIPE_Y = 640

/** SDET · tour-tech platform — a travel route feeding a green CI/CD pipeline. */
const PipelineArt = ({ active }: SceneArtProps) => (
  <div className="absolute inset-0 overflow-hidden">
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      {/* faint map latitudes */}
      <g opacity="0.16" stroke="var(--accent2)" strokeWidth="1" fill="none">
        <path d="M0 200 C 360 160 1080 240 1440 190" />
        <path d="M0 320 C 360 290 1080 360 1440 300" />
      </g>

      {/* travel route */}
      <g className="exp-par-slow">
        <path
          id="exp-route"
          d="M120 300 C 380 200 560 380 820 260 C 1060 150 1240 320 1400 220"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeDasharray="6 10"
          opacity="0.7"
          style={{ animation: 'exp-dash 18s linear infinite' }}
        />
        {/* location pins along the route */}
        {[
          [120, 300],
          [560, 335],
          [1000, 232],
          [1400, 220],
        ].map(([x, y], i) => (
          <g key={i} style={{ transformOrigin: `${x}px ${y}px`, animation: `exp-glow 3s ease-in-out ${i * 0.6}s infinite` }}>
            <path
              d={`M${x} ${y} c -9 -14 -9 -24 0 -30 c 9 6 9 16 0 30 Z`}
              fill="var(--accent)"
              transform={`translate(0 -6)`}
            />
            <circle cx={x} cy={y - 26} r="3.4" fill="#0a2540" />
          </g>
        ))}
      </g>

      {/* travelling plane */}
      <g style={{ animation: `exp-fly ${active ? 9 : 13}s linear infinite`, ['--fly' as string]: '1240px' }}>
        <g transform="translate(120 250)" fill="var(--accent2)">
          <path d="M0 0 L26 6 L6 8 L2 18 L-2 8 L-10 6 Z" />
        </g>
      </g>

      {/* CI/CD pipeline */}
      <g>
        {/* connector rail */}
        <line
          x1={PIPE_X}
          y1={PIPE_Y}
          x2={PIPE_X + PIPE_GAP * 3}
          y2={PIPE_Y}
          stroke="var(--accent2)"
          strokeWidth="2"
          opacity="0.5"
        />
        {/* travelling light along the rail (a short bright dash sweeps the line) */}
        <line
          x1={PIPE_X}
          y1={PIPE_Y}
          x2={PIPE_X + PIPE_GAP * 3}
          y2={PIPE_Y}
          stroke="var(--accent)"
          strokeWidth="2.4"
          strokeDasharray="14 620"
          style={{ animation: 'exp-dash-draw 3.2s linear infinite' }}
        />

        {STAGES.map((s, i) => {
          const x = PIPE_X + i * PIPE_GAP
          return (
            <g key={s}>
              <circle
                cx={x}
                cy={PIPE_Y}
                r="26"
                fill="rgba(6,30,26,0.85)"
                stroke="var(--accent)"
                strokeWidth="1.6"
              />
              {/* check-mark pops in sequence */}
              <path
                d={`M${x - 9} ${PIPE_Y} l6 7 l12 -14`}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transformOrigin: `${x}px ${PIPE_Y}px`, animation: `exp-pop 5s ease-in-out ${i * 0.5}s infinite` }}
              />
              <text
                x={x}
                y={PIPE_Y + 48}
                textAnchor="middle"
                fill="var(--accent)"
                fontSize="14"
                fontFamily="monospace"
                opacity="0.85"
              >
                {s}
              </text>
            </g>
          )
        })}
        <text
          x={PIPE_X}
          y={PIPE_Y - 48}
          fill="var(--accent)"
          fontSize="15"
          fontWeight="700"
          fontFamily="monospace"
        >
          ✓ all green
        </text>
      </g>
    </svg>

    {/* framework chips */}
    {[
      { t: 'Cypress', left: '44%', top: '52%', dur: 7 },
      { t: 'pytest', left: '58%', top: '40%', dur: 9 },
      { t: 'Temporal', left: '70%', top: '58%', dur: 8 },
    ].map((c, i) => (
      <span
        key={i}
        className="exp-a-float absolute rounded-full border px-3 py-1 font-mono text-xs"
        style={{
          left: c.left,
          top: c.top,
          color: 'var(--accent)',
          borderColor: 'var(--accent)',
          background: 'rgba(6,30,26,0.4)',
          opacity: 0.7,
          animationDuration: `${c.dur}s`,
          animationDelay: `${i * 0.8}s`,
        }}
      >
        {c.t}
      </span>
    ))}
  </div>
)

export default PipelineArt
