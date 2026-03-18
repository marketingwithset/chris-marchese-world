'use client'

import { Sparkles } from '@react-three/drei'
import PortalArchway from '../objects/PortalArchway'
import { ZONES } from '@/lib/scene/zones'

interface PortalGrowthProps {
  onEnter: () => void
}

export default function PortalGrowth({ onEnter }: PortalGrowthProps) {
  const zone = ZONES.portal_growth

  return (
    <group position={zone.position}>
      <PortalArchway
        position={[0, 0, 0]}
        color={zone.color}
        hexColor={zone.hexColor}
        label="GROWTH"
        onEnter={onEnter}
      />

      {/* Extra energy sparkles around portal */}
      <Sparkles
        count={15}
        scale={[5, 6, 2]}
        position={[0, 3, 0]}
        size={1}
        speed={1}
        color="#5a9e6f"
      />

      {/* Base plate */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color={0x080a08} />
      </mesh>
    </group>
  )
}
