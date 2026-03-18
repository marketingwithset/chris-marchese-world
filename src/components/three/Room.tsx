'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { ROOMS } from '@/lib/scene/rooms'
import { useMaterial } from '@/lib/materials/useMaterial'

export default function Room() {
  const { width, depth, height } = ROOMS.main
  const hw = width / 2
  const hd = depth / 2

  const floorMat = useMaterial('floor_concrete')
  const wallMat = useMaterial('wall_plaster')
  const ceilingMat = useMaterial('ceiling_dark')
  const goldMat = useMaterial('gold_brushed')
  const darkMetalMat = useMaterial('dark_metal')

  // Pillar positions
  const pillarPositions = useMemo(() => {
    const pillars: { x: number; z: number }[] = []
    for (let z = -hd + 5; z <= hd - 5; z += 8) {
      pillars.push({ x: -hw + 0.25, z })
      pillars.push({ x: hw - 0.25, z })
    }
    return pillars
  }, [hw, hd])

  // Ceiling light positions
  const lightPositions = useMemo(() => {
    const positions: [number, number][] = []
    for (let x = -hw + 5; x <= hw - 5; x += 8) {
      for (let z = -hd + 5; z <= hd - 5; z += 8) {
        positions.push([x, z])
      }
    }
    return positions
  }, [hw, hd])

  return (
    <group>
      {/* ===== FLOOR ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <primitive object={floorMat} attach="material" />
      </mesh>

      {/* Floor center medallion */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[3, 3.15, 64]} />
        <primitive object={goldMat} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[3, 64]} />
        <meshStandardMaterial color={0x0a0a0a} metalness={0.3} roughness={0.5} />
      </mesh>

      {/* ===== CEILING ===== */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
        <planeGeometry args={[width, depth]} />
        <primitive object={ceilingMat} attach="material" />
      </mesh>

      {/* Ceiling recessed light panels */}
      {lightPositions.map(([x, z], i) => (
        <group key={`light-${i}`} position={[x, height - 0.02, z]}>
          {/* Light panel surface */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.5, 2.5]} />
            <meshStandardMaterial
              color={0x111111}
              emissive={0xfff5e6}
              emissiveIntensity={0.12}
              metalness={0.1}
              roughness={0.8}
            />
          </mesh>
          {/* Actual point light */}
          <pointLight
            position={[0, -0.3, 0]}
            color={0xfff5e6}
            intensity={0.35}
            distance={7}
            decay={2}
          />
        </group>
      ))}

      {/* ===== WALLS ===== */}

      {/* Back wall */}
      <mesh position={[0, height / 2, -hd]}>
        <planeGeometry args={[width, height]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      {/* Back wall wainscoting */}
      <mesh position={[0, 1.5, -hd + 0.01]}>
        <planeGeometry args={[width, 3]} />
        <meshStandardMaterial color={0x151515} metalness={0.1} roughness={0.7} />
      </mesh>
      {/* Gold chair rail */}
      <mesh position={[0, 3.02, -hd + 0.02]}>
        <boxGeometry args={[width, 0.04, 0.03]} />
        <primitive object={goldMat} attach="material" />
      </mesh>

      {/* Front wall (gap for entrance) */}
      <mesh position={[-hw / 2 - 2.5, height / 2, hd]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[hw - 5, height]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      <mesh position={[hw / 2 + 2.5, height / 2, hd]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[hw - 5, height]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      {/* Entrance top */}
      <mesh position={[0, height - 1, hd]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[10, 2]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* Left wall */}
      <mesh position={[-hw, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[depth, height]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      {/* Left wall wainscoting */}
      <mesh position={[-hw + 0.01, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[depth, 3]} />
        <meshStandardMaterial color={0x151515} metalness={0.1} roughness={0.7} />
      </mesh>
      {/* Gold chair rail */}
      <mesh position={[-hw + 0.02, 3.02, 0]}>
        <boxGeometry args={[0.03, 0.04, depth]} />
        <primitive object={goldMat} attach="material" />
      </mesh>

      {/* Right wall */}
      <mesh position={[hw, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[depth, height]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      {/* Right wall wainscoting */}
      <mesh position={[hw - 0.01, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[depth, 3]} />
        <meshStandardMaterial color={0x151515} metalness={0.1} roughness={0.7} />
      </mesh>
      {/* Gold chair rail */}
      <mesh position={[hw - 0.02, 3.02, 0]}>
        <boxGeometry args={[0.03, 0.04, depth]} />
        <primitive object={goldMat} attach="material" />
      </mesh>

      {/* ===== BASEBOARDS ===== */}
      <mesh position={[0, 0.1, -hd + 0.05]}>
        <boxGeometry args={[width, 0.2, 0.1]} />
        <meshStandardMaterial color={0x111111} metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[-hw + 0.05, 0.1, 0]}>
        <boxGeometry args={[0.1, 0.2, depth]} />
        <meshStandardMaterial color={0x111111} metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[hw - 0.05, 0.1, 0]}>
        <boxGeometry args={[0.1, 0.2, depth]} />
        <meshStandardMaterial color={0x111111} metalness={0.2} roughness={0.6} />
      </mesh>

      {/* ===== CROWN MOLDING ===== */}
      <mesh position={[0, height - 0.1, -hd + 0.05]}>
        <boxGeometry args={[width, 0.12, 0.1]} />
        <meshStandardMaterial color={0x1a1a1a} metalness={0.15} roughness={0.6} />
      </mesh>
      <mesh position={[-hw + 0.05, height - 0.1, 0]}>
        <boxGeometry args={[0.1, 0.12, depth]} />
        <meshStandardMaterial color={0x1a1a1a} metalness={0.15} roughness={0.6} />
      </mesh>
      <mesh position={[hw - 0.05, height - 0.1, 0]}>
        <boxGeometry args={[0.1, 0.12, depth]} />
        <meshStandardMaterial color={0x1a1a1a} metalness={0.15} roughness={0.6} />
      </mesh>

      {/* ===== WALL PILLARS WITH GOLD TRIM ===== */}
      {pillarPositions.map((p, i) => (
        <group key={`pillar-${i}`} position={[p.x, 0, p.z]}>
          {/* Pillar body */}
          <mesh position={[0, height / 2, 0]}>
            <boxGeometry args={[0.4, height, 0.4]} />
            <primitive object={darkMetalMat} attach="material" />
          </mesh>
          {/* Base cap */}
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.6, 0.24, 0.6]} />
            <meshStandardMaterial color={0x141414} metalness={0.2} roughness={0.5} />
          </mesh>
          {/* Top cap */}
          <mesh position={[0, height - 0.12, 0]}>
            <boxGeometry args={[0.6, 0.24, 0.6]} />
            <meshStandardMaterial color={0x141414} metalness={0.2} roughness={0.5} />
          </mesh>
          {/* Gold trim ring at mid-height */}
          <mesh position={[0, 3, 0]}>
            <boxGeometry args={[0.45, 0.05, 0.45]} />
            <primitive object={goldMat} attach="material" />
          </mesh>
        </group>
      ))}

      {/* ===== ENTRANCE FRAME ===== */}
      {/* Left column */}
      <mesh position={[-5, height / 2, hd - 0.15]}>
        <boxGeometry args={[0.3, height, 0.3]} />
        <primitive object={darkMetalMat} attach="material" />
      </mesh>
      {/* Right column */}
      <mesh position={[5, height / 2, hd - 0.15]}>
        <boxGeometry args={[0.3, height, 0.3]} />
        <primitive object={darkMetalMat} attach="material" />
      </mesh>
      {/* Top beam */}
      <mesh position={[0, height - 1, hd - 0.15]}>
        <boxGeometry args={[10.3, 0.3, 0.3]} />
        <primitive object={darkMetalMat} attach="material" />
      </mesh>
      {/* Gold trim on entrance */}
      <mesh position={[0, height - 0.85, hd - 0.05]}>
        <boxGeometry args={[10.3, 0.03, 0.03]} />
        <primitive object={goldMat} attach="material" />
      </mesh>

      {/* ===== FLOOR ACCENT LIGHTING ===== */}
      {/* Subtle up-lights along the back wall */}
      {[-12, -6, 0, 6, 12].map((x, i) => (
        <pointLight
          key={`floor-up-${i}`}
          position={[x, 0.15, -hd + 0.5]}
          color={0xc9a84c}
          intensity={0.06}
          distance={3}
          decay={2}
        />
      ))}

      {/* ===== FLOOR GRID ===== */}
      <gridHelper
        args={[Math.max(width, depth), 40, 0x1a1a1a, 0x0d0d0d]}
        position={[0, 0.003, 0]}
      />
    </group>
  )
}
