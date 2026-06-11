/**
 * useCursor — tracks mouse position for 3D tilt and custom cursor effects
 * Returns normalized (-1 to 1) x/y values relative to element or viewport.
 */

import { useRef, useCallback, useEffect } from 'react'

export function useMousePosition() {
  const posRef = useRef({ x: 0, y: 0 })
  const normRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      normRef.current = {
        x: (e.clientX / window.innerWidth)  * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return { posRef, normRef }
}

/**
 * useTilt — applies CSS 3D tilt transform to a ref element based on cursor
 * @param {number} maxDeg  — max tilt degrees (default 12)
 * @param {number} scale   — hover scale factor (default 1.03)
 */
export function useTilt(maxDeg = 12, scale = 1.03) {
  const ref = useRef(null)
  const rafRef = useRef(null)
  const isHover = useRef(false)

  const onEnter = useCallback(() => { isHover.current = true }, [])
  const onLeave = useCallback(() => {
    isHover.current = false
    if (ref.current) {
      ref.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'
    }
  }, [])

  const onMove = useCallback((e) => {
    if (!isHover.current || !ref.current) return
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = ref.current.getBoundingClientRect()
      const cx = rect.left + rect.width  / 2
      const cy = rect.top  + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width  / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)
      const rotX = -dy * maxDeg
      const rotY =  dx * maxDeg
      ref.current.style.transform =
        `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`
    })
  }, [maxDeg, scale])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    el.addEventListener('mousemove', onMove)
    el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      el.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [onEnter, onLeave, onMove])

  return ref
}
