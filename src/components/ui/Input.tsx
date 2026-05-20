'use client'

import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-semibold text-stone-700">{label}</label>
      )}
      <input
        {...props}
        className={`
          w-full px-4 py-2.5 rounded-lg border bg-amber-50
          text-stone-800 placeholder-stone-400
          border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-200
          outline-none transition-all
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}
          ${className}
        `}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
