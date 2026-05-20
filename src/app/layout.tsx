import type { Metadata } from 'next'
import { Cinzel, Inter } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  weight: ['400', '700', '900'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Nonton Bareng Film Pesta Babi — Tomsk 2026',
  description: 'Nonton Bareng Film Pesta Babi — Komunitas Papua di Tomsk, Rusia 2026. #papuabukantanahkosong',
  openGraph: {
    title: 'Nonton Bareng Film Pesta Babi — Tomsk 2026',
    description: 'Acara nonton bareng komunitas Papua di Tomsk, Rusia. #papuabukantanahkosong',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="min-h-screen font-[var(--font-inter)] bg-[#FDF6E3] text-[#2C1810]">
        {children}
      </body>
    </html>
  )
}
