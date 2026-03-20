'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import LoadingScreen from '@/components/ui/LoadingScreen'
import ViewToggle from '@/components/ui/ViewToggle'
import type { ViewMode } from '@/types'

const WorldScene = dynamic(() => import('@/components/three/WorldScene'), {
  ssr: false,
})

const ClassicHome = dynamic(() => import('@/components/classic/ClassicHome'), {
  ssr: false,
})

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('world')

  // Persist view mode preference
  useEffect(() => {
    const saved = localStorage.getItem('cm-view-mode') as ViewMode | null
    if (saved) setViewMode(saved)
  }, [])

  const handleToggleView = useCallback(() => {
    setViewMode((prev) => {
      const next = prev === 'world' ? 'classic' : 'world'
      localStorage.setItem('cm-view-mode', next)
      return next
    })
  }, [])

  const handleLoadComplete = useCallback(() => {
    setLoaded(true)
  }, [])

  return (
    <>
      {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}

      {loaded && (
        <>
          <ViewToggle mode={viewMode} onToggle={handleToggleView} />
          {viewMode === 'world' ? <WorldScene /> : <ClassicHome onEnterWorld={() => {
            setViewMode('world')
            localStorage.setItem('cm-view-mode', 'world')
          }} />}
        </>
      )}
    </>
  )
}
