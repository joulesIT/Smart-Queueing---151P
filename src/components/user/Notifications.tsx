interface Notification {
  id: number
  msg: string
  time: string
  read: boolean
}

interface Props {
  notifications: Notification[]
}

export default function Notifications({ notifications }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-5 max-w-2xl mx-auto w-full">
      <h2 className="text-xl font-bold text-white mb-1 pt-2">Notifications</h2>
      <p className="text-sm mb-5" style={{ color: 'var(--muted-foreground)' }}>
        {notifications.filter(n => !n.read).length} unread alerts
      </p>

      <div className="space-y-3">
        {notifications.map(n => (
          <div
            key={n.id}
            className="rounded-xl p-4 flex items-start gap-3"
            style={{
              background: n.read ? 'var(--card)' : 'rgba(59,130,246,0.08)',
              border: `1px solid ${n.read ? 'var(--border)' : 'rgba(59,130,246,0.3)'}`,
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 mt-0.5"
              style={{ background: n.read ? 'var(--muted)' : 'rgba(59,130,246,0.15)' }}
            >
              🔔
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white leading-snug">{n.msg}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{n.time}</p>
            </div>
            {!n.read && (
              <div
                className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                style={{ background: 'var(--primary)' }}
              />
            )}
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-16">
            <span className="text-4xl block mb-3">🔕</span>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
