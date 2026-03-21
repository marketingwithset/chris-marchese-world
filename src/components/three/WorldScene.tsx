'use client'

import { Suspense, useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, Preload, Environment } from '@react-three/drei'
import Warehouse from './Warehouse'
import CentralSculpture from './objects/CentralSculpture'
import WarehouseAlcove from './WarehouseAlcove'
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
import PlayerCharacter from './objects/PlayerCharacter'

import ContentOverlay from '../ui/ContentOverlay'
import RoomTransition from '../ui/RoomTransition'
import Crosshair from '../ui/Crosshair'
import VirtualJoystick from '../ui/VirtualJoystick'
import AudioToggle from '../ui/AudioToggle'
import MobileOnboarding from '../ui/MobileOnboarding'
import Minimap from '../ui/Minimap'
import ZoneProximity from '../ui/ZoneProximity'
import { useIsMobile } from '@/hooks/useIsMobile'
import { QualityProvider, useQuality } from '@/contexts/QualityContext'
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

function WorldSceneInner() {
  const [activeContent, setActiveContent] = useState<string | null>(null)
  const lightingMode: LightingMode = 'day'
  const [currentRoom, setCurrentRoom] = useState<RoomId>('main')
  const [transitioning, setTransitioning] = useState(false)
  const [isPointerLocked, setPointerLocked] = useState(false)
  const [playerPos, setPlayerPos] = useState({ x: 0, z: 42 })
  const [playerYaw, setPlayerYaw] = useState(0)
  const isMobile = useIsMobile()
  const [mobileActive, setMobileActive] = useState(false)
  const joystickInput = useRef<[number, number] | null>(null)
  const transitionTimeout = useRef<ReturnType<typeof setTimeout>>(null)
  const posRef = useRef({ x: 0, z: 42 })
  const yawRef = useRef(0)
  const interactTargetRef = useRef<string | null>(null)
  const [interactPrompt, setInteractPrompt] = useState<string | null>(null)
  const quality = useQuality()
  const [thirdPerson, setThirdPerson] = useState(true)
  const [sceneReady, setSceneReady] = useState(false)
  const characterPosRef = useRef({ x: 0, y: 0, z: 42 })
  const movingRef = useRef(false)
  const sprintingRef = useRef(false)
  const [charPos, setCharPos] = useState<[number, number, number]>([0, 0, 42])
  const [charMoving, setCharMoving] = useState(false)
  const [charSprinting, setCharSprinting] = useState(false)

  // UI is visible when pointer is locked (desktop) OR mobile is active OR third-person
  const uiVisible = isPointerLocked || mobileActive || thirdPerson

  // Sync player position + interaction state from Three.js to React (throttled)
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerPos({ ...posRef.current })
      setPlayerYaw(yawRef.current)
      setInteractPrompt(interactTargetRef.current ? 'Press E to interact' : null)
      if (thirdPerson) {
        const cp = characterPosRef.current
        setCharPos([cp.x, cp.y, cp.z])
        setCharMoving(movingRef.current)
        setCharSprinting(sprintingRef.current)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [thirdPerson])

  // Smooth fade-in when scene first loads
  useEffect(() => {
    const timer = setTimeout(() => setSceneReady(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Auto-activate mobile mode on first touch
  useEffect(() => {
    if (!isMobile) return
    const activate = () => { setMobileActive(true) }
    window.addEventListener('touchstart', activate, { once: true })
    return () => window.removeEventListener('touchstart', activate)
  }, [isMobile])

  const handleHotspotClick = useCallback((contentId: string) => {
    setActiveContent(contentId)
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

  // Canvas props based on quality tier
  const shadows = quality !== 'low'
  const dpr: [number, number] = quality === 'high' ? [1, 2] : quality === 'medium' ? [1, 1.5] : [0.75, 1]
  const antialias = quality !== 'low'

  return (
    <div className="relative w-screen h-screen" style={{ opacity: sceneReady ? 1 : 0, transition: 'opacity 1.2s ease-in' }}>
      <Canvas
        camera={{ fov: 65, near: 0.1, far: 200, position: [0, 3, 47] }}
        shadows={shadows}
        gl={{ antialias, alpha: false }}
        dpr={dpr}
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
            thirdPerson={thirdPerson}
            characterPosRef={characterPosRef}
            movingRef={movingRef}
            sprintingRef={sprintingRef}
          />

          {/* HDRI Environment for realistic reflections — skip on low tier */}
          {quality !== 'low' && (
            <Environment
              preset="studio"
              background={false}
              environmentIntensity={quality === 'high' ? 0.5 : 0.3}
            />
          )}

          {/* === MAIN WAREHOUSE === */}
          {currentRoom === 'main' && (
            <>
              <Lighting mode={lightingMode} />
              <Warehouse />
              <CentralSculpture />

              {/* Entrance signage */}
              <NeonSign text="MARCHESE" position={[0, 12, 49]} rotation={[0, Math.PI, 0]} fontSize={1.5} color="#c9a84c" />
              <NeonSign text="ENTER THE WORLD" position={[0, 9.5, 49]} rotation={[0, Math.PI, 0]} fontSize={0.4} color="#f0ead8" />
              <NeonSign text="SETTING THE PACE" position={[0, 1.5, -49]} fontSize={0.4} color="#8a7233" />

              {/* === SUB-ROOM ALCOVES === */}

              {/* Art Gallery — North (0°) */}
              {/* Each zone component internally offsets by zone.position, so we counter-offset here */}
              <WarehouseAlcove position={[0, 0, -35]} rotation={0} width={30} depth={20} height={12} accentColor="#c9a84c" accentHex={0xc9a84c} label="ART GALLERY">
                <group position={[0, 0, 35]}>
                  <ArtGallery onHotspotClick={handleHotspotClick} />
                </group>
              </WarehouseAlcove>

              {/* Film Studio — Northeast (60°) */}
              <WarehouseAlcove position={[30, 0, -17]} rotation={-Math.PI / 3} width={20} depth={16} height={10} accentColor="#4a7fa5" accentHex={0x4a7fa5} label="FILM STUDIO">
                <group position={[-30, 0, 17]}>
                  <FilmStudio onHotspotClick={handleHotspotClick} />
                </group>
              </WarehouseAlcove>

              {/* Fashion — Southeast (120°) */}
              <WarehouseAlcove position={[30, 0, 17]} rotation={(-2 * Math.PI) / 3} width={20} depth={18} height={10} accentColor="#f0ead8" accentHex={0xf0ead8} label="FASHION">
                <group position={[-30, 0, -17]}>
                  <FashionRunway onHotspotClick={handleHotspotClick} />
                </group>
              </WarehouseAlcove>

              {/* Automotive — South (180°) */}
              <WarehouseAlcove position={[0, 0, 35]} rotation={Math.PI} width={24} depth={20} height={10} accentColor="#1a1a1a" accentHex={0x333333} label="AUTOMOTIVE">
                <group position={[0, 0, -35]}>
                  <AutomotiveDisplay onHotspotClick={handleHotspotClick} />
                </group>
              </WarehouseAlcove>

              {/* Telephone — Southwest (240°) */}
              <WarehouseAlcove position={[-30, 0, 17]} rotation={(2 * Math.PI) / 3} width={14} depth={12} height={10} accentColor="#c0392b" accentHex={0xc0392b} label="CONTACT">
                <group position={[30, 0, -17]}>
                  <TelephoneBooth onHotspotClick={handleHotspotClick} />
                </group>
              </WarehouseAlcove>

              {/* Money/Checkout — Northwest (300°) */}
              <WarehouseAlcove position={[-30, 0, -17]} rotation={Math.PI / 3} width={14} depth={12} height={10} accentColor="#27ae60" accentHex={0x27ae60} label="CHECKOUT">
                <group position={[30, 0, 17]}>
                  <MoneyPile onHotspotClick={handleHotspotClick} />
                </group>
              </WarehouseAlcove>

              {/* Portal zones — on warehouse perimeter */}
              <group position={[-45, 0, 0]}>
                <PortalCapital onEnter={() => handleEnterRoom('capital')} />
              </group>
              <group position={[45, 0, 0]}>
                <PortalInfrastructure onEnter={() => handleEnterRoom('infrastructure')} />
              </group>
              <group position={[0, 0, -45]}>
                <PortalGrowth onEnter={() => handleEnterRoom('growth')} />
              </group>
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

          {/* Third-person character model */}
          {thirdPerson && (
            <PlayerCharacter
              position={charPos}
              rotation={playerYaw}
              isMoving={charMoving}
              isSprinting={charSprinting}
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

      {/* Crosshair + controls hint (visible when pointer locked OR mobile active) */}
      <Crosshair
        visible={uiVisible && controllerEnabled}
        interactionPrompt={interactPrompt}
      />

      {/* Click to enter prompt (desktop only, when not pointer locked) */}
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

      {/* Mobile onboarding tooltip (first visit only) */}
      {isMobile && mobileActive && <MobileOnboarding />}

      {/* Mobile virtual joystick */}
      {isMobile && controllerEnabled && (
        <VirtualJoystick
          onMove={(dx, dy) => { joystickInput.current = [dx, dy] }}
          onEnd={() => { joystickInput.current = null }}
        />
      )}

      {/* Mobile interact button */}
      {isMobile && interactPrompt && controllerEnabled && (
        <button
          className="fixed bottom-8 right-8 z-30 px-5 py-3 text-sm uppercase tracking-widest"
          style={{
            fontFamily: 'var(--font-heading)',
            color: '#c9a84c',
            background: 'rgba(6, 6, 6, 0.85)',
            border: '1px solid rgba(201, 168, 76, 0.5)',
            backdropFilter: 'blur(8px)',
            borderRadius: '8px',
          }}
          onClick={() => {
            if (interactTargetRef.current) {
              handleHotspotClick(interactTargetRef.current)
            }
          }}
        >
          Interact
        </button>
      )}

      {/* HTML overlay UI */}
      <ContentOverlay
        content={content}
        allZoneContent={zoneContent}
        onClose={() => setActiveContent(null)}
        onSelectItem={(id) => setActiveContent(id)}
      />

      {/* Room indicator — visible on desktop (pointer locked) and mobile (active) */}
      {uiVisible && (
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

      {/* View toggle (first/third person) */}
      {uiVisible && (
        <button
          className="fixed top-4 right-4 z-30 px-3 py-1.5 text-xs uppercase tracking-widest"
          style={{
            fontFamily: 'var(--font-heading)',
            color: '#c9a84c',
            background: 'rgba(6, 6, 6, 0.6)',
            border: '1px solid rgba(201, 168, 76, 0.3)',
            backdropFilter: 'blur(8px)',
            cursor: 'pointer',
          }}
          onClick={() => setThirdPerson(prev => !prev)}
        >
          {thirdPerson ? '1st Person' : '3rd Person'}
        </button>
      )}

      {/* Ambient audio toggle with zone-specific layers */}
      <AudioToggle
        playerX={playerPos.x}
        playerZ={playerPos.z}
        currentRoom={currentRoom}
      />

      {/* Zone proximity indicator */}
      <ZoneProximity
        playerX={playerPos.x}
        playerZ={playerPos.z}
        currentRoom={currentRoom}
        visible={uiVisible && controllerEnabled}
      />

      {/* Minimap */}
      <Minimap
        currentRoom={currentRoom}
        playerX={playerPos.x}
        playerZ={playerPos.z}
        playerYaw={playerYaw}
        visible={uiVisible && controllerEnabled}
      />
    </div>
  )
}

export default function WorldScene() {
  return (
    <QualityProvider>
      <WorldSceneInner />
    </QualityProvider>
  )
}
