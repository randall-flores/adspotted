# AdSpotted

Pinterest-style masonry feed of products/brands spotted in Instagram ads. Category filters, admin-only submission form. Owner: Randall (beginner, learning by doing; direct answers, working code over explanations, no em dashes).

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind v4
- Supabase for DB (Storage and auth come later)
- Deploy target: Vercel

## Current state (MVP built July 31, 2026)

- Supabase project "Hollow Ronin", ref `acfrkjuvtcnoybppjumd`, region us-east-1, ACTIVE
- Table `public.ads` exists with RLS enabled: public SELECT policy only, writes go through the service role key server-side
- Seeded with 12 real brands but PLACEHOLDER images (picsum.photos). Swapping in real ad images from Meta Ad Library via /admin is an open task
- Local build passes (`npm run build`)
- Not yet deployed to Vercel
- Not yet in a git repo

## Architecture

- `app/page.tsx` server component, fetches ads via anon key, `?category=` query param filters, CSS-columns masonry
- `app/admin/page.tsx` client form, sends password as Bearer token
- `app/api/ads/route.ts` checks `ADMIN_SECRET`, inserts with `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS)
- `lib/supabase.ts` shared client, types, and the CATEGORIES list. Supabase URL and anon key have hardcoded public fallbacks (safe: anon key is public by design)

## Env vars (.env.local, see .env.example)

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: optional, fallbacks exist
- `SUPABASE_SERVICE_ROLE_KEY`: required for admin inserts. Get from Supabase dashboard, Project Settings > API keys. NEVER expose client-side or commit
- `ADMIN_SECRET`: required, any strong password Randall picks

## Data model: public.ads

id uuid pk, brand_name text, product_name text, category text, image_url text, brand_url text, date_spotted date, created_at timestamptz

## Legal approach

Store metadata + link out to brand sites. Prefer Meta Ad Library images or brand-site product images over raw IG screenshots (IG creatives are brand IP). The app drives traffic TO brands.

## Immediate todos

1. `git init`, push to GitHub, connect repo to Vercel (auto-deploy on push)
2. Add the two secret env vars in Vercel project settings
3. Replace the 12 placeholder images with real ad images via /admin

## Roadmap

- Week 1-2: polish categories, search, share links, basic SEO (per-ad pages with metadata)
- Later: user accounts (Supabase auth), saved collections, public submissions with moderation queue, React Native/Expo app reusing the same Supabase backend

## Conventions

- Plain `<img>` tags on purpose (arbitrary external image hosts); switch to next/image only with configured remotePatterns
- Fonts load via link tag in layout.tsx, not next/font (build environment couldn't reach Google Fonts)
- Design (July 31, 2026, direction picked by Randall): modern commerce browse, Zalando/SSENSE lineage. Pure white ground, ink `#111`, gray `#666` secondary, soft `#f2f2f2` surfaces, cobalt `#2c4bff` accent used only as a whisper (wordmark period, focus rings). Single type family: Archivo (expanded stretch for wordmark/headings via `.font-display`, regular for UI). Cards are bare rounded (10px) images with brand bold + product gray text below — no borders, no shadows, no card chrome; photos supply all color. Rounded chip filters, black when active, horizontal scroll on mobile. Hover: subtle image zoom + white ↗ circle. Full contract in the comment at top of `app/globals.css`. Two earlier looks are dead: cream/Fraunces/terracotta and tabloid Anton/red/yellow — do not bring either back
