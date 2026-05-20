'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'

interface Props {
  winner: { attendeeId: string; attendeeName: string }
  onClose: () => void
}

export default function WinnerDisplay({ winner, onClose }: Props) {
  useEffect(() => {
    // Trigger confetti
    import('canvas-confetti').then((mod) => {
      const confetti = mod.default
      confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 } })
      setTimeout(() => confetti({ particleCount: 150, spread: 100, origin: { y: 0.4 } }), 600)
      setTimeout(() => confetti({ particleCount: 100, spread: 80, origin: { y: 0.3 } }), 1200)
    })
  }, [])

  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="text-6xl animate-bounce">🏆</div>
      <div>
        <p className="text-amber-700 font-semibold text-lg tracking-wide uppercase">
          Pemenang Undian
        </p>
        <p className="text-4xl md:text-5xl font-bold text-red-800 mt-2 leading-tight">
          {winner.attendeeName}
        </p>
        <p className="text-stone-500 mt-2 text-sm">
          Selamat! Kamu adalah pemenang undian malam ini. 🎉
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mt-4">
        <Button variant="ghost" onClick={onClose}>
          Reset Undian
        </Button>
      </div>
    </div>
  )
}
