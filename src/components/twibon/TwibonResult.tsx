'use client'

import Button from '@/components/ui/Button'

const HASHTAG = '#papuabukantanahkosong'
const CAPTION = `Hadir di Nonton Bareng Film Pesta Babi 🇮🇩🐷\nTomsk, Rusia 2026\n\n${HASHTAG} #PestaBabiPapua2026 #PapuaTomsk`

interface Props {
  dataUrl: string
  onReset: () => void
}

export default function TwibonResult({ dataUrl, onReset }: Props) {
  function download() {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `twibon-pesta-babi-2026.png`
    a.click()
  }

  async function copyCaption() {
    await navigator.clipboard.writeText(CAPTION)
    alert('Caption disalin! Paste di Instagram atau WhatsApp kamu.')
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dataUrl}
          alt="Twibon Pesta Babi Papua 2026"
          className="w-72 h-72 md:w-96 md:h-96 rounded-2xl shadow-xl object-cover border-4 border-amber-400"
        />
      </div>

      <div className="bg-amber-100 border border-amber-300 rounded-xl p-4 max-w-sm w-full text-center">
        <p className="text-xs text-stone-500 mb-1">Salin caption untuk IG/WA:</p>
        <p className="text-sm text-stone-700 whitespace-pre-line font-medium">{CAPTION}</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="primary" size="lg" onClick={download}>
          ⬇️ Simpan Foto
        </Button>
        <Button variant="secondary" onClick={copyCaption}>
          📋 Salin Caption
        </Button>
        <Button variant="ghost" onClick={onReset}>
          🔄 Foto Lagi
        </Button>
      </div>
    </div>
  )
}
