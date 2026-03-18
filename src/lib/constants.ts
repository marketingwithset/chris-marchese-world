// Design system colors (hex values for Three.js materials)
export const COLORS = {
  bg: '#060606',
  card: '#111111',
  gold: '#c9a84c',
  goldDim: '#8a7233',
  text: '#f0ead8',
  textMuted: '#a09880',
  red: '#c0392b',
  green: '#27ae60',
  white: '#ffffff',
  black: '#000000',
} as const

// Three.js hex colors (0x format)
export const HEX = {
  bg: 0x060606,
  card: 0x111111,
  gold: 0xc9a84c,
  goldDim: 0x8a7233,
  text: 0xf0ead8,
  red: 0xc0392b,
  green: 0x27ae60,
  white: 0xffffff,
  black: 0x000000,
  floor: 0x0a0a0a,
  wall: 0x121212,
  ceiling: 0x080808,
  metalBlack: 0x1a1a1a,
  neonBlue: 0x4a7fa5,
  neonGold: 0xc9a84c,
  neonGreen: 0x5a9e6f,
  capitalBlue: 0x4a7fa5,
  infraGold: 0xc9a84c,
  growthGreen: 0x5a9e6f,
} as const

// Room dimensions
export const ROOM = {
  width: 40,
  depth: 30,
  height: 8,
} as const
