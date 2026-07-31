import Link from "next/link";
import { supabaseBrowser, CATEGORIES, type Ad } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function AdCard({ ad }: { ad: Ad }) {
  const spotted = new Date(ad.date_spotted).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return (
    <a
      href={ad.brand_url}
      target="_blank"
      rel="noopener noreferrer"
      className="ad-card"
    >
      <div className="frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ad.image_url}
          alt={`${ad.product_name} by ${ad.brand_name}`}
          loading="lazy"
        />
        <span className="shop-hint" aria-hidden="true">
          ↗
        </span>
      </div>
      <div className="pt-2.5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[13px] font-bold">{ad.brand_name}</span>
          <span className="text-xs text-[var(--gray)] shrink-0">
            Spotted {spotted}
          </span>
        </div>
        <p className="product-name text-sm text-[#444444] mt-0.5">
          {ad.product_name}
        </p>
      </div>
    </a>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = supabaseBrowser();

  let query = supabase
    .from("ads")
    .select("*")
    .order("date_spotted", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data: ads, error } = await query;

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-[26px] sm:text-[32px] leading-tight tracking-tight">
          Missed it in your feed? It&apos;s here.
        </h1>
        <p className="mt-2 max-w-[58ch] text-[15px] text-[var(--gray)] leading-relaxed">
          Products and brands from Instagram ads, collected so you can find
          them again. Tap through to shop at the brand.
        </p>
        <div className="chip-row mt-6 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
          <Link
            href="/"
            className={`chip px-4 py-2 ${!category ? "chip-active" : ""}`}
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/?category=${encodeURIComponent(c)}`}
              className={`chip px-4 py-2 ${category === c ? "chip-active" : ""}`}
            >
              {c}
            </Link>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">
          Could not load the feed: {error.message}
        </p>
      )}

      {ads && ads.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-medium">Nothing spotted here yet.</p>
          <p className="text-sm text-[var(--gray)] mt-1">
            New finds land as we catch them — check back soon.
          </p>
        </div>
      )}

      {ads && ads.length > 0 && (
        <div className="masonry">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad as Ad} />
          ))}
        </div>
      )}
    </main>
  );
}
