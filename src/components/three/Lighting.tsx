'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { LightingMode } from '@/types'

interface LightingProps {
  mode: LightingMode
}

export default function Lighting({ mode }: LightingProps) {
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const hemiRef = useRef<THREE.HemisphereLight>(null)
  const dirRef = useRef<THREE.DirectionalLight>(null)
  const fillRef = useRef<THREE.DirectionalLight>(null)
  const neonGoldRef = useRef<THREE.PointLight>(null)
  const neonBlueRef = useRef<THREE.PointLight>(null)
  const neonGreenRef = useRef<THREE.PointLight>(null)
  const neonRedRef = useRef<THREE.PointLight>(null)

  useFrame(() => {
    const isDay = mode === 'day'
    const lerp = 0.05

    // Day: bright gallery lighting. Night: dimmer mood lighting (still visible)
    const targetAmbient = isDay ? 0.6 : 0.4
    const targetHemi = isDay ? 0.5 : 0.35
    const targetDir = isDay ? 1.0 : 0.5
    const targetFill = isDay ? 0.4 : 0.25
    const targetNeon = isDay ? 0.5 : 1.8

    if (ambientRef.current) {
      ambientRef.current.intensity += (targetAmbient - ambientRef.current.intensity) * lerp
    }
    if (hemiRef.current) {
      hemiRef.current.intensity += (targetHemi - hemiRef.current.intensity) * lerp
    }
    if (dirRef.current) {
      dirRef.current.intensity += (targetDir - dirRef.current.intensity) * lerp
    }
    if (fillRef.current) {
      fillRef.current.intensity += (targetFill - fillRef.current.intensity) * lerp
    }

    const neons = [neonGoldRef, neonBlueRef, neonGreenRef, neonRedRef]
    for (const ref of neons) {
      if (ref.current) {
        ref.current.intensity += (targetNeon - ref.current.intensity) * lerp
      }
    }
  })

  return (
    <>
      {/* Ambient fill — warm tone so surfaces are never pure black */}
      <ambientLight ref={ambientRef} intensity={0.25} color={0xfff5e6} />

      {/* Hemisphere light — simulates sky/ground bounce */}
      <hemisphereLight
        ref={hemiRef}
        color={0xfff5e6}
        groundColor={0x1a1510}
        intensity={0.2}
      />

      {/* Main directional — overhead key light */}
      <directionalLight
        ref={dirRef}
        position={[5, 8, 3]}
        intensity={0.3}
        color={0xfff5e6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Fill light from opposite side */}
      <directionalLight
        ref={fillRef}
        position={[-8, 6, -5]}
        intensity={0.15}
        color={0xf0e8d8}
      />

      {/* Zone accent lights — brighter for night mode to create dramatic pools */}
      <pointLight ref={neonGoldRef} position={[0, 5, -13]} color={0xc9a84c} intensity={0.5} distance={25} decay={2} />
      <pointLight ref={neonBlueRef} position={[-14, 4, -3]} color={0x4a7fa5} intensity={0.5} distance={18} decay={2} />
      <pointLight ref={neonGreenRef} position={[14, 3, 8]} color={0x27ae60} intensity={0.5} distance={15} decay={2} />
      <pointLight ref={neonRedRef} position={[-14, 3, 8]} color={0xc0392b} intensity={0.5} distance={15} decay={2} />

      {/* Gallery overhead track lights — illuminate the back wall art */}
      <spotLight
        position={[0, 7.5, -10]}
        target-position={[0, 3, -14]}
        angle={0.5}
        penumbra={0.6}
        intensity={0.8}
        color={0xfff8f0}
        castShadow
      />
      <spotLight
        position={[-10, 7.5, -10]}
        target-position={[-10, 3, -14]}
        angle={0.5}
        penumbra={0.6}
        intensity={0.6}
        color={0xfff8f0}
      />
      <spotLight
        position={[10, 7.5, -10]}
        target-position={[10, 3, -14]}
        angle={0.5}
        penumbra={0.6}
        intensity={0.6}
        color={0xfff8f0}
      />

      {/* Fashion runway spotlight */}
      <spotLight
        position={[14, 7, -3]}
        target-position={[14, 0, -3]}
        angle={0.4}
        penumbra={0.5}
        intensity={0.7}
        color={0xffffff}
      />

      {/* Automotive platform spotlight */}
      <spotLight
        position={[0, 7, 8]}
        target-position={[0, 0, 8]}
        angle={0.5}
        penumbra={0.3}
        intensity={0.8}
        color={0xffffff}
      />

      {/* Film studio area light */}
      <spotLight
        position={[-14, 7, -3]}
        target-position={[-14, 2, -3]}
        angle={0.6}
        penumbra={0.5}
        intensity={0.5}
        color={0x4a7fa5}
      />

      {/* Center room ambient — prevents dark center */}
      <pointLight
        position={[0, 6, 0]}
        color={0xfff5e6}
        intensity={0.4}
        distance={20}
        decay={2}
      />
    </>
  )
}
