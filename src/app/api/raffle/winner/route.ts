import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const winner = await prisma.raffleWinner.findFirst()
  return NextResponse.json(winner)
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard) return guard

  const existing = await prisma.raffleWinner.findFirst()
  if (existing) {
    return NextResponse.json({ error: 'Pemenang sudah ditentukan' }, { status: 409 })
  }

  const { attendeeId, attendeeName } = await request.json()

  const winner = await prisma.raffleWinner.create({
    data: { attendeeId, attendeeName },
  })

  return NextResponse.json(winner, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard) return guard

  await prisma.raffleWinner.deleteMany()
  return NextResponse.json({ ok: true })
}
