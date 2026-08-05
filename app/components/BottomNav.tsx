"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { savedCount, onSavedChange } from "@/lib/saved";

const TABS = [
  {
    href: "/",
    label: "Home",
    icon: <path d="M3 10l9-7 9 7v10H3z" />,
  },
  {
    href: "/explore",
    label: "Explore",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4-4" />
      </>
    ),
  },
  {
    href: "/saved",
    label: "Saved",
    icon: (
      <path d="M12 21s-8-5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6-8 11-8 11z" />
    ),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1-5 5-7 8-7s7 2 8 7" />
      </>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(savedCount());
    return onSavedChange(() => setCount(savedCount()));
  }, []);

  const activeIndex = TABS.findIndex((t) => t.href === pathname);

  return (
    <nav className="bottom-nav sm:hidden" aria-label="Main">
      <span
        className="bn-pill"
        style={{
          left: `${(activeIndex < 0 ? 0 : activeIndex) * 25 + 12.5}%`,
          opacity: activeIndex < 0 ? 0 : 1,
        }}
        aria-hidden="true"
      />
      {TABS.map((tab, i) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`bn-item ${i === activeIndex ? "active" : ""}`}
        >
          <span className="bn-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              {tab.icon}
            </svg>
          </span>
          {tab.label}
          {tab.href === "/saved" && count > 0 && (
            <span className="bn-badge">{count}</span>
          )}
        </Link>
      ))}
    </nav>
  );
}
