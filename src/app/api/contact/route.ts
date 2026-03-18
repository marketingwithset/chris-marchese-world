import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const supabase = getServiceClient()
    if (!supabase) {
      // Supabase not configured — log and return success
      console.log('Contact submission (no Supabase):', { name, email, message })
      return NextResponse.json({ success: true, id: 'local' })
    }

    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({ name, email, message, source_zone: 'telephone_booth' })
      .select()
      .single()

    if (error) {
      console.error('Contact submission error:', error)
      return NextResponse.json(
        { error: 'Failed to submit message. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
