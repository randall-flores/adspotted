import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseBrowser, CATEGORIES, type Ad } from "@/lib/supabase";
import { Stage, Masonry } from "./components/Feed";
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
  const drift = dailySample(ads.slice(8), 24);

  const tiles = CATEGORIES.map((c) => {
    const inCat = ads.filter((a) => a.category === c);
    return { name: c, count: inCat.length, image: inCat[0]?.image_url };
  }).filter((t) => t.count > 0);

  return (
    <main className="mx-auto max-w-7xl px-5 py-4">
      <div className="tabrow -mx-5 px-5 sm:mx-0 sm:px-0 mb-5">
        <Link href="/" className="tab tab-active">
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link key={c} href={`/c/${encodeURIComponent(c)}`} className="tab">
            {c}
          </Link>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600">
          Could not load the feed: {error.message}
        </p>
      )}

      {ads.length === 0 && !error && (
        <div className="py-16 text-center">
          <p className="font-medium">Nothing spotted here yet.</p>
          <p className="text-sm text-[var(--gray)] mt-1">
            New finds land as we catch them — check back soon.
          </p>
        </div>
      )}

      <Stage ads={newest} />

      {drift.length > 0 && (
        <>
          <div className="flex items-baseline justify-between mb-2.5 mt-7">
            <h2 className="font-display font-black text-[15px] tracking-wide">
              Today&apos;s drift
            </h2>
            <span className="text-[11px] text-[var(--gray)]">changes daily</span>
          </div>
          <Masonry ads={drift} />
        </>
      )}

      {tiles.length > 0 && (
        <>
          <h2 className="font-display font-black text-[15px] tracking-wide mt-8 mb-2.5">
            Go deeper
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {tiles.map((t) => (
              <Link
                key={t.name}
                href={`/c/${encodeURIComponent(t.name)}`}
                className="cat-tile"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image} alt="" loading="lazy" decoding="async" />
                <span className="ct-veil" aria-hidden="true" />
                <span className="ct-label">{t.name.toLowerCase()}</span>
                <span className="ct-count">{t.count}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
