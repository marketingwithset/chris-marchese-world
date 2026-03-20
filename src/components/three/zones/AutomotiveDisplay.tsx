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
      {/* Single showroom spotlight (no extra shadow map — main directional handles it) */}
      <spotLight
        position={[0, 7, 0]}
        angle={0.6}
        penumbra={0.8}
        intensity={2.0}
        color={0xfff8ee}
        target-position={[0, 0, 0]}
      />

      {/* Ground reflection plane (subtle mirror effect) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[5.5, 32]} />
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
          <cylinderGeometry args={[5, 5.2, 0.16, 32]} />
          <meshStandardMaterial color={0x0d0d0d} metalness={0.5} roughness={0.3} />
        </mesh>

        {/* Platform top surface (polished) */}
        <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[5, 32]} />
          <meshStandardMaterial color={0x111111} metalness={0.7} roughness={0.15} />
        </mesh>

        {/* Gold edge ring (flush with platform) */}
        <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.9, 5.02, 32]} />
          <primitive object={goldMat} attach="material" />
        </mesh>

        {/* Inner accent ring */}
        <mesh position={[0, 0.171, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.8, 3.85, 32]} />
          <meshStandardMaterial color={0xc9a84c} metalness={0.7} roughness={0.2} transparent opacity={0.3} />
        </mesh>

        {/* Platform edge — emissive ring instead of 16 point lights */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.85, 5.0, 32]} />
          <meshStandardMaterial
            color={0x0a0a0a}
            emissive={0xc9a84c}
            emissiveIntensity={0.6}
          />
        </mesh>

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
