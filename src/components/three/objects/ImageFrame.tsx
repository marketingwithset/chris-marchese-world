'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { createPlaceholderImageTexture } from '@/lib/materials/textures'

interface ImageFrameProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
  label?: string
  bgColor?: string
  textColor?: string
  borderColor?: number
  /** When provided, loads a real image instead of placeholder */
  src?: string
  onClick?: () => void
  interactable?: boolean
  contentId?: string
}

export default function ImageFrame({
  position,
  rotation = [0, 0, 0],
  width = 2,
  height = 2.5,
  label = 'IMAGE',
  bgColor = '#2a2a2a',
  textColor = '#666666',
  borderColor = 0xc9a84c,
  onClick,
  interactable = false,
  contentId,
}: ImageFrameProps) {
  const borderWidth = 0.1
  const frameDepth = 0.08

  // Generate placeholder texture (only in browser)
  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null
    return createPlaceholderImageTexture(label, bgColor, textColor, 512, 512)
  }, [label, bgColor, textColor])

  return (
    <group position={position} rotation={rotation}>
      {/* Frame border */}
      {/* Top */}
      <mesh position={[0, height / 2 + borderWidth / 2, 0]}>
        <boxGeometry args={[width + borderWidth * 2, borderWidth, frameDepth]} />
        <meshStandardMaterial color={borderColor} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -height / 2 - borderWidth / 2, 0]}>
        <boxGeometry args={[width + borderWidth * 2, borderWidth, frameDepth]} />
        <meshStandardMaterial color={borderColor} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Left */}
      <mesh position={[-width / 2 - borderWidth / 2, 0, 0]}>
        <boxGeometry args={[borderWidth, height, frameDepth]} />
        <meshStandardMaterial color={borderColor} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Right */}
      <mesh position={[width / 2 + borderWidth / 2, 0, 0]}>
        <boxGeometry args={[borderWidth, height, frameDepth]} />
        <meshStandardMaterial color={borderColor} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Canvas/Image surface */}
      <mesh
        position={[0, 0, -0.02]}
        onClick={onClick ? (e) => { e.stopPropagation(); onClick() } : undefined}
        onPointerOver={onClick ? () => { document.body.style.cursor = 'pointer' } : undefined}
        onPointerOut={onClick ? () => { document.body.style.cursor = 'default' } : undefined}
        userData={interactable ? { interactable: true, contentId } : undefined}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={texture || undefined} metalness={0.05} roughness={0.85} />
      </mesh>
    </group>
  )
}
