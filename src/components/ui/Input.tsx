'use client'

import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-amber-400/70 tracking-widest uppercase"
               style={{ fontFamily: 'var(--font-cinzel)' }}>
          {label}
        </label>
      )}
      <input
        {...props}
        className={`
          w-full px-4 py-2.5 rounded-lg border
          bg-[#0d150a]/60 backdrop-blur-sm
          text-amber-100/90 placeholder-[#4a4030]
          border-amber-800/30 focus:border-amber-600/60
          focus:ring-2 focus:ring-amber-900/40
          outline-none transition-all text-sm
          ${error ? 'border-red-700/60 focus:border-red-600/60' : ''}
          ${className}
        `}
      />
      {error && <p className="text-xs text-red-400/80">{error}</p>}
    </div>
  )
}
