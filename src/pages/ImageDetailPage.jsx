/**
 * ImageDetailPage — full image detail with metadata, nav, deep linking
 */

import React, { useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useSiteData, safeGet } from '../context/SiteDataContext'
import PageTransition from '../components/common/PageTransition'
import styles from './ImageDetailPage.module.css'

export default function ImageDetailPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { data }   = useSiteData()

  const images = useMemo(
    () => safeGet(data, 'gallery.images', []) || [],
    [data]
  )

  const index = useMemo(
    () => images.findIndex((img) => img.id === id),
    [images, id]
  )

  const image = images[index]
  const prev  = index > 0             ? images[index - 1] : null
  const next  = index < images.length - 1 ? images[index + 1] : null

  const siteTitle = safeGet(data, 'site.title', 'Gallery')

  if (!data)  return null
  if (!image) {
    return (
      <PageTransition>
        <main className="page">
          <div className="container" style={{ paddingTop: 'var(--space-4xl)', textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'var(--fs-2xl)' }}>
              Image not found
            </h1>
            <Link to="/gallery" className="btn btn-outline" style={{ marginTop: 24, display: 'inline-flex' }}>
              Back to Gallery
            </Link>
          </div>
        </main>
      </PageTransition>
    )
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return null
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    } catch { return dateStr }
  }

  return (
    <PageTransition>
      <Helmet>
        <title>{image.title} — {siteTitle}</title>
        {image.description && <meta name="description" content={image.description} />}
        {image.src && <meta property="og:image" content={image.src} />}
      </Helmet>

      <main className={`page ${styles.main}`}>
        <div className={styles.layout}>
          {/* ── Full image panel ── */}
          <motion.div
            className={styles.imagePanel}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={image.src}
              alt={image.title}
              className={styles.image}
              loading="eager"
            />
          </motion.div>

          {/* ── Info panel ── */}
          <motion.aside
            className={styles.infoPanel}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Image details"
          >
            {/* Back */}
            <Link to="/gallery" className={styles.back}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Gallery
            </Link>

            <div className={styles.infoContent}>
              {/* Category */}
              {image.category && (
                <span className="section-label">{image.category}</span>
              )}

              {/* Title */}
              <h1 className={styles.title}>{image.title}</h1>

              {/* Author + Date */}
              <div className={styles.meta}>
                {image.author && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Photographer</span>
                    <span className={styles.metaValue}>{image.author}</span>
                  </div>
                )}
                {image.date && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Captured</span>
                    <span className={styles.metaValue}>{formatDate(image.date)}</span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="divider" />

              {/* Description */}
              {image.description && (
                <p className={styles.description}>{image.description}</p>
              )}

              {/* Tags */}
              {image.tags && image.tags.length > 0 && (
                <div className={styles.tags}>
                  {image.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* ── Prev / Next navigation ── */}
            <nav className={styles.nav} aria-label="Image navigation">
              {prev ? (
                <Link to={`/gallery/${prev.id}`} className={styles.navBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  <div>
                    <span className={styles.navHint}>Previous</span>
                    <span className={styles.navTitle}>{prev.title}</span>
                  </div>
                </Link>
              ) : <div />}

              {next ? (
                <Link to={`/gallery/${next.id}`} className={`${styles.navBtn} ${styles.navBtnRight}`}>
                  <div style={{ textAlign: 'right' }}>
                    <span className={styles.navHint}>Next</span>
                    <span className={styles.navTitle}>{next.title}</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              ) : <div />}
            </nav>
          </motion.aside>
        </div>
      </main>
    </PageTransition>
  )
}
