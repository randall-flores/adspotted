import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppHeader from "./components/AppHeader";
import AuthSync from "./components/AuthSync";
import BottomNav from "./components/BottomNav";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://adspotted.vercel.app"),
  title: "Adrift — the products you scrolled past",
  description:
    "Products and brands from Instagram ads, collected so you can find them again. Browse by category, save what you like, and shop straight at the brand.",
  icons: {
    icon: "/icons/favicon-64.png",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    siteName: "Adrift",
    title: "Adrift — the products you scrolled past",
    description:
      "Products and brands spotted in ads, collected so you can find them again.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
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
      <body className="antialiased min-h-screen pb-[calc(68px+env(safe-area-inset-bottom))] sm:pb-0">
        <AppHeader />
        {children}
        <footer className="mt-6">
          <div className="mx-auto max-w-7xl px-5 py-8 text-xs text-[var(--gray)]">
            Adrift links out to brands we spot in ads. All trademarks belong
            to their owners.
          </div>
        </footer>
        <BottomNav />
        <AuthSync />
        <Analytics />
      </body>
    </html>
  );
}
