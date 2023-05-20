import { useEffect, useState, useRef } from 'react'
import useSpline from '@splinetool/r3f-spline'
import { OrthographicCamera } from '@react-three/drei'

import { useFrame, useThree } from '@react-three/fiber'

import { useStateContext } from '../../contexts/ContextProvider'

export default function Creature({ ...props }) {
    const { mouseWidth, mouseHeight, mouseTop, mouseLeft, mouseColor, scrollPosition, position, setPosition } = useStateContext();

    const [up, setUp] = useState(true);
    const [axisZ, setAxisZ] = useState(true);
    const [axisX, setAxisX] = useState(true);
    const [handUp, setHandUp] = useState(false);

    const ref = useRef()
    const body = useRef()
    const camera = useRef()
    const handRight = useRef()
    const handLeft = useRef()

    const { nodes, materials } = useSpline('https://prod.spline.design/DnPjYlAzpnJ8h6Aj/scene.splinecode')

    useFrame(({ mouse, viewport }) => {
        const x = (position.x * viewport.width) / 25.5
        const y = (position.y * viewport.height) / 25.5
        ref.current.lookAt(x-1500, -(y-1500), 4000)
    })

    useFrame((_state, delta) => {
        const speed = 5; // Movement speed
        const maxY = 20; // Maximum Y position
        const minY = -10
        const z = { maxZ: 1.8, minZ: 1.5}
        const x= { maxX: 5, minX: -5}
        //console.log(camera.current.zoom)
        //console.log(delta)
        
        // Change object on Y axis
        if ( up === true ) {
            body.current.position.y += delta * speed;

            if (body.current.position.y >= (maxY-1)) {
                setUp(false)
            }

        } 
        
        if ( up === false ) {
            body.current.position.y -= delta * speed;
            if (body.current.position.y <= minY) {
                setUp(true)
            }
        }

        // Change object on X axis
        if ( axisX === true ) {
            body.current.position.x += delta * speed/3.6;

            if (body.current.position.x >= (x.maxX-1)) {
                setAxisX(false)
            }

        } 
    
        if ( axisX === false ) {
            body.current.position.x -= delta * speed/1.6;
            if (body.current.position.x <= x.minX) {
                setAxisX(true)
            }
        }

        // Change object on Z axis
        /* if ( axisZ === true ) {
            camera.current.zoom += delta * speed/1500;

            if (camera.current.zoom >= z.maxZ) {
                setAxisZ(false)
            }

        } 
    
        if ( axisZ === false ) {
            camera.current.zoom -= delta * speed/1500;
            if (camera.current.zoom <= z.minZ) {
                setAxisZ(true)
            }
        } */
    });

    useFrame((_state, delta) => {
        const maxZ = 2.37
        const minZ = 0.37
        // Hands up
        if (handUp && handRight.current.rotation.z < maxZ ) {
            handRight.current.rotation.z += delta * 5
            handRight.current.position.y += delta * 85
            handLeft.current.rotation.z -= delta * 5
            handLeft.current.position.y += delta * 85
        }
        
        // Hands down
        if (!handUp && handRight.current.rotation.z >= minZ) {
            handRight.current.rotation.z -= delta * 5
            handRight.current.position.y -= delta * 85
            handLeft.current.rotation.z += delta * 5
            handLeft.current.position.y -= delta * 85
        } else if (!handUp && handRight.current.rotation.z < minZ) {
            // For fixing bug
            handRight.current.rotation.z = 0.37
            handRight.current.position.y = 0
            handLeft.current.rotation.z = -0.39
            handLeft.current.position.y = 0
        }
    })


    return (
        <>
        {/* <color attach="background" args={['#aba8c7']} /> */}
        <group {...props} dispose={null}>
            <group 
                name="Creature" 
                ref={body} 
                onPointerEnter={() => setHandUp(true)}
                onPointerLeave={() => setHandUp(false)}
            >

                <group ref={ref} name="Eyes" position={[0, 56.71, 1.25]}>
                    <group name="RIght Eye" position={[23, 0, 0]} scale={1.2}>
                        <mesh
                        name="Right Eye Elipse"
                        geometry={nodes['Right Eye Elipse'].geometry}
                        material={materials['Right Eye Elipse Material']}
                        castShadow
                        receiveShadow
                        position={[0, -1, 10.75]}
                        rotation={[0, 0, 0]}
                        scale={[1.5, 1.5, 0.14]}
                        />
                        <mesh
                        name="Right Eye Sphere"
                        geometry={nodes['Right Eye Sphere'].geometry}
                        material={materials['Right Eye Sphere Material']}
                        castShadow
                        receiveShadow
                        position={[0, 0, -1.25]}
                        rotation={[-Math.PI / 2, 0, 0]}
                        scale={0.75}
                        />
                    </group>
                    <group name="Left Eye" position={[-23, 0, 0]} scale={1.2}>
                        <mesh
                        name="Left Eye Sphere"
                        geometry={nodes['Left Eye Sphere'].geometry}
                        material={materials['Left Eye Sphere Material']}
                        castShadow
                        receiveShadow
                        position={[0, 0, -1.25]}
                        rotation={[-Math.PI / 2, 0, 0]}
                        scale={0.75}
                        />
                        <mesh
                        name="LeftEye Elipse"
                        geometry={nodes['LeftEye Elipse'].geometry}
                        material={materials['LeftEye Elipse Material']}
                        castShadow
                        receiveShadow
                        position={[0, -1, 10.75]}
                        rotation={[0, 0, 0]}
                        scale={[1.5, 1.5, 0.14]}
                        />
                    </group>
                </group>
                <group name="Body" position={[0, -11.83, 0]}>
                    <mesh
                        ref={handRight}
                        name="Right Hand"
                        geometry={nodes['Right Hand'].geometry}
                        material={materials['Right Hand Material']}
                        castShadow
                        receiveShadow
                        position={[50, 0, 5]} // 0
                        rotation={[0.3, 0.07, 0.37]} // 0
                        scale={1}
                    />
                    <mesh
                        ref={handLeft}
                        name="Left Hand"
                        geometry={nodes['Left Hand'].geometry}
                        material={materials['Left Hand Material']}
                        castShadow
                        receiveShadow
                        position={[-50, 0, 5]}
                        rotation={[-0.06, -0.06, -0.39]}
                        scale={1}
                    />
                    <mesh
                        name="Housing"
                        geometry={nodes.Housing.geometry}
                        material={materials['Housing Material']}
                        castShadow
                        receiveShadow
                        position={[0.73, 0, 0]}
                    />
                </group>
            </group>
            <directionalLight
            name="Light Main"
            castShadow
            intensity={1}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={-10000}
            shadow-camera-far={100000}
            shadow-camera-left={-500}
            shadow-camera-right={500}
            shadow-camera-top={500}
            shadow-camera-bottom={-500}
            position={[-129.8, 121.03, 157.37]}
            />
            <pointLight
            name="Point Light"
            castShadow
            intensity={1.67}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={100}
            shadow-camera-far={100000}
            color="#c6bff7"
            position={[123.88, 83.5, -29.54]}
            />
            <OrthographicCamera
            ref={camera}
            name="1"
            makeDefault={true}
            zoom={1.4}
            far={100000}
            near={-100000}
            position={[0, 0, 500]}
            rotation={[0, 0, 0]}
            />
            <hemisphereLight name="Default Ambient Light" intensity={0.75} color="#eaeaea" />
        </group>
        </>
    )
}
