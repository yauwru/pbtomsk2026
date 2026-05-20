'use client'

import { Message } from '@/types'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  return `${Math.floor(hours / 24)} hari lalu`
}

interface Props {
  message: Message
}

export default function MessageCard({ message }: Props) {
  return (
    <div className="bg-white border border-amber-100 rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
      <p className="text-xs text-stone-400 mt-2 text-right">{timeAgo(message.createdAt)}</p>
    </div>
  )
}
