/**
 * Centralized Material Registry — PBR Texture Edition
 *
 * Core surfaces (concrete, marble, plaster, metal) use real PBR texture
 * sets from ambientCG (CC0 license). Each set includes:
 *   - Color (albedo) map
 *   - Normal map (OpenGL) — adds surface bump detail
 *   - Roughness map — spatially varying roughness
 *
 * Specialty materials (gold, glass, tinted rooms) still use procedural
 * CanvasTexture factories since they need custom colors.
 *
 * Quality tiers:
 *   - high:   Full PBR (color + normal + roughness + metalness maps)
 *   - medium: MeshStandardMaterial with color map only (no normal/roughness)
 *   - low:    MeshLambertMaterial with just color (skips PBR shader entirely)
 */
import * as THREE from 'three'
import type { QualityTier } from '@/hooks/usePerformanceTier'
import {
  createBrushedGoldTexture,
} from './textures'

// === PBR Texture file paths (relative to /public) — WebP for 86% smaller payloads ===
const TEXTURE_PATHS = {
  concrete: {
    color: '/textures/concrete/Concrete034_1K-JPG_Color.webp',
    normal: '/textures/concrete/Concrete034_1K-JPG_NormalGL.webp',
    roughness: '/textures/concrete/Concrete034_1K-JPG_Roughness.webp',
  },
  marble: {
    color: '/textures/marble/Marble006_1K-JPG_Color.webp',
    normal: '/textures/marble/Marble006_1K-JPG_NormalGL.webp',
    roughness: '/textures/marble/Marble006_1K-JPG_Roughness.webp',
  },
  plaster: {
    color: '/textures/plaster/Plaster003_1K-JPG_Color.webp',
    normal: '/textures/plaster/Plaster003_1K-JPG_NormalGL.webp',
    roughness: '/textures/plaster/Plaster003_1K-JPG_Roughness.webp',
  },
  brushed_metal: {
    color: '/textures/brushed_metal/Metal032_1K-JPG_Color.webp',
    normal: '/textures/brushed_metal/Metal032_1K-JPG_NormalGL.webp',
    roughness: '/textures/brushed_metal/Metal032_1K-JPG_Roughness.webp',
    metalness: '/textures/brushed_metal/Metal032_1K-JPG_Metalness.webp',
  },
  dark_metal: {
    color: '/textures/dark_metal/Metal030_1K-JPG_Color.webp',
    normal: '/textures/dark_metal/Metal030_1K-JPG_NormalGL.webp',
    roughness: '/textures/dark_metal/Metal030_1K-JPG_Roughness.webp',
    metalness: '/textures/dark_metal/Metal030_1K-JPG_Metalness.webp',
  },
} as const

// === Preload priority textures (near spawn point) ===
// These are loaded immediately on page load for instant visual quality.
// Spawn is at [0, 1.6, 12] facing -Z, so floor + walls are first visible.
export const PRELOAD_TEXTURES = [
  TEXTURE_PATHS.concrete.color,   // floor
  TEXTURE_PATHS.plaster.color,    // walls
  TEXTURE_PATHS.concrete.normal,  // floor detail
  TEXTURE_PATHS.plaster.normal,   // wall detail
] as const

// === Texture loader (singleton) ===
let _loader: THREE.TextureLoader | null = null
function getLoader(): THREE.TextureLoader {
  if (!_loader) _loader = new THREE.TextureLoader()
  return _loader
}

// === Texture cache ===
const textureFileCache = new Map<string, THREE.Texture>()
const canvasTextureCache = new Map<string, THREE.CanvasTexture>()

function loadTexture(
  path: string,
  repeat: [number, number] = [1, 1],
  isData = false
): THREE.Texture {
  const cacheKey = `${path}_${repeat[0]}_${repeat[1]}`
  if (textureFileCache.has(cacheKey)) return textureFileCache.get(cacheKey)!

  const tex = getLoader().load(path)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(repeat[0], repeat[1])
  tex.colorSpace = isData ? THREE.LinearSRGBColorSpace : THREE.SRGBColorSpace
  textureFileCache.set(cacheKey, tex)
  return tex
}

function getCachedCanvasTexture(key: string, factory: () => THREE.CanvasTexture): THREE.CanvasTexture {
  if (!canvasTextureCache.has(key)) {
    canvasTextureCache.set(key, factory())
  }
  return canvasTextureCache.get(key)!
}

// === Material definition types ===
export interface MaterialDef {
  color?: string | number
  texturePaths?: {
    color?: string
    normal?: string
    roughness?: string
    metalness?: string
  }
  textureRepeat?: [number, number]
  map?: () => THREE.CanvasTexture
  roughnessMap?: () => THREE.CanvasTexture
  normalMap?: () => THREE.CanvasTexture
  metalness?: number
  roughness?: number
  normalScale?: [number, number]
  transparent?: boolean
  opacity?: number
  side?: THREE.Side
  emissive?: string | number
  emissiveIntensity?: number
  envMapIntensity?: number
}

// === Material definitions ===
export const MATERIAL_DEFS: Record<string, MaterialDef> = {
  // === FLOORS ===
  floor_concrete: {
    texturePaths: TEXTURE_PATHS.concrete,
    textureRepeat: [6, 6],
    metalness: 0.1,
    roughness: 0.8,
  },
  floor_marble: {
    texturePaths: TEXTURE_PATHS.marble,
    textureRepeat: [4, 4],
    metalness: 0.3,
    roughness: 0.4,
  },
  floor_capital: {
    color: '#080a10',
    texturePaths: TEXTURE_PATHS.concrete,
    textureRepeat: [4, 4],
    metalness: 0.2,
    roughness: 0.7,
  },
  floor_growth: {
    color: '#080a08',
    texturePaths: TEXTURE_PATHS.concrete,
    textureRepeat: [4, 4],
    metalness: 0.2,
    roughness: 0.7,
  },

  // === WALLS ===
  wall_plaster: {
    texturePaths: TEXTURE_PATHS.plaster,
    textureRepeat: [4, 4],
    metalness: 0.0,
    roughness: 0.85,
    normalScale: [0.5, 0.5],
  },
  wall_capital: {
    color: '#0a0e18',
    texturePaths: TEXTURE_PATHS.plaster,
    textureRepeat: [3, 3],
    metalness: 0.05,
    roughness: 0.85,
    normalScale: [0.4, 0.4],
  },
  wall_growth: {
    color: '#0a100a',
    texturePaths: TEXTURE_PATHS.plaster,
    textureRepeat: [3, 3],
    metalness: 0.05,
    roughness: 0.85,
    normalScale: [0.4, 0.4],
  },
  wall_infra: {
    color: '#101010',
    texturePaths: TEXTURE_PATHS.plaster,
    textureRepeat: [4, 4],
    metalness: 0.05,
    roughness: 0.85,
    normalScale: [0.4, 0.4],
  },

  // === CEILINGS ===
  ceiling_dark: {
    color: '#151515',
    metalness: 0.05,
    roughness: 0.95,
  },

  // === METALS ===
  gold_brushed: {
    color: '#c9a84c',
    map: createBrushedGoldTexture,
    metalness: 0.85,
    roughness: 0.15,
    envMapIntensity: 1.5,
  },
  gold_dim: {
    color: '#8a7233',
    metalness: 0.6,
    roughness: 0.3,
  },
  dark_metal: {
    texturePaths: TEXTURE_PATHS.dark_metal,
    textureRepeat: [2, 2],
    metalness: 0.5,
    roughness: 0.4,
  },
  car_body: {
    color: '#0d0d0d',
    texturePaths: TEXTURE_PATHS.dark_metal,
    textureRepeat: [1, 1],
    metalness: 0.9,
    roughness: 0.08,
    envMapIntensity: 2.0,
  },
  chrome: {
    color: '#cccccc',
    metalness: 0.95,
    roughness: 0.05,
    envMapIntensity: 2.5,
  },
  brushed_metal_panel: {
    texturePaths: TEXTURE_PATHS.brushed_metal,
    textureRepeat: [1, 1],
    metalness: 0.7,
    roughness: 0.25,
    envMapIntensity: 1.2,
  },

  // === CAR DETAIL MATERIALS (consolidated from inline) ===
  grille_dark: {
    color: '#080808',
    metalness: 0.2,
    roughness: 0.8,
  },
  headlight_housing: {
    color: '#111111',
    metalness: 0.5,
    roughness: 0.3,
  },
  headlight_lens: {
    color: '#eeeeff',
    metalness: 0.8,
    roughness: 0.05,
    emissive: '#ddeeff',
    emissiveIntensity: 0.3,
  },
  taillight_housing: {
    color: '#220000',
    metalness: 0.3,
    roughness: 0.4,
  },
  diffuser_fin: {
    color: '#1a1a1a',
    metalness: 0.4,
    roughness: 0.5,
  },
  glass_window: {
    color: '#0a1520',
    metalness: 0.3,
    roughness: 0.05,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
  },
  mirror_glass: {
    color: '#667788',
    metalness: 0.9,
    roughness: 0.05,
  },
  door_gap: {
    color: '#050505',
  },
  underbody: {
    color: '#080808',
    metalness: 0.1,
    roughness: 0.9,
  },

  // === FABRICS ===
  fabric_gold: {
    color: '#8b6914',
    metalness: 0.05,
    roughness: 0.85,
  },
  fabric_black: {
    color: '#1a1a1a',
    metalness: 0.05,
    roughness: 0.9,
  },
  fabric_purple: {
    color: '#2a2a3a',
    metalness: 0.05,
    roughness: 0.85,
  },

  // === GLASS ===
  glass: {
    color: '#1a3050',
    transparent: true,
    opacity: 0.15,
    metalness: 0.1,
    roughness: 0.1,
    envMapIntensity: 1.5,
  },
  glass_blue: {
    color: '#4a7faa',
    transparent: true,
    opacity: 0.15,
    metalness: 0.1,
    roughness: 0.1,
  },
  windshield: {
    color: '#1a3050',
    transparent: true,
    opacity: 0.7,
    metalness: 0.2,
    roughness: 0.1,
    envMapIntensity: 1.8,
  },

  // === SPECIALTY ===
  money_green: {
    color: '#1a5c2a',
    metalness: 0.1,
    roughness: 0.8,
  },
  runway_dark: {
    color: '#0d0d0d',
    metalness: 0.4,
    roughness: 0.4,
  },
  portal_energy: {
    color: '#c9a84c',
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
  },
  screen_dark: {
    color: '#050510',
    metalness: 0.3,
    roughness: 0.4,
    emissive: '#020208',
    emissiveIntensity: 0.2,
  },

  // === SHARED ARCHITECTURAL ACCENTS ===
  wainscoting: {
    color: '#151515',
    metalness: 0.1,
    roughness: 0.7,
  },
  baseboard: {
    color: '#111111',
    metalness: 0.2,
    roughness: 0.6,
  },
  crown_molding: {
    color: '#1a1a1a',
    metalness: 0.15,
    roughness: 0.6,
  },
  pillar_cap: {
    color: '#141414',
    metalness: 0.2,
    roughness: 0.5,
  },
}

// === Material cache (keyed by name + tier) ===
const materialCache = new Map<string, THREE.Material>()

export function getMaterial(name: string, tier: QualityTier = 'high'): THREE.MeshStandardMaterial {
  const cacheKey = `${name}_${tier}`
  if (materialCache.has(cacheKey)) return materialCache.get(cacheKey) as THREE.MeshStandardMaterial

  const def = MATERIAL_DEFS[name]
  if (!def) {
    console.warn(`Material "${name}" not found, returning default`)
    return new THREE.MeshStandardMaterial({ color: 0xff00ff })
  }

  const isBrowser = typeof document !== 'undefined'

  // LOW TIER: MeshLambertMaterial with just color — massive GPU savings
  if (tier === 'low') {
    const params: THREE.MeshLambertMaterialParameters = {}
    if (def.color !== undefined) params.color = new THREE.Color(def.color)
    if (def.transparent !== undefined) params.transparent = def.transparent
    if (def.opacity !== undefined) params.opacity = def.opacity
    if (def.side !== undefined) params.side = def.side
    if (def.emissive !== undefined) params.emissive = new THREE.Color(def.emissive)
    if (def.emissiveIntensity !== undefined) params.emissiveIntensity = def.emissiveIntensity

    // Still load color map on low for textured surfaces (cheap on Lambert)
    if (def.texturePaths?.color && isBrowser) {
      params.map = loadTexture(def.texturePaths.color, def.textureRepeat || [1, 1])
    }

    const mat = new THREE.MeshLambertMaterial(params)
    materialCache.set(cacheKey, mat)
    // Cast to MeshStandardMaterial for type compat — Lambert is a subset
    return mat as unknown as THREE.MeshStandardMaterial
  }

  // MEDIUM/HIGH TIER: MeshStandardMaterial
  const params: THREE.MeshStandardMaterialParameters = {}

  if (def.color !== undefined) params.color = new THREE.Color(def.color)
  if (def.metalness !== undefined) params.metalness = def.metalness
  if (def.roughness !== undefined) params.roughness = def.roughness
  if (def.transparent !== undefined) params.transparent = def.transparent
  if (def.opacity !== undefined) params.opacity = def.opacity
  if (def.side !== undefined) params.side = def.side
  if (def.emissive !== undefined) params.emissive = new THREE.Color(def.emissive)
  if (def.emissiveIntensity !== undefined) params.emissiveIntensity = def.emissiveIntensity
  if (def.envMapIntensity !== undefined) params.envMapIntensity = def.envMapIntensity

  // Load file-based PBR textures
  if (def.texturePaths && isBrowser) {
    const repeat = def.textureRepeat || [1, 1]
    const tp = def.texturePaths

    if (tp.color) {
      params.map = loadTexture(tp.color, repeat)
    }

    // Normal + roughness + metalness maps only on HIGH tier
    if (tier === 'high') {
      if (tp.normal) {
        params.normalMap = loadTexture(tp.normal, repeat, true)
        if (def.normalScale) {
          params.normalScale = new THREE.Vector2(def.normalScale[0], def.normalScale[1])
        }
      }
      if (tp.roughness) {
        params.roughnessMap = loadTexture(tp.roughness, repeat, true)
      }
      if (tp.metalness) {
        params.metalnessMap = loadTexture(tp.metalness, repeat, true)
      }
    }
  }

  // Procedural canvas textures (for gold, tinted materials)
  if (def.map && isBrowser && !def.texturePaths) {
    try { params.map = getCachedCanvasTexture(`${name}_map`, def.map) } catch { /* skip */ }
  }
  if (def.roughnessMap && isBrowser && tier === 'high') {
    try { params.roughnessMap = getCachedCanvasTexture(`${name}_roughness`, def.roughnessMap) } catch { /* skip */ }
  }
  if (def.normalMap && isBrowser && tier === 'high') {
    try { params.normalMap = getCachedCanvasTexture(`${name}_normal`, def.normalMap) } catch { /* skip */ }
  }

  const mat = new THREE.MeshStandardMaterial(params)
  materialCache.set(cacheKey, mat)
  return mat
}

/** Clear all cached materials and textures (useful for hot reload) */
export function clearMaterialCache(): void {
  materialCache.forEach((mat) => mat.dispose())
  textureFileCache.forEach((tex) => tex.dispose())
  canvasTextureCache.forEach((tex) => tex.dispose())
  materialCache.clear()
  textureFileCache.clear()
  canvasTextureCache.clear()
}
