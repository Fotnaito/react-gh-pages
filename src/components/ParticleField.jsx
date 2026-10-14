import { useEffect, useRef } from 'react'

// Interactive particle network rendered on canvas.
// Particles drift, link with lines when close, and repel from the cursor.
export default function ParticleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let particles = []
    const mouse = { x: -9999, y: -9999 }
    const LINK_DIST = 130

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const count = Math.min(110, Math.floor((canvas.width * canvas.height) / 16000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.6,
      }))
    }

    function accentColor() {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6d8bff'
    }

    function step() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const accent = accentColor()

      for (const p of particles) {
        // Mouse repulsion
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.hypot(dx, dy)
        if (dist < 140 && dist > 0.01) {
          const force = (140 - dist) / 140
          p.vx += (dx / dist) * force * 0.35
          p.vy += (dy / dist) * force * 0.35
        }

        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.985
        p.vy *= 0.985
        // Keep a minimum drift so the field never freezes
        if (Math.abs(p.vx) < 0.08) p.vx += (Math.random() - 0.5) * 0.06
        if (Math.abs(p.vy) < 0.08) p.vy += (Math.random() - 0.5) * 0.06

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = accent
        ctx.globalAlpha = 0.55
        ctx.fill()
      }

      // Link lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < LINK_DIST) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = accent
            ctx.globalAlpha = (1 - d / LINK_DIST) * 0.22
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(step)
    }

    function onMove(e) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    function onLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()
    step()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
