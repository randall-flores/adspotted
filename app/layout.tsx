import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import SavedLink from "./components/SavedLink";

export const metadata: Metadata = {
  title: "Adrift — the products you scrolled past",
  description:
    "Products and brands from Instagram ads, collected so you can find them again. Browse by category, save what you like, and shop straight at the brand.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen pb-[68px] sm:pb-0">
        <header className="bg-[var(--bg)] sticky top-0 z-10">
          <div className="mx-auto max-w-7xl px-5 pt-5 pb-3 flex items-center justify-between gap-4">
            <Link
              href="/"
              className="font-display font-black text-[24px] leading-none lowercase"
            >
              adrift<span className="drift-dot">.</span>
            </Link>
            <SavedLink />
          </div>
        </header>
        {children}
        <footer className="mt-6">
          <div className="mx-auto max-w-7xl px-5 py-8 text-xs text-[var(--gray)]">
            Adrift links out to brands we spot in ads. All trademarks belong
            to their owners.
          </div>
        </footer>
        <BottomNav />
      </body>
    </html>
  );
}
