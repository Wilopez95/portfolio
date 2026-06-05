# Wilson López — Personal Portfolio

Personal portfolio and professional website built with Next.js 16, React 19, and TypeScript. Features bilingual support (EN/ES), dark/light mode, contact form, blog, certifications, and projects showcase.

**LinkedIn:** [wilopez95](https://linkedin.com/in/wilopez95) &nbsp;·&nbsp; **GitHub:** [Wilopez95](https://github.com/Wilopez95)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI | React 19 |
| Email | Resend |
| Particles | @tsparticles/react |
| Package Manager | pnpm |
| Deployment | Vercel |

---

## Features

- **Bilingual (EN / ES)** — auto-detects browser language, persists preference in localStorage
- **Dark / Light mode** — system-aware with manual toggle
- **Contact form** — powered by Resend API with HTML email formatting
- **Projects showcase** — filterable grid with status badges
- **Blog** — share articles from Medium and LinkedIn
- **Certifications** — grouped by category with credential links
- **CV download** — direct PDF link opens in new tab
- **Responsive** — mobile-first layout
- **Particle background** — interactive canvas animation

---

## Project Structure

```
src/
├── app/
│   ├── _components/        # Hero (homepage)
│   ├── about/              # About page — bio, experience, tech stack
│   ├── blog/               # Blog page — Medium & LinkedIn posts
│   ├── certifications/     # Certifications grouped by category
│   ├── contact/            # Contact page + form
│   ├── projects/           # Projects grid with filters
│   ├── brand/              # Brand assets preview page
│   └── api/contact/        # POST /api/contact — sends email via Resend
├── components/shared/      # Navbar, ThemeToggle, LangToggle, Logo, Particles
└── lib/
    ├── data.ts             # Data access (reads /data/*.json)
    ├── translations.ts     # EN/ES string translations
    └── LanguageContext.tsx # Language context + browser auto-detection

data/                       # Static JSON — edit to update content
├── projects.json
├── experience.json
├── skills.json
├── certifications.json
├── posts.json
└── profile.json

public/
├── cv.pdf                  # Downloadable CV
└── brand/                  # Logo SVGs + LinkedIn banner (1584x396)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
git clone https://github.com/Wilopez95/portfolio.git
cd portfolio
pnpm install
```

### Environment Variables

Create `.env.local` at the root:

```env
# Contact form — get your key at resend.com/api-keys
RESEND_API_KEY=re_your_key_here

# Email where contact messages are received
CONTACT_EMAIL=your@email.com
```

### Development

```bash
pnpm dev
# Open http://localhost:3000
```

### Build

```bash
pnpm build
pnpm start
```

---

## Content Management

All content is managed through JSON files in `/data/`. No CMS required — just edit the JSON and redeploy.

### Adding a Project

Edit `data/projects.json`:

```json
{
  "id": "unique-id",
  "title": "Project Name",
  "slug": "project-slug",
  "company": "Company Name",
  "role": "Your Role",
  "period": { "start": "2024-01", "end": null },
  "status": "active",
  "description": "Short description.",
  "highlights": ["Achievement 1", "Achievement 2"],
  "stack": ["Next.js", "TypeScript"],
  "categories": ["fullstack", "ai"],
  "links": { "github": null, "demo": null, "caseStudy": null },
  "featured": true,
  "public": true,
  "image": null
}
```

### Adding a Blog Post

Edit `data/posts.json`:

```json
{
  "id": "post-slug",
  "title": "Post Title",
  "url": "https://medium.com/...",
  "platform": "medium",
  "excerpt": "Short description of the article.",
  "date": "2024-06-01",
  "tags": ["React", "TypeScript"]
}
```

---

## Internationalization

Lightweight custom i18n — no external library.

- **Auto-detection:** reads `navigator.language` on first visit
- **Persistence:** stores preference in `localStorage` key `wl-lang`
- **Toggle:** EN / ES button in the navbar

All strings live in `src/lib/translations.ts`. To change the default language:

```ts
// src/lib/LanguageContext.tsx
export const DEFAULT_LANG: Lang = "en"; // change to "es" for Spanish
```

---

## Contact Form

Uses [Resend](https://resend.com) to deliver emails.

- **Free tier:** sender must be `onboarding@resend.dev`, receiver must match your Resend account email
- **With verified domain:** use `contact@yourdomain.com` as sender

Without `RESEND_API_KEY`, submissions are only logged to console (useful for local dev).

---

## Brand Assets

All brand files are in `public/brand/`:

| File | Usage |
|------|-------|
| `icon-dark-bg.svg` | App icon on dark surfaces |
| `icon-light-bg.svg` | App icon on light surfaces |
| `mark-dark.svg` / `mark-light.svg` | Logo mark |
| `wordmark-dark.svg` | Full wordmark |
| `linkedin-banner.svg` | LinkedIn banner (1584×396) |

Preview at `/brand`.

---

*Built with Next.js · Wilson López Rubi © 2025*
