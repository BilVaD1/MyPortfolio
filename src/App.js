import React, { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import  { RxHamburgerMenu } from 'react-icons/rx'
import { CSSTransition } from 'react-transition-group'
import SmartMouse from 'react-smart-mouse'

import { Sidebar } from './components'
import { Home, Portfolio, Contact, Experience, SmartMouseDemo } from './pages'
import './App.css'

import { useStateContext } from './contexts/ContextProvider'

// Keep untouched elements identical to the old hardcoded cursor (35px, black)
const neutralStyle = { color: 'rgba(0, 0, 0, 0.5)', width: '35px', height: '35px' }

const App = () => {
  const { activeMenu, currentMode, setActiveMenu, setScreenSize, screenSize, mouseConfig } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize)
    handleResize();

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={currentMode === 'Dark' ? 'dark' : 'light'}>
      <BrowserRouter>
        {screenSize >= 900 && (
          <SmartMouse
            pStyle={neutralStyle}
            spanStyle={neutralStyle}
            liStyle={neutralStyle}
            labelStyle={neutralStyle}
            imgStyle={neutralStyle}
            inputStyle={{ top: '-10px' }}
            textareaStyle={{ top: '-10px' }}
            lerp={mouseConfig.lerp}
            clickScale={mouseConfig.clickScale}
            blendMode={mouseConfig.blendMode}
            glass={mouseConfig.glass}
          />
        )}
        <div className='flex relative dark:bg-main-dark-bg'>

          {screenSize >= 900 ? <SideTransition /> : <NoTransition />}

          <div className={`dark:bg-main-dark-bg duration-700 bg-main-bg min-h-screen w-full ${activeMenu
            ? 'md:ml-72'
            : 'flex-2'}`}>

            <div className='fixed p-2 top-4 z-[1000]'
              test-id='burger-menu'
              data-mousecustom={JSON.stringify({ width: '25px', height: '25px', color: 'rgba(191, 75, 30, 0.7)' })}
            >
              <button type='button' className='bg-gray-800 md:bg-inherit rounded-xl md:rounded-none text-5xl p-3 md:hover:drop-shadow-xl md:hover:bg-light-gray md:dark:hover:bg-slate-500 text-red-600 cursor-none'
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
                <Route path='/SmartMouse' element={<SmartMouseDemo />}/>
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
