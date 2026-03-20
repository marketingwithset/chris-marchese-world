import type { Metadata, Viewport } from 'next'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chrismarchese.world'

export const metadata: Metadata = {
  title: 'Chris Marchese — Digital World',
  description: 'Enter the immersive 3D world of Chris Marchese. Art, film, automotive, fashion, capital, infrastructure, and growth — all in one interactive experience.',
  keywords: ['Chris Marchese', 'SET Enterprises', 'SET Marketing', 'SET Ventures', 'art', 'film', 'producer', 'entrepreneur', 'Toronto', 'Miami', '3D portfolio', 'Art by Marchese', 'contemporary art'],
  authors: [{ name: 'Chris Marchese' }],
  creator: 'SET Enterprises',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'Chris Marchese — Digital World',
    description: 'An immersive 3D experience showcasing art, film, automotive, fashion, and culture. Enter the world of Chris Marchese.',
    url: SITE_URL,
    siteName: 'Chris Marchese World',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Chris Marchese — Setting The Pace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chris Marchese — Digital World',
    description: 'An immersive 3D experience showcasing art, film, automotive, fashion, and culture.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#060606',
}

// JSON-LD structured data (static server-side constant — safe for inline script)
const jsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Chris Marchese',
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  jobTitle: 'Entrepreneur, Producer, Artist',
  description: 'Canadian entrepreneur, film producer, actor, and contemporary artist. Founder of SET Enterprises, SET Marketing, and SET Ventures. Based in Toronto and Miami.',
  sameAs: [
    'https://www.instagram.com/thechrismarchese/',
    'https://www.linkedin.com/in/chrismarchese/',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'SET Enterprises',
    url: 'https://setenterprises.com',
  },
  knowsAbout: ['Art', 'Film Production', 'Marketing', 'Venture Capital', 'Real Estate', 'Fashion'],
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'University of Toronto',
  },
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Preload spawn-area textures for instant visual quality */}
        <link rel="preload" href="/textures/concrete/Concrete034_1K-JPG_Color.webp" as="image" type="image/webp" />
        <link rel="preload" href="/textures/plaster/Plaster003_1K-JPG_Color.webp" as="image" type="image/webp" />
        {/* Structured data for search engines — static content, no user input */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
