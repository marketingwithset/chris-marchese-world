'use client'

import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MODEL_PATH = '/models/cartoon-dog.glb'
const SCALE = 0.8

interface PlayerCharacterProps {
  position: [number, number, number]
  rotation: number
  isMoving: boolean
  isSprinting: boolean
}

export default function PlayerCharacter({
  position,
  rotation,
  isMoving,
  isSprinting,
}: PlayerCharacterProps) {
  const { scene } = useGLTF(MODEL_PATH)
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()

    if (isMoving) {
      const speed = isSprinting ? 14 : 10
      const amp = isSprinting ? 0.06 : 0.04
      // Walk bob
      groupRef.current.position.y = position[1] + Math.abs(Math.sin(t * speed)) * amp
      // Slight forward tilt when moving
      groupRef.current.rotation.x = 0.08
    } else {
      // Idle breathing
      groupRef.current.position.y = position[1] + Math.sin(t * 2) * 0.015
      groupRef.current.rotation.x = 0
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, rotation + Math.PI, 0]}
    >
      <primitive object={scene} scale={SCALE} />
    </group>
  )
}

useGLTF.preload(MODEL_PATH)
