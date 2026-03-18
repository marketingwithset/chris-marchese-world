'use client'

import { Sparkles } from '@react-three/drei'
import Hotspot from '../objects/Hotspot'
import NeonSign from '../objects/NeonSign'
import { ZONES } from '@/lib/scene/zones'
import { useMaterial } from '@/lib/materials/useMaterial'

interface MoneyPileProps {
  onHotspotClick: (contentId: string) => void
}

export default function MoneyPile({ onHotspotClick }: MoneyPileProps) {
  const zone = ZONES.money_pile
  const darkMetalMat = useMaterial('dark_metal')
  const goldMat = useMaterial('gold_brushed')
  const moneyMat = useMaterial('money_green')

  return (
    <group position={zone.position}>
      {/* Zone label */}
      <NeonSign text="CHECKOUT" position={[0, 3.5, 0]} fontSize={0.4} color="#27ae60" />

      {/* Counter / desk */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3, 1, 2]} />
        <primitive object={darkMetalMat} attach="material" />
      </mesh>

      {/* Counter top surface */}
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[3.1, 0.04, 2.1]} />
        <meshStandardMaterial color={0x222222} metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Money stacks */}
      {[
        [-0.6, 1.1, -0.3], [-0.2, 1.1, 0.2], [0.3, 1.1, -0.1],
        [0.7, 1.1, 0.3], [-0.3, 1.2, -0.1], [0.2, 1.2, 0.1], [0, 1.3, 0],
      ].map((pos, i) => (
        <mesh key={`bill-${i}`} position={pos as [number, number, number]}>
          <boxGeometry args={[0.6, 0.08, 0.3]} />
          <primitive object={moneyMat} attach="material" />
        </mesh>
      ))}

      {/* Gold bars */}
      {[
        [0.8, 1.15, -0.5], [-0.8, 1.15, 0.4], [0.1, 1.35, -0.3],
      ].map((pos, i) => (
        <mesh key={`gold-${i}`} position={pos as [number, number, number]}>
          <boxGeometry args={[0.5, 0.2, 0.2]} />
          <primitive object={goldMat} attach="material" />
        </mesh>
      ))}

      {/* Cash register */}
      <group position={[0, 1.4, -0.6]}>
        <mesh>
          <boxGeometry args={[0.7, 0.5, 0.4]} />
          <primitive object={darkMetalMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.15, 0.21]}>
          <planeGeometry args={[0.5, 0.2]} />
          <meshBasicMaterial color={0x0a2a0a} />
        </mesh>
      </group>

      {/* Sparkles */}
      <Sparkles count={30} scale={[3, 2, 2]} position={[0, 2, 0]} size={2} speed={0.4} color="#c9a84c" />

      {/* Hotspot */}
      <Hotspot
        position={[0, 2.5, 0.5]}
        onClick={() => onHotspotClick('checkout-1')}
        color={0x27ae60}
        size={0.3}
      />
    </group>
  )
}
