/**
 * Centralized Material Registry
 *
 * All materials defined once. To swap a texture:
 *   1. Change the `map` factory here to load a real texture
 *   2. Every component using getMaterial('name') auto-updates
 *
 * Future: swap createConcreteTexture() → useTexture('/textures/concrete.jpg')
 */
import * as THREE from 'three'
import {
  createConcreteTexture,
  createConcreteRoughnessMap,
  createPlasterTexture,
  createBrushedGoldTexture,
  createMarbleTexture,
  createDarkMetalTexture,
  createBlueTintTexture,
  createGreenTintTexture,
} from './textures'

export interface MaterialDef {
  color?: string | number
  map?: () => THREE.CanvasTexture
  roughnessMap?: () => THREE.CanvasTexture
  normalMap?: () => THREE.CanvasTexture
  metalness?: number
  roughness?: number
  transparent?: boolean
  opacity?: number
  side?: THREE.Side
  emissive?: string | number
  emissiveIntensity?: number
}

export const MATERIAL_DEFS: Record<string, MaterialDef> = {
  // === FLOORS ===
  floor_concrete: {
    color: '#2e2e2e',
    map: createConcreteTexture,
    roughnessMap: createConcreteRoughnessMap,
    metalness: 0.15,
    roughness: 0.75,
  },
  floor_marble: {
    color: '#181818',
    map: createMarbleTexture,
    metalness: 0.25,
    roughness: 0.5,
  },
  floor_capital: {
    color: '#080a10',
    map: () => createBlueTintTexture(),
    metalness: 0.2,
    roughness: 0.7,
  },
  floor_growth: {
    color: '#080a08',
    map: () => createGreenTintTexture(),
    metalness: 0.2,
    roughness: 0.7,
  },

  // === WALLS ===
  wall_plaster: {
    color: '#353028',
    map: createPlasterTexture,
    metalness: 0.0,
    roughness: 0.85,
  },
  wall_capital: {
    color: '#0a0e18',
    map: () => createBlueTintTexture(),
    metalness: 0.05,
    roughness: 0.85,
  },
  wall_growth: {
    color: '#0a100a',
    map: () => createGreenTintTexture(),
    metalness: 0.05,
    roughness: 0.85,
  },
  wall_infra: {
    color: '#101010',
    map: createPlasterTexture,
    metalness: 0.05,
    roughness: 0.85,
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
  },
  gold_dim: {
    color: '#8a7233',
    metalness: 0.6,
    roughness: 0.3,
  },
  dark_metal: {
    color: '#1a1a1a',
    map: createDarkMetalTexture,
    metalness: 0.5,
    roughness: 0.4,
  },
  car_body: {
    color: '#0d0d0d',
    map: createDarkMetalTexture,
    metalness: 0.85,
    roughness: 0.12,
  },
  chrome: {
    color: '#cccccc',
    metalness: 0.95,
    roughness: 0.05,
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

// Material cache
const materialCache = new Map<string, THREE.MeshStandardMaterial>()
const textureCache = new Map<string, THREE.CanvasTexture>()

function getCachedTexture(key: string, factory: () => THREE.CanvasTexture): THREE.CanvasTexture {
  if (!textureCache.has(key)) {
    textureCache.set(key, factory())
  }
  return textureCache.get(key)!
}

export function getMaterial(name: string): THREE.MeshStandardMaterial {
  if (materialCache.has(name)) return materialCache.get(name)!

  const def = MATERIAL_DEFS[name]
  if (!def) {
    console.warn(`Material "${name}" not found, returning default`)
    const fallback = new THREE.MeshStandardMaterial({ color: 0xff00ff })
    return fallback
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

  // Only generate canvas textures in the browser
  const canCreateTextures = typeof document !== 'undefined'

  if (def.map && canCreateTextures) {
    try { params.map = getCachedTexture(`${name}_map`, def.map) } catch { /* skip */ }
  }
  if (def.roughnessMap && canCreateTextures) {
    try { params.roughnessMap = getCachedTexture(`${name}_roughness`, def.roughnessMap) } catch { /* skip */ }
  }
  if (def.normalMap && canCreateTextures) {
    try { params.normalMap = getCachedTexture(`${name}_normal`, def.normalMap) } catch { /* skip */ }
  }

  const mat = new THREE.MeshStandardMaterial(params)
  materialCache.set(name, mat)
  return mat
}

/** Clear all cached materials and textures (useful for hot reload) */
export function clearMaterialCache(): void {
  materialCache.forEach((mat) => mat.dispose())
  textureCache.forEach((tex) => tex.dispose())
  materialCache.clear()
  textureCache.clear()
}
