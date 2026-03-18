'use client'

import { useMemo } from 'react'
import type { RoomConfig } from '@/types'
import { useMaterial } from '@/lib/materials/useMaterial'

interface SubRoomProps {
  config: RoomConfig
  /** Material name override for floor/walls */
  floorMaterial?: string
  wallMaterial?: string
}

export default function SubRoom({ config, floorMaterial, wallMaterial }: SubRoomProps) {
  const { width, depth, height } = config
  const hw = width / 2
  const hd = depth / 2

  // Use room-specific materials if provided, else defaults
  const floorMat = useMaterial(floorMaterial || 'floor_concrete')
  const wallMat = useMaterial(wallMaterial || 'wall_plaster')
  const ceilingMat = useMaterial('ceiling_dark')

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
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <primitive object={floorMat} attach="material" />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
        <planeGeometry args={[width, depth]} />
        <primitive object={ceilingMat} attach="material" />
      </mesh>

      {/* Ceiling light panels */}
      {lightPositions.map(([x, z], i) => (
        <group key={`light-${i}`} position={[x, height - 0.02, z]}>
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
          <pointLight
            position={[0, -0.3, 0]}
            color={0xfff5e6}
            intensity={0.35}
            distance={7}
            decay={2}
          />
        </group>
      ))}

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

      {/* Right wall */}
      <mesh position={[hw, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[depth, height]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* Baseboards */}
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

      {/* Crown molding */}
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

      {/* Wall pillars */}
      {pillarPositions.map((p, i) => (
        <group key={`pillar-${i}`} position={[p.x, 0, p.z]}>
          <mesh position={[0, height / 2, 0]}>
            <boxGeometry args={[0.4, height, 0.4]} />
            <meshStandardMaterial color={0x161616} metalness={0.15} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.6, 0.24, 0.6]} />
            <meshStandardMaterial color={0x141414} metalness={0.2} roughness={0.5} />
          </mesh>
          <mesh position={[0, height - 0.12, 0]}>
            <boxGeometry args={[0.6, 0.24, 0.6]} />
            <meshStandardMaterial color={0x141414} metalness={0.2} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Floor grid */}
      <gridHelper
        args={[Math.max(width, depth), 30, 0x1a1a1a, 0x0d0d0d]}
        position={[0, 0.003, 0]}
      />
    </group>
  )
}
