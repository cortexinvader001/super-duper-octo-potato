# LUMINA — Cinematic Gallery Website

A premium, production-ready multi-page gallery website with cinematic 3D experiences, scroll animations, and a fully JSON-driven content system.

---

## Features

- **Cinematic 3D effects** — cursor-reactive image tilt, parallax depth, perspective transforms
- **JSON-driven content** — every visible word, image, and piece of metadata is loaded from `info.json`
- **Graceful null handling** — missing fields hide their sections automatically; no broken layouts
- **Multi-page** — Home, Gallery, Image Detail, About, FAQ, Contact, 404
- **Masonry & Grid gallery** — category filtering, text search, sorting, layout toggle
- **Smooth scrolling** — Lenis integration for buttery 60fps scroll
- **Page transitions** — AnimatePresence-powered cinematic enter/exit
- **Custom cursor** — ambient dot + lagging ring with hover expansion
- **Scroll animations** — ScrollReveal, StaggerReveal, parallax on hero
- **Fully responsive** — desktop, tablet, mobile
- **SEO-ready** — react-helmet-async per-page meta tags
- **Accessible** — keyboard navigation, ARIA labels, focus-visible styles, reduced-motion support

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# 1. Navigate into the project
cd gallery-site

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

### Build for Production

```bash
npm run build
# Output goes to ./dist/
```

### Preview Production Build

```bash
npm run preview
```

---

## Project Structure

```
gallery-site/
├── public/
│   └── info.json              ← ALL site content lives here
├── src/
│   ├── main.jsx               ← Entry point
│   ├── App.jsx                ← Root: routing, providers, loading screen
│   ├── context/
│   │   └── SiteDataContext.jsx ← Global JSON data provider
│   ├── hooks/
│   │   ├── useSmoothScroll.js  ← Lenis smooth scroll
│   │   └── useCursor.js        ← Mouse tracking & 3D tilt
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx      ← Sticky/glass nav
│   │   │   ├── Footer.jsx      ← JSON-driven footer
│   │   │   ├── Cursor.jsx      ← Custom cursor
│   │   │   ├── LoadingScreen.jsx
│   │   │   ├── PageTransition.jsx
│   │   │   └── ScrollReveal.jsx ← Scroll animation wrappers
│   │   ├── gallery/
│   │   │   ├── GalleryCard.jsx ← Card with 3D tilt & parallax
│   │   │   └── GalleryGrid.jsx ← Masonry/grid with filters
│   │   └── home/
│   │       ├── Hero.jsx        ← Parallax hero
│   │       ├── FeaturedGallery.jsx
│   │       └── Testimonials.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── GalleryPage.jsx
│   │   ├── ImageDetailPage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── FAQPage.jsx
│   │   ├── ContactPage.jsx
│   │   └── NotFoundPage.jsx
│   └── styles/
│       └── global.css          ← Design tokens, reset, utilities
└── vite.config.js
```

---

## Content Editing Guide (for non-developers)

**Everything you see on the website is controlled by one file:**

```
public/info.json
```

Open it in any text editor (Notepad, TextEdit, VS Code). Here's what each section controls:

### Site Identity (`site`)

```json
"site": {
  "title": "YOUR SITE NAME",
  "tagline": "Your tagline",
  "description": "Meta description for SEO",
  "logo": {
    "text": "LOGO TEXT",     ← Displayed if no image URL
    "image": ""              ← URL to logo image (leave "" for text logo)
  }
}
```

### Hero Section (`hero`)

```json
"hero": {
  "headline": "Your Big\nHeadline",     ← Use \n for line breaks
  "subheadline": "Supporting text here",
  "ctaText": "Button Label",
  "ctaLink": "/gallery",
  "featuredImage": "https://your-image-url.com/photo.jpg"
}
```

### Gallery Images (`gallery.images`)

Each image in the gallery array:

```json
{
  "id": "unique-id",          ← Must be unique (used in URLs)
  "title": "Image Title",
  "description": "Caption",
  "category": "landscape",    ← Must match a category id below
  "tags": ["tag1", "tag2"],
  "src": "https://full-size-image-url",
  "thumbnail": "https://smaller-image-url",
  "author": "Photographer Name",
  "date": "2024-03-15",
  "featured": true            ← Shows in homepage featured strip
}
```

### Gallery Categories (`gallery.categories`)

```json
"categories": [
  { "id": "all", "label": "All Works" },
  { "id": "landscape", "label": "Landscape" },
  { "id": "portrait", "label": "Portrait" }
]
```

The `id` value must match the `category` field in your images.

### FAQ Items (`faq`)

```json
{
  "id": "f1",
  "question": "Your question here?",
  "answer": "Your answer here."
}
```

Set `"answer": null` to hide that FAQ item entirely.

### Contact Information (`contact`)

Supports multiple phones, emails, and addresses:

```json
"phones": ["+1 555 000 0000", "+44 20 0000 0000"],
"emails": ["hello@example.com", "sales@example.com"],
"addresses": [
  {
    "label": "Headquarters",
    "line1": "123 Main Street",
    "line2": "Suite 100",
    "country": "United States"
  }
]
```

Leave any field as `""` or `null` to hide it. Arrays can be empty `[]`.

### Testimonials (`testimonials`)

```json
{
  "id": "t1",
  "quote": "This is what they said.",
  "author": "Person Name",
  "role": "Their Title, Company",
  "image": "https://photo-url"
}
```

### Social Links (`contact.social`)

```json
"social": {
  "instagram": "https://instagram.com/yourhandle",
  "facebook": "",       ← Empty = hidden
  "twitter": "https://x.com/yourhandle",
  "linkedin": "",
  "youtube": ""
}
```

---

## Null / Empty Field Handling

The following values all result in the field/section being hidden:
- `""` (empty string)
- `null`
- `[]` (empty array)
- Missing key entirely

No broken layouts or empty boxes will appear.

---

## Deployment

### Netlify (recommended)

1. Push your project to GitHub
2. Connect the repo to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy

### Vercel

```bash
npm install -g vercel
vercel
```

### Static Host (any)

Upload the contents of the `dist/` folder after running `npm run build`.

### Environment Notes

- No server required — fully static
- No database — content comes from `info.json`
- No API keys needed for core functionality

---

## Customization

### Changing Colors

Edit the CSS variables in `src/styles/global.css`:

```css
:root {
  --color-bg:     #080808;   /* Main background */
  --color-accent: #c9a96e;   /* Gold accent */
  --color-text:   #f0ece4;   /* Primary text */
}
```

### Changing Fonts

The site uses Google Fonts. To change:

1. Update the `<link>` in `index.html`
2. Update font variables in `global.css`:
   ```css
   --font-display: 'Your Display Font', serif;
   --font-body:    'Your Body Font', sans-serif;
   ```

### Adding a New Page

1. Create `src/pages/NewPage.jsx`
2. Add the route in `src/App.jsx`:
   ```jsx
   <Route path="/new-page" element={<NewPage />} />
   ```
3. Add a link in `Navbar.jsx`'s `NAV_LINKS` array

---

## Performance Notes

- Images lazy load by default (except hero)
- Code is split by vendor chunk (React, animations, Three.js)
- Animations use `will-change: transform` and run on the GPU
- Smooth scroll uses `requestAnimationFrame` directly
- Reduced motion media query is respected globally

---

## Browser Support

- Chrome / Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari / Chrome on iOS / Android

---

## Tech Stack

| Library | Purpose |
|---|---|
| React 18 | UI framework |
| React Router 6 | Client-side routing |
| Framer Motion | Animations & transitions |
| Lenis | Smooth scroll |
| react-intersection-observer | Scroll reveal triggers |
| react-helmet-async | SEO meta tags |
| Vite | Build tool |
