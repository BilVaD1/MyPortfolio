import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import SceneShell, { DividerVariant } from './SceneShell'
import RoleInfo from './RoleInfo'
import { Mode, useStateContext } from '../../contexts/ContextProvider'
import { RoleScene, SceneArtProps, SceneTheme } from './types'
import HeroArt from './scenes/HeroArt'
import OrthoArt from './scenes/OrthoArt'
import PipelineArt from './scenes/PipelineArt'
import StorefrontArt from './scenes/StorefrontArt'
import CloudArt from './scenes/CloudArt'
import MobileArt from './scenes/MobileArt'
import BugBoardArt from './scenes/BugBoardArt'
import OutroArt from './scenes/OutroArt'
import LinkedinIcon from '../icons/LinkedinIcon'
import Git from '../icons/Git'
import Insta from '../icons/Insta'
import './experienceScene.css'

/* -------------------------------------------------------------------------- */
/*  Role data — the six chapters (kept honest: projects, not employer names).  */
/* -------------------------------------------------------------------------- */

const roles: RoleScene[] = [
  {
    id: 'lightforce',
    project: 'Digital Orthodontics · LightForce',
    role: 'Full Stack Developer',
    description:
      'Building a platform that is revolutionising digital orthodontics with real-time 3D treatment visualisation.',
    tags: ['Angular', 'Three.js', 'Express', 'AWS', 'PDF gen'],
    responsibilities: [
      'Developing interactive, responsive interfaces in Angular',
      'Real-time 3D visualisations of orthodontic treatments with Three.js',
      'Building and maintaining scalable backend services with Express',
      'Generating PDFs to visualise complex database information',
      'Integrating AWS — CloudFront, S3, CloudWatch and Lambda',
      'Presenting demos to stakeholders and mentoring new teammates',
    ],
    theme: {
      bgFrom: '#04262b',
      bgVia: '#0a4d54',
      bgTo: '#02171b',
      accent: '#38e1c6',
      accent2: '#7fd4ff',
    },
    themeLight: {
      bgFrom: '#cdeee8',
      bgVia: '#f0fbf9',
      bgTo: '#a5ddd3',
      accent: '#0f766e',
      accent2: '#0369a1',
    },
    Art: OrthoArt,
  },
  {
    id: 'tour',
    project: 'Tour & Travel Platform',
    role: 'SDET',
    description:
      'A complex ecosystem for tour objects — renting cars, transportation, hotels and tours — hardened by an end-to-end test framework.',
    tags: ['Cypress', 'pytest', 'Next.js', 'GitHub Actions', 'Temporal'],
    responsibilities: [
      'Creating the Cypress testing framework from scratch',
      'Maintaining tests in Python (pytest) and back-end API tests',
      'Preparing the Next.js app for testing (endpoints, data-testids)',
      'Integrating tests into CI/CD — GitHub Actions + Vercel + Temporal',
      'Writing changelogs for major product updates',
    ],
    theme: {
      bgFrom: '#082a3a',
      bgVia: '#0e4a3f',
      bgTo: '#04121a',
      accent: '#4cc9f0',
      accent2: '#43e6a0',
    },
    themeLight: {
      bgFrom: '#d2e9f4',
      bgVia: '#eef8fd',
      bgTo: '#abd8c6',
      accent: '#0e7490',
      accent2: '#047857',
    },
    Art: PipelineArt,
  },
  {
    id: 'shopify',
    project: 'Headless Shopify Commerce',
    role: 'Automation QA Engineer',
    description: 'Headless eCommerce on Shopify, guarded by a from-scratch automation suite with visual regression.',
    tags: ['Cypress', 'React', 'Visual Regression', 'CI/CD'],
    responsibilities: [
      'Creating a testing framework from scratch on Cypress',
      'Preparing the React components for testing',
      'Implementing visual regression testing',
      'Integrating tests into CI/CD (GitHub Actions + Vercel)',
      'Authoring the test documentation',
    ],
    theme: {
      bgFrom: '#052e1a',
      bgVia: '#0a5236',
      bgTo: '#02150d',
      accent: '#7ee787',
      accent2: '#5eead4',
    },
    themeLight: {
      bgFrom: '#d3f1dc',
      bgVia: '#effcf3',
      bgTo: '#a9e0bd',
      accent: '#15803d',
      accent2: '#0f766e',
    },
    Art: StorefrontArt,
  },
  {
    id: 'brand',
    project: 'Cloud Brand Platform',
    role: 'Automation QA Engineer',
    description: 'A cloud-based platform for creating and managing brands, covered end-to-end from UI to API.',
    tags: ['WebdriverIO', 'Postman', 'API testing'],
    responsibilities: [
      'UI automation using WebdriverIO',
      'API testing and test-data preparation with Postman',
      'Authoring the test documentation',
    ],
    theme: {
      bgFrom: '#1a0f3a',
      bgVia: '#3b2585',
      bgTo: '#0c0720',
      accent: '#a78bfa',
      accent2: '#c4b5fd',
    },
    themeLight: {
      bgFrom: '#e3dbf8',
      bgVia: '#f5f1fe',
      bgTo: '#c8b8ef',
      accent: '#6d28d9',
      accent2: '#7c3aed',
    },
    Art: CloudArt,
  },
  {
    id: 'mobile',
    project: 'Cross-Platform Mobile App',
    role: 'Manual & Automation QA',
    description: 'An iOS and Android mobile application, tested across platforms down to the network layer.',
    tags: ['WebdriverIO', 'iOS', 'Android', 'Charles Proxy'],
    responsibilities: [
      'Cross-platform testing across iOS and Android',
      'UI mobile automation using WebdriverIO',
      'Traffic analysis and throttling with Charles Proxy',
      'Setting up and configuring iOS and Android emulators',
    ],
    theme: {
      bgFrom: '#0b1220',
      bgVia: '#123043',
      bgTo: '#050a12',
      accent: '#22d3ee',
      accent2: '#38bdf8',
    },
    themeLight: {
      bgFrom: '#d7e7f6',
      bgVia: '#eff6fd',
      bgTo: '#b4d3ec',
      accent: '#0e7490',
      accent2: '#0369a1',
    },
    Art: MobileArt,
  },
  {
    id: 'magento',
    project: 'Magento Online Stores',
    role: 'Manual QA Engineer',
    description: 'Where it began — manual quality assurance for Magento online stores, one test case at a time.',
    tags: ['Manual QA', 'Test Cases', 'Bug Tracking'],
    responsibilities: [
      'Analysing open issues in the bug-tracking system',
      'Planning personal testing activities for each sprint',
      'Writing, maintaining, executing and reviewing detailed test cases',
    ],
    theme: {
      bgFrom: '#2a1607',
      bgVia: '#5a3212',
      bgTo: '#160a03',
      accent: '#fbbf24',
      accent2: '#f6a44b',
    },
    themeLight: {
      bgFrom: '#fae5c8',
      bgVia: '#fdf6e9',
      bgTo: '#f1cf9b',
      accent: '#b45309',
      accent2: '#c2410c',
    },
    Art: BugBoardArt,
  },
]

const heroTheme: SceneTheme = {
  bgFrom: '#0b1020',
  bgVia: '#1b2350',
  bgTo: '#05060f',
  accent: '#ff8c42',
  accent2: '#f9c74f',
}

const heroThemeLight: SceneTheme = {
  bgFrom: '#d9e2f7',
  bgVia: '#f2f6ff',
  bgTo: '#bccdf0',
  accent: '#dd5e0c',
  accent2: '#b45309',
}

const outroTheme: SceneTheme = {
  bgFrom: '#150a24',
  bgVia: '#3a1e4e',
  bgTo: '#08040f',
  accent: '#ff8c42',
  accent2: '#f472b6',
}

const outroThemeLight: SceneTheme = {
  bgFrom: '#eddff7',
  bgVia: '#faf3fe',
  bgTo: '#d9c0ec',
  accent: '#dd5e0c',
  accent2: '#db2777',
}

/* -------------------------------------------------------------------------- */
/*  Unified scene list                                                         */
/* -------------------------------------------------------------------------- */

interface Shell {
  key: string
  label: string
  /** Both palettes live here; the orchestrator resolves one per Light/Dark mode. */
  themes: Record<Mode, SceneTheme>
  Art: React.FC<SceneArtProps>
  divider: DividerVariant
  scrim: 'left' | 'none'
  content: React.ReactNode
}

const linkMouse = JSON.stringify({ width: '18px', height: '18px', color: 'rgba(255, 105, 180, 0.7)' }) // pink color

const HeroContent = () => (
  <div className="mx-auto max-w-3xl text-center">
    <p
      className="exp-reveal font-mono text-sm uppercase tracking-[0.4em] text-slate-700/80 dark:text-white/60"
      style={{ ['--i' as string]: 0 }}
    >
      The Journey
    </p>
    <div className="mt-4">
      <h1
        className="exp-wipe pb-2 text-5xl font-black leading-none text-slate-900 dark:text-white sm:text-7xl md:text-8xl"
        style={{ ['--i' as string]: 1 }}
      >
        EXPERIENCE
      </h1>
    </div>
    <p
      className="exp-reveal mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-800/90 dark:text-white/80"
      style={{ ['--i' as string]: 2 }}
    >
      Six chapters of building, testing and shipping — from manual QA to full-stack 3D.
      Scroll to travel down through each one.
    </p>
    <div className="exp-reveal mt-12 flex flex-col items-center gap-1" style={{ ['--i' as string]: 3 }}>
      <span className="text-xs uppercase tracking-widest text-slate-700/70 dark:text-white/50">scroll</span>
      <svg width="22" height="34" viewBox="0 0 22 34" fill="none" aria-hidden>
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M4 ${8 + i * 8} l7 7 l7 -7`}
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: `exp-chevron 1.6s ease-in-out ${i * 0.18}s infinite` }}
          />
        ))}
      </svg>
    </div>
  </div>
)

const OutroContent = () => (
  <div className="mx-auto max-w-2xl text-center">
    <div className="pb-1">
      <h2
        className="exp-wipe pb-1 text-4xl font-black leading-tight text-slate-900 dark:text-white sm:text-6xl"
        style={{ ['--i' as string]: 0 }}
      >
        The next chapter?
      </h2>
    </div>
    <p
      className="exp-reveal mx-auto mt-6 max-w-lg text-lg leading-relaxed text-slate-800/90 dark:text-white/80"
      style={{ ['--i' as string]: 1 }}
    >
      That&apos;s the story so far — full-stack engineering with a QA mindset baked in.
      Let&apos;s build what comes next together.
    </p>
    <div className="exp-reveal mt-9 flex flex-wrap items-center justify-center gap-4" style={{ ['--i' as string]: 2 }}>
      <Link
        to="/Contact"
        className="cursor-none rounded-full px-7 py-3 text-base font-bold text-[#150a24] transition-transform hover:scale-105"
        style={{ background: 'var(--accent)', boxShadow: '0 0 24px -4px var(--accent)' }}
        data-mousecustom={linkMouse}
      >
        Start a conversation
      </Link>
      <Link
        to="/Portfolio"
        className="cursor-none rounded-full border px-7 py-3 text-base font-bold text-slate-900 transition-colors hover:bg-slate-900/10 dark:text-white dark:hover:bg-white/10"
        style={{ borderColor: 'var(--accent)' }}
        data-mousecustom={linkMouse}
      >
        See my work
      </Link>
    </div>
    <div
      className="exp-reveal mt-10 flex items-center justify-center gap-6 text-4xl text-slate-900 dark:text-white"
      style={{ ['--i' as string]: 3 }}
    >
      <LinkedinIcon />
      <Git gitLink={'https://github.com/BilVaD1'} />
      <Insta />
    </div>
  </div>
)

const dividers: DividerVariant[] = ['wave', 'curve', 'peaks', 'steps', 'wave', 'diagonal', 'curve', 'wave']
const roleLabels = ['LightForce', 'Travel', 'Storefront', 'Brand Cloud', 'Mobile', 'Magento']

const scenes: Shell[] = [
  {
    key: 'hero',
    label: 'Start',
    themes: { Dark: heroTheme, Light: heroThemeLight },
    Art: HeroArt,
    divider: dividers[0],
    scrim: 'none',
    content: <HeroContent />,
  },
  ...roles.map((role, i) => ({
    key: role.id,
    label: roleLabels[i],
    themes: { Dark: role.theme, Light: role.themeLight },
    Art: role.Art,
    divider: dividers[i + 1],
    scrim: 'left' as const,
    content: <RoleInfo scene={role} index={i} total={roles.length} />,
  })),
  {
    key: 'outro',
    label: 'Connect',
    themes: { Dark: outroTheme, Light: outroThemeLight },
    Art: OutroArt,
    divider: dividers[7],
    scrim: 'none',
    content: <OutroContent />,
  },
]

/* -------------------------------------------------------------------------- */
/*  Orchestrator                                                               */
/* -------------------------------------------------------------------------- */

const ExperienceJourney = () => {
  const { currentMode } = useStateContext()
  const [active, setActive] = useState(0)
  const sceneEls = useRef<(HTMLElement | null)[]>([])
  const barRef = useRef<HTMLDivElement>(null)

  const setSceneEl = useCallback(
    (i: number) => (el: HTMLElement | null) => {
      sceneEls.current[i] = el
    },
    [],
  )

  // Reveal on enter + track the most-visible scene for the rail.
  useEffect(() => {
    const total = scenes.length
    const ratios = new Array(total).fill(0)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          const idx = sceneEls.current.indexOf(en.target as HTMLElement)
          if (idx < 0) return
          ratios[idx] = en.isIntersecting ? en.intersectionRatio : 0
          if (en.intersectionRatio >= 0.4) (en.target as HTMLElement).classList.add('in-view')
        })
        let best = 0
        let bi = 0
        ratios.forEach((r, i) => {
          if (r > best) {
            best = r
            bi = i
          }
        })
        setActive(bi)
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    )
    sceneEls.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  // Scroll-linked parallax (--p per scene) + top progress bar (--sp).
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let raf = 0
    let queued = false
    const compute = () => {
      queued = false
      const vh = window.innerHeight
      const totalScroll = document.documentElement.scrollHeight - vh
      if (barRef.current) {
        barRef.current.style.setProperty('--sp', totalScroll > 0 ? (window.scrollY / totalScroll).toFixed(4) : '0')
      }
      sceneEls.current.forEach((el) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        if (r.bottom < -vh || r.top > vh * 2) return
        const center = r.top + r.height / 2
        const p = Math.max(-1, Math.min(1, (center - vh / 2) / vh))
        el.style.setProperty('--p', p.toFixed(3))
      })
    }
    const onScroll = () => {
      if (!queued) {
        queued = true
        raf = requestAnimationFrame(compute)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    compute()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const goTo = (i: number) => sceneEls.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="exp-journey">
      <div ref={barRef} className="exp-progressbar" aria-hidden />

      <nav className="exp-rail" aria-label="Experience chapters">
        {scenes.map((s, i) => (
          <button
            key={s.key}
            type="button"
            className="exp-rail__dot cursor-none"
            data-active={active === i}
            onClick={() => goTo(i)}
            aria-label={`Go to ${s.label}`}
            aria-current={active === i}
            data-mousecustom={linkMouse}
            style={{ ['--rail-accent' as string]: s.themes[currentMode].accent } as React.CSSProperties}
          >
            <span className="exp-rail__label">{s.label}</span>
            <span className="exp-rail__pip" />
          </button>
        ))}
      </nav>

      {scenes.map((s, i) => (
        <SceneShell
          key={s.key}
          rootRef={setSceneEl(i)}
          theme={s.themes[currentMode]}
          Art={s.Art}
          active={active === i}
          divider={s.divider}
          dividerColor={scenes[i + 1]?.themes[currentMode].bgFrom ?? 'transparent'}
          scrim={s.scrim}
          label={s.label}
        >
          {s.content}
        </SceneShell>
      ))}
    </div>
  )
}

export default ExperienceJourney
