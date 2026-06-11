/**
 * ContactPage — renders all contact methods from info.json dynamically.
 * Empty/null fields are hidden automatically.
 */

import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useSiteData, safeGet } from '../context/SiteDataContext'
import PageTransition from '../components/common/PageTransition'
import ScrollReveal from '../components/common/ScrollReveal'
import styles from './ContactPage.module.css'

/* ── Icon helpers ─────────────────────────────────────────────────── */
const Icons = {
  phone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
    </svg>
  ),
  email: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  location: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  whatsapp: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  ),
  telegram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
}

function ContactRow({ icon, label, children }) {
  return (
    <div className={styles.contactRow}>
      <div className={styles.contactIcon}>{icon}</div>
      <div>
        <p className={styles.contactLabel}>{label}</p>
        {children}
      </div>
    </div>
  )
}

/* ── Simple contact form ──────────────────────────────────────────── */
function ContactForm() {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]     = useState('')

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.')
      return
    }
    setError('')
    // In a real deployment, wire this to your preferred form backend
    // (Formspree, Netlify Forms, etc.) — for now, simulate success:
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.div
        className={styles.successMsg}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="section-label" style={{ display: 'block', marginBottom: 16 }}>Sent</span>
        <h3 className={styles.successTitle}>Thank you for reaching out.</h3>
        <p className={styles.successText}>
          We've received your message and will be in touch shortly.
        </p>
      </motion.div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="name">Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className={styles.input}
            placeholder="Your full name"
            autoComplete="name"
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={styles.input}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="subject">Subject</label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={form.subject}
          onChange={handleChange}
          className={styles.input}
          placeholder="What is this regarding?"
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="message">Message *</label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          className={`${styles.input} ${styles.textarea}`}
          placeholder="Tell us about your project, inquiry, or question…"
          rows={6}
        />
      </div>

      {error && <p className={styles.errorMsg} role="alert">{error}</p>}

      <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
        Send Message
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </form>
  )
}

/* ── Main page ────────────────────────────────────────────────────── */
export default function ContactPage() {
  const { data } = useSiteData()

  const contact  = safeGet(data, 'contact',  {}) || {}
  const siteTitle = safeGet(data, 'site.title', 'Gallery')

  const headline = safeGet(contact, 'headline',    'Get in Touch')
  const sub      = safeGet(contact, 'subheadline')
  const phones   = (contact.phones   || []).filter(Boolean)
  const emails   = (contact.emails   || []).filter(Boolean)
  const addresses= (contact.addresses|| []).filter(a => a && (a.line1 || a.city))
  const whatsapp = safeGet(contact, 'whatsapp')
  const telegram = safeGet(contact, 'telegram')

  return (
    <PageTransition>
      <Helmet>
        <title>Contact — {siteTitle}</title>
      </Helmet>

      <main className="page">
        <div className="container">
          <header className={styles.header}>
            <ScrollReveal>
              <span className="section-label">Contact</span>
              <h1 className={styles.title}>{headline}</h1>
              {sub && <p className={styles.subtitle}>{sub}</p>}
            </ScrollReveal>
          </header>

          <div className={styles.layout}>
            {/* ── Left: contact info ── */}
            <ScrollReveal className={styles.infoCol}>
              <div className={styles.contactInfo}>

                {/* Phones */}
                {phones.length > 0 && (
                  <ContactRow icon={Icons.phone} label="Phone">
                    {phones.map((p) => (
                      <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className={styles.contactValue}>
                        {p}
                      </a>
                    ))}
                  </ContactRow>
                )}

                {/* Emails */}
                {emails.length > 0 && (
                  <ContactRow icon={Icons.email} label="Email">
                    {emails.map((e) => (
                      <a key={e} href={`mailto:${e}`} className={styles.contactValue}>
                        {e}
                      </a>
                    ))}
                  </ContactRow>
                )}

                {/* Addresses */}
                {addresses.map((addr) => (
                  <ContactRow key={addr.label || addr.line1} icon={Icons.location} label={addr.label || 'Location'}>
                    <p className={styles.contactValue}>{addr.line1}</p>
                    {addr.line2   && <p className={styles.contactValue}>{addr.line2}</p>}
                    {addr.country && <p className={styles.contactValue}>{addr.country}</p>}
                  </ContactRow>
                ))}

                {/* WhatsApp */}
                {whatsapp && (
                  <ContactRow icon={Icons.whatsapp} label="WhatsApp">
                    <a
                      href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactValue}
                    >
                      {whatsapp}
                    </a>
                  </ContactRow>
                )}

                {/* Telegram */}
                {telegram && (
                  <ContactRow icon={Icons.telegram} label="Telegram">
                    <a
                      href={`https://t.me/${telegram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactValue}
                    >
                      {telegram}
                    </a>
                  </ContactRow>
                )}
              </div>
            </ScrollReveal>

            {/* ── Right: contact form ── */}
            <ScrollReveal delay={0.15} className={styles.formCol}>
              <h2 className={styles.formTitle}>Send a Message</h2>
              <ContactForm />
            </ScrollReveal>
          </div>
        </div>
      </main>
    </PageTransition>
  )
}
