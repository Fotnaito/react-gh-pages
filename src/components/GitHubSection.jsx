import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Star, GitFork, Users, BookOpen, MapPin, AlertCircle, Loader2,
} from 'lucide-react'
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
} from 'recharts'

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572a5',
  Java: '#b07219', Go: '#00add8', Rust: '#dea584', C: '#555555',
  'C++': '#f34b7d', 'C#': '#178600', HTML: '#e34c26', CSS: '#563d7c',
  Shell: '#89e051', Ruby: '#701516', Swift: '#ffac45', Kotlin: '#a97bff',
  PHP: '#4f5d95', Dart: '#00b4ab', Scala: '#c22d40', Haskell: '#5e5086',
}

const tooltipStyle = {
  backgroundColor: 'var(--bg-soft)',
  border: '1px solid var(--card-border)',
  borderRadius: '10px',
  color: 'var(--text)',
  fontSize: '0.85rem',
}

export default function GitHubSection() {
  const [username, setUsername] = useState('')
  const [input, setInput] = useState('')
  const [data, setData] = useState(null)
  const [langs, setLangs] = useState([])
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [error, setError] = useState('')

  async function load(user) {
    setStatus('loading')
    setError('')
    try {
      const [userRes, repoRes] = await Promise.all([
        fetch(`https://api.github.com/users/${user}`),
        fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`),
      ])
      if (userRes.status === 404) throw new Error(`User "${user}" not found.`)
      if (!userRes.ok || !repoRes.ok) throw new Error('GitHub API rate limit or network error — try again in a minute.')

      const [profile, repos] = await Promise.all([userRes.json(), repoRes.json()])

      const counts = {}
      for (const repo of repos) {
        if (repo.language) counts[repo.language] = (counts[repo.language] || 0) + 1
      }
      const chart = Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6)

      setData({ ...profile, repos })
      setLangs(chart)
      setStatus('idle')
    } catch (e) {
      setError(e.message)
      setStatus('error')
    }
  }

  function onSubmit(e) {
    e.preventDefault()
    const user = input.trim().replace(/^@/, '')
    if (!user) return
    setUsername(user)
    load(user)
  }

  const topRepos = data
    ? [...(data.repos || [])].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5)
    : []

  return (
    <section className="section" id="github">
      <h2 className="section-title"><BookOpen /> GitHub profile explorer</h2>
      <p className="section-sub">Pulls live data from the GitHub API — no API key needed.</p>

      <form className="search-row" onSubmit={onSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a GitHub username, e.g. torvalds"
          aria-label="GitHub username"
        />
        <button className="btn-primary" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? <Loader2 className="spin" size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={18} />}
          Search
        </button>
      </form>

      {status === 'error' && (
        <div className="card" style={{ display: 'flex', gap: '0.7rem', alignItems: 'center', color: 'var(--bad)' }}>
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!data && status !== 'loading' && status !== 'error' && (
          <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card empty-hint">
            Search any GitHub username to see their stats, top repositories, and language breakdown.
          </motion.div>
        )}

        {data && (
          <motion.div
            key={data.login}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-4" style={{ marginBottom: '1.2rem' }}>
              <Stat icon={<BookOpen size={20} />} value={data.public_repos} label="Public repos" />
              <Stat icon={<Star size={20} />} value={data.followers} label="Followers" />
              <Stat icon={<Users size={20} />} value={data.following} label="Following" />
              <Stat icon={<GitFork size={20} />} value={new Date(data.created_at).getFullYear()} label="Joined GitHub" />
            </div>

            <div className="grid grid-2">
              <div className="card">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <img className="avatar" src={data.avatar_url} alt={data.login} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{data.name || data.login}</div>
                    <a href={data.html_url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem' }}>
                      @{data.login}
                    </a>
                    {data.bio && <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', margin: '0.5rem 0 0' }}>{data.bio}</p>}
                    {data.location && (
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', color: 'var(--text-dim)', fontSize: '0.82rem', marginTop: '0.5rem' }}>
                        <MapPin size={14} /> {data.location}
                      </div>
                    )}
                  </div>
                </div>
                <h4 style={{ margin: '1rem 0 0.4rem' }}>Top repositories</h4>
                {topRepos.map((repo) => (
                  <div className="repo-item" key={repo.id}>
                    <a href={repo.html_url} target="_blank" rel="noreferrer">{repo.name}</a>
                    <div className="repo-meta">
                      <span><Star size={12} style={{ verticalAlign: -2 }} /> {repo.stargazers_count}</span>
                      <span><GitFork size={12} style={{ verticalAlign: -2 }} /> {repo.forks_count}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card">
                <h4 style={{ margin: '0 0 0.5rem' }}>Language breakdown</h4>
                {langs.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={langs} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3} strokeWidth={0}>
                        {langs.map((entry) => (
                          <Cell key={entry.name} fill={LANG_COLORS[entry.name] || '#6d8bff'} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: 'var(--text)' }} />
                      <Legend iconSize={10} wrapperStyle={{ fontSize: '0.82rem', color: 'var(--text-dim)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-hint">No language data available for this user.</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function Stat({ icon, value, label }) {
  return (
    <div className="card stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}
