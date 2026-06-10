'use client'

import { useEffect, useRef } from 'react'

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

export default function GalaxyBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const rand = seededRandom(73)
    const frag = document.createDocumentFragment()

    /* ── Nebula clouds (large colored radial glows) ── */
    for (let i = 0; i < 6; i++) {
      const nebula = document.createElement('div')
      nebula.className = 'galaxy-nebula'
      nebula.style.left = `${5 + rand() * 80}%`
      nebula.style.top = `${5 + rand() * 80}%`
      const size = 300 + rand() * 500
      nebula.style.width = `${size}px`
      nebula.style.height = `${size}px`
      const hue = i % 2 === 0 ? 0 : 340 // reds and magenta
      nebula.style.background = `radial-gradient(circle, rgba(${255 - i * 20}, ${20 + rand() * 30}, ${50 + rand() * 60}, ${0.06 + rand() * 0.04}) 0%, transparent 70%)`
      nebula.style.animation = `nebula-pulse ${8 + rand() * 10}s ease-in-out ${rand() * -5}s infinite alternate`
      frag.appendChild(nebula)
    }

    /* ── Stars (tiny dots) ─────────────────── */
    for (let i = 0; i < 200; i++) {
      const star = document.createElement('div')
      star.className = 'galaxy-star'
      star.style.left = `${rand() * 100}%`
      star.style.top = `${rand() * 100}%`
      const size = 1 + rand() * 2
      star.style.width = `${size}px`
      star.style.height = `${size}px`
      const isRed = rand() > 0.85
      if (isRed) {
        star.style.background = '#ff4422'
        star.style.boxShadow = `0 0 ${2 + rand() * 2}px rgba(255, 36, 0, ${0.3 + rand() * 0.3})`
      }
      star.style.animation = `star-twinkle ${2 + rand() * 4}s ease-in-out ${rand() * -3}s infinite alternate`
      frag.appendChild(star)
    }

    /* ── Bright accent stars (larger, more glow) ── */
    for (let i = 0; i < 15; i++) {
      const big = document.createElement('div')
      big.className = 'galaxy-star'
      big.style.left = `${rand() * 100}%`
      big.style.top = `${rand() * 100}%`
      const size = 2 + rand() * 3
      big.style.width = `${size}px`
      big.style.height = `${size}px`
      big.style.background = '#ff6644'
      big.style.boxShadow = `0 0 ${6 + rand() * 6}px rgba(255, 36, 0, 0.6)`
      big.style.animation = `star-twinkle ${3 + rand() * 3}s ease-in-out ${rand() * -2}s infinite alternate`
      frag.appendChild(big)
    }

    /* ── Distant dust particles ────────────── */
    for (let i = 0; i < 80; i++) {
      const dust = document.createElement('div')
      dust.className = 'galaxy-dust'
      dust.style.left = `${rand() * 100}%`
      dust.style.top = `${rand() * 100}%`
      const size = 0.5 + rand() * 0.8
      dust.style.width = `${size}px`
      dust.style.height = `${size}px`
      dust.style.animation = `dust-drift ${20 + rand() * 30}s linear ${rand() * -20}s infinite`
      frag.appendChild(dust)
    }

    container.appendChild(frag)
  }, [])

  return <div ref={containerRef} className="galaxy-container" aria-hidden="true" />
}
