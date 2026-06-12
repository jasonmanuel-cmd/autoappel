'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const SPLASH_KEY = 'splash-seen'

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true)
  const [showMain, setShowMain] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hasSeen = sessionStorage.getItem(SPLASH_KEY)
    if (hasSeen) {
      setShowSplash(false)
      setShowMain(true)
      return
    }

    const video = videoRef.current
    if (!video) return

    const handleEnded = () => {
      sessionStorage.setItem(SPLASH_KEY, 'true')
      setShowSplash(false)
      setShowMain(true)
    }

    const handleSkip = () => {
      sessionStorage.setItem(SPLASH_KEY, 'true')
      if (video) video.pause()
      setShowSplash(false)
      setShowMain(true)
    }

    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  if (!showSplash && !showMain) return null

  return (
    <>
      {showSplash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black" role="dialog" aria-modal="true" aria-label="Splash video">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-contain"
            poster="/appealmytickets-logo.png"
            onClick={() => {}}
          >
            <source src="/Splashpage/lagnafopeningvideo.mp4" type="video/mp4" />
          </video>
          <button
            onClick={() => {
              sessionStorage.setItem(SPLASH_KEY, 'true')
              if (videoRef.current) videoRef.current.pause()
              setShowSplash(false)
              setShowMain(true)
            }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Skip intro"
          >
            Skip
          </button>
        </div>
      )}
      {showMain && (
        <div className="animate-fade-in">{children}</div>
      )}
    </>
  )
}