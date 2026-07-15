import React from 'react'
import { AboutScene, DownloadButton } from '../components';

function Home() {
  return (
    <div className="dark:text-white">

      <div className='absolute md:right-16 md:top-12 top-[100px] right-4 z-[20]'
        test-id='DownloadButton'
        data-mousecustom={JSON.stringify({ width: '15px', height: '15px', color: 'rgba(191, 75, 30, 1)' })}
      >
        <DownloadButton />
      </div>

      <AboutScene />
    </div>
  );
}

export default Home;
