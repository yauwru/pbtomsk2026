'use client'

import { useState, useRef } from 'react'
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
  const dragging = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })
  const lastPinch = useRef<number | null>(null)

  /* ── Mouse ── */
  function onMouseDown(e: React.MouseEvent) {
    dragging.current = true
    lastMouse.current = { x: e.clientX, y: e.clientY }
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!dragging.current) return
    setPos(p => ({ x: p.x + e.clientX - lastMouse.current.x, y: p.y + e.clientY - lastMouse.current.y }))
    lastMouse.current = { x: e.clientX, y: e.clientY }
  }
  function onMouseUp() { dragging.current = false }

  function onWheel(e: React.WheelEvent) {
    e.preventDefault()
    setScale(s => clamp(s - e.deltaY * 0.001, 0.3, 5))
  }

  /* ── Touch ── */
  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 1) {
      dragging.current = true
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      lastPinch.current = null
    } else if (e.touches.length === 2) {
      dragging.current = false
      lastPinch.current = pinchDist(e)
    }
  }
  function onTouchMove(e: React.TouchEvent) {
    e.preventDefault()
    if (e.touches.length === 1 && dragging.current) {
      setPos(p => ({
        x: p.x + e.touches[0].clientX - lastMouse.current.x,
        y: p.y + e.touches[0].clientY - lastMouse.current.y,
      }))
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    } else if (e.touches.length === 2 && lastPinch.current !== null) {
      const d = pinchDist(e)
      setScale(s => clamp(s + (d - lastPinch.current!) * 0.005, 0.3, 5))
      lastPinch.current = d
    }
  }
  function onTouchEnd() { dragging.current = false; lastPinch.current = null }

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
        Geser foto · Cubit/scroll untuk zoom
      </p>

      {/* Interactive preview */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl border border-amber-700/40 cursor-grab active:cursor-grabbing select-none w-full"
        style={{ maxWidth: 300, aspectRatio: '9/16', touchAction: 'none' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
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
          }}
        />
        {/* Frame overlay */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={FRAME_SRC}
          alt=""
          draggable={false}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
        />
      </div>

      {/* Zoom slider */}
      <div className="flex items-center gap-3 w-full max-w-xs">
        <span className="text-amber-600/70 text-sm font-bold">−</span>
        <input
          type="range" min="0.3" max="5" step="0.05"
          value={scale}
          onChange={e => setScale(parseFloat(e.target.value))}
          className="flex-1 accent-amber-600"
        />
        <span className="text-amber-600/70 text-sm font-bold">+</span>
      </div>

      <div className="flex gap-3">
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
function pinchDist(e: React.TouchEvent) {
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
