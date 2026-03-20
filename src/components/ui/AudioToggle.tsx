'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

interface AudioToggleProps {
  volume?: number
  playerX?: number
  playerZ?: number
  currentRoom?: string
}

// Zone audio configs: position, radius, and oscillator settings
const ZONE_AUDIO = [
  {
    id: 'automotive',
    x: 0, z: 8,
    radius: 12,
    room: 'main',
    // Low engine idle rumble
    create: (ctx: AudioContext) => {
      const osc = ctx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.value = 40
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 120
      filter.Q.value = 2
      // Subtle tremolo for idle vibration
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 6
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 0.003
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      osc.connect(filter)
      lfo.start()
      osc.start()
      return { output: filter, nodes: [osc, lfo] }
    },
  },
  {
    id: 'film',
    x: -14, z: -3,
    radius: 10,
    room: 'main',
    // Projector whir + subtle film reel
    create: (ctx: AudioContext) => {
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate
        // Mechanical clicking pattern
        const click = Math.sin(t * 24 * Math.PI * 2) > 0.95 ? 0.15 : 0
        // Fan/projector hum
        const hum = Math.sin(t * 120 * Math.PI * 2) * 0.01
        data[i] = (click + hum + (Math.random() - 0.5) * 0.005)
      }
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 2000
      source.connect(filter)
      source.start()
      return { output: filter, nodes: [source] }
    },
  },
  {
    id: 'fashion',
    x: 14, z: -3,
    radius: 10,
    room: 'main',
    // Soft ambient pad \u2014 runway background music feel
    create: (ctx: AudioContext) => {
      const buffer = ctx.createBuffer(2, ctx.sampleRate * 4, ctx.sampleRate)
      const left = buffer.getChannelData(0)
      const right = buffer.getChannelData(1)
      for (let i = 0; i < left.length; i++) {
        const t = i / ctx.sampleRate
        // Ethereal pad chord (Cmaj7-ish)
        const pad =
          Math.sin(t * 261.6 * Math.PI * 2) * 0.02 +
          Math.sin(t * 329.6 * Math.PI * 2) * 0.015 +
          Math.sin(t * 392.0 * Math.PI * 2) * 0.01 +
          Math.sin(t * 493.9 * Math.PI * 2) * 0.008
        // Slow envelope
        const env = 0.5 + 0.5 * Math.sin(t * 0.25 * Math.PI * 2)
        left[i] = pad * env
        right[i] = pad * env * 0.9
      }
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 3000
      source.connect(filter)
      source.start()
      return { output: filter, nodes: [source] }
    },
  },
  {
    id: 'gallery',
    x: 0, z: -13,
    radius: 10,
    room: 'main',
    // Museum silence \u2014 just very soft reverb-like ambience
    create: (ctx: AudioContext) => {
      const buffer = ctx.createBuffer(2, ctx.sampleRate * 6, ctx.sampleRate)
      const left = buffer.getChannelData(0)
      const right = buffer.getChannelData(1)
      for (let i = 0; i < left.length; i++) {
        const t = i / ctx.sampleRate
        // Very subtle room tone
        const roomTone = (Math.random() - 0.5) * 0.003
        // Occasional soft chime-like ping
        const chimePhase = (t % 3) / 3
        const chime = chimePhase < 0.02
          ? Math.sin(t * 1200 * Math.PI * 2) * 0.01 * Math.exp(-chimePhase * 200)
          : 0
        left[i] = roomTone + chime
        right[i] = roomTone + chime * 0.7
      }
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true
      source.start()
      return { output: source, nodes: [source] }
    },
  },
]

interface ZoneAudioState {
  gain: GainNode
  nodes: (AudioBufferSourceNode | OscillatorNode)[]
}

const BG_MUSIC_SRC = '/audio/fly-to-tulum.mp3'
const BG_MUSIC_VOLUME = 0.2

export default function AudioToggle({
  volume = 0.15,
  playerX = 0,
  playerZ = 12,
  currentRoom = 'main',
}: AudioToggleProps) {
  const [playing, setPlaying] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const nodesRef = useRef<AudioBufferSourceNode[]>([])
  const zoneStatesRef = useRef<Map<string, ZoneAudioState>>(new Map())
  const bgMusicRef = useRef<HTMLAudioElement | null>(null)

  // Create base ambient soundscape
  const createAmbience = useCallback((ctx: AudioContext, gain: GainNode) => {
    const sampleRate = ctx.sampleRate
    const duration = 8
    const bufferSize = sampleRate * duration
    const buffer = ctx.createBuffer(2, bufferSize, sampleRate)
    const left = buffer.getChannelData(0)
    const right = buffer.getChannelData(1)

    const baseFreq = 55
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate
      const drone =
        Math.sin(2 * Math.PI * baseFreq * t) * 0.12 +
        Math.sin(2 * Math.PI * baseFreq * 1.5 * t) * 0.06 +
        Math.sin(2 * Math.PI * baseFreq * 2 * t + Math.sin(t * 0.3) * 0.5) * 0.04
      const noise = (Math.random() * 2 - 1) * 0.008
      const shimmer =
        Math.sin(2 * Math.PI * 440 * t + Math.sin(t * 0.7) * 2) * 0.005 *
        (0.5 + 0.5 * Math.sin(t * 0.2))
      let env = 1
      const fadeLen = sampleRate * 0.5
      if (i < fadeLen) env = i / fadeLen
      if (i > bufferSize - fadeLen) env = (bufferSize - i) / fadeLen
      const pan = Math.sin(t * 0.1) * 0.3
      left[i] = (drone + noise + shimmer) * env * (0.5 - pan)
      right[i] = (drone + noise + shimmer) * env * (0.5 + pan)
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
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
  }, [])

  // Initialize zone audio layers
  const initZoneAudio = useCallback((ctx: AudioContext, masterGain: GainNode) => {
    for (const zone of ZONE_AUDIO) {
      const zoneGain = ctx.createGain()
      zoneGain.gain.value = 0 // Start silent
      const { output, nodes } = zone.create(ctx)
      output.connect(zoneGain)
      zoneGain.connect(masterGain)
      zoneStatesRef.current.set(zone.id, {
        gain: zoneGain,
        nodes: nodes as (AudioBufferSourceNode | OscillatorNode)[],
      })
    }
  }, [])

  // Update zone volumes based on player proximity
  useEffect(() => {
    if (!playing || !ctxRef.current) return

    const ctx = ctxRef.current
    for (const zone of ZONE_AUDIO) {
      const state = zoneStatesRef.current.get(zone.id)
      if (!state) continue

      let targetVol = 0
      if (zone.room === currentRoom) {
        const dx = playerX - zone.x
        const dz = playerZ - zone.z
        const dist = Math.sqrt(dx * dx + dz * dz)
        if (dist < zone.radius) {
          // Smooth falloff from center to edge
          targetVol = Math.pow(1 - dist / zone.radius, 1.5) * 0.3
        }
      }

      state.gain.gain.linearRampToValueAtTime(
        targetVol,
        ctx.currentTime + 0.3
      )
    }
  }, [playerX, playerZ, currentRoom, playing])

  const toggle = useCallback(() => {
    if (!initialized) {
      const ctx = new AudioContext()
      const gain = ctx.createGain()
      gain.gain.value = 0
      gain.connect(ctx.destination)
      ctxRef.current = ctx
      masterGainRef.current = gain
      createAmbience(ctx, gain)
      initZoneAudio(ctx, gain)
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.5)

      // Start background music track
      const audio = new Audio(BG_MUSIC_SRC)
      audio.loop = true
      audio.volume = BG_MUSIC_VOLUME
      audio.play().catch(() => {})
      bgMusicRef.current = audio

      setInitialized(true)
      setPlaying(true)
      return
    }

    const ctx = ctxRef.current
    const gain = masterGainRef.current
    if (!ctx || !gain) return

    if (playing) {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8)
      bgMusicRef.current?.pause()
      setPlaying(false)
    } else {
      if (ctx.state === 'suspended') ctx.resume()
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1)
      bgMusicRef.current?.play().catch(() => {})
      setPlaying(true)
    }
  }, [initialized, playing, volume, createAmbience, initZoneAudio])

  useEffect(() => {
    return () => {
      nodesRef.current.forEach((n) => { try { n.stop() } catch {} })
      zoneStatesRef.current.forEach((state) => {
        state.nodes.forEach((n) => { try { n.stop() } catch {} })
      })
      ctxRef.current?.close()
      if (bgMusicRef.current) {
        bgMusicRef.current.pause()
        bgMusicRef.current.src = ''
      }
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
      {playing ? '\u266b' : '\u266a'}
    </button>
  )
}
