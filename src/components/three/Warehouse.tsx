'use client'

import { useMemo } from 'react'
import { useMaterial } from '@/lib/materials/useMaterial'
import { ROOMS } from '@/lib/scene/rooms'
import * as THREE from 'three'

/**
 * Massive warehouse shell (100×100×18) replacing the old Room.tsx gallery.
 * Industrial aesthetic: exposed concrete, steel I-beams, no crown molding.
 */
export default function Warehouse() {
  const config = ROOMS.main
  const hw = config.width / 2    // 50
  const hd = config.depth / 2    // 50
  const h = config.height        // 18

  const concreteMat = useMaterial('floor_concrete')
  const wallMat = useMaterial('wall_plaster')

  // Dark industrial materials
  const ceilingMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9, metalness: 0.1 }),
    []
  )
  const beamMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.7 }),
    []
  )

  // Generate I-beam column positions (grid every 25 units, skip center area)
  const beamPositions = useMemo(() => {
    const positions: [number, number][] = []
    for (let x = -37.5; x <= 37.5; x += 25) {
      for (let z = -37.5; z <= 37.5; z += 25) {
        // Skip center area (sculpture zone) and areas too close to walls
        if (Math.abs(x) < 8 && Math.abs(z) < 8) continue
        positions.push([x, z])
      }
    }
    return positions
  }, [])

  // Ceiling beam positions (long horizontal beams)
  const ceilingBeams = useMemo(() => {
    const beams: { x: number; z: number; len: number; axis: 'x' | 'z' }[] = []
    for (let z = -37.5; z <= 37.5; z += 25) {
      beams.push({ x: 0, z, len: 100, axis: 'x' })
    }
    for (let x = -37.5; x <= 37.5; x += 25) {
      beams.push({ x, z: 0, len: 100, axis: 'z' })
    }
    return beams
  }, [])

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[config.width, config.depth]} />
        <primitive object={concreteMat} attach="material" />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, h, 0]}>
        <planeGeometry args={[config.width, config.depth]} />
        <primitive object={ceilingMat} attach="material" />
      </mesh>

      {/* Walls */}
      {/* Back wall (North) */}
      <mesh position={[0, h / 2, -hd]}>
        <planeGeometry args={[config.width, h]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* Front wall (South) — with entrance gap */}
      <mesh position={[-30, h / 2, hd]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[40, h]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      <mesh position={[30, h / 2, hd]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[40, h]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* Left wall (West) */}
      <mesh position={[-hw, h / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[config.depth, h]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* Right wall (East) */}
      <mesh position={[hw, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[config.depth, h]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* I-beam columns — vertical pillars */}
      {beamPositions.map(([x, z], i) => (
        <group key={`col-${i}`} position={[x, 0, z]}>
          {/* Vertical beam */}
          <mesh position={[0, h / 2, 0]}>
            <boxGeometry args={[0.6, h, 0.6]} />
            <primitive object={beamMat} attach="material" />
          </mesh>
          {/* Base plate */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[1.2, 0.1, 1.2]} />
            <primitive object={beamMat} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Ceiling beams — horizontal trusses */}
      {ceilingBeams.map((beam, i) => (
        <mesh
          key={`cbeam-${i}`}
          position={[beam.x, h - 0.3, beam.z]}
        >
          <boxGeometry
            args={beam.axis === 'x' ? [beam.len, 0.5, 0.4] : [0.4, 0.5, beam.len]}
          />
          <primitive object={beamMat} attach="material" />
        </mesh>
      ))}

      {/* Floor grid lines — subtle gold accent at key intersections */}
      {[-25, 0, 25].map((x) =>
        [-25, 0, 25].map((z) => (
          <mesh key={`fgrid-${x}-${z}`} position={[x, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 1, 32]} />
            <meshStandardMaterial color={0xc9a84c} emissive={0xc9a84c} emissiveIntensity={0.3} transparent opacity={0.15} />
          </mesh>
        ))
      )}

      {/* Fog for atmospheric depth culling */}
      <fog attach="fog" args={['#060606', 35, 90]} />
    </group>
  )
}
