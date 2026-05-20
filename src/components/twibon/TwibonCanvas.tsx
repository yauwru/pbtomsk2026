'use client'

import { useEffect, useRef } from 'react'

const W = 1080
const H = 1920

interface Props {
  sourceImage: string
  onComposited: (dataUrl: string) => void
}

export default function TwibonCanvas({ sourceImage, onComposited }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !sourceImage) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = W
    canvas.height = H

    const userImg = new Image()
    const frameImg = new Image()

    userImg.onload = () => {
      // Cover-fill: scale photo to fill 1080×1920, center-crop
      const scale = Math.max(W / userImg.width, H / userImg.height)
      const drawW = userImg.width * scale
      const drawH = userImg.height * scale
      const dx = (W - drawW) / 2
      const dy = (H - drawH) / 2
      ctx.drawImage(userImg, dx, dy, drawW, drawH)
      frameImg.src = '/frame-twibon.png'
    }

    frameImg.onload = () => {
      ctx.drawImage(frameImg, 0, 0, W, H)
      onComposited(canvas.toDataURL('image/png'))
    }

    frameImg.onerror = () => {
      onComposited(canvas.toDataURL('image/png'))
    }

    userImg.src = sourceImage
  }, [sourceImage, onComposited])

  return <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
}
