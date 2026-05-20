import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(messages)
}

export async function POST(request: NextRequest) {
  const { content } = await request.json()

  const trimmed = content?.trim() ?? ''
  if (trimmed.length < 3) {
    return NextResponse.json({ error: 'Pesan terlalu pendek (min 3 karakter)' }, { status: 400 })
  }
  if (trimmed.length > 500) {
    return NextResponse.json({ error: 'Pesan terlalu panjang (max 500 karakter)' }, { status: 400 })
  }

  const message = await prisma.message.create({
    data: { content: trimmed },
  })

  return NextResponse.json(message, { status: 201 })
}
