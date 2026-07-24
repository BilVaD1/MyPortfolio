import React from 'react'

/**
 * Theme for a single scene. Everything is expressed as plain colour strings and
 * pushed onto the section as CSS custom properties, so the art + info card can
 * stay generic and just read `var(--accent)` etc.
 */
export interface SceneTheme {
  /** Three-stop background gradient painted full-bleed behind the scene. */
  bgFrom: string
  bgVia: string
  bgTo: string
  /** Primary accent — headings, glows, active dots. */
  accent: string
  /** Softer companion accent for secondary strokes / fills. */
  accent2: string
}

export interface SceneArtProps {
  /** True while this scene is the most-visible one — lets art dial up motion. */
  active: boolean
}

export interface RoleScene {
  id: string
  /** Project / product identity (kept honest — these are projects, not employers). */
  project: string
  role: string
  /** One-line framing shown under the role. */
  description: string
  /** Accurate tech chips pulled straight from the responsibilities. */
  tags: string[]
  responsibilities: string[]
  theme: SceneTheme
  /** Same hue family re-pitched for light mode: pastel gradient, deepened accents. */
  themeLight: SceneTheme
  /** The animated backdrop for this chapter. */
  Art: React.FC<SceneArtProps>
}
