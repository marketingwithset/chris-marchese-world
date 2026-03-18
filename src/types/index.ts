export type RoomId = 'main' | 'capital' | 'infrastructure' | 'growth'

export type ZoneId =
  | 'art_gallery'
  | 'film_studio'
  | 'automotive'
  | 'fashion_runway'
  | 'telephone_booth'
  | 'money_pile'
  | 'portal_capital'
  | 'portal_infrastructure'
  | 'portal_growth'
  | 'capital_deals'
  | 'capital_services'
  | 'capital_clients'
  | 'infra_projects'
  | 'infra_systems'
  | 'infra_tech'
  | 'growth_services'
  | 'growth_results'
  | 'growth_testimonials'
  | 'growth_social'

export interface ZoneConfig {
  id: ZoneId
  name: string
  label: string
  position: [number, number, number]
  dimensions: [number, number, number]
  color: string
  hexColor: number
  room?: RoomId
}

export interface RoomConfig {
  id: RoomId
  name: string
  width: number
  depth: number
  height: number
  floorColor: number
  wallColor: number
  ceilingColor: number
  accentColor: string
  accentHex: number
}

export interface CameraPreset {
  position: [number, number, number]
  target: [number, number, number]
}

export interface ContentItem {
  id: string
  zoneId: ZoneId
  title: string
  subtitle?: string
  description: string
  image?: string
  mediaType?: 'image' | 'video' | 'embed'
  mediaUrl?: string
  metadata?: Record<string, string>
  price?: number
  purchasable?: boolean
}

export interface HotspotData {
  id: string
  zoneId: ZoneId
  contentItemId: string
  label: string
  position: [number, number, number]
}

export type ViewMode = 'world' | 'classic'
export type LightingMode = 'day' | 'night'
