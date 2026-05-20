'use client'

interface Attendee { id: string; name: string }

export default function EligibleList({ eligible }: { eligible: Attendee[] }) {
  return (
    <div className="panel rounded-xl p-5 border border-green-900/30">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-amber-500 text-lg">★</span>
        <h3 className="text-amber-300/70 text-xs font-bold tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-cinzel)' }}>
          Peserta Eligible
          <span className="ml-2 bg-green-900/50 text-green-400/80 border border-green-800/30 text-[10px] px-2 py-0.5 rounded-full">
            {eligible.length} orang
          </span>
        </h3>
      </div>
      {eligible.length === 0 ? (
        <p className="text-amber-700/70 text-xs italic">
          Belum ada peserta yang hadir di 3 sesi absensi.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {eligible.map((a, i) => (
            <div key={a.id}
                 className="flex items-center gap-2 bg-green-950/20 border border-green-900/20 rounded-lg px-3 py-2">
              <span className="text-amber-700/60 text-[10px]">{i + 1}.</span>
              <span className="text-amber-200/70 text-xs">{a.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
