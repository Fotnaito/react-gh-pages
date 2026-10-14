import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Check, Activity, TrendingUp, Zap } from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'

// Deterministic pseudo-random series so the chart looks organic but stable.
function seededSeries(seed) {
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  let val = 40
  return Array.from({ length: 30 }, (_, i) => {
    val = Math.max(8, Math.min(95, val + (rand() - 0.46) * 22))
    return { day: `D${i + 1}`, activity: Math.round(val) }
  })
}

const tooltipStyle = {
  backgroundColor: 'var(--bg-soft)',
  border: '1px solid var(--card-border)',
  borderRadius: '10px',
  color: 'var(--text)',
  fontSize: '0.85rem',
}

export default function DashboardSection({ todos, setTodos }) {
  const [draft, setDraft] = useState('')
  const activity = useMemo(() => seededSeries(42), [])

  const doneCount = todos.filter((t) => t.done).length
  const pct = todos.length ? Math.round((doneCount / todos.length) * 100) : 0

  function addTodo(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setTodos((prev) => [...prev, { id: Date.now(), text, done: false }])
    setDraft('')
  }

  return (
    <section className="section" id="dashboard">
      <h2 className="section-title"><Activity /> Dashboard</h2>
      <p className="section-sub">Visualizations plus a persistent task board — everything survives page reloads.</p>

      <div className="grid grid-2" style={{ marginBottom: '1.2rem' }}>
        <div className="card">
          <h4 style={{ margin: '0 0 0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} style={{ color: 'var(--accent)' }} /> Simulated activity stream
          </h4>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', margin: '0 0 1rem' }}>
            Generated with a seeded PRNG — same data on every visit.
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={activity} margin={{ top: 5, right: 5, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--card-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="var(--text-dim)" fontSize={11} interval={4} />
              <YAxis stroke="var(--text-dim)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: 'var(--text)' }} />
              <Area type="monotone" dataKey="activity" stroke="var(--accent)" strokeWidth={2.5} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h4 style={{ margin: '0 0 0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={18} style={{ color: 'var(--accent-2)' }} /> Task board
          </h4>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', margin: '0 0 1rem' }}>
            {doneCount}/{todos.length} complete · saved to localStorage
          </p>

          <form className="todo-input-row" onSubmit={addTodo}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a task and hit Enter…"
              aria-label="New task"
            />
            <button className="btn-primary" type="submit" style={{ padding: '0.7rem 1rem' }}>
              <Plus size={18} />
            </button>
          </form>

          <AnimatePresence initial={false}>
            {todos.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25 }}
                className={`todo-item ${todo.done ? 'done' : ''}`}
              >
                <button
                  className={`todo-check ${todo.done ? 'done' : ''}`}
                  onClick={() => setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t)))}
                  aria-label={todo.done ? 'Mark as not done' : 'Mark as done'}
                >
                  <Check size={14} strokeWidth={3} />
                </button>
                <span className="todo-text">{todo.text}</span>
                <button
                  className="todo-del"
                  onClick={() => setTodos((prev) => prev.filter((t) => t.id !== todo.id))}
                  aria-label="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="todo-progress">
            <div style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </section>
  )
}
