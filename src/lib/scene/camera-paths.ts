import type { CameraPreset } from '@/types'

export const CAMERA_PRESETS: Record<string, CameraPreset> = {
  // Main room
  overview: { position: [0, 10, 22], target: [0, 2, 0] },
  art_gallery: { position: [0, 3.5, -8], target: [0, 3.5, -14] },
  film_studio: { position: [-9, 3, 0], target: [-14, 2, -3] },
  automotive: { position: [6, 3, 14], target: [0, 1.5, 8] },
  fashion_runway: { position: [9, 3, 0], target: [14, 2, -3] },
  telephone_booth: { position: [-9, 2.5, 10], target: [-14, 2, 8] },
  money_pile: { position: [9, 2.5, 10], target: [14, 2, 8] },
  portal_capital: { position: [-5, 3, 1], target: [-8, 3, -3] },
  portal_infrastructure: { position: [3, 3, 1], target: [0, 3, -3] },
  portal_growth: { position: [11, 3, 1], target: [8, 3, -3] },

  // Capital room
  capital_overview: { position: [0, 7, 18], target: [0, 3, 0] },
  capital_deals: { position: [0, 4, -5], target: [0, 3, -12] },
  capital_services: { position: [-7, 4, 0], target: [-14, 3, 0] },
  capital_clients: { position: [7, 4, 0], target: [14, 3, 0] },

  // Infrastructure room
  infrastructure_overview: { position: [0, 7, 20], target: [0, 3, 0] },
  infra_projects: { position: [-8, 4, 0], target: [-16, 3, 0] },
  infra_systems: { position: [8, 4, 0], target: [16, 3, 0] },
  infra_tech: { position: [0, 4, -6], target: [0, 3, -14] },

  // Growth room
  growth_overview: { position: [0, 7, 18], target: [0, 3, 0] },
  growth_services: { position: [0, 4, -5], target: [0, 3, -12] },
  growth_results: { position: [-7, 4, 0], target: [-14, 3, 0] },
  growth_testimonials: { position: [7, 4, 0], target: [14, 3, 0] },
  growth_social: { position: [0, 3, 13], target: [0, 2, 8] },
}
