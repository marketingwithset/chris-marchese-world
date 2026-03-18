'use client'

import { HEX } from '@/lib/constants'

interface FrameProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
  canvasColor?: number
  onClick?: () => void
}

export default function Frame({
  position,
  rotation = [0, 0, 0],
  width = 2,
  height = 2.5,
  canvasColor = 0x2a2a2a,
  onClick,
}: FrameProps) {
  const frameDepth = 0.12
  const borderWidth = 0.12

  return (
    <group position={position} rotation={rotation}>
      {/* Frame border — top */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width + borderWidth * 2, borderWidth, frameDepth]} />
        <meshStandardMaterial color={HEX.gold} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Frame border — bottom */}
      <mesh position={[0, -height / 2, 0]}>
        <boxGeometry args={[width + borderWidth * 2, borderWidth, frameDepth]} />
        <meshStandardMaterial color={HEX.gold} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Frame border — left */}
      <mesh position={[-width / 2, 0, 0]}>
        <boxGeometry args={[borderWidth, height, frameDepth]} />
        <meshStandardMaterial color={HEX.gold} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Frame border — right */}
      <mesh position={[width / 2, 0, 0]}>
        <boxGeometry args={[borderWidth, height, frameDepth]} />
        <meshStandardMaterial color={HEX.gold} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Canvas / artwork surface */}
      <mesh
        position={[0, 0, -0.02]}
        onClick={(e) => {
          e.stopPropagation()
          onClick?.()
        }}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'default' }}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={canvasColor} />
      </mesh>

      {/* Plaque below */}
      <mesh position={[0, -height / 2 - 0.3, 0.02]}>
        <boxGeometry args={[0.8, 0.2, 0.03]} />
        <meshStandardMaterial color={HEX.goldDim} metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  )
}
