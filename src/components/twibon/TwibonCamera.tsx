'use client'

import { useRef, useState } from 'react'
import Webcam from 'react-webcam'
import Button from '@/components/ui/Button'

interface Props { onCapture: (dataUrl: string) => void; onCancel: () => void }

export default function TwibonCamera({ onCapture, onCancel }: Props) {
  const webcamRef = useRef<Webcam>(null)
  const [ready, setReady] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-64 rounded-2xl overflow-hidden shadow-xl border border-amber-800/30"
           style={{ aspectRatio: '9/16', background: '#0a130a' }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/png"
          videoConstraints={{
            facingMode: 'user',
            width: { ideal: 720 },
            height: { ideal: 1280 },
          }}
          playsInline
          onUserMedia={() => setReady(true)}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onCancel}>Batal</Button>
        <Button onClick={() => { const s = webcamRef.current?.getScreenshot(); if (s) onCapture(s) }}
                disabled={!ready}>
          📸 Ambil Foto
        </Button>
      </div>
    </div>
  )
}
