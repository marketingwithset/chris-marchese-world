import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #060606 0%, #0a0a0a 50%, #060606 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Gold accent line */}
        <div
          style={{
            width: 80,
            height: 3,
            background: '#c9a84c',
            marginBottom: 32,
          }}
        />

        {/* Name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#f0ead8',
            letterSpacing: '0.08em',
            marginBottom: 8,
          }}
        >
          CHRIS MARCHESE
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: '#c9a84c',
            letterSpacing: '0.2em',
            marginBottom: 48,
          }}
        >
          SETTING THE PACE
        </div>

        {/* Categories */}
        <div
          style={{
            display: 'flex',
            gap: 32,
            fontSize: 14,
            color: '#a09880',
            letterSpacing: '0.15em',
          }}
        >
          {['ART', 'FILM', 'AUTOMOTIVE', 'FASHION', 'CAPITAL', 'GROWTH'].map(
            (cat) => (
              <div key={cat} style={{ display: 'flex' }}>{cat}</div>
            )
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 14,
            color: '#666',
          }}
        >
          <div style={{ display: 'flex' }}>SET ENTERPRISES</div>
          <div style={{ color: '#c9a84c', display: 'flex' }}>·</div>
          <div style={{ display: 'flex' }}>TORONTO / MIAMI</div>
        </div>

        {/* Corner accents */}
        <div
          style={{
            position: 'absolute',
            top: 30,
            left: 30,
            width: 40,
            height: 40,
            borderTop: '2px solid rgba(201, 168, 76, 0.4)',
            borderLeft: '2px solid rgba(201, 168, 76, 0.4)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 30,
            right: 30,
            width: 40,
            height: 40,
            borderTop: '2px solid rgba(201, 168, 76, 0.4)',
            borderRight: '2px solid rgba(201, 168, 76, 0.4)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            left: 30,
            width: 40,
            height: 40,
            borderBottom: '2px solid rgba(201, 168, 76, 0.4)',
            borderLeft: '2px solid rgba(201, 168, 76, 0.4)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            right: 30,
            width: 40,
            height: 40,
            borderBottom: '2px solid rgba(201, 168, 76, 0.4)',
            borderRight: '2px solid rgba(201, 168, 76, 0.4)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
