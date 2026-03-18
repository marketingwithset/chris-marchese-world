/**
 * Supabase API Layer
 * All database operations go through here.
 * Gracefully degrades when Supabase is not configured.
 */
import { supabase } from './client'

// ===== SESSION =====

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server'
  let id = sessionStorage.getItem('cm-session-id')
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem('cm-session-id', id)
  }
  return id
}

// ===== CONTENT =====

export async function fetchContentByZone(zoneId: string) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .eq('zone_id', zoneId)
    .eq('is_active', true)
    .order('sort_order')

  if (error) {
    console.warn('Supabase content fetch failed:', error.message)
    return null
  }
  return data
}

export async function fetchContentById(id: string) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

// ===== CONTACT FORM =====

export async function submitContactForm(name: string, email: string, message: string) {
  // Use API route instead of direct Supabase call (server-side validation)
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Failed to send message')
  }
  return res.json()
}

// ===== CART =====

export async function getCartItems() {
  if (!supabase) return []
  const sessionId = getSessionId()

  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('session_id', sessionId)

  if (error) return []
  return data
}

export async function addToCart(contentItemId: string, quantity = 1) {
  if (!supabase) return null
  const sessionId = getSessionId()

  const { data, error } = await supabase
    .from('cart_items')
    .insert({ session_id: sessionId, content_item_id: contentItemId, quantity })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function removeFromCart(cartItemId: string) {
  if (!supabase) return
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId)
    .eq('session_id', getSessionId())

  if (error) throw new Error(error.message)
}

export async function clearCart() {
  if (!supabase) return
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('session_id', getSessionId())

  if (error) throw new Error(error.message)
}

// ===== ANALYTICS =====

export function trackEvent(
  eventType: string,
  options?: {
    zoneId?: string
    roomId?: string
    contentItemId?: string
    metadata?: Record<string, unknown>
  }
) {
  const sessionId = getSessionId()

  // Fire and forget via API route
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      eventType,
      zoneId: options?.zoneId,
      roomId: options?.roomId,
      contentItemId: options?.contentItemId,
      metadata: options?.metadata,
    }),
  }).catch(() => {
    // Silently fail — analytics should never block UX
  })
}

// ===== TESTIMONIALS =====

export async function fetchTestimonials() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (error) return null
  return data
}

export async function fetchFeaturedTestimonials() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('sort_order')

  if (error) return null
  return data
}
