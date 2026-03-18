'use client'

import Hotspot from '../objects/Hotspot'
import NeonSign from '../objects/NeonSign'
import VideoScreen from '../objects/VideoScreen'
import { ZONES } from '@/lib/scene/zones'
import { useMaterial } from '@/lib/materials/useMaterial'

interface FilmStudioProps {
  onHotspotClick: (contentId: string) => void
}

export default function FilmStudio({ onHotspotClick }: FilmStudioProps) {
  const zone = ZONES.film_studio
  const darkMat = useMaterial('dark_metal')

  return (
    <group position={zone.position}>
      {/* Zone label */}
      <NeonSign
        text="FILM"
        position={[-5.9, 5.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.5}
        color="#4a7fa5"
      />
      <NeonSign
        text="PRODUCER \u00b7 ACTOR"
        position={[-5.9, 4.8, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.18}
        color="#8a7233"
      />

      {/* === VIDEO WALL \u2014 stacked monitors on left wall === */}
      {/* Main reel \u2014 large hero screen */}
      <VideoScreen
        position={[-5.8, 4.5, -2]}
        rotation={[0, Math.PI / 2, 0]}
        vimeoId="1174206252"
        width={4}
        height={2.2}
        label="The Martini Shot"
      />

      {/* Secondary reels \u2014 smaller screens below */}
      <VideoScreen
        position={[-5.8, 2, -3.5]}
        rotation={[0, Math.PI / 2, 0]}
        vimeoId="1173874678"
        width={2.2}
        height={1.3}
        label="This Mortal Coil"
      />
      <VideoScreen
        position={[-5.8, 2, -0.5]}
        rotation={[0, Math.PI / 2, 0]}
        vimeoId="1173874041"
        width={2.2}
        height={1.3}
        label="Behind the Lens"
      />
      <VideoScreen
        position={[-5.8, 2, 2.5]}
        rotation={[0, Math.PI / 2, 0]}
        vimeoId="1173872281"
        width={2.2}
        height={1.3}
        label="Director's Cut"
      />

      {/* Camera on tripod */}
      <group position={[0, 0, 0]}>
        {/* Tripod legs */}
        {[
          { pos: [-0.3, 0.8, 0.3], rot: [0.15, 0, -0.1] },
          { pos: [0.3, 0.8, 0.3], rot: [0.15, 0, 0.1] },
          { pos: [0, 0.8, -0.3], rot: [-0.15, 0, 0] },
        ].map((leg, i) => (
          <mesh key={i} position={leg.pos as [number, number, number]} rotation={leg.rot as [number, number, number]}>
            <cylinderGeometry args={[0.03, 0.03, 1.8, 8]} />
            <meshStandardMaterial color={0x333333} metalness={0.3} roughness={0.5} />
          </mesh>
        ))}
        {/* Camera body */}
        <mesh position={[0, 1.7, 0]}>
          <boxGeometry args={[0.8, 0.5, 0.5]} />
          <primitive object={darkMat} attach="material" />
        </mesh>
        {/* Lens */}
        <mesh position={[0, 1.7, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.12, 0.4, 16]} />
          <meshStandardMaterial color={0x111111} metalness={0.7} roughness={0.3} />
        </mesh>
        <Hotspot
          position={[0, 2.3, 0]}
          onClick={() => onHotspotClick('film-1')}
          color={0x4a7fa5}
          size={0.3}
        />
      </group>

      {/* Director's chair */}
      <group position={[2.5, 0, 1]}>
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[0.7, 0.05, 0.6]} />
          <meshStandardMaterial color={0x1a1a1a} metalness={0.1} roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.2, -0.25]}>
          <boxGeometry args={[0.7, 0.5, 0.05]} />
          <meshStandardMaterial color={0x2a1a00} metalness={0.05} roughness={0.85} />
        </mesh>
        {[[-0.3, 0, -0.25], [0.3, 0, -0.25], [-0.3, 0, 0.25], [0.3, 0, 0.25]].map((pos, i) => (
          <mesh key={i} position={[pos[0], 0.35, pos[2]]}>
            <boxGeometry args={[0.04, 0.7, 0.04]} />
            <meshStandardMaterial color={0x333333} metalness={0.3} roughness={0.5} />
          </mesh>
        ))}
        <Hotspot
          position={[0, 1.8, 0]}
          onClick={() => onHotspotClick('film-2')}
          color={0x4a7fa5}
          size={0.25}
        />
      </group>

      {/* Clapperboard on floor */}
      <group position={[1.5, 0.15, -1]}>
        <mesh rotation={[-0.1, 0.3, 0]}>
          <boxGeometry args={[0.6, 0.04, 0.5]} />
          <primitive object={darkMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.05, -0.2]} rotation={[-0.3, 0.3, 0]}>
          <boxGeometry args={[0.6, 0.04, 0.12]} />
          <meshStandardMaterial color={0xf0ead8} metalness={0.1} roughness={0.7} />
        </mesh>
        <Hotspot
          position={[0, 0.5, 0]}
          onClick={() => onHotspotClick('film-3')}
          color={0x4a7fa5}
          size={0.2}
        />
      </group>

      {/* Film strip accent lights along ceiling */}
      {[-4, -2, 0, 2, 4].map((z, i) => (
        <pointLight
          key={`film-light-${i}`}
          position={[-4, 7.5, z]}
          color={0x4a7fa5}
          intensity={0.15}
          distance={5}
          decay={2}
        />
      ))}

      {/* Floor rug / area marker */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={0x0d1520} metalness={0.05} roughness={0.9} />
      </mesh>
    </group>
  )
}
