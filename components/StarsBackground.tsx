'use client'

import { useEffect, useRef } from 'react'

const STAR_COUNT_SM = 120
const STAR_COUNT_MD = 40
const STAR_COUNT_LG = 15

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

export default function StarsBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const rand = seededRandom(42)
    const frag = document.createDocumentFragment()

    for (let i = 0; i < STAR_COUNT_SM; i++) {
      const star = document.createElement('div')
      star.className = 'star star-sm'
      star.style.left = `${rand() * 100}%`
      star.style.top = `${rand() * 100}%`
      star.style.animation = `twinkle-slow ${2 + rand() * 4}s ease-in-out ${rand() * 5}s infinite`
      frag.appendChild(star)
    }

    for (let i = 0; i < STAR_COUNT_MD; i++) {
      const star = document.createElement('div')
      star.className = 'star star-md'
      star.style.left = `${rand() * 100}%`
      star.style.top = `${rand() * 100}%`
      star.style.animation = `twinkle ${3 + rand() * 3}s ease-in-out ${rand() * 4}s infinite`
      frag.appendChild(star)
    }

    for (let i = 0; i < STAR_COUNT_LG; i++) {
      const star = document.createElement('div')
      star.className = 'star star-lg'
      star.style.left = `${rand() * 100}%`
      star.style.top = `${rand() * 100}%`
      star.style.animation = `twinkle ${4 + rand() * 4}s ease-in-out ${rand() * 6}s infinite`
      star.style.boxShadow = '0 0 4px rgba(255,255,255,0.3)'
      frag.appendChild(star)
    }

    container.appendChild(frag)
  }, [])

  return <div ref={containerRef} className="stars-container" aria-hidden="true" />
}
