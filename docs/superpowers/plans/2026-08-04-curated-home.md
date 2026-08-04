# Curated Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Home becomes curated (stage + daily drift 24 + category tiles); full catalog moves to paginated `/c/[category]` pages.

**Architecture:** Server components only, no client pagination. Daily selection via seeded PRNG in a small lib. CSS `content-visibility` for offscreen card cost.

**Tech Stack:** Next.js 15 App Router, Supabase JS, Tailwind v4 + globals.css tokens.

## Global Constraints

- No DB changes. No new deps.
- Order tiebreakers everywhere: `date_spotted desc, created_at desc, id asc`.
- Voice: plain labels ("Today's drift", "Go deeper"). No test suite — verify via `npm run build` + browser.

---

### Task 1: Seeded daily sample util

**Files:**
- Create: `lib/drift.ts`

**Interfaces:**
- Produces: `dailySample<T>(items: T[], count: number, seedExtra?: string): T[]` — deterministic for a given UTC date.

- [ ] **Step 1: Write `lib/drift.ts`**

```ts
// Deterministic daily selection: same set for every visitor, new set each UTC day.
function hashString(s: string): number {
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function dailySample<T>(items: T[], count: number, seedExtra = ""): T[] {
  const day = new Date().toISOString().slice(0, 10);
  const rand = mulberry32(hashString(day + seedExtra));
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
```

- [ ] **Step 2: `npm run build` passes** (type check)

### Task 2: Category pages `/c/[category]`

**Files:**
- Create: `app/c/[category]/page.tsx`
- Create: `app/c/[category]/loading.tsx`
- Modify: `app/find/[id]/page.tsx` (category chip link → `/c/`)

**Interfaces:**
- Consumes: `CATEGORIES`, `supabaseBrowser`, `Masonry`, `BackButton`, `.skel` CSS.
- Produces: route `/c/[category]?n=40` — `n` = how many rendered (default 40, +40 per Load more link).

- [ ] **Step 1: Write `app/c/[category]/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseBrowser, CATEGORIES, type Ad } from "@/lib/supabase";
import { Masonry } from "../../components/Feed";
import BackButton from "../../components/BackButton";

export const dynamic = "force-dynamic";
const PAGE = 40;

function resolveCategory(slug: string): string | null {
  const name = decodeURIComponent(slug);
  return (CATEGORIES as readonly string[]).includes(name) ? name : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const name = resolveCategory(category);
  if (!name) return { title: "Not found — Adrift" };
  return {
    title: `${name} finds — Adrift`,
    description: `Every ${name.toLowerCase()} product spotted in ads on Adrift.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ n?: string }>;
}) {
  const { category } = await params;
  const name = resolveCategory(category);
  if (!name) notFound();

  const { n } = await searchParams;
  const shown = Math.max(PAGE, Math.min(parseInt(n ?? "", 10) || PAGE, 1000));

  const supabase = supabaseBrowser();
  const [{ data: ads }, { count }] = await Promise.all([
    supabase
      .from("ads")
      .select("*")
      .eq("category", name)
      .order("date_spotted", { ascending: false })
      .order("created_at", { ascending: false })
      .order("id", { ascending: true })
      .range(0, shown - 1),
    supabase.from("ads").select("id", { count: "exact", head: true }).eq("category", name),
  ]);

  const total = count ?? 0;

  return (
    <main className="mx-auto max-w-7xl px-5 py-4">
      <BackButton />
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="font-display font-black text-[20px]">{name}</h1>
        <span className="text-[11px] font-extrabold text-[var(--accent)]">{total}</span>
      </div>
      {ads && ads.length > 0 ? <Masonry ads={ads as Ad[]} /> : (
        <p className="py-16 text-center text-sm text-[var(--gray)]">Nothing spotted here yet.</p>
      )}
      {shown < total && (
        <div className="text-center mt-6">
          <Link href={`/c/${encodeURIComponent(name)}?n=${shown + PAGE}`} className="cta-btn inline-flex items-center" scroll={false}>
            Load more
          </Link>
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Write `app/c/[category]/loading.tsx`** — copy of brand loading skeleton with masonry blocks.

```tsx
export default function CategoryLoading() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-4" aria-busy="true">
      <div className="skel h-[34px] w-[76px] rounded-full mb-3" />
      <div className="skel h-[20px] w-[120px] mb-4" />
      <div className="masonry">
        {[260, 320, 240, 300, 220, 280, 250, 310].map((h, i) => (
          <div key={i} className="skel" style={{ height: h }} />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: In `app/find/[id]/page.tsx`** change category chip href `/?category=${encodeURIComponent(ad.category)}` → `/c/${encodeURIComponent(ad.category)}` (both occurrences: chip + brand page keeps its own links; brand page category links also update: `app/brand/[slug]/page.tsx`).

- [ ] **Step 4: Build passes**

### Task 3: Curated home

**Files:**
- Modify: `app/page.tsx` (full rewrite of body)
- Modify: `app/loading.tsx` (add tile-row skeleton at bottom — optional, keep as is acceptable)

**Interfaces:**
- Consumes: `dailySample` from Task 1, existing `Feed`/`Masonry`.
- Produces: home with stage(8) + drift(24) + 7 tiles; `/?category=` redirect.

- [ ] **Step 1: Rewrite `app/page.tsx`**

```tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseBrowser, CATEGORIES, type Ad } from "@/lib/supabase";
import Feed from "./components/Feed";        // still renders stage via showStage
import { Masonry } from "./components/Feed";
import { dailySample } from "@/lib/drift";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  if (category) redirect(`/c/${encodeURIComponent(category)}`);

  const supabase = supabaseBrowser();
  const { data, error } = await supabase
    .from("ads")
    .select("*")
    .order("date_spotted", { ascending: false })
    .order("created_at", { ascending: false })
    .order("id", { ascending: true });

  const ads = (data as Ad[]) ?? [];
  const newest = ads.slice(0, 8);
  const rest = ads.slice(8);
  const drift = dailySample(rest, 24);

  const tiles = CATEGORIES.map((c) => {
    const inCat = ads.filter((a) => a.category === c);
    return { name: c, count: inCat.length, image: inCat[0]?.image_url };
  }).filter((t) => t.count > 0);

  return (
    <main className="mx-auto max-w-7xl px-5 py-4">
      <div className="tabrow -mx-5 px-5 sm:mx-0 sm:px-0 mb-5">
        <Link href="/" className="tab tab-active">All</Link>
        {CATEGORIES.map((c) => (
          <Link key={c} href={`/c/${encodeURIComponent(c)}`} className="tab">{c}</Link>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">Could not load the feed: {error.message}</p>}

      {/* stage: reuse Feed with only newest, hide its "All finds" via new prop OR inline stage — implementer: extract Stage from Feed into named export and use directly */}
      ...stage(newest)...

      <div className="flex items-baseline justify-between mb-2.5 mt-7">
        <h2 className="font-display font-black text-[15px] tracking-wide">Today&apos;s drift</h2>
        <span className="text-[11px] text-[var(--gray)]">changes daily</span>
      </div>
      <Masonry ads={drift} />

      <h2 className="font-display font-black text-[15px] tracking-wide mt-8 mb-2.5">Go deeper</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {tiles.map((t) => (
          <Link key={t.name} href={`/c/${encodeURIComponent(t.name)}`} className="cat-tile">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.image} alt="" loading="lazy" decoding="async" />
            <span className="ct-veil" aria-hidden="true" />
            <span className="ct-label">{t.name.toLowerCase()}</span>
            <span className="ct-count">{t.count}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
```

Stage extraction: in `Feed.tsx`, export `Stage({ ads })` (the existing `showStage` section: heading "New this week", stage cards, hint line). Home uses `<Stage ads={newest} />`. `Feed` default export keeps working for any other caller (none currently use showStage except home).

- [ ] **Step 2: Build passes**

### Task 4: CSS — tiles + content-visibility

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Append/modify styles**

```css
/* Offscreen cards: skip render + animation work */
.fc,
.stage-card {
  content-visibility: auto;
  contain-intrinsic-size: auto 320px;
}

/* Category tiles ("Go deeper") */
.cat-tile {
  position: relative;
  display: block;
  aspect-ratio: 4 / 3;
  border-radius: 14px;
  overflow: hidden;
  background: var(--soft);
  box-shadow: 0 10px 24px rgba(14, 30, 38, 0.13);
}
.cat-tile img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.cat-tile:hover img {
  transform: scale(1.04);
}
.ct-veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(8, 20, 26, 0.66));
}
.ct-label {
  position: absolute;
  left: 12px;
  bottom: 10px;
  color: #ffffff;
  font-family: "Archivo", "Helvetica Neue", Arial, sans-serif;
  font-stretch: 118%;
  font-weight: 900;
  font-size: 15px;
  letter-spacing: -0.01em;
}
.ct-count {
  position: absolute;
  right: 10px;
  top: 8px;
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  background: rgba(14, 30, 38, 0.55);
  backdrop-filter: blur(4px);
  border-radius: 9999px;
  padding: 3px 8px;
}
```

- [ ] **Step 2: Build passes**

### Task 5: Verify + ship

- [ ] **Step 1:** `npm run build`
- [ ] **Step 2:** `npm run start`, browser: home shows 8+24+7; tab → category page; Load more grows list, order stable; find page chip → /c/; `/?category=Beauty` redirects; back nav smooth
- [ ] **Step 3:** Commit + push

```bash
git add -A && git commit -m "feat: curated home with daily drift + paginated category pages" && git push origin main
```
