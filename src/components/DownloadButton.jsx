import React from 'react'
import { AiOutlineDownload } from 'react-icons/ai'

import cv from '../data/CV_FullStack_Vadym_2025.pdf';

const DownloadButton = () => {

    function downloadCV() {
        const link = document.createElement('a');
        link.href = cv;
        link.download = 'CV_FullStack_Vadym_2025.pdf';
        link.click();
      }

    return (
        <button
            className='
                md:text-4xl 
                text-3xl 
                cursor-none 
                flex 
                flex-row 
                items-end 
                justify-center 
                pb-[10px] 
                relative 
                text-center 
                md:h-14 
                md:w-[300px] 
                h-12
                w-[250px]
                transition-all 
                duration-500
                before:absolute 
                before:top-0 
                before:left-0 
                before:w-full 
                before:h-full 
                dark:before:bg-zinc-400 
                before:bg-red-300 
                before:transition-all
                before:duration-300 
                before:opacity-10 
                before:hover:opacity-0 
                before:hover:scale-50
                after:absolute 
                after:top-0 
                after:left-0 
                after:w-full 
                after:h-full 
                after:opacity-0 
                after:transition-all 
                after:duration-300
                after:border 
                dark:after:border-white/50 
                after:border-red-400/50 
                after:scale-125 
                after:hover:opacity-100 
                after:hover:scale-100
            '
            onClick={downloadCV}
        >
            <p className='md:text-2xl text-xl mr-4'>Download my CV</p>
            <AiOutlineDownload />
        </button>
    )
}

export default DownloadButton