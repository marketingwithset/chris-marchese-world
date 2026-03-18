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
 * To swap any texture: change the paths in TEXTURE_PATHS, everything
 * using that material auto-updates.
 */
import * as THREE from 'three'
import {
  createBrushedGoldTexture,
  createBlueTintTexture,
  createGreenTintTexture,
  createPlaceholderImageTexture,
} from './textures'

// Re-export for consumers that still need procedural textures
export { createPlaceholderImageTexture }

// === PBR Texture file paths (relative to /public) ===
const TEXTURE_PATHS = {
  concrete: {
    color: '/textures/concrete/Concrete034_1K-JPG_Color.jpg',
    normal: '/textures/concrete/Concrete034_1K-JPG_NormalGL.jpg',
    roughness: '/textures/concrete/Concrete034_1K-JPG_Roughness.jpg',
  },
  marble: {
    color: '/textures/marble/Marble006_1K-JPG_Color.jpg',
    normal: '/textures/marble/Marble006_1K-JPG_NormalGL.jpg',
    roughness: '/textures/marble/Marble006_1K-JPG_Roughness.jpg',
  },
  plaster: {
    color: '/textures/plaster/Plaster003_1K-JPG_Color.jpg',
    normal: '/textures/plaster/Plaster003_1K-JPG_NormalGL.jpg',
    roughness: '/textures/plaster/Plaster003_1K-JPG_Roughness.jpg',
  },
  brushed_metal: {
    color: '/textures/brushed_metal/Metal032_1K-JPG_Color.jpg',
    normal: '/textures/brushed_metal/Metal032_1K-JPG_NormalGL.jpg',
    roughness: '/textures/brushed_metal/Metal032_1K-JPG_Roughness.jpg',
    metalness: '/textures/brushed_metal/Metal032_1K-JPG_Metalness.jpg',
  },
  dark_metal: {
    color: '/textures/dark_metal/Metal030_1K-JPG_Color.jpg',
    normal: '/textures/dark_metal/Metal030_1K-JPG_NormalGL.jpg',
    roughness: '/textures/dark_metal/Metal030_1K-JPG_Roughness.jpg',
    metalness: '/textures/dark_metal/Metal030_1K-JPG_Metalness.jpg',
  },
} as const

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
  // File-based PBR textures
  texturePaths?: {
    color?: string
    normal?: string
    roughness?: string
    metalness?: string
  }
  textureRepeat?: [number, number]
  // Procedural canvas textures (fallback)
  map?: () => THREE.CanvasTexture
  roughnessMap?: () => THREE.CanvasTexture
  normalMap?: () => THREE.CanvasTexture
  // Standard material properties
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

  // === METALS (real PBR textures) ===
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
}

// === Material cache ===
const materialCache = new Map<string, THREE.MeshStandardMaterial>()

export function getMaterial(name: string): THREE.MeshStandardMaterial {
  if (materialCache.has(name)) return materialCache.get(name)!

  const def = MATERIAL_DEFS[name]
  if (!def) {
    console.warn(`Material "${name}" not found, returning default`)
    return new THREE.MeshStandardMaterial({ color: 0xff00ff })
  }

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

  const isBrowser = typeof document !== 'undefined'

  // Load file-based PBR textures
  if (def.texturePaths && isBrowser) {
    const repeat = def.textureRepeat || [1, 1]
    const tp = def.texturePaths

    if (tp.color) {
      params.map = loadTexture(tp.color, repeat)
    }
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

  // Procedural canvas textures (for gold, tinted materials)
  if (def.map && isBrowser && !def.texturePaths) {
    try { params.map = getCachedCanvasTexture(`${name}_map`, def.map) } catch { /* skip */ }
  }
  if (def.roughnessMap && isBrowser) {
    try { params.roughnessMap = getCachedCanvasTexture(`${name}_roughness`, def.roughnessMap) } catch { /* skip */ }
  }
  if (def.normalMap && isBrowser) {
    try { params.normalMap = getCachedCanvasTexture(`${name}_normal`, def.normalMap) } catch { /* skip */ }
  }

  const mat = new THREE.MeshStandardMaterial(params)
  materialCache.set(name, mat)
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
