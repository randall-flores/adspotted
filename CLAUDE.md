# Adrift

Formerly AdSpotted (renamed Aug 3, 2026; repo folder and Supabase project names unchanged). Pinterest-style masonry feed of products/brands spotted in Instagram ads. Category filters, admin-only submission form. Owner: Randall (beginner, learning by doing; direct answers, working code over explanations, no em dashes).

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
- Design (Aug 3, 2026, "Adrift drift concept", approved by Randall after mockup rounds — spec in `docs/superpowers/specs/2026-08-03-adrift-redesign-design.md`): fog ground `#f3f5f4`, deep-water ink `#0e1e26`, sea-glass teal `#0c7a6d` accent + seafoam `#5fd0c2`. Lowercase wordmark `adrift.` with bobbing teal period. Archivo only (expanded via `.font-display`). Home: uppercase teal-underline category tabs → "New this week" horizontal snap stage (8 newest, full-bleed cards, SHOP ↗ pill) → "All finds" masonry with alternating ±1.2° tilt, slow bob, frosted brand pill. Signature like = "the drop": double-tap → teal heart falls in + water ripples; saves in localStorage (`adrift:saved`), badge on saved cards, `/saved` page, mobile bottom nav (Home/Saved). Voice rule from Randall: plain labels always (no cryptic nav like "The Net", no tickers, no week numbers) — identity lives in look and motion. Full contract atop `app/globals.css`. Dead looks, never revive: white/cobalt Zalando minimal, cream/Fraunces/terracotta, tabloid Anton/red/yellow
