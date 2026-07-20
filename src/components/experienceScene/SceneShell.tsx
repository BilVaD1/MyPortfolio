import React from 'react'

import { SceneTheme, SceneArtProps } from './types'

export type DividerVariant = 'wave' | 'diagonal' | 'peaks' | 'curve' | 'steps'

/** Decorative shape that bleeds the bottom of one scene into the next. */
const Divider = ({ variant, color }: { variant: DividerVariant; color: string }) => {
  const paths: Record<DividerVariant, string> = {
    wave: 'M0 60 C 240 110 480 10 720 50 C 960 90 1200 20 1440 60 L1440 90 L0 90 Z',
    diagonal: 'M0 90 L1440 20 L1440 90 Z',
    peaks: 'M0 90 L180 40 L360 78 L540 30 L720 70 L900 34 L1080 74 L1260 40 L1440 78 L1440 90 Z',
    curve: 'M0 90 C 480 30 960 30 1440 90 Z',
    steps: 'M0 90 L0 70 L360 70 L360 48 L720 48 L720 66 L1080 66 L1080 40 L1440 40 L1440 90 Z',
  }
  return (
    <div className="exp-scene__divider" aria-hidden>
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path d={paths[variant]} fill={color} />
      </svg>
    </div>
  )
}

interface SceneShellProps {
  theme: SceneTheme
  Art: React.FC<SceneArtProps>
  active: boolean
  divider: DividerVariant
  /** Colour the divider bleeds toward — usually the NEXT scene's bgFrom. */
  dividerColor: string
  rootRef: (el: HTMLElement | null) => void
  label: string
  /** 'left' darkens the left column for text; 'none' for centred hero/outro. */
  scrim?: 'left' | 'none'
  children: React.ReactNode
}

/**
 * Full-viewport chapter: themed backdrop, ambient art, revealed content and a
 * shaped transition into the following scene. The orchestrator wires `rootRef`
 * to drive the `in-view` reveal and the `--p` parallax variable.
 */
const SceneShell = ({
  theme,
  Art,
  active,
  divider,
  dividerColor,
  rootRef,
  label,
  scrim = 'left',
  children,
}: SceneShellProps) => (
  <section
    ref={rootRef}
    className="exp-scene"
    aria-label={label}
    style={
      {
        '--bg-from': theme.bgFrom,
        '--bg-via': theme.bgVia,
        '--bg-to': theme.bgTo,
        '--accent': theme.accent,
        '--accent2': theme.accent2,
      } as React.CSSProperties
    }
  >
    <div className="exp-scene__bg" />
    <div className="exp-scene__art">
      <Art active={active} />
    </div>
    {scrim !== 'none' && <div className="exp-scene__scrim" />}
    <div className="exp-scene__content">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">{children}</div>
    </div>
    <Divider variant={divider} color={dividerColor} />
  </section>
)

export default SceneShell
