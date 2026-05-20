import Link from 'next/link'
import CrossIcon from '@/components/ui/CrossIcon'

const features = [
  {
    href: '/twibon',
    icon: <span className="text-2xl block mb-2">📸</span>,
    title: 'Foto Twibon',
    desc: 'Foto dengan frame khusus acara. Siap upload ke IG Story.',
    border: 'border-amber-700/40 hover:border-amber-600/70',
    glow: 'hover:shadow-[0_0_24px_rgba(196,154,60,0.2)]',
  },
  {
    href: '/pesan',
    icon: <span className="text-2xl block mb-2">✍️</span>,
    title: 'Pesan & Kesan',
    desc: 'Tulis pendapatmu tentang film ini secara anonim.',
    border: 'border-green-900/40 hover:border-green-700/60',
    glow: 'hover:shadow-[0_0_24px_rgba(30,80,20,0.25)]',
  },
  {
    href: '/admin',
    icon: <CrossIcon className="w-6 h-8 text-red-800/70 block mb-2" />,
    title: 'Panitia',
    desc: 'Registrasi peserta, absensi, dan undian berhadiah.',
    border: 'border-red-900/40 hover:border-red-800/60',
    glow: 'hover:shadow-[0_0_24px_rgba(139,16,16,0.25)]',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cross watermark */}
      <div className="cross-watermark absolute inset-0 pointer-events-none" />

      {/* Hero */}
      <div className="relative min-h-[92vh] flex flex-col items-center justify-end pb-12 px-4">
        {/* Top green atmospheric glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1f0a] via-[#0a130a]/80 to-[#080904] pointer-events-none" />

        {/* Organisation logos row */}
        <div className="absolute top-6 left-0 right-0 flex justify-center">
          <p className="text-[10px] tracking-[0.25em] uppercase text-amber-600/40 font-[var(--font-cinzel)]">
            Komunitas Papua · Tomsk, Russia
          </p>
        </div>

        {/* Main title block */}
        <div className="relative z-10 text-center max-w-xl mx-auto">
          {/* Subtitle above */}
          <p className="text-amber-500/70 text-xs tracking-[0.3em] uppercase mb-5 font-[var(--font-cinzel)]">
            Nobar Film &amp; Diskusi Publik
          </p>

          {/* NONTON BARENG */}
          <p className="text-[#a09070] text-lg md:text-xl tracking-widest uppercase mb-1"
             style={{ fontFamily: 'var(--font-cinzel)' }}>
            Nonton Bareng
          </p>

          {/* PESTA BABI title — mimics poster */}
          <div className="relative inline-block">
            <h1 className="text-6xl md:text-8xl font-black tracking-wider leading-none"
                style={{ fontFamily: 'var(--font-cinzel)', color: '#d4c08a',
                         textShadow: '0 2px 40px rgba(196,154,60,0.25), 0 0 80px rgba(10,19,10,0.8)' }}>
              PES<CrossIcon className="inline-block w-[0.6em] h-[0.8em] align-[-0.1em]" style={{ color: '#a81818' }} />A
            </h1>
            <h1 className="text-6xl md:text-8xl font-black tracking-wider leading-none -mt-2"
                style={{ fontFamily: 'var(--font-cinzel)', color: '#d4c08a',
                         textShadow: '0 2px 40px rgba(196,154,60,0.25)' }}>
              BABI
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-[#8a7a5a] text-sm italic mt-3 mb-1">
            Kolonialisme di Zaman Kita
          </p>
          <p className="text-amber-600/70 text-xs leading-relaxed max-w-xs mx-auto">
            Membaca Krisis Ekologi, Konflik Agraria, dan Ruang Hidup Masyarakat Adat Papua
          </p>

          {/* Event info chips */}
          <div className="flex flex-wrap gap-3 justify-center mt-6 mb-8">
            <span className="panel px-4 py-1.5 rounded-full text-xs text-amber-300/80 tracking-wider">
              📅 23 Mei 2026
            </span>
            <span className="panel px-4 py-1.5 rounded-full text-xs text-amber-300/80 tracking-wider">
              🕒 15.30 WIB
            </span>
            <span className="panel px-4 py-1.5 rounded-full text-xs text-amber-300/80 tracking-wider">
              📍 Tomsk, Rusia
            </span>
          </div>

          {/* Hashtag */}
          <div className="cross-divider text-xs mb-8">
            <span className="text-amber-600/60 tracking-widest font-[var(--font-cinzel)]">
              #papuabukantanahkosong
            </span>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            {features.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className={`
                  panel rounded-xl p-5 text-left border transition-all duration-300
                  ${f.border} ${f.glow}
                `}
              >
                {f.icon}
                <h3 className="text-amber-200/90 font-semibold text-sm mb-1"
                    style={{ fontFamily: 'var(--font-cinzel)' }}>
                  {f.title}
                </h3>
                <p className="text-amber-600/70 text-xs leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom mist fade */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-900/30 to-transparent" />

      <footer className="py-4 text-center">
        <p className="text-amber-700/60 text-xs tracking-widest uppercase">
          Terbuka Untuk Umum · Fee Sukarela
        </p>
      </footer>
    </div>
  )
}
