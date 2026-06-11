/**
 * Footer — minimal editorial footer with JSON-driven content
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSiteData, safeGet } from '../../context/SiteDataContext'
import styles from './Footer.module.css'

// Social icon paths (inline SVG to avoid external deps)
const SocialIcons = {
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
  facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  twitter: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  youtube: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
  ),
}

const NAV_LINKS = [
  { to: '/',        label: 'Home'    },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about',   label: 'About'   },
  { to: '/faq',     label: 'FAQ'     },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  const { data } = useSiteData()
  if (!data) return null

  const footer   = safeGet(data, 'footer',  {})
  const social   = safeGet(data, 'contact.social', {})
  const siteTitle = safeGet(data, 'site.title', 'LUMINA')
  const tagline  = safeGet(footer, 'tagline')
  const copyright = safeGet(footer, 'copyright', `© ${new Date().getFullYear()} ${siteTitle}`)

  // Only show social icons with valid URLs
  const activeSocials = Object.entries(SocialIcons).filter(
    ([key]) => safeGet(social, key)
  )

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        {/* Top row */}
        <div className={styles.top}>
          <div className={styles.brand}>
            <span className={styles.logo}>{siteTitle}</span>
            {tagline && (
              <p className={styles.tagline}>{tagline}</p>
            )}
          </div>

          <nav className={styles.navGroup} aria-label="Footer navigation">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className={styles.link}>
                {label}
              </Link>
            ))}
          </nav>

          {activeSocials.length > 0 && (
            <div className={styles.social}>
              <p className="section-label" style={{ marginBottom: 16 }}>Follow</p>
              <div className={styles.socialIcons}>
                {activeSocials.map(([key, icon]) => (
                  <a
                    key={key}
                    href={social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className={styles.socialIcon}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Bottom row */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>{copyright}</p>
        </div>
      </div>
    </footer>
  )
}
