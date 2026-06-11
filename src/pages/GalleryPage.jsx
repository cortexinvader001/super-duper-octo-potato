/**
 * GalleryPage — full collection with filters, search, masonry/grid layouts
 */

import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useSiteData, safeGet } from '../context/SiteDataContext'
import PageTransition from '../components/common/PageTransition'
import GalleryGrid from '../components/gallery/GalleryGrid'
import ScrollReveal from '../components/common/ScrollReveal'
import styles from './GalleryPage.module.css'

export default function GalleryPage() {
  const { data, loading } = useSiteData()

  const images     = safeGet(data, 'gallery.images',     []) || []
  const categories = safeGet(data, 'gallery.categories', []) || []
  const title      = safeGet(data, 'gallery.title',      'The Collection')
  const subtitle   = safeGet(data, 'gallery.subtitle')
  const metaTitle  = safeGet(data, 'site.seo.metaTitle', 'Gallery')

  return (
    <PageTransition>
      <Helmet>
        <title>Gallery — {metaTitle}</title>
      </Helmet>

      <main className="page">
        <div className="container">
          {/* Page header */}
          <header className={styles.header}>
            <ScrollReveal>
              <span className="section-label">Collection</span>
              <h1 className={styles.title}>{title}</h1>
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </ScrollReveal>
          </header>

          {/* Gallery */}
          {loading ? (
            <div className={styles.loading}>
              <div className="loading-bar" />
            </div>
          ) : (
            <GalleryGrid images={images} categories={categories} />
          )}
        </div>
      </main>
    </PageTransition>
  )
}
