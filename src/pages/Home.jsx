import React from 'react'
import { DownloadButton, Git, LinkedinIcon, Insta } from '../components';

import myPhoto from '../data/MyPhoto2.jpg'

import { useStateContext } from '../contexts/ContextProvider'

function Home() {
  const { setMouseHeight, setMouseWidth, setMouseTop, setMouseLeft, setMouseColor } = useStateContext();

  return (
    <div className="dark:text-white mt-[100px] pb-[50px]">

      <div className='absolute md:right-16 md:top-20 top-10 right-5'
        onMouseOver={() => {setMouseHeight('15px'); setMouseWidth('15px'); setMouseColor('rgba(191, 75, 30, 1)')}}
        onMouseLeave={() => {setMouseHeight('35px'); setMouseWidth('35px'); setMouseTop(-5); setMouseLeft(-10); setMouseColor('rgba(0, 0, 0, 0.5)')}}
      >
        <DownloadButton />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold dark:text-white text-gray-900 mb-10">About Me</h1>
        <div className="md:grid  md:grid-cols-2 gap-8">
          <div>
            <img className="md:relative m-auto h-auto w-4/6 mb-[15px] my_avatar md:w-4/5 md:h-[500px] object-cover" src={myPhoto} alt="Me" />
          </div>
          <div className="flex flex-col justify-center"
            onMouseOver={() => { setMouseColor('rgba(0, 0, 0, 0.125)') }}
            onMouseLeave={() => { setMouseColor('rgba(0, 0, 0, 0.5)') }}
          >
            <h2 className="text-2xl font-bold dark:text-white text-gray-800 mb-10">Hi, I'm Vadym <br /> (React developer/Automation QA)</h2>
            <p className="text-gray-700 dark:text-white mb-4">
            Experienced Automation QA Engineer with a strong interest in React development. Skilled in JavaScript (React , WebdriverIO, Cypress) and Python (Selenium, Pytest, Django), with a focus on designing and implementing automated tests. Currently working as an Automation QA Engineer at QA Madness, responsible for UI automation using WebdriverIO, API testing, and test data preparation.</p>
            <p className="text-gray-700 dark:text-white mb-4">Looking for a challenging role in React development to leverage my skills and passion for creating innovative solutions.</p>
            <p className="text-gray-700 dark:text-white mb-4">If you're interested in learning more about me, please feel free to contact me.</p>
          </div>

          <div className='text-4xl flex gap-6 justify-end mr-[20px] col-end-3'>
            <LinkedinIcon />
            <Git gitLink={"https://github.com/BilVaD1"}/>
            <Insta />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;