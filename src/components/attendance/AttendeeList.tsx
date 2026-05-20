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
    } finally { setRemoving(null) }
  }

  async function toggle(attendee: AttendeeWithSessions, sessionType: SessionTypeName) {
    const key = `${attendee.id}-${sessionType}`
    setToggling(key)
    const present = attendee.sessions.some(s => s.sessionType === sessionType)
    try {
      await fetch(`/api/sessions/${sessionType}/checkin`, {
        method: present ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendeeId: attendee.id }),
      })
      onCheckin(attendee.id, sessionType, !present)
    } finally { setToggling(null) }
  }

  if (attendees.length === 0) {
    return <p className="text-center text-amber-700/70 py-10 italic text-sm">Belum ada peserta terdaftar.</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-amber-900/20">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-[#0d1a08]/80">
            <th className="px-4 py-3 text-left text-amber-600/60 tracking-widest uppercase font-semibold"
                style={{ fontFamily: 'var(--font-cinzel)' }}>No</th>
            <th className="px-4 py-3 text-left text-amber-600/60 tracking-widest uppercase font-semibold"
                style={{ fontFamily: 'var(--font-cinzel)' }}>Nama</th>
            {SESSIONS.map(s => (
              <th key={s} className="px-4 py-3 text-center text-amber-600/60 tracking-widest uppercase font-semibold"
                  style={{ fontFamily: 'var(--font-cinzel)' }}>{SESSION_SHORT[s]}</th>
            ))}
            <th className="px-4 py-3 text-center text-amber-600/60 tracking-widest uppercase font-semibold"
                style={{ fontFamily: 'var(--font-cinzel)' }}>Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {attendees.map((a, idx) => {
            const count = a.sessions.length
            const eligible = count === 3
            return (
              <tr key={a.id}
                  className={`border-t border-amber-900/10 transition-colors
                    ${eligible ? 'bg-green-950/20' : 'bg-transparent hover:bg-white/2'}`}>
                <td className="px-4 py-3 text-amber-700/60">{idx + 1}</td>
                <td className="px-4 py-3 text-amber-200/80 font-medium">
                  {a.name}
                  {eligible && <span className="ml-1.5 text-amber-500">★</span>}
                </td>
                {SESSIONS.map(s => {
                  const key = `${a.id}-${s}`
                  const present = a.sessions.some(sr => sr.sessionType === s)
                  return (
                    <td key={s} className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggle(a, s)}
                        disabled={toggling === key}
                        className="text-lg leading-none disabled:opacity-40 cursor-pointer hover:scale-110 transition-transform"
                        title={present ? 'Batalkan' : 'Tandai hadir'}
                      >
                        {toggling === key ? '⏳' : present ? '✅' : '⬜'}
                      </button>
                    </td>
                  )
                })}
                <td className="px-4 py-3 text-center">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wider
                    ${eligible
                      ? 'bg-green-900/40 text-green-400/80 border border-green-800/30'
                      : 'bg-amber-900/20 text-amber-700/70 border border-amber-900/20'}`}
                        style={{ fontFamily: 'var(--font-cinzel)' }}>
                    {eligible ? 'Eligible' : `${count}/3`}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <Button variant="danger" size="sm" loading={removing === a.id} onClick={() => remove(a.id)}>
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
