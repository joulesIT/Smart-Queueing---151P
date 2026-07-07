import { useState } from 'react'
import type { AuthUser, Role } from '../App'

interface Props {
  onLogin: (user: AuthUser) => void
}

export default function LoginPage({ onLogin }: Props) {
  const [role, setRole] = useState<Role>('user')
  const [view, setView] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name || !password) { setError('Please fill in all fields.'); return }

    if (role === 'admin' && password !== 'admin123') {
      setError('Invalid admin credentials.')
      return
    }

    onLogin({ role, name: name || 'User', queueNumber: undefined })
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)' }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 w-[45%]"
        style={{
          background: 'linear-gradient(145deg, #0f2654 0%, #0b1120 60%, #061230 100%)',
          borderRight: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ background: 'var(--primary)' }}
          >
            Q
          </div>
          <span className="text-white font-semibold text-lg tracking-wide">SQMS</span>
        </div>

        <div>
          <div className="mb-8">
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6"
              style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--primary)' }}
            >
              Smart Queue Management System
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Smarter queues,<br />faster service.
            </h1>
            <p style={{ color: '#64748b' }} className="text-base leading-relaxed">
              Join queues instantly, track your position in real time, and never waste time waiting in line again.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: '⚡', label: 'Real-time Position Tracking' },
              { icon: '📱', label: 'QR Code Quick Join' },
              { icon: '🔔', label: 'Instant Notifications' },
              { icon: '📊', label: 'Admin Reports & Analytics' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-3">
                <span className="text-xl">{f.icon}</span>
                <span style={{ color: '#94a3b8' }} className="text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ color: '#334155' }} className="text-xs">
          © 2025 SQMS — Smart Queue Management System
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
              style={{ background: 'var(--primary)' }}
            >
              Q
            </div>
            <span className="text-white font-semibold text-lg">SQMS</span>
          </div>

          {/* Role tabs */}
          <div
            className="flex rounded-xl p-1 mb-8"
            style={{ background: 'var(--muted)' }}
          >
            {(['user', 'admin'] as Role[]).map(r => (
              <button
                key={r}
                onClick={() => { setRole(r); setError('') }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize"
                style={role === r
                  ? { background: 'var(--primary)', color: '#fff' }
                  : { color: 'var(--muted-foreground)', background: 'transparent' }
                }
              >
                {r === 'user' ? '👤 User' : '🛡 Admin'}
              </button>
            ))}
          </div>

          {/* Form card */}
          <div
            className="rounded-2xl p-8"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <h2 className="text-2xl font-bold text-white mb-1">
              {view === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p style={{ color: 'var(--muted-foreground)' }} className="text-sm mb-6">
              {view === 'login'
                ? `Sign in as ${role}`
                : 'Register for the queue system'}
            </p>

            {error && (
              <div
                className="rounded-lg px-4 py-3 text-sm mb-4"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={role === 'admin' ? 'Admin name' : 'Your name'}
                  className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
                  style={{
                    background: 'var(--muted)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                  }}
                />
              </div>

              {view === 'register' && (
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
                    style={{
                      background: 'var(--muted)',
                      color: 'var(--foreground)',
                      border: '1px solid var(--border)',
                    }}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
                  Password {role === 'admin' && <span style={{ color: 'var(--muted-foreground)' }}>(hint: admin123)</span>}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
                  style={{
                    background: 'var(--muted)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold text-sm transition-all mt-2"
                style={{ background: 'var(--primary)', color: '#fff' }}
              >
                {view === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {role === 'user' && (
              <p className="text-center text-sm mt-5" style={{ color: 'var(--muted-foreground)' }}>
                {view === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => { setView(v => v === 'login' ? 'register' : 'login'); setError('') }}
                  className="font-semibold"
                  style={{ color: 'var(--primary)' }}
                >
                  {view === 'login' ? 'Register' : 'Sign in'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
