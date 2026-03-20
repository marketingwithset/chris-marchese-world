'use client'

import { createContext, useContext } from 'react'
import { usePerformanceTier, type QualityTier } from '@/hooks/usePerformanceTier'

const QualityContext = createContext<QualityTier>('medium')

export function QualityProvider({ children }: { children: React.ReactNode }) {
  const tier = usePerformanceTier()
  return (
    <QualityContext.Provider value={tier}>
      {children}
    </QualityContext.Provider>
  )
}

export function useQuality(): QualityTier {
  return useContext(QualityContext)
}
