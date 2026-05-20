import { NextRequest, NextResponse } from 'next/server'
import { signToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Password salah' }, { status: 401 })
  }

  const token = await signToken({ role: 'admin' })
  const response = NextResponse.json({ ok: true })
  setAuthCookie(response, token)
  return response
}
