import type { Metadata } from 'next'
import { Cinzel, Lora } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
})

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Nobar Pesta Babi — Tomsk 2026',
  description: 'Nonton Bareng Film "Pesta Babi: Kolonialisme di Zaman Kita" — Tomsk, Rusia · 23 Mei 2026 · #papuabukantanahkosong',
  openGraph: {
    title: 'Nobar Pesta Babi — Tomsk 2026',
    description: 'Film Pesta Babi: Membaca Krisis Ekologi, Konflik Agraria, dan Ruang Hidup Masyarakat Adat Papua. Tomsk, Rusia.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${cinzel.variable} ${lora.variable}`}>
      <body>
        {children}
      </body>
    </html>
  )
}
