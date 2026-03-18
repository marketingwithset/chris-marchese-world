'use client'

import { Sparkles } from '@react-three/drei'
import SubRoom from '../SubRoom'
import Hotspot from '../objects/Hotspot'
import NeonSign from '../objects/NeonSign'
import ImageFrame from '../objects/ImageFrame'
import InstagramEmbed from '../objects/InstagramEmbed'
import VideoScreen from '../objects/VideoScreen'
import PortalArchway from '../objects/PortalArchway'
import Lighting from '../Lighting'
import { ROOMS } from '@/lib/scene/rooms'
import type { LightingMode } from '@/types'

interface GrowthRoomProps {
  onHotspotClick: (contentId: string) => void
  onReturn: () => void
  lightingMode: LightingMode
}

export default function GrowthRoom({ onHotspotClick, onReturn, lightingMode }: GrowthRoomProps) {
  const config = ROOMS.growth

  return (
    <group>
      <SubRoom config={config} floorMaterial="floor_growth" wallMaterial="wall_growth" />
      <Lighting mode={lightingMode} />

      {/* Room accent lighting */}
      <pointLight position={[0, 6, 0]} color={0x5a9e6f} intensity={1.2} distance={25} />
      <pointLight position={[-10, 4, -5]} color={0x5a9e6f} intensity={0.6} distance={15} />
      <pointLight position={[10, 4, -5]} color={0x5a9e6f} intensity={0.6} distance={15} />
      <spotLight position={[0, 7, 0]} angle={0.6} penumbra={0.4} intensity={0.7} color={0xffffff} />

      {/* Room title */}
      <NeonSign text="SET MARKETING" position={[0, 6.5, -12.4]} fontSize={0.7} color="#5a9e6f" />
      <NeonSign text="GROWTH" position={[0, 5.5, -12.4]} fontSize={0.5} color="#f0ead8" />

      {/* === BACK WALL: Marketing Services === */}
      <group position={[0, 0, -11.5]}>
        <NeonSign text="SERVICES" position={[0, 4.5, 0]} fontSize={0.35} color="#5a9e6f" />

        {[
          { id: 'growth-svc-1', x: -5, label: 'Strategic Advisory' },
          { id: 'growth-svc-2', x: -1.7, label: 'Fractional CMO' },
          { id: 'growth-svc-3', x: 1.7, label: 'Creative & Brand' },
          { id: 'growth-svc-4', x: 5, label: 'BPO Solutions' },
        ].map((panel) => (
          <group key={panel.id} position={[panel.x, 0, 0]}>
            <ImageFrame
              position={[0, 2.5, 0.1]}
              width={2.5}
              height={2.8}
              label={panel.label}
              bgColor="#0a100a"
              textColor="#5a9e6f"
              borderColor={0x5a9e6f}
              onClick={() => onHotspotClick(panel.id)}
              interactable
              contentId={panel.id}
            />
          </group>
        ))}
      </group>

      {/* === LEFT WALL: Campaign Results === */}
      <group position={[-14, 0, 0]}>
        <NeonSign text="$500M+" position={[0.5, 6, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={1} color="#5a9e6f" />
        <NeonSign text="CLIENT REVENUE GENERATED" position={[0.5, 4.8, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.25} color="#f0ead8" />

        {/* Bar chart */}
        {[
          { z: -4, h: 2, label: 'Q1' },
          { z: -2, h: 3.2, label: 'Q2' },
          { z: 0, h: 2.5, label: 'Q3' },
          { z: 2, h: 4, label: 'Q4' },
          { z: 4, h: 3.5, label: 'Q5' },
        ].map((bar, i) => (
          <mesh key={i} position={[0.5, bar.h / 2, bar.z]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.8, bar.h, 0.3]} />
            <meshStandardMaterial color={0x2a6040 + i * 0x081008} metalness={0.2} roughness={0.6} />
          </mesh>
        ))}

        <NeonSign text="27% CPA REDUCTION" position={[0.5, 2, 7]} rotation={[0, Math.PI / 2, 0]} fontSize={0.3} color="#5a9e6f" />

        <Hotspot
          position={[1, 5, 0]}
          onClick={() => onHotspotClick('growth-results-1')}
          color={0x5a9e6f}
          size={0.3}
        />
      </group>

      {/* === RIGHT WALL: Client Testimonials === */}
      <group position={[14, 0, 0]}>
        <NeonSign text="TESTIMONIALS" position={[-0.5, 6, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.35} color="#5a9e6f" />

        {[
          { id: 'growth-test-1', z: -4, name: 'Mahmoud Elminawi' },
          { id: 'growth-test-2', z: 0, name: 'Sean Huley' },
          { id: 'growth-test-3', z: 4, name: 'George Pintilie' },
        ].map((test) => (
          <group key={test.id} position={[-0.5, 0, test.z]}>
            <ImageFrame
              position={[0, 3.5, 0]}
              rotation={[0, -Math.PI / 2, 0]}
              width={2.2}
              height={2.8}
              label={`"${test.name}"`}
              bgColor="#0a100a"
              textColor="#5a9e6f"
              borderColor={0x5a9e6f}
              onClick={() => onHotspotClick(test.id)}
              interactable
              contentId={test.id}
            />
          </group>
        ))}
      </group>

      {/* === FRONT LEFT: Social Media / Content === */}
      <group position={[-6, 0, 8]}>
        <NeonSign text="340K FOLLOWERS" position={[0, 5, 0]} fontSize={0.35} color="#5a9e6f" />

        {/* Instagram Embed */}
        <InstagramEmbed
          position={[0, 3, 0]}
          width={2.5}
          height={3.5}
          username="chrismarchese"
        />

        <Hotspot
          position={[0, 5.5, 0.5]}
          onClick={() => onHotspotClick('growth-social-1')}
          color={0x5a9e6f}
          size={0.25}
        />
      </group>

      {/* === FRONT RIGHT: Sales Academy + Promo Video === */}
      <group position={[6, 0, 8]}>
        <NeonSign text="2-3x ROI" position={[0, 5, 0]} fontSize={0.5} color="#5a9e6f" />
        <NeonSign text="SALES CONSULTING" position={[0, 4.2, 0]} fontSize={0.2} color="#f0ead8" />

        {/* Video reel */}
        <VideoScreen
          position={[0, 2.5, 0]}
          vimeoId="1173872281"
          width={3}
          height={1.7}
          label="SET Marketing Reel"
        />

        <Hotspot
          position={[0, 5.5, 0.5]}
          onClick={() => onHotspotClick('growth-sales-1')}
          color={0x5a9e6f}
          size={0.25}
        />
      </group>

      {/* Ambient sparkles */}
      <Sparkles count={40} scale={[25, 8, 20]} size={1} speed={0.3} color="#5a9e6f" />

      {/* 5.0 stars badge */}
      <NeonSign text="5.0 STARS — 29 REVIEWS" position={[0, 1, -11.4]} fontSize={0.2} color="#c9a84c" />

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
