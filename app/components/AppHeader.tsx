"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SavedLink from "./SavedLink";

export default function AppHeader() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current;
      // only react to real movement, and never hide near the top
      if (Math.abs(y - lastY.current) > 6) {
        setHidden(goingDown && y > 90);
        lastY.current = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`app-header ${hidden ? "header-hidden" : ""}`}>
      <div className="mx-auto max-w-7xl px-5 pt-5 pb-3 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display font-black text-[24px] leading-none lowercase"
        >
          adrift<span className="drift-dot">.</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/explore"
            className="hidden sm:flex items-center gap-1.5 text-[13px] font-bold"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-[18px] h-[18px] text-[var(--accent)]"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4-4" />
            </svg>
            Explore
          </Link>
          <SavedLink />
          <Link
            href="/profile"
            className="hidden sm:flex items-center gap-1.5 text-[13px] font-bold"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-[18px] h-[18px] text-[var(--accent)]"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c1-5 5-7 8-7s7 2 8 7" />
            </svg>
            Profile
          </Link>
        </div>
      </div>
    </header>
  );
}
