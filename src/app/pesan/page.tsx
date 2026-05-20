'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import MessageForm from '@/components/messages/MessageForm'
import MessageList from '@/components/messages/MessageList'
import { Message } from '@/types'

export default function PesanPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/messages')
      const data = await res.json()
      setMessages(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 15000)
    return () => clearInterval(interval)
  }, [fetchMessages])

  function handleSent(msg: Message) {
    setMessages((prev) => [msg, ...prev])
  }

  return (
    <div className="min-h-screen relative">
      <div className="cross-watermark absolute inset-0 pointer-events-none" />

      {/* Header */}
      <div className="relative border-b border-amber-900/20 py-8 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f10] to-transparent pointer-events-none" />
        <Link href="/" className="relative text-amber-600/60 text-xs hover:text-amber-400/80 transition-colors tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-cinzel)' }}>
          ← Kembali
        </Link>
        <h1 className="relative text-2xl md:text-3xl font-bold text-amber-200/90 mt-2"
            style={{ fontFamily: 'var(--font-cinzel)', textShadow: '0 0 30px rgba(196,154,60,0.2)' }}>
          Pesan &amp; Kesan
        </h1>
        <p className="relative text-[#6a5a3a] text-xs mt-1 italic">
          Bagikan pendapatmu secara anonim
        </p>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8 flex flex-col gap-8">
        <MessageForm onSent={handleSent} />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-amber-300/70 text-xs tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-cinzel)' }}>
              Suara Peserta
              <span className="ml-2 text-amber-700/60">({messages.length})</span>
            </h2>
            <span className="text-[#3a3020] text-xs">refresh 15 dtk</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-[#4a3a20]">Memuat pesan...</div>
          ) : (
            <MessageList messages={messages} />
          )}
        </div>
      </div>
    </div>
  )
}
