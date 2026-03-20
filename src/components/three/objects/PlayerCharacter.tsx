'use client'

import { useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MODEL_PATH = '/models/cartoon-dog.glb'
const SCALE = 0.8
const Y_OFFSET = 0.7 // Raise model above the floor so it doesn't clip through

// Animation parameters
const WALK_BOB_SPEED = 10
const WALK_BOB_AMP = 0.06
const WALK_ROCK_AMP = 0.04       // side-to-side body rock
const WALK_YAW_AMP = 0.03        // subtle yaw oscillation (head swing)
const WALK_TILT = 0.1             // forward lean while walking
const WALK_SQUASH_AMP = 0.02     // squash-and-stretch on Y scale

const SPRINT_BOB_SPEED = 14
const SPRINT_BOB_AMP = 0.1
const SPRINT_ROCK_AMP = 0.06
const SPRINT_YAW_AMP = 0.05
const SPRINT_TILT = 0.15
const SPRINT_SQUASH_AMP = 0.04

const IDLE_BOB_SPEED = 2
const IDLE_BOB_AMP = 0.015
const IDLE_ROCK_SPEED = 1.3      // slow weight shift
const IDLE_ROCK_AMP = 0.012
const IDLE_TAIL_SPEED = 3        // tail wag simulated via yaw
const IDLE_TAIL_AMP = 0.015

const LERP_SPEED = 8             // animation state blending speed

interface PlayerCharacterProps {
  position: [number, number, number]
  rotation: number
  isMoving: boolean
  isSprinting: boolean
}

export default function PlayerCharacter({
  position,
  rotation,
  isMoving,
  isSprinting,
}: PlayerCharacterProps) {
  const { scene } = useGLTF(MODEL_PATH)
  const groupRef = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Group>(null)

  // Clone the scene so this component owns its own copy (Three.js objects can only have one parent)
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  // Smoothed animation blend values (avoids snapping between states)
  const blend = useRef({ moving: 0, sprinting: 0 })

  useFrame(({ clock }, delta) => {
    if (!groupRef.current || !innerRef.current) return
    const t = clock.getElapsedTime()
    const dt = Math.min(delta, 0.1)

    // Smooth blend toward target state
    const targetMoving = isMoving ? 1 : 0
    const targetSprinting = isSprinting ? 1 : 0
    blend.current.moving += (targetMoving - blend.current.moving) * Math.min(1, dt * LERP_SPEED)
    blend.current.sprinting += (targetSprinting - blend.current.sprinting) * Math.min(1, dt * LERP_SPEED)

    const mv = blend.current.moving
    const sp = blend.current.sprinting

    // Interpolated parameters
    const bobSpeed = THREE.MathUtils.lerp(WALK_BOB_SPEED, SPRINT_BOB_SPEED, sp)
    const bobAmp = THREE.MathUtils.lerp(WALK_BOB_AMP, SPRINT_BOB_AMP, sp)
    const rockAmp = THREE.MathUtils.lerp(WALK_ROCK_AMP, SPRINT_ROCK_AMP, sp)
    const yawAmp = THREE.MathUtils.lerp(WALK_YAW_AMP, SPRINT_YAW_AMP, sp)
    const tilt = THREE.MathUtils.lerp(WALK_TILT, SPRINT_TILT, sp)
    const squashAmp = THREE.MathUtils.lerp(WALK_SQUASH_AMP, SPRINT_SQUASH_AMP, sp)

    // === WALK / SPRINT ANIMATION ===
    const walkBob = Math.abs(Math.sin(t * bobSpeed)) * bobAmp
    const walkRock = Math.sin(t * bobSpeed * 0.5) * rockAmp
    const walkYaw = Math.sin(t * bobSpeed * 0.5) * yawAmp
    const walkSquash = 1 + Math.sin(t * bobSpeed * 2) * squashAmp

    // === IDLE ANIMATION ===
    const idleBob = Math.sin(t * IDLE_BOB_SPEED) * IDLE_BOB_AMP
    const idleRock = Math.sin(t * IDLE_ROCK_SPEED) * IDLE_ROCK_AMP
    const idleYaw = Math.sin(t * IDLE_TAIL_SPEED) * IDLE_TAIL_AMP

    // === BLEND: idle ↔ walk/sprint ===
    const finalBob = THREE.MathUtils.lerp(idleBob, walkBob, mv)
    const finalRock = THREE.MathUtils.lerp(idleRock, walkRock, mv)
    const finalYaw = THREE.MathUtils.lerp(idleYaw, walkYaw, mv)
    const finalTilt = tilt * mv
    const finalSquash = THREE.MathUtils.lerp(1, walkSquash, mv)

    // Apply to outer group (position + Y rotation set by props)
    groupRef.current.position.set(position[0], position[1] + Y_OFFSET, position[2])
    groupRef.current.rotation.set(0, rotation + Math.PI, 0)

    // Apply procedural animation to inner group
    innerRef.current.position.y = finalBob
    innerRef.current.rotation.x = finalTilt                  // forward lean
    innerRef.current.rotation.z = finalRock                  // side-to-side rock
    innerRef.current.rotation.y = finalYaw                   // head/body yaw swing

    // Squash-and-stretch on scale
    innerRef.current.scale.set(
      1 + (1 - finalSquash) * 0.5,   // widen slightly when squashed
      finalSquash,                     // vertical squash/stretch
      1 + (1 - finalSquash) * 0.5,   // widen slightly when squashed
    )
  })

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation + Math.PI, 0]}>
      <group ref={innerRef}>
        <primitive object={clonedScene} scale={SCALE} />
      </group>
    </group>
  )
}

useGLTF.preload(MODEL_PATH)
