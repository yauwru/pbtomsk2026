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

export default function MessageCard({ message }: { message: Message }) {
  return (
    <div className="panel rounded-xl px-5 py-4 border border-amber-900/15 hover:border-amber-800/25 transition-all">
      <p className="text-amber-100/70 text-sm leading-relaxed whitespace-pre-wrap italic">&ldquo;{message.content}&rdquo;</p>
      <p className="text-amber-700/60 text-xs mt-2 text-right">{timeAgo(message.createdAt)}</p>
    </div>
  )
}
