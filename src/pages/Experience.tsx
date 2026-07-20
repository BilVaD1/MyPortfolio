import React from 'react'

import { ExperienceJourney } from '../components'

/**
 * Experience — a scroll-driven, scene-by-scene journey through the career.
 * Each chapter is a full-viewport animated scene; see ../components/experienceScene.
 */
const Experience = () => (
  <div className="dark:text-white">
    <ExperienceJourney />
  </div>
)

export default Experience
