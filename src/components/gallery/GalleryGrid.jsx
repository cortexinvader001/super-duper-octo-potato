/**
 * GalleryGrid — masonry layout with category filtering and text search
 */

import React, { useState, useMemo, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GalleryCard from './GalleryCard'
import styles from './GalleryGrid.module.css'

export default function GalleryGrid({ images = [], categories = [] }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery,    setSearchQuery]    = useState('')
  const [layout,         setLayout]         = useState('masonry') // 'masonry' | 'grid'
  const [sortBy,         setSortBy]         = useState('default') // 'default' | 'date' | 'title'

  // ── Filter + search + sort ───────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = images

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter((img) => img.category === activeCategory)
    }

    // Text search (title, description, tags, author)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((img) =>
        [img.title, img.description, img.author, ...(img.tags || [])]
          .filter(Boolean)
          .some((s) => s.toLowerCase().includes(q))
      )
    }

    // Sort
    if (sortBy === 'date') {
      result = [...result].sort(
        (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
      )
    } else if (sortBy === 'title') {
      result = [...result].sort((a, b) =>
        (a.title || '').localeCompare(b.title || '')
      )
    }

    return result
  }, [images, activeCategory, searchQuery, sortBy])

  const handleSearch = useCallback((e) => setSearchQuery(e.target.value), [])

  // Masonry column count based on viewport (CSS handles this, but we pass count)
  const colBreakpoints = { default: 3, 1100: 3, 700: 2, 480: 1 }

  return (
    <div className={styles.container}>
      {/* Controls bar */}
      <div className={styles.controls}>
        {/* Category filters */}
        <div className={styles.filters} role="tablist" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.active : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className={styles.rightControls}>
          {/* Search */}
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="search"
              placeholder="Search collection…"
              value={searchQuery}
              onChange={handleSearch}
              className={styles.search}
              aria-label="Search images"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sort}
            aria-label="Sort by"
          >
            <option value="default">Default Order</option>
            <option value="date">Latest First</option>
            <option value="title">A – Z</option>
          </select>

          {/* Layout toggle */}
          <div className={styles.layoutToggle} aria-label="Layout toggle">
            <button
              onClick={() => setLayout('masonry')}
              className={layout === 'masonry' ? styles.toggleActive : ''}
              aria-label="Masonry layout"
              title="Masonry"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3"  y="3"  width="7" height="9" rx="1"/>
                <rect x="14" y="3"  width="7" height="6" rx="1"/>
                <rect x="3"  y="15" width="7" height="6" rx="1"/>
                <rect x="14" y="12" width="7" height="9" rx="1"/>
              </svg>
            </button>
            <button
              onClick={() => setLayout('grid')}
              className={layout === 'grid' ? styles.toggleActive : ''}
              aria-label="Grid layout"
              title="Grid"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3"  y="3"  width="7" height="7" rx="1"/>
                <rect x="14" y="3"  width="7" height="7" rx="1"/>
                <rect x="3"  y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className={styles.count}>
        <span className="font-mono" style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}>
          {filtered.length}
        </span>{' '}
        <span style={{ color: 'var(--color-text-3)', fontSize: 'var(--fs-sm)' }}>
          {filtered.length === 1 ? 'work' : 'works'}
        </span>
      </p>

      {/* Gallery */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            className={styles.empty}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p>No images match your search.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all') }}
              className="btn btn-outline"
              style={{ marginTop: 16 }}
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={`${layout}-${activeCategory}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className={layout === 'masonry' ? styles.masonry : styles.grid}
          >
            {filtered.map((image, index) => (
              <GalleryCard key={image.id} image={image} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
