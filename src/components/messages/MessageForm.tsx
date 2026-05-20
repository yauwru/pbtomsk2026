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
      if (!res.ok) setError(data.error ?? 'Gagal mengirim')
      else {
        onSent(data); setContent(''); setSent(true)
        setTimeout(() => setSent(false), 3000)
      }
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="panel rounded-2xl p-5 border border-amber-900/25">
      <h3 className="font-bold text-amber-300/70 text-xs tracking-widest uppercase mb-3"
          style={{ fontFamily: 'var(--font-cinzel)' }}>
        ✍️ Tulis Pesan &amp; Kesan
      </h3>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Bagikan pendapatmu tentang film ini secara anonim..."
        maxLength={500}
        rows={4}
        className="w-full px-4 py-3 rounded-xl border
          bg-[#0a130a]/60 backdrop-blur-sm
          text-amber-100/80 placeholder-amber-700/50 resize-none
          border-amber-900/25 focus:border-amber-700/40
          focus:ring-1 focus:ring-amber-900/30
          outline-none transition-all text-sm italic"
      />
      <div className="flex items-center justify-between mt-2">
        <span className="text-amber-700/60 text-xs">{content.length}/500</span>
        {error && <p className="text-xs text-red-400/70">{error}</p>}
      </div>
      {sent && <p className="text-xs text-green-500/70 mt-1">✓ Pesan terkirim. Terima kasih.</p>}
      <Button type="submit" loading={loading} disabled={content.trim().length < 3} className="mt-3 w-full">
        Kirim Anonim
      </Button>
    </form>
  )
}
