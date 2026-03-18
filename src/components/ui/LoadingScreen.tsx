'use client'

import { useState, useEffect } from 'react'

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setFadeOut(true)
          setTimeout(onComplete, 600)
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500"
      style={{
        background: '#060606',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'auto',
      }}
    >
      {/* Brand mark */}
      <h1
        className="text-5xl mb-2 tracking-wider"
        style={{ fontFamily: 'var(--font-heading)', color: '#c9a84c' }}
      >
        MARCHESE
      </h1>
      <p
        className="text-xs uppercase tracking-[0.3em] mb-12"
        style={{ color: '#a09880' }}
      >
        Digital World
      </p>

      {/* Progress bar */}
      <div
        className="w-48 h-0.5 overflow-hidden"
        style={{ background: 'rgba(201, 168, 76, 0.1)' }}
      >
        <div
          className="h-full transition-all duration-100"
          style={{
            width: `${progress}%`,
            background: '#c9a84c',
          }}
        />
      </div>

      {/* Loading text */}
      <p
        className="mt-4 text-xs"
        style={{ color: '#a09880', fontFamily: 'var(--font-mono)' }}
      >
        {progress < 100 ? 'Entering the world...' : 'Welcome'}
      </p>
    </div>
  )
}
