'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'

interface Props {
  winner: { attendeeId: string; attendeeName: string }
  onClose: () => void
}

export default function WinnerDisplay({ winner, onClose }: Props) {
  useEffect(() => {
    import('canvas-confetti').then(mod => {
      const c = mod.default
      // Gold + red confetti matching poster palette
      c({ particleCount: 180, spread: 120, origin: { y: 0.6 },
          colors: ['#c49a3c', '#ddb84c', '#8b1010', '#e8d4a8', '#1e2f18'] })
      setTimeout(() => c({ particleCount: 120, spread: 100, origin: { y: 0.4 },
          colors: ['#c49a3c', '#a81818', '#e8d4a8'] }), 700)
      setTimeout(() => c({ particleCount: 80, spread: 80, origin: { y: 0.3 },
          colors: ['#ddb84c', '#c49a3c'] }), 1400)
    })
  }, [])

  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      {/* Cross + star */}
      <div className="relative">
        <div className="text-5xl text-amber-500/80 animate-pulse"
             style={{ fontFamily: 'var(--font-cinzel)', textShadow: '0 0 40px rgba(196,154,60,0.5)' }}>
          ✝
        </div>
        <div className="text-2xl absolute -top-2 -right-3">⭐</div>
      </div>

      <div>
        <p className="text-amber-600/60 text-xs tracking-[0.4em] uppercase mb-3"
           style={{ fontFamily: 'var(--font-cinzel)' }}>
          Pemenang Undian
        </p>
        <p className="text-4xl md:text-5xl font-bold text-amber-200"
           style={{ fontFamily: 'var(--font-cinzel)',
                    textShadow: '0 0 40px rgba(196,154,60,0.4), 0 2px 20px rgba(0,0,0,0.8)' }}>
          {winner.attendeeName}
        </p>
        <p className="text-[#5a4a30] text-sm mt-3 italic">
          Selamat! Kamu adalah pemenang undian malam ini. 🎉
        </p>
      </div>

      <Button variant="ghost" size="sm" onClick={onClose}>Reset Undian</Button>
    </div>
  )
}
