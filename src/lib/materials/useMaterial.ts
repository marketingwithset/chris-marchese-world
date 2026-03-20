'use client'

import { useMemo } from 'react'
import { useQuality } from '@/contexts/QualityContext'
import { getMaterial } from './index'

/**
 * React hook to get a cached material by name, respecting quality tier.
 * Usage: <primitive object={useMaterial('floor_concrete')} attach="material" />
 */
export function useMaterial(name: string) {
  const quality = useQuality()
  return useMemo(() => getMaterial(name, quality), [name, quality])
}
