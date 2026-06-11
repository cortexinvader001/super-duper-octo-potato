/**
 * FeaturedGallery — horizontal scroll strip of featured images
 * with 3D tilt on each card
 */

import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useSiteData, safeGet } from '../../context/SiteDataContext'
import { useTilt } from '../../hooks/useCursor'
import ScrollReveal from '../common/ScrollReveal'
import styles from './FeaturedGallery.module.css'

function FeaturedCard({ image, index }) {
  const tiltRef = useTilt(10, 1.04)

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className={styles.cardOuter}
    >
      <Link
        to={`/gallery/${image.id}`}
        ref={tiltRef}
        className={styles.card}
        aria-label={`View ${image.title}`}
      >
        <div className={styles.imgWrap}>
          <img
            src={image.thumbnail || image.src}
            alt={image.title}
            className={styles.img}
            loading="lazy"
          />
          <div className={styles.cardOverlay}>
            <span className={styles.cardCategory}>{image.category}</span>
            <h3 className={styles.cardTitle}>{image.title}</h3>
            {image.author && (
              <p className={styles.cardAuthor}>{image.author}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function FeaturedGallery() {
  const { data } = useSiteData()
  if (!data) return null

  const images = (safeGet(data, 'gallery.images', []) || [])
    .filter((img) => img.featured)
    .slice(0, 5)

  if (images.length === 0) return null

  const galleryTitle = safeGet(data, 'gallery.title', 'The Collection')
  const gallerySub   = safeGet(data, 'gallery.subtitle')

  return (
    <section className={styles.section} aria-labelledby="featured-heading">
      <div className="container">
        <ScrollReveal>
          <div className={styles.header}>
            <span className="section-label">Featured Works</span>
            <h2 id="featured-heading" className={styles.title}>
              {galleryTitle}
            </h2>
            {gallerySub && (
              <p className={styles.sub}>{gallerySub}</p>
            )}
          </div>
        </ScrollReveal>
      </div>

      {/* Horizontal scroll strip */}
      <div className={styles.strip} role="list" aria-label="Featured images">
        <div className={styles.track}>
          {images.map((img, i) => (
            <FeaturedCard key={img.id} image={img} index={i} />
          ))}
        </div>
      </div>

      <div className="container">
        <ScrollReveal delay={0.2}>
          <div className={styles.footer}>
            <Link to="/gallery" className="btn btn-outline">
              View Full Collection
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
