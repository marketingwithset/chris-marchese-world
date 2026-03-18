'use client'

import type { ViewMode } from '@/types'

interface ViewToggleProps {
  mode: ViewMode
  onToggle: () => void
}

export default function ViewToggle({ mode, onToggle }: ViewToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 z-30 flex items-center gap-2 px-3 py-1.5 text-xs uppercase tracking-widest transition-all hover:scale-105"
      style={{
        fontFamily: 'var(--font-heading)',
        background: 'rgba(6, 6, 6, 0.7)',
        border: '1px solid rgba(201, 168, 76, 0.2)',
        color: '#f0ead8',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span style={{ color: mode === 'world' ? '#c9a84c' : '#a09880' }}>World</span>
      <span style={{ color: '#a09880' }}>|</span>
      <span style={{ color: mode === 'classic' ? '#c9a84c' : '#a09880' }}>Classic</span>
    </button>
  )
}
