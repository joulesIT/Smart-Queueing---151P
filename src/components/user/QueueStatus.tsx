import { useState, useEffect } from 'react'
import type { AuthUser } from '../../App'

interface Props {
  ticket: string | null
  user: AuthUser
}

export default function QueueStatus({ ticket, user }: Props) {
  const [position, setPosition] = useState(4)
  const [totalAhead, setTotalAhead] = useState(4)

  useEffect(() => {
    if (!ticket) return
    const interval = setInterval(() => {
      setPosition(p => {
        if (p <= 1) { clearInterval(interval); return 1 }
        return p - 1
      })
      setTotalAhead(p => Math.max(0, p - 1))
    }, 8000)
    return () => clearInterval(interval)
  }, [ticket])

  if (!ticket) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
        <span className="text-5xl">📋</span>
        <h2 className="text-xl font-bold text-white">No Active Ticket</h2>
        <p className="text-sm text-center" style={{ color: 'var(--muted-foreground)' }}>
          You haven't joined a queue yet. Go to "Join Queue" to get started.
        </p>
      </div>
    )
  }

  const counterLetter = ticket.split('-')[0]
  const progressPct = Math.max(0, Math.min(100, ((8 - position) / 8) * 100))

  const statusColor =
    position === 1 ? 'var(--success)' :
    position <= 3 ? 'var(--warning)' :
    'var(--primary)'

  const statusLabel =
    position === 1 ? 'You\'re next!' :
    position <= 3 ? 'Almost your turn' :
    'In queue'

  return (
    <div className="flex-1 overflow-y-auto p-5 max-w-md mx-auto w-full space-y-5 pt-6">
      {/* Ticket card */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>
          YOUR TICKET
        </p>
        <p
          className="text-5xl font-black tracking-widest mb-3"
          style={{ color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}
        >
          {ticket}
        </p>
        <span
          className="inline-block px-4 py-1 rounded-full text-xs font-bold"
          style={{ background: `${statusColor}22`, color: statusColor }}
        >
          {statusLabel}
        </span>
      </div>

      {/* Position ring */}
      <div
        className="rounded-2xl p-6 flex flex-col items-center gap-4"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="54" fill="none" stroke="var(--muted)" strokeWidth="10" />
            <circle
              cx="64" cy="64" r="54" fill="none"
              stroke={statusColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - progressPct / 100)}`}
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white">{position}</span>
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>position</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full text-center">
          <Stat label="People Ahead" value={String(totalAhead)} />
          <Stat label="Counter" value={counterLetter} />
          <Stat label="Est. Wait" value={`~${position * 3}m`} />
        </div>
      </div>

      {/* Steps */}
      <div
        className="rounded-2xl p-5 space-y-3"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <p className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
          QUEUE PROGRESS
        </p>
        {[
          { label: 'Joined queue', done: true },
          { label: 'Waiting for your turn', done: position < 4 },
          { label: "You're next!", done: position === 1 },
          { label: 'Being served', done: false },
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: step.done ? 'var(--success)' : 'var(--muted)',
                color: step.done ? '#fff' : 'var(--muted-foreground)',
              }}
            >
              {step.done ? '✓' : i + 1}
            </div>
            <span
              className="text-sm"
              style={{ color: step.done ? 'var(--foreground)' : 'var(--muted-foreground)' }}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Info */}
      <p className="text-xs text-center pb-4" style={{ color: 'var(--muted-foreground)' }}>
        You'll receive a notification when it's almost your turn. Please stay nearby.
      </p>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
    </div>
  )
}
