import React from 'react'

import { RoleScene } from './types'

interface RoleInfoProps {
  scene: RoleScene
  index: number
  total: number
}

/** The revealed text column for a role chapter: counter, role, chips, duties. */
const RoleInfo = ({ scene, index, total }: RoleInfoProps) => {
  const num = String(index + 1).padStart(2, '0')
  const totalStr = String(total).padStart(2, '0')

  return (
    <div className="max-w-xl md:ml-2 lg:ml-6">
      {/* Chapter counter */}
      <div
        className="exp-reveal mb-4 flex items-center gap-3 font-mono text-sm tracking-widest text-slate-700/80 dark:text-white/70"
        style={{ ['--i' as string]: 0 }}
      >
        <span style={{ color: 'var(--accent)' }}>{num}</span>
        <span className="h-px w-10 bg-slate-900/30 dark:bg-white/30" />
        <span>{totalStr}</span>
      </div>

      {/* Project + role heading */}
      <div className="pb-1">
        <h2
          className="exp-wipe pb-1 text-3xl font-black leading-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl"
          style={{ ['--i' as string]: 1 }}
        >
          {scene.role}
        </h2>
      </div>
      <p
        className="exp-reveal mt-2 text-lg font-semibold sm:text-xl"
        style={{ ['--i' as string]: 2, color: 'var(--accent)' }}
      >
        {scene.project}
      </p>

      {/* Framing line */}
      <p
        className="exp-reveal mt-4 max-w-lg text-base leading-relaxed text-slate-800/90 dark:text-white/85 sm:text-lg"
        style={{ ['--i' as string]: 3 }}
      >
        {scene.description}
      </p>

      {/* Tech chips */}
      <div className="exp-reveal mt-5 flex flex-wrap gap-2" style={{ ['--i' as string]: 4 }}>
        {scene.tags.map((tag) => (
          <span key={tag} className="exp-chip rounded-full px-3 py-1 text-xs font-semibold">
            {tag}
          </span>
        ))}
      </div>

      {/* Responsibilities */}
      <ul className="exp-reveal mt-6 space-y-2.5" style={{ ['--i' as string]: 5 }}>
        {scene.responsibilities.map((r) => (
          <li key={r} className="flex gap-3 text-sm leading-snug text-slate-800/90 dark:text-white/80 sm:text-[15px]">
            <span
              aria-hidden
              className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full"
              style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }}
            />
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RoleInfo
