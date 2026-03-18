'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

interface AudioToggleProps {
  /** Initial volume 0–1 */
  volume?: number
}

/**
 * Ambient audio toggle — plays subtle atmospheric loop.
 * Uses Web Audio API for smooth fade in/out.
 * Audio is generated procedurally (no file needed).
 */
export default function AudioToggle({ volume = 0.15 }: AudioToggleProps) {
  const [playing, setPlaying] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const nodesRef = useRef<AudioBufferSourceNode[]>([])

  // Create ambient soundscape procedurally
  const createAmbience = useCallback((ctx: AudioContext, gain: GainNode) => {
    const sampleRate = ctx.sampleRate
    const duration = 8 // 8-second loop
    const bufferSize = sampleRate * duration

    // Create buffer with ambient tones
    const buffer = ctx.createBuffer(2, bufferSize, sampleRate)
    const left = buffer.getChannelData(0)
    const right = buffer.getChannelData(1)

    // Layer 1: Deep ambient pad (low drone)
    const baseFreq = 55 // A1
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate
      // Slowly evolving drone
      const drone =
        Math.sin(2 * Math.PI * baseFreq * t) * 0.12 +
        Math.sin(2 * Math.PI * baseFreq * 1.5 * t) * 0.06 +
        Math.sin(2 * Math.PI * baseFreq * 2 * t + Math.sin(t * 0.3) * 0.5) * 0.04

      // Layer 2: Filtered noise (room tone)
      const noise = (Math.random() * 2 - 1) * 0.008

      // Layer 3: Subtle shimmer
      const shimmer =
        Math.sin(2 * Math.PI * 440 * t + Math.sin(t * 0.7) * 2) * 0.005 *
        (0.5 + 0.5 * Math.sin(t * 0.2))

      // Crossfade envelope for seamless loop
      let env = 1
      const fadeLen = sampleRate * 0.5
      if (i < fadeLen) env = i / fadeLen
      if (i > bufferSize - fadeLen) env = (bufferSize - i) / fadeLen

      // Slight stereo spread
      const pan = Math.sin(t * 0.1) * 0.3
      left[i] = (drone + noise + shimmer) * env * (0.5 - pan)
      right[i] = (drone + noise + shimmer) * env * (0.5 + pan)
    }

    // Create source and connect
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    // Add reverb-like effect with delay
    const delay = ctx.createDelay(0.5)
    delay.delayTime.value = 0.3
    const feedback = ctx.createGain()
    feedback.gain.value = 0.2
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 800

    source.connect(gain)
    source.connect(delay)
    delay.connect(filter)
    filter.connect(feedback)
    feedback.connect(delay)
    filter.connect(gain)

    source.start()
    nodesRef.current.push(source)

    return source
  }, [])

  const toggle = useCallback(() => {
    if (!initialized) {
      // First click: create audio context (requires user gesture)
      const ctx = new AudioContext()
      const gain = ctx.createGain()
      gain.gain.value = 0
      gain.connect(ctx.destination)

      ctxRef.current = ctx
      gainRef.current = gain

      createAmbience(ctx, gain)

      // Fade in
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.5)

      setInitialized(true)
      setPlaying(true)
      return
    }

    const ctx = ctxRef.current
    const gain = gainRef.current
    if (!ctx || !gain) return

    if (playing) {
      // Fade out
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8)
      setPlaying(false)
    } else {
      // Resume and fade in
      if (ctx.state === 'suspended') ctx.resume()
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1)
      setPlaying(true)
    }
  }, [initialized, playing, volume, createAmbience])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      nodesRef.current.forEach((n) => { try { n.stop() } catch {} })
      ctxRef.current?.close()
    }
  }, [])

  return (
    <button
      onClick={toggle}
      className="fixed bottom-4 left-4 z-30 w-10 h-10 flex items-center justify-center text-lg transition-all hover:scale-110"
      style={{
        background: 'rgba(6, 6, 6, 0.7)',
        border: '1px solid rgba(201, 168, 76, 0.2)',
        color: playing ? '#c9a84c' : '#a09880',
        backdropFilter: 'blur(8px)',
        borderRadius: '50%',
      }}
      title={playing ? 'Mute Ambience' : 'Play Ambience'}
    >
      {playing ? '♫' : '♪'}
    </button>
  )
}
