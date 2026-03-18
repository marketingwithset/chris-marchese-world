'use client'

import { Suspense, useState, useCallback, useRef } from 'react'
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
import VideoScreen from './objects/VideoScreen'
import ContentOverlay from '../ui/ContentOverlay'
import DayNightToggle from '../ui/DayNightToggle'
import RoomTransition from '../ui/RoomTransition'
import Crosshair from '../ui/Crosshair'
import type { RoomId, LightingMode } from '@/types'
import { getContentById, getContentByZone } from '@/lib/content/sample-data'

export default function WorldScene() {
  const [activeContent, setActiveContent] = useState<string | null>(null)
  const [lightingMode, setLightingMode] = useState<LightingMode>('night')
  const [currentRoom, setCurrentRoom] = useState<RoomId>('main')
  const [transitioning, setTransitioning] = useState(false)
  const [isPointerLocked, setPointerLocked] = useState(false)
  const transitionTimeout = useRef<ReturnType<typeof setTimeout>>(null)

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
          />

          {/* HDRI Environment for realistic reflections */}
          <Environment
            preset={lightingMode === 'day' ? 'studio' : 'night'}
            background={false}
            environmentIntensity={lightingMode === 'day' ? 0.4 : 0.15}
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

              {/* Film screens with Vimeo videos */}
              <VideoScreen
                position={[-18, 4, -5]}
                rotation={[0, Math.PI / 2, 0]}
                vimeoId="1174206252"
                label="Reel 1"
                width={5}
                height={2.8}
              />
              <VideoScreen
                position={[-18, 4, 2]}
                rotation={[0, Math.PI / 2, 0]}
                vimeoId="1173874678"
                label="Reel 2"
                width={5}
                height={2.8}
              />

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

          <AdaptiveDpr pixelated />
          <Preload all />
        </Suspense>
      </Canvas>

      {/* Room transition overlay */}
      <RoomTransition active={transitioning} />

      {/* Crosshair + controls hint (visible when pointer locked) */}
      <Crosshair
        visible={isPointerLocked && controllerEnabled}
        interactionPrompt={null}
      />

      {/* Click to enter prompt */}
      {!isPointerLocked && !activeContent && !transitioning && (
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
           currentRoom === 'capital' ? 'SET VENTURES · CAPITAL' :
           currentRoom === 'infrastructure' ? 'SET · INFRASTRUCTURE' :
           'SET MARKETING · GROWTH'}
        </div>
      )}

      <DayNightToggle
        mode={lightingMode}
        onToggle={() => setLightingMode((m) => (m === 'day' ? 'night' : 'day'))}
      />
    </div>
  )
}
