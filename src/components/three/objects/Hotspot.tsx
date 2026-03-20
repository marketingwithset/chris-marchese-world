'use client'

import { useRef, useState } from 'react'
import * as THREE from 'three'

interface HotspotProps {
  position: [number, number, number]
  color?: number
  size?: number
  onClick?: () => void
  label?: string
  /** Pulse value computed by parent's useFrame (avoids per-hotspot useFrame) */
  pulse?: number
}

export default function Hotspot({
  position,
  color = 0xc9a84c,
  size = 0.4,
  onClick,
  pulse = 1,
}: HotspotProps) {
  const ringRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Apply pulse from parent (no useFrame needed)
  if (ringRef.current) {
    ringRef.current.scale.setScalar(pulse)
  }

  const glowOpacity = 0.15 + (pulse - 1) * 0.67 // maps pulse [0.85..1.15] to opacity [0.05..0.25]

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
      <mesh>
        <sphereGeometry args={[size * 0.3, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={glowOpacity} />
      </mesh>

      {/* Center dot */}
      <mesh>
        <sphereGeometry args={[size * 0.08, 8, 8]} />
        <meshBasicMaterial color={0xffffff} />
      </mesh>
    </group>
  )
}
