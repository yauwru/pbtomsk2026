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
    <div className="min-h-screen tribal-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-stone-500 text-sm hover:text-stone-700 transition-colors">
            ← Kembali ke Beranda
          </Link>
          <h1
            className="text-2xl font-bold text-red-800 mt-4"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            🔐 Panel Admin
          </h1>
          <p className="text-stone-500 text-sm mt-1">Akses khusus panitia</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-amber-200 rounded-2xl p-6 shadow-lg flex flex-col gap-4"
        >
          <Input
            label="Password Admin"
            type="password"
            placeholder="Masukkan password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            autoFocus
          />
          <Button type="submit" loading={loading} className="w-full">
            Masuk
          </Button>
        </form>
      </div>
    </div>
  )
}
