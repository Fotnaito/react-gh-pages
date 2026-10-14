import { motion } from 'framer-motion'
import { ArrowDown, Github, Sparkles } from 'lucide-react'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Hero() {
  return (
    <motion.section
      className="hero"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--accent)', marginBottom: '1.2rem', fontSize: '0.9rem', fontWeight: 600 }}>
        <Sparkles size={16} /> React 18 · Vite · GitHub Pages
      </motion.div>

      <motion.h1 variants={item}>
        One repo. One push.<br />
        <span className="grad">A whole interactive dashboard.</span>
      </motion.h1>

      <motion.p variants={item}>
        Live GitHub stats, animated visualizations, a command palette, persistent
        tasks — all running client-side on a free static host. No backend required.
      </motion.p>

      <motion.div className="hero-cta" variants={item}>
        <a href="#github" style={{ textDecoration: 'none' }}>
          <button className="btn-primary">
            <Github size={18} /> Explore a profile
          </button>
        </a>
        <a href="#dashboard" style={{ textDecoration: 'none' }}>
          <button className="icon-btn" style={{ padding: '0.8rem 1.5rem', fontSize: '0.95rem' }}>
            Open dashboard <ArrowDown size={16} />
          </button>
        </a>
      </motion.div>
    </motion.section>
  )
}
