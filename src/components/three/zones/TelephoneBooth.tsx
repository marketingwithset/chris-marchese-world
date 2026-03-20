'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Hotspot from '../objects/Hotspot'
import NeonSign from '../objects/NeonSign'
import { ZONES } from '@/lib/scene/zones'

interface TelephoneBoothProps {
  onHotspotClick: (contentId: string) => void
}

export default function TelephoneBooth({ onHotspotClick }: TelephoneBoothProps) {
  const zone = ZONES.telephone_booth
  const phoneGlowRef = useRef<THREE.Mesh>(null)
  const [pulse, setPulse] = useState(1)

  useFrame(({ clock }) => {
    if (phoneGlowRef.current) {
      const mat = phoneGlowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.3 + Math.sin(clock.getElapsedTime() * 2) * 0.2
    }
    setPulse(1 + Math.sin(clock.getElapsedTime() * 3) * 0.15)
  })

  const boothColor = 0xc0392b
  const boothWidth = 1.4
  const boothHeight = 2.8
  const boothDepth = 1.4

  return (
    <group position={zone.position}>
      {/* Zone label */}
      <NeonSign
        text="CONTACT"
        position={[0, boothHeight + 0.8, 0]}
        fontSize={0.4}
        color="#c0392b"
      />

      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[boothWidth + 0.1, 0.1, boothDepth + 0.1]} />
        <meshStandardMaterial color={boothColor} metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Four corner posts */}
      {[
        [-boothWidth / 2, 0, -boothDepth / 2],
        [boothWidth / 2, 0, -boothDepth / 2],
        [-boothWidth / 2, 0, boothDepth / 2],
        [boothWidth / 2, 0, boothDepth / 2],
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0], boothHeight / 2 + 0.1, pos[2]]}>
          <boxGeometry args={[0.1, boothHeight, 0.1]} />
          <meshStandardMaterial color={boothColor} metalness={0.3} roughness={0.6} />
        </mesh>
      ))}

      {/* Roof */}
      <mesh position={[0, boothHeight + 0.15, 0]}>
        <boxGeometry args={[boothWidth + 0.2, 0.12, boothDepth + 0.2]} />
        <meshStandardMaterial color={boothColor} metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Glass panels (3 sides - front is open) */}
      <mesh position={[-boothWidth / 2 + 0.02, boothHeight / 2 + 0.1, 0]}>
        <planeGeometry args={[boothDepth - 0.2, boothHeight - 0.3]} />
        <meshStandardMaterial
          color={0x4a7faa}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[boothWidth / 2 - 0.02, boothHeight / 2 + 0.1, 0]}>
        <planeGeometry args={[boothDepth - 0.2, boothHeight - 0.3]} />
        <meshStandardMaterial
          color={0x4a7faa}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, boothHeight / 2 + 0.1, -boothDepth / 2 + 0.02]}>
        <planeGeometry args={[boothWidth - 0.2, boothHeight - 0.3]} />
        <meshStandardMaterial
          color={0x4a7faa}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Phone on back wall */}
      <group position={[0, 1.5, -boothDepth / 2 + 0.15]}>
        <mesh>
          <boxGeometry args={[0.25, 0.35, 0.12]} />
          <meshStandardMaterial color={0x111111} metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.25, 0.05]}>
          <boxGeometry args={[0.06, 0.2, 0.06]} />
          <meshStandardMaterial color={0x111111} />
        </mesh>
        <mesh ref={phoneGlowRef} position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshBasicMaterial color={0xc9a84c} transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Hotspot */}
      <Hotspot
        position={[0, 2, boothDepth / 2 + 0.3]}
        onClick={() => onHotspotClick('contact-1')}
        color={0xc0392b}
        size={0.3}
        pulse={pulse}
      />

      {/* Interior light — emissive ceiling panel instead of pointLight */}
      <mesh position={[0, boothHeight - 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[boothWidth - 0.3, boothDepth - 0.3]} />
        <meshStandardMaterial
          color={0x111111}
          emissive={0xfff5e6}
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  )
}
