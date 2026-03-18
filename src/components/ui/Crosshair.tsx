'use client'

interface CrosshairProps {
  visible: boolean
  interactionPrompt?: string | null
}

export default function Crosshair({ visible, interactionPrompt }: CrosshairProps) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-20 pointer-events-none flex items-center justify-center">
      {/* Crosshair dot */}
      <div
        className="rounded-full"
        style={{
          width: 6,
          height: 6,
          background: 'rgba(201, 168, 76, 0.8)',
          boxShadow: '0 0 8px rgba(201, 168, 76, 0.4)',
        }}
      />

      {/* Interaction prompt */}
      {interactionPrompt && (
        <div
          className="absolute text-xs uppercase tracking-widest"
          style={{
            top: '55%',
            color: '#c9a84c',
            fontFamily: 'var(--font-heading)',
            textShadow: '0 0 10px rgba(201, 168, 76, 0.5)',
          }}
        >
          {interactionPrompt}
        </div>
      )}

      {/* Movement hint at bottom */}
      <div
        className="absolute bottom-8 text-xs uppercase tracking-widest opacity-40"
        style={{
          color: '#f0ead8',
          fontFamily: 'var(--font-mono)',
        }}
      >
        WASD to move · SHIFT to sprint · ESC to unlock
      </div>
    </div>
  )
}
