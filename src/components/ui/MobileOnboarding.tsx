'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'cm-mobile-onboarded'

export default function MobileOnboarding() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
      localStorage.setItem(STORAGE_KEY, '1')
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-x-0 bottom-28 z-40 flex justify-center pointer-events-none animate-fade-in"
      role="status"
      aria-live="polite"
    >
      <div
        className="pointer-events-auto px-5 py-3 text-center text-sm uppercase tracking-widest"
        style={{
          fontFamily: 'var(--font-heading)',
          color: '#c9a84c',
          background: 'rgba(6, 6, 6, 0.9)',
          border: '1px solid rgba(201, 168, 76, 0.4)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          maxWidth: '80vw',
        }}
        onClick={() => {
          setVisible(false)
          localStorage.setItem(STORAGE_KEY, '1')
        }}
      >
        Drag right side to look &bull; Joystick to move
      </div>
    </div>
  )
}
