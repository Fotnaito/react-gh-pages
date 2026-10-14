import { useEffect, useState } from 'react'
import { Moon, Sun, Command } from 'lucide-react'
import ParticleField from './components/ParticleField'
import Hero from './components/Hero'
import GitHubSection from './components/GitHubSection'
import DashboardSection from './components/DashboardSection'
import CommandPalette from './components/CommandPalette'
import { useTheme } from './hooks/useTheme'
import { useLocalStorage } from './hooks/useLocalStorage'
import './App.css'

const DEFAULT_TODOS = [
  { id: 1, text: 'Deploy this site to GitHub Pages', done: true },
  { id: 2, text: 'Press ⌘K (or Ctrl+K) to try the command palette', done: false },
  { id: 3, text: 'Switch to light mode from the navbar', done: false },
]

export default function App() {
  const { theme, toggle } = useTheme()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [todos, setTodos] = useLocalStorage('app-todos', DEFAULT_TODOS)

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="app">
      <ParticleField />

      <nav className="nav">
        <div className="nav-logo"><span className="dot" /> devdash</div>
        <div className="nav-links">
          <a href="#github">GitHub</a>
          <a href="#dashboard">Dashboard</a>
          <button className="icon-btn" onClick={() => setPaletteOpen(true)}>
            <Command size={14} /> <kbd>⌘K</kbd>
          </button>
          <button className="icon-btn" onClick={toggle} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>

      <main className="container">
        <Hero />
        <GitHubSection />
        <DashboardSection todos={todos} setTodos={setTodos} />
        <footer className="footer">
          Built with React 18, Vite, Framer Motion &amp; Recharts — deployed on GitHub Pages.
          View source on <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>.
        </footer>
      </main>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        theme={theme}
        onToggleTheme={toggle}
        onClearTodos={() => setTodos([{ id: Date.now(), text: 'Add your first task above ☝️', done: false }])}
      />
    </div>
  )
}
