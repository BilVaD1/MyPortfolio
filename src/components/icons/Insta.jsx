import React from 'react'
import { AiOutlineInstagram, AiFillInstagram } from 'react-icons/ai'

import { useStateContext } from '../../contexts/ContextProvider'

const Insta = () => {

    const { currentMode, setMouseHeight, setMouseWidth, setMouseColor } = useStateContext();

    return (
        <a href="https://www.instagram.com/bilvad1/" 
            test-id='insta-btn'
            target="_blank"
            rel="noreferrer"
            className='cursor-none'
            onMouseOver={() => {setMouseHeight('15px'); setMouseWidth('15px'); setMouseColor('rgba(225, 39, 245, 0.7)')}}
            onMouseLeave={() => {setMouseHeight('35px'); setMouseWidth('35px'); setMouseColor('rgba(0, 0, 0, 0.5)')}}  
        >
            {currentMode === 'Dark' ?  <AiOutlineInstagram /> : <AiFillInstagram />}
        </a>
  )
}

export default Insta