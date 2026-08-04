"use client";

import { useRouter } from "next/navigation";

/** Back control for detail pages — PWA standalone has no browser chrome. */
export default function BackButton() {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  return (
    <button type="button" className="back-btn" onClick={goBack} aria-label="Go back">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        aria-hidden="true"
      >
        <path d="M15 5l-7 7 7 7" />
      </svg>
      Back
    </button>
  );
}
