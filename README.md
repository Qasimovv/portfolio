# Elnur Qasimov — Portfolio

Personal Flutter-developer portfolio. Layout and interactions inspired by
[kamranbekirov.com](https://www.kamranbekirov.com) — rebuilt from scratch with
my own code, content and assets.

**Next.js 15 (App Router) + Tailwind CSS v4 + TypeScript + Motion + Lenis.**

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build: `npm run build && npm run start`.

## Editing content

All content lives in **one file**: [`data/site.ts`](data/site.ts)

- **profile** — name, role, tagline, email, avatar, résumé link, "Available for work" flag
- **socials** — Instagram / X / LinkedIn / YouTube / GitHub (empty string = icon hidden)
- **apps** — Apps tab: `poster`, `appStoreUrl`, `playStoreUrl` per app
  (empty link = grayed-out "not available" badge). Apps render in two groups:
  solo work (default) and team/company work (`team: true`, optional `company`
  note shown under the name). Group headings live in `appSections`.
- **packages / other** — masonry cards: name, description, link
- **contact** — the "let’s work together" card copy (with bold segments)
- **gallery** — draggable photo marquee (location + subtitle labels)

## Images (`public/`)

| What | Where | Then |
|---|---|---|
| Profile photo | `public/avatar.jpg` | set `profile.avatar = "/avatar.jpg"` |
| Résumé | `public/resume.pdf` | set `profile.resumeUrl = "/resume.pdf"` |
| App posters (1:2, e.g. 400×800) | `public/project/poster/<id>.png` | set `apps[].poster = "/project/poster/<id>.png"` |
| Second poster (optional) | `public/project/poster/<id>-2.png` | set `apps[].poster2` too → card becomes double-width with two images |
| Gallery photos | `public/gallery/*.jpg` | update `gallery[].src` |

Anything missing falls back to an **auto-generated gradient placeholder** — the
site always renders complete.

## Design notes

- Light/dark follows the system `prefers-color-scheme` (no toggle)
- Fonts: **Inter Tight** (body) + **Kalam** (handwritten blue accents, `#04AAFB`)
- Photo marquee: infinite, auto-drifting, drag with momentum, straightens & scales on hover
- Apps grid: 2/3/5/8 columns, fades into the page background at the bottom
- "Work With Me" and the availability pill smooth-scroll to the contact card

## Deploy (Vercel)

1. Push this repo to GitHub
2. [vercel.com](https://vercel.com) → Import → select the repo → Deploy
3. Attach a custom domain in Project → Settings → Domains

## Structure

```
app/               layout, page, globals.css, icon.svg
components/        Header, Gallery, ProjectTabs, AppsGrid, MasonryGrid,
                   Contact, AvailabilityPill, SmoothScroll
data/site.ts       ← ALL CONTENT lives here
lib/               gradient.ts, motion.ts, scroll.ts
public/            logo/ (store badges), gallery/, project/poster/
```
