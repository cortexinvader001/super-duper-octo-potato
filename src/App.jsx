/**
 * App.jsx — Root component
 * Sets up: data provider, smooth scroll, custom cursor, routes
 */

import React, { useEffect, useRef, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { SiteDataProvider } from './context/SiteDataContext'
import { useSmoothScroll } from './hooks/useSmoothScroll'

import Navbar     from './components/common/Navbar'
import Footer     from './components/common/Footer'
import Cursor     from './components/common/Cursor'
import LoadingScreen from './components/common/LoadingScreen'

import HomePage       from './pages/HomePage'
import GalleryPage    from './pages/GalleryPage'
import ImageDetailPage from './pages/ImageDetailPage'
import AboutPage      from './pages/AboutPage'
import FAQPage        from './pages/FAQPage'
import ContactPage    from './pages/ContactPage'
import NotFoundPage   from './pages/NotFoundPage'

function AppInner() {
  useSmoothScroll()
  const location = useLocation()

  return (
    <>
      <Cursor />
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/"        element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/gallery/:id" element={<ImageDetailPage />} />
          <Route path="/about"   element={<AboutPage />} />
          <Route path="/faq"     element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*"        element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)

  // Brief loading screen for premium feel
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1600)
    return () => clearTimeout(t)
  }, [])

  return (
    <SiteDataProvider>
      {!ready && <LoadingScreen />}
      {ready && <AppInner />}
    </SiteDataProvider>
  )
}
