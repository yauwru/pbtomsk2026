'use client'

import { useState, useEffect, FormEvent } from 'react'
import Button from '@/components/ui/Button'
import { BankAccount } from '@/types'

const EMPTY_FORM = { bankName: '', accountName: '', accountNumber: '', currency: 'IDR', notes: '' }

export default function BankAccountManager() {
  const [banks, setBanks] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function fetchBanks() {
    const res = await fetch('/api/banks')
    setBanks(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchBanks() }, [])

  function startEdit(bank: BankAccount) {
    setEditId(bank.id)
    setForm({ bankName: bank.bankName, accountName: bank.accountName, accountNumber: bank.accountNumber, currency: bank.currency, notes: bank.notes ?? '' })
    setShowForm(true)
    setError('')
  }

  function cancelForm() {
    setShowForm(false)
    setEditId(null)
    setForm(EMPTY_FORM)
    setError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.bankName || !form.accountName || !form.accountNumber) {
      setError('Nama bank, nama pemilik, dan nomor rekening wajib diisi.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const url = editId ? `/api/banks/${editId}` : '/api/banks'
      const method = editId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) { setError('Gagal menyimpan.'); return }
      await fetchBanks()
      cancelForm()
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus rekening ini?')) return
    setDeleting(id)
    await fetch(`/api/banks/${id}`, { method: 'DELETE' })
    setBanks(prev => prev.filter(b => b.id !== id))
    setDeleting(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-amber-300/70 text-xs font-bold tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-cinzel)' }}>
          Rekening Donasi
        </h3>
        {!showForm && (
          <Button size="sm" onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM) }}>
            + Tambah Rekening
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="panel rounded-xl p-5 border border-amber-700/30 flex flex-col gap-3">
          <p className="text-amber-300/80 text-xs font-bold tracking-widest uppercase mb-1"
             style={{ fontFamily: 'var(--font-cinzel)' }}>
            {editId ? 'Edit Rekening' : 'Tambah Rekening Baru'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-amber-600/70 text-[10px] tracking-widest uppercase block mb-1">Nama Bank *</label>
              <input value={form.bankName} onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))}
                placeholder="BRI, Sberbank, dll."
                className="w-full px-3 py-2 rounded-lg bg-[#0a130a]/60 border border-amber-900/30 text-amber-100/80 text-sm outline-none focus:border-amber-700/50" />
            </div>
            <div>
              <label className="text-amber-600/70 text-[10px] tracking-widest uppercase block mb-1">Mata Uang *</label>
              <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-[#0a130a]/60 border border-amber-900/30 text-amber-100/80 text-sm outline-none focus:border-amber-700/50">
                <option value="IDR">IDR — Rupiah</option>
                <option value="RUB">RUB — Ruble Rusia</option>
                <option value="USD">USD — Dolar AS</option>
              </select>
            </div>
            <div>
              <label className="text-amber-600/70 text-[10px] tracking-widest uppercase block mb-1">Nomor Rekening *</label>
              <input value={form.accountNumber} onChange={e => setForm(f => ({ ...f, accountNumber: e.target.value }))}
                placeholder="1234567890"
                className="w-full px-3 py-2 rounded-lg bg-[#0a130a]/60 border border-amber-900/30 text-amber-100/80 text-sm font-mono outline-none focus:border-amber-700/50" />
            </div>
            <div>
              <label className="text-amber-600/70 text-[10px] tracking-widest uppercase block mb-1">Atas Nama *</label>
              <input value={form.accountName} onChange={e => setForm(f => ({ ...f, accountName: e.target.value }))}
                placeholder="Nama pemilik rekening"
                className="w-full px-3 py-2 rounded-lg bg-[#0a130a]/60 border border-amber-900/30 text-amber-100/80 text-sm outline-none focus:border-amber-700/50" />
            </div>
          </div>

          <div>
            <label className="text-amber-600/70 text-[10px] tracking-widest uppercase block mb-1">Catatan (opsional)</label>
            <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Contoh: transfer via aplikasi BRImo"
              className="w-full px-3 py-2 rounded-lg bg-[#0a130a]/60 border border-amber-900/30 text-amber-100/80 text-sm outline-none focus:border-amber-700/50" />
          </div>

          {error && <p className="text-red-400/70 text-xs">{error}</p>}

          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" type="button" onClick={cancelForm}>Batal</Button>
            <Button size="sm" type="submit" loading={saving}>
              {editId ? 'Simpan Perubahan' : 'Tambah Rekening'}
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-amber-700/60 text-sm italic text-center py-6">Memuat...</p>
      ) : banks.length === 0 && !showForm ? (
        <p className="text-amber-700/60 text-sm italic text-center py-6">Belum ada rekening. Klik &quot;Tambah Rekening&quot; untuk mulai.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {banks.map(b => (
            <div key={b.id} className="panel rounded-xl p-4 border border-amber-900/20 flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-amber-200/90 font-semibold text-sm">{b.bankName}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-semibold ${
                    b.currency === 'RUB' ? 'text-blue-400/80 border-blue-800/30 bg-blue-900/20'
                    : b.currency === 'USD' ? 'text-yellow-400/80 border-yellow-800/30 bg-yellow-900/20'
                    : 'text-green-400/80 border-green-800/30 bg-green-900/20'
                  }`}>{b.currency}</span>
                </div>
                <p className="text-amber-100/80 font-mono text-sm tracking-wider">{b.accountNumber}</p>
                <p className="text-amber-700/60 text-xs">a/n {b.accountName}</p>
                {b.notes && <p className="text-amber-700/50 text-xs italic">{b.notes}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => startEdit(b)}>Edit</Button>
                <Button variant="danger" size="sm" loading={deleting === b.id} onClick={() => handleDelete(b.id)}>Hapus</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
