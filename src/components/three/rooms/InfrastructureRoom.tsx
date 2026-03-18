'use client'

import SubRoom from '../SubRoom'
import Hotspot from '../objects/Hotspot'
import NeonSign from '../objects/NeonSign'
import ImageFrame from '../objects/ImageFrame'
import VideoScreen from '../objects/VideoScreen'
import PortalArchway from '../objects/PortalArchway'
import Lighting from '../Lighting'
import { ROOMS } from '@/lib/scene/rooms'
import { useMaterial } from '@/lib/materials/useMaterial'
import type { LightingMode } from '@/types'

interface InfrastructureRoomProps {
  onHotspotClick: (contentId: string) => void
  onReturn: () => void
  lightingMode: LightingMode
}

export default function InfrastructureRoom({ onHotspotClick, onReturn, lightingMode }: InfrastructureRoomProps) {
  const config = ROOMS.infrastructure
  const darkMetalMat = useMaterial('dark_metal')

  return (
    <group>
      <SubRoom config={config} floorMaterial="floor_concrete" wallMaterial="wall_infra" />
      <Lighting mode={lightingMode} />

      {/* Room accent lighting */}
      <pointLight position={[0, 7, 0]} color={0xc9a84c} intensity={1.2} distance={25} />
      <pointLight position={[-12, 5, 0]} color={0xc9a84c} intensity={0.6} distance={15} />
      <pointLight position={[12, 5, 0]} color={0xc9a84c} intensity={0.6} distance={15} />
      <spotLight position={[0, 8, 0]} angle={0.7} penumbra={0.4} intensity={0.7} color={0xfff5e6} />

      {/* Room title */}
      <NeonSign text="INFRASTRUCTURE" position={[0, 7.5, -14.9]} fontSize={0.7} color="#c9a84c" />

      {/* === CENTER: Architectural model on platform === */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[8, 0.3, 6]} />
          <primitive object={darkMetalMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8.1, 6.1]} />
          <meshBasicMaterial color={0xc9a84c} transparent opacity={0.1} />
        </mesh>

        {/* Building model */}
        {[
          { x: -2, z: -1, w: 1.2, h: 3, d: 1 },
          { x: -0.5, z: -0.5, w: 1.5, h: 4.5, d: 1.2 },
          { x: 1, z: 0, w: 1, h: 2.5, d: 1 },
          { x: 2.2, z: -1, w: 0.8, h: 3.5, d: 0.8 },
          { x: 0.5, z: 1.5, w: 1.3, h: 2, d: 0.9 },
          { x: -1.5, z: 1, w: 1, h: 1.8, d: 1.2 },
        ].map((b, i) => (
          <mesh key={i} position={[b.x, 0.3 + b.h / 2, b.z]}>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial
              color={0x1a1a1a}
              metalness={0.2}
              roughness={0.6}
              wireframe={i % 2 === 0}
            />
          </mesh>
        ))}
      </group>

      {/* === LEFT WALL: Development Projects === */}
      <group position={[-17, 0, 0]}>
        <NeonSign text="PROJECTS" position={[0.5, 7, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.4} color="#c9a84c" />

        {[
          { id: 'infra-proj-1', z: -5, label: 'Development' },
          { id: 'infra-proj-2', z: -1, label: 'Construction' },
          { id: 'infra-proj-3', z: 3, label: 'Renovation' },
          { id: 'infra-proj-4', z: 7, label: 'Design' },
        ].map((panel) => (
          <group key={panel.id} position={[0.5, 0, panel.z]}>
            <ImageFrame
              position={[0, 4, 0]}
              rotation={[0, Math.PI / 2, 0]}
              width={2.2}
              height={4.5}
              label={panel.label}
              bgColor="#121210"
              textColor="#c9a84c"
              borderColor={0xc9a84c}
              onClick={() => onHotspotClick(panel.id)}
              interactable
              contentId={panel.id}
            />
          </group>
        ))}
      </group>

      {/* === RIGHT WALL: Systems / Tech === */}
      <group position={[17, 0, 0]}>
        <NeonSign text="SYSTEMS" position={[-0.5, 7, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.4} color="#c9a84c" />

        {/* Server rack suggestions */}
        {[-5, -2, 1, 4, 7].map((z, i) => (
          <group key={i} position={[-0.5, 0, z]}>
            <mesh position={[0, 3, 0]}>
              <boxGeometry args={[0.8, 5, 1.2]} />
              <primitive object={darkMetalMat} attach="material" />
            </mesh>
            {/* Status lights */}
            {[1.5, 2.5, 3.5, 4.5].map((y, j) => (
              <mesh key={j} position={[-0.41, y, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[0.05, 0.05]} />
                <meshBasicMaterial color={j % 3 === 0 ? 0xc9a84c : 0x5a9e6f} />
              </mesh>
            ))}
          </group>
        ))}

        <Hotspot
          position={[-1, 5, 1]}
          onClick={() => onHotspotClick('infra-sys-1')}
          color={0xc9a84c}
          size={0.3}
        />
      </group>

      {/* === BACK WALL: Blueprint grid + project video === */}
      <group position={[0, 0, -14.5]}>
        <NeonSign text="BLUEPRINT" position={[0, 5, 0]} fontSize={0.3} color="#8a7233" />

        {/* Grid lines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={`v-${i}`} position={[-12 + i * 2.7, 4, 0.05]}>
            <planeGeometry args={[0.02, 7]} />
            <meshBasicMaterial color={0xc9a84c} transparent opacity={0.08} />
          </mesh>
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={`h-${i}`} position={[0, 1 + i * 1.2, 0.05]}>
            <planeGeometry args={[24, 0.02]} />
            <meshBasicMaterial color={0xc9a84c} transparent opacity={0.08} />
          </mesh>
        ))}

        {/* Video screen on back wall */}
        <VideoScreen
          position={[8, 4, 0.2]}
          vimeoId="1173874041"
          width={4}
          height={2.25}
          label="Infrastructure Showcase"
        />

        <Hotspot
          position={[0, 6, 0.5]}
          onClick={() => onHotspotClick('infra-tech-1')}
          color={0xc9a84c}
          size={0.3}
        />
      </group>

      {/* === RETURN PORTAL === */}
      <PortalArchway
        position={[0, 0, 13]}
        color="#c9a84c"
        hexColor={0xc9a84c}
        label="MAIN ROOM"
        onEnter={onReturn}
      />
    </group>
  )
}
