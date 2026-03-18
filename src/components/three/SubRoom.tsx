'use client'

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

      {/* Back wall */}
      <mesh position={[0, height / 2, -hd]}>
        <planeGeometry args={[width, height]} />
        <primitive object={wallMat} attach="material" />
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

      {/* Floor grid */}
      <gridHelper
        args={[Math.max(width, depth), 30, 0x1a1a1a, 0x0f0f0f]}
        position={[0, 0.01, 0]}
      />
    </group>
  )
}
