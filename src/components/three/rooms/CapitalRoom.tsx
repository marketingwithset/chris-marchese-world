'use client'

import SubRoom from '../SubRoom'
import Hotspot from '../objects/Hotspot'
import NeonSign from '../objects/NeonSign'
import ImageFrame from '../objects/ImageFrame'
import PortalArchway from '../objects/PortalArchway'
import Lighting from '../Lighting'
import { ROOMS } from '@/lib/scene/rooms'
import { useMaterial } from '@/lib/materials/useMaterial'
import type { LightingMode } from '@/types'

interface CapitalRoomProps {
  onHotspotClick: (contentId: string) => void
  onReturn: () => void
  lightingMode: LightingMode
}

export default function CapitalRoom({ onHotspotClick, onReturn, lightingMode }: CapitalRoomProps) {
  const config = ROOMS.capital
  const goldMat = useMaterial('gold_brushed')
  const darkMetalMat = useMaterial('dark_metal')

  return (
    <group>
      <SubRoom config={config} floorMaterial="floor_capital" wallMaterial="wall_capital" />
      <Lighting mode={lightingMode} />

      {/* Room accent lighting */}
      <pointLight position={[0, 8, 0]} color={0x4a7fa5} intensity={1.5} distance={25} />
      <pointLight position={[-10, 5, -8]} color={0x4a7fa5} intensity={0.8} distance={15} />
      <pointLight position={[10, 5, -8]} color={0x4a7fa5} intensity={0.8} distance={15} />
      <spotLight position={[0, 9, 0]} angle={0.6} penumbra={0.5} intensity={0.8} color={0xffffff} />

      {/* Room title */}
      <NeonSign text="SET VENTURES" position={[0, 8, -12.4]} fontSize={0.8} color="#4a7fa5" />
      <NeonSign text="CAPITAL" position={[0, 7, -12.4]} fontSize={0.5} color="#f0ead8" />

      {/* === BACK WALL: Deal Origination Pipeline === */}
      <group position={[0, 0, -11]}>
        <NeonSign text="DEAL ORIGINATION" position={[0, 6, 0]} fontSize={0.4} color="#4a7fa5" />

        {/* Pipeline stage bars */}
        {[
          { label: 'Sourcing', width: 8, color: 0x1a3050, y: 4.5 },
          { label: 'Evaluation', width: 6, color: 0x1a4060, y: 3.5 },
          { label: 'Due Diligence', width: 4.5, color: 0x2a5070, y: 2.5 },
          { label: 'Closing', width: 3, color: 0x3a6080, y: 1.5 },
        ].map((stage, i) => (
          <group key={i}>
            <mesh position={[0, stage.y, 0.1]}>
              <boxGeometry args={[stage.width, 0.6, 0.1]} />
              <meshStandardMaterial color={stage.color} metalness={0.3} roughness={0.5} />
            </mesh>
          </group>
        ))}

        <Hotspot
          position={[0, 5.5, 0.5]}
          onClick={() => onHotspotClick('cap-deals-1')}
          color={0x4a7fa5}
          size={0.3}
        />
      </group>

      {/* === LEFT WALL: Capital Services === */}
      <group position={[-14, 0, 0]}>
        <NeonSign text="SERVICES" position={[0.5, 7, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.4} color="#4a7fa5" />

        {/* Service panels with image placeholders */}
        {[
          { id: 'cap-svc-1', title: 'Investment Advisory', z: -3 },
          { id: 'cap-svc-2', title: 'Private Equity', z: 0 },
          { id: 'cap-svc-3', title: 'Strategic Capital', z: 3 },
        ].map((panel) => (
          <group key={panel.id} position={[0.5, 0, panel.z]}>
            <ImageFrame
              position={[0, 3.5, 0]}
              rotation={[0, Math.PI / 2, 0]}
              width={2.2}
              height={3}
              label={panel.title}
              bgColor="#0a1520"
              textColor="#4a7fa5"
              borderColor={0x4a7fa5}
              onClick={() => onHotspotClick(panel.id)}
              interactable
              contentId={panel.id}
            />
          </group>
        ))}
      </group>

      {/* === RIGHT WALL: Portfolio / Clients === */}
      <group position={[14, 0, 0]}>
        <NeonSign text="PORTFOLIO" position={[-0.5, 7, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.4} color="#4a7fa5" />

        {/* Client logo placeholders (3x2 grid) */}
        {[
          { label: 'BMW', y: 5, z: -3 },
          { label: 'WYNN', y: 5, z: 0 },
          { label: 'HUAWEI', y: 5, z: 3 },
          { label: 'CLIENT 4', y: 3, z: -3 },
          { label: 'CLIENT 5', y: 3, z: 0 },
          { label: 'CLIENT 6', y: 3, z: 3 },
        ].map((client, i) => (
          <ImageFrame
            key={i}
            position={[-0.5, client.y, client.z]}
            rotation={[0, -Math.PI / 2, 0]}
            width={1.1}
            height={1.1}
            label={client.label}
            bgColor="#151520"
            textColor="#4a7fa5"
            borderColor={0x333344}
          />
        ))}

        <Hotspot
          position={[-0.8, 4, 0]}
          onClick={() => onHotspotClick('cap-clients-1')}
          color={0x4a7fa5}
          size={0.3}
        />
      </group>

      {/* === CENTER: Vault table with gold bars === */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[3, 1, 2]} />
          <primitive object={darkMetalMat} attach="material" />
        </mesh>
        <mesh position={[0, 1.03, 0]}>
          <boxGeometry args={[3.1, 0.04, 2.1]} />
          <meshStandardMaterial color={0x4a7fa5} metalness={0.5} roughness={0.3} />
        </mesh>

        {/* Gold bars */}
        {[[-0.6, 1.15, -0.3], [0, 1.15, 0.2], [0.5, 1.15, -0.1], [-0.3, 1.25, 0]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <boxGeometry args={[0.5, 0.18, 0.2]} />
            <primitive object={goldMat} attach="material" />
          </mesh>
        ))}
      </group>

      {/* === RETURN PORTAL === */}
      <PortalArchway
        position={[0, 0, 11]}
        color="#c9a84c"
        hexColor={0xc9a84c}
        label="MAIN ROOM"
        onEnter={onReturn}
      />
    </group>
  )
}
