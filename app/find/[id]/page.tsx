import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseBrowser, type Ad } from "@/lib/supabase";
import { Masonry } from "../../components/Feed";
import ShareButton from "../../components/ShareButton";
import AdImage from "../../components/AdImage";
import BackButton from "../../components/BackButton";
import FindHeart from "./FindHeart";

export const dynamic = "force-dynamic";

async function getAd(id: string): Promise<Ad | null> {
  const { data } = await supabaseBrowser()
    .from("ads")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Ad) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const ad = await getAd(id);
  if (!ad) return { title: "Find not found — Adrift" };
  return {
    title: `${ad.brand_name} — ${ad.product_name} | Adrift`,
    description: `${ad.product_name} by ${ad.brand_name}, spotted in an ad. Found on Adrift.`,
    openGraph: {
      title: `${ad.brand_name} — ${ad.product_name}`,
      description: `Spotted in an ad. Found on Adrift.`,
      images: [{ url: ad.image_url }],
    },
  };
}

export default async function FindPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ad = await getAd(id);
  if (!ad) notFound();

  const { data: related } = await supabaseBrowser()
    .from("ads")
    .select("*")
    .eq("category", ad.category)
    .neq("id", ad.id)
    .order("date_spotted", { ascending: false })
    .order("created_at", { ascending: false })
    .order("id", { ascending: true })
    .limit(6);

  return (
    <main className="mx-auto max-w-2xl px-5 py-4">
      <BackButton />
      <div className="find-hero">
        <AdImage
          src={ad.image_url}
          alt={`${ad.product_name} by ${ad.brand_name}`}
          brand={ad.brand_name}
          eager
        />
        <FindHeart adId={ad.id} brand={ad.brand_name} />
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display font-black text-[22px] leading-tight">
            <Link
              href={`/brand/${encodeURIComponent(ad.brand_name)}`}
              className="hover:text-[var(--accent)] transition-colors"
            >
              {ad.brand_name}
            </Link>
          </h1>
          <p className="text-[15px] text-[#44524e] mt-0.5">{ad.product_name}</p>
          <Link
            href={`/c/${encodeURIComponent(ad.category)}`}
            className="inline-block mt-2.5 text-[11px] font-extrabold tracking-[0.1em] uppercase text-[var(--accent)]"
          >
            {ad.category}
          </Link>
          <Link
            href={`/brand/${encodeURIComponent(ad.brand_name)}`}
            className="block mt-2 text-[13px] font-bold text-[var(--ink)] hover:text-[var(--accent)]"
          >
            All finds from {ad.brand_name} →
          </Link>
        </div>
        <div className="flex flex-col gap-2 items-end shrink-0">
          <a
            href={ad.brand_url}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn !h-[42px] flex items-center"
          >
            SHOP ↗
          </a>
          <ShareButton
            title={`${ad.brand_name} — ${ad.product_name}`}
            url={`/find/${ad.id}`}
          />
        </div>
      </div>

      {related && related.length > 0 && (
        <section className="mt-9">
          <h2 className="font-display font-black text-[15px] tracking-wide mb-2.5">
            More {ad.category.toLowerCase()}
          </h2>
          <Masonry ads={related as Ad[]} />
        </section>
      )}
    </main>
  );
}
