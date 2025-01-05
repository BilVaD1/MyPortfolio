import React from 'react'
import { DownloadButton, Git, LinkedinIcon, Insta } from '../components';

import myPhoto from '../data/MyPhoto2.jpg'

import { useStateContext } from '../contexts/ContextProvider'

function Home() {
  const { setMouseHeight, setMouseWidth, setMouseTop, setMouseLeft, setMouseColor } = useStateContext();

  return (
    <div className="dark:text-white mt-[100px] pb-[50px]">

      <div className='absolute md:right-16 md:top-20 top-10 right-5'
        test-id='DownloadButton'
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
            test-id='main-text'
            onMouseOver={() => { setMouseColor('rgba(0, 0, 0, 0.125)') }}
            onMouseLeave={() => { setMouseColor('rgba(0, 0, 0, 0.5)') }}
          >
            <h2 className="text-2xl font-bold dark:text-white text-gray-800 mb-10">Hi, I'm Vadym <br /> Full Stack Developer</h2>
            <p className="text-gray-700 dark:text-white mb-4">
            Full Stack Developer with extensive experience in building robust and
            dynamic web applications. Skilled in JavaScript (TS)(Angular, Three.js,
            Express, NextJS, React) and Python (FastAPI , Django, Selenium, Pytest).
            Also, I have a solid background in Automation QA Engineering.</p>
            <p className="text-gray-700 dark:text-white mb-4">Having a strong foundation in Angular, Three.js, and Express, I am driven to take on challenging projects that leverage my skills and contribute to the creation of innovative, user-friendly, and visually engaging applications. Whether it's building responsive and dynamic user interfaces with Angular, creating immersive 3D visualizations with Three.js, or developing robust backend solutions with Express, I am confident in my ability to deliver high-quality results. My experience working closely with AWS services and generating complex data visualizations further enhances my capability to provide impactful and scalable solutions.</p>
            <p className="text-gray-700 dark:text-white mb-4">Additionally, I am open to considering positions in Automation QA, where I can apply my attention to detail and passion for ensuring the seamless functionality of software through thorough testing processes. I believe in the importance of quality assurance in the software development lifecycle and am committed to delivering reliable and efficient solutions.</p>
            <p className="text-gray-700 dark:text-white mb-4">If you have any opportunities or know of someone who is looking for a dedicated and versatile individual to join their team, I would love to connect and discuss how my skills align with their needs, please feel free to contact me.</p>
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