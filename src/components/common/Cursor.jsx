/**
 * Cursor — custom animated cursor (hides on touch devices)
 */

import React, { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const pos     = useRef({ x: -100, y: -100 })
  const ring    = useRef({ x: -100, y: -100 })
  const raf     = useRef(null)

  useEffect(() => {
    // Hide on touch
    if (window.matchMedia('(hover: none)').matches) return

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    // Lerp ring toward dot for smooth lag effect
    function tick() {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12
      ring.current.y += (pos.current.y - ring.current.y) * 0.12

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${pos.current.x - 6}px, ${pos.current.y - 6}px)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px)`
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    // Expand ring on hoverable elements
    const grow = () => {
      if (ringRef.current) {
        ringRef.current.style.width  = '60px'
        ringRef.current.style.height = '60px'
        ringRef.current.style.opacity = '0.5'
      }
    }
    const shrink = () => {
      if (ringRef.current) {
        ringRef.current.style.width  = '36px'
        ringRef.current.style.height = '36px'
        ringRef.current.style.opacity = '1'
      }
    }

    document.querySelectorAll('a,button,[role="button"]').forEach(el => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })

    // Observer for dynamically added interactive elements
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a,button,[role="button"]').forEach(el => {
        el.addEventListener('mouseenter', grow)
        el.addEventListener('mouseleave', shrink)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('mousemove', onMove)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="custom-cursor" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  )
}
