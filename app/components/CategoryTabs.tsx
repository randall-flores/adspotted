import Link from "next/link";
import { CATEGORIES } from "@/lib/supabase";

/** Shared category tab row. active = category name, or null for home/All. */
export default function CategoryTabs({ active }: { active: string | null }) {
  return (
    <div className="tabrow -mx-5 px-5 sm:mx-0 sm:px-0 mb-5">
      <Link href="/" className={`tab ${active === null ? "tab-active" : ""}`}>
        All
      </Link>
      {CATEGORIES.map((c) => (
        <Link
          key={c}
          href={`/c/${encodeURIComponent(c)}`}
          className={`tab ${active === c ? "tab-active" : ""}`}
        >
          {c}
        </Link>
      ))}
    </div>
  );
}
