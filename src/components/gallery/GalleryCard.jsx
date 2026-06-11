/**
 * GalleryCard — individual image card with 3D cursor tilt, hover parallax
 * Used in both masonry and grid layouts.
 */

import React, { useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './GalleryCard.module.css'

export default function GalleryCard({ image, index = 0 }) {
  const cardRef  = useRef(null)
  const imgRef   = useRef(null)
  const rafRef   = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)

  // ─── 3D tilt handler ────────────────────────────────────────────────
  const handleMouseMove = useCallback((e) => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const card = cardRef.current
      if (!card) return
      const rect = card.getBoundingClientRect()
      const cx = rect.left + rect.width  / 2
      const cy = rect.top  + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width  / 2)  // -1 to 1
      const dy = (e.clientY - cy) / (rect.height / 2)  // -1 to 1
      const rotX = -dy * 8
      const rotY =  dx * 8

      card.style.transform =
        `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`

      // Parallax inner image in opposite direction for depth
      if (imgRef.current) {
        imgRef.current.style.transform =
          `translate(${-dx * 8}px, ${-dy * 8}px) scale(1.08)`
      }
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    setHovered(false)
    const card = cardRef.current
    if (card) card.style.transform = ''
    if (imgRef.current) imgRef.current.style.transform = ''
  }, [])

  const handleMouseEnter = useCallback(() => {
    setHovered(true)
  }, [])

  if (!image?.id) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={styles.wrapper}
    >
      <Link
        to={`/gallery/${image.id}`}
        className={styles.card}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        aria-label={`View ${image.title}`}
        style={{ willChange: 'transform' }}
      >
        {/* Image container */}
        <div className={styles.imageWrap}>
          {/* Skeleton */}
          {!loaded && <div className={styles.skeleton} />}

          <img
            ref={imgRef}
            src={image.thumbnail || image.src}
            alt={image.title || ''}
            className={`${styles.image} ${loaded ? styles.visible : ''}`}
            onLoad={() => setLoaded(true)}
            loading="lazy"
            style={{ willChange: 'transform', transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)' }}
          />

          {/* Gradient overlay */}
          <div className={`${styles.overlay} ${hovered ? styles.hovered : ''}`} />

          {/* Category badge */}
          {image.category && (
            <span className={styles.badge}>{image.category}</span>
          )}
        </div>

        {/* Caption */}
        <div className={`${styles.caption} ${hovered ? styles.captionHovered : ''}`}>
          <h3 className={styles.title}>{image.title}</h3>
          {image.author && (
            <p className={styles.author}>{image.author}</p>
          )}
        </div>

        {/* View indicator */}
        <div className={`${styles.viewIndicator} ${hovered ? styles.viewVisible : ''}`}>
          <span>View</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </Link>
    </motion.div>
  )
}
