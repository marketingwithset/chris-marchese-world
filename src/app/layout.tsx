import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chris Marchese \u2014 Digital World',
  description: 'Enter the immersive 3D world of Chris Marchese. Art, film, automotive, fashion, capital, infrastructure, and growth \u2014 all in one interactive experience.',
  keywords: ['Chris Marchese', 'SET Enterprises', 'SET Marketing', 'SET Ventures', 'art', 'film', 'producer', 'entrepreneur', 'Toronto', 'Miami', '3D portfolio'],
  authors: [{ name: 'Chris Marchese' }],
  creator: 'SET Enterprises',
  openGraph: {
    title: 'Chris Marchese \u2014 Digital World',
    description: 'An immersive 3D experience showcasing art, film, automotive, fashion, and culture. Enter the world of Chris Marchese.',
    url: 'https://chrismarchese.com',
    siteName: 'Chris Marchese World',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chris Marchese \u2014 Digital World',
    description: 'An immersive 3D experience showcasing art, film, automotive, fashion, and culture.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#060606',
}

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
      </head>
      <body>{children}</body>
    </html>
  )
}
