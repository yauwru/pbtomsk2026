'use client'

import { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose?: () => void
  children: React.ReactNode
}

export default function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg panel rounded-2xl border border-amber-800/30">
        {children}
      </div>
    </div>
  )
}
