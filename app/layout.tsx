import React from "react"
import type { Metadata } from 'next'
import { Playfair_Display, Outfit } from 'next/font/google'

import './globals.css'

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '900']
})

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Artisanat Classifié - Classification Marocaine',
  description: 'Classifiez les artisanats marocains avec l\'IA: babouche, bijoux, poterie, tapis, zellige',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#c9302c',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${playfairDisplay.variable} ${outfit.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
