'use client'

interface Attendee {
  id: string
  name: string
}

interface Props {
  eligible: Attendee[]
}

export default function EligibleList({ eligible }: Props) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🏆</span>
        <h3 className="font-bold text-stone-800">
          Peserta Eligible Undian
          <span className="ml-2 bg-green-600 text-white text-sm px-2 py-0.5 rounded-full">
            {eligible.length} orang
          </span>
        </h3>
      </div>
      {eligible.length === 0 ? (
        <p className="text-stone-400 text-sm">Belum ada peserta yang hadir di 3 sesi absensi.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {eligible.map((a, i) => (
            <div key={a.id} className="flex items-center gap-2 bg-white border border-green-100 rounded-lg px-3 py-2">
              <span className="text-xs text-stone-400">{i + 1}.</span>
              <span className="text-sm font-medium text-stone-700">{a.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
