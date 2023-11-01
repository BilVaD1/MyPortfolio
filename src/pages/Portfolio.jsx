import React, { useState, useEffect, useRef } from 'react'
import { AiOutlineClose } from 'react-icons/ai'

import { IconContext } from "react-icons";

import { Git, External } from '../components';
import { useStateContext } from '../contexts/ContextProvider'

import employees from '../data/Employees.png'
import fuel from '../data/Fuel2.png'
import dashboard from '../data/Dashboard.png'
import magento from '../data/Magento2.png'
import musicRoom from '../data/MusicRoom.png'
import mouse from '../data/Mouse.png'
import reHouse from '../data/rehouse.png'

const cards = [
  {
    id: 7,
    link: 'Project7',
    href: 'https://re-house.ca/',
    //linkOnGit: 'https://github.com/BilVaD1',
    title: 'ReHouse',
    description: 'Landing page for reconstruction company in Canada',
    additionalDescription: "This website is fully-responsive landing page belongs to a reconstruction company in Canada. Crafted using React and Tailwind, it's hosted on Netlify.",
    image: reHouse,
  },
  {
    id: 6,
    link: 'Project6',
    href: 'https://www.npmjs.com/package/react-smart-mouse',
    linkOnGit: 'https://github.com/BilVaD1/SmartMouse',
    title: 'React FollowMouse Component',
    description: 'A custom mouse cursor component with flexible settings',
    additionalDescription: "The FollowMouse component is a React component that tracks the mouse cursor position and renders a customizable mouse follower element. It allows you to add interactive and visually appealing mouse effects to your web applications. Also, it understands which element it's hovering and apply the different related impacts on the component (e.g. button, a, img, span, p, etc...)",
    image: mouse,
  },
  {
    id: 1,
    link: 'Project1',
    href: 'https://bilvad1.github.io/React_employees_app/',
    linkOnGit: 'https://github.com/BilVaD1/React_employees_app',
    title: 'React employees app',
    description: 'This is my app on React where you can: Create employees, Delete Employees, Select employees for award, Select employees for promotion, Filter employees, and Search Employees.',
    additionalDescription: 'This is project deployed on the GitHub pages. Also, it uses CI/CD(GitHub Actions) for running tests from the Tests branch(webdriverIO) and deploys the build on the GitHub Pages.',
    image: employees,
  },
  {
    id: 2,
    link: 'Project2',
    href: 'https://github.com/BilVaD1/FUEL',
    linkOnGit: 'https://github.com/BilVaD1/FUEL',
    title: 'Fuel',
    description: 'This is the app on Python for calculating the amount of fuel or oil that is left onboard.',
    additionalDescription: "In this app, you can specify the fuel/oil tank, enter the measurements(sounding) of the selected tank, and receive the amount of fuel/oil left on the vessel in the m3 and tonnes. Also you can generate the summary report(xlsx) for all ship's tanks.",
    image: fuel,
  }, 
  {
    id: 3,
    link: 'Project3',
    href: 'https://dashboardsync-by-vadym.netlify.app',
    linkOnGit: 'https://github.com/BilVaD1/Dashboard',
    title: 'Dashboard',
    description: 'This is a dashboard created with Syncfusion. This dashboard has different apps: Calendar, Kanban, Editor, Color-Picker; Chart: Line, Area;',
    additionalDescription: "",
    image: dashboard,
  },
  {
    id: 4,
    link: 'Project4',
    href: 'https://magento.softwaretestingboard.com',
    linkOnGit: 'https://github.com/BilVaD1/Magento_AutoJS',
    title: 'Automation Tests',
    description: 'This is project with automation tests based on the webdriverIO for the Magento 2 site and project works with the Allure reporter;',
    additionalDescription: 'You can specify the Product Listing page from the CL. For that enter a value into the ListingPage variable(package.json > scripts > wdio > ListingPage). For example: ListingPage=women_Jackets then the page: https://magento.softwaretestingboard.com/women/tops-women/jackets-women.html will be opened. By default is the "women_HoodiesAndSweatshirts"(if you left the ListingPage empty). For specifing Hoodies & Sweatshirts use "HoodiesAndSweatshirts"; For Fitness Equipment: "gear_FitnessEquipment"',
    image: magento,
  },
  {
    id: 5,
    link: 'Project5',
    href: 'https://github.com/BilVaD1/Music-Room',
    linkOnGit: 'https://github.com/BilVaD1/Music-Room',
    title: 'Music Room',
    description: 'This app uses Dockerizing a Python Django app with React, serving from the same host;',
    additionalDescription: 'Music Room is a web application that allows users to create a room and play music from Spotify. Other users who have access to the room can vote to skip songs, pause or start the music, and view the song queue.',
    image: musicRoom,
  }
]

const Portfolio = () => {
  const [activeCard, setActiveCard] = useState(0);

  const { setMouseHeight, setMouseWidth, setMouseColor } = useStateContext();

  const ref = useRef();

  const handleClose = (e) => {
    // if statement to handle the e.stopPropagation(); only when I click on the close, instead of when I click outside the project cart
    if (e !== undefined) {
      e.stopPropagation(); // It's using to prevent onClick on the parent element
    }
    setActiveCard(0)
  }

  const handleCardClick = (id) => {
    setActiveCard(id);
    setTimeout(() => executeScroll(), 500)
  };

  const executeScroll = () => {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }  

  // Для закрытия окна по клику вне его
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handleClose()
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);

  return (
    <div>

      <div className='dark:text-slate-300 text-4xl italic text-center mt-[50px]'>
        My Portfolio
      </div>

      <div className="flex flex-wrap justify-center pt-[50px]" id='portfolio'>

        {cards.map(card => (
          <div          
            ref={activeCard === card.id ? ref : null}
            key={card.id}
            test-id="project-item"
            className={`dark:text-slate-300
              rounded overflow-hidden 
              shadow-lg m-4 
              dark:drop-shadow-2xl
              hover:bg-gray-100 
              duration-700 
              grayscale 
              hover:grayscale-0 
              hover:dark:text-slate-900
              ${activeCard === card.id ? 'max-h-[750px] max-w-[800px] overflow-y-scroll relative dark:text-slate-900 bg-gray-100 grayscale-0' : 'max-w-sm hover:mt-[50px] hover:mr-20 hover:max-h-[450px] max-h-[400px]'}
            `}
            onClick={() => handleCardClick(card.id)}
            onMouseOver={() => {setMouseHeight('15px'); setMouseWidth('15px')}}
            onMouseLeave={() => {setMouseHeight('35px'); setMouseWidth('35px')}}
          > 
            {activeCard === card.id ? 
              <div className='text-3xl hover:text-4xl fixed right-0 top-0 duration-500 mt-[5px] mr-[5px]'>
                <button onClick={handleClose}
                  test-id="close-btn"
                  className="cursor-none"
                  onMouseOver={() => {setMouseHeight('15px'); setMouseWidth('15px'); setMouseColor('rgba(49, 39, 245, 0.7)')}}
                  onMouseDown={() => {setMouseHeight('35px'); setMouseWidth('35px'); setMouseColor('rgba(0, 0, 0, 0.5)')}}  
                  onMouseLeave={() => {setMouseHeight('35px'); setMouseWidth('35px'); setMouseColor('rgba(0, 0, 0, 0.5)')}} 
                >
                  <IconContext.Provider value={{ color: "orange", className: "global-class-name" }}>
                    <div>
                      <AiOutlineClose />
                    </div>
                  </IconContext.Provider>
                </button>
              </div> : ''}

            <img className={`mt-[10px] object-contain
              ${activeCard === card.id ? 'm-auto w-auto mt-[15px] h-auto duration-500' : 'w-full h-3/6'}`}
                src={card.image} 
                alt={card.title} 
            />

            <div className="px-6 py-4">
              {activeCard === card.id ? 
                <div className={`font-bold flex justify-between mr-[15px]
                  ${activeCard === card.id ? 'text-3xl mb-[15px] mt-[20px]' : 'text-xl'}
                  mb-2`}
                >
                    {card.title}
                    <External link={card.href}/>
                </div> : ''}
              <p className="text-base"
                onMouseOver={() => { setMouseColor('rgba(0, 0, 0, 0.125)') }}
                onMouseLeave={() => { setMouseColor('rgba(0, 0, 0, 0.5)') }} 
              >
                {card.description}
              </p>

              <div className={`
                ${activeCard === card.id ? 'hover:block mt-[20px]' : 'hidden'}`}            
              >
                <div
                  onMouseOver={() => { setMouseColor('rgba(0, 0, 0, 0.125)') }}
                  onMouseLeave={() => { setMouseColor('rgba(0, 0, 0, 0.5)') }}   
                >
                  {card.additionalDescription}
                </div>
                <div className='text-4xl mt-[20px] mr-[15px] flex justify-end'>
                  {card.linkOnGit &&  <Git gitLink={card.linkOnGit}/>}
                </div>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Portfolio