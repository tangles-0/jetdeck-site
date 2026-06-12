import type { Metadata } from 'next'

import React from 'react'

import '@/styles/index.css'

export const metadata: Metadata = {
  title: 'JetDeck SCOUT',
  description:
    'The ultimate handheld Linux computer for hackers, makers, and mobile operations',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
