'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Hotspot from '../objects/Hotspot'
import NeonSign from '../objects/NeonSign'
import ImageFrame from '../objects/ImageFrame'
import { ZONES } from '@/lib/scene/zones'
import { useMaterial } from '@/lib/materials/useMaterial'

// Exhibition pieces — real artbymarchese.com originals, mixed sizes for visual rhythm
const PAINTINGS = [
  { id: 'art-1', label: "I'M IN LOVE WITH MONEY",  bgColor: '#2a1a08', w: 4.0, h: 3.0, x: -14, y: 3.8 },
  { id: 'art-2', label: 'DEVIL IN THE DETAILS',     bgColor: '#2a0a0a', w: 2.5, h: 3.2, x: -10, y: 3.6 },
  { id: 'art-3', label: 'WE ARE VENOM',             bgColor: '#0a0a1a', w: 3.0, h: 2.5, x: -6,  y: 3.5 },
  { id: 'art-4', label: 'RUN IT UP',                bgColor: '#1a0a08', w: 3.5, h: 2.8, x: -1.5, y: 4.0 },
  { id: 'art-5', label: 'CARAT KING',               bgColor: '#1a1a0a', w: 2.2, h: 3.0, x: 3,   y: 3.5 },
  { id: 'art-7', label: 'HORSEPOWER',               bgColor: '#0a0a0a', w: 3.0, h: 2.2, x: 7,   y: 3.5 },
  { id: 'art-6', label: "BLOWIN' MONEY",            bgColor: '#1a1008', w: 2.0, h: 2.8, x: 11,  y: 3.8 },
  { id: 'art-9', label: 'BANK OF DAFFY',            bgColor: '#0a1010', w: 2.5, h: 2.5, x: 14,  y: 3.5 },
]

// Sculpture pedestals — featuring select originals
const SCULPTURES = [
  { id: 'art-10', label: 'LA BELLEZA',  x: -8,  z: -11, height: 1.2 },
  { id: 'art-8',  label: 'ON TOP',      x: 0,   z: -10, height: 1.4 },
  { id: 'art-11', label: 'CAT WOMAN',   x: 8,   z: -11, height: 1.0 },
]

interface ArtGalleryProps {
  onHotspotClick: (contentId: string) => void
}

/** Rotating abstract sculpture on a pedestal */
function Sculpture({ position, height, id, onInteract, pulse }: {
  position: [number, number, number]
  height: number
  id: string
  onInteract: (id: string) => void
  pulse: number
}) {
  const ref = useRef<THREE.Group>(null)
  const goldMat = useMaterial('gold_brushed')

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.3
    }
  })

  return (
    <group position={position}>
      {/* Pedestal */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 1.0, 0.8]} />
        <meshStandardMaterial color={0x111111} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Pedestal top plate */}
      <mesh position={[0, 1.01, 0]}>
        <boxGeometry args={[0.85, 0.02, 0.85]} />
        <meshStandardMaterial color={0x1a1a1a} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Abstract sculpture — stacked geometric forms */}
      <group ref={ref} position={[0, 1.0 + height / 2, 0]}>
        <mesh position={[0, -height * 0.3, 0]} castShadow>
          <dodecahedronGeometry args={[height * 0.35, 0]} />
          <primitive object={goldMat} attach="material" />
        </mesh>
        <mesh position={[0, height * 0.15, 0]} castShadow>
          <octahedronGeometry args={[height * 0.25, 0]} />
          <meshStandardMaterial color={0x0d0d0d} metalness={0.9} roughness={0.08} />
        </mesh>
        <mesh position={[0, height * 0.45, 0]}>
          <sphereGeometry args={[height * 0.12, 16, 16]} />
          <primitive object={goldMat} attach="material" />
        </mesh>
      </group>

      <Hotspot
        position={[0, 2.5, 0.6]}
        onClick={() => onInteract(id)}
        color={0xc9a84c}
        size={0.2}
        pulse={pulse}
      />
    </group>
  )
}

export default function ArtGallery({ onHotspotClick }: ArtGalleryProps) {
  const zone = ZONES.art_gallery
  const wallZ = -14.9
  const galleryFloorMat = useMaterial('floor_marble')
  const [pulse, setPulse] = useState(1)

  useFrame(({ clock }) => {
    setPulse(1 + Math.sin(clock.getElapsedTime() * 3) * 0.15)
  })

  return (
    <group position={[zone.position[0], 0, zone.position[2]]}>
      {/* === GALLERY ACCENT WALL === */}
      <mesh position={[0, 4, -1.88]}>
        <planeGeometry args={[38, 8]} />
        <meshStandardMaterial color={0x0a0a0a} metalness={0.02} roughness={0.95} />
      </mesh>

      {/* Subtle gallery rail */}
      <mesh position={[0, 6.5, -1.85]}>
        <boxGeometry args={[38, 0.06, 0.06]} />
        <meshStandardMaterial color={0xc9a84c} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Gallery floor section — polished marble strip */}
      <mesh position={[0, 0.005, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[36, 4]} />
        <primitive object={galleryFloorMat} attach="material" />
      </mesh>

      {/* === SIGNAGE === */}
      <NeonSign
        text="GALLERY"
        position={[0, 7.2, -1.82]}
        fontSize={0.7}
        color="#c9a84c"
      />
      <NeonSign
        text="ART BY MARCHESE \u00b7 EST. 2015"
        position={[0, 6.7, -1.82]}
        fontSize={0.15}
        color="#8a7233"
      />

      {/* === ARTWORK === */}
      {PAINTINGS.map((painting) => (
        <group key={painting.id}>
          <ImageFrame
            position={[painting.x, painting.y, wallZ - zone.position[2]]}
            width={painting.w}
            height={painting.h}
            label={painting.label}
            bgColor={painting.bgColor}
            textColor="#c9a84c"
            borderColor={0xc9a84c}
            onClick={() => onHotspotClick(painting.id)}
            interactable
            contentId={painting.id}
          />

          <Hotspot
            position={[painting.x, painting.y - painting.h / 2 - 0.5, wallZ - zone.position[2] + 0.5]}
            onClick={() => onHotspotClick(painting.id)}
            color={0xc9a84c}
            size={0.2}
            pulse={pulse}
          />
        </group>
      ))}

      {/* === SCULPTURES === */}
      {SCULPTURES.map((s) => (
        <Sculpture
          key={s.id}
          position={[s.x, 0, s.z - zone.position[2]]}
          height={s.height}
          id={s.id}
          onInteract={onHotspotClick}
          pulse={pulse}
        />
      ))}

      {/* === GALLERY SEATING === */}
      <group position={[0, 0, 0.5]}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[5, 0.08, 1]} />
          <meshStandardMaterial color={0x1a1a1a} metalness={0.15} roughness={0.7} />
        </mesh>
        {[-2.2, 2.2].map((x) => (
          <mesh key={x} position={[x, 0.16, 0]}>
            <boxGeometry args={[0.08, 0.32, 0.9]} />
            <meshStandardMaterial color={0x111111} metalness={0.4} roughness={0.5} />
          </mesh>
        ))}
      </group>

      <group position={[-12, 0, 0.5]}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[3, 0.08, 0.8]} />
          <meshStandardMaterial color={0x1a1a1a} metalness={0.15} roughness={0.7} />
        </mesh>
        {[-1.2, 1.2].map((x) => (
          <mesh key={x} position={[x, 0.16, 0]}>
            <boxGeometry args={[0.08, 0.32, 0.7]} />
            <meshStandardMaterial color={0x111111} metalness={0.4} roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
