/* -------------------------------------------------------------------------- */
/*  PortfolioGallery — a hand-written native Three.js engine.                   */
/*                                                                              */
/*  No react-three-fiber here: a raw WebGLRenderer, one rAF loop, a Raycaster   */
/*  for hit-testing, and full teardown on dispose — the same "single loop +     */
/*  IntersectionObserver + reduced-motion guard" idiom as the SVG scenes, but   */
/*  in WebGL.                                                                    */
/*                                                                              */
/*  Structure:                                                                  */
/*    · a ring of textured panels (the projects) that spins with drag / wheel   */
/*    · a twinkling starfield backdrop                                          */
/*    · click a panel → it peels off the ring and glides forward like a sheet   */
/*      of paper, rippling mid-flight, then lands flat as the hero of a full    */
/*      3D detail scene (hero image + 3D text + clickable buttons)              */
/* -------------------------------------------------------------------------- */

import * as THREE from 'three'

import { Project } from './projects'
import { createFlightCard, FlightCard } from './flightCard'
import { STAR_VERT, STAR_FRAG } from './shaders'
import {
  makeTitleTexture,
  makeBodyTexture,
  makeEyebrowTexture,
  makeButtonTexture,
  makeGlowTexture,
} from './textTexture'

/* ------------------------------- tuning ---------------------------------- */

const RING_RADIUS = 6.2
const PANEL_H = 1.7
const PANEL_ASPECT_MIN = 1.2
const PANEL_ASPECT_MAX = 1.85

const RING_CAM = new THREE.Vector3(0, 0.35, 11.8)
const INTRO_CAM = new THREE.Vector3(0, 0.35, 18.2)
const CLEAR = 0x05060f

/* Detail layout: hero on the left, text column + buttons on the right.
   DETAIL_HALF_W is the frustum half-width the camera must guarantee so the
   widest layout (hero left edge ↔ button-row right edge) never clips. */
const HERO_X = -3.1
const HERO_MAX_H = 3.0
const HERO_MAX_W = 4.4
const DETAIL_HALF_W = 6.1

const OPEN_DUR = 1.15 // s, panel → hero fly
const REVEAL_DUR = 0.36 // s, flight card → crisp hero + UI
const CLOSE_DUR = 1.0 // s, hero → panel fly back

/* ------------------------------- helpers --------------------------------- */

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const heroHeight = (aspect: number) => Math.min(HERO_MAX_H, HERO_MAX_W / aspect)
const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2)

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh & THREE.Points & THREE.Sprite
    if (mesh.geometry) mesh.geometry.dispose()
    const mat = (mesh as THREE.Mesh).material
    if (mat) {
      const materials = Array.isArray(mat) ? mat : [mat]
      materials.forEach((m) => {
        const anyM = m as THREE.MeshBasicMaterial
        if (anyM.map) anyM.map.dispose()
        m.dispose()
      })
    }
  })
}

/* -------------------------------- types ---------------------------------- */

export interface GalleryOptions {
  onActive?: (index: number) => void
  onOpen?: (open: boolean, project?: Project) => void
  navigate?: (path: string) => void
}

interface Panel {
  project: Project
  index: number
  group: THREE.Group
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
  border: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
  glow: THREE.Sprite
  baseAngle: number
  heroAspect: number
  curScale: number
  tiltX: number
  tiltY: number
}

interface Button {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
  action: 'external' | 'internal' | 'close'
  url?: string
  baseScale: number
}

type Phase = 'ring' | 'opening' | 'revealing' | 'detail' | 'closing' | 'closingFly'

/* ------------------------------- engine ---------------------------------- */

export class PortfolioGallery {
  readonly ready: Promise<void>

  private container: HTMLElement
  private projects: Project[]
  private opts: GalleryOptions

  private renderer!: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera!: THREE.PerspectiveCamera
  private clock = new THREE.Clock()
  private raf = 0
  private disposed = false
  private running = true

  private ringGroup = new THREE.Group()
  private panels: Panel[] = []
  private textures = new Map<number, THREE.Texture>()
  private glowTexture!: THREE.CanvasTexture

  private stars!: THREE.Points
  private starMat!: THREE.ShaderMaterial

  // interaction
  private raycaster = new THREE.Raycaster()
  private pointer = new THREE.Vector2(0, 0) // NDC, also used for tilt
  private pointerDirty = true
  private dragging = false
  private lastPointerX = 0
  private dragMoved = 0
  private dragVel = 0

  // ring rotation
  private theta = 0
  private omega = 0
  private thetaGoal: number | null = null
  private intro = 0

  // active / phase
  private phase: Phase = 'ring'
  private activeIndex = 0
  private hoverIndex = -1
  private openIndex = -1

  // transition
  private t = 0 // 0 = ring, 1 = detail
  private detailReveal = 0
  private flight: FlightCard | null = null
  private flightStartPos = new THREE.Vector3()
  private flightStartQuat = new THREE.Quaternion()
  private flightStartScale = 1
  private flightEndScale = 1
  private heroWorld = new THREE.Vector3()
  private detailGroup = new THREE.Group()
  private buttons: Button[] = []
  private hoverButton: THREE.Mesh | null = null
  private detailCam = new THREE.Vector3(0, 0, 9)

  // scratch
  private tmpA = new THREE.Vector3()
  private tmpB = new THREE.Vector3()
  private tmpQuat = new THREE.Quaternion()
  private idQuat = new THREE.Quaternion()

  private ro?: ResizeObserver
  private io?: IntersectionObserver

  constructor(container: HTMLElement, projects: Project[], opts: GalleryOptions = {}) {
    this.container = container
    this.projects = projects
    this.opts = opts

    this.initRenderer()
    this.initScene()
    this.bindEvents()
    this.loop()

    this.ready = this.loadAssets().then(() => {
      if (this.disposed) return
      this.buildRing()
    })
  }

  /* ------------------------------ setup ---------------------------------- */

  private initRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(CLEAR, 1)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.NoToneMapping
    const el = renderer.domElement
    el.style.width = '100%'
    el.style.height = '100%'
    el.style.display = 'block'
    el.style.touchAction = 'pan-y'
    this.container.appendChild(el)
    this.renderer = renderer

    const { width, height } = this.size()
    renderer.setSize(width, height, false)

    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
    this.camera.position.copy(RING_CAM)
    this.computeDetailCam()
  }

  private initScene() {
    this.scene.fog = new THREE.FogExp2(CLEAR, 0.05)
    this.scene.add(this.ringGroup)
    this.scene.add(this.detailGroup)
    this.detailGroup.visible = false
    this.glowTexture = makeGlowTexture()
    this.buildStars()
  }

  private buildStars() {
    const COUNT = 1400
    const positions = new Float32Array(COUNT * 3)
    const seeds = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      // shell around the scene
      const r = 30 + Math.random() * 45
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      seeds[i] = Math.random()
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    this.starMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.9 },
        uColor: { value: new THREE.Color('#dfe9ff') },
        uPixelRatio: { value: this.renderer.getPixelRatio() },
      },
      vertexShader: STAR_VERT,
      fragmentShader: STAR_FRAG,
      transparent: true,
      depthWrite: false,
      fog: false,
    })
    this.stars = new THREE.Points(geo, this.starMat)
    this.stars.frustumCulled = false
    this.scene.add(this.stars)
  }

  private async loadAssets() {
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy()
    // Resilient: one bad image must not reject the whole batch (which would
    // otherwise leave the ring unbuilt and the loader spinning forever).
    await Promise.all(
      this.projects.map(async (p) => {
        try {
          const img = await loadImage(p.image)
          if (this.disposed) return
          const tex = new THREE.Texture(img)
          tex.colorSpace = THREE.SRGBColorSpace
          tex.anisotropy = maxAniso
          tex.needsUpdate = true
          // store the image on the texture so we can sample it for particles
          ;(tex as THREE.Texture & { _img?: HTMLImageElement })._img = img
          this.textures.set(p.id, tex)
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('[PortfolioGallery] image failed to load:', p.image, err)
        }
      }),
    )
  }

  private buildRing() {
    const step = (Math.PI * 2) / this.projects.length
    this.projects.forEach((project, i) => {
      const tex = this.textures.get(project.id)
      const img = tex && (tex as THREE.Texture & { _img?: HTMLImageElement })._img
      if (!tex || !img) return
      const aspect = clamp(
        (img.naturalWidth || 16) / (img.naturalHeight || 10),
        PANEL_ASPECT_MIN,
        PANEL_ASPECT_MAX,
      )
      const w = PANEL_H * aspect
      const accent = new THREE.Color(project.accent)

      const group = new THREE.Group()

      const border = new THREE.Mesh(
        new THREE.PlaneGeometry(w + 0.16, PANEL_H + 0.16),
        new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.85, toneMapped: false, fog: true }),
      )
      border.position.z = -0.02

      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(w, PANEL_H),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, fog: true }),
      )
      mesh.userData.index = i

      const glow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: this.glowTexture,
          color: accent,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0.18,
          fog: false,
        }),
      )
      glow.scale.set(w * 2.1, PANEL_H * 2.1, 1)
      glow.position.z = -0.06

      group.add(glow, border, mesh)
      this.ringGroup.add(group)

      this.panels.push({
        project,
        index: i,
        group,
        mesh: mesh as Panel['mesh'],
        border: border as Panel['border'],
        glow,
        baseAngle: i * step,
        heroAspect: aspect,
        curScale: 1,
        tiltX: 0,
        tiltY: 0,
      })
    })
  }

  get panelCount() {
    return this.panels.length
  }

  /* ------------------------------ events --------------------------------- */

  private bindEvents() {
    const el = this.renderer.domElement
    el.addEventListener('pointerdown', this.onPointerDown)
    el.addEventListener('pointermove', this.onPointerMove)
    window.addEventListener('pointerup', this.onPointerUp)
    el.addEventListener('wheel', this.onWheel, { passive: false })
    window.addEventListener('keydown', this.onKeyDown)

    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(this.container)

    // pause the loop when the canvas scrolls fully out of view
    this.io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          this.running = e.isIntersecting
          if (this.running) this.clock.getDelta() // drop the idle gap
        })
      },
      { threshold: 0 },
    )
    this.io.observe(this.container)

    document.addEventListener('visibilitychange', this.onVisibility)
  }

  private onVisibility = () => {
    if (document.hidden) {
      this.running = false
    } else {
      this.running = true
      this.clock.getDelta()
    }
  }

  private setPointerFromEvent(e: PointerEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect()
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    this.pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    this.pointerDirty = true
  }

  private onPointerDown = (e: PointerEvent) => {
    this.setPointerFromEvent(e)
    if (this.phase !== 'ring' && this.phase !== 'detail') return
    this.dragging = true
    this.lastPointerX = e.clientX
    this.dragMoved = 0
    this.dragVel = 0
    this.omega = 0
    this.thetaGoal = null
  }

  private onPointerMove = (e: PointerEvent) => {
    this.setPointerFromEvent(e)
    if (!this.dragging || this.phase !== 'ring') return
    const dx = e.clientX - this.lastPointerX
    this.lastPointerX = e.clientX
    this.theta += dx * 0.006
    this.dragMoved += Math.abs(dx)
    this.dragVel = dx * 0.006
  }

  private onPointerUp = () => {
    const wasDragging = this.dragging
    this.dragging = false
    if (!wasDragging) return
    if (this.dragMoved < 6) {
      this.handleClick()
    } else if (this.phase === 'ring') {
      this.omega = clamp(this.dragVel, -0.25, 0.25)
    }
  }

  private onWheel = (e: WheelEvent) => {
    if (this.phase !== 'ring') return
    e.preventDefault()
    this.omega = clamp(this.omega + e.deltaY * 0.00035, -0.28, 0.28)
    this.thetaGoal = null
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && (this.phase === 'detail' || this.phase === 'revealing')) {
      this.close()
    }
  }

  /* --------------------------- click handling ---------------------------- */

  private handleClick() {
    if (this.phase === 'ring') {
      this.raycaster.setFromCamera(this.pointer, this.camera)
      const meshes = this.panels.map((p) => p.mesh)
      const hit = this.raycaster.intersectObjects(meshes, false)[0]
      if (hit) {
        const index = (hit.object.userData.index as number) ?? -1
        if (index >= 0) this.open(index)
      }
    } else if (this.phase === 'detail') {
      this.raycaster.setFromCamera(this.pointer, this.camera)
      const hit = this.raycaster.intersectObjects(this.buttons.map((b) => b.mesh), false)[0]
      if (hit) {
        const btn = this.buttons.find((b) => b.mesh === hit.object)
        if (btn) this.activateButton(btn)
      }
    }
  }

  private activateButton(btn: Button) {
    if (btn.action === 'close') {
      this.close()
    } else if (btn.action === 'internal' && btn.url) {
      this.opts.navigate?.(btn.url)
    } else if (btn.action === 'external' && btn.url) {
      window.open(btn.url, '_blank', 'noopener,noreferrer')
    }
  }

  /* ------------------------- open / close flow --------------------------- */

  private open(index: number) {
    const panel = this.panels[index]
    if (!panel) return
    this.openIndex = index
    this.phase = 'opening'
    this.t = 0
    this.detailReveal = 0
    this.thetaGoal = -panel.baseAngle // bring it home for when we return

    // capture the panel's current world transform as the flight start
    panel.group.updateWorldMatrix(true, false)
    panel.group.getWorldPosition(this.flightStartPos)
    panel.group.getWorldQuaternion(this.flightStartQuat)
    this.flightStartScale = panel.curScale

    // hero placement (world) + end scale
    const heroAspect = panel.heroAspect
    const heroH = heroHeight(heroAspect)
    this.heroWorld.set(HERO_X, 0.4, 0)
    this.flightEndScale = heroH / PANEL_H

    // build the flight card from this panel's texture, using the same clamped
    // aspect as the panel so it lines up with the hero on landing
    const tex = this.textures.get(panel.project.id)!
    this.flight = createFlightCard(tex, PANEL_H, heroAspect)
    this.scene.add(this.flight.mesh)

    panel.group.visible = false
    this.opts.onOpen?.(true, panel.project)
  }

  close() {
    if (this.phase !== 'detail' && this.phase !== 'revealing') return
    this.phase = 'closing'
    if (this.flight) this.flight.mesh.visible = true
  }

  private buildDetail(project: Project, heroAspect: number) {
    const leftX = 0.2
    const textW = 5.0
    const colCenter = leftX + textW / 2
    const gap = 0.26
    let cursorY = 2.55

    const addPlane = (tex: THREE.CanvasTexture, aspect: number, worldW: number, centerX: number) => {
      const h = worldW / aspect
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(worldW, h),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, opacity: 0, depthWrite: false, fog: false }),
      )
      mesh.position.set(centerX, cursorY - h / 2, 0)
      this.detailGroup.add(mesh)
      cursorY -= h + gap
      return mesh
    }

    // hero image (crisp) on the left — clone the shared panel texture so the
    // detail teardown can dispose it without freeing the panel's GPU texture
    const heroH = heroHeight(heroAspect)
    const heroW = heroH * heroAspect
    const heroTex = this.textures.get(project.id)!.clone()
    heroTex.needsUpdate = true
    const hero = new THREE.Mesh(
      new THREE.PlaneGeometry(heroW, heroH),
      new THREE.MeshBasicMaterial({ map: heroTex, transparent: true, toneMapped: false, opacity: 0, fog: false }),
    )
    hero.position.copy(this.heroWorld)
    const heroBorder = new THREE.Mesh(
      new THREE.PlaneGeometry(heroW + 0.14, heroH + 0.14),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(project.accent), transparent: true, toneMapped: false, opacity: 0, fog: false }),
    )
    heroBorder.position.set(this.heroWorld.x, this.heroWorld.y, -0.02)
    this.detailGroup.add(heroBorder, hero)

    // text column on the right
    const eyebrow = makeEyebrowTexture(
      `${String(this.projects.indexOf(project) + 1).padStart(2, '0')} · Project`,
      project.accent,
    )
    addPlane(eyebrow.texture, eyebrow.aspect, 3.0, leftX + 1.5)

    const title = makeTitleTexture(project.title, project.accent)
    addPlane(title.texture, title.aspect, textW, colCenter)

    const body = makeBodyTexture(project.detail, { width: 1024, fontSize: 44 })
    addPlane(body.texture, body.aspect, textW, colCenter)

    // buttons row
    const defs: { label: string; action: Button['action']; url?: string; filled: boolean }[] = []
    defs.push({ label: 'Visit', action: 'external', url: project.href, filled: true })
    if (project.demo) defs.push({ label: 'Live Demo', action: 'internal', url: project.demo, filled: false })
    if (project.git) defs.push({ label: 'Source', action: 'external', url: project.git, filled: false })
    defs.push({ label: 'Close', action: 'close', filled: false })

    // shrink buttons when the row is crowded so it never outgrows DETAIL_HALF_W
    const bGap = 0.18
    const bW = Math.min(1.7, (textW + 0.9 - (defs.length - 1) * bGap) / defs.length)
    const bH = bW * (150 / 560)
    const total = defs.length * bW + (defs.length - 1) * bGap
    let bx = colCenter - total / 2 + bW / 2
    const by = cursorY - 0.1 - bH / 2

    defs.forEach((d) => {
      const tex = makeButtonTexture(d.label, project.accent, d.filled)
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(bW, bH),
        new THREE.MeshBasicMaterial({ map: tex.texture, transparent: true, toneMapped: false, opacity: 0, depthWrite: false, fog: false }),
      )
      mesh.position.set(bx, by, 0.01)
      this.detailGroup.add(mesh)
      this.buttons.push({ mesh: mesh as Button['mesh'], action: d.action, url: d.url, baseScale: 1 })
      bx += bW + bGap
    })

    this.detailGroup.visible = true
  }

  private disposeDetail() {
    disposeObject(this.detailGroup)
    this.detailGroup.clear()
    this.detailGroup.visible = false
    this.buttons = []
    this.hoverButton = null
  }

  /* ------------------------------ resize --------------------------------- */

  private size() {
    const width = this.container.clientWidth || window.innerWidth
    const height = this.container.clientHeight || window.innerHeight
    return { width: Math.max(1, width), height: Math.max(1, height) }
  }

  private computeDetailCam() {
    // pull back until the frustum spans ±DETAIL_HALF_W at z=0, whatever the
    // container aspect — the layout is fixed in world units, so this is the
    // only knob that keeps it inside the viewport
    const halfTan = Math.tan((this.camera.fov * Math.PI) / 360)
    const z = Math.max(9, DETAIL_HALF_W / (halfTan * this.camera.aspect))
    this.detailCam.set(0, 0, z)
  }

  private resize() {
    if (this.disposed) return
    const { width, height } = this.size()
    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.computeDetailCam()
    this.starMat.uniforms.uPixelRatio.value = this.renderer.getPixelRatio()
  }

  /* ------------------------------- loop ---------------------------------- */

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop)
    if (!this.running) return
    const dt = Math.min(this.clock.getDelta(), 0.05)
    const time = this.clock.elapsedTime

    this.stepPhase(dt)
    this.updateCamera()
    this.updateRing(dt, time)
    this.updateFlight(time)
    this.updateDetail(dt)
    if (this.starMat) this.starMat.uniforms.uTime.value = time

    if (this.pointerDirty) {
      this.updateHover()
      this.pointerDirty = false
    }

    this.renderer.render(this.scene, this.camera)
  }

  private stepPhase(dt: number) {
    // intro dolly-in
    if (this.intro < 1) this.intro = clamp(this.intro + dt / 1.1, 0, 1)

    switch (this.phase) {
      case 'opening':
        this.t = clamp(this.t + dt / OPEN_DUR, 0, 1)
        if (this.t >= 1) {
          this.phase = 'revealing'
          const panel = this.panels[this.openIndex]
          this.buildDetail(panel.project, panel.heroAspect)
        }
        break
      case 'revealing':
        this.detailReveal = clamp(this.detailReveal + dt / REVEAL_DUR, 0, 1)
        if (this.detailReveal >= 1) {
          this.phase = 'detail'
          if (this.flight) this.flight.mesh.visible = false
        }
        break
      case 'closing':
        this.detailReveal = clamp(this.detailReveal - dt / REVEAL_DUR, 0, 1)
        if (this.detailReveal <= 0) {
          this.disposeDetail()
          this.phase = 'closingFly'
        }
        break
      case 'closingFly':
        this.t = clamp(this.t - dt / CLOSE_DUR, 0, 1)
        if (this.t <= 0) this.finishClose()
        break
      default:
        break
    }
  }

  private finishClose() {
    if (this.openIndex >= 0) this.panels[this.openIndex].group.visible = true
    if (this.flight) {
      this.scene.remove(this.flight.mesh)
      this.flight.dispose()
      this.flight = null
    }
    this.phase = 'ring'
    const closed = this.openIndex
    this.openIndex = -1
    this.opts.onOpen?.(false, this.projects[closed])
  }

  private updateCamera() {
    const introF = easeInOut(clamp(this.intro, 0, 1))
    const camF = easeInOut(clamp(this.t, 0, 1))
    // ring position, possibly still animating in from the intro dolly
    this.tmpA.copy(INTRO_CAM).lerp(RING_CAM, introF)
    // then blend toward the detail camera as we open
    this.tmpA.lerp(this.detailCam, camF)
    this.camera.position.copy(this.tmpA)
    this.camera.lookAt(0, 0, 0)
  }

  private updateRing(dt: number, time: number) {
    const introF = easeInOut(clamp(this.intro, 0, 1))
    const camF = easeInOut(clamp(this.t, 0, 1))
    const ringFade = (1 - camF) * introF

    // Safety: theta must never be NaN — a poisoned theta places every panel at
    // sin(NaN) and the whole ring vanishes.
    if (!Number.isFinite(this.theta)) this.theta = 0

    // spin dynamics — gated on panels.length so the pre-buildRing frames don't
    // divide by zero (2π / 0 = Infinity, round(0)·Infinity = NaN → poisons theta)
    if (this.phase === 'ring' && this.panels.length > 0) {
      if (this.thetaGoal !== null) {
        // ease toward a chosen panel (rail / return)
        const goal = this.nearestGoal(this.thetaGoal)
        this.theta += (goal - this.theta) * Math.min(1, dt * 6)
        if (Math.abs(goal - this.theta) < 0.001) {
          this.theta = goal
          this.thetaGoal = null
        }
      } else if (!this.dragging) {
        this.theta += this.omega
        this.omega *= 0.92
        if (Math.abs(this.omega) < 0.0016) {
          this.omega = 0
          const step = (Math.PI * 2) / this.panels.length
          const snap = Math.round(this.theta / step) * step
          this.theta += (snap - this.theta) * Math.min(1, dt * 5)
        }
      }
    }

    let best = -Infinity
    let bestI = this.activeIndex

    const camX = this.camera.position.x
    const camZ = this.camera.position.z

    this.panels.forEach((p, i) => {
      const a = this.theta + p.baseAngle
      const cosA = Math.cos(a)
      const front01 = (cosA + 1) / 2 // 0 = directly behind, 1 = front and centre
      if (cosA > best) {
        best = cosA
        bestI = i
      }
      const x = Math.sin(a) * RING_RADIUS
      const z = cosA * RING_RADIUS
      p.group.position.set(x, Math.sin(time * 0.6 + i) * 0.05, z)

      const isHover = this.hoverIndex === i
      const frontness = clamp(cosA, 0, 1)
      // the front card lifts toward the viewer; the back of the ring shrinks
      const targetScale = 0.72 + 0.28 * front01 + frontness * 0.06 + (isHover ? 0.1 : 0)
      p.curScale = lerp(p.curScale, targetScale, Math.min(1, dt * 8))

      // Orient every card to face the camera (Y-axis billboard) so it is always
      // readable — no edge-on or back-facing panels as the ring turns.
      const faceYaw = Math.atan2(camX - x, camZ - z)
      const tiltYTarget = isHover || frontness > 0.85 ? this.pointer.x * 0.18 : 0
      const tiltXTarget = isHover || frontness > 0.85 ? -this.pointer.y * 0.12 : 0
      p.tiltY = lerp(p.tiltY, tiltYTarget, Math.min(1, dt * 6))
      p.tiltX = lerp(p.tiltX, tiltXTarget, Math.min(1, dt * 6))

      p.group.rotation.set(p.tiltX, faceYaw + p.tiltY, 0)
      p.group.scale.setScalar(p.curScale)

      // opacity + glow — fade the back of the ring so it reads as depth, not clutter
      const fade = ringFade * (0.12 + 0.88 * Math.pow(front01, 1.6))
      p.mesh.material.opacity = fade
      p.border.material.opacity = fade * (0.5 + 0.5 * frontness + (isHover ? 0.3 : 0))
      ;(p.glow.material as THREE.SpriteMaterial).opacity =
        ringFade * front01 * (0.12 + frontness * 0.25 + (isHover ? 0.4 : 0))
    })

    this.ringGroup.visible = ringFade > 0.02

    if (bestI !== this.activeIndex) {
      this.activeIndex = bestI
      this.opts.onActive?.(bestI)
    }

    // starfield dims as we dive into a project
    if (this.starMat) this.starMat.uniforms.uOpacity.value = lerp(0.9, 0.4, camF) * introF
  }

  private updateFlight(time: number) {
    if (!this.flight) return
    const p = clamp(this.t, 0, 1)
    const pe = easeInOut(p)

    this.tmpB.copy(this.flightStartPos).lerp(this.heroWorld, pe)
    this.flight.mesh.position.copy(this.tmpB)

    this.tmpQuat.copy(this.flightStartQuat).slerp(this.idQuat, pe)
    this.flight.mesh.quaternion.copy(this.tmpQuat)

    const s = lerp(this.flightStartScale, this.flightEndScale, pe)
    this.flight.mesh.scale.setScalar(s)

    const u = this.flight.material.uniforms
    u.uTime.value = time
    // the ripple swells mid-flight and dies at both ends, keeping the card
    // flat when it swaps with the panel and when it becomes the hero
    u.uBend.value = Math.sin(p * Math.PI)
    // fade out as the crisp hero fades in (and back in while closing)
    u.uOpacity.value = 1 - this.detailReveal
  }

  private updateDetail(dt: number) {
    if (!this.detailGroup.visible) return
    const r = easeInOut(clamp(this.detailReveal, 0, 1))
    this.detailGroup.position.y = (1 - r) * -0.25
    this.detailGroup.children.forEach((child) => {
      const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
      if (m) m.opacity = r
    })
    // button hover pop
    this.buttons.forEach((b) => {
      const target = b.mesh === this.hoverButton ? 1.08 : 1
      b.baseScale = lerp(b.baseScale, target, Math.min(1, dt * 10))
      b.mesh.scale.setScalar(b.baseScale)
      b.mesh.material.opacity = r
    })
  }

  private updateHover() {
    if (this.phase === 'ring') {
      this.raycaster.setFromCamera(this.pointer, this.camera)
      const hit = this.raycaster.intersectObjects(this.panels.map((p) => p.mesh), false)[0]
      this.hoverIndex = hit ? ((hit.object.userData.index as number) ?? -1) : -1
    } else if (this.phase === 'detail') {
      this.raycaster.setFromCamera(this.pointer, this.camera)
      const hit = this.raycaster.intersectObjects(this.buttons.map((b) => b.mesh), false)[0]
      this.hoverButton = hit ? (hit.object as THREE.Mesh) : null
    } else {
      this.hoverIndex = -1
      this.hoverButton = null
    }
  }

  /* choose the co-terminal angle to `base` nearest the current theta */
  private nearestGoal(base: number) {
    const twoPi = Math.PI * 2
    let g = base
    while (g - this.theta > Math.PI) g -= twoPi
    while (g - this.theta < -Math.PI) g += twoPi
    return g
  }

  /* ------------------------------ public --------------------------------- */

  goTo(index: number) {
    const panel = this.panels[index]
    if (!panel || this.phase !== 'ring') return
    this.omega = 0
    this.thetaGoal = -panel.baseAngle
  }

  get isOpen() {
    return this.phase !== 'ring'
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    const el = this.renderer.domElement
    el.removeEventListener('pointerdown', this.onPointerDown)
    el.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('pointerup', this.onPointerUp)
    el.removeEventListener('wheel', this.onWheel)
    window.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('visibilitychange', this.onVisibility)
    this.ro?.disconnect()
    this.io?.disconnect()

    if (this.flight) {
      this.scene.remove(this.flight.mesh)
      this.flight.dispose()
      this.flight = null
    }
    this.disposeDetail()
    disposeObject(this.scene)
    this.glowTexture.dispose()
    this.textures.forEach((t) => t.dispose())
    this.textures.clear()
    this.renderer.dispose()
    if (el.parentElement === this.container) this.container.removeChild(el)
  }
}
