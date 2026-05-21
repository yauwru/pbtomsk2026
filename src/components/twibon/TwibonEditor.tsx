'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Button from '@/components/ui/Button'

const FRAME_SRC = '/frame-twibon.png'
const OUT_W = 1080
const OUT_H = 1920

interface Props {
  sourceImage: string
  onComposited: (dataUrl: string) => void
  onCancel: () => void
}

export default function TwibonEditor({ sourceImage, onComposited, onCancel }: Props) {
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [compositing, setCompositing] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({ scale: 1, pos: { x: 0, y: 0 } })
  const dragging = useRef(false)
  const lastTouch = useRef({ x: 0, y: 0 })
  const lastPinch = useRef<number | null>(null)

  // Keep stateRef in sync so native handlers can read latest values
  useEffect(() => { stateRef.current.scale = scale }, [scale])
  useEffect(() => { stateRef.current.pos = pos }, [pos])

  // Attach native (non-passive) touch listeners so preventDefault works
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function onTouchStart(e: TouchEvent) {
      e.preventDefault()
      if (e.touches.length === 1) {
        dragging.current = true
        lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        lastPinch.current = null
      } else if (e.touches.length === 2) {
        dragging.current = false
        lastPinch.current = dist2(e)
      }
    }

    function onTouchMove(e: TouchEvent) {
      e.preventDefault()
      if (e.touches.length === 1 && dragging.current) {
        const dx = e.touches[0].clientX - lastTouch.current.x
        const dy = e.touches[0].clientY - lastTouch.current.y
        lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        setPos(p => ({ x: p.x + dx, y: p.y + dy }))
      } else if (e.touches.length === 2 && lastPinch.current !== null) {
        const d = dist2(e)
        const delta = (d - lastPinch.current) * 0.008
        lastPinch.current = d
        setScale(s => clamp(s + delta, 0.3, 5))
      }
    }

    function onTouchEnd(e: TouchEvent) {
      e.preventDefault()
      if (e.touches.length === 0) {
        dragging.current = false
        lastPinch.current = null
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: false })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  /* ── Mouse (desktop) ── */
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    lastTouch.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - lastTouch.current.x
    const dy = e.clientY - lastTouch.current.y
    lastTouch.current = { x: e.clientX, y: e.clientY }
    setPos(p => ({ x: p.x + dx, y: p.y + dy }))
  }, [])

  const onMouseUp = useCallback(() => { dragging.current = false }, [])

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setScale(s => clamp(s - e.deltaY * 0.002, 0.3, 5))
  }, [])

  /* ── Composite to 1080×1920 ── */
  async function apply() {
    setCompositing(true)
    try {
      const container = containerRef.current!
      const pw = container.clientWidth
      const ph = container.clientHeight
      const ratio = OUT_W / pw

      const canvas = document.createElement('canvas')
      canvas.width = OUT_W
      canvas.height = OUT_H
      const ctx = canvas.getContext('2d')!

      const img = await loadImage(sourceImage)
      const base = Math.max(pw / img.width, ph / img.height)
      const fs = base * scale * ratio
      const cx = OUT_W / 2 + pos.x * ratio
      const cy = OUT_H / 2 + pos.y * ratio
      ctx.drawImage(img, cx - img.width * fs / 2, cy - img.height * fs / 2, img.width * fs, img.height * fs)

      const frame = await loadImage(FRAME_SRC).catch(() => null)
      if (frame) ctx.drawImage(frame, 0, 0, OUT_W, OUT_H)

      onComposited(canvas.toDataURL('image/png'))
    } finally {
      setCompositing(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-amber-600/70 text-xs tracking-wider text-center">
        Geser foto · Cubit atau gunakan slider untuk zoom
      </p>

      {/* Interactive preview */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl border-2 border-amber-700/50 cursor-grab active:cursor-grabbing select-none w-full"
        style={{ maxWidth: 300, aspectRatio: '9/16', touchAction: 'none', WebkitUserSelect: 'none' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
      >
        {/* User photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sourceImage}
          alt=""
          draggable={false}
          style={{
            position: 'absolute', width: '100%', height: '100%',
            objectFit: 'cover', pointerEvents: 'none',
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            transformOrigin: 'center',
            userSelect: 'none', WebkitUserSelect: 'none',
          }}
        />
        {/* Frame overlay */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={FRAME_SRC}
          alt=""
          draggable={false}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', pointerEvents: 'none',
          }}
        />
      </div>

      {/* Zoom slider */}
      <div className="flex items-center gap-3 w-full max-w-xs">
        <button
          onClick={() => setScale(s => clamp(s - 0.1, 0.3, 5))}
          className="text-amber-400 text-xl font-bold w-8 h-8 flex items-center justify-center hover:text-amber-300 active:scale-90 transition-transform"
        >−</button>
        <input
          type="range" min="0.3" max="5" step="0.05"
          value={scale}
          onChange={e => setScale(parseFloat(e.target.value))}
          className="flex-1 accent-amber-600 h-2"
        />
        <button
          onClick={() => setScale(s => clamp(s + 0.1, 0.3, 5))}
          className="text-amber-400 text-xl font-bold w-8 h-8 flex items-center justify-center hover:text-amber-300 active:scale-90 transition-transform"
        >+</button>
      </div>

      <div className="flex gap-3 w-full max-w-xs justify-between">
        <Button variant="ghost" onClick={onCancel} disabled={compositing}>Batal</Button>
        <Button variant="ghost" size="sm" onClick={() => { setScale(1); setPos({ x: 0, y: 0 }) }} disabled={compositing}>
          Reset
        </Button>
        <Button onClick={apply} loading={compositing}>
          Terapkan
        </Button>
      </div>
    </div>
  )
}

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)) }

function dist2(e: TouchEvent) {
  const dx = e.touches[0].clientX - e.touches[1].clientX
  const dy = e.touches[0].clientY - e.touches[1].clientY
  return Math.sqrt(dx * dx + dy * dy)
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image()
    img.onload = () => res(img)
    img.onerror = rej
    img.src = src
  })
}
