'use client'

import { useState, useRef, useEffect } from 'react'
import Button from '@/components/ui/Button'
import WinnerDisplay from './WinnerDisplay'

interface Attendee {
  id: string
  name: string
}

interface Props {
  eligible: Attendee[]
  existingWinner: { attendeeId: string; attendeeName: string } | null
  onWinnerSaved: (winner: { attendeeId: string; attendeeName: string }) => void
}

export default function RaffleSpinner({ eligible, existingWinner, onWinnerSaved }: Props) {
  const [running, setRunning] = useState(false)
  const [displayName, setDisplayName] = useState('???')
  const [winner, setWinner] = useState(existingWinner)
  const [showWinner, setShowWinner] = useState(!!existingWinner)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (existingWinner) {
      setWinner(existingWinner)
      setShowWinner(true)
    }
  }, [existingWinner])

  function clearTimers() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    timeoutRefs.current.forEach(clearTimeout)
    timeoutRefs.current = []
  }

  function startRaffle() {
    if (eligible.length === 0 || running) return
    clearTimers()
    setRunning(true)
    setShowWinner(false)

    // Pre-select winner before animation starts
    const picked = eligible[Math.floor(Math.random() * eligible.length)]

    let delay = 60
    let phase = 0

    function nextTick() {
      const idx = Math.floor(Math.random() * eligible.length)
      setDisplayName(eligible[idx].name)

      phase++
      // Progressively slow down after 2s (phase ~33 at 60ms), finish around 6s
      if (phase > 33) delay = Math.min(delay + 15, 500)

      if (delay >= 500 && phase > 50) {
        // Land on winner
        setDisplayName(picked.name)
        setRunning(false)
        intervalRef.current = null

        const t = setTimeout(async () => {
          try {
            const res = await fetch('/api/raffle/winner', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ attendeeId: picked.id, attendeeName: picked.name }),
            })
            if (res.ok || res.status === 409) {
              const winnerData = { attendeeId: picked.id, attendeeName: picked.name }
              setWinner(winnerData)
              onWinnerSaved(winnerData)
              setShowWinner(true)
            }
          } catch {
            setShowWinner(true)
          }
        }, 800)
        timeoutRefs.current.push(t)
        return
      }

      intervalRef.current = setTimeout(nextTick, delay)
    }

    intervalRef.current = setTimeout(nextTick, delay)
  }

  function reset() {
    clearTimers()
    setRunning(false)
    setDisplayName('???')
    setShowWinner(false)
    setWinner(null)
  }

  if (showWinner && winner) {
    return <WinnerDisplay winner={winner} onClose={reset} />
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      {/* Spinner Display */}
      <div className={`
        w-full max-w-sm bg-gradient-to-br from-red-900 to-amber-800
        rounded-2xl p-8 text-center shadow-2xl border-4
        ${running ? 'border-amber-400 animate-pulse' : 'border-amber-600'}
      `}>
        <p className="text-amber-200 text-sm font-semibold mb-2 tracking-widest uppercase">
          {running ? '🎲 Mengocok nama...' : '🎯 Siap undian'}
        </p>
        <p className={`
          text-white font-bold text-2xl md:text-3xl min-h-[2.5rem] transition-all
          ${running ? 'blur-[1px]' : ''}
        `}>
          {displayName}
        </p>
      </div>

      <div className="flex gap-3">
        {!running && !winner && (
          <Button
            variant="primary"
            size="lg"
            onClick={startRaffle}
            disabled={eligible.length === 0}
            className="text-lg px-8"
          >
            🎰 Mulai Undian
          </Button>
        )}
        {winner && !showWinner && (
          <Button variant="secondary" onClick={() => setShowWinner(true)}>
            🏆 Lihat Pemenang
          </Button>
        )}
      </div>

      {eligible.length === 0 && (
        <p className="text-sm text-stone-400 text-center">
          Belum ada peserta eligible. Pastikan absensi 3 sesi sudah dilakukan.
        </p>
      )}
    </div>
  )
}
