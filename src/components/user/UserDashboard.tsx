import { useState } from 'react'
import type { AuthUser } from '../../App'
import QueueStatus from './QueueStatus'
import JoinQueue from './JoinQueue'
import Notifications from './Notifications'

type Tab = 'home' | 'join' | 'status' | 'notifications'

interface Props {
  user: AuthUser
  onLogout: () => void
}

export default function UserDashboard({ user, onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('home')
  const [queueTicket, setQueueTicket] = useState<string | null>(null)
  const [notifications] = useState([
    { id: 1, msg: 'You are now #3 in line at Counter A.', time: '2 min ago', read: false },
    { id: 2, msg: 'Queue at Health Services is now open.', time: '10 min ago', read: true },
    { id: 3, msg: 'Your appointment at Window 2 is in 5 minutes.', time: '20 min ago', read: true },
  ])

  const unread = notifications.filter(n => !n.read).length

  const nav: { id: Tab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'join', label: 'Join Queue', icon: '📋' },
    { id: 'status', label: 'My Status', icon: '📍' },
    { id: 'notifications', label: 'Alerts', icon: '🔔' },
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
          <span className="font-semibold text-white text-sm hidden sm:block">SQMS</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Logged in as</p>
            <p className="text-sm font-semibold text-white">{user.name}</p>
          </div>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col">
        {tab === 'home' && <HomeTab user={user} queueTicket={queueTicket} onGoJoin={() => setTab('join')} onGoStatus={() => setTab('status')} />}
        {tab === 'join' && <JoinQueue user={user} onJoined={ticket => { setQueueTicket(ticket); setTab('status') }} />}
        {tab === 'status' && <QueueStatus ticket={queueTicket} user={user} />}
        {tab === 'notifications' && <Notifications notifications={notifications} />}
      </main>

      {/* Bottom nav */}
      <nav
        className="flex border-t"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {nav.map(n => (
          <button
            key={n.id}
            onClick={() => setTab(n.id)}
            className="flex-1 flex flex-col items-center py-3 gap-1 relative transition-all"
            style={tab === n.id ? { color: 'var(--primary)' } : { color: 'var(--muted-foreground)' }}
          >
            <span className="text-lg">{n.icon}</span>
            <span className="text-xs font-medium">{n.label}</span>
            {n.id === 'notifications' && unread > 0 && (
              <span
                className="absolute top-2 right-[30%] w-4 h-4 rounded-full text-white text-xs flex items-center justify-center"
                style={{ background: 'var(--danger)', fontSize: '10px' }}
              >
                {unread}
              </span>
            )}
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

function HomeTab({ user, queueTicket, onGoJoin, onGoStatus }: {
  user: AuthUser
  queueTicket: string | null
  onGoJoin: () => void
  onGoStatus: () => void
}) {
  const services = [
    { name: 'Health Services', counter: 'A', wait: '12 min', people: 8, status: 'open' },
    { name: 'Records Office', counter: 'B', wait: '25 min', people: 14, status: 'open' },
    { name: 'Finance Window', counter: 'C', wait: '5 min', people: 3, status: 'open' },
    { name: 'Registrar', counter: 'D', wait: '—', people: 0, status: 'closed' },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5 max-w-2xl mx-auto w-full">
      {/* Greeting */}
      <div className="pt-2">
        <p style={{ color: 'var(--muted-foreground)' }} className="text-sm">Good day,</p>
        <h2 className="text-2xl font-bold text-white">{user.name} 👋</h2>
      </div>

      {/* Active ticket banner */}
      {queueTicket && (
        <button
          onClick={onGoStatus}
          className="w-full rounded-xl p-4 flex items-center justify-between transition-all"
          style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)' }}
        >
          <div className="text-left">
            <p className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>ACTIVE TICKET</p>
            <p className="text-white font-bold text-lg">{queueTicket}</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Tap to view your position</p>
          </div>
          <span className="text-2xl">🎫</span>
        </button>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onGoJoin}
          className="rounded-xl p-4 flex flex-col gap-2 transition-all text-left"
          style={{ background: 'var(--primary)', color: '#fff' }}
        >
          <span className="text-2xl">📋</span>
          <span className="font-semibold text-sm">Join a Queue</span>
          <span className="text-xs opacity-70">Select a service</span>
        </button>
        <button
          onClick={onGoJoin}
          className="rounded-xl p-4 flex flex-col gap-2 transition-all text-left"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
        >
          <span className="text-2xl">📷</span>
          <span className="font-semibold text-sm">Scan QR Code</span>
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Quick join</span>
        </button>
      </div>

      {/* Services list */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>
          AVAILABLE SERVICES
        </h3>
        <div className="space-y-2">
          {services.map(s => (
            <div
              key={s.name}
              className="rounded-xl p-4 flex items-center justify-between"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm text-white"
                  style={{ background: s.status === 'open' ? 'var(--secondary)' : 'var(--muted)' }}
                >
                  {s.counter}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{s.name}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {s.status === 'open' ? `${s.people} in queue` : 'Closed'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className="text-xs font-semibold"
                  style={{ color: s.status === 'open' ? 'var(--success)' : 'var(--muted-foreground)' }}
                >
                  {s.status === 'open' ? `~${s.wait}` : 'Unavailable'}
                </p>
                {s.status === 'open' && (
                  <button
                    onClick={onGoJoin}
                    className="text-xs font-semibold mt-0.5"
                    style={{ color: 'var(--primary)' }}
                  >
                    Join →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
