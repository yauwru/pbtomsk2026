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
    <div className="min-h-screen tribal-pattern">
      <div className="bg-gradient-to-b from-green-900 to-green-800 py-10 px-4 text-center shadow">
        <Link href="/" className="text-green-300 text-sm hover:text-white transition-colors">
          ← Kembali
        </Link>
        <h1
          className="text-3xl md:text-4xl font-bold text-white mt-2"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          💬 Pesan & Kesan
        </h1>
        <p className="text-green-200 mt-1 text-sm">
          Bagikan pendapatmu secara anonim
        </p>
      </div>

      <div className="max-w-xl mx-auto px-4 py-10 flex flex-col gap-8">
        <MessageForm onSent={handleSent} />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-stone-700">
              Pesan dari Peserta
              <span className="ml-2 text-sm font-normal text-stone-400">
                ({messages.length})
              </span>
            </h2>
            <span className="text-xs text-stone-400">Auto-refresh tiap 15 detik</span>
          </div>

          {loading ? (
            <div className="text-center py-10 text-stone-400">Memuat pesan...</div>
          ) : (
            <MessageList messages={messages} />
          )}
        </div>
      </div>
    </div>
  )
}
