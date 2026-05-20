'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import TwibonUpload from '@/components/twibon/TwibonUpload'
import TwibonCanvas from '@/components/twibon/TwibonCanvas'
import TwibonResult from '@/components/twibon/TwibonResult'
import Button from '@/components/ui/Button'

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
    <div className="min-h-screen tribal-pattern">
      <div className="bg-gradient-to-b from-amber-700 to-amber-600 py-10 px-4 text-center shadow">
        <Link href="/" className="text-amber-200 text-sm hover:text-white transition-colors">
          ← Kembali
        </Link>
        <h1
          className="text-3xl md:text-4xl font-bold text-white mt-2"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          📸 Foto Twibon
        </h1>
        <p className="text-amber-200 mt-1 text-sm">
          Pesta Babi Papua 2026 · Tomsk, Rusia
        </p>
      </div>

      <div className="max-w-xl mx-auto px-4 py-10">
        {/* Processing — canvas works in background */}
        {sourceImage && mode !== 'done' && (
          <TwibonCanvas sourceImage={sourceImage} onComposited={handleComposited} />
        )}

        {mode === 'choose' && (
          <div className="flex flex-col gap-6">
            <TwibonUpload onImage={handleImage} />
            <div className="relative text-center">
              <div className="absolute inset-x-0 top-1/2 border-t border-stone-200" />
              <span className="relative bg-[#FDF6E3] px-3 text-stone-400 text-sm">atau</span>
            </div>
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => setMode('camera')}
            >
              📷 Buka Kamera
            </Button>
          </div>
        )}

        {mode === 'camera' && (
          <TwibonCamera onCapture={handleImage} onCancel={() => setMode('choose')} />
        )}

        {mode === 'processing' && (
          <div className="text-center py-16 text-stone-500">
            <div className="text-4xl animate-spin inline-block mb-4">⚙️</div>
            <p className="font-medium">Menambahkan frame twibon...</p>
          </div>
        )}

        {mode === 'done' && composited && (
          <TwibonResult dataUrl={composited} onReset={reset} />
        )}
      </div>
    </div>
  )
}
