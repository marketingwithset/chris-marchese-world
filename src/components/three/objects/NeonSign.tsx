'use client'

import { Text } from '@react-three/drei'
import { useQuality } from '@/contexts/QualityContext'

interface NeonSignProps {
  text: string
  position: [number, number, number]
  rotation?: [number, number, number]
  color?: string
  fontSize?: number
}

export default function NeonSign({
  text,
  position,
  rotation = [0, 0, 0],
  color = '#c9a84c',
  fontSize = 0.8,
}: NeonSignProps) {
  const quality = useQuality()

  return (
    <group position={position} rotation={rotation}>
      {/* Glow backdrop — skip on low tier to halve Text instances */}
      {quality !== 'low' && (
        <Text
          fontSize={fontSize * 1.05}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {text}
          <meshBasicMaterial color={color} transparent opacity={0.15} toneMapped={false} />
        </Text>
      )}

      {/* Main text */}
      <Text
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {text}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Text>
    </group>
  )
}
