'use client'

import { useState } from 'react'
import { useFrame } from '@react-three/fiber'
import Hotspot from '../objects/Hotspot'
import NeonSign from '../objects/NeonSign'
import { ZONES } from '@/lib/scene/zones'

interface FashionRunwayProps {
  onHotspotClick: (contentId: string) => void
}

function Mannequin({
  position,
  bodyColor = 0xf0ead8,
  outfitColor = 0x1a1a1a,
  contentId,
  onClick,
  pulse,
}: {
  position: [number, number, number]
  bodyColor?: number
  outfitColor?: number
  contentId: string
  onClick: (id: string) => void
  pulse: number
}) {
  return (
    <group position={position}>
      {/* Head */}
      <mesh position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.9, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.15, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.18, 0.7, 8]} />
        <meshStandardMaterial color={outfitColor} metalness={0.1} roughness={0.7} />
      </mesh>
      {/* Left leg */}
      <mesh position={[-0.1, 0.7, 0]}>
        <cylinderGeometry args={[0.08, 0.07, 0.9, 8]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.1, 0.7, 0]}>
        <cylinderGeometry args={[0.08, 0.07, 0.9, 8]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.3, 1.5, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.05, 0.04, 0.6, 8]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.3, 1.5, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.05, 0.04, 0.6, 8]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>
      {/* Hotspot */}
      <Hotspot
        position={[0, 2.6, 0]}
        onClick={() => onClick(contentId)}
        color={0xc9a84c}
        size={0.2}
        pulse={pulse}
      />
    </group>
  )
}

export default function FashionRunway({ onHotspotClick }: FashionRunwayProps) {
  const zone = ZONES.fashion_runway
  const [pulse, setPulse] = useState(1)

  useFrame(({ clock }) => {
    setPulse(1 + Math.sin(clock.getElapsedTime() * 3) * 0.15)
  })

  return (
    <group position={zone.position}>
      {/* Zone label */}
      <NeonSign
        text="FASHION"
        position={[5.9, 5.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        fontSize={0.5}
        color="#f0ead8"
      />

      {/* Runway platform */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[3, 0.2, 10]} />
        <meshStandardMaterial color={0x0d0d0d} metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Runway edge lights - left */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`l-${i}`} position={[-1.6, 0.25, -4 + i * 1.1]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color={0xffffff} />
        </mesh>
      ))}

      {/* Runway edge lights - right */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`r-${i}`} position={[1.6, 0.25, -4 + i * 1.1]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color={0xffffff} />
        </mesh>
      ))}

      {/* Center line */}
      <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.03, 9]} />
        <meshBasicMaterial color={0xc9a84c} transparent opacity={0.4} />
      </mesh>

      {/* Mannequins */}
      <Mannequin
        position={[0, 0.2, -3]}
        outfitColor={0x8b6914}
        contentId="fashion-1"
        onClick={onHotspotClick}
        pulse={pulse}
      />
      <Mannequin
        position={[0, 0.2, 0]}
        outfitColor={0x1a1a1a}
        contentId="fashion-2"
        onClick={onHotspotClick}
        pulse={pulse}
      />
      <Mannequin
        position={[0, 0.2, 3]}
        outfitColor={0x2a2a3a}
        contentId="fashion-3"
        onClick={onHotspotClick}
        pulse={pulse}
      />

      {/* Backdrop at end */}
      <mesh position={[0, 3, -5.1]}>
        <planeGeometry args={[3, 5]} />
        <meshStandardMaterial color={0x0a0a0a} />
      </mesh>

      {/* Floor area */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 12]} />
        <meshStandardMaterial color={0x0a0a0a} />
      </mesh>
    </group>
  )
}
