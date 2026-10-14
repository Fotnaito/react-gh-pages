import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Github, LayoutDashboard, Sun, Moon, Trash2, Command } from 'lucide-react'

export default function CommandPalette({ open, onClose, theme, onToggleTheme, onClearTodos }) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const actions = useMemo(() => [
    { id: 'home', label: 'Go to top', hint: 'Scroll', icon: <Home size={16} />, run: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { id: 'github', label: 'Go to GitHub explorer', icon: <Github size={16} />, run: () => document.getElementById('github')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'dash', label: 'Go to dashboard', icon: <LayoutDashboard size={16} />, run: () => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'theme', label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode', hint: theme, icon: theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />, run: onToggleTheme },
    { id: 'clear', label: 'Clear all tasks', icon: <Trash2 size={16} />, run: onClearTodos },
  ], [theme, onToggleTheme, onClearTodos])

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    if (open) {
      setQuery('')
      setIndex(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  useEffect(() => { setIndex(0) }, [query])

  useEffect(() => {
    const el = listRef.current?.children[index]
    el?.scrollIntoView({ block: 'nearest' })
  }, [index])

  function run(action) {
    action.run()
    onClose()
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => Math.min(i + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter' && filtered[index]) run(filtered[index])
    else if (e.key === 'Escape') onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="palette-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="palette"
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type a command or search…"
              aria-label="Command palette input"
            />
            <div className="palette-list" ref={listRef}>
              {filtered.length === 0 && (
                <div style={{ padding: '1rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>No matching commands.</div>
              )}
              {filtered.map((action, i) => (
                <button
                  key={action.id}
                  className={`palette-item ${i === index ? 'active' : ''}`}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => run(action)}
                >
                  {action.icon} {action.label}
                  {action.hint && <span className="pal-hint">{action.hint}</span>}
                  {i === index && <Command size={12} style={{ marginLeft: action.hint ? '0.4rem' : 'auto', color: 'var(--text-dim)' }} />}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
