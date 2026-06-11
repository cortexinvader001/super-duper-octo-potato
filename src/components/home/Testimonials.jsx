/**
 * Testimonials — editorial quote carousel from JSON data
 */

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSiteData, safeGet } from '../../context/SiteDataContext'
import ScrollReveal from '../common/ScrollReveal'
import styles from './Testimonials.module.css'

export default function Testimonials() {
  const { data } = useSiteData()
  const [active, setActive] = useState(0)

  if (!data) return null

  const testimonials = safeGet(data, 'testimonials', []) || []
  if (testimonials.length === 0) return null

  const current = testimonials[active]

  return (
    <section className={styles.section} aria-labelledby="testimonials-heading">
      <div className="container">
        <ScrollReveal>
          <span className="section-label">Voices</span>
          <h2 id="testimonials-heading" className={styles.title} aria-live="off">
            What collectors say
          </h2>
        </ScrollReveal>

        <div className={styles.quoteArea}>
          {/* Large decorative quote mark */}
          <div className={styles.quoteMark} aria-hidden="true">"</div>

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={styles.quote}
            >
              <p className={styles.quoteText}>{current.quote}</p>
              <footer className={styles.quoteFooter}>
                {current.image && (
                  <img
                    src={current.image}
                    alt={current.author}
                    className={styles.avatar}
                    loading="lazy"
                  />
                )}
                <div>
                  <cite className={styles.author}>{current.author}</cite>
                  {current.role && (
                    <p className={styles.role}>{current.role}</p>
                  )}
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          {/* Navigation dots */}
          {testimonials.length > 1 && (
            <div className={styles.dots} role="tablist" aria-label="Testimonial navigation">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
