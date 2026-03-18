'use client'

import Hotspot from '../objects/Hotspot'
import NeonSign from '../objects/NeonSign'
import ImageFrame from '../objects/ImageFrame'
import { ZONES } from '@/lib/scene/zones'
import { useMaterial } from '@/lib/materials/useMaterial'

const PAINTINGS = [
  { id: 'art-1', label: 'NEON DREAMS', bgColor: '#3a2a10', x: -12 },
  { id: 'art-2', label: 'BLUE HORIZON', bgColor: '#1a2a3c', x: -6 },
  { id: 'art-3', label: 'PURPLE RAIN', bgColor: '#2a1020', x: 0 },
  { id: 'art-4', label: 'MIDNIGHT', bgColor: '#0a0a0a', x: 6 },
  { id: 'art-5', label: 'EARTH TONES', bgColor: '#2b2116', x: 12 },
]

interface ArtGalleryProps {
  onHotspotClick: (contentId: string) => void
}

export default function ArtGallery({ onHotspotClick }: ArtGalleryProps) {
  const zone = ZONES.art_gallery
  const wallZ = -14.9
  const darkMat = useMaterial('dark_metal')

  return (
    <group position={[zone.position[0], 0, zone.position[2]]}>
      {/* Accent wall panel */}
      <mesh position={[0, 4, -1.9 + 0.01]}>
        <planeGeometry args={[36, 8]} />
        <meshStandardMaterial color={0x0e0e0e} metalness={0.05} roughness={0.9} />
      </mesh>

      {/* Gallery neon sign */}
      <NeonSign
        text="GALLERY"
        position={[0, 7, -1.85]}
        fontSize={0.6}
        color="#c9a84c"
      />
      <NeonSign
        text="ART BY MARCHESE · EST. 2015"
        position={[0, 6.2, -1.85]}
        fontSize={0.18}
        color="#8a7233"
      />

      {/* Paintings with labeled image placeholders */}
      {PAINTINGS.map((painting) => (
        <group key={painting.id}>
          <ImageFrame
            position={[painting.x, 3.8, wallZ - zone.position[2]]}
            width={2}
            height={2.5}
            label={painting.label}
            bgColor={painting.bgColor}
            textColor="#c9a84c"
            borderColor={0xc9a84c}
            onClick={() => onHotspotClick(painting.id)}
            interactable
            contentId={painting.id}
          />
          <Hotspot
            position={[painting.x, 2, wallZ - zone.position[2] + 0.5]}
            onClick={() => onHotspotClick(painting.id)}
            color={0xc9a84c}
            size={0.25}
          />
        </group>
      ))}

      {/* Gallery bench */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[4, 0.4, 0.8]} />
        <primitive object={darkMat} attach="material" />
      </mesh>
      <mesh position={[-1.5, 0.6, 0]}>
        <boxGeometry args={[0.05, 0.4, 0.8]} />
        <primitive object={darkMat} attach="material" />
      </mesh>
      <mesh position={[1.5, 0.6, 0]}>
        <boxGeometry args={[0.05, 0.4, 0.8]} />
        <primitive object={darkMat} attach="material" />
      </mesh>
    </group>
  )
}
