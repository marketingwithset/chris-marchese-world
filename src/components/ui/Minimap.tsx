'use client'

import { useRef, useEffect, useCallback } from 'react'
import type { RoomId } from '@/types'

interface MinimapProps {
  currentRoom: RoomId
  playerX: number
  playerZ: number
  playerYaw: number
  visible: boolean
}

// Zone positions in main room (approximate centers, scaled to minimap)
const MAIN_ZONES = [
  { id: 'art', label: 'ART', x: 0.75, z: 0.25, color: '#c9a84c' },
  { id: 'film', label: 'FILM', x: 0.12, z: 0.5, color: '#4a7fa5' },
  { id: 'auto', label: 'AUTO', x: 0.75, z: 0.75, color: '#c9a84c' },
  { id: 'fashion', label: 'FASHION', x: 0.25, z: 0.8, color: '#c9a84c' },
  { id: 'phone', label: 'CONTACT', x: 0.88, z: 0.5, color: '#c0392b' },
  { id: 'money', label: 'SHOP', x: 0.5, z: 0.75, color: '#c9a84c' },
]

const PORTALS = [
  { id: 'capital', label: 'CAP', x: 0.2, z: 0.15, color: '#4a7fa5' },
  { id: 'infra', label: 'INFRA', x: 0.5, z: 0.08, color: '#c9a84c' },
  { id: 'growth', label: 'GROWTH', x: 0.8, z: 0.15, color: '#5a9e6f' },
]

// Room dimensions for coordinate mapping
const ROOM_DIMS: Record<string, { w: number; d: number }> = {
  main: { w: 40, d: 30 },
  capital: { w: 30, d: 25 },
  infrastructure: { w: 35, d: 30 },
  growth: { w: 30, d: 25 },
}

export default function Minimap({
  currentRoom,
  playerX,
  playerZ,
  playerYaw,
  visible,
}: MinimapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 140
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    // Clear
    ctx.clearRect(0, 0, size, size)

    // Background
    ctx.fillStyle = 'rgba(6, 6, 6, 0.85)'
    ctx.fillRect(0, 0, size, size)

    // Border
    ctx.strokeStyle = 'rgba(201, 168, 76, 0.25)'
    ctx.lineWidth = 1
    ctx.strokeRect(0.5, 0.5, size - 1, size - 1)

    // Room outline
    const pad = 15
    const innerW = size - pad * 2
    const innerH = size - pad * 2
    ctx.strokeStyle = 'rgba(201, 168, 76, 0.15)'
    ctx.lineWidth = 0.5
    ctx.strokeRect(pad, pad, innerW, innerH)

    // Zone markers (main room only)
    if (currentRoom === 'main') {
      ctx.font = '7px "DM Mono", monospace'
      ctx.textAlign = 'center'

      // Zones
      for (const zone of MAIN_ZONES) {
        const zx = pad + zone.x * innerW
        const zy = pad + zone.z * innerH

        ctx.fillStyle = zone.color + '30'
        ctx.beginPath()
        ctx.arc(zx, zy, 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = zone.color + '80'
        ctx.fillText(zone.label, zx, zy + 11)
      }

      // Portals
      for (const portal of PORTALS) {
        const px = pad + portal.x * innerW
        const py = pad + portal.z * innerH

        ctx.fillStyle = portal.color + '60'
        ctx.beginPath()
        ctx.moveTo(px, py - 4)
        ctx.lineTo(px + 3.5, py + 2.5)
        ctx.lineTo(px - 3.5, py + 2.5)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = portal.color + '80'
        ctx.fillText(portal.label, px, py + 12)
      }
    }

    // Player position
    const dims = ROOM_DIMS[currentRoom] || ROOM_DIMS.main
    // Map world coords to minimap: x [-w/2, w/2] → [pad, pad+innerW]
    const px = pad + ((playerX + dims.w / 2) / dims.w) * innerW
    const pz = pad + ((playerZ + dims.d / 2) / dims.d) * innerH

    // Clamp
    const clampedX = Math.max(pad + 3, Math.min(pad + innerW - 3, px))
    const clampedZ = Math.max(pad + 3, Math.min(pad + innerH - 3, pz))

    // Direction indicator
    ctx.save()
    ctx.translate(clampedX, clampedZ)
    ctx.rotate(-playerYaw + Math.PI)

    // Field of view cone
    ctx.fillStyle = 'rgba(201, 168, 76, 0.08)'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-8, -16)
    ctx.lineTo(8, -16)
    ctx.closePath()
    ctx.fill()

    // Player dot
    ctx.fillStyle = '#c9a84c'
    ctx.beginPath()
    ctx.moveTo(0, -5)
    ctx.lineTo(3, 3)
    ctx.lineTo(-3, 3)
    ctx.closePath()
    ctx.fill()

    ctx.restore()

    // Room label
    ctx.fillStyle = 'rgba(201, 168, 76, 0.5)'
    ctx.font = '8px "Bebas Neue", "Impact", sans-serif'
    ctx.textAlign = 'center'
    const roomLabel = currentRoom === 'main' ? 'MAIN ROOM' :
                      currentRoom === 'capital' ? 'CAPITAL' :
                      currentRoom === 'infrastructure' ? 'INFRASTRUCTURE' : 'GROWTH'
    ctx.fillText(roomLabel, size / 2, size - 4)
  }, [currentRoom, playerX, playerZ, playerYaw])

  useEffect(() => {
    let raf: number
    const loop = () => {
      draw()
      raf = requestAnimationFrame(loop)
    }
    if (visible) {
      loop()
    }
    return () => cancelAnimationFrame(raf)
  }, [draw, visible])

  if (!visible) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed z-30"
      style={{
        bottom: 16,
        right: 16,
        width: 140,
        height: 140,
        borderRadius: 4,
      }}
    />
  )
}
