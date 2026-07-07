import { useState } from 'react'
import type { AuthUser } from '../../App'

interface Props {
  user: AuthUser
  onJoined: (ticket: string) => void
}

const services = [
  { id: 'health', name: 'Health Services', counter: 'A', wait: '12 min', people: 8, icon: '🏥' },
  { id: 'records', name: 'Records Office', counter: 'B', wait: '25 min', people: 14, icon: '📁' },
  { id: 'finance', name: 'Finance Window', counter: 'C', wait: '5 min', people: 3, icon: '💰' },
  { id: 'it', name: 'IT Support', counter: 'E', wait: '8 min', people: 5, icon: '💻' },
]

export default function JoinQueue({ user, onJoined }: Props) {
  const [mode, setMode] = useState<'select' | 'qr' | 'confirm' | 'joined'>('select')
  const [selected, setSelected] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)

  const selectedService = services.find(s => s.id === selected)

  const handleJoin = () => {
    if (!selected) return
    const ticket = `${selectedService!.counter}-${String(Math.floor(Math.random() * 900) + 100)}`
    onJoined(ticket)
  }

  const simulateScan = () => {
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      setSelected('health')
      setMode('confirm')
    }, 2000)
  }

  if (mode === 'qr') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6 max-w-md mx-auto w-full">
        <h2 className="text-xl font-bold text-white">Scan QR Code</h2>
        <p className="text-sm text-center" style={{ color: 'var(--muted-foreground)' }}>
          Point your camera at the QR code posted at the service counter to join instantly.
        </p>

        {/* QR scanner mockup */}
        <div
          className="relative w-64 h-64 rounded-2xl overflow-hidden flex items-center justify-center"
          style={{ background: 'var(--muted)', border: '2px solid var(--primary)' }}
        >
          <div className="absolute inset-4 grid grid-cols-3 grid-rows-3 gap-1 opacity-20">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded" style={{ background: 'var(--foreground)' }} />
            ))}
          </div>
          {scanning ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div
                className="absolute top-0 left-0 right-0 h-1 animate-pulse"
                style={{ background: 'var(--primary)', boxShadow: '0 0 8px var(--primary)' }}
              />
              <span className="text-3xl">📷</span>
              <p className="text-xs" style={{ color: 'var(--primary)' }}>Scanning...</p>
            </div>
          ) : (
            <div className="text-center">
              <span className="text-4xl block mb-2">📷</span>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Camera viewfinder</p>
            </div>
          )}
          {/* Corner brackets */}
          {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-6 h-6`} style={{
              borderTop: i < 2 ? '3px solid var(--primary)' : 'none',
              borderBottom: i >= 2 ? '3px solid var(--primary)' : 'none',
              borderLeft: i % 2 === 0 ? '3px solid var(--primary)' : 'none',
              borderRight: i % 2 === 1 ? '3px solid var(--primary)' : 'none',
            }} />
          ))}
        </div>

        <button
          onClick={simulateScan}
          disabled={scanning}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
          style={{ background: 'var(--primary)', color: '#fff', opacity: scanning ? 0.7 : 1 }}
        >
          {scanning ? 'Scanning...' : 'Simulate Scan'}
        </button>

        <button
          onClick={() => setMode('select')}
          className="text-sm"
          style={{ color: 'var(--muted-foreground)' }}
        >
          ← Back to service list
        </button>
      </div>
    )
  }

  if (mode === 'confirm' && selectedService) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-5 max-w-md mx-auto w-full">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ background: 'var(--secondary)' }}
        >
          {selectedService.icon}
        </div>
        <h2 className="text-xl font-bold text-white text-center">Confirm Your Queue</h2>

        <div
          className="w-full rounded-2xl p-6 space-y-3"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <Row label="Service" value={selectedService.name} />
          <Row label="Counter" value={`Counter ${selectedService.counter}`} />
          <Row label="People Ahead" value={String(selectedService.people)} />
          <Row label="Estimated Wait" value={`~${selectedService.wait}`} />
          <Row label="Your Name" value={user.name} />
        </div>

        <button
          onClick={handleJoin}
          className="w-full py-3 rounded-xl font-semibold text-white transition-all"
          style={{ background: 'var(--primary)' }}
        >
          Confirm & Join Queue
        </button>
        <button
          onClick={() => setMode('select')}
          className="text-sm"
          style={{ color: 'var(--muted-foreground)' }}
        >
          ← Choose different service
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-5 max-w-2xl mx-auto w-full">
      <h2 className="text-xl font-bold text-white mb-1 pt-2">Join a Queue</h2>
      <p className="text-sm mb-5" style={{ color: 'var(--muted-foreground)' }}>
        Select a service or scan a QR code at the counter.
      </p>

      {/* QR option */}
      <button
        onClick={() => setMode('qr')}
        className="w-full rounded-xl p-4 flex items-center gap-4 mb-5 transition-all"
        style={{ background: 'rgba(59,130,246,0.08)', border: '1px dashed rgba(59,130,246,0.4)' }}
      >
        <span className="text-2xl">📷</span>
        <div className="text-left">
          <p className="text-sm font-semibold text-white">Scan QR Code</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Scan the code at the counter for instant join
          </p>
        </div>
        <span className="ml-auto text-lg" style={{ color: 'var(--primary)' }}>→</span>
      </button>

      <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>
        OR CHOOSE A SERVICE
      </h3>

      <div className="space-y-3">
        {services.map(s => (
          <button
            key={s.id}
            onClick={() => { setSelected(s.id); setMode('confirm') }}
            className="w-full rounded-xl p-4 flex items-center gap-4 transition-all text-left"
            style={{
              background: selected === s.id ? 'rgba(59,130,246,0.12)' : 'var(--card)',
              border: `1px solid ${selected === s.id ? 'rgba(59,130,246,0.4)' : 'var(--border)'}`,
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: 'var(--secondary)' }}
            >
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{s.name}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                Counter {s.counter} · {s.people} people ahead
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-semibold" style={{ color: 'var(--success)' }}>~{s.wait}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>wait</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  )
}
