/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import { useStateContext } from '../contexts/ContextProvider'

import { ExperienceItem } from '../components'


const items = [
  {
    description:
      'The cloud-based platform for creating and managing brands.',
    responsibilities: [
      'UI automation using WebdriverIO',
      'API testing and test data preparation with Postman.',
      'Created the test documentations',
    ],
  },
  {
    description:
      'iOS and Android mobile application',
    responsibilities: [
      'Cross-platform testing',
      'UI mobile automation using WebdriverIO',
      'Traffic analyzing and throttling with Charles Proxy',
      'Setting up and configuring of emulators for iOS and Android',
    ],
  },
  {
    description:
      'Magento Online Stores',
    responsibilities: [
      'Analysis of open issues in bug tracking system',
      'Planning personal testing activities for the sprint',
      'Weriting and maintaining the detailed test cases, executing them, reviewing test cases',
    ],
  },
];



const Experience = () => {
  const { setScrollPosition, setMouseColor, setMouseWidth, setMouseHeight } = useStateContext();
  const [selectedIndex, setSelectedIndex] = useState(0);
  // const [scrollPosition, setScrollPosition] = useState(0);
  const [position, setPosition] = useState('Automation QA');

  const div1Ref = useRef(null);
  const div2Ref = useRef(null);
  const containerRef = useRef(null);

  // Handle the scrollpostion
  useEffect(() => {
    const container = containerRef.current;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const calcPosition = maxScrollLeft / items.length;
  
    function handleScroll() {
      const newPosition = container.scrollLeft;
      // setScrollPosition(newPosition);
  
      if (newPosition < calcPosition) {
        setPosition('Automation QA');
      } else if (calcPosition < newPosition && newPosition < (calcPosition * 2)) {
        setPosition('Automation QA'); 
      } else if (newPosition > (calcPosition * 2)) { 
        setPosition('Manual QA'); 
      } 
    }
  
    container.addEventListener('scroll', handleScroll);
  
    return () => {  // Cleanup function to remove event listener on unmounting of component 
      container.removeEventListener('scroll', handleScroll);   
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    const handleScroll = () => {
      setScrollPosition(container.scrollLeft);
      setMouseColor(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`)
      setMouseWidth('20px')
      setMouseHeight('20px')
    };

    const resetLeft = () => {
      setScrollPosition(prevCount => prevCount = 0);
    };

    const resetStyles = () => {
      setMouseColor('rgba(0, 0, 0, 0.5)')
      setMouseWidth('35px')
      setMouseHeight('35px')
    }

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('mouseup', resetStyles);
    window.addEventListener('mousemove', resetLeft);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mouseup', resetStyles);
      window.removeEventListener('mousemove', resetLeft);
    };
  }, []);

  /* const handlers = useSwipeable({
    onSwipedLeft: () => setSelectedIndex(selectedIndex + 1),
    onSwipedRight: () => setSelectedIndex(selectedIndex - 1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  }); */
  
  const calculateDistance = () => {
    const div1Rect = div1Ref.current.getBoundingClientRect();
    const div2Rect = div2Ref.current.getBoundingClientRect();

    const distance = Math.sqrt(
      Math.pow(div1Rect.x - div2Rect.x, 2) + Math.pow(div1Rect.y - div2Rect.y, 2)
    );

    console.log(`The distance between the two divs is ${distance}px`);
  };


  return (
    <div className="dark:text-white mt-[150px] pb-[50px]" 
      onClick={calculateDistance}
    >

      <div className='ml-[50px] pl-[50px]' ref={div1Ref}>
        <div className='text-2xl dark:text-yellow-200 text-orange-400 pb-[10px]'>{position}</div>
        <div>
          <p className='dark:text-rose-200 pb-[5px] text-2xl'>In</p>
          <p className='text-3xl text-violet-500'>QA Madness</p>
        </div>
      </div>


        <div
          className="container ml-[100px] mt-[150px] flex overflow-x-scroll rounded-lg gap-8 md:w-[750px] md:h-[400px] scroll-p-0.5"
          style={{ scrollSnapType: 'x mandatory', margin: '2rem auto' }}
          ref={containerRef}
          //{...handlers}
        >
          {items.map((item, index) => (
            <ExperienceItem
              key={index}
              item={item}
              index={index}
              selected={index === selectedIndex}
              onClick={() => setSelectedIndex(index)}
              ref={div2Ref}
            />
          ))}
        </div>

    </div>
  )
}


export default Experience