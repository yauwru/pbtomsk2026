'use client'

import { useState } from 'react'
import { AttendeeWithSessions, SessionTypeName } from '@/types'
import Button from '@/components/ui/Button'

const SESSIONS: SessionTypeName[] = ['CHECK_IN', 'MID_FILM', 'END_FILM']
const SESSION_SHORT: Record<SessionTypeName, string> = {
  CHECK_IN: 'Awal',
  MID_FILM: 'Tengah',
  END_FILM: 'Akhir',
}

interface Props {
  attendees: AttendeeWithSessions[]
  onRemoved: (id: string) => void
  onCheckin: (attendeeId: string, sessionType: SessionTypeName, present: boolean) => void
}

export default function AttendeeList({ attendees, onRemoved, onCheckin }: Props) {
  const [removing, setRemoving] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  async function remove(id: string) {
    setRemoving(id)
    try {
      await fetch(`/api/attendees/${id}`, { method: 'DELETE' })
      onRemoved(id)
    } finally {
      setRemoving(null)
    }
  }

  async function toggle(attendee: AttendeeWithSessions, sessionType: SessionTypeName) {
    const key = `${attendee.id}-${sessionType}`
    setToggling(key)
    const present = attendee.sessions.some((s) => s.sessionType === sessionType)
    try {
      const method = present ? 'DELETE' : 'POST'
      await fetch(`/api/sessions/${sessionType}/checkin`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendeeId: attendee.id }),
      })
      onCheckin(attendee.id, sessionType, !present)
    } finally {
      setToggling(null)
    }
  }

  if (attendees.length === 0) {
    return (
      <p className="text-center text-stone-400 py-8">Belum ada peserta terdaftar.</p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-amber-200">
      <table className="w-full text-sm">
        <thead className="bg-amber-100">
          <tr>
            <th className="px-4 py-3 text-left text-stone-700">No</th>
            <th className="px-4 py-3 text-left text-stone-700">Nama</th>
            {SESSIONS.map((s) => (
              <th key={s} className="px-4 py-3 text-center text-stone-700">{SESSION_SHORT[s]}</th>
            ))}
            <th className="px-4 py-3 text-center text-stone-700">Status</th>
            <th className="px-4 py-3 text-center text-stone-700">Hapus</th>
          </tr>
        </thead>
        <tbody>
          {attendees.map((a, idx) => {
            const sessionCount = a.sessions.length
            const isEligible = sessionCount === 3
            return (
              <tr key={a.id} className={`border-t border-amber-100 ${isEligible ? 'bg-green-50' : 'bg-white'}`}>
                <td className="px-4 py-3 text-stone-500">{idx + 1}</td>
                <td className="px-4 py-3 font-medium text-stone-800">
                  {a.name}
                  {isEligible && <span className="ml-2">⭐</span>}
                </td>
                {SESSIONS.map((s) => {
                  const key = `${a.id}-${s}`
                  const present = a.sessions.some((sr) => sr.sessionType === s)
                  return (
                    <td key={s} className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggle(a, s)}
                        disabled={toggling === key}
                        className="text-xl leading-none disabled:opacity-50 cursor-pointer hover:scale-110 transition-transform"
                        title={present ? 'Klik untuk batalkan' : 'Klik untuk tandai hadir'}
                      >
                        {toggling === key ? '⏳' : present ? '✅' : '⬜'}
                      </button>
                    </td>
                  )
                })}
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    isEligible
                      ? 'bg-green-100 text-green-700'
                      : 'bg-stone-100 text-stone-500'
                  }`}>
                    {isEligible ? 'Eligible' : `${sessionCount}/3`}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <Button
                    variant="danger"
                    size="sm"
                    loading={removing === a.id}
                    onClick={() => remove(a.id)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
