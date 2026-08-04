import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseBrowser, type Ad } from "@/lib/supabase";
import { Masonry } from "../../components/Feed";
import BackButton from "../../components/BackButton";

export const dynamic = "force-dynamic";

async function getBrandAds(slug: string): Promise<Ad[]> {
  const brandName = decodeURIComponent(slug);
  const { data } = await supabaseBrowser()
    .from("ads")
    .select("*")
    .eq("brand_name", brandName)
    .order("date_spotted", { ascending: false })
    .order("created_at", { ascending: false })
    .order("id", { ascending: true });
  return (data as Ad[]) ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ads = await getBrandAds(slug);
  if (ads.length === 0) return { title: "Brand not found — Adrift" };
  const brand = ads[0].brand_name;
  return {
    title: `${brand} — spotted on Adrift`,
    description: `${ads.length} ${ads.length === 1 ? "find" : "finds"} from ${brand}, spotted in ads and collected on Adrift.`,
    openGraph: {
      title: `${brand} on Adrift`,
      description: `Spotted in ads. ${ads.length} ${ads.length === 1 ? "find" : "finds"} collected.`,
      images: [{ url: ads[0].image_url }],
    },
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ads = await getBrandAds(slug);
  if (ads.length === 0) notFound();

  const brand = ads[0].brand_name;
  const categories = [...new Set(ads.map((ad) => ad.category))];
  const latest = ads[0];

  return (
    <main className="mx-auto max-w-7xl px-5 py-4">
      <BackButton />

      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold tracking-[0.1em] uppercase text-[var(--gray)] mb-1">
            Brand
          </p>
          <h1 className="font-display font-black text-[28px] leading-tight">
            {brand}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
            <span className="text-[13px] font-bold text-[var(--accent)]">
              {ads.length} {ads.length === 1 ? "find" : "finds"}
            </span>
            {categories.map((c) => (
              <Link
                key={c}
                href={`/c/${encodeURIComponent(c)}`}
                className="text-[11px] font-extrabold tracking-[0.1em] uppercase text-[var(--gray)] hover:text-[var(--ink)]"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
        <a
          href={latest.brand_url}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-btn !h-[42px] flex items-center shrink-0"
        >
          SHOP ↗
        </a>
      </div>

      <Masonry ads={ads} />
    </main>
  );
}
