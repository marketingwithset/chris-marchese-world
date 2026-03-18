'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { RoomId } from '@/types'
import { ROOMS } from '@/lib/scene/rooms'
import {
  resolveCollision,
  generateRoomWalls,
  checkPortalTriggers,
  getMainRoomPortalTriggers,
  getReturnPortalTrigger,
} from '@/lib/collision'
import type { WallDef, PortalTrigger } from '@/lib/collision'

interface FirstPersonControllerProps {
  currentRoom: RoomId
  enabled: boolean
  onEnterPortal: (roomId: RoomId) => void
  onInteract: (contentId: string) => void
  isPointerLocked: boolean
  setPointerLocked: (locked: boolean) => void
  /** Mobile joystick input: [dx, dy] normalized to [-1, 1] */
  joystickInput?: React.RefObject<[number, number] | null>
  /** Mobile gyroscope active */
  isMobile?: boolean
}

// Spawn positions per room
const SPAWN: Record<string, { pos: [number, number, number]; yaw: number }> = {
  main: { pos: [0, 1.6, 12], yaw: Math.PI },
  capital: { pos: [0, 1.6, 10], yaw: Math.PI },
  infrastructure: { pos: [0, 1.6, 12], yaw: Math.PI },
  growth: { pos: [0, 1.6, 10], yaw: Math.PI },
}

const MOVE_SPEED = 5
const SPRINT_SPEED = 9
const MOUSE_SENSITIVITY = 0.002
const PLAYER_RADIUS = 0.35
const INTERACT_DISTANCE = 4
const PORTAL_COOLDOWN = 1500

export default function FirstPersonController({
  currentRoom,
  enabled,
  onEnterPortal,
  onInteract,
  isPointerLocked,
  setPointerLocked,
  joystickInput,
  isMobile = false,
}: FirstPersonControllerProps) {
  const { camera, gl, scene } = useThree()

  // Player state (refs for per-frame performance)
  const yaw = useRef(Math.PI)
  const pitch = useRef(0)
  const position = useRef(new THREE.Vector3(0, 1.6, 12))
  const keys = useRef<Set<string>>(new Set())
  const prevRoom = useRef<RoomId>(currentRoom)
  const portalCooldown = useRef(0)
  const interactTarget = useRef<string | null>(null)

  // Cached collision data
  const walls = useRef<WallDef[]>([])
  const portals = useRef<PortalTrigger[]>([])

  // Raycaster for interactions
  const raycaster = useRef(new THREE.Raycaster())
  const rayDir = useRef(new THREE.Vector3())

  // Build collision walls for current room
  useEffect(() => {
    const room = ROOMS[currentRoom]
    if (!room) return

    walls.current = generateRoomWalls(room.width, room.depth)

    if (currentRoom === 'main') {
      portals.current = getMainRoomPortalTriggers()
    } else {
      portals.current = [getReturnPortalTrigger(room.depth)]
    }
  }, [currentRoom])

  // Handle room change — teleport to spawn
  useEffect(() => {
    if (currentRoom === prevRoom.current) return
    prevRoom.current = currentRoom

    const spawn = SPAWN[currentRoom] || SPAWN.main
    position.current.set(...spawn.pos)
    yaw.current = spawn.yaw
    pitch.current = 0
    portalCooldown.current = Date.now() + PORTAL_COOLDOWN
  }, [currentRoom])

  // Pointer lock handlers
  const requestPointerLock = useCallback(() => {
    if (!enabled) return
    gl.domElement.requestPointerLock()
  }, [gl, enabled])

  useEffect(() => {
    const canvas = gl.domElement

    const onMouseMove = (e: MouseEvent) => {
      if (!document.pointerLockElement || !enabled) return
      yaw.current -= e.movementX * MOUSE_SENSITIVITY
      pitch.current -= e.movementY * MOUSE_SENSITIVITY
      pitch.current = Math.max(-1.4, Math.min(1.4, pitch.current))
    }

    const onPointerLockChange = () => {
      setPointerLocked(document.pointerLockElement === canvas)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.code)
      // E to interact
      if (e.code === 'KeyE' && interactTarget.current) {
        onInteract(interactTarget.current)
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.code)
    }

    const onClick = () => {
      if (!document.pointerLockElement && enabled) {
        requestPointerLock()
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('pointerlockchange', onPointerLockChange)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)
    canvas.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
      canvas.removeEventListener('click', onClick)
    }
  }, [gl, enabled, onInteract, requestPointerLock, setPointerLocked])

  // Release pointer lock when disabled
  useEffect(() => {
    if (!enabled && document.pointerLockElement) {
      document.exitPointerLock()
    }
  }, [enabled])

  // Mobile gyroscope look controls
  useEffect(() => {
    if (!isMobile) return

    let initialAlpha: number | null = null
    let initialBeta: number | null = null

    const onDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha === null || e.beta === null) return

      // Calibrate on first reading
      if (initialAlpha === null) {
        initialAlpha = e.alpha
        initialBeta = e.beta
      }

      // Convert to delta from initial
      let deltaAlpha = (e.alpha - initialAlpha) * Math.PI / 180
      const deltaBeta = ((e.beta! - (initialBeta || 0)) * Math.PI / 180) * 0.5

      // Wrap alpha around
      if (deltaAlpha > Math.PI) deltaAlpha -= 2 * Math.PI
      if (deltaAlpha < -Math.PI) deltaAlpha += 2 * Math.PI

      yaw.current = Math.PI - deltaAlpha
      pitch.current = Math.max(-1.4, Math.min(1.4, -deltaBeta))
    }

    // Request permission on iOS 13+
    const requestPermission = async () => {
      if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
        try {
          const perm = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission()
          if (perm === 'granted') {
            window.addEventListener('deviceorientation', onDeviceOrientation)
          }
        } catch {
          console.warn('Gyroscope permission denied')
        }
      } else {
        window.addEventListener('deviceorientation', onDeviceOrientation)
      }
    }

    requestPermission()

    return () => {
      window.removeEventListener('deviceorientation', onDeviceOrientation)
    }
  }, [isMobile])

  // Main update loop
  useFrame((_, delta) => {
    if (!enabled) return

    const dt = Math.min(delta, 0.1) // Cap delta to prevent huge jumps

    // === MOVEMENT ===
    const canMove = isPointerLocked || isMobile
    if (canMove) {
      const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current))
      const right = new THREE.Vector3(forward.z, 0, -forward.x)

      const dir = new THREE.Vector3(0, 0, 0)

      // Desktop: WASD / Arrow keys
      if (keys.current.has('KeyW') || keys.current.has('ArrowUp')) dir.add(forward)
      if (keys.current.has('KeyS') || keys.current.has('ArrowDown')) dir.sub(forward)
      if (keys.current.has('KeyA') || keys.current.has('ArrowLeft')) dir.sub(right)
      if (keys.current.has('KeyD') || keys.current.has('ArrowRight')) dir.add(right)

      // Mobile: virtual joystick input
      if (isMobile && joystickInput?.current) {
        const [jx, jy] = joystickInput.current
        if (Math.abs(jx) > 0.1 || Math.abs(jy) > 0.1) {
          dir.addScaledVector(right, jx)
          dir.addScaledVector(forward, -jy) // -jy because forward is negative Z
        }
      }

      if (dir.lengthSq() > 0) {
        dir.normalize()
        const speed = keys.current.has('ShiftLeft') || keys.current.has('ShiftRight')
          ? SPRINT_SPEED : MOVE_SPEED
        const move = dir.multiplyScalar(speed * dt)

        const desiredX = position.current.x + move.x
        const desiredZ = position.current.z + move.z

        // Collision resolution
        const [resolvedX, resolvedZ] = resolveCollision(
          desiredX, desiredZ, walls.current, PLAYER_RADIUS
        )

        position.current.x = resolvedX
        position.current.z = resolvedZ
      }
    }

    // === CAMERA UPDATE ===
    camera.position.copy(position.current)
    const euler = new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ')
    camera.quaternion.setFromEuler(euler)

    // === PORTAL CHECK ===
    if (Date.now() > portalCooldown.current) {
      const triggered = checkPortalTriggers(
        position.current.x,
        position.current.z,
        portals.current
      )
      if (triggered) {
        portalCooldown.current = Date.now() + PORTAL_COOLDOWN
        onEnterPortal(triggered as RoomId)
      }
    }

    // === RAYCAST FOR INTERACTIONS ===
    rayDir.current.set(0, 0, -1).applyQuaternion(camera.quaternion)
    raycaster.current.set(camera.position, rayDir.current)
    raycaster.current.far = INTERACT_DISTANCE

    const intersects = raycaster.current.intersectObjects(scene.children, true)
    let foundTarget: string | null = null

    for (const hit of intersects) {
      const obj = hit.object
      if (obj.userData?.interactable && obj.userData?.contentId) {
        foundTarget = obj.userData.contentId
        break
      }
    }
    interactTarget.current = foundTarget
  })

  return null
}
