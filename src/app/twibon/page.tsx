'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import TwibonUpload from '@/components/twibon/TwibonUpload'
import TwibonEditor from '@/components/twibon/TwibonEditor'
import TwibonResult from '@/components/twibon/TwibonResult'

type Mode = 'choose' | 'editing' | 'done'

export default function TwibonPage() {
  const [mode, setMode] = useState<Mode>('choose')
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [composited, setComposited] = useState<string | null>(null)

  const handleImage = useCallback((dataUrl: string) => {
    setSourceImage(dataUrl)
    setMode('editing')
  }, [])

  const handleComposited = useCallback((dataUrl: string) => {
    setComposited(dataUrl)
    setMode('done')
  }, [])

  function reset() {
    setSourceImage(null)
    setComposited(null)
    setMode('choose')
  }

  return (
    <div className="min-h-screen relative">
      <div className="cross-watermark absolute inset-0 pointer-events-none" />

      {/* Header */}
      <div className="relative border-b border-amber-900/20 py-8 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1f0a] to-transparent pointer-events-none" />
        <Link href="/" className="relative text-amber-600/60 text-xs hover:text-amber-400/80 transition-colors tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-cinzel)' }}>
          ← Kembali
        </Link>
        <h1 className="relative text-2xl md:text-3xl font-bold text-amber-200/90 mt-2"
            style={{ fontFamily: 'var(--font-cinzel)', textShadow: '0 0 30px rgba(196,154,60,0.2)' }}>
          📸 Foto Twibon
        </h1>
        <p className="relative text-amber-600/70 text-xs mt-1 tracking-wider">
          Pesta Babi Papua 2026 · Tomsk, Rusia · IG Story 1080×1920
        </p>
      </div>

      <div className="max-w-sm mx-auto px-4 py-10">
        {mode === 'choose' && (
          <TwibonUpload onImage={handleImage} />
        )}

        {mode === 'editing' && sourceImage && (
          <TwibonEditor
            sourceImage={sourceImage}
            onComposited={handleComposited}
            onCancel={reset}
          />
        )}

        {mode === 'done' && composited && (
          <TwibonResult dataUrl={composited} onReset={reset} />
        )}
      </div>
    </div>
  )
}
