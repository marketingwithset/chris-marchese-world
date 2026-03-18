'use client'

import { HEX } from '@/lib/constants'

interface PedestalProps {
  position: [number, number, number]
  height?: number
  radius?: number
  color?: number
}

export default function Pedestal({
  position,
  height = 1,
  radius = 0.4,
  color = HEX.card,
}: PedestalProps) {
  return (
    <group position={position}>
      {/* Main column */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius, radius * 1.1, height, 16]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.6} />
      </mesh>
      {/* Top plate */}
      <mesh position={[0, height + 0.03, 0]}>
        <cylinderGeometry args={[radius * 1.2, radius * 1.2, 0.06, 16]} />
        <meshStandardMaterial color={HEX.gold} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}
