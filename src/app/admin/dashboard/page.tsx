'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AddAttendeeForm from '@/components/attendance/AddAttendeeForm'
import AttendeeList from '@/components/attendance/AttendeeList'
import EligibleList from '@/components/raffle/EligibleList'
import RaffleSpinner from '@/components/raffle/RaffleSpinner'
import Button from '@/components/ui/Button'
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

      if (attendeesRes.status === 401) {
        setAuthError(true)
        return
      }

      const attendeesData = await attendeesRes.json()
      const eligibleData = eligibleRes.ok ? await eligibleRes.json() : []
      const winnerData = winnerRes.ok ? await winnerRes.json() : null

      setAttendees(attendeesData)
      setEligible(eligibleData)
      setWinner(winnerData)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin')
  }

  function handleAdded(attendee: AttendeeWithSessions) {
    setAttendees((prev) => [...prev, attendee])
  }

  function handleRemoved(id: string) {
    setAttendees((prev) => prev.filter((a) => a.id !== id))
    setEligible((prev) => prev.filter((a) => a.id !== id))
  }

  function handleCheckin(attendeeId: string, sessionType: SessionTypeName, present: boolean) {
    setAttendees((prev) =>
      prev.map((a) => {
        if (a.id !== attendeeId) return a
        const sessions = present
          ? [...a.sessions, { id: `tmp-${Date.now()}`, sessionType, checkedAt: new Date().toISOString() }]
          : a.sessions.filter((s) => s.sessionType !== sessionType)
        return { ...a, sessions }
      })
    )
    // Refresh eligible list after toggle
    fetch('/api/raffle/eligible')
      .then((r) => r.json())
      .then(setEligible)
      .catch(() => {})
  }

  function handleWinnerSaved(w: { attendeeId: string; attendeeName: string }) {
    setWinner({ ...w, id: '', drawnAt: new Date().toISOString() })
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">Sesi habis atau tidak terautentikasi.</p>
          <Link href="/admin">
            <Button>Login Ulang</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-400">Memuat data...</p>
      </div>
    )
  }

  const eligibleCount = attendees.filter((a) => a.sessions.length === 3).length

  return (
    <div className="min-h-screen tribal-pattern">
      {/* Header */}
      <div className="bg-gradient-to-b from-red-900 to-red-800 py-8 px-4 shadow">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" className="text-red-300 text-xs hover:text-white">← Beranda</Link>
            <h1
              className="text-2xl font-bold text-white mt-1"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              Panel Admin
            </h1>
            <p className="text-red-300 text-xs mt-0.5">
              {attendees.length} peserta · {eligibleCount} eligible
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            Keluar
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex border-b border-amber-200 mt-6">
          {([
            { key: 'peserta', label: '👥 Peserta & Absensi' },
            { key: 'undian', label: '🎰 Undian' },
          ] as { key: Tab; label: string }[]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`
                px-5 py-3 text-sm font-semibold border-b-2 transition-colors
                ${tab === t.key
                  ? 'border-red-700 text-red-800'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
                }
              `}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="py-8">
          {tab === 'peserta' && (
            <div className="flex flex-col gap-6">
              <AddAttendeeForm onAdded={handleAdded} />
              <AttendeeList
                attendees={attendees}
                onRemoved={handleRemoved}
                onCheckin={handleCheckin}
              />
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
