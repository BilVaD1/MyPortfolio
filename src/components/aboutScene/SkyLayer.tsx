import React from 'react'

import { SceneMode } from './types'

const GRADIENTS: Record<SceneMode, string> = {
  day: 'linear-gradient(to bottom, #7fc0e6 0%, #a9d8ef 42%, #f3e4c2 68%, #ffd9a0 100%)',
  night: 'linear-gradient(to bottom, #0b1026 0%, #141b3c 45%, #2a3260 78%, #45406b 100%)',
  sunrise: 'linear-gradient(to bottom, #b77fb0 0%, #e39cba 40%, #f7bcc4 65%, #ffe0cf 100%)',
  sunset: 'linear-gradient(to bottom, #5a3d7a 0%, #a34f6e 38%, #e0703f 72%, #ffb347 100%)',
}

/**
 * Static background layer: one gradient per time of day, cross-fading on change.
 */
const SkyLayer = ({ mode }: { mode: SceneMode }) => (
  <div className="absolute inset-0">
    {(Object.keys(GRADIENTS) as SceneMode[]).map((key) => (
      <div
        key={key}
        className={`absolute inset-0 transition-opacity duration-1000 ${mode === key ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: GRADIENTS[key] }}
      />
    ))}
  </div>
)

export default SkyLayer
