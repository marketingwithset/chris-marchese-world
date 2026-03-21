'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMaterial } from '@/lib/materials/useMaterial'

/**
 * Towering 12-unit kinetic sculpture at warehouse center.
 * Three nested rotating geometric forms on a marble platform
 * with upward spotlights and orbiting emissive particles.
 */
export default function CentralSculpture() {
  const goldMat = useMaterial('gold_brushed')
  const darkMetalMat = useMaterial('dark_metal')
  const marbleMat = useMaterial('floor_marble')

  const baseRef = useRef<THREE.Group>(null)
  const midRef = useRef<THREE.Group>(null)
  const topRef = useRef<THREE.Group>(null)
  const peakRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Group>(null)
  const lightsRef = useRef<THREE.Group>(null)

  // Emissive gold material for the peak sphere
  const peakMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      emissive: 0xc9a84c,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1,
    }),
    []
  )

  // Particle material
  const particleMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      emissive: 0xc9a84c,
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.7,
    }),
    []
  )

  // Ring accent material
  const ringMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      emissive: 0xc9a84c,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2,
    }),
    []
  )

  // Pre-generate particle orbits
  const particles = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      radius: 3 + Math.random() * 4,
      height: 2 + Math.random() * 9,
      speed: 0.2 + Math.random() * 0.4,
      phase: (Math.PI * 2 * i) / 10,
      size: 0.08 + Math.random() * 0.12,
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Rotate sculpture elements
    if (baseRef.current) baseRef.current.rotation.y = t * 0.1
    if (midRef.current) {
      midRef.current.rotation.y = t * -0.15
      midRef.current.rotation.x = Math.sin(t * 0.05) * 0.1
    }
    if (topRef.current) topRef.current.rotation.y = t * 0.2

    // Floating bob for peak sphere
    if (peakRef.current) {
      peakRef.current.position.y = 11.5 + Math.sin(t * 0.8) * 0.3
    }

    // Orbit particles
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, i) => {
        const p = particles[i]
        const angle = t * p.speed + p.phase
        child.position.x = Math.cos(angle) * p.radius
        child.position.z = Math.sin(angle) * p.radius
        child.position.y = p.height + Math.sin(t * 1.5 + p.phase) * 0.5
      })
    }

    // Pulse spotlight intensities
    if (lightsRef.current) {
      lightsRef.current.children.forEach((light, i) => {
        if (light instanceof THREE.SpotLight) {
          light.intensity = 2 + Math.sin(t * 0.5 + (i * Math.PI * 2) / 3) * 0.8
        }
      })
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Marble platform */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[6, 6.2, 0.3, 48]} />
        <primitive object={marbleMat} attach="material" />
      </mesh>

      {/* Gold emissive ring around platform */}
      <mesh position={[0, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.8, 6.1, 64]} />
        <primitive object={ringMat} attach="material" />
      </mesh>

      {/* Second accent ring */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.3, 6.6, 64]} />
        <primitive object={ringMat} attach="material" />
      </mesh>

      {/* BASE — Large Dodecahedron */}
      <group ref={baseRef} position={[0, 2.5, 0]}>
        <mesh>
          <dodecahedronGeometry args={[2.5, 0]} />
          <primitive object={goldMat} attach="material" />
        </mesh>
      </group>

      {/* MIDDLE — Octahedron */}
      <group ref={midRef} position={[0, 6.5, 0]}>
        <mesh>
          <octahedronGeometry args={[1.8, 0]} />
          <primitive object={darkMetalMat} attach="material" />
        </mesh>
      </group>

      {/* TOP — Icosahedron */}
      <group ref={topRef} position={[0, 9.5, 0]}>
        <mesh>
          <icosahedronGeometry args={[1.2, 0]} />
          <primitive object={goldMat} attach="material" />
        </mesh>
      </group>

      {/* PEAK — Emissive floating sphere */}
      <mesh ref={peakRef} position={[0, 11.5, 0]}>
        <sphereGeometry args={[0.6, 24, 24]} />
        <primitive object={peakMat} attach="material" />
      </mesh>

      {/* Orbiting particles */}
      <group ref={particlesRef}>
        {particles.map((p, i) => (
          <mesh key={i} position={[p.radius, p.height, 0]}>
            <sphereGeometry args={[p.size, 8, 8]} />
            <primitive object={particleMat} attach="material" />
          </mesh>
        ))}
      </group>

      {/* Upward spotlights (120° apart) */}
      <group ref={lightsRef}>
        {[0, 120, 240].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          const x = Math.cos(rad) * 4
          const z = Math.sin(rad) * 4
          return (
            <spotLight
              key={i}
              position={[x, 0.5, z]}
              target-position={[0, 15, 0]}
              angle={0.4}
              penumbra={0.8}
              intensity={2.5}
              color={0xc9a84c}
              distance={20}
            />
          )
        })}
      </group>
    </group>
  )
}
