import { useState } from 'react'
import type { AuthUser } from '../../App'
import QueueManager from './QueueManager'
import Reports from './Reports'

type Tab = 'dashboard' | 'queues' | 'reports'

interface Props {
  user: AuthUser
  onLogout: () => void
}

export default function AdminDashboard({ user, onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('dashboard')

  const nav: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'queues', label: 'Manage Queue', icon: '⚙️' },
    { id: 'reports', label: 'Reports', icon: '📄' },
  ]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      {/* Top bar */}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'var(--primary)' }}
          >
            Q
          </div>
          <div>
            <span className="font-semibold text-white text-sm">SQMS</span>
            <span
              className="ml-2 px-2 py-0.5 rounded text-xs font-bold"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}
            >
              ADMIN
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Admin</p>
            <p className="text-sm font-semibold text-white">{user.name}</p>
          </div>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Desktop sidebar + content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (desktop) */}
        <aside
          className="hidden lg:flex flex-col w-56 p-4 gap-2"
          style={{ background: 'var(--card)', borderRight: '1px solid var(--border)' }}
        >
          {nav.map(n => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
              style={tab === n.id
                ? { background: 'var(--primary)', color: '#fff' }
                : { color: 'var(--muted-foreground)', background: 'transparent' }
              }
            >
              <span>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {tab === 'dashboard' && <AdminHome onNavigate={setTab} />}
          {tab === 'queues' && <QueueManager />}
          {tab === 'reports' && <Reports />}
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav
        className="flex lg:hidden border-t"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {nav.map(n => (
          <button
            key={n.id}
            onClick={() => setTab(n.id)}
            className="flex-1 flex flex-col items-center py-3 gap-1 relative"
            style={tab === n.id ? { color: 'var(--primary)' } : { color: 'var(--muted-foreground)' }}
          >
            <span className="text-lg">{n.icon}</span>
            <span className="text-xs font-medium">{n.label}</span>
            {tab === n.id && (
              <span
                className="absolute top-0 left-1/4 right-1/4 h-0.5 rounded-b-full"
                style={{ background: 'var(--primary)' }}
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}

function AdminHome({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const stats = [
    { label: 'Total in Queue', value: '30', change: '+3', up: true, icon: '👥' },
    { label: 'Avg Wait Time', value: '14m', change: '-2m', up: false, icon: '⏱' },
    { label: 'Served Today', value: '142', change: '+18', up: true, icon: '✅' },
    { label: 'Active Counters', value: '3/4', change: '', up: true, icon: '🪟' },
  ]

  const recentActivity = [
    { ticket: 'A-088', action: 'Called to counter', time: '1 min ago', counter: 'A' },
    { ticket: 'B-045', action: 'Joined queue', time: '2 min ago', counter: 'B' },
    { ticket: 'C-012', action: 'Service complete', time: '4 min ago', counter: 'C' },
    { ticket: 'A-087', action: 'Service complete', time: '6 min ago', counter: 'A' },
    { ticket: 'B-044', action: 'Called to counter', time: '8 min ago', counter: 'B' },
  ]

  const counters = [
    { id: 'A', name: 'Health Services', serving: 'A-088', inQueue: 8, status: 'active' },
    { id: 'B', name: 'Records Office', serving: 'B-045', inQueue: 14, status: 'active' },
    { id: 'C', name: 'Finance Window', serving: 'C-012', inQueue: 3, status: 'active' },
    { id: 'D', name: 'Registrar', serving: '—', inQueue: 0, status: 'closed' },
  ]

  return (
    <div className="p-5 lg:p-8 space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-white mb-0.5">Admin Dashboard</h2>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Monday, July 7, 2025 · Live overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <div
            key={s.label}
            className="rounded-xl p-4"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xl">{s.icon}</span>
              {s.change && (
                <span
                  className="text-xs font-semibold px-1.5 py-0.5 rounded"
                  style={{
                    background: s.up ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                    color: s.up ? 'var(--success)' : 'var(--danger)',
                  }}
                >
                  {s.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Counters */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>
              COUNTER STATUS
            </h3>
            <button
              onClick={() => onNavigate('queues')}
              className="text-xs font-semibold"
              style={{ color: 'var(--primary)' }}
            >
              Manage →
            </button>
          </div>
          <div className="space-y-2">
            {counters.map(c => (
              <div
                key={c.id}
                className="rounded-xl p-3 flex items-center gap-3"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                  style={{ background: c.status === 'active' ? 'var(--secondary)' : 'var(--muted)' }}
                >
                  {c.id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{c.name}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {c.status === 'active' ? `Serving ${c.serving} · ${c.inQueue} waiting` : 'Closed'}
                  </p>
                </div>
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: c.status === 'active' ? 'var(--success)' : 'var(--muted-foreground)' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>
              RECENT ACTIVITY
            </h3>
          </div>
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            {recentActivity.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: 'var(--secondary)' }}
                >
                  {a.counter}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{a.ticket}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{a.action}</p>
                </div>
                <span className="text-xs flex-shrink-0" style={{ color: 'var(--muted-foreground)' }}>
                  {a.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
