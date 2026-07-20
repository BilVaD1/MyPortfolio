/* -------------------------------------------------------------------------- */
/*  Portfolio project data — shared by the native-Three.js gallery and the      */
/*  reduced-motion / no-WebGL fallback grid. Kept in one place so the two        */
/*  presentations never drift apart.                                             */
/* -------------------------------------------------------------------------- */

import employees from '../../data/Employees.png'
import fuel from '../../data/Fuel2.png'
import dashboard from '../../data/Dashboard.png'
import magento from '../../data/Magento2.png'
import musicRoom from '../../data/MusicRoom.png'
import mouse from '../../data/Mouse.png'
import reHouse from '../../data/rehouse.png'

export interface Project {
  id: number
  title: string
  /** Short one-liner shown on the panel / card. */
  description: string
  /** The long-form blurb revealed in the detail scene. */
  detail: string
  /** Primary external URL (live site / package / repo landing). */
  href: string
  /** Optional GitHub source link. */
  git?: string
  /** Optional in-app demo route (react-router path). */
  demo?: string
  /** Imported image URL used as the panel texture + detail hero. */
  image: string
  /** Per-project accent used for the glow, border and rail dot. */
  accent: string
}

/**
 * Order is intentional — it drives the ring layout (index 0 sits at the front
 * on load). Content mirrors the original `cards[]` from pages/Portfolio.tsx.
 */
export const projects: Project[] = [
  {
    id: 7,
    title: 'ReHouse',
    description: 'Landing page for a reconstruction company in Canada',
    detail:
      "A fully-responsive landing page for a reconstruction company in Canada. Crafted with React and Tailwind, hosted on Netlify.",
    href: 'https://re-house.ca/',
    image: reHouse,
    accent: '#ff8c42',
  },
  {
    id: 6,
    title: 'SmartMouse',
    description: 'A custom mouse-cursor component with flexible settings',
    detail:
      'A React component that tracks the cursor and renders a customisable follower. It understands the element it hovers (button, link, image, text…) and adapts its look accordingly — published to npm.',
    href: 'https://www.npmjs.com/package/react-smart-mouse',
    git: 'https://github.com/BilVaD1/SmartMouse',
    demo: '/SmartMouse',
    image: mouse,
    accent: '#ff5fa2',
  },
  {
    id: 1,
    title: 'React Employees App',
    description: 'Create, award, promote, filter and search employees',
    detail:
      'A React app to create, delete, award, promote, filter and search employees. Deployed on GitHub Pages with a CI/CD pipeline (GitHub Actions) that runs a WebdriverIO suite before shipping the build.',
    href: 'https://bilvad1.github.io/React_employees_app/',
    git: 'https://github.com/BilVaD1/React_employees_app',
    image: employees,
    accent: '#38bdf8',
  },
  {
    id: 2,
    title: 'Fuel',
    description: 'Python app for calculating fuel/oil remaining onboard',
    detail:
      "A Python app for calculating the amount of fuel or oil left onboard. Pick a tank, enter the soundings, and get the volume in m³ and tonnes — plus a generated xlsx summary report for every tank on the vessel.",
    href: 'https://github.com/BilVaD1/FUEL',
    git: 'https://github.com/BilVaD1/FUEL',
    image: fuel,
    accent: '#38e1c6',
  },
  {
    id: 3,
    title: 'Dashboard',
    description: 'A Syncfusion dashboard — calendar, kanban, editor, charts',
    detail:
      'A dashboard built with Syncfusion bundling several apps: Calendar, Kanban, Editor and Colour-Picker, alongside Line and Area charts.',
    href: 'https://dashboardsync-by-vadym.netlify.app',
    git: 'https://github.com/BilVaD1/Dashboard',
    image: dashboard,
    accent: '#a78bfa',
  },
  {
    id: 4,
    title: 'Automation Tests',
    description: 'WebdriverIO automation for Magento 2 with Allure reporting',
    detail:
      'A WebdriverIO automation project for the Magento 2 demo store, wired to the Allure reporter. The product listing page is selectable from the command line, so a single suite can be pointed at any category.',
    href: 'https://magento.softwaretestingboard.com',
    git: 'https://github.com/BilVaD1/Magento_AutoJS',
    image: magento,
    accent: '#fbbf24',
  },
  {
    id: 5,
    title: 'Music Room',
    description: 'Dockerised Django + React, shared Spotify playback',
    detail:
      'A web app where users create a room and play music from Spotify. Guests with room access can vote to skip, pause or start playback and see the queue. A Dockerised Python/Django backend serving a React front-end from the same host.',
    href: 'https://github.com/BilVaD1/Music-Room',
    git: 'https://github.com/BilVaD1/Music-Room',
    image: musicRoom,
    accent: '#7ee787',
  },
]
