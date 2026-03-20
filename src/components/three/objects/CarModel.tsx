'use client'

import { useGLTF } from '@react-three/drei'

const MODEL_PATH = '/models/dodge-challenger.glb'

interface CarModelProps {
  scale?: number
}

export default function CarModel({ scale = 1 }: CarModelProps) {
  const { scene } = useGLTF(MODEL_PATH)

  return (
    <group scale={[scale, scale, scale]}>
      {/* Rotate 90° so length runs along X axis (matching the old procedural car orientation).
          Lift slightly so wheels sit on the platform surface. */}
      <primitive
        object={scene}
        rotation={[0, Math.PI / 2, 0]}
        position={[0, 0.12, 0]}
      />
    </group>
  )
}

useGLTF.preload(MODEL_PATH)
