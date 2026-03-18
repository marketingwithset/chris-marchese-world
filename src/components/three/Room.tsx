'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { ROOM } from '@/lib/constants'
import { useMaterial } from '@/lib/materials/useMaterial'

export default function Room() {
  const { width, depth, height } = ROOM
  const hw = width / 2
  const hd = depth / 2

  const floorMat = useMaterial('floor_concrete')
  const wallMat = useMaterial('wall_plaster')
  const ceilingMat = useMaterial('ceiling_dark')
  const goldMat = useMaterial('gold_brushed')
  const darkMetalMat = useMaterial('dark_metal')

  // Ceiling recess geometry for light panels
  const recessPositions = useMemo(() => {
    const positions: [number, number][] = []
    for (let x = -hw + 5; x <= hw - 5; x += 10) {
      for (let z = -hd + 5; z <= hd - 5; z += 10) {
        positions.push([x, z])
      }
    }
    return positions
  }, [hw, hd])

  // Pillar positions along walls
  const pillarPositions = useMemo(() => {
    const pillars: { x: number; z: number; rotation: number }[] = []
    // Left wall pillars
    for (let z = -hd + 5; z <= hd - 5; z += 7) {
      pillars.push({ x: -hw + 0.25, z, rotation: 0 })
    }
    // Right wall pillars
    for (let z = -hd + 5; z <= hd - 5; z += 7) {
      pillars.push({ x: hw - 0.25, z, rotation: 0 })
    }
    // Back wall pillars
    for (let x = -hw + 6; x <= hw - 6; x += 8) {
      pillars.push({ x, z: -hd + 0.25, rotation: Math.PI / 2 })
    }
    return pillars
  }, [hw, hd])

  return (
    <group>
      {/* ===== FLOOR ===== */}
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <primitive object={floorMat} attach="material" />
      </mesh>

      {/* Floor border / inlay — gold trim around the perimeter */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[Math.min(hw, hd) - 2, Math.min(hw, hd) - 1.8, 4]} />
        <meshStandardMaterial color={0x2a2218} metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Center floor medallion */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial color={0x1a1610} metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.007, 0]}>
        <ringGeometry args={[2.8, 3, 32]} />
        <meshStandardMaterial color={0xc9a84c} metalness={0.7} roughness={0.2} opacity={0.3} transparent />
      </mesh>

      {/* ===== CEILING ===== */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
        <planeGeometry args={[width, depth]} />
        <primitive object={ceilingMat} attach="material" />
      </mesh>

      {/* Ceiling recessed light panels */}
      {recessPositions.map(([x, z], i) => (
        <group key={`recess-${i}`} position={[x, height - 0.02, z]}>
          {/* Light panel (slightly recessed, emissive) */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3, 3]} />
            <meshStandardMaterial
              color={0x111111}
              emissive={0xfff5e6}
              emissiveIntensity={0.15}
              metalness={0.1}
              roughness={0.8}
            />
          </mesh>
          {/* Rim around panel */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.01]}>
            <ringGeometry args={[1.4, 1.5, 4]} />
            <meshStandardMaterial color={0x1a1a1a} metalness={0.3} roughness={0.5} />
          </mesh>
          {/* Actual light */}
          <pointLight
            position={[0, -0.3, 0]}
            color={0xfff5e6}
            intensity={0.4}
            distance={8}
            decay={2}
          />
        </group>
      ))}

      {/* ===== WALLS ===== */}

      {/* Back wall — main surface */}
      <mesh position={[0, height / 2, -hd]}>
        <planeGeometry args={[width, height]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      {/* Back wall — wainscoting (lower panel) */}
      <mesh position={[0, 1.5, -hd + 0.01]}>
        <planeGeometry args={[width, 3]} />
        <meshStandardMaterial color={0x151515} metalness={0.1} roughness={0.7} />
      </mesh>
      {/* Back wall — chair rail (gold strip) */}
      <mesh position={[0, 3, -hd + 0.02]}>
        <boxGeometry args={[width, 0.06, 0.04]} />
        <primitive object={goldMat} attach="material" />
      </mesh>

      {/* Front wall — left segment */}
      <mesh position={[-hw / 2 - 2.5, height / 2, hd]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[hw - 5, height]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      {/* Front wall — right segment */}
      <mesh position={[hw / 2 + 2.5, height / 2, hd]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[hw - 5, height]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      {/* Front wall — entrance arch top */}
      <mesh position={[0, height - 1, hd]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[10, 2]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* Left wall */}
      <mesh position={[-hw, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[depth, height]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      {/* Left wall — wainscoting */}
      <mesh position={[-hw + 0.01, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[depth, 3]} />
        <meshStandardMaterial color={0x151515} metalness={0.1} roughness={0.7} />
      </mesh>
      {/* Left wall — chair rail */}
      <mesh position={[-hw + 0.02, 3, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.04, 0.06, depth]} />
        <primitive object={goldMat} attach="material" />
      </mesh>

      {/* Right wall */}
      <mesh position={[hw, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[depth, height]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      {/* Right wall — wainscoting */}
      <mesh position={[hw - 0.01, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[depth, 3]} />
        <meshStandardMaterial color={0x151515} metalness={0.1} roughness={0.7} />
      </mesh>
      {/* Right wall — chair rail */}
      <mesh position={[hw - 0.02, 3, 0]}>
        <boxGeometry args={[0.04, 0.06, depth]} />
        <primitive object={goldMat} attach="material" />
      </mesh>

      {/* ===== BASEBOARDS ===== */}
      {/* Back */}
      <mesh position={[0, 0.1, -hd + 0.05]}>
        <boxGeometry args={[width, 0.2, 0.1]} />
        <meshStandardMaterial color={0x111111} metalness={0.2} roughness={0.6} />
      </mesh>
      {/* Left */}
      <mesh position={[-hw + 0.05, 0.1, 0]}>
        <boxGeometry args={[0.1, 0.2, depth]} />
        <meshStandardMaterial color={0x111111} metalness={0.2} roughness={0.6} />
      </mesh>
      {/* Right */}
      <mesh position={[hw - 0.05, 0.1, 0]}>
        <boxGeometry args={[0.1, 0.2, depth]} />
        <meshStandardMaterial color={0x111111} metalness={0.2} roughness={0.6} />
      </mesh>
      {/* Front left */}
      <mesh position={[-hw / 2 - 2.5, 0.1, hd - 0.05]}>
        <boxGeometry args={[hw - 5, 0.2, 0.1]} />
        <meshStandardMaterial color={0x111111} metalness={0.2} roughness={0.6} />
      </mesh>
      {/* Front right */}
      <mesh position={[hw / 2 + 2.5, 0.1, hd - 0.05]}>
        <boxGeometry args={[hw - 5, 0.2, 0.1]} />
        <meshStandardMaterial color={0x111111} metalness={0.2} roughness={0.6} />
      </mesh>

      {/* ===== CROWN MOLDING ===== */}
      {/* Back */}
      <mesh position={[0, height - 0.1, -hd + 0.05]}>
        <boxGeometry args={[width, 0.15, 0.12]} />
        <meshStandardMaterial color={0x1a1a1a} metalness={0.15} roughness={0.6} />
      </mesh>
      {/* Left */}
      <mesh position={[-hw + 0.05, height - 0.1, 0]}>
        <boxGeometry args={[0.12, 0.15, depth]} />
        <meshStandardMaterial color={0x1a1a1a} metalness={0.15} roughness={0.6} />
      </mesh>
      {/* Right */}
      <mesh position={[hw - 0.05, height - 0.1, 0]}>
        <boxGeometry args={[0.12, 0.15, depth]} />
        <meshStandardMaterial color={0x1a1a1a} metalness={0.15} roughness={0.6} />
      </mesh>

      {/* ===== WALL PILLARS / COLUMNS ===== */}
      {pillarPositions.map((p, i) => (
        <group key={`pillar-${i}`} position={[p.x, 0, p.z]}>
          {/* Column shaft */}
          <mesh position={[0, height / 2, 0]}>
            <boxGeometry args={[0.5, height, 0.5]} />
            <meshStandardMaterial color={0x161616} metalness={0.15} roughness={0.6} />
          </mesh>
          {/* Column base */}
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.7, 0.3, 0.7]} />
            <meshStandardMaterial color={0x141414} metalness={0.2} roughness={0.5} />
          </mesh>
          {/* Column capital (top) */}
          <mesh position={[0, height - 0.15, 0]}>
            <boxGeometry args={[0.7, 0.3, 0.7]} />
            <meshStandardMaterial color={0x141414} metalness={0.2} roughness={0.5} />
          </mesh>
          {/* Gold trim ring */}
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.55, 0.04, 0.55]} />
            <meshStandardMaterial color={0xc9a84c} metalness={0.7} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* ===== ENTRANCE FRAME ===== */}
      {/* Left entrance pillar */}
      <mesh position={[-5, height / 2, hd - 0.1]}>
        <boxGeometry args={[0.6, height, 0.6]} />
        <primitive object={darkMetalMat} attach="material" />
      </mesh>
      <mesh position={[-5, 0.2, hd - 0.1]}>
        <boxGeometry args={[0.9, 0.4, 0.9]} />
        <meshStandardMaterial color={0xc9a84c} metalness={0.6} roughness={0.25} />
      </mesh>
      {/* Right entrance pillar */}
      <mesh position={[5, height / 2, hd - 0.1]}>
        <boxGeometry args={[0.6, height, 0.6]} />
        <primitive object={darkMetalMat} attach="material" />
      </mesh>
      <mesh position={[5, 0.2, hd - 0.1]}>
        <boxGeometry args={[0.9, 0.4, 0.9]} />
        <meshStandardMaterial color={0xc9a84c} metalness={0.6} roughness={0.25} />
      </mesh>
      {/* Entrance header beam */}
      <mesh position={[0, height - 0.3, hd - 0.1]}>
        <boxGeometry args={[10.6, 0.6, 0.6]} />
        <primitive object={darkMetalMat} attach="material" />
      </mesh>

      {/* ===== FLOOR ACCENT LIGHTING ===== */}
      {/* Uplight strips along walls (ambient glow) */}
      {/* Left wall uplights */}
      {Array.from({ length: 4 }, (_, i) => (
        <pointLight
          key={`left-up-${i}`}
          position={[-hw + 0.5, 0.3, -hd + 5 + i * 7]}
          color={0xc9a84c}
          intensity={0.15}
          distance={5}
          decay={2}
        />
      ))}
      {/* Right wall uplights */}
      {Array.from({ length: 4 }, (_, i) => (
        <pointLight
          key={`right-up-${i}`}
          position={[hw - 0.5, 0.3, -hd + 5 + i * 7]}
          color={0xc9a84c}
          intensity={0.15}
          distance={5}
          decay={2}
        />
      ))}

      {/* ===== FLOOR GRID (subtle) ===== */}
      <gridHelper
        args={[width, 40, 0x1a1a1a, 0x0d0d0d]}
        position={[0, 0.003, 0]}
      />
    </group>
  )
}
