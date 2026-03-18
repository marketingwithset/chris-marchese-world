'use client'

import { Suspense, useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, Preload, Environment } from '@react-three/drei'
import Room from './Room'
import Lighting from './Lighting'
import FirstPersonController from './FirstPersonController'
import ArtGallery from './zones/ArtGallery'
import FilmStudio from './zones/FilmStudio'
import AutomotiveDisplay from './zones/AutomotiveDisplay'
import FashionRunway from './zones/FashionRunway'
import TelephoneBooth from './zones/TelephoneBooth'
import MoneyPile from './zones/MoneyPile'
import PortalCapital from './zones/PortalCapital'
import PortalInfrastructure from './zones/PortalInfrastructure'
import PortalGrowth from './zones/PortalGrowth'
import CapitalRoom from './rooms/CapitalRoom'
import InfrastructureRoom from './rooms/InfrastructureRoom'
import GrowthRoom from './rooms/GrowthRoom'
import NeonSign from './objects/NeonSign'

import ContentOverlay from '../ui/ContentOverlay'
import RoomTransition from '../ui/RoomTransition'
import Crosshair from '../ui/Crosshair'
import VirtualJoystick from '../ui/VirtualJoystick'
import AudioToggle from '../ui/AudioToggle'
import Minimap from '../ui/Minimap'
import ZoneProximity from '../ui/ZoneProximity'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { RoomId, LightingMode } from '@/types'
import { getContentById, getContentByZone } from '@/lib/content/sample-data'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/** Reads camera position/rotation each frame and writes to shared refs */
function PlayerTracker({ posRef, yawRef }: {
  posRef: React.RefObject<{ x: number; z: number }>
  yawRef: React.RefObject<number>
}) {
  const { camera } = useThree()
  const euler = useMemo(() => new THREE.Euler(), [])
  useFrame(() => {
    posRef.current = { x: camera.position.x, z: camera.position.z }
    euler.setFromQuaternion(camera.quaternion, 'YXZ')
    yawRef.current = euler.y
  })
  return null
}

export default function WorldScene() {
  const [activeContent, setActiveContent] = useState<string | null>(null)
  const lightingMode: LightingMode = 'day'
  const [currentRoom, setCurrentRoom] = useState<RoomId>('main')
  const [transitioning, setTransitioning] = useState(false)
  const [isPointerLocked, setPointerLocked] = useState(false)
  const [playerPos, setPlayerPos] = useState({ x: 0, z: 12 })
  const [playerYaw, setPlayerYaw] = useState(Math.PI)
  const isMobile = useIsMobile()
  const joystickInput = useRef<[number, number] | null>(null)
  const transitionTimeout = useRef<ReturnType<typeof setTimeout>>(null)
  const posRef = useRef({ x: 0, z: 12 })
  const yawRef = useRef(Math.PI)
  const interactTargetRef = useRef<string | null>(null)
  const [interactPrompt, setInteractPrompt] = useState<string | null>(null)

  // Sync player position + interaction state from Three.js to React (throttled)
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerPos({ ...posRef.current })
      setPlayerYaw(yawRef.current)
      setInteractPrompt(interactTargetRef.current ? 'Press E to interact' : null)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const handleHotspotClick = useCallback((contentId: string) => {
    setActiveContent(contentId)
    // Release pointer lock when opening content
    if (document.pointerLockElement) {
      document.exitPointerLock()
    }
  }, [])

  const handleEnterRoom = useCallback((roomId: RoomId) => {
    if (transitioning) return
    setTransitioning(true)
    setActiveContent(null)

    if (transitionTimeout.current) clearTimeout(transitionTimeout.current)

    transitionTimeout.current = setTimeout(() => {
      setCurrentRoom(roomId)

      setTimeout(() => {
        setTransitioning(false)
      }, 100)
    }, 550)
  }, [transitioning])

  const handleReturnToMain = useCallback(() => {
    handleEnterRoom('main')
  }, [handleEnterRoom])

  const content = activeContent ? getContentById(activeContent) : null
  const zoneContent = content ? getContentByZone(content.zoneId) : []

  const controllerEnabled = !activeContent && !transitioning

  return (
    <div className="relative w-screen h-screen">
      <Canvas
        camera={{ fov: 65, near: 0.1, far: 100, position: [0, 1.6, 12] }}
        shadows
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#060606' }}
      >
        <Suspense fallback={null}>
          {/* First-Person Controller */}
          <FirstPersonController
            currentRoom={currentRoom}
            enabled={controllerEnabled}
            onEnterPortal={handleEnterRoom}
            onInteract={handleHotspotClick}
            isPointerLocked={isPointerLocked}
            setPointerLocked={setPointerLocked}
            isMobile={isMobile}
            joystickInput={joystickInput}
            interactTargetRef={interactTargetRef}
          />

          {/* HDRI Environment for realistic reflections */}
          <Environment
            preset="studio"
            background={false}
            environmentIntensity={0.5}
          />

          {/* === MAIN ROOM === */}
          {currentRoom === 'main' && (
            <>
              <Lighting mode={lightingMode} />
              <Room />

              <ArtGallery onHotspotClick={handleHotspotClick} />
              <FilmStudio onHotspotClick={handleHotspotClick} />
              <AutomotiveDisplay onHotspotClick={handleHotspotClick} />
              <FashionRunway onHotspotClick={handleHotspotClick} />
              <TelephoneBooth onHotspotClick={handleHotspotClick} />
              <MoneyPile onHotspotClick={handleHotspotClick} />

              {/* Portal zones */}
              <PortalCapital onEnter={() => handleEnterRoom('capital')} />
              <PortalInfrastructure onEnter={() => handleEnterRoom('infrastructure')} />
              <PortalGrowth onEnter={() => handleEnterRoom('growth')} />

              {/* Environmental text */}
              <NeonSign
                text="MARCHESE"
                position={[0, 6.5, 14.8]}
                rotation={[0, Math.PI, 0]}
                fontSize={1.2}
                color="#c9a84c"
              />
              <NeonSign
                text="SETTING THE PACE"
                position={[0, 1.5, -14.8]}
                fontSize={0.35}
                color="#8a7233"
              />
              <NeonSign
                text="ENTER THE WORLD"
                position={[0, 3, 14.8]}
                rotation={[0, Math.PI, 0]}
                fontSize={0.3}
                color="#f0ead8"
              />
            </>
          )}

          {/* === CAPITAL ROOM === */}
          {currentRoom === 'capital' && (
            <CapitalRoom
              onHotspotClick={handleHotspotClick}
              onReturn={handleReturnToMain}
              lightingMode={lightingMode}
            />
          )}

          {/* === INFRASTRUCTURE ROOM === */}
          {currentRoom === 'infrastructure' && (
            <InfrastructureRoom
              onHotspotClick={handleHotspotClick}
              onReturn={handleReturnToMain}
              lightingMode={lightingMode}
            />
          )}

          {/* === GROWTH ROOM === */}
          {currentRoom === 'growth' && (
            <GrowthRoom
              onHotspotClick={handleHotspotClick}
              onReturn={handleReturnToMain}
              lightingMode={lightingMode}
            />
          )}

          {/* Player position tracker for minimap */}
          <PlayerTracker posRef={posRef} yawRef={yawRef} />

          <AdaptiveDpr pixelated />
          <Preload all />
        </Suspense>
      </Canvas>

      {/* Room transition overlay */}
      <RoomTransition active={transitioning} />

      {/* Crosshair + controls hint (visible when pointer locked) */}
      <Crosshair
        visible={isPointerLocked && controllerEnabled}
        interactionPrompt={interactPrompt}
      />

      {/* Click/Tap to enter prompt */}
      {!isPointerLocked && !activeContent && !transitioning && !isMobile && (
        <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div
            className="px-6 py-3 text-sm uppercase tracking-widest animate-pulse"
            style={{
              fontFamily: 'var(--font-heading)',
              color: '#c9a84c',
              background: 'rgba(6, 6, 6, 0.8)',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              backdropFilter: 'blur(8px)',
            }}
          >
            Click to Enter World
          </div>
        </div>
      )}

      {/* Mobile virtual joystick */}
      {isMobile && controllerEnabled && (
        <VirtualJoystick
          onMove={(dx, dy) => { joystickInput.current = [dx, dy] }}
          onEnd={() => { joystickInput.current = null }}
        />
      )}

      {/* HTML overlay UI */}
      <ContentOverlay
        content={content}
        allZoneContent={zoneContent}
        onClose={() => setActiveContent(null)}
        onSelectItem={(id) => setActiveContent(id)}
      />

      {/* Room indicator */}
      {isPointerLocked && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 text-xs uppercase tracking-widest"
          style={{
            fontFamily: 'var(--font-heading)',
            color: currentRoom === 'main' ? '#c9a84c' :
                   currentRoom === 'capital' ? '#4a7fa5' :
                   currentRoom === 'growth' ? '#5a9e6f' : '#c9a84c',
            background: 'rgba(6, 6, 6, 0.6)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {currentRoom === 'main' ? 'MARCHESE WORLD' :
           currentRoom === 'capital' ? 'SET VENTURES \u00b7 CAPITAL' :
           currentRoom === 'infrastructure' ? 'SET \u00b7 INFRASTRUCTURE' :
           'SET MARKETING \u00b7 GROWTH'}
        </div>
      )}

      {/* Ambient audio toggle with zone-specific layers */}
      {!isMobile && (
        <AudioToggle
          playerX={playerPos.x}
          playerZ={playerPos.z}
          currentRoom={currentRoom}
        />
      )}

      {/* Zone proximity indicator */}
      <ZoneProximity
        playerX={playerPos.x}
        playerZ={playerPos.z}
        currentRoom={currentRoom}
        visible={isPointerLocked && controllerEnabled}
      />

      {/* Minimap */}
      <Minimap
        currentRoom={currentRoom}
        playerX={playerPos.x}
        playerZ={playerPos.z}
        playerYaw={playerYaw}
        visible={isPointerLocked && controllerEnabled}
      />
    </div>
  )
}
