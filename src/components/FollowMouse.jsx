import React, { useEffect, useState } from 'react'

import { useStateContext } from '../contexts/ContextProvider'

function FollowMouse() {
  const { mouseWidth, mouseHeight, mouseTop, mouseLeft, mouseColor, scrollPosition, position, setPosition } = useStateContext();

  //const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(event) {
      setPosition({ x: event.clientX, y: event.clientY });
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <div style={{ zIndex: '3000', position: 'fixed', top: mouseTop, left: mouseLeft, pointerEvents: 'none' }} test-id='mouse'>
      <div style={{ position: 'absolute', 
        top: 0, 
        left: 0, 
        transform: `translate(${position.x + scrollPosition/3}px, ${position.y}px)`, 
        width: mouseWidth, 
        height: mouseHeight, 
        borderRadius: '50%', 
        backgroundColor: mouseColor, 
        transition: 'background-color 0.7s, width 0.7s, height 0.7s' 
        }} 
      />
    </div>
  );
}

export default FollowMouse;