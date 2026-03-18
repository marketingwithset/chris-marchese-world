'use client'

import { useState, useEffect, useRef } from 'react'
import { ZONES } from '@/lib/scene/zones'
import type { RoomId } from '@/types'

interface ZoneProximityProps {
  playerX: number
  playerZ: number
  currentRoom: RoomId
  visible: boolean
}

/**
 * Shows the name of the zone the player is currently standing in.
 * Fades in/out smoothly when entering/leaving zones.
 */
export default function ZoneProximity({
  playerX,
  playerZ,
  currentRoom,
  visible,
}: ZoneProximityProps) {
  const [activeZone, setActiveZone] = useState<string | null>(null)
  const [fadeIn, setFadeIn] = useState(false)
  const prevZone = useRef<string | null>(null)

  useEffect(() => {
    if (!visible) {
      setActiveZone(null)
      return
    }

    // Check which zone the player is in
    let found: string | null = null
    let foundColor = '#c9a84c'

    for (const zone of Object.values(ZONES)) {
      if (zone.room !== currentRoom) continue
      if (zone.id.startsWith('portal_')) continue

      const [zx, , zz] = zone.position
      const [dw, , dd] = zone.dimensions
      const halfW = dw / 2
      const halfD = dd / 2

      if (
        playerX >= zx - halfW &&
        playerX <= zx + halfW &&
        playerZ >= zz - halfD &&
        playerZ <= zz + halfD
      ) {
        found = zone.name
        foundColor = zone.color
        break
      }
    }

    if (found !== prevZone.current) {
      prevZone.current = found
      if (found) {
        setActiveZone(found)
        setFadeIn(true)
        // Auto-hide after 3 seconds
        const timer = setTimeout(() => setFadeIn(false), 3000)
        return () => clearTimeout(timer)
      } else {
        setFadeIn(false)
      }
    }
  }, [playerX, playerZ, currentRoom, visible])

  if (!activeZone || !visible) return null

  return (
    <div
      className="fixed z-20 pointer-events-none left-1/2 -translate-x-1/2"
      style={{
        bottom: 80,
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      <div
        className="px-5 py-2 text-xs uppercase tracking-[0.25em]"
        style={{
          fontFamily: 'var(--font-heading)',
          color: '#f0ead8',
          background: 'rgba(6, 6, 6, 0.6)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(201, 168, 76, 0.15)',
        }}
      >
        {activeZone}
      </div>
    </div>
  )
}
