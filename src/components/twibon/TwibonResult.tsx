'use client'

import Button from '@/components/ui/Button'

const CAPTION = `Hadir di Nonton Bareng Film Pesta Babi 🇮🇩\nTomsk, Rusia · 23 Mei 2026\n\n#papuabukantanahkosong #PestaBabiPapua2026 #PapuaTomsk`

interface Props { dataUrl: string; onReset: () => void }

export default function TwibonResult({ dataUrl, onReset }: Props) {
  function download() {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'twibon-pesta-babi-2026.png'
    a.click()
  }

  async function copyCaption() {
    await navigator.clipboard.writeText(CAPTION)
    alert('Caption disalin! Paste di Instagram Story atau WhatsApp kamu.')
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Portrait preview */}
      <div className="w-52 rounded-2xl overflow-hidden shadow-2xl border border-amber-700/30"
           style={{ aspectRatio: '9/16' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataUrl} alt="Twibon IG Story Pesta Babi Papua 2026"
             className="w-full h-full object-cover" />
      </div>

      <p className="text-[#3a3020] text-xs tracking-wider">1080 × 1920 px · IG Story</p>

      {/* Caption box */}
      <div className="panel rounded-xl p-4 border border-amber-900/20 max-w-xs w-full text-center">
        <p className="text-[#4a3a20] text-[10px] mb-2 tracking-wider uppercase"
           style={{ fontFamily: 'var(--font-cinzel)' }}>Caption IG Story / WA</p>
        <p className="text-amber-200/60 text-xs whitespace-pre-line italic">{CAPTION}</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="primary" size="lg" onClick={download}>⬇️ Simpan Foto</Button>
        <Button variant="secondary" onClick={copyCaption}>📋 Salin Caption</Button>
        <Button variant="ghost" onClick={onReset}>🔄 Foto Lagi</Button>
      </div>
    </div>
  )
}
