'use client'

import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import NeonSign from './NeonSign'

interface InstagramEmbedProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
  username?: string
}

export default function InstagramEmbed({
  position,
  rotation = [0, 0, 0],
  width = 3,
  height = 4,
  username = 'chrismarchese',
}: InstagramEmbedProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const [isClose, setIsClose] = useState(false)

  useFrame(() => {
    if (!groupRef.current) return
    const worldPos = new THREE.Vector3()
    groupRef.current.getWorldPosition(worldPos)
    const dist = camera.position.distanceTo(worldPos)
    setIsClose(dist < 15)
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Phone-shaped frame */}
      <mesh>
        <boxGeometry args={[width + 0.15, height + 0.15, 0.06]} />
        <meshStandardMaterial color={0x1a1a1a} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Screen surface */}
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color={0x0a0a0a}
          emissive={isClose ? 0x101015 : 0x050505}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Instagram embed */}
      {isClose && (
        <Html
          transform
          position={[0, 0, 0.05]}
          distanceFactor={1.2}
          style={{
            width: `${width * 100}px`,
            height: `${height * 100}px`,
            pointerEvents: 'auto',
            overflow: 'hidden',
            borderRadius: '4px',
          }}
        >
          <iframe
            src={`https://www.instagram.com/${username}/embed`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: '#000',
            }}
            title={`@${username} Instagram`}
          />
        </Html>
      )}

      {/* Handle label */}
      <NeonSign
        text={`@${username.toUpperCase()}`}
        position={[0, -height / 2 - 0.6, 0]}
        fontSize={0.25}
        color="#5a9e6f"
      />
    </group>
  )
}
