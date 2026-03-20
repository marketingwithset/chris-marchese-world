'use client'

import { useState, useEffect } from 'react'

export type QualityTier = 'high' | 'medium' | 'low'

/**
 * Detects device capability and returns a quality tier.
 * Supports ?quality=low|medium|high URL override for testing.
 */
export function usePerformanceTier(): QualityTier {
  const [tier, setTier] = useState<QualityTier>('medium')

  useEffect(() => {
    // URL override for testing
    const params = new URLSearchParams(window.location.search)
    const override = params.get('quality') as QualityTier | null
    if (override && ['low', 'medium', 'high'].includes(override)) {
      setTier(override)
      return
    }

    // Device detection
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768

    const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 8
    const cores = navigator.hardwareConcurrency ?? 4

    if (isMobile || memory <= 4 || cores <= 4) {
      setTier('low')
    } else if (memory >= 8 && cores >= 8) {
      setTier('high')
    } else {
      setTier('medium')
    }
  }, [])

  return tier
}
