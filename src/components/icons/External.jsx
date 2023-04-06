import React from 'react'
import { FiExternalLink } from 'react-icons/fi'

import { useStateContext } from '../../contexts/ContextProvider'

const External = ({ link }) => {

    const {  setMouseHeight, setMouseWidth, setMouseColor } = useStateContext();

    return (
        <a href={link} 
            target="_blank"
            rel="noreferrer"
            className='cursor-none'
            test-id='external-btn'
            onMouseOver={() => {setMouseHeight('15px'); setMouseWidth('15px'); setMouseColor('rgba(49, 39, 245, 0.7)')}}
            onMouseLeave={() => {setMouseHeight('35px'); setMouseWidth('35px'); setMouseColor('rgba(0, 0, 0, 0.5)')}}
        >
            <FiExternalLink />
        </a>
    )
}

export default External