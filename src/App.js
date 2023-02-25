/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { CSSTransition } from 'react-transition-group';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import  { RxHamburgerMenu } from 'react-icons/rx'

import { Sidebar, FollowMouse } from './components'
import { Home, Portfolio, Contact, Experience } from './pages'
import './App.css'

import { useStateContext } from './contexts/ContextProvider'

const App = () => {
  const { activeMenu, setMouseWidth, setMouseHeight, currentMode, setActiveMenu, setMouseTop, setMouseLeft, setMouseColor, setScreenSize } = useStateContext();
  // const activeMenu = true

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize)
    handleResize();

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={currentMode === 'Dark' ? 'dark' : 'light'}>
      <BrowserRouter>
        <FollowMouse />
        <div className='flex relative dark:bg-main-dark-bg'>

          {activeMenu ? (
              <div className='md:w-72 h-screen fixed overflow-auto sidebar w-full dark:bg-secondary-dark-bg bg-white duration-700'
                style={{ zIndex: '2000'}}
              >
                <Sidebar/>
              </div>
          ) : ''}
          <div className={`dark:bg-main-dark-bg duration-700 bg-main-bg min-h-screen w-full ${activeMenu 
            ? 'md:ml-72' 
            : 'flex-2'}`}>
    
            <div className='fixed p-2 top-4 z-[1000]'
              onMouseOver={() => {setMouseHeight('25px'); setMouseWidth('25px'); setMouseColor('rgba(191, 75, 30, 0.7)')}}
              onMouseLeave={() => {setMouseHeight('35px'); setMouseWidth('35px'); setMouseTop(-5); setMouseLeft(-10); setMouseColor('rgba(0, 0, 0, 0.5)')}}
            >
              <button type='button' className='bg-gray-800 md:bg-inherit rounded-xl md:rounded-none text-5xl p-3 md:hover:drop-shadow-xl md:hover:bg-light-gray md:dark:hover:bg-slate-500 text-red-600 cursor-none'
                // cursor-none
                // onMouseOver={() => {setMouseHeight('25px'); setMouseWidth('25px'); setMouseTop(-10); setMouseLeft(3); setMouseColor('rgba(191, 75, 30, 0.7)')}}
                // onMouseLeave={() => {setMouseHeight('50px'); setMouseWidth('50px'); setMouseTop(0); setMouseLeft(0); setMouseColor('rgba(0, 0, 0, 0.5)')}}
                onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}>
                <RxHamburgerMenu/>
              </button>
            </div>


            <div>

              <Routes>
                {/* Dashboard */}
                <Route path='/' element={<Home />}/>
                <Route path='/AboutMe' element={<Home />}/>

                {/* Pages */}
                <Route path='/Experience' element={<Experience />}/>
                <Route path='/Portfolio' element={<Portfolio />}/>
                <Route path='/Contact' element={<Contact />}/>
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
