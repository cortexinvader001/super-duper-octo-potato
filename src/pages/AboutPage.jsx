/**
 * AboutPage — story, mission, stats, team members
 */

import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useSiteData, safeGet } from '../context/SiteDataContext'
import PageTransition from '../components/common/PageTransition'
import ScrollReveal, { StaggerReveal } from '../components/common/ScrollReveal'
import styles from './AboutPage.module.css'

function TeamCard({ member }) {
  const instagram = safeGet(member, 'social.instagram')
  const linkedin  = safeGet(member, 'social.linkedin')

  return (
    <div className={styles.teamCard}>
      {member.image && (
        <div className={styles.teamImageWrap}>
          <img
            src={member.image}
            alt={member.name}
            className={styles.teamImage}
            loading="lazy"
          />
        </div>
      )}
      <div className={styles.teamInfo}>
        <h3 className={styles.teamName}>{member.name}</h3>
        {member.role && <p className={styles.teamRole}>{member.role}</p>}
        {member.bio  && <p className={styles.teamBio}>{member.bio}</p>}
        {(instagram || linkedin) && (
          <div className={styles.teamSocial}>
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AboutPage() {
  const { data } = useSiteData()
  const about = safeGet(data, 'about', {}) || {}
  const siteTitle = safeGet(data, 'site.title', 'Gallery')

  const headline  = safeGet(about, 'headline')
  const sub       = safeGet(about, 'subheadline')
  const story     = safeGet(about, 'story')
  const mission   = safeGet(about, 'mission')
  const vision    = safeGet(about, 'vision')
  const stats     = (about.stats  || []).filter(s => s.value && s.label)
  const team      = (about.team   || []).filter(m => m.name)

  return (
    <PageTransition>
      <Helmet>
        <title>About — {siteTitle}</title>
      </Helmet>

      <main className="page">
        <div className="container">
          {/* Header */}
          <header className={styles.header}>
            <ScrollReveal>
              <span className="section-label">Our Story</span>
              {headline && <h1 className={styles.headline}>{headline}</h1>}
              {sub      && <p  className={styles.sub}>{sub}</p>}
            </ScrollReveal>
          </header>

          {/* Stats row */}
          {stats.length > 0 && (
            <section aria-label="Statistics">
              <StaggerReveal stagger={0.1}>
                {stats.map((stat) => (
                  <div key={stat.label} className={styles.statItem}>
                    <span className={styles.statValue}>{stat.value}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                ))}
              </StaggerReveal>
              {/* Wrapping the stagger items in a flex row */}
            </section>
          )}

          {/* Story / Mission / Vision */}
          <div className={styles.textGrid}>
            {story && (
              <ScrollReveal className={styles.textBlock}>
                <h2 className={styles.textHeading}>The Story</h2>
                <p className={styles.bodyText}>{story}</p>
              </ScrollReveal>
            )}
            {mission && (
              <ScrollReveal delay={0.1} className={styles.textBlock}>
                <h2 className={styles.textHeading}>Our Mission</h2>
                <p className={styles.bodyText}>{mission}</p>
              </ScrollReveal>
            )}
            {vision && (
              <ScrollReveal delay={0.15} className={styles.textBlock}>
                <h2 className={styles.textHeading}>Our Vision</h2>
                <p className={styles.bodyText}>{vision}</p>
              </ScrollReveal>
            )}
          </div>

          {/* Team */}
          {team.length > 0 && (
            <section className={styles.teamSection} aria-labelledby="team-heading">
              <ScrollReveal>
                <span className="section-label">The People</span>
                <h2 id="team-heading" className={styles.teamTitle}>Meet the Team</h2>
              </ScrollReveal>
              <div className={styles.teamGrid}>
                {team.map((member) => (
                  <ScrollReveal key={member.name}>
                    <TeamCard member={member} />
                  </ScrollReveal>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </PageTransition>
  )
}
