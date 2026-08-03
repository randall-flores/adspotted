"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { savedCount, onSavedChange } from "@/lib/saved";

export default function BottomNav() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(savedCount());
    return onSavedChange(() => setCount(savedCount()));
  }, []);

  return (
    <nav className="bottom-nav sm:hidden" aria-label="Main">
      <Link href="/" className={`bn-item ${pathname === "/" ? "active" : ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M3 10l9-7 9 7v10H3z" />
        </svg>
        Home
      </Link>
      <Link href="/saved" className={`bn-item ${pathname === "/saved" ? "active" : ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 21s-8-5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6-8 11-8 11z" />
        </svg>
        Saved
        {count > 0 && <span className="bn-badge">{count}</span>}
      </Link>
    </nav>
  );
}
