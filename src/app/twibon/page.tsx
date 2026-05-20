'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import TwibonUpload from '@/components/twibon/TwibonUpload'
import TwibonCanvas from '@/components/twibon/TwibonCanvas'
import TwibonResult from '@/components/twibon/TwibonResult'
import Button from '@/components/ui/Button'
import CrossIcon from '@/components/ui/CrossIcon'

const TwibonCamera = dynamic(() => import('@/components/twibon/TwibonCamera'), { ssr: false })

type Mode = 'choose' | 'camera' | 'processing' | 'done'

export default function TwibonPage() {
  const [mode, setMode] = useState<Mode>('choose')
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [composited, setComposited] = useState<string | null>(null)

  const handleImage = useCallback((dataUrl: string) => {
    setSourceImage(dataUrl)
    setMode('processing')
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

      {/* Canvas (hidden, does compositing) */}
      {sourceImage && mode !== 'done' && (
        <TwibonCanvas sourceImage={sourceImage} onComposited={handleComposited} />
      )}

      <div className="max-w-sm mx-auto px-4 py-10">
        {mode === 'choose' && (
          <div className="flex flex-col gap-5">
            <TwibonUpload onImage={handleImage} />
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-amber-900/20" />
              <span className="text-amber-700/60 text-xs tracking-widest">ATAU</span>
              <div className="flex-1 h-px bg-amber-900/20" />
            </div>
            <Button variant="secondary" size="lg" className="w-full" onClick={() => setMode('camera')}>
              📷 Buka Kamera
            </Button>
          </div>
        )}

        {mode === 'camera' && (
          <TwibonCamera onCapture={handleImage} onCancel={() => setMode('choose')} />
        )}

        {mode === 'processing' && (
          <div className="text-center py-20">
            <CrossIcon className="w-8 h-10 animate-spin inline-block mb-4 text-amber-600" />
            <p className="text-[#8a7a5a] text-sm tracking-wider">Menambahkan frame...</p>
          </div>
        )}

        {mode === 'done' && composited && (
          <TwibonResult dataUrl={composited} onReset={reset} />
        )}
      </div>
    </div>
  )
}
