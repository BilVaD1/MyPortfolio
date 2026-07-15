import React from 'react'
import { AiOutlineGithub } from 'react-icons/ai'

const Git = ({ gitLink }: { gitLink: string }) => {
    return (
        <a href={gitLink}
            test-id='git-btn'
            target="_blank"
            rel="noreferrer"
            className='cursor-none'
            data-mousecustom={JSON.stringify({ width: '15px', height: '15px', color: 'rgba(191, 75, 30, 0.7)' })}
        >
            <AiOutlineGithub />
        </a>
    )
}

export default Git
