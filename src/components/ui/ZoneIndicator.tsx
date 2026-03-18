'use client'

import { getZonesForRoom, getMainZones, getPortalZones } from '@/lib/scene/zones'
import type { RoomId } from '@/types'

interface ZoneIndicatorProps {
  onNavigate: (zoneId: string) => void
  visible: boolean
  currentRoom: RoomId
  onReturnToMain: () => void
}

export default function ZoneIndicator({ onNavigate, visible, currentRoom, onReturnToMain }: ZoneIndicatorProps) {
  if (!visible) return null

  const isSubRoom = currentRoom !== 'main'

  // For main room: show non-portal zones + portal zones separately
  // For sub-rooms: show that room's zones + back button
  const mainZones = getMainZones()
  const portalZones = getPortalZones()
  const roomZones = getZonesForRoom(currentRoom)

  const overviewKey = currentRoom === 'main' ? 'overview' : `${currentRoom}_overview`

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 flex-wrap justify-center max-w-2xl">
      {/* Back to Main button (sub-rooms only) */}
      {isSubRoom && (
        <button
          onClick={onReturnToMain}
          className="px-4 py-1.5 text-xs uppercase tracking-widest transition-all hover:scale-105"
          style={{
            fontFamily: 'var(--font-heading)',
            background: 'rgba(201, 168, 76, 0.2)',
            border: '1px solid rgba(201, 168, 76, 0.6)',
            color: '#c9a84c',
            backdropFilter: 'blur(8px)',
          }}
        >
          ← Main Room
        </button>
      )}

      {/* Overview button */}
      <button
        onClick={() => onNavigate(overviewKey)}
        className="px-3 py-1.5 text-xs uppercase tracking-widest transition-all hover:scale-105"
        style={{
          fontFamily: 'var(--font-heading)',
          background: 'rgba(201, 168, 76, 0.15)',
          border: '1px solid rgba(201, 168, 76, 0.4)',
          color: '#c9a84c',
          backdropFilter: 'blur(8px)',
        }}
      >
        Overview
      </button>

      {/* Main room zones */}
      {currentRoom === 'main' && (
        <>
          {mainZones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => onNavigate(zone.id)}
              className="px-3 py-1.5 text-xs uppercase tracking-widest transition-all hover:scale-105"
              style={{
                fontFamily: 'var(--font-heading)',
                background: 'rgba(6, 6, 6, 0.7)',
                border: `1px solid ${zone.color}40`,
                color: zone.color,
                backdropFilter: 'blur(8px)',
              }}
            >
              {zone.label}
            </button>
          ))}

          {/* Portal buttons (slightly larger, accent-bordered) */}
          {portalZones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => onNavigate(zone.id)}
              className="px-4 py-2 text-xs uppercase tracking-widest transition-all hover:scale-105 font-bold"
              style={{
                fontFamily: 'var(--font-heading)',
                background: `${zone.color}15`,
                border: `2px solid ${zone.color}80`,
                color: zone.color,
                backdropFilter: 'blur(8px)',
              }}
            >
              ⬡ {zone.label}
            </button>
          ))}
        </>
      )}

      {/* Sub-room zones */}
      {isSubRoom &&
        roomZones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => onNavigate(zone.id)}
            className="px-3 py-1.5 text-xs uppercase tracking-widest transition-all hover:scale-105"
            style={{
              fontFamily: 'var(--font-heading)',
              background: 'rgba(6, 6, 6, 0.7)',
              border: `1px solid ${zone.color}40`,
              color: zone.color,
              backdropFilter: 'blur(8px)',
            }}
          >
            {zone.label}
          </button>
        ))}
    </div>
  )
}
