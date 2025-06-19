/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { ExperienceItem } from '../components'
import { useStateContext } from '../contexts/ContextProvider'

const items = [
  {
    description: 
    "Working as a Full Stack Developer at LightForce, a company revolutionizing digital orthodontics with advanced technologies and 3D visualization solutions.",
    role: "Full Stack Developer",
    responsibilities: [
      "Developing interactive and responsive user interfaces using Angular",
      "Creating real-time 3D visualizations of orthodontic treatments with Three.js",
      "Building and maintaining scalable backend services using Express",
      "Generating PDFs to visualize complex database information for reporting",
      "Collaborating closely with AWS services like CloudFront, S3, CloudWatch, and Lambda Functions for cloud integration and optimization",
      "Presenting demos to stakeholders and teams to showcase application features and progress",
      "Teaching and mentoring new team members to ensure smooth onboarding",
      "Working in agile teams to integrate innovative features and resolve technical challenges"
    ]
  },  
  {
    description: 
    'Working as SDET for a tour agency company that provides complex ecosystems for various tour objects, such as: renting cars, transportation, booking hotels, tours, and others.',
    role: 'SDET (Software Development Engineer in Test)',
    responsibilities: [
      'Creating the testing framework on Cypress from scratch',
      'Maintaining the tests on Python(pytest)',
      'Designing and writing back-end API tests(Python)',
      'Preparing the project on NextJS for testing(creating API endpoints, adding data-testids)',
      'Implementing the testing for Maizzle',
      'Integrating tests to CI/CD(Github Actions + Vercel + Temporal)',
      'Interacting with developers regarding the project matters',
      'Creating changelogs for major product updates'
    ],
  },
  {
    description:
      'Headless eCommerce on Shopify.',
    role: 'Automation Quality Assurance Engineer',
    responsibilities: [
      'Creating a testing framework from scratch on Cypress',
      'Preparing the React components for testing',
      'Implementing the visual regression testing',
      'Integrating tests to CI/CD(Github Actions + Vercel)',
      'Created the test documentations'
    ],
  },
  {
    description:
      'The cloud-based platform for creating and managing brands.',
    role: 'Automation Quality Assurance Engineer',
    responsibilities: [
      'UI automation using WebdriverIO',
      'API testing and test data preparation with Postman.',
      'Created the test documentations',
    ],
  },
  {
    description:
      'iOS and Android mobile application',
    role: 'Manual and Automation Quality Assurance Engineer',
    responsibilities: [
      'Cross-platform testing',
      'UI mobile automation using WebdriverIO',
      'Traffic analyzing and throttling with Charles Proxy',
      'Setting up and configuring of emulators for iOS and Android',
    ],
  },
  {
    description:
      'Magento Online Stores',
    role: 'Manual Quality Assurance Engineer',
    responsibilities: [
      'Analysis of open issues in bug tracking system',
      'Planning personal testing activities for the sprint',
      'Weriting and maintaining the detailed test cases, executing them, reviewing test cases',
    ],
  },
];

const Experience = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { setMouseColor, setMouseWidth, setMouseHeight } = useStateContext();

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
  };

  const handleDotClick = (idx) => {
    setSelectedIndex(idx);
  };

  // Mouse effect handlers
  const handleMouseOver = (size) => {
    setMouseWidth(size);
    setMouseHeight(size);
    setMouseColor('rgba(255, 140, 0, 0.7)'); // orange
  };
  const handleMouseLeave = () => {
    setMouseWidth('35px');
    setMouseHeight('35px');
    setMouseColor('rgba(0, 0, 0, 0.5)');
  };

  return (
    <div className="dark:text-white mt-[100px] pb-[50px] flex flex-col items-center">
      <div className="mb-6 text-center">
        <div className="text-2xl dark:text-yellow-200 text-orange-400 pb-2 font-semibold">
          {items[selectedIndex].role}
        </div>
        <div>
          <p className="dark:text-rose-200 pb-1 text-xl">In</p>
          <p className="text-2xl text-violet-500 font-bold">{items[selectedIndex].company || ''}</p>
        </div>
      </div>
      <div className="relative w-full max-w-2xl flex items-center justify-center">
        <button
          onClick={handlePrev}
          disabled={selectedIndex === 0}
          className={`absolute cursor-none left-0 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:bg-orange-200 transition disabled:opacity-40 disabled:cursor-not-allowed`}
          aria-label="Previous Experience"
          onMouseOver={() => handleMouseOver('20px')}
          onMouseLeave={handleMouseLeave}
        >
          &#8592;
        </button>
        <div className="w-full flex justify-center">
          <ExperienceItem item={items[selectedIndex]} />
        </div>
        <button
          onClick={handleNext}
          disabled={selectedIndex === items.length - 1}
          className={`absolute cursor-none right-0 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:bg-orange-200 transition disabled:opacity-40 disabled:cursor-not-allowed`}
          aria-label="Next Experience"
          onMouseOver={() => handleMouseOver('20px')}
          onMouseLeave={handleMouseLeave}
        >
          &#8594;
        </button>
      </div>
      <div className="flex gap-2 mt-6">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`w-3 h-3 cursor-none rounded-full border-2 ${selectedIndex === idx ? 'bg-orange-400 border-orange-400' : 'bg-gray-300 dark:bg-gray-700 border-gray-400'} transition`}
            aria-label={`Go to experience ${idx + 1}`}
            onMouseOver={() => handleMouseOver('10px')}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>
    </div>
  )
}

export default Experience