import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

import { projects, Project } from './projects'
import { PortfolioGallery, GalleryTheme } from './gallery'
import { useStateContext } from '../../contexts/ContextProvider'
import Git from '../icons/Git'
import External from '../icons/External'
import './portfolioScene.css'

/* -------------------------------------------------------------------------- */
/*  Capability detection — the WebGL gallery is the headline experience, but    */
/*  reduced-motion, no-WebGL and small screens get the honest card grid so       */
/*  nobody ever meets a blank canvas.                                            */
/* -------------------------------------------------------------------------- */

function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(
      (window as unknown as { WebGLRenderingContext?: unknown }).WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl'))
    )
  } catch {
    return false
  }
}

function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReduce(mq.matches)
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])
  return reduce
}

function useViewportWidth(): number {
  const [w, setW] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200))
  useEffect(() => {
    const handler = () => setW(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return w
}

const canvasMouse = JSON.stringify({ width: '12px', height: '12px', color: 'rgba(255, 140, 66, 0.55)' })
const dotMouse = JSON.stringify({ width: '10px', height: '10px', color: 'rgba(255, 105, 180, 0.7)' })

/* -------------------------------------------------------------------------- */
/*  The 3D gallery                                                              */
/* -------------------------------------------------------------------------- */

const PortfolioCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<PortfolioGallery | null>(null)
  const navigate = useNavigate()
  // Keep navigate in a ref so the gallery is created exactly once — a changing
  // navigate identity must never tear down and rebuild the WebGL scene.
  const navigateRef = useRef(navigate)
  navigateRef.current = navigate

  const { currentMode } = useStateContext()
  const theme: GalleryTheme = currentMode === 'Light' ? 'light' : 'dark'
  // Same ref idiom: the mount effect reads the theme without depending on it.
  const themeRef = useRef(theme)
  themeRef.current = theme

  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return undefined

    const gallery = new PortfolioGallery(el, projects, {
      onActive: setActive,
      onOpen: (isOpen) => setOpen(isOpen),
      navigate: (path) => navigateRef.current(path),
      theme: themeRef.current,
    })
    galleryRef.current = gallery
    let alive = true
    gallery.ready
      .then(() => {
        if (!alive) return
        setLoading(false)
        if (gallery.panelCount === 0) setError('The gallery loaded but no panels were built — see console.')
      })
      .catch((err: unknown) => {
        // eslint-disable-next-line no-console
        console.error('[PortfolioGallery] init failed', err)
        if (alive) {
          setLoading(false)
          setError(String(err))
        }
      })

    return () => {
      alive = false
      gallery.dispose()
      galleryRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    galleryRef.current?.setTheme(theme)
  }, [theme])

  return (
    <div className="pf-stage">
      <div className="pf-canvas cursor-none" ref={containerRef} data-mousecustom={canvasMouse} />

      {loading && (
        <div className="pf-loader" aria-hidden>
          <span className="pf-loader__dot" />
          <span className="pf-loader__dot" />
          <span className="pf-loader__dot" />
          <p>Entering the gallery…</p>
        </div>
      )}

      {error && (
        <div className="pf-loader" role="alert">
          <p style={{ maxWidth: 420, textAlign: 'center', color: '#ff8c42' }}>{error}</p>
        </div>
      )}

      <div className={`pf-overlay ${open ? 'is-open' : ''}`} aria-hidden>
        <header className="pf-head">
          <p className="pf-eyebrow">Selected work</p>
          <h1 className="pf-title">My Portfolio</h1>
        </header>

        <p className="pf-hint">
          <span>drag</span>
          <i />
          <span>scroll</span>
          <i />
          <span>click to open</span>
        </p>

        <nav className="pf-dots" aria-label="Projects">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className="pf-dot cursor-none"
              data-active={active === i}
              onClick={() => galleryRef.current?.goTo(i)}
              aria-label={`Show ${p.title}`}
              data-mousecustom={dotMouse}
              style={{ ['--dot' as string]: p.accent } as React.CSSProperties}
            >
              <span className="pf-dot__label">{p.title}</span>
              <span className="pf-dot__pip" />
            </button>
          ))}
        </nav>
      </div>

      <button
        type="button"
        className={`pf-back cursor-none ${open ? 'is-visible' : ''}`}
        onClick={() => galleryRef.current?.close()}
        aria-label="Back to the gallery"
        data-mousecustom={dotMouse}
      >
        <FiArrowLeft />
        <span>Back</span>
      </button>

      {/* Accessible / crawlable mirror of everything the canvas shows */}
      <ul className="pf-sr">
        {projects.map((p) => (
          <li key={p.id}>
            <a href={p.href} target="_blank" rel="noreferrer">
              {p.title}
            </a>
            {' — '}
            {p.description}
            {p.git && (
              <>
                {' · '}
                <a href={p.git} target="_blank" rel="noreferrer">
                  Source
                </a>
              </>
            )}
            {p.demo && (
              <>
                {' · '}
                <Link to={p.demo}>Live demo</Link>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Fallback grid (reduced-motion / no-WebGL / small screens)                   */
/* -------------------------------------------------------------------------- */

const cardMouse = JSON.stringify({ width: '15px', height: '15px' })

const FallbackCard = ({ project }: { project: Project }) => (
  <div
    className="pf-card group dark:text-slate-300"
    style={{ ['--dot' as string]: project.accent } as React.CSSProperties}
  >
    <a href={project.href} target="_blank" rel="noreferrer" className="cursor-none" data-mousecustom={cardMouse}>
      <img className="pf-card__img" src={project.image} alt={project.title} loading="lazy" />
    </a>
    <div className="pf-card__body">
      <div className="pf-card__head">
        <h3 className="pf-card__title">{project.title}</h3>
        <External link={project.href} />
      </div>
      <p className="pf-card__desc">{project.detail}</p>
      <div className="pf-card__links">
        {project.demo && (
          <Link
            to={project.demo}
            className="pf-card__demo cursor-none"
            data-mousecustom={cardMouse}
            style={{ borderColor: project.accent, color: project.accent }}
          >
            Live Demo
          </Link>
        )}
        {project.git && <Git gitLink={project.git} />}
      </div>
    </div>
  </div>
)

const PortfolioGrid = () => (
  <div className="pf-fallback">
    <div className="dark:text-slate-300 text-4xl italic text-center mt-[50px]">My Portfolio</div>
    <div className="pf-grid">
      {projects.map((p) => (
        <FallbackCard key={p.id} project={p} />
      ))}
    </div>
  </div>
)

/* -------------------------------------------------------------------------- */

const PortfolioScene = () => {
  const width = useViewportWidth()
  const reduce = usePrefersReducedMotion()
  const webgl = useMemo(webglAvailable, [])
  const use3D = webgl && !reduce && width >= 820

  return use3D ? <PortfolioCanvas /> : <PortfolioGrid />
}

export default PortfolioScene
