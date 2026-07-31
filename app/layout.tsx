import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AdSpotted — the products you scrolled past",
  description:
    "Products and brands from Instagram ads, collected so you can find them again. Browse by category and shop straight at the brand.",
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
      <body className="antialiased min-h-screen">
        <header className="border-b border-[var(--line)] bg-[var(--bg)] sticky top-0 z-10">
          <div className="mx-auto max-w-7xl px-5 py-4 flex items-center justify-between gap-4">
            <Link href="/" className="font-display font-extrabold text-[22px] leading-none">
              AdSpotted<span className="text-[var(--accent)]">.</span>
            </Link>
            <p className="hidden sm:block text-[13px] text-[var(--gray)]">
              The products you scrolled past
            </p>
          </div>
        </header>
        {children}
        <footer className="border-t border-[var(--line)] mt-6">
          <div className="mx-auto max-w-7xl px-5 py-8 text-xs text-[var(--gray)]">
            AdSpotted links out to brands we spot in ads. All trademarks belong
            to their owners.
          </div>
        </footer>
      </body>
    </html>
  );
}
