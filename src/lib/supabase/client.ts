import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/**
 * Client-side Supabase client (uses anon key, respects RLS policies)
 * Type-safe queries: use Database types from ./types.ts for reference
 */
export const supabase = supabaseUrl
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

/**
 * Server-side Supabase client (for API routes / server actions)
 * Uses service role key — bypasses RLS. NEVER expose to client.
 */
export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey)
}
