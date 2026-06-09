'use client'

import { useEffect, useRef } from 'react'

const TRAFFIC_COUNT = 20

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

export default function RoadBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const rand = seededRandom(73)
    const frag = document.createDocumentFragment()

    /* ── Road dashes ─────────────────────── */
    for (let i = 0; i < 30; i++) {
      const dash = document.createElement('div')
      dash.className = 'road-dash'
      dash.style.left = `${rand() * 100}%`
      dash.style.top = `${rand() * 100}%`
      dash.style.width = `${60 + rand() * 80}px`
      dash.style.animation = `road-drift ${12 + rand() * 18}s linear ${rand() * -20}s infinite`
      dash.style.opacity = `${0.06 + rand() * 0.08}`
      frag.appendChild(dash)
    }

    /* ── Tail lights (red drifting dots) ─── */
    for (let i = 0; i < TRAFFIC_COUNT; i++) {
      const dot = document.createElement('div')
      dot.className = 'tail-light'
      dot.style.left = `${rand() * 100}%`
      dot.style.top = `${10 + rand() * 80}%`
      dot.style.width = `${2 + rand() * 2}px`
      dot.style.height = dot.style.width
      const dur = 6 + rand() * 14
      dot.style.animation = `tail-drift ${dur}s linear ${rand() * -20}s infinite`
      dot.style.opacity = `${0.15 + rand() * 0.25}`
      frag.appendChild(dot)
    }

    /* ── Street lamp glows ───────────────── */
    for (let i = 0; i < 6; i++) {
      const lamp = document.createElement('div')
      lamp.className = 'street-lamp'
      lamp.style.left = `${5 + i * 18 + rand() * 5}%`
      lamp.style.top = `${60 + rand() * 30}%`
      lamp.style.animation = `lamp-flicker ${3 + rand() * 4}s ease-in-out ${rand() * 3}s infinite`
      frag.appendChild(lamp)
    }

    container.appendChild(frag)
  }, [])

  return <div ref={containerRef} className="road-container" aria-hidden="true" />
}
