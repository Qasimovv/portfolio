# Elnur — Portfolio

kamranbekirov.com dizaynı əsasında qurulmuş Flutter developer portfolio saytı
(eyni layout/davranış, öz kod + öz məzmun).
**Next.js 15 (App Router) + Tailwind CSS v4 + TypeScript + Motion + Lenis.**

## İşə salmaq

```bash
cd portfolio
npm install
npm run dev      # http://localhost:3000
```

Prod build: `npm run build && npm run start`.

## Sən nəyi redaktə edirsən

Bütün məzmun **bir faylda**: [`data/site.ts`](data/site.ts)

- **profile** — ad, rol, tagline, email, avatar, CV linki, "Available for work"
- **socials** — Instagram / X / LinkedIn / YouTube / GitHub (boş = ikon gizlənir)
- **apps** — Apps tabı: hər app üçün `poster`, `appStoreUrl`, `playStoreUrl`
  (link boşdursa badge boz "not available" görünür)
- **packages / other** — masonry kartlar: ad, təsvir, link
- **contact** — "let’s work together" kartındakı mətn (bold hissələri ilə)
- **gallery** — sürüşən foto lenti (location + subtitle etiketləri)

## Şəkillər (`public/`)

| Nə | Hara | Sonra |
|---|---|---|
| Profil şəkli | `public/avatar.jpg` | `profile.avatar = "/avatar.jpg"` |
| CV | `public/resume.pdf` | `profile.resumeUrl = "/resume.pdf"` |
| App posterləri (1:2, məs. 400×800) | `public/project/poster/<id>.png` | `apps[].poster = "/project/poster/<id>.png"` |
| Gallery fotoları | `public/gallery/*.jpg` | `gallery[].src` dəyiş |

Şəkil yoxdursa hər yerdə **avtomatik gradient placeholder** göstərilir — sayt yenə tam görünür.

## Dizayn detalları

- Açıq/tünd rejim sistemin `prefers-color-scheme`-inə bağlıdır (toggle yoxdur)
- Fontlar: **Inter Tight** (əsas) + **Kalam** (mavi əlyazma vurğular, `#04AAFB`)
- Foto lenti: sonsuz, avto-sürüşən, drag + momentum, hover-də düzəlib böyüyür
- Apps grid: 2/3/5/8 sütun, aşağıya doğru fona ərimə (fade) effekti
- "Work With Me" və "Available for work" → səhifənin sonuna smooth scroll

## Deploy (Vercel — pulsuz)

1. Bu qovluğu öz GitHub repo-suna push et
2. [vercel.com](https://vercel.com) → Import → repo seç → Deploy
3. Öz domenini Vercel-də bağla

## Struktur

```
app/               layout, page, globals.css, icon.svg
components/        Header, Gallery, ProjectTabs, AppsGrid, MasonryGrid,
                   Contact, AvailabilityPill, SmoothScroll
data/site.ts       ← BÜTÜN MƏZMUN burada
lib/               gradient.ts, motion.ts, scroll.ts
public/            logo/ (store badges), gallery/, project/poster/
```
