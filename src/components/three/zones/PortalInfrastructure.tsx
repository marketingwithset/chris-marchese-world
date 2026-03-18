'use client'

import PortalArchway from '../objects/PortalArchway'
import { ZONES } from '@/lib/scene/zones'

interface PortalInfrastructureProps {
  onEnter: () => void
}

export default function PortalInfrastructure({ onEnter }: PortalInfrastructureProps) {
  const zone = ZONES.portal_infrastructure

  return (
    <group position={zone.position}>
      <PortalArchway
        position={[0, 0, 0]}
        color={zone.color}
        hexColor={zone.hexColor}
        label="INFRASTRUCTURE"
        onEnter={onEnter}
      />

      {/* Structural beam decorations */}
      {[-1.8, -0.9, 0.9, 1.8].map((x, i) => (
        <mesh key={i} position={[x, 2.5, -0.3]}>
          <boxGeometry args={[0.04, 5, 0.04]} />
          <meshBasicMaterial color={0xc9a84c} transparent opacity={0.3} />
        </mesh>
      ))}

      {/* Horizontal beams */}
      {[1.5, 3, 4.5].map((y, i) => (
        <mesh key={`h-${i}`} position={[0, y, -0.3]}>
          <boxGeometry args={[3.6, 0.03, 0.03]} />
          <meshBasicMaterial color={0xc9a84c} transparent opacity={0.2} />
        </mesh>
      ))}

      {/* Base plate */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color={0x0a0a08} />
      </mesh>
    </group>
  )
}
