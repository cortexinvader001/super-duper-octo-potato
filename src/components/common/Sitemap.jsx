import { useEffect, useState } from 'react'
import { useSiteData, safeGet } from '../context/SiteDataContext'

/**
 * Sitemap — Dynamically generates XML sitemap from info.json
 * Accessed at /sitemap.xml
 */
export default function Sitemap() {
  const { data } = useSiteData()
  const [sitemapXml, setSitemapXml] = useState('')

  useEffect(() => {
    if (!data) return

    const baseUrl = window.location.origin
    const siteTitle = safeGet(data, 'site.title', 'LUMINA')
    const gallery = safeGet(data, 'gallery.images', []) || []

    // Generate sitemap XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`

    // Static pages
    const staticPages = [
      { path: '/', changefreq: 'weekly', priority: '1.0' },
      { path: '/gallery', changefreq: 'daily', priority: '0.9' },
      { path: '/about', changefreq: 'monthly', priority: '0.7' },
      { path: '/faq', changefreq: 'monthly', priority: '0.7' },
      { path: '/contact', changefreq: 'monthly', priority: '0.7' },
    ]

    staticPages.forEach((page) => {
      xml += `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
    })

    // Dynamic image pages from gallery
    gallery.forEach((image) => {
      const imageUrl = `${baseUrl}/gallery/${image.id}`
      const lastmod = image.date || new Date().toISOString().split('T')[0]
      
      xml += `  <url>
    <loc>${imageUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
`

      // Add image metadata for Google Images
      if (image.src) {
        xml += `    <image:image>
      <image:loc>${image.src}</image:loc>
      <image:title>${image.title || ''}</image:title>
      <image:caption>${image.description || ''}</image:caption>
    </image:image>
`
      }

      xml += `  </url>
`
    })

    xml += `</urlset>`

    setSitemapXml(xml)
  }, [data])

  // Serve as XML
  useEffect(() => {
    if (sitemapXml) {
      const blob = new Blob([sitemapXml], { type: 'application/xml' })
      const url = URL.createObjectURL(blob)
      // Note: In production, configure your server to serve this as XML
      console.log('Sitemap generated:', sitemapXml)
    }
  }, [sitemapXml])

  // This component doesn't render in the UI
  return null
}
