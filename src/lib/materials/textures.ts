/**
 * Procedural texture factories using Canvas 2D API.
 * Each function generates a CanvasTexture — no image files needed.
 * Easy to swap: replace any factory with a loaded texture later.
 */
import * as THREE from 'three'

function createCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  return [canvas, ctx]
}

function makeTexture(canvas: HTMLCanvasElement, repeat: [number, number] = [1, 1]): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(repeat[0], repeat[1])
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// --- CONCRETE (floors) ---
export function createConcreteTexture(w = 512, h = 512): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(w, h)
  // Base medium gray — visible floor
  ctx.fillStyle = '#2e2e2e'
  ctx.fillRect(0, 0, w, h)
  // Noise overlay
  for (let i = 0; i < w * h * 0.3; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const v = Math.floor(35 + Math.random() * 20)
    ctx.fillStyle = `rgba(${v}, ${v}, ${v}, 0.4)`
    ctx.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random() * 2)
  }
  // Subtle cracks
  ctx.strokeStyle = 'rgba(20, 20, 20, 0.5)'
  ctx.lineWidth = 0.5
  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    let cx = Math.random() * w
    let cy = Math.random() * h
    ctx.moveTo(cx, cy)
    for (let j = 0; j < 8; j++) {
      cx += (Math.random() - 0.5) * 60
      cy += (Math.random() - 0.5) * 60
      ctx.lineTo(cx, cy)
    }
    ctx.stroke()
  }
  return makeTexture(canvas, [4, 4])
}

export function createConcreteRoughnessMap(w = 512, h = 512): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(w, h)
  ctx.fillStyle = '#b0b0b0'
  ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < w * h * 0.2; i++) {
    const v = Math.floor(140 + Math.random() * 80)
    ctx.fillStyle = `rgb(${v}, ${v}, ${v})`
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2)
  }
  const tex = makeTexture(canvas, [4, 4])
  tex.colorSpace = THREE.LinearSRGBColorSpace
  return tex
}

// --- PLASTER (walls) ---
export function createPlasterTexture(w = 512, h = 512): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(w, h)
  // Warmer, brighter wall tone — visible plaster
  ctx.fillStyle = '#353028'
  ctx.fillRect(0, 0, w, h)
  // Fine grain
  for (let i = 0; i < w * h * 0.15; i++) {
    const r = Math.floor(45 + Math.random() * 15)
    const g = Math.floor(40 + Math.random() * 12)
    const b = Math.floor(32 + Math.random() * 10)
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
  }
  // Subtle vertical streaks
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * w
    ctx.strokeStyle = `rgba(40, 35, 28, 0.2)`
    ctx.lineWidth = 1 + Math.random() * 3
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x + (Math.random() - 0.5) * 10, h)
    ctx.stroke()
  }
  return makeTexture(canvas, [3, 3])
}

// --- BRUSHED GOLD ---
export function createBrushedGoldTexture(w = 256, h = 256): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(w, h)
  // Gold base gradient
  const grad = ctx.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, '#c9a84c')
  grad.addColorStop(0.3, '#b8972f')
  grad.addColorStop(0.6, '#d4b45a')
  grad.addColorStop(1, '#a8892e')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
  // Horizontal brush streaks
  for (let i = 0; i < 300; i++) {
    const y = Math.random() * h
    const v = Math.random() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
    ctx.strokeStyle = v
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y + (Math.random() - 0.5) * 2)
    ctx.stroke()
  }
  return makeTexture(canvas, [2, 2])
}

// --- MARBLE (luxury floors) ---
export function createMarbleTexture(w = 512, h = 512): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(w, h)
  // White-ish base
  ctx.fillStyle = '#181818'
  ctx.fillRect(0, 0, w, h)
  // Subtle veins
  ctx.strokeStyle = 'rgba(40, 40, 40, 0.6)'
  ctx.lineWidth = 1
  for (let i = 0; i < 12; i++) {
    ctx.beginPath()
    let cx = Math.random() * w
    let cy = Math.random() * h
    ctx.moveTo(cx, cy)
    for (let j = 0; j < 6; j++) {
      cx += (Math.random() - 0.5) * 120
      cy += Math.random() * 80
      ctx.quadraticCurveTo(
        cx + (Math.random() - 0.5) * 40,
        cy + (Math.random() - 0.5) * 40,
        cx, cy
      )
    }
    ctx.stroke()
  }
  // Fine noise
  for (let i = 0; i < w * h * 0.05; i++) {
    const v = Math.floor(20 + Math.random() * 15)
    ctx.fillStyle = `rgba(${v}, ${v}, ${v}, 0.2)`
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
  }
  return makeTexture(canvas, [3, 3])
}

// --- DARK METAL (pillars, frames) ---
export function createDarkMetalTexture(w = 256, h = 256): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(w, h)
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(0, 0, w, h)
  // Subtle horizontal lines
  for (let y = 0; y < h; y += 2) {
    const v = 22 + Math.floor(Math.random() * 8)
    ctx.fillStyle = `rgb(${v}, ${v}, ${v})`
    ctx.fillRect(0, y, w, 1)
  }
  return makeTexture(canvas, [1, 1])
}

// --- PLACEHOLDER IMAGE (for swappable art/photos) ---
export function createPlaceholderImageTexture(
  label: string,
  bgColor = '#2a2a2a',
  textColor = '#666666',
  w = 512,
  h = 512
): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(w, h)
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, w, h)
  // Border
  ctx.strokeStyle = textColor
  ctx.lineWidth = 2
  ctx.strokeRect(4, 4, w - 8, h - 8)
  // Diagonal lines (placeholder pattern)
  ctx.strokeStyle = `${textColor}40`
  ctx.lineWidth = 1
  for (let i = -h; i < w; i += 40) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i + h, h)
    ctx.stroke()
  }
  // Label text
  ctx.fillStyle = textColor
  ctx.font = `bold ${Math.max(14, w / 18)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, w / 2, h / 2)
  return makeTexture(canvas)
}

// --- BLUE TINTED (capital room) ---
export function createBlueTintTexture(w = 512, h = 512): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(w, h)
  ctx.fillStyle = '#0a0e18'
  ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < w * h * 0.1; i++) {
    const r = Math.floor(8 + Math.random() * 6)
    const g = Math.floor(12 + Math.random() * 8)
    const b = Math.floor(20 + Math.random() * 12)
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
  }
  return makeTexture(canvas, [3, 3])
}

// --- GREEN TINTED (growth room) ---
export function createGreenTintTexture(w = 512, h = 512): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(w, h)
  ctx.fillStyle = '#0a100a'
  ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < w * h * 0.1; i++) {
    const r = Math.floor(8 + Math.random() * 6)
    const g = Math.floor(14 + Math.random() * 10)
    const b = Math.floor(8 + Math.random() * 6)
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
  }
  return makeTexture(canvas, [3, 3])
}
