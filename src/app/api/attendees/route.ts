import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard) return guard

  const attendees = await prisma.attendee.findMany({
    include: { sessions: true },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(attendees)
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard) return guard

  const { name } = await request.json()
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Nama tidak boleh kosong' }, { status: 400 })
  }

  try {
    const attendee = await prisma.attendee.create({
      data: { name: name.trim() },
      include: { sessions: true },
    })
    return NextResponse.json(attendee, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Nama sudah terdaftar' }, { status: 409 })
  }
}
