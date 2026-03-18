'use client'

import type { LightingMode } from '@/types'

interface LightingProps {
  mode: LightingMode
}

export default function Lighting({ mode: _mode }: LightingProps) {
  return (
    <>
      {/* Ambient fill \u2014 warm tone so surfaces are never pure black */}
      <ambientLight intensity={0.7} color={0xfff5e6} />

      {/* Hemisphere light \u2014 simulates sky/ground bounce */}
      <hemisphereLight
        color={0xfff5e6}
        groundColor={0x1a1510}
        intensity={0.6}
      />

      {/* Main directional \u2014 overhead key light */}
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.2}
        color={0xfff5e6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Fill light from opposite side */}
      <directionalLight
        position={[-8, 6, -5]}
        intensity={0.5}
        color={0xf0e8d8}
      />

      {/* Zone accent lights */}
      <pointLight position={[0, 5, -13]} color={0xc9a84c} intensity={0.8} distance={25} decay={2} />
      <pointLight position={[-14, 4, -3]} color={0x4a7fa5} intensity={0.8} distance={18} decay={2} />
      <pointLight position={[14, 3, 8]} color={0x27ae60} intensity={0.8} distance={15} decay={2} />
      <pointLight position={[-14, 3, 8]} color={0xc0392b} intensity={0.8} distance={15} decay={2} />

      {/* Gallery overhead track lights \u2014 illuminate the back wall art */}
      <spotLight
        position={[0, 7.5, -10]}
        target-position={[0, 3, -14]}
        angle={0.5}
        penumbra={0.6}
        intensity={1.0}
        color={0xfff8f0}
        castShadow
      />
      <spotLight
        position={[-10, 7.5, -10]}
        target-position={[-10, 3, -14]}
        angle={0.5}
        penumbra={0.6}
        intensity={0.8}
        color={0xfff8f0}
      />
      <spotLight
        position={[10, 7.5, -10]}
        target-position={[10, 3, -14]}
        angle={0.5}
        penumbra={0.6}
        intensity={0.8}
        color={0xfff8f0}
      />

      {/* Fashion runway spotlight */}
      <spotLight
        position={[14, 7, -3]}
        target-position={[14, 0, -3]}
        angle={0.4}
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

      {/* Film studio area light */}
      <spotLight
        position={[-14, 7, -3]}
        target-position={[-14, 2, -3]}
        angle={0.6}
        penumbra={0.5}
        intensity={0.7}
        color={0x4a7fa5}
      />

      {/* Center room ambient \u2014 prevents dark center */}
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
