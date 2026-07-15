import React from 'react'
import { NavLink } from 'react-router-dom'

import { RxMoon } from 'react-icons/rx'
import { CgSun } from 'react-icons/cg'

import day from '../data/day.png'
import night from '../data/night.png'

import Canvas from './canvas/index'

import { useStateContext } from '../contexts/ContextProvider'

const navLinks = ['About Me', 'Experience', 'Portfolio', 'Contact']

const navMouseStyle = JSON.stringify({ width: '15px', height: '15px', color: 'rgba(191, 75, 30, 0.7)' })

const Sidebar = () => {
  const { setCurrentMode, currentMode, screenSize, activeMenu, setActiveMenu } = useStateContext();

  const handleCloseSideBar = () => {
    if(activeMenu && screenSize <= 900) {
      setActiveMenu(false)
    }
  }

  return (
    <div className='md:w-72 w-full' test-id='sidebar'>

      <div
        className='h-[300px]'
        data-mousecustom={JSON.stringify({ width: '20px', height: '20px', color: 'rgba(99, 123, 125, 0.6)', top: '-10px' })}
      >
        <Canvas />
      </div>

      <div className='flex flex-col mt-[20px] md:mt-[50px] md:ml-8 text-center md:text-start'>

        {/* <div>
          <img test-id="image-item" className='rounded-full w-28 h-28 m-auto md:absolute top-0 md:right-[105px] md:top-[50px]' src={currentMode === 'Light' ? day : night} alt="" />
        </div> */}

        {navLinks.map((link) => (
          <div className='mt-[50px] dark:text-white' key={link}>
            <NavLink
              to={`/${link.replace(' ', '')}`}
              onClick={handleCloseSideBar}
              className={( { isActive } ) => isActive ? 'text-4xl duration-500 active' : 'text-2xl duration-300'}
            >
              <p className="relative group cursor-none" data-mousecustom={navMouseStyle}>
                <span className='capitalize'>{link}</span>
                <span className="duration-500 absolute -bottom-1 left-0 w-0 h-[2px] bg-orange-600 transition-all group-hover:w-9/12"></span>
              </p>
            </NavLink>
          </div>
        ))}
      </div>

      <div className='flex relative justify-between m-10 md:m-auto md:p-8 md:gap-16 bottom-[-25px] md:bottom-[-70px]'>
        <div className=' p-2 bottom-20' style={{ zIndex: '1000'}}>
          <button type='button'
            data-mousecustom={JSON.stringify({ width: '15px', height: '15px', color: 'rgba(248, 246, 15, 1)' })}
            id="light"
            className={`text-5xl p-3 hover:drop-shadow-xl ${currentMode === 'Light' ? 'active' : ''} dark:hover:bg-slate-500 text-red-600 dark:bg-secondary-dark-bg bg-orange-200 duration-500 cursor-none`}
            value="Light"
            onClick={() => setCurrentMode('Light')}>
            <CgSun/>
          </button>
        </div>

        <div className=' p-2 bottom-20 left-40 ' style={{ zIndex: '1000'}}>
          <button type='button'
          data-mousecustom={JSON.stringify({ width: '15px', height: '15px', color: 'rgba(122, 39, 245, 1)' })}
          id="dark"
          className={`text-5xl p-3 hover:drop-shadow-xl ${currentMode === 'Dark' ? 'active' : ''} hover:bg-light-gray text-red-600 dark:bg-orange-200 duration-500 cursor-none`}
          value="Dark"
          onClick={() => setCurrentMode('Dark')}>
            <RxMoon/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
