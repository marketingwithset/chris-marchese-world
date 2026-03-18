'use client'

import PortalArchway from '../objects/PortalArchway'
import { ZONES } from '@/lib/scene/zones'

interface PortalCapitalProps {
  onEnter: () => void
}

export default function PortalCapital({ onEnter }: PortalCapitalProps) {
  const zone = ZONES.portal_capital

  return (
    <group position={zone.position}>
      <PortalArchway
        position={[0, 0, 0]}
        color={zone.color}
        hexColor={zone.hexColor}
        label="CAPITAL"
        onEnter={onEnter}
      />

      {/* Vault wheel decoration */}
      <mesh position={[0, 2.5, 0.2]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.6, 0.06, 8, 24]} />
        <meshStandardMaterial color={0x4a7fa5} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 2.5, 0.2]}>
        <torusGeometry args={[0.3, 0.03, 8, 24]} />
        <meshStandardMaterial color={0x4a7fa5} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Base plate */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color={0x0a0e18} />
      </mesh>
    </group>
  )
}
