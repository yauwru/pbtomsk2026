'use client'

import { useRef, useState } from 'react'
import Webcam from 'react-webcam'
import Button from '@/components/ui/Button'

interface Props {
  onCapture: (dataUrl: string) => void
  onCancel: () => void
}

export default function TwibonCamera({ onCapture, onCancel }: Props) {
  const webcamRef = useRef<Webcam>(null)
  const [ready, setReady] = useState(false)

  function capture() {
    const screenshot = webcamRef.current?.getScreenshot()
    if (screenshot) onCapture(screenshot)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 9:16 portrait container */}
      <div className="w-64 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-300 bg-stone-900"
           style={{ aspectRatio: '9/16' }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/png"
          videoConstraints={{ facingMode: 'user', aspectRatio: 9 / 16 }}
          playsInline
          onUserMedia={() => setReady(true)}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onCancel}>Batal</Button>
        <Button variant="primary" onClick={capture} disabled={!ready}>
          📸 Ambil Foto
        </Button>
      </div>
    </div>
  )
}
