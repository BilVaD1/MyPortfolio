import React, { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei'
import Moon from './Moon'

import { useStateContext } from '../../contexts/ContextProvider'

const CanvasModel = () => {
    const { currentMode } = useStateContext();
    const [Light, setLight] = useState(1);

    useEffect(() => {
        if(currentMode === 'Light') {
            setLight(3.5)
        } else {
            setLight(1)
        }
    }, [currentMode]);

    return (
        <Canvas dpr={[1.5, 2]} linear shadows className='rounded-xl'>
            {/* <fog attach="fog" args={['#272730', 16, 30]} /> */}
            <ambientLight intensity={0.75} />
            <PerspectiveCamera makeDefault position={[0, 4, 16]} fov={95}>
                <pointLight intensity={Light} position={[-10, -25, -10]} />
                <spotLight castShadow intensity={2.25} angle={0.2} penumbra={1} position={[-25, 20, -15]} shadow-mapSize={[1024, 1024]} shadow-bias={-0.0001} />
            </PerspectiveCamera>
            <Suspense fallback={null}>
                <Moon />
            </Suspense>
            <OrbitControls autoRotate autoRotateSpeed={0.3} enablePan={false} enableZoom={true} maxPolarAngle={Math.PI / 2.5} minPolarAngle={Math.PI / 2.5} />
            <Stars radius={800} depth={50} count={1000} factor={20} />
    </Canvas>
    )
}

export default CanvasModel