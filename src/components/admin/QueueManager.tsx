import { useState } from 'react'

interface QueueEntry {
  id: string
  name: string
  joinedAt: string
  position: number
  status: 'waiting' | 'serving' | 'done' | 'skipped'
}

const initialQueues: Record<string, QueueEntry[]> = {
  A: [
    { id: 'A-089', name: 'Maria Santos', joinedAt: '9:12 AM', position: 1, status: 'waiting' },
    { id: 'A-090', name: 'Juan dela Cruz', joinedAt: '9:18 AM', position: 2, status: 'waiting' },
    { id: 'A-091', name: 'Ana Reyes', joinedAt: '9:24 AM', position: 3, status: 'waiting' },
    { id: 'A-092', name: 'Carlo Mendoza', joinedAt: '9:31 AM', position: 4, status: 'waiting' },
  ],
  B: [
    { id: 'B-046', name: 'Liza Tan', joinedAt: '9:05 AM', position: 1, status: 'waiting' },
    { id: 'B-047', name: 'Roberto Garcia', joinedAt: '9:14 AM', position: 2, status: 'waiting' },
    { id: 'B-048', name: 'Patricia Lim', joinedAt: '9:22 AM', position: 3, status: 'waiting' },
  ],
  C: [
    { id: 'C-013', name: 'Kevin Torres', joinedAt: '9:40 AM', position: 1, status: 'waiting' },
    { id: 'C-014', name: 'Grace Villanueva', joinedAt: '9:47 AM', position: 2, status: 'waiting' },
  ],
  D: [],
}

const counterNames: Record<string, string> = {
  A: 'Health Services',
  B: 'Records Office',
  C: 'Finance Window',
  D: 'Registrar',
}

export default function QueueManager() {
  const [queues, setQueues] = useState(initialQueues)
  const [activeCounter, setActiveCounter] = useState('A')
  const [serving, setServing] = useState<Record<string, string | null>>({ A: 'A-088', B: 'B-045', C: 'C-012', D: null })
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const callNext = (counter: string) => {
    const q = queues[counter]
    if (!q.length) return
    const next = q[0]
    setServing(s => ({ ...s, [counter]: next.id }))
    setQueues(prev => ({ ...prev, [counter]: prev[counter].slice(1).map((e, i) => ({ ...e, position: i + 1 })) }))
    showToast(`Called ${next.id} — ${next.name} to Counter ${counter}`)
  }

  const skipEntry = (counter: string, id: string) => {
    setQueues(prev => {
      const list = prev[counter].filter(e => e.id !== id)
      return { ...prev, [counter]: list.map((e, i) => ({ ...e, position: i + 1 })) }
    })
    showToast(`Skipped ${id}`)
  }

  const markDone = (counter: string) => {
    setServing(s => ({ ...s, [counter]: null }))
    showToast(`Counter ${counter} — service complete`)
  }

  const currentQ = queues[activeCounter] || []
  const counters = Object.keys(queues)

  return (
    <div className="p-5 lg:p-8 max-w-5xl">
      {toast && (
        <div
          className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium text-white shadow-lg"
          style={{ background: 'var(--primary)' }}
        >
          {toast}
        </div>
      )}

      <h2 className="text-xl font-bold text-white mb-1">Queue Manager</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
        Call, skip, and manage each service counter in real time.
      </p>

      {/* Counter tabs */}
      <div
        className="flex gap-2 mb-6 overflow-x-auto pb-1"
      >
        {counters.map(c => (
          <button
            key={c}
            onClick={() => setActiveCounter(c)}
            className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={activeCounter === c
              ? { background: 'var(--primary)', color: '#fff' }
              : { background: 'var(--card)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }
            }
          >
            Counter {c}
            {queues[c].length > 0 && (
              <span
                className="ml-2 px-1.5 py-0.5 rounded text-xs"
                style={{
                  background: activeCounter === c ? 'rgba(255,255,255,0.2)' : 'var(--muted)',
                  color: activeCounter === c ? '#fff' : 'var(--muted-foreground)',
                }}
              >
                {queues[c].length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Currently serving */}
      <div
        className="rounded-2xl p-5 mb-4 flex items-center justify-between flex-wrap gap-4"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div>
          <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--muted-foreground)' }}>
            COUNTER {activeCounter} · {counterNames[activeCounter]}
          </p>
          {serving[activeCounter] ? (
            <>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Now serving:</p>
              <p className="text-2xl font-black" style={{ color: 'var(--success)' }}>
                {serving[activeCounter]}
              </p>
            </>
          ) : (
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No one being served</p>
          )}
        </div>
        <div className="flex gap-2">
          {serving[activeCounter] && (
            <button
              onClick={() => markDone(activeCounter)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.3)' }}
            >
              ✓ Done
            </button>
          )}
          <button
            onClick={() => callNext(activeCounter)}
            disabled={!currentQ.length}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: currentQ.length ? 'var(--primary)' : 'var(--muted)',
              color: currentQ.length ? '#fff' : 'var(--muted-foreground)',
            }}
          >
            Call Next →
          </button>
        </div>
      </div>

      {/* Queue list */}
      <div>
        <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>
          WAITING ({currentQ.length})
        </h3>
        {currentQ.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <span className="text-3xl block mb-2">✅</span>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Queue is empty</p>
          </div>
        ) : (
          <div className="space-y-2">
            {currentQ.map((entry, i) => (
              <div
                key={entry.id}
                className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: i === 0 ? 'var(--primary)' : 'var(--muted)' }}
                >
                  {entry.position}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{entry.id} — {entry.name}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    Joined at {entry.joinedAt}
                  </p>
                </div>
                {i === 0 && (
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded"
                    style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--primary)' }}
                  >
                    Next
                  </span>
                )}
                <button
                  onClick={() => skipEntry(activeCounter, entry.id)}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}
                >
                  Skip
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
