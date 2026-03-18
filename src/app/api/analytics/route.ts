import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, eventType, zoneId, roomId, contentItemId, metadata } = body

    if (!sessionId || !eventType) {
      return NextResponse.json(
        { error: 'sessionId and eventType are required' },
        { status: 400 }
      )
    }

    const supabase = getServiceClient()
    if (!supabase) {
      // Supabase not configured — silently succeed
      return NextResponse.json({ success: true })
    }

    const { error } = await supabase
      .from('analytics_events')
      .insert({
        session_id: sessionId,
        event_type: eventType,
        zone_id: zoneId || null,
        room_id: roomId || null,
        content_item_id: contentItemId || null,
        metadata: metadata || null,
      })

    if (error) {
      console.error('Analytics error:', error)
      return NextResponse.json({ error: 'Failed to log event' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
