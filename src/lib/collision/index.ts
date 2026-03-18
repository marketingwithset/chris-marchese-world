/**
 * Lightweight AABB collision system \u2014 no physics engine needed.
 * Player is a circle on XZ plane. Walls are axis-aligned boxes.
 */

export interface WallDef {
  min: [number, number]  // [x, z] min corner
  max: [number, number]  // [x, z] max corner
}

export interface PortalTrigger {
  roomId: string
  min: [number, number]
  max: [number, number]
}

/**
 * Resolve circle-vs-AABB collision.
 * Pushes player out of any overlapping walls.
 * Returns adjusted [x, z] position.
 */
export function resolveCollision(
  x: number,
  z: number,
  walls: WallDef[],
  radius: number = 0.3
): [number, number] {
  let px = x
  let pz = z

  for (const wall of walls) {
    // Find closest point on AABB to player
    const closestX = Math.max(wall.min[0], Math.min(px, wall.max[0]))
    const closestZ = Math.max(wall.min[1], Math.min(pz, wall.max[1]))

    const dx = px - closestX
    const dz = pz - closestZ
    const distSq = dx * dx + dz * dz

    if (distSq < radius * radius) {
      const dist = Math.sqrt(distSq)
      if (dist === 0) {
        // Player is exactly on the AABB edge \u2014 push in arbitrary direction
        px += radius
      } else {
        // Push player out along collision normal
        const nx = dx / dist
        const nz = dz / dist
        const overlap = radius - dist
        px += nx * overlap
        pz += nz * overlap
      }
    }
  }

  return [px, pz]
}

/**
 * Check if position is inside any portal trigger zone.
 * Returns the roomId if triggered, null otherwise.
 */
export function checkPortalTriggers(
  x: number,
  z: number,
  triggers: PortalTrigger[]
): string | null {
  for (const trigger of triggers) {
    if (
      x >= trigger.min[0] && x <= trigger.max[0] &&
      z >= trigger.min[1] && z <= trigger.max[1]
    ) {
      return trigger.roomId
    }
  }
  return null
}

/**
 * Generate wall definitions for a rectangular room.
 * Includes optional front gap for entrance.
 */
export function generateRoomWalls(
  width: number,
  depth: number,
  gapWidth: number = 5,
  thickness: number = 0.5
): WallDef[] {
  const hw = width / 2
  const hd = depth / 2

  const walls: WallDef[] = [
    // Left wall
    { min: [-hw - thickness, -hd], max: [-hw, hd] },
    // Right wall
    { min: [hw, -hd], max: [hw + thickness, hd] },
    // Back wall
    { min: [-hw, -hd - thickness], max: [hw, -hd] },
    // Front wall left segment
    { min: [-hw, hd], max: [-gapWidth / 2, hd + thickness] },
    // Front wall right segment
    { min: [gapWidth / 2, hd], max: [hw, hd + thickness] },
  ]

  return walls
}

/**
 * Generate portal trigger zones for main room portals.
 */
export function getMainRoomPortalTriggers(): PortalTrigger[] {
  return [
    { roomId: 'capital', min: [-9.5, -4], max: [-6.5, -2] },
    { roomId: 'infrastructure', min: [-1.5, -4], max: [1.5, -2] },
    { roomId: 'growth', min: [6.5, -4], max: [9.5, -2] },
  ]
}

/**
 * Get return portal trigger for a sub-room (at front wall center).
 */
export function getReturnPortalTrigger(depth: number): PortalTrigger {
  const hd = depth / 2
  return { roomId: 'main', min: [-1.5, hd - 2], max: [1.5, hd] }
}
