# Adrift redesign — design spec (approved Aug 3, 2026)

Hybrid of three mockup directions, approved by Randall after two iterations
(`adrift-hybrid-v2.html` in session scratchpad is the visual source of truth).

## Identity

- Concept: drifting through your feed; ads are things you catch.
- Ground: fog `#f3f5f4`. Ink: `#0e1e26`. Accent: sea-glass teal `#0c7a6d`
  (light variant seafoam `#5fd0c2`). Sand `#e7e2d6` reserved for future chips.
  Cobalt `#2c4bff` is dead.
- Wordmark: lowercase `adrift.` — the period is teal and gently bobs.
- Type: Archivo only. Display = expanded stretch (existing `.font-display`).
- Voice: plain first, light identity second. Nav and labels are never cryptic
  (user feedback: no "The Net"-style riddle labels, no ticker marquees, no
  week numbers).

## Layout (mobile-first)

1. Header: wordmark left; "Saved" heart link with count right (desktop).
2. Category tabs: uppercase, letter-spaced, teal underline on active.
   Same `?category=` URL param logic as before.
3. "New this week" stage (only on the unfiltered view): horizontal
   snap-scroll of the 8 newest finds. Full-bleed image card, dark veil,
   big brand name, product line, teal `SHOP ↗` pill (external link),
   index `01/08`.
4. "All finds" masonry: images with slight alternating tilt and a slow bob,
   frosted brand pill bottom-left, no text below the card.
5. Bottom nav, mobile only: Home · Saved (teal badge with save count).
   Desktop uses the header link instead.

## The signature like — "the drop"

- Double-tap a card: teal heart drops in and water-ripple rings spread.
- Saved cards wear a small teal heart badge (top-right).
- Every card also has an explicit heart button (a11y + desktop hover).
- Persistence: `localStorage` key `adrift:saved` (array of ad ids).
  No accounts yet; Supabase auth can replace the store later.
- `/saved` page lists saved finds with the same masonry; empty state
  explains the double-tap.

## Interaction rules

- Stage card body: single tap does nothing, double-tap saves; only the
  SHOP pill navigates.
- Masonry card: desktop click opens brand in new tab as before. On touch,
  navigation waits 330 ms to detect a double-tap; double-tap saves instead
  of navigating (same-tab navigation on touch).
- All motion respects `prefers-reduced-motion`.

## Files

- `app/globals.css` — rewrite: tokens, new direction contract, stage,
  tabs, tilt/bob masonry, drop animation, bottom nav.
- `lib/saved.ts` — localStorage save store + change events.
- `app/components/Feed.tsx` — client: stage, masonry, drop hearts.
- `app/components/BottomNav.tsx` — client: mobile tab bar with badge.
- `app/layout.tsx` — new header/footer, bottom nav mount.
- `app/page.tsx` — server fetch + tabs, renders `Feed`.
- `app/saved/page.tsx` — client saved view.
- `CLAUDE.md` — design section replaced.
