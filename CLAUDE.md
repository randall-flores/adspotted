# Adrift

Formerly AdSpotted (renamed Aug 3, 2026; repo folder and Supabase project names unchanged). Pinterest-style masonry feed of products/brands spotted in Instagram ads. Category filters, admin-only submission form. Owner: Randall (beginner, learning by doing; direct answers, working code over explanations, no em dashes).

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind v4
- Supabase for DB (Storage and auth come later)
- Deploy target: Vercel

## Current state (MVP built July 31, 2026)

- Supabase project "Hollow Ronin", ref `acfrkjuvtcnoybppjumd`, region us-east-1, ACTIVE
- Table `public.ads` exists with RLS enabled: public SELECT policy only, writes go through the service role key server-side
- 51 real brands live with real product images in the `ad-images` Storage bucket
- Local build passes (`npm run build`)
- LIVE at https://adspotted.vercel.app — GitHub repo `randall-flores/adspotted` auto-deploys `main`
- Supabase magic-link auth + `public.saves` table (RLS, own rows only); saves sync localStorage ↔ cloud

## Architecture

- `app/page.tsx` curated home (Aug 4, 2026): stage (8 newest) + "Today's drift" (24, seeded daily shuffle via `lib/drift.ts`) + "Go deeper" category tiles. Old `?category=` redirects to `/c/[category]`
- `app/c/[category]/page.tsx` full per-category masonry, server-paginated 40 at a time via `?n=` Load-more link
- Masonry = flex columns with round-robin JS distribution (`Masonry` in Feed.tsx), NEVER CSS multi-column: WebKit leaves the card at the column break unpainted on iOS (blank right-column card bug, Aug 4). Also no `content-visibility` on cards. Bob animation capped to first 30 cards; all masonry images load eagerly
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

1. Set Supabase Auth Site URL to https://adspotted.vercel.app (magic links redirect to localhost until then)
2. Data model: `saves` table exists (user_id, ad_id, created_at; RLS own-rows)

## Roadmap

- Done Aug 4, 2026: per-find pages, PWA manifest, Analytics, brand pages `/brand/[slug]` (slug = URL-encoded brand_name), real logo ("ripple drop" mark: Archivo black-expanded `a` + seafoam round period with ripple rings on ink; generator scripts in session scratchpad, icons in public/icons/, og in public/og.png)
- Next: public submissions with moderation queue (`status` column)
- Next: location + language settings (requested Aug 4, 2026) — add `country` (where brand ships/markets) to ads; user-facing region picker filters feed; language toggle later via next-intl. Needs backfill of country per existing brand before UI ships
- Later: password + Google sign-in (after domain + project email exist), saved collections, AI vibe search at ~200+ finds, React Native/Expo app reusing the same Supabase backend

## Perf/glitch fixes (Aug 4, 2026) — don't regress

- Supabase Storage uploads MUST set `cache-control: max-age=31536000` header (bare seconds value silently becomes no-cache; HEAD responses misleadingly show no-cache — verify with GET)
- Images ≤200KB webp, max 1200px wide, before upload
- Feed queries order by date_spotted DESC, created_at DESC, id ASC (stable order, no reshuffle on refetch)
- `experimental.staleTimes` in next.config.mjs keeps back-nav instant
- AdImage component owns all ad `<img>`s: lazy/eager, decode async, brand-name fallback on error

## Conventions

- Plain `<img>` tags on purpose (arbitrary external image hosts); switch to next/image only with configured remotePatterns
- Fonts load via link tag in layout.tsx, not next/font (build environment couldn't reach Google Fonts)
- Design (Aug 3, 2026, "Adrift drift concept", approved by Randall after mockup rounds — spec in `docs/superpowers/specs/2026-08-03-adrift-redesign-design.md`): fog ground `#f3f5f4`, deep-water ink `#0e1e26`, sea-glass teal `#0c7a6d` accent + seafoam `#5fd0c2`. Lowercase wordmark `adrift.` with bobbing teal period. Archivo only (expanded via `.font-display`). Home: uppercase teal-underline category tabs → "New this week" horizontal snap stage (8 newest, full-bleed cards, frosted "shop." chip — lowercase with teal period echoing the wordmark, period bobs on hover; ink-block variant on find/brand pages) → "All finds" masonry with alternating ±1.2° tilt, slow bob, frosted brand pill. Signature like = "the drop": double-tap → teal heart falls in + water ripples; saves in localStorage (`adrift:saved`), badge on saved cards, `/saved` page, mobile bottom nav (Home/Saved). Mobile feel pass (Aug 5, 2026, Randall picked from mockups): bottom-nav active tab = seafoam pill that slides between tabs (variant B over drop-dot and floating-dock); header hides on scroll-down/returns on scroll-up (mobile only, `AppHeader.tsx`); press feedback on cards/buttons uses the CSS `scale` property (NOT transform — composes with masonry tilt rotate + bob translate); `viewport-fit=cover` set in layout viewport export so `env(safe-area-inset-bottom)` works; 44px touch targets; tap-highlight transparent + `touch-action: manipulation`. Press-feedback block must stay LAST in globals.css (later `transition` shorthands would drop the scale transition). Voice rule from Randall: plain labels always (no cryptic nav like "The Net", no tickers, no week numbers) — identity lives in look and motion. Full contract atop `app/globals.css`. Dead looks, never revive: white/cobalt Zalando minimal, cream/Fraunces/terracotta, tabloid Anton/red/yellow
