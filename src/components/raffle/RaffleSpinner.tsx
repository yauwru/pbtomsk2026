'use client'

import { useState, useRef, useEffect } from 'react'
import Button from '@/components/ui/Button'
import WinnerDisplay from './WinnerDisplay'

interface Attendee { id: string; name: string }
interface Props {
  eligible: Attendee[]
  existingWinner: { attendeeId: string; attendeeName: string } | null
  onWinnerSaved: (w: { attendeeId: string; attendeeName: string }) => void
}

export default function RaffleSpinner({ eligible, existingWinner, onWinnerSaved }: Props) {
  const [running, setRunning] = useState(false)
  const [displayName, setDisplayName] = useState('???')
  const [winner, setWinner] = useState(existingWinner)
  const [showWinner, setShowWinner] = useState(!!existingWinner)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (existingWinner) { setWinner(existingWinner); setShowWinner(true) }
  }, [existingWinner])

  function clearTimer() { if (timeoutRef.current) clearTimeout(timeoutRef.current) }

  function startRaffle() {
    if (!eligible.length || running) return
    clearTimer()
    setRunning(true)
    setShowWinner(false)

    const picked = eligible[Math.floor(Math.random() * eligible.length)]
    let delay = 60
    let phase = 0

    function tick() {
      setDisplayName(eligible[Math.floor(Math.random() * eligible.length)].name)
      phase++
      if (phase > 33) delay = Math.min(delay + 12, 500)

      if (delay >= 500 && phase > 55) {
        setDisplayName(picked.name)
        setRunning(false)
        timeoutRef.current = setTimeout(async () => {
          try {
            await fetch('/api/raffle/winner', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ attendeeId: picked.id, attendeeName: picked.name }),
            })
          } catch { /* ignore */ }
          const w = { attendeeId: picked.id, attendeeName: picked.name }
          setWinner(w); onWinnerSaved(w); setShowWinner(true)
        }, 800)
        return
      }
      timeoutRef.current = setTimeout(tick, delay)
    }
    timeoutRef.current = setTimeout(tick, delay)
  }

  function reset() {
    clearTimer(); setRunning(false); setDisplayName('???'); setShowWinner(false); setWinner(null)
  }

  if (showWinner && winner) return <WinnerDisplay winner={winner} onClose={reset} />

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      {/* Spinner box */}
      <div className={`
        w-full max-w-sm rounded-2xl p-8 text-center border-2 transition-all
        ${running
          ? 'bg-gradient-to-br from-[#1a0e06] to-[#0d1a08] border-amber-600/50 shadow-[0_0_40px_rgba(196,154,60,0.15)]'
          : 'bg-gradient-to-br from-[#0d1a08] to-[#0a0d06] border-amber-900/30'}
      `}>
        <p className="text-amber-700/50 text-[10px] font-semibold mb-3 tracking-[0.4em] uppercase"
           style={{ fontFamily: 'var(--font-cinzel)' }}>
          {running ? '⟳ Mengocok nama...' : '✝ Siap Undian'}
        </p>
        <p className={`text-amber-200 font-bold text-2xl md:text-3xl min-h-[2.5rem] transition-all
                       ${running ? 'blur-[1.5px] opacity-80' : ''}`}
           style={{ fontFamily: 'var(--font-cinzel)', textShadow: running ? '0 0 20px rgba(196,154,60,0.4)' : 'none' }}>
          {displayName}
        </p>
      </div>

      {!running && !winner && (
        <Button variant="primary" size="lg" onClick={startRaffle} disabled={!eligible.length} className="px-10">
          ✝ Mulai Undian
        </Button>
      )}
      {winner && !showWinner && (
        <Button variant="secondary" onClick={() => setShowWinner(true)}>★ Lihat Pemenang</Button>
      )}
      {!eligible.length && (
        <p className="text-[#3a3020] text-xs italic text-center max-w-xs">
          Belum ada peserta eligible. Lakukan absensi 3 sesi terlebih dahulu.
        </p>
      )}
    </div>
  )
}
