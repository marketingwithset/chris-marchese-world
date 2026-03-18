'use client'

import { useMemo } from 'react'
import { getMaterial } from './index'

/**
 * React hook to get a cached material by name.
 * Usage: <primitive object={useMaterial('floor_concrete')} attach="material" />
 */
export function useMaterial(name: string) {
  return useMemo(() => getMaterial(name), [name])
}
