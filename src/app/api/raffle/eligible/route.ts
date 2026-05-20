import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard) return guard

  const eligible = await prisma.attendee.findMany({
    where: {
      AND: [
        { sessions: { some: { sessionType: 'CHECK_IN' } } },
        { sessions: { some: { sessionType: 'MID_FILM' } } },
        { sessions: { some: { sessionType: 'END_FILM' } } },
      ],
    },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(eligible)
}
