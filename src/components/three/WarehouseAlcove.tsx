'use client'

import { useMemo } from 'react'
import NeonSign from './objects/NeonSign'
import * as THREE from 'three'

interface WarehouseAlcoveProps {
  position: [number, number, number]
  /** Y-axis rotation so the open entrance faces center */
  rotation: number
  width: number
  depth: number
  height: number
  accentColor: string
  accentHex: number
  label: string
  children: React.ReactNode
}

/**
 * Reusable open alcove (3 walls, open entrance facing center).
 * Used for each content section branching off the main warehouse atrium.
 */
export default function WarehouseAlcove({
  position,
  rotation,
  width,
  depth,
  height,
  accentColor,
  accentHex,
  label,
  children,
}: WarehouseAlcoveProps) {
  const hw = width / 2

  const wallMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x0e0e0e, roughness: 0.85, metalness: 0.1 }),
    []
  )
  const floorMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.7, metalness: 0.05 }),
    []
  )
  const accentMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: accentHex,
      emissive: accentHex,
      emissiveIntensity: 0.4,
      metalness: 0.6,
      roughness: 0.3,
    }),
    [accentHex]
  )

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Back wall */}
      <mesh position={[0, height / 2, -depth]}>
        <planeGeometry args={[width, height]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* Left wall */}
      <mesh position={[-hw, height / 2, -depth / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[depth, height]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* Right wall */}
      <mesh position={[hw, height / 2, -depth / 2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[depth, height]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* Floor section */}
      <mesh position={[0, 0.01, -depth / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <primitive object={floorMat} attach="material" />
      </mesh>

      {/* Entrance archway frame — two vertical bars + horizontal lintel */}
      <mesh position={[-hw + 0.15, height / 2, 0]}>
        <boxGeometry args={[0.3, height, 0.3]} />
        <primitive object={accentMat} attach="material" />
      </mesh>
      <mesh position={[hw - 0.15, height / 2, 0]}>
        <boxGeometry args={[0.3, height, 0.3]} />
        <primitive object={accentMat} attach="material" />
      </mesh>
      <mesh position={[0, height - 0.15, 0]}>
        <boxGeometry args={[width, 0.3, 0.3]} />
        <primitive object={accentMat} attach="material" />
      </mesh>

      {/* Label above entrance */}
      <NeonSign
        text={label}
        position={[0, height + 0.8, 0.5]}
        fontSize={0.5}
        color={accentColor}
      />

      {/* Interior accent light strip on ceiling */}
      <mesh position={[0, height - 0.05, -depth / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * 0.6, depth * 0.1]} />
        <meshStandardMaterial
          color={accentHex}
          emissive={accentHex}
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Floor accent strip (corridor guide) */}
      <mesh position={[0, 0.02, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.4, 8]} />
        <meshStandardMaterial
          color={accentHex}
          emissive={accentHex}
          emissiveIntensity={0.6}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Interior point light */}
      <pointLight
        position={[0, height - 1, -depth / 2]}
        color={accentHex}
        intensity={0.6}
        distance={depth * 1.5}
      />

      {/* Content goes here */}
      {children}
    </group>
  )
}
