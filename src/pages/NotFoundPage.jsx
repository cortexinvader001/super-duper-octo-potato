/**
 * NotFoundPage — animated 404 with navigation back home
 */

import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/common/PageTransition'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <PageTransition>
      <Helmet>
        <title>404 — Page Not Found</title>
      </Helmet>

      <main className={`page ${styles.main}`}>
        <div className={`container ${styles.inner}`}>
          {/* Big 404 */}
          <motion.div
            className={styles.number}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
          >
            404
          </motion.div>

          <motion.div
            className={styles.content}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-label">Lost in the dark</span>
            <h1 className={styles.title}>This frame doesn't exist</h1>
            <p className={styles.sub}>
              The image you were looking for has moved, been archived,
              or never existed. Let's find you something better.
            </p>
            <div className={styles.actions}>
              <Link to="/" className="btn btn-primary">
                Return Home
              </Link>
              <Link to="/gallery" className="btn btn-outline">
                Browse Gallery
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </PageTransition>
  )
}
