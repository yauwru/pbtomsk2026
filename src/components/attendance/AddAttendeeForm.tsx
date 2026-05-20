'use client'

import { useState, FormEvent } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { AttendeeWithSessions } from '@/types'

interface Props {
  onAdded: (attendee: AttendeeWithSessions) => void
}

export default function AddAttendeeForm({ onAdded }: Props) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/attendees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error ?? 'Gagal menambahkan')
      else { onAdded(data); setName('') }
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex-1">
        <Input
          label="Nama Peserta"
          placeholder="Masukkan nama lengkap..."
          value={name}
          onChange={e => setName(e.target.value)}
          error={error}
        />
      </div>
      <Button type="submit" loading={loading}>+ Tambah</Button>
    </form>
  )
}
