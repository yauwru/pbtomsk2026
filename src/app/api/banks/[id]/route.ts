import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request)
  if (auth) return auth
  const { id } = await params
  const { bankName, accountName, accountNumber, currency, notes } = await request.json()
  const bank = await prisma.bankAccount.update({
    where: { id },
    data: { bankName, accountName, accountNumber, currency, notes: notes || null }
  })
  return NextResponse.json(bank)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request)
  if (auth) return auth
  const { id } = await params
  await prisma.bankAccount.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
