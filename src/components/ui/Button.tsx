'use client'

import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants = {
  primary:   'bg-amber-800/80 hover:bg-amber-700/90 text-amber-100 border-amber-700/60 shadow-[0_0_12px_rgba(196,154,60,0.15)]',
  secondary: 'bg-[#1e2f18]/80 hover:bg-[#2a4020]/90 text-amber-200/90 border-green-800/50',
  danger:    'bg-red-900/70 hover:bg-red-800/80 text-red-100 border-red-800/60',
  ghost:     'bg-transparent hover:bg-white/5 text-[#a09070] border-white/10',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg border font-semibold
        backdrop-blur-sm transition-all duration-200 cursor-pointer tracking-wide
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      style={{ fontFamily: 'var(--font-cinzel)', ...props.style }}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
