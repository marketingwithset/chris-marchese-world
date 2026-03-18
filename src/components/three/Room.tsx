'use client'

import { ROOM } from '@/lib/constants'
import { useMaterial } from '@/lib/materials/useMaterial'

export default function Room() {
  const { width, depth, height } = ROOM
  const hw = width / 2
  const hd = depth / 2

  const floorMat = useMaterial('floor_concrete')
  const wallMat = useMaterial('wall_plaster')
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

      {/* Front wall (with gap for entrance feel) */}
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

      {/* Floor grid lines for visual depth */}
      <gridHelper
        args={[width, 40, 0x1a1a1a, 0x0f0f0f]}
        position={[0, 0.01, 0]}
      />
    </group>
  )
}
