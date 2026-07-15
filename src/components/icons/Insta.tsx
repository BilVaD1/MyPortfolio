import React from 'react'
import { AiOutlineInstagram, AiFillInstagram } from 'react-icons/ai'

import { useStateContext } from '../../contexts/ContextProvider'

const Insta = () => {

    const { currentMode } = useStateContext();

    return (
        <a href="https://www.instagram.com/bilvad1/"
            test-id='insta-btn'
            target="_blank"
            rel="noreferrer"
            className='cursor-none'
            data-mousecustom={JSON.stringify({ width: '15px', height: '15px', color: 'rgba(225, 39, 245, 0.7)' })}
        >
            {currentMode === 'Dark' ?  <AiOutlineInstagram /> : <AiFillInstagram />}
        </a>
  )
}

export default Insta
