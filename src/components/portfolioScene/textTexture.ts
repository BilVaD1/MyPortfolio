/* -------------------------------------------------------------------------- */
/*  Canvas → texture helpers.                                                   */
/*                                                                              */
/*  The "full 3D" detail scene renders its title, body copy and buttons as      */
/*  planes textured from 2D canvases. This keeps type crisp (drawn at 2× and    */
/*  mip-free) without loading a font atlas or a TextGeometry font JSON.         */
/* -------------------------------------------------------------------------- */

import * as THREE from 'three'

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

export interface TexResult {
  texture: THREE.CanvasTexture
  /** width / height of the drawn canvas — use it to size the plane. */
  aspect: number
}

function newCanvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = Math.max(1, Math.ceil(w))
  c.height = Math.max(1, Math.ceil(h))
  return c
}

function toTexture(canvas: HTMLCanvasElement): TexResult {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter // non-power-of-two: no mipmaps
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  texture.anisotropy = 4
  texture.needsUpdate = true
  return { texture, aspect: canvas.width / canvas.height }
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  })
  if (line) lines.push(line)
  return lines
}

/** Big bold heading, tinted with the project accent. */
export function makeTitleTexture(text: string, accent: string): TexResult {
  const W = 1024
  const pad = 20
  const fontSize = 104
  const lineHeight = fontSize * 1.12

  const measure = newCanvas(W, 10).getContext('2d')!
  measure.font = `800 ${fontSize}px ${FONT_STACK}`
  const lines = wrap(measure, text, W - pad * 2)

  const H = pad * 2 + lines.length * lineHeight
  const c = newCanvas(W, H)
  const ctx = c.getContext('2d')!
  ctx.font = `800 ${fontSize}px ${FONT_STACK}`
  ctx.textBaseline = 'top'
  ctx.textAlign = 'left'
  ctx.shadowColor = accent
  ctx.shadowBlur = 26
  ctx.fillStyle = accent
  lines.forEach((ln, i) => ctx.fillText(ln, pad, pad + i * lineHeight))
  return toTexture(c)
}

/** Wrapped body copy in soft white. */
export function makeBodyTexture(
  text: string,
  opts: { width?: number; fontSize?: number; color?: string } = {},
): TexResult {
  const W = opts.width ?? 1024
  const fontSize = opts.fontSize ?? 44
  const color = opts.color ?? 'rgba(255,255,255,0.84)'
  const pad = 16
  const lineHeight = fontSize * 1.42

  const measure = newCanvas(W, 10).getContext('2d')!
  measure.font = `400 ${fontSize}px ${FONT_STACK}`
  const lines = wrap(measure, text, W - pad * 2)

  const H = pad * 2 + lines.length * lineHeight
  const c = newCanvas(W, H)
  const ctx = c.getContext('2d')!
  ctx.font = `400 ${fontSize}px ${FONT_STACK}`
  ctx.textBaseline = 'top'
  ctx.textAlign = 'left'
  ctx.fillStyle = color
  lines.forEach((ln, i) => ctx.fillText(ln, pad, pad + i * lineHeight))
  return toTexture(c)
}

/** Small uppercase eyebrow / label line. */
export function makeEyebrowTexture(text: string, color = 'rgba(255,255,255,0.6)'): TexResult {
  const W = 1024
  const fontSize = 40
  const c = newCanvas(W, fontSize * 2)
  const ctx = c.getContext('2d')!
  ctx.font = `600 ${fontSize}px ${FONT_STACK}`
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.fillStyle = color
  const spaced = text.toUpperCase().split('').join(' ')
  ctx.fillText(spaced, 4, c.height / 2)
  return toTexture(c)
}

/** A pill button: filled with the accent, or outlined when `filled` is false. */
export function makeButtonTexture(
  label: string,
  accent: string,
  filled: boolean,
  filledLabelColor = '#0a0a12',
): TexResult {
  const W = 560
  const H = 150
  const c = newCanvas(W, H)
  const ctx = c.getContext('2d')!
  const r = H / 2
  const inset = 8

  ctx.beginPath()
  const x0 = inset
  const y0 = inset
  const x1 = W - inset
  const y1 = H - inset
  const rr = r - inset
  ctx.moveTo(x0 + rr, y0)
  ctx.arcTo(x1, y0, x1, y1, rr)
  ctx.arcTo(x1, y1, x0, y1, rr)
  ctx.arcTo(x0, y1, x0, y0, rr)
  ctx.arcTo(x0, y0, x1, y0, rr)
  ctx.closePath()

  if (filled) {
    ctx.fillStyle = accent
    ctx.shadowColor = accent
    ctx.shadowBlur = 24
    ctx.fill()
    ctx.shadowBlur = 0
  } else {
    ctx.lineWidth = 5
    ctx.strokeStyle = accent
    ctx.stroke()
  }

  ctx.font = `700 52px ${FONT_STACK}`
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  ctx.fillStyle = filled ? filledLabelColor : accent
  ctx.fillText(label, W / 2, H / 2 + 2)
  return toTexture(c)
}

/** Soft radial sprite used as a fake bloom halo behind panels. */
export function makeGlowTexture(): THREE.CanvasTexture {
  const S = 256
  const c = newCanvas(S, S)
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.35)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)
  const texture = new THREE.CanvasTexture(c)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  return texture
}
