import React, { useEffect } from 'react'
import { easing } from 'maath'
import { useFrame } from '@react-three/fiber'
import { Stats, OrbitControls, Environment, useGLTF, Decal } from '@react-three/drei'

const Moon = () => {
    const { nodes, materials } = useGLTF('/scene.glb')

    useEffect(() => {
        console.log(nodes, materials)
    }, []);


    return (
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -7, 0]} scale={7}>
            <group rotation={[Math.PI / 13.5, -Math.PI / 5.8, Math.PI / 5.6]}>
                <mesh receiveShadow castShadow geometry={nodes.planet002.geometry} material={nodes.planet002.material} />
                <mesh geometry={nodes.planet003.geometry} material={nodes.planet003.material} />
            </group>
        </group>
    )
}

export default Moon