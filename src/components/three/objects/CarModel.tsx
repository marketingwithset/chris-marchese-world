'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useMaterial } from '@/lib/materials/useMaterial'
import { useQuality } from '@/contexts/QualityContext'

interface CarModelProps {
  scale?: number
}

function createBodyShape(): THREE.Shape {
  const s = new THREE.Shape()
  s.moveTo(-2.4, 0.15)
  s.lineTo(2.4, 0.15)
  s.quadraticCurveTo(2.55, 0.15, 2.55, 0.35)
  s.lineTo(2.55, 0.55)
  s.quadraticCurveTo(2.5, 0.6, 2.3, 0.62)
  s.lineTo(1.2, 0.68)
  s.lineTo(0.65, 1.18)
  s.quadraticCurveTo(0.2, 1.28, -0.3, 1.25)
  s.lineTo(-1.1, 1.0)
  s.quadraticCurveTo(-1.4, 0.9, -1.6, 0.78)
  s.lineTo(-2.2, 0.7)
  s.quadraticCurveTo(-2.45, 0.68, -2.5, 0.55)
  s.lineTo(-2.5, 0.3)
  s.quadraticCurveTo(-2.5, 0.15, -2.4, 0.15)
  return s
}

function WheelAssembly({ position, side }: { position: [number, number, number]; side: 'left' | 'right' }) {
  const quality = useQuality()
  const tireColor = 0x111111
  const rimColor = 0x888888
  const zFlip = side === 'left' ? 1 : -1

  // Low tier: simple cylinder wheels
  if (quality === 'low') {
    return (
      <group position={position}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.18, 16]} />
          <meshStandardMaterial color={tireColor} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03 * zFlip]}>
          <cylinderGeometry args={[0.22, 0.22, 0.04, 16]} />
          <meshStandardMaterial color={rimColor} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    )
  }

  return (
    <group position={position}>
      {/* Tire */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.1, 12, 24]} />
        <meshStandardMaterial color={tireColor} metalness={0.05} roughness={0.95} />
      </mesh>

      {/* Rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03 * zFlip]}>
        <cylinderGeometry args={[0.26, 0.26, 0.04, 24]} />
        <meshStandardMaterial color={rimColor} metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.05 * zFlip]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 12]} />
        <meshStandardMaterial color={0x333333} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Spokes */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.17, Math.sin(angle) * 0.17, 0.04 * zFlip]}
            rotation={[Math.PI / 2, 0, angle]}
          >
            <boxGeometry args={[0.04, 0.02, 0.2]} />
            <meshStandardMaterial color={rimColor} metalness={0.85} roughness={0.15} />
          </mesh>
        )
      })}

      {/* Brake disk */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.015, 24]} />
        <meshStandardMaterial color={0x555555} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Brake caliper */}
      <mesh position={[0.15, -0.05, 0.02 * zFlip]} rotation={[Math.PI / 2, 0, 0.3]}>
        <boxGeometry args={[0.08, 0.025, 0.06]} />
        <meshStandardMaterial color={0xcc1111} metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  )
}

export default function CarModel({ scale = 1 }: CarModelProps) {
  const carBodyMat = useMaterial('car_body')
  const chromeMat = useMaterial('chrome')
  const darkMetalMat = useMaterial('dark_metal')
  const grilleMat = useMaterial('grille_dark')
  const headlightMat = useMaterial('headlight_housing')
  const headlightLensMat = useMaterial('headlight_lens')
  const taillightMat = useMaterial('taillight_housing')
  const diffuserFinMat = useMaterial('diffuser_fin')
  const glassWindowMat = useMaterial('glass_window')
  const mirrorGlassMat = useMaterial('mirror_glass')
  const doorGapMat = useMaterial('door_gap')
  const underbodyMat = useMaterial('underbody')
  const quality = useQuality()

  const bodyGeometry = useMemo(() => {
    const shape = createBodyShape()
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 1.5,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: quality === 'low' ? 1 : 3,
      curveSegments: quality === 'low' ? 6 : 12,
    })
    geo.center()
    return geo
  }, [quality])

  const mirrorLeftRef = useRef<THREE.Mesh>(null)
  const mirrorRightRef = useRef<THREE.Mesh>(null)

  return (
    <group scale={[scale, scale, scale]}>
      {/* MAIN BODY */}
      <mesh geometry={bodyGeometry} castShadow receiveShadow>
        <primitive object={carBodyMat} attach="material" />
      </mesh>

      {/* Front bumper / splitter */}
      <mesh position={[2.35, 0.2, 0]}>
        <boxGeometry args={[0.3, 0.15, 1.65]} />
        <primitive object={darkMetalMat} attach="material" />
      </mesh>

      {/* Front grille */}
      <mesh position={[2.5, 0.42, 0]}>
        <boxGeometry args={[0.08, 0.2, 1.2]} />
        <primitive object={grilleMat} attach="material" />
      </mesh>

      {/* Grille chrome surround */}
      <mesh position={[2.51, 0.42, 0]}>
        <boxGeometry args={[0.02, 0.24, 1.25]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>

      {/* Hood power bulge */}
      <mesh position={[1.5, 0.72, 0]}>
        <boxGeometry args={[1.4, 0.06, 0.6]} />
        <primitive object={carBodyMat} attach="material" />
      </mesh>

      {/* Rear bumper / diffuser */}
      <mesh position={[-2.35, 0.2, 0]}>
        <boxGeometry args={[0.3, 0.15, 1.65]} />
        <primitive object={darkMetalMat} attach="material" />
      </mesh>

      {/* Rear diffuser fins */}
      {[-0.4, -0.15, 0.15, 0.4].map((z, i) => (
        <mesh key={`fin-${i}`} position={[-2.42, 0.15, z]}>
          <boxGeometry args={[0.15, 0.08, 0.02]} />
          <primitive object={diffuserFinMat} attach="material" />
        </mesh>
      ))}

      {/* Rear spoiler lip */}
      <mesh position={[-2.15, 0.75, 0]}>
        <boxGeometry args={[0.1, 0.03, 1.5]} />
        <primitive object={carBodyMat} attach="material" />
      </mesh>

      {/* Side skirts */}
      <mesh position={[0, 0.18, 0.78]}>
        <boxGeometry args={[3.8, 0.08, 0.06]} />
        <primitive object={darkMetalMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.18, -0.78]}>
        <boxGeometry args={[3.8, 0.08, 0.06]} />
        <primitive object={darkMetalMat} attach="material" />
      </mesh>

      {/* WINDOWS */}
      <mesh position={[0.92, 0.95, 0]} rotation={[0, 0, -0.55]}>
        <planeGeometry args={[0.65, 1.35]} />
        <primitive object={glassWindowMat} attach="material" />
      </mesh>
      <mesh position={[-1.35, 0.95, 0]} rotation={[0, 0, 0.45]}>
        <planeGeometry args={[0.5, 1.25]} />
        <primitive object={glassWindowMat} attach="material" />
      </mesh>
      <mesh position={[-0.1, 1.05, 0.76]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.3, 0.35]} />
        <primitive object={glassWindowMat} attach="material" />
      </mesh>
      <mesh position={[-0.1, 1.05, -0.76]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.3, 0.35]} />
        <primitive object={glassWindowMat} attach="material" />
      </mesh>

      {/* Chrome window trim */}
      <mesh position={[-0.1, 1.23, 0.77]}>
        <boxGeometry args={[1.5, 0.015, 0.015]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>
      <mesh position={[-0.1, 1.23, -0.77]}>
        <boxGeometry args={[1.5, 0.015, 0.015]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>

      {/* HEADLIGHTS — emissive strips, no pointLights */}
      <group position={[2.45, 0.52, 0.5]}>
        <mesh>
          <boxGeometry args={[0.12, 0.1, 0.3]} />
          <primitive object={headlightMat} attach="material" />
        </mesh>
        <mesh position={[0.02, -0.02, 0]}>
          <boxGeometry args={[0.02, 0.02, 0.25]} />
          <meshBasicMaterial color={0xffffff} />
        </mesh>
        <mesh position={[0.04, 0.01, 0]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <primitive object={headlightLensMat} attach="material" />
        </mesh>
      </group>
      <group position={[2.45, 0.52, -0.5]}>
        <mesh>
          <boxGeometry args={[0.12, 0.1, 0.3]} />
          <primitive object={headlightMat} attach="material" />
        </mesh>
        <mesh position={[0.02, -0.02, 0]}>
          <boxGeometry args={[0.02, 0.02, 0.25]} />
          <meshBasicMaterial color={0xffffff} />
        </mesh>
        <mesh position={[0.04, 0.01, 0]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <primitive object={headlightLensMat} attach="material" />
        </mesh>
      </group>

      {/* TAILLIGHTS — emissive strips, no pointLights */}
      <group position={[-2.42, 0.55, 0.5]}>
        <mesh>
          <boxGeometry args={[0.08, 0.08, 0.35]} />
          <primitive object={taillightMat} attach="material" />
        </mesh>
        <mesh position={[-0.01, 0, 0]}>
          <boxGeometry args={[0.02, 0.04, 0.3]} />
          <meshBasicMaterial color={0xff1111} />
        </mesh>
      </group>
      <group position={[-2.42, 0.55, -0.5]}>
        <mesh>
          <boxGeometry args={[0.08, 0.08, 0.35]} />
          <primitive object={taillightMat} attach="material" />
        </mesh>
        <mesh position={[-0.01, 0, 0]}>
          <boxGeometry args={[0.02, 0.04, 0.3]} />
          <meshBasicMaterial color={0xff1111} />
        </mesh>
      </group>

      {/* Taillight connecting bar */}
      <mesh position={[-2.44, 0.55, 0]}>
        <boxGeometry args={[0.02, 0.02, 0.6]} />
        <meshBasicMaterial color={0x881111} />
      </mesh>

      {/* Exhaust tips */}
      <mesh position={[-2.5, 0.18, 0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.05, 0.1, 12]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>
      <mesh position={[-2.5, 0.18, -0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.05, 0.1, 12]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>

      {/* Side mirrors */}
      <group position={[0.65, 1.0, 0.82]}>
        <mesh ref={mirrorLeftRef}>
          <boxGeometry args={[0.12, 0.06, 0.08]} />
          <primitive object={carBodyMat} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[0.1, 0.05]} />
          <primitive object={mirrorGlassMat} attach="material" />
        </mesh>
        <mesh position={[-0.04, -0.02, -0.03]}>
          <boxGeometry args={[0.02, 0.02, 0.06]} />
          <primitive object={carBodyMat} attach="material" />
        </mesh>
      </group>
      <group position={[0.65, 1.0, -0.82]}>
        <mesh ref={mirrorRightRef}>
          <boxGeometry args={[0.12, 0.06, 0.08]} />
          <primitive object={carBodyMat} attach="material" />
        </mesh>
        <mesh position={[0, 0, -0.045]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.1, 0.05]} />
          <primitive object={mirrorGlassMat} attach="material" />
        </mesh>
        <mesh position={[-0.04, -0.02, 0.03]}>
          <boxGeometry args={[0.02, 0.02, 0.06]} />
          <primitive object={carBodyMat} attach="material" />
        </mesh>
      </group>

      {/* Door handles */}
      <mesh position={[0.2, 0.75, 0.78]}>
        <boxGeometry args={[0.12, 0.02, 0.015]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>
      <mesh position={[0.2, 0.75, -0.78]}>
        <boxGeometry args={[0.12, 0.02, 0.015]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>

      {/* Door panel gaps — skip on low tier */}
      {quality !== 'low' && (
        <>
          <mesh position={[0.5, 0.65, 0.77]}>
            <boxGeometry args={[0.005, 0.6, 0.01]} />
            <primitive object={doorGapMat} attach="material" />
          </mesh>
          <mesh position={[0.5, 0.65, -0.77]}>
            <boxGeometry args={[0.005, 0.6, 0.01]} />
            <primitive object={doorGapMat} attach="material" />
          </mesh>
        </>
      )}

      {/* Fender flares — skip on low tier */}
      {quality !== 'low' && (
        <>
          <mesh position={[1.4, 0.42, 0.78]}>
            <boxGeometry args={[0.8, 0.2, 0.08]} />
            <primitive object={carBodyMat} attach="material" />
          </mesh>
          <mesh position={[1.4, 0.42, -0.78]}>
            <boxGeometry args={[0.8, 0.2, 0.08]} />
            <primitive object={carBodyMat} attach="material" />
          </mesh>
          <mesh position={[-1.3, 0.42, 0.8]}>
            <boxGeometry args={[0.9, 0.22, 0.1]} />
            <primitive object={carBodyMat} attach="material" />
          </mesh>
          <mesh position={[-1.3, 0.42, -0.8]}>
            <boxGeometry args={[0.9, 0.22, 0.1]} />
            <primitive object={carBodyMat} attach="material" />
          </mesh>
        </>
      )}

      {/* Wheels */}
      <WheelAssembly position={[1.45, 0.3, 0.85]} side="left" />
      <WheelAssembly position={[1.45, 0.3, -0.85]} side="right" />
      <WheelAssembly position={[-1.35, 0.3, 0.85]} side="left" />
      <WheelAssembly position={[-1.35, 0.3, -0.85]} side="right" />

      {/* Underbody */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[4.5, 0.04, 1.5]} />
        <primitive object={underbodyMat} attach="material" />
      </mesh>

      {/* Antenna (shark fin) */}
      <mesh position={[-0.8, 1.28, 0]}>
        <coneGeometry args={[0.03, 0.08, 4]} />
        <primitive object={carBodyMat} attach="material" />
      </mesh>
    </group>
  )
}
