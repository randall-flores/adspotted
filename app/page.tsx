import Link from "next/link";
import { supabaseBrowser, CATEGORIES, type Ad } from "@/lib/supabase";
import Feed from "./components/Feed";

export const dynamic = "force-dynamic";

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
    .order("date_spotted", { ascending: false })
    .order("created_at", { ascending: false })
    .order("id", { ascending: true });

  if (category) query = query.eq("category", category);

  const [{ data: ads, error }, { data: catRows }] = await Promise.all([
    query,
    supabase.from("ads").select("category"),
  ]);

  const counts = new Map<string, number>();
  for (const row of catRows ?? []) {
    const c = row.category as string;
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  const total = catRows?.length ?? 0;

  return (
    <main className="mx-auto max-w-7xl px-5 py-4">
      <div className="tabrow -mx-5 px-5 sm:mx-0 sm:px-0 mb-5">
        <Link href="/" className={`tab ${!category ? "tab-active" : ""}`}>
          All{total > 0 && <span className="tab-count">{total}</span>}
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/?category=${encodeURIComponent(c)}`}
            className={`tab ${category === c ? "tab-active" : ""}`}
          >
            {c}
            {(counts.get(c) ?? 0) > 0 && (
              <span className="tab-count">{counts.get(c)}</span>
            )}
          </Link>
        ))}
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
        <Feed ads={ads as Ad[]} showStage={!category} />
      )}
    </main>
  );
}
