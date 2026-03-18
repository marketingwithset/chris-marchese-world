'use client'

import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { RoomId } from '@/types'
import { CAMERA_PRESETS } from '@/lib/scene/camera-paths'
import { ROOMS } from '@/lib/scene/rooms'

interface CameraControllerProps {
  navigateTo?: string | null
  onNavigationComplete?: () => void
  enabled?: boolean
  currentRoom: RoomId
}

export default function CameraController({
  navigateTo,
  onNavigationComplete,
  enabled = true,
  currentRoom,
}: CameraControllerProps) {
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null)
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 10, 22))
  const targetLookAt = useRef(new THREE.Vector3(0, 2, 0))
  const isAnimating = useRef(false)
  const prevRoom = useRef<RoomId>(currentRoom)

  // Handle room change — jump camera instantly (during fade blackout)
  useEffect(() => {
    if (currentRoom === prevRoom.current) return
    prevRoom.current = currentRoom

    const overviewKey = currentRoom === 'main' ? 'overview' : `${currentRoom}_overview`
    const preset = CAMERA_PRESETS[overviewKey]
    if (!preset) return

    camera.position.set(...preset.position)
    targetPos.current.set(...preset.position)
    targetLookAt.current.set(...preset.target)

    if (controlsRef.current) {
      const controls = controlsRef.current as unknown as { target: THREE.Vector3 }
      controls.target.set(...preset.target)
    }

    isAnimating.current = false
  }, [currentRoom, camera])

  // Handle zone navigation (smooth lerp)
  useEffect(() => {
    if (!navigateTo) return
    const preset = CAMERA_PRESETS[navigateTo]
    if (!preset) return

    targetPos.current.set(...preset.position)
    targetLookAt.current.set(...preset.target)
    isAnimating.current = true
  }, [navigateTo])

  useFrame(() => {
    if (!isAnimating.current || !controlsRef.current) return

    camera.position.lerp(targetPos.current, 0.04)
    const controls = controlsRef.current as unknown as { target: THREE.Vector3 }
    controls.target.lerp(targetLookAt.current, 0.04)

    const posDist = camera.position.distanceTo(targetPos.current)
    if (posDist < 0.1) {
      isAnimating.current = false
      onNavigationComplete?.()
    }
  })

  const roomConfig = ROOMS[currentRoom]
  const maxDist = Math.max(roomConfig.width, roomConfig.depth) * 0.8

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enabled && !isAnimating.current}
      enableDamping
      dampingFactor={0.05}
      minDistance={3}
      maxDistance={maxDist}
      minPolarAngle={0.3}
      maxPolarAngle={1.5}
      target={[0, 2, 0]}
    />
  )
}
