/**
 * FAQPage — animated accordion FAQ from JSON data
 * Skips items with null/empty answers gracefully.
 */

import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { useSiteData, safeGet } from '../context/SiteDataContext'
import PageTransition from '../components/common/PageTransition'
import ScrollReveal from '../components/common/ScrollReveal'
import styles from './FAQPage.module.css'

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
      <button
        className={styles.question}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        id={`faq-question-${item.id}`}
      >
        <span>{item.question}</span>
        <motion.span
          className={styles.icon}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${item.id}`}
            role="region"
            aria-labelledby={`faq-question-${item.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p className={styles.answer}>{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQPage() {
  const { data }   = useSiteData()
  const [openId, setOpenId] = useState(null)

  const siteTitle = safeGet(data, 'site.title', 'Gallery')

  // Filter out items with null/empty answers
  const faqs = (safeGet(data, 'faq', []) || []).filter(
    (item) => item.question && item.answer
  )

  const toggle = (id) => setOpenId(openId === id ? null : id)

  return (
    <PageTransition>
      <Helmet>
        <title>FAQ — {siteTitle}</title>
      </Helmet>

      <main className="page">
        <div className="container">
          <header className={styles.header}>
            <ScrollReveal>
              <span className="section-label">Help</span>
              <h1 className={styles.title}>Frequently Asked Questions</h1>
              <p className={styles.subtitle}>
                Everything you need to know about the collection and working with us.
              </p>
            </ScrollReveal>
          </header>

          {faqs.length === 0 ? (
            <ScrollReveal>
              <p style={{ color: 'var(--color-text-2)', padding: 'var(--space-4xl) 0' }}>
                No FAQ content available yet.
              </p>
            </ScrollReveal>
          ) : (
            <div className={styles.list} role="list">
              {faqs.map((item, i) => (
                <ScrollReveal key={item.id} delay={i * 0.04} y={20}>
                  <FAQItem
                    item={item}
                    isOpen={openId === item.id}
                    onToggle={() => toggle(item.id)}
                  />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </main>
    </PageTransition>
  )
}
