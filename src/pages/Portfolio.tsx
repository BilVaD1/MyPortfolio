import React from 'react'

import PortfolioScene from '../components/portfolioScene'

/**
 * The Portfolio page is a native-Three.js gallery: an orbital ring of project
 * panels floating in a starfield that dissolve into particles and reform as a
 * full 3D detail scene. Reduced-motion / no-WebGL / small screens fall back to
 * an accessible card grid — both driven by the same data in
 * components/portfolioScene/projects.ts.
 */
const Portfolio = () => <PortfolioScene />

export default Portfolio
