/**
 * Hero — cinematic full-viewport hero with parallax background,
 * animated headline split, and scroll indicator
 */

import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useSiteData, safeGet } from '../../context/SiteDataContext'
import styles from './Hero.module.css'

// Split text into animated spans
function SplitText({ text, className }) {
  const words = (text || '').split('\n')
  return (
    <span className={className}>
      {words.map((line, li) => (
        <span key={li} className={styles.line}>
          {line.split(' ').map((word, wi) => (
            <motion.span
              key={wi}
              className={styles.word}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0,      opacity: 1  }}
              transition={{
                duration: 0.9,
                delay: 0.4 + (li * 3 + wi) * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}&nbsp;
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  )
}

export default function Hero() {
  const { data } = useSiteData()
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Parallax transforms
  const imgY   = useTransform(scrollYProgress, [0, 1], ['0%',  '30%'])
  const textY  = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])
  const opac   = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  if (!data) return null

  const hero  = safeGet(data, 'hero', {})
  const headline    = safeGet(hero, 'headline',    'Visual Art')
  const subheadline = safeGet(hero, 'subheadline')
  const ctaText     = safeGet(hero, 'ctaText',     'Explore Gallery')
  const ctaLink     = safeGet(hero, 'ctaLink',     '/gallery')
  const secText     = safeGet(hero, 'secondaryCtaText')
  const secLink     = safeGet(hero, 'secondaryCtaLink', '/about')
  const featuredImg = safeGet(hero, 'featuredImage')

  return (
    <section ref={containerRef} className={styles.hero} aria-label="Hero">
      {/* Parallax background image */}
      {featuredImg && (
        <motion.div className={styles.bgWrap} style={{ y: imgY }}>
          <img
            src={featuredImg}
            alt="Hero background"
            className={styles.bgImage}
            loading="eager"
          />
          <div className={styles.bgOverlay} />
        </motion.div>
      )}

      {/* Noise texture overlay for premium film grain effect */}
      <div className={styles.grain} aria-hidden="true" />

      {/* Content */}
      <motion.div
        className={`container ${styles.content}`}
        style={{ y: textY, opacity: opac }}
      >
        {/* Eye-brow label */}
        <motion.span
          className={`section-label ${styles.eyebrow}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {safeGet(data, 'site.tagline', 'Visual Gallery')}
        </motion.span>

        {/* Headline */}
        <h1 className={styles.headline}>
          <SplitText text={headline} />
        </h1>

        {/* Subheadline */}
        {subheadline && (
          <motion.p
            className={styles.sub}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.7, delay: 0.9 }}
          >
            {subheadline}
          </motion.p>
        )}

        {/* CTAs */}
        <motion.div
          className={styles.ctas}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.7, delay: 1.1 }}
        >
          <Link to={ctaLink} className="btn btn-primary">
            {ctaText}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          {secText && (
            <Link to={secLink} className="btn btn-outline">
              {secText}
            </Link>
          )}
        </motion.div>

        {/* Stats row */}
        {safeGet(data, 'about.stats') && (
          <motion.div
            className={styles.stats}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            {data.about.stats.slice(0, 4).map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        style={{ opacity: opac }}
        aria-hidden="true"
      >
        <span className={styles.scrollText}>Scroll</span>
        <div className={styles.scrollLine}>
          <motion.div
            className={styles.scrollDot}
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
