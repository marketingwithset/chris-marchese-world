'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import Hotspot from '../objects/Hotspot'
import NeonSign from '../objects/NeonSign'
import { ZONES } from '@/lib/scene/zones'
import { useMaterial } from '@/lib/materials/useMaterial'

interface AutomotiveDisplayProps {
  onHotspotClick: (contentId: string) => void
}

export default function AutomotiveDisplay({ onHotspotClick }: AutomotiveDisplayProps) {
  const zone = ZONES.automotive
  const platformRef = useRef<THREE.Group>(null)
  const carBodyMat = useMaterial('car_body')
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

      {/* Rotating platform */}
      <group ref={platformRef}>
        {/* Platform base */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[5, 5, 0.3, 48]} />
          <primitive object={darkMetalMat} attach="material" />
        </mesh>

        {/* Platform edge ring */}
        <mesh position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.85, 5.05, 48]} />
          <meshBasicMaterial color={0xc9a84c} transparent opacity={0.6} />
        </mesh>

        {/* Car body */}
        <RoundedBox args={[3.5, 0.8, 1.6]} radius={0.15} position={[0, 0.8, 0]}>
          <primitive object={carBodyMat} attach="material" />
        </RoundedBox>

        {/* Car cabin */}
        <RoundedBox args={[1.8, 0.65, 1.4]} radius={0.12} position={[-0.2, 1.5, 0]}>
          <meshStandardMaterial color={0x080808} metalness={0.7} roughness={0.2} />
        </RoundedBox>

        {/* Windshield */}
        <mesh position={[0.7, 1.35, 0]} rotation={[0, 0, -0.4]}>
          <planeGeometry args={[0.7, 1.3]} />
          <meshStandardMaterial color={0x1a3050} metalness={0.9} roughness={0.1} transparent opacity={0.7} />
        </mesh>

        {/* Wheels */}
        {[
          [1.2, 0.35, 0.85], [1.2, 0.35, -0.85],
          [-1.2, 0.35, 0.85], [-1.2, 0.35, -0.85],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.15, 16]} />
            <meshStandardMaterial color={0x1a1a1a} metalness={0.3} roughness={0.7} />
          </mesh>
        ))}

        {/* Headlights */}
        <mesh position={[1.8, 0.75, 0.5]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color={0xffffff} />
        </mesh>
        <mesh position={[1.8, 0.75, -0.5]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color={0xffffff} />
        </mesh>

        {/* Taillights */}
        <mesh position={[-1.8, 0.75, 0.5]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color={0xcc0000} />
        </mesh>
        <mesh position={[-1.8, 0.75, -0.5]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color={0xcc0000} />
        </mesh>

        {/* Hotspot */}
        <Hotspot
          position={[0, 2.5, 0]}
          onClick={() => onHotspotClick('auto-1')}
          color={0xf0ead8}
          size={0.35}
        />
      </group>
    </group>
  )
}
