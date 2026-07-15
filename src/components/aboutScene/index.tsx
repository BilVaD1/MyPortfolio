import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useStateContext } from '../../contexts/ContextProvider'
import { SceneMode } from './types'
import SkyLayer from './SkyLayer'
import CelestialLayer from './CelestialLayer'
import PlanesLayer from './PlanesLayer'
import MountainsLayer from './MountainsLayer'
import BirdsLayer from './BirdsLayer'
import ForestLayer from './ForestLayer'
import CityLayer from './CityLayer'
import { SeaBackLayer, SeaMidLayer, SeaFrontLayer } from './SeaLayer'
import Git from '../icons/Git'
import LinkedinIcon from '../icons/LinkedinIcon'
import Insta from '../icons/Insta'
import myPhoto from '../../data/MyPhoto2.jpg'
import './aboutScene.css'

interface LayerEntry {
  el: HTMLElement
  depth: number
  tilt: number
}

/**
 * Mouse parallax: layers are registered with a depth (px shift at the screen edge)
 * and an optional tilt (deg of 3D rotation). A single rAF loop lerps toward the
 * cursor and writes transforms directly, so no React re-renders happen per frame.
 */
const useParallax = (enabled: boolean) => {
  const layers = useRef<Record<string, LayerEntry>>({})

  const register = useCallback(
    (name: string, depth: number, tilt = 0) =>
      (el: HTMLElement | null) => {
        if (el) layers.current[name] = { el, depth, tilt }
        else delete layers.current[name]
      },
    [],
  )

  useEffect(() => {
    if (!enabled) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const registry = layers.current
    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }

    const onMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1
      target.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    let frame = 0
    const tick = () => {
      current.x += (target.x - current.x) * 0.055
      current.y += (target.y - current.y) * 0.055
      Object.values(registry).forEach(({ el, depth, tilt }) => {
        const tx = (-current.x * depth).toFixed(2)
        const ty = (-current.y * depth * 0.55).toFixed(2)
        let transform = `translate3d(${tx}px, ${ty}px, 0)`
        if (tilt) {
          const ry = (current.x * tilt).toFixed(2)
          const rx = (-current.y * tilt * 0.8).toFixed(2)
          transform = `perspective(900px) ${transform} rotateX(${rx}deg) rotateY(${ry}deg)`
        }
        el.style.transform = transform
      })
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    frame = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(frame)
      Object.values(registry).forEach(({ el }) => {
        el.style.transform = ''
      })
    }
  }, [enabled])

  return register
}

/** Wrapper for a parallax layer: slightly oversized so shifting never reveals edges. */
const layerClass = 'absolute -inset-x-14 pointer-events-none'

const toggleMouseStyle = JSON.stringify({ width: '15px', height: '15px', color: 'rgba(191, 75, 30, 0.7)' })

/** Clicking the sun / moon walks through the day in natural order. */
const CYCLE: SceneMode[] = ['day', 'sunset', 'night', 'sunrise']

const AboutScene = () => {
  const { currentMode, setCurrentMode, screenSize } = useStateContext()
  const [expanded, setExpanded] = useState(false)
  const [sceneMode, setSceneMode] = useState<SceneMode>(currentMode === 'Dark' ? 'night' : 'day')
  const skipSync = useRef(false)
  const parallaxEnabled = (screenSize ?? 0) >= 900
  const layer = useParallax(parallaxEnabled)

  // The sidebar buttons keep their meaning: Light → day, Dark → night.
  useEffect(() => {
    if (skipSync.current) {
      skipSync.current = false
      return
    }
    setSceneMode(currentMode === 'Dark' ? 'night' : 'day')
  }, [currentMode])

  // Cycling from the scene also flips the app's Light/Dark styling so text stays legible.
  const cycleSceneMode = () => {
    const next = CYCLE[(CYCLE.indexOf(sceneMode) + 1) % CYCLE.length]
    setSceneMode(next)
    const wanted = next === 'night' || next === 'sunset' ? 'Dark' : 'Light'
    if (wanted !== currentMode) {
      skipSync.current = true
      setCurrentMode(wanted)
    }
  }

  return (
    <section className="about-scene relative h-screen min-h-[560px] w-full overflow-hidden">
      {/* 0 — sky */}
      <div className="absolute inset-0 z-0">
        <SkyLayer mode={sceneMode} />
      </div>

      {/* 1 — sun / moon / stars / clouds (sun & moon are clickable) */}
      <div ref={layer('celestial', 8)} className={`${layerClass} inset-y-0 z-[1]`} style={{ willChange: 'transform' }}>
        <CelestialLayer mode={sceneMode} onCycle={cycleSceneMode} />
      </div>

      {/* 2 — planes with contrails */}
      <div ref={layer('planes', 11)} className={`${layerClass} inset-y-0 z-[2]`} style={{ willChange: 'transform' }}>
        <PlanesLayer mode={sceneMode} />
      </div>

      {/* 3 — snowcapped mountains */}
      <div
        ref={layer('mountains', 14)}
        className={`${layerClass} z-[3]`}
        style={{ willChange: 'transform', top: '6%', bottom: '36%' }}
      >
        <MountainsLayer mode={sceneMode} />
      </div>

      {/* 4 — birds */}
      <div ref={layer('birds', 18)} className={`${layerClass} inset-y-0 z-[4]`} style={{ willChange: 'transform' }}>
        <BirdsLayer mode={sceneMode} />
      </div>

      {/* 5 — pine forest */}
      <div
        ref={layer('forest', 22)}
        className={`${layerClass} z-[5]`}
        style={{ willChange: 'transform', bottom: '34%', height: '16%' }}
      >
        <ForestLayer mode={sceneMode} />
      </div>

      {/* 6 — town on the rocky shore + balloons */}
      <div
        ref={layer('city', 27)}
        className={`${layerClass} z-[6]`}
        style={{ willChange: 'transform', top: '24%', bottom: '30%' }}
      >
        <CityLayer mode={sceneMode} />
      </div>

      {/* 7 — description text, floating between city and sea */}
      {/* On mobile the panel floats above the sea (z-11); on md+ it sits between city and sea (z-7) */}
      <div
        ref={layer('text', 30)}
        className="pointer-events-none absolute inset-0 z-[11] md:z-[7]"
        style={{ willChange: 'transform' }}
      >
        <div
          className="pointer-events-auto absolute left-4 right-4 top-[45%] max-w-[560px] rounded-2xl border border-white/40 bg-white/60 p-5 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-[#101730]/60 md:left-[6%] md:right-auto md:top-[16%] md:w-[44%] lg:p-8"
          test-id="main-text"
          data-mousecustom={JSON.stringify({ color: 'rgba(0, 0, 0, 0.125)' })}
        >
          <div className="max-h-[38vh] overflow-y-auto pr-1">
            <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-white md:mb-4 md:text-2xl lg:text-3xl">
              Hi, I&apos;m Vadym
              <br />
              <span className="text-orange-700 dark:text-orange-300">Full Stack Developer</span>
            </h2>
            <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-100 lg:text-base">
              Full Stack Developer with extensive experience in building robust and dynamic web applications. Skilled
              in JavaScript (TS)(Angular, Three.js, Express, NextJS, React) and Python (FastAPI, Django, Selenium,
              Pytest). Also, I have a solid background in Automation QA Engineering.
            </p>
            <div
              className={`overflow-hidden transition-all duration-700 ease-in-out ${expanded ? 'mt-3 max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <p className="mb-3 text-sm leading-relaxed text-gray-800 dark:text-gray-100 lg:text-base">
                Having a strong foundation in Angular, Three.js, and Express, I am driven to take on challenging
                projects that leverage my skills and contribute to the creation of innovative, user-friendly, and
                visually engaging applications. Whether it&apos;s building responsive and dynamic user interfaces with
                Angular, creating immersive 3D visualizations with Three.js, or developing robust backend solutions
                with Express, I am confident in my ability to deliver high-quality results. My experience working
                closely with AWS services and generating complex data visualizations further enhances my capability to
                provide impactful and scalable solutions.
              </p>
              <p className="mb-3 text-sm leading-relaxed text-gray-800 dark:text-gray-100 lg:text-base">
                Additionally, I am open to considering positions in Automation QA, where I can apply my attention to
                detail and passion for ensuring the seamless functionality of software through thorough testing
                processes. I believe in the importance of quality assurance in the software development lifecycle and
                am committed to delivering reliable and efficient solutions.
              </p>
              <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-100 lg:text-base">
                If you have any opportunities or know of someone who is looking for a dedicated and versatile
                individual to join their team, I would love to connect and discuss how my skills align with their
                needs, please feel free to contact me.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            className="group mt-4 flex cursor-none items-center gap-2 text-sm font-semibold text-orange-700 transition-colors hover:text-orange-500 dark:text-orange-300 dark:hover:text-orange-200"
            data-mousecustom={toggleMouseStyle}
          >
            {expanded ? 'Show less' : 'More about me'}
            <span className={`transition-transform duration-500 ${expanded ? 'rotate-180' : ''}`}>▾</span>
          </button>
        </div>
      </div>

      {/* 8-10 — three sea bands with foam, boats and dolphins */}
      <div
        ref={layer('seaBack', 36)}
        className={`${layerClass} z-[8]`}
        style={{ willChange: 'transform', top: '64%', bottom: '-40px' }}
      >
        <SeaBackLayer mode={sceneMode} />
      </div>
      <div
        ref={layer('seaMid', 44)}
        className={`${layerClass} z-[9]`}
        style={{ willChange: 'transform', top: '76%', bottom: '-40px' }}
      >
        <SeaMidLayer mode={sceneMode} />
      </div>
      <div
        ref={layer('seaFront', 54)}
        className={`${layerClass} z-[10]`}
        style={{ willChange: 'transform', top: '88%', bottom: '-40px' }}
      >
        <SeaFrontLayer mode={sceneMode} />
      </div>

      {/* 11 — floating avatar card with parallax tilt */}
      <div
        ref={layer('avatar', 40, 6)}
        className="absolute left-1/2 top-[18%] z-[11] ml-[-84px] md:left-auto md:right-[7%] md:top-[18%] md:ml-0"
        style={{ willChange: 'transform' }}
      >
        <div style={{ animation: 'avatar-bob 6s ease-in-out infinite' }}>
          <div className="relative">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-orange-300/60 to-sky-300/50 blur-lg dark:from-indigo-500/40 dark:to-purple-500/30" />
            <img
              className="my_avatar relative h-[210px] w-[168px] rounded-2xl border-4 border-white/80 object-cover shadow-2xl dark:border-white/20 md:h-[330px] md:w-[264px] lg:h-[380px] lg:w-[300px]"
              src={myPhoto}
              alt="Me"
            />
          </div>
        </div>
      </div>

      {/* 12 — social links floating over the water */}
      <div
        ref={layer('socials', 48)}
        className="absolute bottom-3 left-1/2 z-[12] ml-[-95px] md:bottom-[8%] md:left-[6%] md:ml-0"
        style={{ willChange: 'transform' }}
      >
        <div
          className="flex w-[190px] items-center justify-center gap-5 rounded-full border border-white/40 bg-white/50 py-2.5 text-4xl text-gray-800 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-[#101730]/50 dark:text-white"
          style={{ animation: 'avatar-bob 7s ease-in-out 1.2s infinite' }}
        >
          <LinkedinIcon />
          <Git gitLink={'https://github.com/BilVaD1'} />
          <Insta />
        </div>
      </div>
    </section>
  )
}

export default AboutScene
