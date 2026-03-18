'use client'

import { useRef, useCallback, useEffect } from 'react'

interface VirtualJoystickProps {
  onMove: (dx: number, dy: number) => void
  onEnd: () => void
  size?: number
}

/**
 * Touch joystick overlay for mobile movement.
 * Renders a draggable circle in the bottom-left.
 * dx/dy are normalized to [-1, 1].
 */
export default function VirtualJoystick({
  onMove,
  onEnd,
  size = 120,
}: VirtualJoystickProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const active = useRef(false)
  const origin = useRef({ x: 0, y: 0 })

  const maxDist = size / 2 - 15

  const handleStart = useCallback((clientX: number, clientY: number) => {
    active.current = true
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    origin.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
  }, [])

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!active.current || !knobRef.current) return

    let dx = clientX - origin.current.x
    let dy = clientY - origin.current.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist > maxDist) {
      dx = (dx / dist) * maxDist
      dy = (dy / dist) * maxDist
    }

    knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`
    onMove(dx / maxDist, dy / maxDist)
  }, [maxDist, onMove])

  const handleEnd = useCallback(() => {
    active.current = false
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(0px, 0px)'
    }
    onEnd()
  }, [onEnd])

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      handleStart(touch.clientX, touch.clientY)
    }
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }
    const onTouchEnd = () => handleEnd()

    const el = containerRef.current
    if (!el) return

    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [handleStart, handleMove, handleEnd])

  return (
    <div
      ref={containerRef}
      className="fixed z-30"
      style={{
        bottom: 40,
        left: 40,
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(201, 168, 76, 0.08)',
        border: '2px solid rgba(201, 168, 76, 0.2)',
        touchAction: 'none',
      }}
    >
      {/* Knob */}
      <div
        ref={knobRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 30,
          height: 30,
          marginTop: -15,
          marginLeft: -15,
          borderRadius: '50%',
          background: 'rgba(201, 168, 76, 0.4)',
          border: '2px solid rgba(201, 168, 76, 0.6)',
          transition: active.current ? 'none' : 'transform 0.15s ease-out',
        }}
      />
    </div>
  )
}
