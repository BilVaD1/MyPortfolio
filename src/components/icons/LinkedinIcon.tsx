import React from 'react'
import { AiOutlineLinkedin, AiFillLinkedin } from 'react-icons/ai'

import { useStateContext } from '../../contexts/ContextProvider'

const LinkedinIcon = () => {

    const { currentMode } = useStateContext();

    return (
        <a href="https://www.linkedin.com/in/vadym-bilan-a5144b1a8"
            test-id='linkedin-btn'
            target="_blank"
            rel="noreferrer"
            className='cursor-none'
            data-mousecustom={JSON.stringify({ width: '15px', height: '15px', color: 'rgba(49, 39, 245, 0.7)' })}
        >
            {currentMode === 'Dark' ?  <AiOutlineLinkedin /> : <AiFillLinkedin />}
        </a>
    )
}

export default LinkedinIcon
