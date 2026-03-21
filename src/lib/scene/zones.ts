import type { ZoneConfig, RoomId } from '@/types'

export const ZONES: Record<string, ZoneConfig> = {
  // Main room zones
  // Main warehouse zones — hexagonal alcove layout
  art_gallery: {
    id: 'art_gallery',
    name: 'Art Gallery',
    label: 'GALLERY',
    position: [0, 0, -35],
    dimensions: [30, 12, 20],
    color: '#c9a84c',
    hexColor: 0xc9a84c,
    room: 'main',
  },
  film_studio: {
    id: 'film_studio',
    name: 'Film Studio',
    label: 'FILM',
    position: [30, 0, -17],
    dimensions: [20, 10, 16],
    color: '#4a7fa5',
    hexColor: 0x4a7fa5,
    room: 'main',
  },
  fashion_runway: {
    id: 'fashion_runway',
    name: 'Fashion Runway',
    label: 'FASHION',
    position: [30, 0, 17],
    dimensions: [20, 10, 18],
    color: '#f0ead8',
    hexColor: 0xf0ead8,
    room: 'main',
  },
  automotive: {
    id: 'automotive',
    name: 'Automotive',
    label: 'AUTO',
    position: [0, 0, 35],
    dimensions: [24, 10, 20],
    color: '#333333',
    hexColor: 0x333333,
    room: 'main',
  },
  telephone_booth: {
    id: 'telephone_booth',
    name: 'Contact',
    label: 'CONTACT',
    position: [-30, 0, 17],
    dimensions: [14, 10, 12],
    color: '#c0392b',
    hexColor: 0xc0392b,
    room: 'main',
  },
  money_pile: {
    id: 'money_pile',
    name: 'Checkout',
    label: 'CHECKOUT',
    position: [-30, 0, -17],
    dimensions: [14, 10, 12],
    color: '#27ae60',
    hexColor: 0x27ae60,
    room: 'main',
  },

  // Portal zones — on warehouse perimeter
  portal_capital: {
    id: 'portal_capital',
    name: 'Capital',
    label: 'CAPITAL',
    position: [-45, 0, 0],
    dimensions: [4, 8, 2],
    color: '#4a7fa5',
    hexColor: 0x4a7fa5,
    room: 'main',
  },
  portal_infrastructure: {
    id: 'portal_infrastructure',
    name: 'Infrastructure',
    label: 'INFRA',
    position: [45, 0, 0],
    dimensions: [4, 8, 2],
    color: '#c9a84c',
    hexColor: 0xc9a84c,
    room: 'main',
  },
  portal_growth: {
    id: 'portal_growth',
    name: 'Growth',
    label: 'GROWTH',
    position: [0, 0, -45],
    dimensions: [4, 8, 2],
    color: '#5a9e6f',
    hexColor: 0x5a9e6f,
    room: 'main',
  },

  // Capital room zones
  capital_deals: {
    id: 'capital_deals',
    name: 'Deal Origination',
    label: 'DEALS',
    position: [0, 0, -10],
    dimensions: [20, 10, 2],
    color: '#4a7fa5',
    hexColor: 0x4a7fa5,
    room: 'capital',
  },
  capital_services: {
    id: 'capital_services',
    name: 'Capital Services',
    label: 'SERVICES',
    position: [-12, 0, 0],
    dimensions: [3, 10, 12],
    color: '#4a7fa5',
    hexColor: 0x4a7fa5,
    room: 'capital',
  },
  capital_clients: {
    id: 'capital_clients',
    name: 'Portfolio',
    label: 'PORTFOLIO',
    position: [12, 0, 0],
    dimensions: [3, 10, 12],
    color: '#4a7fa5',
    hexColor: 0x4a7fa5,
    room: 'capital',
  },

  // Infrastructure room zones
  infra_projects: {
    id: 'infra_projects',
    name: 'Projects',
    label: 'PROJECTS',
    position: [-14, 0, 0],
    dimensions: [3, 9, 14],
    color: '#c9a84c',
    hexColor: 0xc9a84c,
    room: 'infrastructure',
  },
  infra_systems: {
    id: 'infra_systems',
    name: 'Systems',
    label: 'SYSTEMS',
    position: [14, 0, 0],
    dimensions: [3, 9, 14],
    color: '#c9a84c',
    hexColor: 0xc9a84c,
    room: 'infrastructure',
  },
  infra_tech: {
    id: 'infra_tech',
    name: 'Technology',
    label: 'TECH',
    position: [0, 0, -12],
    dimensions: [20, 9, 2],
    color: '#c9a84c',
    hexColor: 0xc9a84c,
    room: 'infrastructure',
  },

  // Growth room zones
  growth_services: {
    id: 'growth_services',
    name: 'Marketing Services',
    label: 'SERVICES',
    position: [0, 0, -10],
    dimensions: [20, 8, 2],
    color: '#5a9e6f',
    hexColor: 0x5a9e6f,
    room: 'growth',
  },
  growth_results: {
    id: 'growth_results',
    name: 'Results',
    label: 'RESULTS',
    position: [-12, 0, 0],
    dimensions: [3, 8, 12],
    color: '#5a9e6f',
    hexColor: 0x5a9e6f,
    room: 'growth',
  },
  growth_testimonials: {
    id: 'growth_testimonials',
    name: 'Testimonials',
    label: 'TESTIMONIALS',
    position: [12, 0, 0],
    dimensions: [3, 8, 12],
    color: '#5a9e6f',
    hexColor: 0x5a9e6f,
    room: 'growth',
  },
  growth_social: {
    id: 'growth_social',
    name: 'Social & Sales',
    label: 'SOCIAL',
    position: [0, 0, 8],
    dimensions: [12, 8, 6],
    color: '#5a9e6f',
    hexColor: 0x5a9e6f,
    room: 'growth',
  },
}

export const ZONE_LIST = Object.values(ZONES)

export function getZonesForRoom(roomId: RoomId): ZoneConfig[] {
  return ZONE_LIST.filter((z) => z.room === roomId)
}

export function getMainZones(): ZoneConfig[] {
  return getZonesForRoom('main').filter((z) => !z.id.startsWith('portal_'))
}

export function getPortalZones(): ZoneConfig[] {
  return getZonesForRoom('main').filter((z) => z.id.startsWith('portal_'))
}
