'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Hotspot from '../objects/Hotspot'
import NeonSign from '../objects/NeonSign'
import CarModel from '../objects/CarModel'
import { ZONES } from '@/lib/scene/zones'
import { useMaterial } from '@/lib/materials/useMaterial'

interface AutomotiveDisplayProps {
  onHotspotClick: (contentId: string) => void
}

export default function AutomotiveDisplay({ onHotspotClick }: AutomotiveDisplayProps) {
  const zone = ZONES.automotive
  const platformRef = useRef<THREE.Group>(null)
  const goldMat = useMaterial('gold_brushed')
  const darkMetalMat = useMaterial('dark_metal')

  useFrame(({ clock }) => {
    if (platformRef.current) {
      platformRef.current.rotation.y = clock.getElapsedTime() * 0.15
    }
  })

  return (
    <group position={zone.position}>
      {/* Zone label */}
      <NeonSign text="AUTOMOTIVE" position={[0, 4, -4]} fontSize={0.5} color="#f0ead8" />

      {/* Showroom spotlights — dramatic top-down and angled lights */}
      <spotLight
        position={[0, 7, 0]}
        angle={0.5}
        penumbra={0.8}
        intensity={1.5}
        color={0xfff8ee}
        castShadow
        target-position={[0, 0, 0]}
        shadow-mapSize={[512, 512]}
      />
      <spotLight
        position={[4, 5, 4]}
        angle={0.4}
        penumbra={0.6}
        intensity={0.6}
        color={0xddeeff}
        target-position={[0, 0.5, 0]}
      />
      <spotLight
        position={[-4, 5, -4]}
        angle={0.4}
        penumbra={0.6}
        intensity={0.6}
        color={0xffeedd}
        target-position={[0, 0.5, 0]}
      />

      {/* Ground reflection plane (subtle mirror effect) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[5.5, 48]} />
        <meshStandardMaterial
          color={0x0a0a0a}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Rotating platform */}
      <group ref={platformRef}>
        {/* Platform base — sleek disc */}
        <mesh position={[0, 0.08, 0]} receiveShadow>
          <cylinderGeometry args={[5, 5.2, 0.16, 64]} />
          <meshStandardMaterial color={0x0d0d0d} metalness={0.5} roughness={0.3} />
        </mesh>

        {/* Platform top surface (polished) */}
        <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[5, 64]} />
          <meshStandardMaterial color={0x111111} metalness={0.7} roughness={0.15} />
        </mesh>

        {/* Gold edge ring (flush with platform) */}
        <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.9, 5.02, 64]} />
          <primitive object={goldMat} attach="material" />
        </mesh>

        {/* Inner accent ring */}
        <mesh position={[0, 0.171, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.8, 3.85, 64]} />
          <meshStandardMaterial color={0xc9a84c} metalness={0.7} roughness={0.2} transparent opacity={0.3} />
        </mesh>

        {/* Platform edge lights (subtle LED strip) */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2
          return (
            <pointLight
              key={`plat-light-${i}`}
              position={[Math.cos(angle) * 4.95, 0.05, Math.sin(angle) * 4.95]}
              color={0xc9a84c}
              intensity={0.05}
              distance={1.5}
              decay={2}
            />
          )
        })}

        {/* === THE CAR === */}
        <CarModel scale={1.6} />

        {/* Hotspot (above car for interaction) */}
        <Hotspot
          position={[0, 3, 0]}
          onClick={() => onHotspotClick('auto-1')}
          color={0xf0ead8}
          size={0.35}
        />
      </group>
    </group>
  )
}
