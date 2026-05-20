'use client'

import { useState, FormEvent } from 'react'
import Button from '@/components/ui/Button'
import { Message } from '@/types'

interface Props {
  onSent: (message: Message) => void
}

export default function MessageForm({ onSent }: Props) {
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Gagal mengirim pesan')
      } else {
        onSent(data)
        setContent('')
        setSent(true)
        setTimeout(() => setSent(false), 3000)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-stone-800 mb-3">✍️ Tulis Pesan & Kesan</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Bagikan pendapatmu tentang film ini secara anonim..."
        maxLength={500}
        rows={4}
        className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white
          text-stone-800 placeholder-stone-400 resize-none
          focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none
          transition-all text-sm"
      />
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-stone-400">{content.length}/500</div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
      {sent && (
        <p className="text-sm text-green-600 font-medium mt-2">✅ Pesan terkirim! Terima kasih.</p>
      )}
      <Button
        type="submit"
        loading={loading}
        disabled={content.trim().length < 3}
        className="mt-3 w-full"
      >
        Kirim Anonim
      </Button>
    </form>
  )
}
