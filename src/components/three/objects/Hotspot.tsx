'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface HotspotProps {
  position: [number, number, number]
  color?: number
  size?: number
  onClick?: () => void
  label?: string
}

export default function Hotspot({
  position,
  color = 0xc9a84c,
  size = 0.4,
  onClick,
}: HotspotProps) {
  const ringRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = 1 + Math.sin(t * 3) * 0.15

    if (ringRef.current) {
      ringRef.current.scale.setScalar(pulse)
      ringRef.current.rotation.z = t * 0.5
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.15 + Math.sin(t * 3) * 0.1
    }
  })

  return (
    <group position={position}>
      {/* Pulsing ring */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onClick?.()
        }}
        onPointerOver={() => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
      >
        <ringGeometry args={[size * 0.6, size, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.9 : 0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 0.3, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>

      {/* Center dot */}
      <mesh>
        <sphereGeometry args={[size * 0.08, 8, 8]} />
        <meshBasicMaterial color={0xffffff} />
      </mesh>
    </group>
  )
}
