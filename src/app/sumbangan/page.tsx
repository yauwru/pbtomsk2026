'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CrossIcon from '@/components/ui/CrossIcon'
import { BankAccount } from '@/types'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy}
      className="text-[10px] px-2 py-0.5 rounded border border-amber-700/40 text-amber-600/70 hover:text-amber-400 hover:border-amber-600/60 transition-colors">
      {copied ? '✓ Tersalin' : 'Salin'}
    </button>
  )
}

function BankCard({ bank }: { bank: BankAccount }) {
  const isRub = bank.currency === 'RUB'
  return (
    <div className="panel rounded-xl p-5 border border-amber-900/25 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-amber-200/90 font-semibold text-sm" style={{ fontFamily: 'var(--font-cinzel)' }}>
          {bank.bankName}
        </p>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold tracking-wider ${
          isRub
            ? 'bg-blue-900/30 text-blue-400/80 border-blue-800/30'
            : 'bg-green-900/30 text-green-400/80 border-green-800/30'
        }`}>
          {bank.currency}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-amber-100 font-mono text-lg tracking-widest flex-1">{bank.accountNumber}</p>
        <CopyButton text={bank.accountNumber} />
      </div>
      <p className="text-amber-700/70 text-xs">a/n {bank.accountName}</p>
      {bank.notes && <p className="text-amber-700/60 text-xs italic border-t border-amber-900/20 pt-2 mt-1">{bank.notes}</p>}
    </div>
  )
}

export default function SumbanganPage() {
  const [banks, setBanks] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/banks').then(r => r.json()).then(setBanks).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen relative">
      <div className="cross-watermark absolute inset-0 pointer-events-none" />

      {/* Header */}
      <div className="relative border-b border-amber-900/20 py-8 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1520] to-transparent pointer-events-none" />
        <Link href="/" className="relative text-amber-600/60 text-xs hover:text-amber-400/80 transition-colors tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-cinzel)' }}>
          ← Kembali
        </Link>
        <div className="relative mt-2 flex flex-col items-center">
          <span className="text-3xl mb-1">🤝</span>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-200/90"
              style={{ fontFamily: 'var(--font-cinzel)', textShadow: '0 0 30px rgba(30,60,196,0.2)' }}>
            Sumbangan Sukarela
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <CrossIcon className="w-3 h-4 text-red-800/50" />
            <p className="text-amber-600/70 text-xs italic">
              Bersama meringankan beban saudara kita di Papua
            </p>
            <CrossIcon className="w-3 h-4 text-red-800/50" />
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8 flex flex-col gap-8">

        {/* Research / Context Section */}
        <div className="panel rounded-2xl p-6 border border-amber-900/25 flex flex-col gap-5">
          <h2 className="text-amber-300/80 text-sm font-bold tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-cinzel)' }}>
            Apa yang Terjadi di Papua?
          </h2>

          <div className="flex flex-col gap-4 text-amber-100/75 text-sm leading-relaxed">
            <p>
              Sejak bertahun-tahun, wilayah pegunungan tengah Papua — termasuk <strong className="text-amber-300/90">Nduga, Intan Jaya, Puncak Jaya,
              dan Pegunungan Bintang</strong> — menjadi arena konflik bersenjata antara aparat keamanan Indonesia
              dan kelompok bersenjata pro-kemerdekaan Papua (TPNPB/OPM).
            </p>
            <p>
              Akibat operasi militer yang terus berlangsung, <strong className="text-amber-300/90">ribuan warga sipil terpaksa
              mengungsi</strong> dari kampung halaman mereka. Mereka meninggalkan rumah, ladang, dan harta benda
              dengan hanya membawa apa yang bisa mereka bawa — seringkali hanya pakaian di badan.
            </p>
            <p>
              Para pengungsi ini hidup dalam kondisi yang sangat sulit: menumpang di gereja, sekolah,
              atau tidur di hutan. <strong className="text-amber-300/90">Akses bantuan kemanusiaan sangat terbatas</strong> karena kondisi
              keamanan yang tidak menentu dan sulitnya medan geografis pegunungan Papua.
            </p>
            <p>
              Kampung-kampung ditinggalkan. Gereja dan sekolah rusak. Anak-anak tidak bisa bersekolah.
              Orang tua tidak bisa berkebun. Sumber penghidupan mereka hilang.
            </p>
          </div>

          <div className="border-t border-amber-900/25 pt-4">
            <h3 className="text-amber-400/80 text-xs font-bold tracking-widest uppercase mb-3"
                style={{ fontFamily: 'var(--font-cinzel)' }}>
              Mengapa Kita Perlu Bertindak
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { num: '60.000+', label: 'Warga mengungsi di Pegunungan Papua' },
                { num: '5+', label: 'Kabupaten terdampak konflik aktif' },
                { num: '2023–kini', label: 'Operasi militer terus berlangsung' },
              ].map(s => (
                <div key={s.label} className="bg-amber-900/10 rounded-lg p-3 border border-amber-900/20">
                  <p className="text-amber-300 font-bold text-base" style={{ fontFamily: 'var(--font-cinzel)' }}>{s.num}</p>
                  <p className="text-amber-700/70 text-[10px] leading-tight mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-950/30 border border-green-800/25 rounded-xl p-4">
            <p className="text-green-300/80 text-xs leading-relaxed">
              <strong>Sumbangan ini ditujukan</strong> untuk mendukung kebutuhan dasar pengungsi Papua:
              pangan, pakaian, dan akses kesehatan — disalurkan melalui jaringan komunitas Papua
              yang terpercaya di lapangan.
            </p>
          </div>
        </div>

        {/* Bank Accounts Section */}
        <div>
          <h2 className="text-amber-300/70 text-xs font-bold tracking-widest uppercase mb-4"
              style={{ fontFamily: 'var(--font-cinzel)' }}>
            Rekening Donasi
          </h2>

          {loading ? (
            <p className="text-amber-700/60 text-sm italic text-center py-8">Memuat informasi rekening...</p>
          ) : banks.length === 0 ? (
            <div className="panel rounded-xl p-6 border border-amber-900/20 text-center">
              <p className="text-amber-700/70 text-sm italic">
                Informasi rekening akan segera ditambahkan oleh panitia.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {banks.map(b => <BankCard key={b.id} bank={b} />)}
            </div>
          )}
        </div>

        <p className="text-amber-900/60 text-[10px] text-center italic leading-relaxed">
          Sumbangan bersifat sukarela. Tidak ada nominal minimum maupun maksimum.
          Setiap kontribusi, sebesar apapun, berarti bagi saudara kita.
        </p>
      </div>
    </div>
  )
}
