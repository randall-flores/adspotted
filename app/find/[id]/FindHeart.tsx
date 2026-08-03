"use client";

import { useEffect, useState } from "react";
import { getSavedIds, toggleSaved, onSavedChange } from "@/lib/saved";

export default function FindHeart({
  adId,
  brand,
}: {
  adId: string;
  brand: string;
}) {
  const [saved, setSaved] = useState(false);
  const [splashKey, setSplashKey] = useState(0);

  useEffect(() => {
    setSaved(getSavedIds().includes(adId));
    return onSavedChange(() => setSaved(getSavedIds().includes(adId)));
  }, [adId]);

  function toggle() {
    const nowSaved = toggleSaved(adId);
    if (nowSaved) setSplashKey((k) => k + 1);
  }

  return (
    <>
      {splashKey > 0 && (
        <span className="drop-splash" key={splashKey} aria-hidden="true">
          <span className="ring" />
          <span className="ring" />
          <span className="ring" />
          <span className="drop-heart">
            <svg viewBox="0 0 24 24">
              <path d="M12 21s-8-5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6-8 11-8 11z" />
            </svg>
          </span>
        </span>
      )}
      <button
        type="button"
        className={`heart-btn ${saved ? "saved" : ""}`}
        aria-label={saved ? `Remove ${brand} from saved` : `Save ${brand}`}
        aria-pressed={saved}
        onClick={toggle}
      >
        <svg
          viewBox="0 0 24 24"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M12 21s-8-5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6-8 11-8 11z" />
        </svg>
      </button>
    </>
  );
}
