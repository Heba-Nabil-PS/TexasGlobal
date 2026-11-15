import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import HashScroll from "@/components/providers/HashScroll";
import Preloader from "@/components/ui/Preloader";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { DEFAULT_DESCRIPTION, KEYWORDS, SITE_NAME } from "@/lib/seo";

const texas = localFont({
  src: [
    { path: "../public/fonts/TexasChickenCondensed-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/TexasChickenCondensed-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/TexasChickenCondensed-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/TexasChickenCondensed-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/TexasChickenCondensed-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../public/fonts/TexasChickenCondensed-Heavy.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-texas",
  display: "swap",
});

export const metadata: Metadata = {
  // Per-page titles slot into the template; see lib/seo.ts and each route's layout.tsx.
  title: { default: "Crispy Fried Chicken, Cooked Fresh | Church's Texas Chicken™", template: `%s | ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  metadataBase: new URL("https://texaschicken.example"),
  openGraph: {
    title: "Church's Texas Chicken™ | The taste of Texas, done right",
    description: DEFAULT_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: { card: "summary_large_image", title: "Church's Texas Chicken™", description: DEFAULT_DESCRIPTION },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={texas.variable}>
      <body suppressHydrationWarning>
        <Preloader />
        <ScrollProgress />
        <SmoothScroll>
          <HashScroll />
          <Nav />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
