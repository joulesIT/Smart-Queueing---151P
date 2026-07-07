import { useState } from 'react'

type Period = 'today' | 'week' | 'month'

const data: Record<Period, {
  served: number; avgWait: string; peakHour: string; satisfaction: string
  hourly: { hour: string; count: number }[]
  counters: { id: string; name: string; served: number; avgWait: string; efficiency: number }[]
}> = {
  today: {
    served: 142, avgWait: '14m', peakHour: '10–11 AM', satisfaction: '94%',
    hourly: [
      { hour: '8AM', count: 12 }, { hour: '9AM', count: 28 }, { hour: '10AM', count: 35 },
      { hour: '11AM', count: 30 }, { hour: '12PM', count: 10 }, { hour: '1PM', count: 18 },
      { hour: '2PM', count: 9 },
    ],
    counters: [
      { id: 'A', name: 'Health Services', served: 48, avgWait: '12m', efficiency: 92 },
      { id: 'B', name: 'Records Office', served: 52, avgWait: '18m', efficiency: 78 },
      { id: 'C', name: 'Finance Window', served: 42, avgWait: '8m', efficiency: 96 },
      { id: 'D', name: 'Registrar', served: 0, avgWait: '—', efficiency: 0 },
    ],
  },
  week: {
    served: 894, avgWait: '16m', peakHour: 'Monday AM', satisfaction: '91%',
    hourly: [
      { hour: 'Mon', count: 180 }, { hour: 'Tue', count: 155 }, { hour: 'Wed', count: 170 },
      { hour: 'Thu', count: 148 }, { hour: 'Fri', count: 142 }, { hour: 'Sat', count: 99 },
    ],
    counters: [
      { id: 'A', name: 'Health Services', served: 290, avgWait: '13m', efficiency: 90 },
      { id: 'B', name: 'Records Office', served: 320, avgWait: '19m', efficiency: 76 },
      { id: 'C', name: 'Finance Window', served: 284, avgWait: '9m', efficiency: 95 },
      { id: 'D', name: 'Registrar', served: 0, avgWait: '—', efficiency: 0 },
    ],
  },
  month: {
    served: 3820, avgWait: '15m', peakHour: 'Week 2', satisfaction: '89%',
    hourly: [
      { hour: 'W1', count: 920 }, { hour: 'W2', count: 1050 }, { hour: 'W3', count: 980 }, { hour: 'W4', count: 870 },
    ],
    counters: [
      { id: 'A', name: 'Health Services', served: 1240, avgWait: '12m', efficiency: 91 },
      { id: 'B', name: 'Records Office', served: 1380, avgWait: '20m', efficiency: 75 },
      { id: 'C', name: 'Finance Window', served: 1200, avgWait: '8m', efficiency: 94 },
      { id: 'D', name: 'Registrar', served: 0, avgWait: '—', efficiency: 0 },
    ],
  },
}

export default function Reports() {
  const [period, setPeriod] = useState<Period>('today')
  const d = data[period]
  const maxCount = Math.max(...d.hourly.map(h => h.count))

  return (
    <div className="p-5 lg:p-8 max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white mb-0.5">Reports & Analytics</h2>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Queue performance summary
          </p>
        </div>
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ background: 'var(--muted)' }}
        >
          {(['today', 'week', 'month'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize"
              style={period === p
                ? { background: 'var(--primary)', color: '#fff' }
                : { color: 'var(--muted-foreground)', background: 'transparent' }
              }
            >
              {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Served', value: String(d.served), icon: '✅' },
          { label: 'Avg Wait Time', value: d.avgWait, icon: '⏱' },
          { label: 'Peak Period', value: d.peakHour, icon: '📈' },
          { label: 'Satisfaction', value: d.satisfaction, icon: '⭐' },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-xl p-4"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <span className="text-xl block mb-2">{s.icon}</span>
            <p className="text-xl font-black text-white">{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <h3 className="text-sm font-semibold mb-5" style={{ color: 'var(--muted-foreground)' }}>
          VOLUME CHART
        </h3>
        <div className="flex items-end gap-2 h-36">
          {d.hourly.map(h => (
            <div key={h.hour} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-semibold text-white">{h.count}</span>
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${(h.count / maxCount) * 100}%`,
                  background: 'var(--primary)',
                  minHeight: '4px',
                }}
              />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{h.hour}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Counter breakdown */}
      <div>
        <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>
          COUNTER BREAKDOWN
        </h3>
        <div className="space-y-2">
          {d.counters.map(c => (
            <div
              key={c.id}
              className="rounded-xl p-4"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                  style={{ background: c.efficiency > 0 ? 'var(--secondary)' : 'var(--muted)' }}
                >
                  {c.id}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{c.name}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {c.served} served · Avg wait {c.avgWait}
                  </p>
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: c.efficiency >= 90 ? 'var(--success)' : c.efficiency >= 70 ? 'var(--warning)' : 'var(--muted-foreground)' }}
                >
                  {c.efficiency > 0 ? `${c.efficiency}%` : 'Closed'}
                </span>
              </div>
              {c.efficiency > 0 && (
                <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--muted)' }}>
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: `${c.efficiency}%`,
                      background: c.efficiency >= 90 ? 'var(--success)' : c.efficiency >= 70 ? 'var(--warning)' : 'var(--danger)',
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Export button */}
      <div className="flex justify-end pb-4">
        <button
          className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'var(--primary)', color: '#fff' }}
          onClick={() => alert('Report exported as PDF!')}
        >
          ⬇ Export Report
        </button>
      </div>
    </div>
  )
}
