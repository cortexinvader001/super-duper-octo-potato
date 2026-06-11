/**
 * useSmoothScroll — wraps Lenis for buttery smooth scrolling
 * Call once at the App level.
 */

import { useEffect, useRef } from 'react'

export function useSmoothScroll() {
  const lenisRef = useRef(null)

  useEffect(() => {
    let lenis = null
    let animFrame = null

    // Dynamically import Lenis to avoid SSR issues
    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      })

      lenisRef.current = lenis

      function raf(time) {
        lenis.raf(time)
        animFrame = requestAnimationFrame(raf)
      }

      animFrame = requestAnimationFrame(raf)
    }).catch(() => {
      // Lenis unavailable — native scroll is fine
    })

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame)
      if (lenis) lenis.destroy()
    }
  }, [])

  return lenisRef
}
