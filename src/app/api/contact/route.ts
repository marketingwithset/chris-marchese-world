import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase/client'
import { resend } from '@/lib/resend'

const NOTIFY_EMAIL = process.env.CONTACT_NOTIFY_EMAIL || 'chris@marketingbyset.com'

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

    // Store in Supabase (if configured)
    const supabase = getServiceClient()
    let submissionId = 'local'

    if (supabase) {
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
      submissionId = data.id
    } else {
      console.log('Contact submission (no Supabase):', { name, email, message })
    }

    // Send email notification via Resend (if configured)
    if (resend) {
      await resend.emails.send({
        from: 'Marchese World <onboarding@resend.dev>',
        to: NOTIFY_EMAIL,
        subject: `New Contact: ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #060606; color: #f0ead8; padding: 40px;">
            <h2 style="color: #c9a84c; margin-bottom: 4px;">New Contact Submission</h2>
            <p style="color: #a09880; font-size: 14px; margin-top: 0;">From chrismarchese.world</p>
            <hr style="border: none; border-top: 1px solid rgba(201,168,76,0.3); margin: 24px 0;" />
            <table style="width: 100%; font-size: 14px;">
              <tr><td style="color: #a09880; padding: 8px 0; width: 80px;">Name</td><td style="color: #f0ead8;">${name}</td></tr>
              <tr><td style="color: #a09880; padding: 8px 0;">Email</td><td style="color: #f0ead8;"><a href="mailto:${email}" style="color: #c9a84c;">${email}</a></td></tr>
            </table>
            <hr style="border: none; border-top: 1px solid rgba(201,168,76,0.15); margin: 24px 0;" />
            <p style="font-size: 14px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
            <hr style="border: none; border-top: 1px solid rgba(201,168,76,0.15); margin: 24px 0;" />
            <p style="font-size: 12px; color: #a09880;">Submission ID: ${submissionId}</p>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true, id: submissionId })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
