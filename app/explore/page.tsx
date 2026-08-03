"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabaseBrowser, CATEGORIES, type Ad } from "@/lib/supabase";
import { Masonry } from "../components/Feed";

export default function ExplorePage() {
  const [ads, setAds] = useState<Ad[] | null>(null);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    supabaseBrowser()
      .from("ads")
      .select("*")
      .order("date_spotted", { ascending: false })
      .then(({ data }) => {
        if (!cancelled && data) setAds(data as Ad[]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    if (!ads) return null;
    const needle = q.trim().toLowerCase();
    if (!needle) return null;
    return ads.filter(
      (ad) =>
        ad.brand_name.toLowerCase().includes(needle) ||
        ad.product_name.toLowerCase().includes(needle) ||
        ad.category.toLowerCase().includes(needle)
    );
  }, [ads, q]);

  const brands = useMemo(() => {
    if (!ads) return [];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const ad of ads) {
      if (!seen.has(ad.brand_name)) {
        seen.add(ad.brand_name);
        out.push(ad.brand_name);
      }
      if (out.length >= 10) break;
    }
    return out;
  }, [ads]);

  function pick(term: string) {
    setQ(term);
    inputRef.current?.focus();
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-4">
      <h1 className="font-display font-black text-[20px] mb-3">Explore</h1>

      <div className="search-wrap">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="search-icon"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4-4" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search brands, products, categories"
          className="search-input"
          aria-label="Search finds"
          autoComplete="off"
        />
        {q && (
          <button
            type="button"
            className="search-clear"
            aria-label="Clear search"
            onClick={() => pick("")}
          >
            ✕
          </button>
        )}
      </div>

      {ads === null && (
        <p className="text-sm text-[var(--gray)] mt-6">Loading…</p>
      )}

      {/* Empty query: suggestions */}
      {ads !== null && results === null && (
        <div className="mt-6">
          <h2 className="sug-head">Categories</h2>
          <div className="flex flex-wrap gap-2 mb-7">
            {CATEGORIES.map((c) => (
              <button key={c} type="button" className="sug-chip" onClick={() => pick(c)}>
                {c}
              </button>
            ))}
          </div>
          <h2 className="sug-head">Brands people spot</h2>
          <div className="flex flex-wrap gap-2 mb-7">
            {brands.map((b) => (
              <button key={b} type="button" className="sug-chip" onClick={() => pick(b)}>
                {b}
              </button>
            ))}
          </div>
          <h2 className="sug-head">New this week</h2>
          <Masonry ads={ads.slice(0, 6)} />
        </div>
      )}

      {/* Results */}
      {results !== null && (
        <div className="mt-5">
          <div className="flex items-baseline justify-between mb-2.5">
            <h2 className="font-display font-black text-[15px] tracking-wide">
              {results.length > 0
                ? `${results.length} ${results.length === 1 ? "find" : "finds"}`
                : "No finds"}
            </h2>
          </div>
          {results.length > 0 ? (
            <Masonry ads={results} />
          ) : (
            <div className="py-12 text-center">
              <p className="font-medium">Nothing matches “{q.trim()}”.</p>
              <p className="text-sm text-[var(--gray)] mt-1">
                Try a brand, product, or category name.
              </p>
              <button
                type="button"
                className="mt-5 text-[13px] font-bold text-[var(--accent)]"
                onClick={() => pick("")}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
