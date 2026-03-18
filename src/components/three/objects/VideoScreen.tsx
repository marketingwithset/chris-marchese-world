'use client'

import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

interface VideoScreenProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
  vimeoId: string
  label?: string
}

export default function VideoScreen({
  position,
  rotation = [0, 0, 0],
  width = 4,
  height = 2.25,
  vimeoId,
  label,
}: VideoScreenProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const [isClose, setIsClose] = useState(false)

  // Only render iframe when player is close (performance)
  useFrame(() => {
    if (!groupRef.current) return
    const worldPos = new THREE.Vector3()
    groupRef.current.getWorldPosition(worldPos)
    const dist = camera.position.distanceTo(worldPos)
    setIsClose(dist < 18)
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Screen backing (dark frame) */}
      <mesh>
        <boxGeometry args={[width + 0.2, height + 0.2, 0.08]} />
        <meshStandardMaterial color={0x0a0a0a} metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Screen surface */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color={0x050510}
          emissive={isClose ? 0x101020 : 0x050510}
          emissiveIntensity={isClose ? 0.3 : 0.1}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>

      {/* Vimeo iframe overlay */}
      {isClose && (
        <Html
          transform
          position={[0, 0, 0.06]}
          distanceFactor={1.5}
          style={{
            width: `${width * 100}px`,
            height: `${height * 100}px`,
            pointerEvents: 'auto',
          }}
        >
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1&muted=1&background=1`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '2px',
            }}
            allow="autoplay; fullscreen"
            title={label || 'Video'}
          />
        </Html>
      )}

      {/* Screen glow */}
      <pointLight
        position={[0, 0, 0.5]}
        color={0x4a7fa5}
        intensity={isClose ? 0.5 : 0.1}
        distance={4}
      />

      {/* Label under screen */}
      {label && (
        <mesh position={[0, -height / 2 - 0.25, 0.05]}>
          <planeGeometry args={[width * 0.6, 0.2]} />
          <meshBasicMaterial color={0x1a1a1a} />
        </mesh>
      )}
    </group>
  )
}
