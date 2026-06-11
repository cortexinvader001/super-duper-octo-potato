/**
 * HomePage — assembles Hero, Featured Gallery, Testimonials, CTA
 */

import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useSiteData, safeGet } from '../context/SiteDataContext'
import PageTransition from '../components/common/PageTransition'
import ScrollReveal, { StaggerReveal } from '../components/common/ScrollReveal'
import Hero from '../components/home/Hero'
import FeaturedGallery from '../components/home/FeaturedGallery'
import Testimonials from '../components/home/Testimonials'
import styles from './HomePage.module.css'

export default function HomePage() {
  const { data } = useSiteData()

  const metaTitle = safeGet(data, 'site.seo.metaTitle', 'Gallery')
  const metaDesc  = safeGet(data, 'site.seo.metaDescription', '')
  const categories = safeGet(data, 'gallery.categories', []) || []

  return (
    <PageTransition>
      <Helmet>
        <title>{metaTitle}</title>
        {metaDesc && <meta name="description" content={metaDesc} />}
      </Helmet>

      <main>
        {/* ── Hero ── */}
        <Hero />

        {/* ── Categories strip ── */}
        {categories.filter(c => c.id !== 'all').length > 0 && (
          <section className={styles.categoriesSection} aria-label="Browse by category">
            <div className="container">
              <ScrollReveal>
                <span className="section-label">Browse</span>
                <h2 className={styles.categoriesTitle}>Collections</h2>
              </ScrollReveal>
              <StaggerReveal stagger={0.07}>
                {categories.filter(c => c.id !== 'all').map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/gallery`}
                    className={styles.categoryCard}
                  >
                    <span className={styles.categoryName}>{cat.label}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                ))}
              </StaggerReveal>
            </div>
          </section>
        )}

        {/* ── Featured Gallery ── */}
        <FeaturedGallery />

        {/* ── Testimonials ── */}
        <Testimonials />

        {/* ── Call to Action ── */}
        <section className={styles.cta} aria-label="Call to action">
          <div className="container">
            <ScrollReveal threshold={0.3}>
              <div className={styles.ctaInner}>
                <span className="section-label">Commission</span>
                <h2 className={styles.ctaTitle}>
                  Have a vision?<br />Let's make it real.
                </h2>
                <p className={styles.ctaText}>
                  Whether you're seeking a bespoke print, licensing an image, or
                  commissioning original work — we'd love to hear from you.
                </p>
                <Link to="/contact" className="btn btn-primary">
                  Start a Conversation
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}
