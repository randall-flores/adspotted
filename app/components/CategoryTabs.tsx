"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/supabase";

/** Shared category tab row. Lives in the (feed) layout so it persists
 *  across tab navigations; active state derives from the pathname. */
export default function CategoryTabs() {
  const pathname = usePathname();
  const active =
    pathname.startsWith("/c/") ? decodeURIComponent(pathname.slice(3)) : null;

  return (
    <div className="tabrow -mx-5 px-5 sm:mx-0 sm:px-0 mb-5">
      <Link
        href="/"
        prefetch={true}
        className={`tab ${active === null ? "tab-active" : ""}`}
      >
        All
      </Link>
      {CATEGORIES.map((c) => (
        <Link
          key={c}
          href={`/c/${encodeURIComponent(c)}`}
          prefetch={true}
          className={`tab ${active === c ? "tab-active" : ""}`}
        >
          {c}
        </Link>
      ))}
    </div>
  );
}
