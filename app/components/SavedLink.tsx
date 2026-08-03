"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { savedCount, onSavedChange } from "@/lib/saved";

export default function SavedLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(savedCount());
    return onSavedChange(() => setCount(savedCount()));
  }, []);

  return (
    <Link
      href="/saved"
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
        <path d="M12 21s-8-5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6-8 11-8 11z" />
      </svg>
      Saved{count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
