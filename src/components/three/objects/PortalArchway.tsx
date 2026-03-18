'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import NeonSign from './NeonSign'
import { useMaterial } from '@/lib/materials/useMaterial'

interface PortalArchwayProps {
  position: [number, number, number]
  color: string
  hexColor: number
  label: string
  onEnter: () => void
}

export default function PortalArchway({
  position,
  color,
  hexColor,
  label,
  onEnter,
}: PortalArchwayProps) {
  const portalPlaneRef = useRef<THREE.Mesh>(null)
  const darkMetalMat = useMaterial('dark_metal')

  useFrame(({ clock }) => {
    if (portalPlaneRef.current) {
      const mat = portalPlaneRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.2 + Math.sin(clock.getElapsedTime() * 1.5) * 0.1
    }
  })

  const pillarWidth = 0.3
  const archWidth = 3
  const archHeight = 5
  const halfW = archWidth / 2

  return (
    <group position={position}>
      {/* Left pillar */}
      <mesh position={[-halfW, archHeight / 2, 0]}>
        <boxGeometry args={[pillarWidth, archHeight, pillarWidth]} />
        <primitive object={darkMetalMat} attach="material" />
      </mesh>

      {/* Right pillar */}
      <mesh position={[halfW, archHeight / 2, 0]}>
        <boxGeometry args={[pillarWidth, archHeight, pillarWidth]} />
        <primitive object={darkMetalMat} attach="material" />
      </mesh>

      {/* Top beam */}
      <mesh position={[0, archHeight + pillarWidth / 2, 0]}>
        <boxGeometry args={[archWidth + pillarWidth * 2, pillarWidth, pillarWidth]} />
        <primitive object={darkMetalMat} attach="material" />
      </mesh>

      {/* Pillar accent strips */}
      <mesh position={[-halfW, archHeight / 2, pillarWidth / 2 + 0.01]}>
        <planeGeometry args={[0.05, archHeight]} />
        <meshBasicMaterial color={hexColor} />
      </mesh>
      <mesh position={[halfW, archHeight / 2, pillarWidth / 2 + 0.01]}>
        <planeGeometry args={[0.05, archHeight]} />
        <meshBasicMaterial color={hexColor} />
      </mesh>
      <mesh position={[0, archHeight + pillarWidth / 2, pillarWidth / 2 + 0.01]}>
        <planeGeometry args={[archWidth, 0.05]} />
        <meshBasicMaterial color={hexColor} />
      </mesh>

      {/* Portal energy plane (clickable as fallback + walk-through trigger) */}
      <mesh
        ref={portalPlaneRef}
        position={[0, archHeight / 2, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onEnter()
        }}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'default' }}
      >
        <planeGeometry args={[archWidth - 0.1, archHeight - 0.1]} />
        <meshBasicMaterial
          color={hexColor}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sparkles inside portal */}
      <Sparkles
        count={20}
        scale={[archWidth - 0.5, archHeight - 0.5, 0.5]}
        position={[0, archHeight / 2, 0]}
        size={1.5}
        speed={0.6}
        color={color}
      />

      {/* Portal light */}
      <pointLight
        position={[0, archHeight / 2, 1]}
        color={hexColor}
        intensity={1}
        distance={6}
      />

      {/* Label above */}
      <NeonSign
        text={label}
        position={[0, archHeight + 1, 0]}
        fontSize={0.5}
        color={color}
      />
    </group>
  )
}
