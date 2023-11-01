import React, { forwardRef } from 'react'
import { useStateContext } from '../contexts/ContextProvider'


const ExperienceItem = forwardRef(({ item, selected, onClick, myRef }, ref) => {
    const { setMouseColor, setScrollTop, setClientHeight, setScrollHeight } = useStateContext();

    const handleHover = () => {
      setScrollTop(myRef.scrollTop)
      setClientHeight(myRef.clientHeight)
      setScrollHeight(myRef.scrollHeight)
    } 
  
  
    return (
      <div
        test-id='exp-item'
        className={`item snap-start rounded-lg p-[24px] overflow-y-auto`}
        style={{ flex: '0 0 100%', scrollSnapAlign: 'start' }} // add scrollSnapAlign to ensure snapping works correctly
        onMouseMove={onClick}
        onWheel={handleHover}
        ref={ref}
      >
        <div 
          onMouseOver={() => { setMouseColor('rgba(0, 0, 0, 0.15)') }}
          onMouseLeave={() => { setMouseColor('rgba(0, 0, 0, 0.5)') }}
        >
          <p className='italic mb-[10px] text-xl'>Project Description:</p>
          <p className='mb-[25px] text-2xl pl-[10px]'>
            {item.description}
          </p>
        </div>

        <div 
          onMouseOver={() => { setMouseColor('rgba(0, 0, 0, 0.15)') }}
          onMouseLeave={() => { setMouseColor('rgba(0, 0, 0, 0.5)') }}
        >
          <p className='italic mb-[10px] text-xl'>Role:</p>
          <p className='mb-[25px] text-2xl pl-[10px]'>
            {item.role}
          </p>
        </div>        
  
        <div
          onMouseOver={() => { setMouseColor('rgba(0, 0, 0, 0.15)') }}
          onMouseLeave={() => { setMouseColor('rgba(0, 0, 0, 0.5)') }}
        >
          <p className='italic mb-[15px] text-xl'>Responsibilities:</p>
            {item.responsibilities.map((responsibility, index) => (
              <li
                key={index}
                className='mb-[10px] text-2xl pl-[10px]'
              >
                {responsibility}
              </li>
            ))}
        </div>
      </div>
    );
  });

  
export default ExperienceItem