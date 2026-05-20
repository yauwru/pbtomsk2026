'use client'

import { useEffect, useRef } from 'react'

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

    const SIZE = 800
    canvas.width = SIZE
    canvas.height = SIZE

    const userImg = new Image()
    const frameImg = new Image()

    userImg.onload = () => {
      const srcSize = Math.min(userImg.width, userImg.height)
      const srcX = (userImg.width - srcSize) / 2
      const srcY = (userImg.height - srcSize) / 2
      ctx.drawImage(userImg, srcX, srcY, srcSize, srcSize, 0, 0, SIZE, SIZE)
      frameImg.src = '/frame-twibon.png'
    }

    frameImg.onload = () => {
      ctx.drawImage(frameImg, 0, 0, SIZE, SIZE)
      onComposited(canvas.toDataURL('image/png'))
    }

    frameImg.onerror = () => {
      // Frame not found — still export the photo
      onComposited(canvas.toDataURL('image/png'))
    }

    userImg.src = sourceImage
  }, [sourceImage, onComposited])

  return <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
}
