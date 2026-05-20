export type SessionTypeName = 'CHECK_IN' | 'MID_FILM' | 'END_FILM'

export const SESSION_LABELS: Record<SessionTypeName, string> = {
  CHECK_IN: 'Check-In Awal',
  MID_FILM: 'Absensi Tengah Film',
  END_FILM: 'Absensi Akhir Film',
}

export interface AttendeeWithSessions {
  id: string
  name: string
  createdAt: string
  sessions: {
    id: string
    sessionType: SessionTypeName
    checkedAt: string
  }[]
}

export interface RaffleWinner {
  id: string
  attendeeId: string
  attendeeName: string
  drawnAt: string
}

export interface Message {
  id: string
  content: string
  createdAt: string
}

export interface BankAccount {
  id: string
  bankName: string
  accountName: string
  accountNumber: string
  currency: string
  notes?: string | null
  createdAt: string
}
