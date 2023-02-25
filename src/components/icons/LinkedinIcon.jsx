import React from 'react'
import { AiOutlineLinkedin, AiFillLinkedin } from 'react-icons/ai'

import { useStateContext } from '../../contexts/ContextProvider'

const LinkedinIcon = () => {

    const { currentMode, setMouseHeight, setMouseWidth, setMouseColor } = useStateContext();

    return (
        <a href="https://www.linkedin.com/in/vadym-bilan-a5144b1a8" 
            target="_blank"
            rel="noreferrer"
            className='cursor-none'
            onMouseOver={() => {setMouseHeight('15px'); setMouseWidth('15px'); setMouseColor('rgba(49, 39, 245, 0.7)')}}
            onMouseLeave={() => {setMouseHeight('35px'); setMouseWidth('35px'); setMouseColor('rgba(0, 0, 0, 0.5)')}}
        >
            {currentMode === 'Dark' ?  <AiOutlineLinkedin /> : <AiFillLinkedin />}
        </a>
    )
}

export default LinkedinIcon