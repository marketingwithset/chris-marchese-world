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
  const dirRef = useRef<THREE.DirectionalLight>(null)
  const neonGoldRef = useRef<THREE.PointLight>(null)
  const neonBlueRef = useRef<THREE.PointLight>(null)
  const neonGreenRef = useRef<THREE.PointLight>(null)
  const neonRedRef = useRef<THREE.PointLight>(null)

  useFrame(() => {
    const isDay = mode === 'day'
    const targetAmbient = isDay ? 0.5 : 0.1
    const targetDir = isDay ? 0.8 : 0.1
    const targetNeon = isDay ? 0.3 : 2.0
    const lerp = 0.05

    if (ambientRef.current) {
      ambientRef.current.intensity += (targetAmbient - ambientRef.current.intensity) * lerp
    }
    if (dirRef.current) {
      dirRef.current.intensity += (targetDir - dirRef.current.intensity) * lerp
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
      {/* Ambient fill */}
      <ambientLight ref={ambientRef} intensity={0.5} color={0xfff5e6} />

      {/* Main directional (gallery overhead) */}
      <directionalLight
        ref={dirRef}
        position={[5, 7, 3]}
        intensity={0.8}
        color={0xfff5e6}
        castShadow
      />

      {/* Zone accent lights */}
      <pointLight ref={neonGoldRef} position={[0, 5, -13]} color={0xc9a84c} intensity={0.3} distance={20} />
      <pointLight ref={neonBlueRef} position={[-14, 4, -3]} color={0x4a7fa5} intensity={0.3} distance={15} />
      <pointLight ref={neonGreenRef} position={[14, 3, 8]} color={0x27ae60} intensity={0.3} distance={12} />
      <pointLight ref={neonRedRef} position={[-14, 3, 8]} color={0xc0392b} intensity={0.3} distance={12} />

      {/* Fashion runway spotlight */}
      <spotLight
        position={[14, 7, -3]}
        target-position={[14, 0, -3]}
        angle={0.4}
        penumbra={0.5}
        intensity={0.5}
        color={0xffffff}
      />

      {/* Automotive platform spotlight */}
      <spotLight
        position={[0, 7, 8]}
        target-position={[0, 0, 8]}
        angle={0.5}
        penumbra={0.3}
        intensity={0.6}
        color={0xffffff}
      />
    </>
  )
}
