"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser, type Ad } from "@/lib/supabase";
import { getSavedIds, onSavedChange } from "@/lib/saved";
import { Masonry } from "../components/Feed";

export default function SavedPage() {
  const [ads, setAds] = useState<Ad[] | null>(null);
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(getSavedIds());
    return onSavedChange(() => setIds(getSavedIds()));
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (ids.length === 0) {
      setAds([]);
      return;
    }
    supabaseBrowser()
      .from("ads")
      .select("*")
      .in("id", ids)
      .then(({ data }) => {
        if (!cancelled && data) {
          const order = new Map(ids.map((id, i) => [id, i]));
          setAds(
            (data as Ad[]).sort(
              (a, b) => (order.get(b.id) ?? 0) - (order.get(a.id) ?? 0)
            )
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [ids]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-4">
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="font-display font-black text-[20px]">Saved</h1>
        {ids.length > 0 && (
          <span className="text-[11px] font-extrabold text-[var(--accent)]">
            {ids.length}
          </span>
        )}
      </div>

      {ads === null && (
        <p className="text-sm text-[var(--gray)]">Loading…</p>
      )}

      {ads !== null && ads.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-medium">Nothing saved yet.</p>
          <p className="text-sm text-[var(--gray)] mt-1">
            Double-tap any find (or tap its heart) and it lands here.
          </p>
          <Link
            href="/"
            className="inline-block mt-5 text-[13px] font-bold text-[var(--accent)]"
          >
            Browse the feed →
          </Link>
        </div>
      )}

      {ads !== null && ads.length > 0 && <Masonry ads={ads} />}
    </main>
  );
}
