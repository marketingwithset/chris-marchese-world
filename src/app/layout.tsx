import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chris Marchese — Digital World',
  description: 'Enter the world of Chris Marchese. An immersive 3D experience showcasing art, film, automotive, fashion, and culture.',
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
      </head>
      <body>{children}</body>
    </html>
  )
}
