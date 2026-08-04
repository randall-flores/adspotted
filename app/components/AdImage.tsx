"use client";

import { useState } from "react";

/**
 * Ad image with a graceful failure state: if the file ever 404s or the
 * network drops it, the card shows the brand name on sand instead of a
 * blank hole. Above-the-fold images load eagerly at high priority.
 */
export default function AdImage({
  src,
  alt,
  brand,
  eager = false,
}: {
  src: string;
  alt: string;
  brand: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="img-fallback" role="img" aria-label={alt}>
        <span>{brand}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
