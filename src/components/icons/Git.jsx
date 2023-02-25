import React from 'react'
import { AiOutlineGithub } from 'react-icons/ai'

import { useStateContext } from '../../contexts/ContextProvider'

const Git = ({ gitLink }) => {

    const { setMouseHeight, setMouseWidth, setMouseColor } = useStateContext();

    return (
        <a href={gitLink} 
            target="_blank"
            rel="noreferrer"
            className='cursor-none'
            onMouseOver={() => {setMouseHeight('15px'); setMouseWidth('15px'); setMouseColor('rgba(191, 75, 30, 0.7)')}}
            onMouseLeave={() => {setMouseHeight('35px'); setMouseWidth('35px'); setMouseColor('rgba(0, 0, 0, 0.5)')}}  
        >
            <AiOutlineGithub />
        </a>
    )
}

export default Git