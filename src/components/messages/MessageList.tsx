'use client'

import { Message } from '@/types'
import MessageCard from './MessageCard'

interface Props {
  messages: Message[]
}

export default function MessageList({ messages }: Props) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-12 text-stone-400">
        <p className="text-4xl mb-3">💬</p>
        <p>Belum ada pesan. Jadilah yang pertama!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((m) => (
        <MessageCard key={m.id} message={m} />
      ))}
    </div>
  )
}
