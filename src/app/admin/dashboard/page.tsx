'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AddAttendeeForm from '@/components/attendance/AddAttendeeForm'
import AttendeeList from '@/components/attendance/AttendeeList'
import EligibleList from '@/components/raffle/EligibleList'
import RaffleSpinner from '@/components/raffle/RaffleSpinner'
import Button from '@/components/ui/Button'
import CrossIcon from '@/components/ui/CrossIcon'
import { AttendeeWithSessions, SessionTypeName, RaffleWinner } from '@/types'

type Tab = 'peserta' | 'undian'

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('peserta')
  const [attendees, setAttendees] = useState<AttendeeWithSessions[]>([])
  const [eligible, setEligible] = useState<{ id: string; name: string }[]>([])
  const [winner, setWinner] = useState<RaffleWinner | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(false)
  const router = useRouter()

  const fetchAll = useCallback(async () => {
    try {
      const [attendeesRes, eligibleRes, winnerRes] = await Promise.all([
        fetch('/api/attendees'),
        fetch('/api/raffle/eligible'),
        fetch('/api/raffle/winner'),
      ])
      if (attendeesRes.status === 401) { setAuthError(true); return }
      setAttendees(await attendeesRes.json())
      setEligible(eligibleRes.ok ? await eligibleRes.json() : [])
      setWinner(winnerRes.ok ? await winnerRes.json() : null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin')
  }

  function handleAdded(a: AttendeeWithSessions) { setAttendees(prev => [...prev, a]) }
  function handleRemoved(id: string) {
    setAttendees(prev => prev.filter(a => a.id !== id))
    setEligible(prev => prev.filter(a => a.id !== id))
  }
  function handleCheckin(attendeeId: string, sessionType: SessionTypeName, present: boolean) {
    setAttendees(prev => prev.map(a => {
      if (a.id !== attendeeId) return a
      const sessions = present
        ? [...a.sessions, { id: `tmp-${Date.now()}`, sessionType, checkedAt: new Date().toISOString() }]
        : a.sessions.filter(s => s.sessionType !== sessionType)
      return { ...a, sessions }
    }))
    fetch('/api/raffle/eligible').then(r => r.json()).then(setEligible).catch(() => {})
  }
  function handleWinnerSaved(w: { attendeeId: string; attendeeName: string }) {
    setWinner({ ...w, id: '', drawnAt: new Date().toISOString() })
  }

  if (authError) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center panel rounded-2xl p-8 border border-red-900/30">
        <p className="text-red-400/80 mb-4 text-sm">Sesi habis atau tidak terautentikasi.</p>
        <Link href="/admin"><Button>Login Ulang</Button></Link>
      </div>
    </div>
  )

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-amber-700/70 animate-pulse text-sm tracking-widest">Memuat data...</p>
    </div>
  )

  const eligibleCount = attendees.filter(a => a.sessions.length === 3).length

  return (
    <div className="min-h-screen relative">
      <div className="cross-watermark absolute inset-0 pointer-events-none" />

      {/* Header */}
      <div className="relative border-b border-amber-900/20 py-6 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1a08] to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" className="text-amber-700/40 text-xs hover:text-amber-600/60 tracking-widest uppercase"
                  style={{ fontFamily: 'var(--font-cinzel)' }}>
              ← Beranda
            </Link>
            <h1 className="text-lg font-bold text-amber-200/80 mt-0.5"
                style={{ fontFamily: 'var(--font-cinzel)' }}>
              Panel Panitia
            </h1>
            <p className="text-amber-700/60 text-xs">
              {attendees.length} peserta · {eligibleCount} eligible undian
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>Keluar</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex border-b border-amber-900/20 mt-6">
          {([
            { key: 'peserta', label: '👥 Peserta & Absensi' },
            { key: 'undian', label: '† Undian' },
          ] as { key: Tab; label: string }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`
                px-5 py-3 text-xs font-semibold border-b-2 transition-colors tracking-wider
                ${tab === t.key
                  ? 'border-amber-600/70 text-amber-300/90'
                  : 'border-transparent text-amber-700/60 hover:text-amber-500/80'}
              `}
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="py-8">
          {tab === 'peserta' && (
            <div className="flex flex-col gap-6">
              <AddAttendeeForm onAdded={handleAdded} />
              <AttendeeList attendees={attendees} onRemoved={handleRemoved} onCheckin={handleCheckin} />
            </div>
          )}
          {tab === 'undian' && (
            <div className="flex flex-col gap-6">
              <EligibleList eligible={eligible} />
              <RaffleSpinner
                eligible={eligible}
                existingWinner={winner ? { attendeeId: winner.attendeeId, attendeeName: winner.attendeeName } : null}
                onWinnerSaved={handleWinnerSaved}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
