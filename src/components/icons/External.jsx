import React from 'react'
import { FiExternalLink } from 'react-icons/fi'

const External = ({ link }) => {
    return (
        <a href={link}
            target="_blank"
            rel="noreferrer"
            className='cursor-none'
            test-id='external-btn'
            data-mousecustom={JSON.stringify({ width: '15px', height: '15px', color: 'rgba(49, 39, 245, 0.7)' })}
        >
            <FiExternalLink />
        </a>
    )
}

export default External
