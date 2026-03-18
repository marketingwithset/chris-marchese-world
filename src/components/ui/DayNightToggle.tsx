'use client'

import type { LightingMode } from '@/types'

interface DayNightToggleProps {
  mode: LightingMode
  onToggle: () => void
}

export default function DayNightToggle({ mode, onToggle }: DayNightToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 left-4 z-30 w-10 h-10 flex items-center justify-center text-lg transition-all hover:scale-110"
      style={{
        background: 'rgba(6, 6, 6, 0.7)',
        border: '1px solid rgba(201, 168, 76, 0.2)',
        color: mode === 'day' ? '#c9a84c' : '#4a7fa5',
        backdropFilter: 'blur(8px)',
        borderRadius: '50%',
      }}
      title={mode === 'day' ? 'Switch to Night' : 'Switch to Day'}
    >
      {mode === 'day' ? '☀' : '☽'}
    </button>
  )
}
