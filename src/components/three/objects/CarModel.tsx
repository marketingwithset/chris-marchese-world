'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMaterial } from '@/lib/materials/useMaterial'

/**
 * Detailed procedural car model — dark luxury GT / sport sedan.
 * Built from composed Three.js primitives to approximate a muscular,
 * low-slung GT body with aggressive lines, chrome accents, and proper
 * wheel/tire proportions.
 *
 * Designed to sit on the automotive display turntable at eye-catching scale.
 */

interface CarModelProps {
  /** Overall length scale factor (default 1 = ~4.8m real-world) */
  scale?: number
}

// Helper: create a smooth extruded shape for the body side profile
function createBodyShape(): THREE.Shape {
  const s = new THREE.Shape()

  // Bottom line (undercarriage) — slight ground clearance curve
  s.moveTo(-2.4, 0.15)
  s.lineTo(2.4, 0.15)

  // Front bumper rise
  s.quadraticCurveTo(2.55, 0.15, 2.55, 0.35)
  s.lineTo(2.55, 0.55)

  // Hood line — slopes gently upward to windshield
  s.quadraticCurveTo(2.5, 0.6, 2.3, 0.62)
  s.lineTo(1.2, 0.68)

  // Windshield (A-pillar) — steep rake
  s.lineTo(0.65, 1.18)

  // Roofline — gentle arc peaking slightly forward of center
  s.quadraticCurveTo(0.2, 1.28, -0.3, 1.25)

  // Rear window (C-pillar) — fastback slope
  s.lineTo(-1.1, 1.0)
  s.quadraticCurveTo(-1.4, 0.9, -1.6, 0.78)

  // Trunk / rear decklid
  s.lineTo(-2.2, 0.7)

  // Rear bumper drop
  s.quadraticCurveTo(-2.45, 0.68, -2.5, 0.55)
  s.lineTo(-2.5, 0.3)
  s.quadraticCurveTo(-2.5, 0.15, -2.4, 0.15)

  return s
}

// Create wheel geometry (spoked alloy look)
function WheelAssembly({ position, side }: { position: [number, number, number]; side: 'left' | 'right' }) {
  const tireColor = 0x111111
  const rimColor = 0x888888
  const brakeDiskColor = 0x555555
  const zFlip = side === 'left' ? 1 : -1

  return (
    <group position={position}>
      {/* Tire (torus for rounded look) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.1, 12, 24]} />
        <meshStandardMaterial color={tireColor} metalness={0.05} roughness={0.95} />
      </mesh>

      {/* Rim — outer disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03 * zFlip]}>
        <cylinderGeometry args={[0.26, 0.26, 0.04, 24]} />
        <meshStandardMaterial color={rimColor} metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Rim — inner hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.05 * zFlip]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 12]} />
        <meshStandardMaterial color={0x333333} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Rim spokes (5 spoke pattern) */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2
        const cx = Math.cos(angle) * 0.17
        const cy = Math.sin(angle) * 0.17
        return (
          <mesh
            key={i}
            position={[cx, cy, 0.04 * zFlip]}
            rotation={[Math.PI / 2, 0, angle]}
          >
            <boxGeometry args={[0.04, 0.02, 0.2]} />
            <meshStandardMaterial color={rimColor} metalness={0.85} roughness={0.15} />
          </mesh>
        )
      })}

      {/* Brake disk (visible through spokes) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.015, 24]} />
        <meshStandardMaterial color={brakeDiskColor} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Brake caliper (red accent) */}
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
  const windshieldMat = useMaterial('windshield')
  const darkMetalMat = useMaterial('dark_metal')

  // Extruded body shape
  const bodyGeometry = useMemo(() => {
    const shape = createBodyShape()
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 1.5,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 3,
      curveSegments: 12,
    }
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    geo.center()
    return geo
  }, [])

  // Side mirrors use a subtle animation
  const mirrorLeftRef = useRef<THREE.Mesh>(null)
  const mirrorRightRef = useRef<THREE.Mesh>(null)

  return (
    <group scale={[scale, scale, scale]}>
      {/* ===== MAIN BODY (extruded profile) ===== */}
      <mesh geometry={bodyGeometry} castShadow receiveShadow>
        <primitive object={carBodyMat} attach="material" />
      </mesh>

      {/* ===== BODY PANELS — additional shaping ===== */}

      {/* Front bumper / splitter */}
      <mesh position={[2.35, 0.2, 0]} castShadow>
        <boxGeometry args={[0.3, 0.15, 1.65]} />
        <primitive object={darkMetalMat} attach="material" />
      </mesh>

      {/* Front grille — aggressive intake */}
      <mesh position={[2.5, 0.42, 0]}>
        <boxGeometry args={[0.08, 0.2, 1.2]} />
        <meshStandardMaterial color={0x080808} metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Grille chrome surround */}
      <mesh position={[2.51, 0.42, 0]}>
        <boxGeometry args={[0.02, 0.24, 1.25]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>

      {/* Hood power bulge */}
      <mesh position={[1.5, 0.72, 0]} castShadow>
        <boxGeometry args={[1.4, 0.06, 0.6]} />
        <primitive object={carBodyMat} attach="material" />
      </mesh>

      {/* Rear bumper / diffuser */}
      <mesh position={[-2.35, 0.2, 0]} castShadow>
        <boxGeometry args={[0.3, 0.15, 1.65]} />
        <primitive object={darkMetalMat} attach="material" />
      </mesh>

      {/* Rear diffuser fins */}
      {[-0.4, -0.15, 0.15, 0.4].map((z, i) => (
        <mesh key={`fin-${i}`} position={[-2.42, 0.15, z]}>
          <boxGeometry args={[0.15, 0.08, 0.02]} />
          <meshStandardMaterial color={0x1a1a1a} metalness={0.4} roughness={0.5} />
        </mesh>
      ))}

      {/* Rear spoiler lip */}
      <mesh position={[-2.15, 0.75, 0]} castShadow>
        <boxGeometry args={[0.1, 0.03, 1.5]} />
        <primitive object={carBodyMat} attach="material" />
      </mesh>

      {/* ===== SIDE SKIRTS / ROCKER PANELS ===== */}
      <mesh position={[0, 0.18, 0.78]} castShadow>
        <boxGeometry args={[3.8, 0.08, 0.06]} />
        <primitive object={darkMetalMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.18, -0.78]} castShadow>
        <boxGeometry args={[3.8, 0.08, 0.06]} />
        <primitive object={darkMetalMat} attach="material" />
      </mesh>

      {/* ===== WINDOW GLASS ===== */}

      {/* Windshield */}
      <mesh position={[0.92, 0.95, 0]} rotation={[0, 0, -0.55]}>
        <planeGeometry args={[0.65, 1.35]} />
        <meshStandardMaterial
          color={0x0a1520}
          metalness={0.3}
          roughness={0.05}
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rear window */}
      <mesh position={[-1.35, 0.95, 0]} rotation={[0, 0, 0.45]}>
        <planeGeometry args={[0.5, 1.25]} />
        <meshStandardMaterial
          color={0x0a1520}
          metalness={0.3}
          roughness={0.05}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Side windows — left */}
      <mesh position={[-0.1, 1.05, 0.76]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.3, 0.35]} />
        <meshStandardMaterial
          color={0x0a1520}
          metalness={0.3}
          roughness={0.05}
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Side windows — right */}
      <mesh position={[-0.1, 1.05, -0.76]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.3, 0.35]} />
        <meshStandardMaterial
          color={0x0a1520}
          metalness={0.3}
          roughness={0.05}
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ===== CHROME WINDOW TRIM ===== */}
      {/* Left side trim */}
      <mesh position={[-0.1, 1.23, 0.77]}>
        <boxGeometry args={[1.5, 0.015, 0.015]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>
      {/* Right side trim */}
      <mesh position={[-0.1, 1.23, -0.77]}>
        <boxGeometry args={[1.5, 0.015, 0.015]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>

      {/* ===== HEADLIGHTS ===== */}
      {/* Left headlight — LED strip look */}
      <group position={[2.45, 0.52, 0.5]}>
        <mesh>
          <boxGeometry args={[0.12, 0.1, 0.3]} />
          <meshStandardMaterial color={0x111111} metalness={0.5} roughness={0.3} />
        </mesh>
        {/* DRL strip */}
        <mesh position={[0.02, -0.02, 0]}>
          <boxGeometry args={[0.02, 0.02, 0.25]} />
          <meshBasicMaterial color={0xffffff} />
        </mesh>
        {/* Projector lens */}
        <mesh position={[0.04, 0.01, 0]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color={0xeeeeff} metalness={0.8} roughness={0.05} emissive={0xddeeff} emissiveIntensity={0.3} />
        </mesh>
        {/* Headlight glow */}
        <pointLight color={0xeeeeff} intensity={0.3} distance={3} decay={2} />
      </group>

      {/* Right headlight */}
      <group position={[2.45, 0.52, -0.5]}>
        <mesh>
          <boxGeometry args={[0.12, 0.1, 0.3]} />
          <meshStandardMaterial color={0x111111} metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0.02, -0.02, 0]}>
          <boxGeometry args={[0.02, 0.02, 0.25]} />
          <meshBasicMaterial color={0xffffff} />
        </mesh>
        <mesh position={[0.04, 0.01, 0]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color={0xeeeeff} metalness={0.8} roughness={0.05} emissive={0xddeeff} emissiveIntensity={0.3} />
        </mesh>
        <pointLight color={0xeeeeff} intensity={0.3} distance={3} decay={2} />
      </group>

      {/* ===== TAILLIGHTS ===== */}
      {/* Left taillight — horizontal LED bar */}
      <group position={[-2.42, 0.55, 0.5]}>
        <mesh>
          <boxGeometry args={[0.08, 0.08, 0.35]} />
          <meshStandardMaterial color={0x220000} metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[-0.01, 0, 0]}>
          <boxGeometry args={[0.02, 0.04, 0.3]} />
          <meshBasicMaterial color={0xff1111} />
        </mesh>
        <pointLight color={0xff2222} intensity={0.15} distance={2} decay={2} />
      </group>

      {/* Right taillight */}
      <group position={[-2.42, 0.55, -0.5]}>
        <mesh>
          <boxGeometry args={[0.08, 0.08, 0.35]} />
          <meshStandardMaterial color={0x220000} metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[-0.01, 0, 0]}>
          <boxGeometry args={[0.02, 0.04, 0.3]} />
          <meshBasicMaterial color={0xff1111} />
        </mesh>
        <pointLight color={0xff2222} intensity={0.15} distance={2} decay={2} />
      </group>

      {/* Taillight connecting bar (modern full-width LED) */}
      <mesh position={[-2.44, 0.55, 0]}>
        <boxGeometry args={[0.02, 0.02, 0.6]} />
        <meshBasicMaterial color={0x881111} />
      </mesh>

      {/* ===== EXHAUST TIPS ===== */}
      <mesh position={[-2.5, 0.18, 0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.05, 0.1, 12]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>
      <mesh position={[-2.5, 0.18, -0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.05, 0.1, 12]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>

      {/* ===== SIDE MIRRORS ===== */}
      <group position={[0.65, 1.0, 0.82]}>
        <mesh ref={mirrorLeftRef}>
          <boxGeometry args={[0.12, 0.06, 0.08]} />
          <primitive object={carBodyMat} attach="material" />
        </mesh>
        {/* Mirror glass */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[0.1, 0.05]} />
          <meshStandardMaterial color={0x667788} metalness={0.9} roughness={0.05} />
        </mesh>
        {/* Stalk */}
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
          <meshStandardMaterial color={0x667788} metalness={0.9} roughness={0.05} />
        </mesh>
        <mesh position={[-0.04, -0.02, 0.03]}>
          <boxGeometry args={[0.02, 0.02, 0.06]} />
          <primitive object={carBodyMat} attach="material" />
        </mesh>
      </group>

      {/* ===== DOOR HANDLES (chrome) ===== */}
      <mesh position={[0.2, 0.75, 0.78]}>
        <boxGeometry args={[0.12, 0.02, 0.015]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>
      <mesh position={[0.2, 0.75, -0.78]}>
        <boxGeometry args={[0.12, 0.02, 0.015]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>

      {/* ===== DOOR LINE / PANEL GAP ===== */}
      <mesh position={[0.5, 0.65, 0.77]}>
        <boxGeometry args={[0.005, 0.6, 0.01]} />
        <meshStandardMaterial color={0x050505} />
      </mesh>
      <mesh position={[0.5, 0.65, -0.77]}>
        <boxGeometry args={[0.005, 0.6, 0.01]} />
        <meshStandardMaterial color={0x050505} />
      </mesh>

      {/* ===== FENDER FLARES (muscular bulge) ===== */}
      {/* Front fenders */}
      <mesh position={[1.4, 0.42, 0.78]} castShadow>
        <boxGeometry args={[0.8, 0.2, 0.08]} />
        <primitive object={carBodyMat} attach="material" />
      </mesh>
      <mesh position={[1.4, 0.42, -0.78]} castShadow>
        <boxGeometry args={[0.8, 0.2, 0.08]} />
        <primitive object={carBodyMat} attach="material" />
      </mesh>

      {/* Rear fenders (wider — muscular haunches) */}
      <mesh position={[-1.3, 0.42, 0.8]} castShadow>
        <boxGeometry args={[0.9, 0.22, 0.1]} />
        <primitive object={carBodyMat} attach="material" />
      </mesh>
      <mesh position={[-1.3, 0.42, -0.8]} castShadow>
        <boxGeometry args={[0.9, 0.22, 0.1]} />
        <primitive object={carBodyMat} attach="material" />
      </mesh>

      {/* ===== WHEELS ===== */}
      <WheelAssembly position={[1.45, 0.3, 0.85]} side="left" />
      <WheelAssembly position={[1.45, 0.3, -0.85]} side="right" />
      <WheelAssembly position={[-1.35, 0.3, 0.85]} side="left" />
      <WheelAssembly position={[-1.35, 0.3, -0.85]} side="right" />

      {/* ===== UNDERBODY (dark slab to prevent see-through) ===== */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[4.5, 0.04, 1.5]} />
        <meshStandardMaterial color={0x080808} metalness={0.1} roughness={0.9} />
      </mesh>

      {/* ===== ANTENNA (shark fin) ===== */}
      <mesh position={[-0.8, 1.28, 0]}>
        <coneGeometry args={[0.03, 0.08, 4]} />
        <primitive object={carBodyMat} attach="material" />
      </mesh>
    </group>
  )
}
