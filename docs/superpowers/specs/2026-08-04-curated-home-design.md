# Curated Home at 200+ Finds — Design

Date: 2026-08-04. Approved by Randall (options: curated discovery → category pages → drift + tiles).

## Problem

Home currently renders all 201 finds in one masonry. Overwhelming to browse, unbounded as the catalog grows, and 201 infinite bob animations tax low-end phones. Goal: easy, premium navigation; home discovers, category pages browse.

## Structure

### `/` (home, curated)
Order top to bottom:
1. Header + category tabs (unchanged look). Tabs now LINK to `/c/[category]` instead of `/?category=` filtering.
2. **New this week** stage: 8 newest finds (unchanged).
3. **Today's drift**: masonry of 24 finds, rotating daily. Deterministic seeded shuffle, seed = `YYYY-MM-DD` (UTC), so every visitor sees the same set each day; changes at midnight. Excludes the 8 stage finds. Sampled server-side from the full list (fine at current scale).
4. **Go deeper**: grid of 7 category tiles. Tile = full-bleed image (newest find in that category), lowercase category label, find count. 2 columns mobile, 4 desktop.

### `/c/[category]` (new, full catalog per category)
- Slug = URL-encoded category name from `CATEGORIES` (e.g. `/c/Food%20%26%20Drink`). Unknown slug → 404.
- Complete masonry for the category, newest first, stable order (existing tiebreakers).
- Server-side pagination: shows first 40; "Load more" is a LINK to `?n=80`, then `?n=120`, etc. (renders first `n`, no client JS). Link hidden when `n >= total`.
- Header: category name, count, BackButton.
- og metadata per category.

### Redirects / compatibility
- `/?category=X` (old shared links, find-page category chips) → redirect to `/c/X`.

### Unchanged
Explore, Saved, Profile, find pages, admin, data model. Stage, drop animation, card design.

## Performance

- `.fc` and `.stage-card` get `content-visibility: auto` + `contain-intrinsic-size` estimate, so offscreen cards don't render or animate. Fixes the 201-animation cost; keeps the bob signature on visible cards.
- Home still fetches all rows server-side (one query) — acceptable to ~500 finds; revisit with a sampled query later.

## Implementation notes

- Seeded shuffle: mulberry32-style PRNG seeded from date string hash; shuffle copy of the non-stage list, take 24.
- Category tiles data: derive from the already-fetched rows (no extra query): count per category + newest image.
- `/c/[category]` uses one query filtered by category (no `n` in the query; slice server-side after fetch, or `.range(0, n-1)` — use `.range`, cheaper).
- Tabs component stays in `app/page.tsx`; `/c/` page reuses the same tab row with active state.
- Old param handling: in `app/page.tsx`, if `searchParams.category` present → `redirect()` to `/c/...`.

## Not doing (YAGNI)

Infinite scroll, editorial/manual collections, AI ordering, DB changes, brand directory page.

## Success criteria

- Home shows exactly 8 + 24 + 7 tiles regardless of catalog size.
- Drift set changes daily, stable within a day.
- Category pages list everything, 40 per load, order stable across loads.
- Old `/?category=` links land on the right category page.
- `npm run build` passes; nav flows verified in browser (home → tile → category → load more → find → back).
