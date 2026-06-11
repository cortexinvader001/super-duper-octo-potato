/**
 * ScrollReveal — wraps children with scroll-triggered fade/slide reveal
 * 
 * Props:
 *   y         — slide-up offset (default: 40px)
 *   delay     — stagger delay (default: 0)
 *   duration  — animation duration (default: 0.7)
 *   threshold — IntersectionObserver threshold (default: 0.15)
 *   once      — only animate once (default: true)
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function ScrollReveal({
  children,
  y         = 40,
  delay     = 0,
  duration  = 0.7,
  threshold = 0.15,
  once      = true,
  className = '',
  style     = {},
}) {
  const { ref, inView } = useInView({ threshold, triggerOnce: once })

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * StaggerReveal — wraps a list with staggered child reveals
 */
export function StaggerReveal({ children, stagger = 0.08, threshold = 0.1 }) {
  const { ref, inView } = useInView({ threshold, triggerOnce: true })

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: stagger } },
  }
  const item = {
    hidden: { opacity: 0, y: 30 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
    >
      {React.Children.map(children, (child) =>
        child ? <motion.div variants={item}>{child}</motion.div> : null
      )}
    </motion.div>
  )
}
