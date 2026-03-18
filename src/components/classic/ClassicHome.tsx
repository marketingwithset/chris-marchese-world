'use client'

import { useState } from 'react'
import { getZonesForRoom, ZONE_LIST } from '@/lib/scene/zones'
import { getContentByZone } from '@/lib/content/sample-data'
import type { ContentItem, RoomId } from '@/types'

const ROOM_SECTIONS: { id: RoomId; name: string; color: string }[] = [
  { id: 'main', name: 'Main Room', color: '#c9a84c' },
  { id: 'capital', name: 'SET Ventures — Capital', color: '#4a7fa5' },
  { id: 'infrastructure', name: 'Infrastructure', color: '#c9a84c' },
  { id: 'growth', name: 'SET Marketing — Growth', color: '#5a9e6f' },
]

function ContentCard({ item }: { item: ContentItem }) {
  return (
    <div
      className="p-5 transition-all hover:scale-[1.02]"
      style={{
        background: '#111111',
        border: '1px solid rgba(201, 168, 76, 0.1)',
      }}
    >
      {item.mediaType === 'image' && item.mediaUrl ? (
        <div className="w-full h-48 mb-4 overflow-hidden rounded opacity-80 transition-opacity hover:opacity-100">
          <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
        </div>
      ) : item.mediaType === 'embed' && item.mediaUrl ? (
        <div className="w-full h-48 mb-4 overflow-hidden rounded relative">
           <iframe
            src={item.mediaUrl}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div
          className="w-full h-32 mb-4"
          style={{ background: '#1a1a1a' }}
        />
      )}
      <h3
        className="text-lg mb-1"
        style={{ fontFamily: 'var(--font-heading)', color: '#f0ead8' }}
      >
        {item.title}
      </h3>
      {item.subtitle && (
        <p className="text-xs mb-2" style={{ color: '#a09880' }}>
          {item.subtitle}
        </p>
      )}
      <p className="text-sm leading-relaxed mb-3" style={{ color: '#a09880' }}>
        {item.description.length > 120 ? `${item.description.slice(0, 120)}...` : item.description}
      </p>
      {item.price && (
        <p className="text-lg" style={{ fontFamily: 'var(--font-heading)', color: '#c9a84c' }}>
          ${item.price.toLocaleString()}
        </p>
      )}
    </div>
  )
}

export default function ClassicHome() {
  const [activeRoom, setActiveRoom] = useState<RoomId | null>(null)

  const roomsToShow = activeRoom
    ? ROOM_SECTIONS.filter((r) => r.id === activeRoom)
    : ROOM_SECTIONS

  return (
    <div className="min-h-screen overflow-y-auto" style={{ background: '#060606' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
        style={{
          background: 'rgba(6, 6, 6, 0.9)',
          borderBottom: '1px solid rgba(201, 168, 76, 0.1)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <h1
          className="text-2xl tracking-wider"
          style={{ fontFamily: 'var(--font-heading)', color: '#c9a84c' }}
        >
          MARCHESE
        </h1>
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveRoom(null)}
            className="text-xs uppercase tracking-widest transition-colors"
            style={{
              fontFamily: 'var(--font-heading)',
              color: !activeRoom ? '#c9a84c' : '#a09880',
            }}
          >
            All
          </button>
          {ROOM_SECTIONS.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              className="text-xs uppercase tracking-widest transition-colors hidden sm:block"
              style={{
                fontFamily: 'var(--font-heading)',
                color: activeRoom === room.id ? room.color : '#a09880',
              }}
            >
              {room.id === 'main' ? 'WORLD' : room.id.toUpperCase()}
            </button>
          ))}
        </nav>
      </header>

      {/* Hero */}
      <section className="px-6 py-20 text-center">
        <h2
          className="text-6xl mb-3 tracking-wider"
          style={{ fontFamily: 'var(--font-heading)', color: '#f0ead8' }}
        >
          DIGITAL WORLD
        </h2>
        <p className="text-sm max-w-lg mx-auto" style={{ color: '#a09880' }}>
          Canadian producer, actor, entrepreneur, and contemporary artist. Art. Film. Capital. Infrastructure. Growth. Enter the world of Chris Marchese.
        </p>
        <div className="w-12 h-0.5 mx-auto mt-6" style={{ background: '#c9a84c' }} />
      </section>

      {/* Room sections */}
      {roomsToShow.map((room) => {
        const zones = getZonesForRoom(room.id).filter((z) => !z.id.startsWith('portal_'))
        const hasContent = zones.some((z) => getContentByZone(z.id).length > 0)
        if (!hasContent) return null

        return (
          <div key={room.id} className="mb-12">
            {/* Room divider */}
            <div className="px-6 py-6 flex items-center gap-4">
              <div className="h-px flex-1" style={{ background: `${room.color}30` }} />
              <h2
                className="text-2xl tracking-widest"
                style={{ fontFamily: 'var(--font-heading)', color: room.color }}
              >
                {room.name}
              </h2>
              <div className="h-px flex-1" style={{ background: `${room.color}30` }} />
            </div>

            {/* Zone sections within room */}
            {zones.map((zone) => {
              const items = getContentByZone(zone.id)
              if (items.length === 0) return null
              return (
                <section key={zone.id} className="px-6 pb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2" style={{ background: zone.color }} />
                    <h3
                      className="text-xl tracking-widest"
                      style={{ fontFamily: 'var(--font-heading)', color: zone.color }}
                    >
                      {zone.name}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                      <ContentCard key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )
      })}

      {/* Footer */}
      <footer className="px-6 py-8 text-center" style={{ borderTop: '1px solid rgba(201, 168, 76, 0.1)' }}>
        <p className="text-xs mb-2" style={{ color: '#a09880' }}>
          SET Enterprises — Founded 2019 — Toronto / Miami
        </p>
        <p className="text-xs" style={{ color: '#a09880' }}>
          &copy; {new Date().getFullYear()} Chris Marchese. Setting The Pace.
        </p>
      </footer>
    </div>
  )
}
