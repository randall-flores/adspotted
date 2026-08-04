import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseBrowser, CATEGORIES, type Ad } from "@/lib/supabase";
import { Masonry } from "../../components/Feed";
import CategoryTabs from "../../components/CategoryTabs";

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
    supabase
      .from("ads")
      .select("id", { count: "exact", head: true })
      .eq("category", name),
  ]);

  const total = count ?? 0;

  return (
    <main className="mx-auto max-w-7xl px-5 py-4">
      <CategoryTabs active={name} />
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="font-display font-black text-[20px]">{name}</h1>
        <span className="text-[11px] font-extrabold text-[var(--accent)]">
          {total}
        </span>
      </div>

      {ads && ads.length > 0 ? (
        <Masonry ads={ads as Ad[]} />
      ) : (
        <p className="py-16 text-center text-sm text-[var(--gray)]">
          Nothing spotted here yet.
        </p>
      )}

      {shown < total && (
        <div className="text-center mt-6">
          <Link
            href={`/c/${encodeURIComponent(name)}?n=${shown + PAGE}`}
            className="more-btn"
            scroll={false}
          >
            Load more
          </Link>
        </div>
      )}
    </main>
  );
}
