'use client'

import { useMemo } from 'react'
import { useMaterial } from '@/lib/materials/useMaterial'
import { ROOMS } from '@/lib/scene/rooms'
import * as THREE from 'three'

/**
 * Museum atrium (100×100×18). Contemporary art gallery aesthetic:
 * polished dark floors, clean walls, elegant marble pillars, warm lighting.
 */
export default function Warehouse() {
  const config = ROOMS.main
  const hw = config.width / 2    // 50
  const hd = config.depth / 2    // 50
  const h = config.height        // 18

  const marbleMat = useMaterial('floor_marble')
  const wallMat = useMaterial('wall_plaster')

  // Polished dark floor
  const floorMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x0c0c0c, roughness: 0.15, metalness: 0.3 }),
    []
  )
  // Museum ceiling — dark, clean
  const ceilingMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.9, metalness: 0.05 }),
    []
  )
  // Elegant pillar material — dark marble tone
  const pillarMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.25, metalness: 0.4 }),
    []
  )
  // Gold accent trim
  const goldTrimMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: 0xc9a84c, emissive: 0xc9a84c, emissiveIntensity: 0.2,
      roughness: 0.3, metalness: 0.7,
    }),
    []
  )

  // Elegant pillar positions — fewer, larger, with gold trim
  const pillarPositions = useMemo(() => {
    const positions: [number, number][] = []
    // Ring of pillars around center at radius ~20
    for (let angle = 0; angle < 360; angle += 30) {
      const rad = (angle * Math.PI) / 180
      const x = Math.cos(rad) * 22
      const z = Math.sin(rad) * 22
      positions.push([x, z])
    }
    return positions
  }, [])

  return (
    <group>
      {/* Polished floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[config.width, config.depth]} />
        <primitive object={floorMat} attach="material" />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, h, 0]}>
        <planeGeometry args={[config.width, config.depth]} />
        <primitive object={ceilingMat} attach="material" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, h / 2, -hd]}>
        <planeGeometry args={[config.width, h]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      {/* South wall with entrance gap (20 units wide) */}
      <mesh position={[-35, h / 2, hd]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[30, h]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      <mesh position={[35, h / 2, hd]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[30, h]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      <mesh position={[-hw, h / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[config.depth, h]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      <mesh position={[hw, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[config.depth, h]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* Elegant cylindrical pillars in a ring around center */}
      {pillarPositions.map(([x, z], i) => (
        <group key={`pillar-${i}`} position={[x, 0, z]}>
          {/* Pillar shaft */}
          <mesh position={[0, h / 2, 0]}>
            <cylinderGeometry args={[0.4, 0.5, h, 16]} />
            <primitive object={pillarMat} attach="material" />
          </mesh>
          {/* Gold base ring */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.7, 0.7, 0.2, 16]} />
            <primitive object={goldTrimMat} attach="material" />
          </mesh>
          {/* Gold capital (top ring) */}
          <mesh position={[0, h - 0.1, 0]}>
            <cylinderGeometry args={[0.6, 0.4, 0.2, 16]} />
            <primitive object={goldTrimMat} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Floor baseboard trim — gold accent along walls */}
      {[
        { pos: [0, 0.06, -hd + 0.05] as const, args: [config.width, 0.12, 0.1] as const },
        { pos: [-hw + 0.05, 0.06, 0] as const, args: [0.1, 0.12, config.depth] as const },
        { pos: [hw - 0.05, 0.06, 0] as const, args: [0.1, 0.12, config.depth] as const },
      ].map((trim, i) => (
        <mesh key={`trim-${i}`} position={trim.pos}>
          <boxGeometry args={trim.args} />
          <primitive object={goldTrimMat} attach="material" />
        </mesh>
      ))}

      {/* Corridor floor accent strips — subtle gold lines from center to each alcove */}
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180
        const midR = 20
        const x = Math.cos(rad) * midR
        const z = Math.sin(rad) * midR
        return (
          <mesh key={`corridor-${angle}`} position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, rad + Math.PI / 2]}>
            <planeGeometry args={[0.3, 25]} />
            <meshStandardMaterial color={0xc9a84c} emissive={0xc9a84c} emissiveIntensity={0.3} transparent opacity={0.12} />
          </mesh>
        )
      })}

      {/* Ambient museum lighting — warm, soft */}
      <ambientLight intensity={0.15} color={0xfff5e6} />

      {/* Fog for atmospheric depth */}
      <fog attach="fog" args={['#060606', 40, 95]} />
    </group>
  )
}
