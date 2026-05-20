'use client'

import { Message } from '@/types'
import MessageCard from './MessageCard'

export default function MessageList({ messages }: { messages: Message[] }) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-12 text-amber-700/70">
        <p className="text-3xl mb-3 opacity-40">✝</p>
        <p className="italic text-sm">Belum ada pesan. Jadilah yang pertama.</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-3">
      {messages.map(m => <MessageCard key={m.id} message={m} />)}
    </div>
  )
}
