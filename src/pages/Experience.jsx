/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import { useStateContext } from '../contexts/ContextProvider'

import { ExperienceItem } from '../components'


const items = [
  {
    description: 
    'Working as SDET for a tour agency company that provides complex ecosystems for various tour objects, such as: renting cars, transportation, booking hotels, tours, and others.',
    role: 'SDET (Software Development Engineer in Test)',
    responsibilities: [
      'Creating the testing framework on Cypress from scratch',
      'Maintaining the tests on Python(pytest)',
      'Designing and writing back-end API tests(Python)',
      'Preparing the project on NextJS for testing(creating API endpoints, adding data-testids)',
      'Implementing the testing for Maizzle',
      'Integrating tests to CI/CD(Github Actions + Vercel + Temporal)',
      'Interacting with developers regarding the project matters',
      'Creating changelogs for major product updates'
    ],
  },
  {
    description:
      'Headless eCommerce on Shopify.',
    role: 'Automation Quality Assurance Engineer',
    responsibilities: [
      'Creating a testing framework from scratch on Cypress',
      'Preparing the React components for testing',
      'Implementing the visual regression testing',
      'Integrating tests to CI/CD(Github Actions + Vercel)',
      'Created the test documentations'
    ],
  },
  {
    description:
      'The cloud-based platform for creating and managing brands.',
    role: 'Automation Quality Assurance Engineer',
    responsibilities: [
      'UI automation using WebdriverIO',
      'API testing and test data preparation with Postman.',
      'Created the test documentations',
    ],
  },
  {
    description:
      'iOS and Android mobile application',
    role: 'Manual and Automation Quality Assurance Engineer',
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
    role: 'Manual Quality Assurance Engineer',
    responsibilities: [
      'Analysis of open issues in bug tracking system',
      'Planning personal testing activities for the sprint',
      'Weriting and maintaining the detailed test cases, executing them, reviewing test cases',
    ],
  },
];



const Experience = () => {
  const { setMouseColor, setMouseWidth, setMouseHeight, scrollTop, clientHeight, scrollHeight, setScrollTop, setClientHeight, setScrollHeight } = useStateContext();
  //const [selectedIndex, setSelectedIndex] = useState(0);
  // const [scrollPosition, setScrollPosition] = useState(0);
  const [position, setPosition] = useState('SDET');
  const [company, setCompany] = useState('NeatByte');

  const div1Ref = useRef(null);
  //const div2Ref = useRef(null);
  const listRef = useRef([]);
  const containerRef = useRef(null);

  // Handle the scrollpostion
  useEffect(() => {
    const container = containerRef.current;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const calcPosition = maxScrollLeft / items.length;
  
    function handleScroll() {
      const newPosition = container.scrollLeft;
      // setScrollPosition(newPosition);
      //console.log('newPosition: ', newPosition)
      //console.log('calcPosition: ', calcPosition)
  
      if (newPosition < calcPosition && newPosition !== 0) {
        setPosition('Automation QA');
        setCompany('QA Madness')
      } else if (calcPosition < newPosition && newPosition < (calcPosition * 3)) {
        setPosition('Automation QA'); 
        setCompany('QA Madness')
      } else if (newPosition > (calcPosition * 3)) { 
        setPosition('Manual QA'); 
        setCompany('QA Madness')
      } else if (newPosition < calcPosition && newPosition === 0) {
        setPosition('SDET'); 
        setCompany('NeatByte')
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
      //setScrollPosition(container.scrollLeft);
      setMouseColor(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`)
      setMouseWidth('20px')
      setMouseHeight('20px')
    };

    /* const resetLeft = () => {
      setScrollPosition(prevCount => prevCount = 0);
    }; */

    const resetStyles = () => {
      setMouseColor('rgba(0, 0, 0, 0.5)')
      setMouseWidth('35px')
      setMouseHeight('35px')
    }

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('mouseup', resetStyles);
    //window.addEventListener('mousemove', resetLeft);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mouseup', resetStyles);
      //window.removeEventListener('mousemove', resetLeft);
    };
  }, []);


  const handleWheel = (e) => {
    const container = containerRef.current;

    // Check if the vertical scroll is at the top or bottom
    const isVerticalScrollAtTop = scrollTop === 0;
    const isVerticalScrollAtBottom = scrollTop + clientHeight ===  scrollHeight;
    //console.log('El scroll top: ', scrollTop)
    //console.log('El height: ', clientHeight)
    //console.log('El scroll height: ', scrollHeight)

    // Adjust the scrolling speed if needed
    const scrollSpeed = 11;

    if (e.deltaY !== 0) {
      // If the vertical scroll is at the top or bottom, allow horizontal scrolling
      if (isVerticalScrollAtBottom && e.deltaY > 0) {
        setScrollTop(null)
        setClientHeight(null)
        setScrollHeight(null)
        //console.log(e.deltaY)
        container.scrollLeft += e.deltaY * scrollSpeed;
        e.deltaY = 0
      } else if (isVerticalScrollAtTop && e.deltaY < 0) {
        setScrollTop(null)
        setClientHeight(null)
        setScrollHeight(null)
        container.scrollLeft += e.deltaY * scrollSpeed;
        e.deltaY = 0
      }
    }
  };



  
  /* const calculateDistance = () => {
    const div1Rect = div1Ref.current.getBoundingClientRect();
    const div2Rect = div2Ref.current.getBoundingClientRect();

    const distance = Math.sqrt(
      Math.pow(div1Rect.x - div2Rect.x, 2) + Math.pow(div1Rect.y - div2Rect.y, 2)
    );

    console.log(`The distance between the two divs is ${distance}px`);
  }; */


  return (
    <div className="dark:text-white mt-[150px] pb-[50px]" 
      //onClick={calculateDistance}
      onWheel={handleWheel}
    >

      <div className='ml-[50px] pl-[50px]' ref={div1Ref}>
        <div test-id="position" className='text-2xl dark:text-yellow-200 text-orange-400 pb-[10px]'>{position}</div>
        <div>
          <p className='dark:text-rose-200 pb-[5px] text-2xl'>In</p>
          <p test-id="company" className='text-3xl text-violet-500'>{company}</p>
        </div>
      </div>


        <div
          className="container ml-[100px] mt-[150px] flex overflow-x-scroll rounded-lg gap-8 md:w-[950px] md:h-[500px] scroll-p-0.5"
          style={{ scrollSnapType: 'x mandatory', margin: '2rem auto' }}
          ref={containerRef}
          //{...handlers}
        >
          {items.map((item, index) => (
            <ExperienceItem
              test-id="exp-item"
              key={index}
              item={item}
              myRef={listRef.current[index]}
              //ref={div2Ref}
              ref={(ref) => (listRef.current[index] = ref)}
            />
          ))}
        </div>

    </div>
  )
}


export default Experience