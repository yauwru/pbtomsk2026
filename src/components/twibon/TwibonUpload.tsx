'use client'

import { useRef, DragEvent, ChangeEvent } from 'react'
import Button from '@/components/ui/Button'

interface Props {
  onImage: (dataUrl: string) => void
}

export default function TwibonUpload({ onImage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  function readFile(file: File) {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') onImage(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) readFile(file)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) readFile(file)
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-amber-400 rounded-2xl p-10 text-center bg-amber-50/60 hover:bg-amber-50 transition-colors cursor-pointer"
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <div className="text-5xl mb-3">🖼️</div>
      <p className="text-stone-600 font-medium mb-1">Seret foto ke sini atau</p>
      <Button variant="secondary" size="sm" type="button">
        Pilih Foto dari Galeri
      </Button>
      <p className="text-xs text-stone-400 mt-3">JPG, PNG, WEBP · Hasil: 1080×1920 px (IG Story)</p>
    </div>
  )
}
