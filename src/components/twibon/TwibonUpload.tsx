'use client'

import { useRef, DragEvent, ChangeEvent } from 'react'
import Button from '@/components/ui/Button'

interface Props { onImage: (dataUrl: string) => void }

export default function TwibonUpload({ onImage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  function readFile(file: File) {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => { if (typeof e.target?.result === 'string') onImage(e.target.result) }
    reader.readAsDataURL(file)
  }

  return (
    <div
      onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) readFile(f) }}
      onDragOver={e => e.preventDefault()}
      className="panel border-2 border-dashed border-amber-800/30 hover:border-amber-700/50
                 rounded-2xl p-10 text-center cursor-pointer transition-all
                 hover:shadow-[0_0_20px_rgba(196,154,60,0.08)]"
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
             onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f) }} />
      <div className="text-4xl mb-3 text-amber-700/50">🖼️</div>
      <p className="text-[#6a5a3a] text-sm mb-3">Seret foto ke sini atau</p>
      <Button variant="secondary" size="sm" type="button">Pilih Foto dari Galeri</Button>
      <p className="text-[#3a3020] text-xs mt-3">JPG, PNG, WEBP · Hasil: 1080×1920 px (IG Story)</p>
    </div>
  )
}
