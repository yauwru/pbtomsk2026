import Link from 'next/link'

const features = [
  {
    href: '/twibon',
    emoji: '📸',
    title: 'Foto Twibon',
    desc: 'Foto dengan frame khusus Pesta Babi Papua 2026 dan bagikan ke IG/WA',
    color: 'bg-amber-600',
    hover: 'hover:bg-amber-500',
  },
  {
    href: '/pesan',
    emoji: '💬',
    title: 'Pesan & Kesan',
    desc: 'Tulis pendapatmu tentang film ini secara anonim',
    color: 'bg-green-800',
    hover: 'hover:bg-green-700',
  },
  {
    href: '/admin',
    emoji: '🔐',
    title: 'Panel Admin',
    desc: 'Registrasi peserta, absensi, dan undian berhadiah',
    color: 'bg-red-800',
    hover: 'hover:bg-red-700',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen tribal-pattern">
      {/* Hero */}
      <div className="bg-gradient-to-b from-red-900 to-red-800 text-center py-16 px-4 shadow-lg">
        <p className="text-amber-300 text-sm font-semibold tracking-[0.3em] uppercase mb-3">
          Komunitas Papua · Tomsk, Rusia
        </p>
        <h1
          className="text-4xl md:text-6xl font-black text-amber-50 leading-tight"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          Nonton Bareng
        </h1>
        <h2
          className="text-3xl md:text-5xl font-bold text-amber-300 mt-1"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          Film Pesta Babi
        </h2>
        <p className="text-amber-200/80 mt-4 text-base">
          Papua 2026 · Tomsk, Russia
        </p>
        <div className="mt-6 inline-block bg-amber-600/20 border border-amber-400/40 rounded-full px-5 py-2">
          <span className="text-amber-300 font-semibold text-sm tracking-wider">
            #papuabukantanahkosong
          </span>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className={`
                ${f.color} ${f.hover}
                text-white rounded-2xl p-6 shadow-lg
                transition-all duration-200 hover:shadow-xl hover:-translate-y-1
                flex flex-col gap-3
              `}
            >
              <span className="text-4xl">{f.emoji}</span>
              <div>
                <h3
                  className="text-xl font-bold"
                  style={{ fontFamily: 'var(--font-cinzel)' }}
                >
                  {f.title}
                </h3>
                <p className="text-sm opacity-80 mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Info */}
        <div className="mt-10 bg-amber-100 border border-amber-300 rounded-2xl p-6 text-center shadow-sm">
          <p className="text-stone-600 text-sm leading-relaxed">
            Acara ini diselenggarakan oleh komunitas Papua di Tomsk, Rusia
            sebagai bentuk apresiasi dan solidaritas terhadap budaya Papua.
          </p>
          <p className="text-amber-700 font-bold mt-3 text-sm tracking-wide">
            #papuabukantanahkosong · #PestaBabiPapua2026
          </p>
        </div>
      </div>
    </div>
  )
}
