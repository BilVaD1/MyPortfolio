import React, { useEffect } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

const Moon = () => {
    const { nodes, materials } = useGLTF('/scene.glb')

    useEffect(() => {
        console.log(nodes, materials)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -7, 0]} scale={7}>
            <group rotation={[Math.PI / 13.5, -Math.PI / 5.8, Math.PI / 5.6]}>
                <mesh receiveShadow castShadow geometry={(nodes.planet002 as THREE.Mesh).geometry} material={(nodes.planet002 as THREE.Mesh).material} />
                <mesh geometry={(nodes.planet003 as THREE.Mesh).geometry} material={(nodes.planet003 as THREE.Mesh).material} />
            </group>
        </group>
    )
}

export default Moon
