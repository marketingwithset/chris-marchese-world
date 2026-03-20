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

      {/* === BACK WALL: Capital Raise Advisory — 4-Stage Pipeline === */}
      <group position={[0, 0, -11]}>
        <NeonSign text="CAPITAL RAISE ADVISORY" position={[0, 6, 0]} fontSize={0.35} color="#4a7fa5" />
        <NeonSign text="Raise Capital from a Position of Strength" position={[0, 5.2, 0]} fontSize={0.18} color="#8ab4d4" />

        {/* 4-Stage pipeline */}
        {[
          { label: '01 · SITUATIONAL REVIEW', width: 9, color: 0x1a3050, y: 4.2 },
          { label: '02 · STRATEGY & SCOPE', width: 7.5, color: 0x1a4060, y: 3.3 },
          { label: '03 · BUILD MATERIALS', width: 6, color: 0x2a5070, y: 2.4 },
          { label: '04 · GO TO MARKET', width: 4.5, color: 0x3a6080, y: 1.5 },
        ].map((stage, i) => (
          <group key={i}>
            <mesh position={[0, stage.y, 0.1]}>
              <boxGeometry args={[stage.width, 0.65, 0.1]} />
              <meshStandardMaterial color={stage.color} metalness={0.3} roughness={0.5} />
            </mesh>
            {/* Stage label (using a small neon sign) */}
            <NeonSign
              text={stage.label}
              position={[0, stage.y, 0.2]}
              fontSize={0.13}
              color="#a0c4e0"
            />
          </group>
        ))}

        <Hotspot
          position={[0, 5.5, 0.5]}
          onClick={() => onHotspotClick('cap-deals-1')}
          color={0x4a7fa5}
          size={0.3}
        />
      </group>

      {/* === LEFT WALL: Advisory Packages === */}
      <group position={[-14, 0, 0]}>
        <NeonSign text="ADVISORY PACKAGES" position={[0.5, 7, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.35} color="#4a7fa5" />

        {/* Package panels */}
        {[
          { id: 'cap-svc-1', title: 'Digital Capital Launch', subtitle: '$12,500', z: -3.5 },
          { id: 'cap-svc-2', title: 'Hybrid Media Capital', subtitle: '$15,000', z: 0 },
          { id: 'cap-svc-3', title: 'Premium Activation', subtitle: '$20,000', z: 3.5 },
        ].map((panel) => (
          <group key={panel.id} position={[0.5, 0, panel.z]}>
            <ImageFrame
              position={[0, 4, 0]}
              rotation={[0, Math.PI / 2, 0]}
              width={2.5}
              height={3.2}
              label={panel.title}
              bgColor="#0a1520"
              textColor="#4a7fa5"
              borderColor={0x4a7fa5}
              onClick={() => onHotspotClick(panel.id)}
              interactable
              contentId={panel.id}
            />
            <NeonSign
              text={panel.subtitle}
              position={[0.18, 2, panel.z > 0 ? -0.0 : 0]}
              rotation={[0, Math.PI / 2, 0]}
              fontSize={0.18}
              color="#c9a84c"
            />
          </group>
        ))}

        {/* Investor origination note */}
        <NeonSign
          text="+ $2,000 Investor Origination Fee"
          position={[0.5, 1.2, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.12}
          color="#8a7233"
        />
      </group>

      {/* === RIGHT WALL: Commercial Bridge Lending === */}
      <group position={[14, 0, 0]}>
        <NeonSign text="BRIDGE LENDING" position={[-0.5, 7, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.4} color="#4a7fa5" />
        <NeonSign text="$2MM – $25MM+" position={[-0.5, 6.2, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.22} color="#c9a84c" />

        {/* Loan terms display — stacked info panels */}
        {[
          { label: 'RATES', value: '9.50% – 12.50%', y: 5.2 },
          { label: 'CLOSING', value: '2–4 Weeks', y: 4.4 },
          { label: 'MAX LTV', value: '65%', y: 3.6 },
          { label: 'MATURITY', value: 'Up to 2 Years', y: 2.8 },
          { label: 'LIEN', value: '1st Position', y: 2.0 },
          { label: 'RECOURSE', value: 'Non-Recourse (Case-by-Case)', y: 1.2 },
        ].map((term, i) => (
          <group key={i}>
            {/* Background bar */}
            <mesh position={[-0.5, term.y, 0]}>
              <boxGeometry args={[0.12, 0.5, 5]} />
              <meshStandardMaterial color={i % 2 === 0 ? 0x0a1520 : 0x0e1a28} metalness={0.2} roughness={0.6} />
            </mesh>
            <NeonSign
              text={`${term.label}: ${term.value}`}
              position={[-0.6, term.y, 0]}
              rotation={[0, -Math.PI / 2, 0]}
              fontSize={0.12}
              color={i === 0 ? '#c9a84c' : '#a0c4e0'}
            />
          </group>
        ))}

        {/* Markets badge */}
        <NeonSign
          text="Nationwide Urban & Suburban Markets"
          position={[-0.6, 0.5, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.1}
          color="#8a7233"
        />

        <Hotspot
          position={[-0.8, 4, 0]}
          onClick={() => onHotspotClick('cap-bridge-1')}
          color={0x4a7fa5}
          size={0.3}
        />
      </group>

      {/* === CENTER: Vault table with gold bars === */}
      <group position={[0, 0, 0]}>
        {/* Table base */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[3, 1, 2]} />
          <primitive object={darkMetalMat} attach="material" />
        </mesh>
        {/* Table edge trim */}
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

        {/* Founders hotspot on table */}
        <Hotspot
          position={[0, 1.5, 0]}
          onClick={() => onHotspotClick('cap-founders-1')}
          color={0xc9a84c}
          size={0.25}
        />
      </group>

      {/* Founders nameplates flanking the table */}
      <NeonSign text="CHRIS MARCHESE" position={[-2.5, 2, 0]} fontSize={0.12} color="#c9a84c" />
      <NeonSign text="Founder & Advisor" position={[-2.5, 1.7, 0]} fontSize={0.08} color="#8ab4d4" />
      <NeonSign text="TYLER FERGUSON" position={[2.5, 2, 0]} fontSize={0.12} color="#c9a84c" />
      <NeonSign text="Founder & Advisor" position={[2.5, 1.7, 0]} fontSize={0.08} color="#8ab4d4" />

      {/* Services tagline near floor */}
      <NeonSign
        text="Structured Capital for Value-Add & Transitional Assets"
        position={[0, 0.3, -5]}
        fontSize={0.15}
        color="#4a7fa5"
      />

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
