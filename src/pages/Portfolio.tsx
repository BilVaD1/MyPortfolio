import React from 'react'

import PortfolioScene from '../components/portfolioScene'

/**
 * The Portfolio page is a native-Three.js gallery: an orbital ring of project
 * panels floating in a starfield; a clicked panel glides forward like a
 * rippling sheet of paper and lands as the hero of a full 3D detail scene.
 * Reduced-motion / no-WebGL / small screens fall back to
 * an accessible card grid — both driven by the same data in
 * components/portfolioScene/projects.ts.
 */
const Portfolio = () => <PortfolioScene />

export default Portfolio
