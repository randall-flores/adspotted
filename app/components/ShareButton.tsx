"use client";

import { useState } from "react";

export default function ShareButton({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const fullUrl = url.startsWith("http")
      ? url
      : `${window.location.origin}${url}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url: fullUrl });
      } catch {
        // user closed the share sheet
      }
    } else {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button type="button" className="share-btn" onClick={share}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-[16px] h-[16px]"
        aria-hidden="true"
      >
        <path d="M12 3v12M12 3l-4 4M12 3l4 4" />
        <path d="M5 12v8h14v-8" />
      </svg>
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
