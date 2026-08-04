"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { type Ad } from "@/lib/supabase";
import { getSavedIds, toggleSaved, onSavedChange } from "@/lib/saved";
import AdImage from "./AdImage";

function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 21s-8-5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6-8 11-8 11z" />
    </svg>
  );
}

function DropSplash() {
  return (
    <span className="drop-splash" aria-hidden="true">
      <span className="ring" />
      <span className="ring" />
      <span className="ring" />
      <span className="drop-heart">
        <svg viewBox="0 0 24 24">
          <path d="M12 21s-8-5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6-8 11-8 11z" />
        </svg>
      </span>
    </span>
  );
}

/** Shared save state + "the drop" splash for one ad. */
function useSave(id: string) {
  const [saved, setSaved] = useState(false);
  const [splashKey, setSplashKey] = useState(0);

  useEffect(() => {
    setSaved(getSavedIds().includes(id));
    return onSavedChange(() => setSaved(getSavedIds().includes(id)));
  }, [id]);

  function toggle(withSplash: boolean) {
    const nowSaved = toggleSaved(id);
    if (nowSaved && withSplash) setSplashKey((k) => k + 1);
  }
  return { saved, splashKey, toggle };
}

function HeartButton({
  saved,
  onToggle,
  brand,
}: {
  saved: boolean;
  onToggle: () => void;
  brand: string;
}) {
  return (
    <button
      type="button"
      className={`heart-btn ${saved ? "saved" : ""}`}
      aria-label={saved ? `Remove ${brand} from saved` : `Save ${brand}`}
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
    >
      <HeartIcon filled={saved} />
    </button>
  );
}

function StageCard({ ad, index, total }: { ad: Ad; index: number; total: number }) {
  const { saved, splashKey, toggle } = useSave(ad.id);
  const router = useRouter();
  const lastTap = useRef(0);
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (navTimer.current) clearTimeout(navTimer.current);
    };
  }, []);

  function handleTap() {
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    if (!coarse) {
      router.push(`/find/${ad.id}`);
      return;
    }
    const now = Date.now();
    if (now - lastTap.current < 320) {
      lastTap.current = 0;
      if (navTimer.current) clearTimeout(navTimer.current);
      toggle(true);
    } else {
      lastTap.current = now;
      navTimer.current = setTimeout(() => {
        router.push(`/find/${ad.id}`);
      }, 330);
    }
  }

  return (
    <div className="stage-card" onClick={handleTap}>
      <AdImage
        src={ad.image_url}
        alt={`${ad.product_name} by ${ad.brand_name}`}
        brand={ad.brand_name}
        eager={index < 2}
      />
      <div className="veil" aria-hidden="true" />
      <span className="absolute top-3 left-4 text-white text-[11px] font-extrabold tracking-[0.12em] [text-shadow:0_1px_4px_rgba(0,0,0,0.45)]">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      {splashKey > 0 && <DropSplash key={splashKey} />}
      <HeartButton saved={saved} onToggle={() => toggle(true)} brand={ad.brand_name} />
      <div className="absolute left-4 right-24 bottom-[19px] text-white">
        <div className="font-display font-black text-[22px] leading-[1.02] uppercase line-clamp-2">
          {ad.brand_name}
        </div>
        <div className="text-white/80 text-xs font-semibold mt-1 line-clamp-1">
          {ad.product_name}
        </div>
      </div>
      <a
        href={ad.brand_url}
        target="_blank"
        rel="noopener noreferrer"
        className="shop-btn"
        onClick={(e) => e.stopPropagation()}
      >
        SHOP ↗
      </a>
    </div>
  );
}

function MasonryCard({ ad, eager }: { ad: Ad; eager?: boolean }) {
  const { saved, splashKey, toggle } = useSave(ad.id);
  const router = useRouter();
  const lastTap = useRef(0);
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (navTimer.current) clearTimeout(navTimer.current);
    };
  }, []);

  function handleClick(e: React.MouseEvent) {
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    if (!coarse) return; // desktop: instant nav, hearts via button
    e.preventDefault();
    const now = Date.now();
    if (now - lastTap.current < 320) {
      lastTap.current = 0;
      if (navTimer.current) clearTimeout(navTimer.current);
      toggle(true);
    } else {
      lastTap.current = now;
      navTimer.current = setTimeout(() => {
        router.push(`/find/${ad.id}`);
      }, 330);
    }
  }

  return (
    <div className="relative">
      <Link href={`/find/${ad.id}`} className="fc" onClick={handleClick}>
        <AdImage
          src={ad.image_url}
          alt={`${ad.product_name} by ${ad.brand_name}`}
          brand={ad.brand_name}
          eager={eager}
        />
        <span className="tagp">{ad.brand_name}</span>
        {splashKey > 0 && <DropSplash key={splashKey} />}
        <HeartButton saved={saved} onToggle={() => toggle(true)} brand={ad.brand_name} />
      </Link>
    </div>
  );
}

export function Masonry({ ads }: { ads: Ad[] }) {
  return (
    <div className="masonry">
      {ads.map((ad, i) => (
        <MasonryCard key={ad.id} ad={ad} eager={i < 4} />
      ))}
    </div>
  );
}

export default function Feed({ ads, showStage }: { ads: Ad[]; showStage: boolean }) {
  const newest = ads.slice(0, 8);
  return (
    <>
      {showStage && newest.length > 0 && (
        <section className="mb-7" aria-label="New this week">
          <h2 className="font-display font-black text-[15px] tracking-wide mb-2.5">
            New this week
          </h2>
          <div className="stage">
            {newest.map((ad, i) => (
              <StageCard key={ad.id} ad={ad} index={i} total={newest.length} />
            ))}
          </div>
          <p className="text-[11px] text-[var(--gray)] text-center mt-2">
            swipe to browse · double-tap to save
          </p>
        </section>
      )}
      <div className="flex items-baseline justify-between mb-2.5">
        <h2 className="font-display font-black text-[15px] tracking-wide">All finds</h2>
        <span className="text-[11px] font-extrabold text-[var(--accent)]">{ads.length}</span>
      </div>
      <Masonry ads={ads} />
    </>
  );
}
