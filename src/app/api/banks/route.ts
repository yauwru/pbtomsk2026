import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const banks = await prisma.bankAccount.findMany({ orderBy: { createdAt: 'asc' } })
  return NextResponse.json(banks)
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (auth) return auth
  const { bankName, accountName, accountNumber, currency, notes } = await request.json()
  if (!bankName || !accountName || !accountNumber) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
  }
  const bank = await prisma.bankAccount.create({
    data: { bankName, accountName, accountNumber, currency: currency || 'IDR', notes: notes || null }
  })
  return NextResponse.json(bank, { status: 201 })
}
