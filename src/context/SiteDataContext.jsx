/**
 * SiteDataContext
 * ---------------
 * Loads info.json once and provides all site content globally.
 * Any component can call useSiteData() to access content.
 */

import React, { createContext, useContext, useState, useEffect } from 'react'

const SiteDataContext = createContext(null)

export function SiteDataProvider({ children }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/info.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load site data')
        return res.json()
      })
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        console.error('SiteData load error:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <SiteDataContext.Provider value={{ data, loading, error }}>
      {children}
    </SiteDataContext.Provider>
  )
}

/**
 * useSiteData — hook to consume site content
 * Returns: { data, loading, error }
 */
export function useSiteData() {
  const ctx = useContext(SiteDataContext)
  if (!ctx) throw new Error('useSiteData must be used inside SiteDataProvider')
  return ctx
}

/**
 * Safely resolves a nested field; returns fallback if null/"" 
 */
export function safeGet(obj, path, fallback = null) {
  const result = path.split('.').reduce((acc, key) => acc?.[key], obj)
  if (result === null || result === undefined || result === '') return fallback
  return result
}
