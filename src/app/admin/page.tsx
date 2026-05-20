'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/admin/dashboard')
      } else {
        const data = await res.json()
        setError(data.error ?? 'Login gagal')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="cross-watermark absolute inset-0 pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Cross icon */}
        <div className="text-center mb-8">
          <Link href="/" className="text-amber-700/50 text-xs hover:text-amber-500/70 transition-colors tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-cinzel)' }}>
            ← Beranda
          </Link>
          <div className="text-4xl text-red-800/60 mt-6 mb-3" style={{ fontFamily: 'var(--font-cinzel)' }}>✝</div>
          <h1 className="text-xl font-bold text-amber-200/80"
              style={{ fontFamily: 'var(--font-cinzel)', textShadow: '0 0 20px rgba(196,154,60,0.2)' }}>
            Panel Panitia
          </h1>
          <p className="text-[#5a4a30] text-xs mt-1">Akses khusus panitia</p>
        </div>

        <form onSubmit={handleSubmit}
              className="panel rounded-2xl p-6 border border-amber-900/30 flex flex-col gap-4">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            autoFocus
          />
          <Button type="submit" loading={loading} className="w-full mt-1">
            Masuk
          </Button>
        </form>
      </div>
    </div>
  )
}
