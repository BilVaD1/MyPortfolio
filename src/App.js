/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import  { RxHamburgerMenu } from 'react-icons/rx'
import { CSSTransition } from 'react-transition-group'

import { Sidebar, FollowMouse } from './components'
import { Home, Portfolio, Contact, Experience } from './pages'
import './App.css'

import { useStateContext } from './contexts/ContextProvider'

const App = () => {
  const { activeMenu, setMouseWidth, setMouseHeight, currentMode, setActiveMenu, setMouseTop, setMouseLeft, setMouseColor, setScreenSize, screenSize } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize)
    handleResize();

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={currentMode === 'Dark' ? 'dark' : 'light'}>
      <BrowserRouter>
        {screenSize >= 900 && <FollowMouse />}
        <div className='flex relative dark:bg-main-dark-bg'>
        
          {screenSize >= 900 ? <SideTransition /> : <NoTransition />}

          <div className={`dark:bg-main-dark-bg duration-700 bg-main-bg min-h-screen w-full ${activeMenu 
            ? 'md:ml-72' 
            : 'flex-2'}`}>
    
            <div className='fixed p-2 top-4 z-[1000]'
              test-id='burger-menu'
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
                <Route path='/' element={<Home />}/>
                <Route path='/AboutMe' element={<Home />}/>
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



const SideTransition = () => {
  const { activeMenu } = useStateContext();
  const nodeRef = useRef(null);

  return (
    <CSSTransition nodeRef={nodeRef} 
      in={activeMenu} 
      timeout={1000} 
      classNames={{
        enter: 'w-0',
        enterActive: 'md:w-72 w-full transition-all ease-out duration-700',
        exit: 'w-72',
        exitActive: 'md:w-0 w-0 transition-all ease-in duration-200',
      }}
      unmountOnExit
    >
        <div ref={nodeRef} className='h-screen fixed overflow-auto sidebar dark:bg-secondary-dark-bg bg-white duration-700'
          style={{ zIndex: '2000'}}
        >
          <Sidebar/>
        </div>
    </CSSTransition>
)
}

const NoTransition = () => {
  const { activeMenu } = useStateContext();

  return (
    <div>
      {activeMenu && 
        <div className='md:w-72 w-full h-screen fixed overflow-auto sidebar dark:bg-secondary-dark-bg bg-white duration-700'
          style={{ zIndex: '2000'}}
        >
          <Sidebar/>
        </div>}
    </div>
  )
}