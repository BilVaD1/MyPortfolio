/* -------------------------------------------------------------------------- */
/*  ParticleImage — a grid of GPU points that assembles into a project's        */
/*  screenshot and can be scattered into a drifting cloud via one uniform.      */
/*                                                                              */
/*  Sampling the image once (downscaled) gives every point its colour; the      */
/*  `position` attribute is its home in the assembled image, `aScatter` its     */
/*  exploded position. The gallery lerps uScatter 0→1→0 while flying the whole  */
/*  Points object from the ring panel to the detail hero — so the image breaks  */
/*  apart mid-flight and reforms at its destination.                            */
/* -------------------------------------------------------------------------- */

import * as THREE from 'three'
import { PARTICLE_VERT, PARTICLE_FRAG } from './shaders'

/** Vertical resolution of the point grid; columns scale with image aspect. */
const ROWS = 84

/** Downscale an image to cols×rows and read the averaged pixels. */
function sampleImage(image: HTMLImageElement, cols: number, rows: number): Uint8ClampedArray {
  const c = document.createElement('canvas')
  c.width = cols
  c.height = rows
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(image, 0, 0, cols, rows)
  return ctx.getImageData(0, 0, cols, rows).data
}

export interface ParticleImage {
  points: THREE.Points
  material: THREE.ShaderMaterial
  /** width / height of the assembled image plane, in local units. */
  aspect: number
  planeW: number
  planeH: number
  dispose: () => void
}

/**
 * Build a fresh particle image sized to `planeH`, with an explicit `aspect`
 * so it matches the (clamped) panel and detail-hero exactly — the reassembled
 * cloud must line up with the crisp hero it cross-fades into.
 */
export function createParticleImage(
  image: HTMLImageElement,
  planeH: number,
  aspect: number,
  pixelRatio: number,
  rand: () => number = Math.random,
): ParticleImage {
  const rows = ROWS
  const cols = Math.max(2, Math.round(rows * aspect))
  const planeW = planeH * aspect

  const pixels = sampleImage(image, cols, rows)
  const count = cols * rows

  const targets = new Float32Array(count * 3)
  const scatters = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const seeds = new Float32Array(count)

  let i = 0
  for (let iy = 0; iy < rows; iy++) {
    for (let ix = 0; ix < cols; ix++) {
      const u = cols > 1 ? ix / (cols - 1) : 0.5
      const v = rows > 1 ? iy / (rows - 1) : 0.5

      // Assembled target — the image, centred on the local origin.
      const tx = (u - 0.5) * planeW
      const ty = (0.5 - v) * planeH
      targets[i * 3] = tx
      targets[i * 3 + 1] = ty
      targets[i * 3 + 2] = 0

      // Exploded cloud — puff each point outward from its own spot.
      const theta = rand() * Math.PI * 2
      const phi = Math.acos(2 * rand() - 1)
      const dist = 1.4 + rand() * 4.2
      scatters[i * 3] = tx + Math.sin(phi) * Math.cos(theta) * dist
      scatters[i * 3 + 1] = ty + Math.sin(phi) * Math.sin(theta) * dist
      scatters[i * 3 + 2] = Math.cos(phi) * dist * 1.6

      // Colour sampled from the downscaled image (sRGB, straight through).
      const p = (iy * cols + ix) * 4
      colors[i * 3] = pixels[p] / 255
      colors[i * 3 + 1] = pixels[p + 1] / 255
      colors[i * 3 + 2] = pixels[p + 2] / 255

      seeds[i] = rand()
      i++
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(targets, 3))
  geometry.setAttribute('aScatter', new THREE.BufferAttribute(scatters, 3))
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uScatter: { value: 0 },
      uSize: { value: 3.1 },
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uPixelRatio: { value: pixelRatio },
    },
    vertexShader: PARTICLE_VERT,
    fragmentShader: PARTICLE_FRAG,
    transparent: true,
    depthWrite: false,
    depthTest: true,
  })

  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false

  return {
    points,
    material,
    aspect,
    planeW,
    planeH,
    dispose: () => {
      geometry.dispose()
      material.dispose()
    },
  }
}
