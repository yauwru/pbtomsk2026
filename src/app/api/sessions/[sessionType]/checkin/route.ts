import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { SessionType } from '@/generated/prisma/enums'

const VALID_TYPES = ['CHECK_IN', 'MID_FILM', 'END_FILM']

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionType: string }> }
) {
  const guard = await requireAdmin(request)
  if (guard) return guard

  const { sessionType } = await params
  if (!VALID_TYPES.includes(sessionType)) {
    return NextResponse.json({ error: 'Tipe sesi tidak valid' }, { status: 400 })
  }

  const { attendeeId } = await request.json()

  const record = await prisma.sessionRecord.upsert({
    where: {
      attendeeId_sessionType: { attendeeId, sessionType: sessionType as SessionType },
    },
    update: {},
    create: { attendeeId, sessionType: sessionType as SessionType },
  })

  return NextResponse.json(record, { status: 201 })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionType: string }> }
) {
  const guard = await requireAdmin(request)
  if (guard) return guard

  const { sessionType } = await params
  if (!VALID_TYPES.includes(sessionType)) {
    return NextResponse.json({ error: 'Tipe sesi tidak valid' }, { status: 400 })
  }

  const { attendeeId } = await request.json()

  try {
    await prisma.sessionRecord.delete({
      where: {
        attendeeId_sessionType: { attendeeId, sessionType: sessionType as SessionType },
      },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Record tidak ditemukan' }, { status: 404 })
  }
}
