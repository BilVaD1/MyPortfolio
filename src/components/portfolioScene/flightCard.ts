/* -------------------------------------------------------------------------- */
/*  FlightCard — the panel→hero transition object.                             */
/*                                                                              */
/*  A finely-subdivided plane carrying the project screenshot. While the        */
/*  gallery flies it from the ring to the detail hero, the CARD vertex shader   */
/*  ripples it like a sheet of paper caught in an air current. The ripple is    */
/*  driven by a single `uBend` uniform that is zero at both ends of the         */
/*  flight, so the card is perfectly flat when it swaps with the ring panel     */
/*  and when it crossfades into the crisp hero.                                 */
/* -------------------------------------------------------------------------- */

import * as THREE from 'three'
import { CARD_VERT, CARD_FRAG } from './shaders'

export interface FlightCard {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  material: THREE.ShaderMaterial
  planeW: number
  planeH: number
  dispose: () => void
}

/**
 * Build a flight card sized to `planeH`, with an explicit (clamped) `aspect`
 * so it matches the ring panel it replaces and the detail hero it becomes.
 */
export function createFlightCard(source: THREE.Texture, planeH: number, aspect: number): FlightCard {
  const planeW = planeH * aspect

  // Clone the shared panel texture: with NoColorSpace the shader samples raw
  // sRGB bytes and writes them straight through (see the colour note in
  // shaders.ts), and disposal can't free the panel's own GPU texture.
  const map = source.clone()
  map.colorSpace = THREE.NoColorSpace
  map.needsUpdate = true

  const geometry = new THREE.PlaneGeometry(planeW, planeH, 48, 32)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uBend: { value: 0 },
      uTime: { value: 0 },
      uOpacity: { value: 1 },
    },
    vertexShader: CARD_VERT,
    fragmentShader: CARD_FRAG,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.frustumCulled = false

  return {
    mesh: mesh as FlightCard['mesh'],
    material,
    planeW,
    planeH,
    dispose: () => {
      geometry.dispose()
      material.dispose()
      map.dispose()
    },
  }
}
