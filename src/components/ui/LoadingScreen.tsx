'use client'

import { useState, useEffect, useMemo } from 'react'

interface LoadingScreenProps {
  onComplete: () => void
}

const TIPS = [
  'WASD or Arrow Keys to move',
  'Mouse to look around',
  'Hold SHIFT to sprint',
  'Press E near objects to interact',
  'Walk through portals to enter rooms',
  'Toggle Day/Night with ☀ button',
  'Click items to view details',
]

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  const tip = useMemo(() => TIPS[Math.floor(Math.random() * TIPS.length)], [])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setFadeOut(true)
          setTimeout(onComplete, 800)
          return 100
        }
        // Accelerate near end for snappy feel
        const increment = prev < 60 ? 1.5 : prev < 85 ? 3 : 5
        return Math.min(prev + increment, 100)
      })
    }, 40)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-700"
      style={{
        background: '#060606',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'auto',
      }}
    >
      {/* Decorative line top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.3), transparent)' }}
      />

      {/* Brand mark */}
      <h1
        className="text-6xl sm:text-7xl mb-2 tracking-wider"
        style={{
          fontFamily: 'var(--font-heading)',
          color: '#c9a84c',
          textShadow: '0 0 40px rgba(201, 168, 76, 0.15)',
        }}
      >
        MARCHESE
      </h1>
      <p
        className="text-xs uppercase tracking-[0.3em] mb-2"
        style={{ color: '#a09880' }}
      >
        Digital World
      </p>

      {/* Tagline */}
      <p
        className="text-xs uppercase tracking-[0.2em] mb-12"
        style={{ color: 'rgba(201, 168, 76, 0.4)', fontFamily: 'var(--font-heading)' }}
      >
        Setting The Pace
      </p>

      {/* Progress bar */}
      <div
        className="w-56 h-0.5 overflow-hidden"
        style={{ background: 'rgba(201, 168, 76, 0.08)' }}
      >
        <div
          className="h-full transition-all duration-150 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #8a7233, #c9a84c)',
          }}
        />
      </div>

      {/* Percentage */}
      <p
        className="mt-3 text-xs tabular-nums"
        style={{ color: '#c9a84c', fontFamily: 'var(--font-mono)' }}
      >
        {Math.round(progress)}%
      </p>

      {/* Loading tip */}
      <p
        className="mt-8 text-xs"
        style={{ color: '#a09880', fontFamily: 'var(--font-mono)' }}
      >
        {progress < 100 ? `TIP: ${tip}` : 'Welcome'}
      </p>

      {/* Controls guide at bottom */}
      <div
        className="absolute bottom-12 flex gap-8 text-xs"
        style={{ color: 'rgba(160, 152, 128, 0.5)', fontFamily: 'var(--font-mono)' }}
      >
        <span>WASD Move</span>
        <span>Mouse Look</span>
        <span>E Interact</span>
        <span>SHIFT Sprint</span>
      </div>

      {/* Decorative line bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.3), transparent)' }}
      />
    </div>
  )
}
