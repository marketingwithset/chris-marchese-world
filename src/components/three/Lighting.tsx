'use client'

import type { LightingMode } from '@/types'

interface LightingProps {
  mode: LightingMode
}

export default function Lighting({ mode: _mode }: LightingProps) {
  return (
    <>
      {/* Ambient fill — warm tone so surfaces are never pure black */}
      <ambientLight intensity={0.8} color={0xfff5e6} />

      {/* Hemisphere light — simulates sky/ground bounce */}
      <hemisphereLight
        color={0xfff5e6}
        groundColor={0x1a1510}
        intensity={0.6}
      />

      {/* Main directional — overhead key light (only shadow-caster) */}
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.2}
        color={0xfff5e6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Fill light from opposite side */}
      <directionalLight
        position={[-8, 6, -5]}
        intensity={0.5}
        color={0xf0e8d8}
      />

      {/* Gallery track light — single wide spot covers the art wall */}
      <spotLight
        position={[0, 7.5, -8]}
        target-position={[0, 3, -14]}
        angle={0.8}
        penumbra={0.6}
        intensity={1.5}
        color={0xfff8f0}
      />

      {/* Fashion runway spotlight */}
      <spotLight
        position={[14, 7, -3]}
        target-position={[14, 0, -3]}
        angle={0.5}
        penumbra={0.5}
        intensity={0.9}
        color={0xffffff}
      />

      {/* Automotive platform spotlight */}
      <spotLight
        position={[0, 7, 8]}
        target-position={[0, 0, 8]}
        angle={0.5}
        penumbra={0.3}
        intensity={1.0}
        color={0xffffff}
      />

      {/* Center room ambient — prevents dark center */}
      <pointLight
        position={[0, 6, 0]}
        color={0xfff5e6}
        intensity={0.6}
        distance={20}
        decay={2}
      />
    </>
  )
}
