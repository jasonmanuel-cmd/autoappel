'use client'

import { useEffect, useRef } from 'react'

const TRAFFIC_COUNT = 35

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
    for (let i = 0; i < 60; i++) {
      const dash = document.createElement('div')
      dash.className = 'road-dash'
      dash.style.left = `${rand() * 100}%`
      dash.style.top = `${rand() * 100}%`
      dash.style.width = `${80 + rand() * 120}px`
      dash.style.animation = `road-drift ${8 + rand() * 12}s linear ${rand() * -15}s infinite`
      frag.appendChild(dash)
    }

    /* ── Tail lights (red drifting dots) ─── */
    for (let i = 0; i < TRAFFIC_COUNT; i++) {
      const dot = document.createElement('div')
      dot.className = 'tail-light'
      dot.style.left = `${rand() * 100}%`
      dot.style.top = `${5 + rand() * 85}%`
      const size = 3 + rand() * 3
      dot.style.width = `${size}px`
      dot.style.height = dot.style.width
      const dur = 5 + rand() * 10
      dot.style.animation = `tail-drift ${dur}s linear ${rand() * -15}s infinite`
      frag.appendChild(dot)
    }

    /* ── Street lamp glows ───────────────── */
    for (let i = 0; i < 10; i++) {
      const lamp = document.createElement('div')
      lamp.className = 'street-lamp'
      lamp.style.left = `${2 + i * 10 + rand() * 3}%`
      lamp.style.top = `${55 + rand() * 35}%`
      const height = 40 + rand() * 30
      lamp.style.height = `${height}px`
      lamp.style.animation = `lamp-flicker ${2 + rand() * 3}s ease-in-out ${rand() * 2}s infinite`
      frag.appendChild(lamp)
    }

    container.appendChild(frag)
  }, [])

  return <div ref={containerRef} className="road-container" aria-hidden="true" />
}
