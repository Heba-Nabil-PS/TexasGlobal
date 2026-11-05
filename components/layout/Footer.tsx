"use client";

import BrandArrow from "@/components/ui/BrandArrow";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { footer, brand } from "@/lib/content";
import type { ComponentType } from "react";

/**
 * Product-led brand band (food + rooster stamp + one CTA) on top of the link
 * columns, so every page ends on appetite instead of a dark block.
 */
/* White social-media glyphs */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
    </svg>
  );
}
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.9 2.5h3.1l-6.77 7.74L23 21.5h-6.28l-4.92-6.43-5.63 6.43H2.06l7.24-8.28L1.5 2.5h6.44l4.45 5.88L18.9 2.5zm-1.09 17.13h1.72L7.26 4.28H5.42l12.39 15.35z" />
    </svg>
  );
}
function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M23 12s0-3.62-.46-5.36a2.78 2.78 0 0 0-1.96-1.96C18.84 4.22 12 4.22 12 4.22s-6.84 0-8.58.46A2.78 2.78 0 0 0 1.46 6.64C1 8.38 1 12 1 12s0 3.62.46 5.36a2.78 2.78 0 0 0 1.96 1.96c1.74.46 8.58.46 8.58.46s6.84 0 8.58-.46a2.78 2.78 0 0 0 1.96-1.96C23 15.62 23 12 23 12zM9.75 15.32V8.68L15.5 12l-5.75 3.32z" />
    </svg>
  );
}

const socials: { label: string; href: string; Icon: ComponentType<{ className?: string }> }[] = [
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "X", href: "#", Icon: XIcon },
  { label: "YouTube", href: "#", Icon: YouTubeIcon },
];

function ColumnLinks({ links }: { links: { label: string; href: string }[] }) {
  return (
    <div className="space-y-2">
      {links.map((l) => (
        <Link
          key={l.label}
          href={l.href}
          data-cursor="link"
          className="flex w-fit font-texas text-base capitalize text-gray-300 transition-colors hover:text-white"
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}

function FollowUs() {
  return (
    <div className="flex gap-3">
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          aria-label={s.label}
          data-cursor="link"
          className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-secondary hover:bg-secondary hover:text-black"
        >
          <s.Icon className="size-[18px]" />
        </a>
      ))}
    </div>
  );
}

export default function Footer() {
  const columns = footer.columns;
  // The band is a "Find your market" prompt — pointless on that page itself.
  const showBand = usePathname() !== "/find-your-market";

  return (
    <footer className="relative bg-third text-white">
      {/* Brand band */}
      {showBand && (
        <div className="relative overflow-hidden bg-secondary text-third">
          <div className="mx-auto grid max-w-7xl items-center gap-6 px-6 py-10 md:grid-cols-[auto_1fr_auto] md:py-8 lg:px-8">
            <motion.div
              initial={{ rotate: -20, opacity: 0 }}
              whileInView={{ rotate: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative mx-auto size-28 md:mx-0 md:size-32"
            >
              <Image src="/assets/v2/stamp-bold-texas-flavor.png" alt="Bold Texas Flavor" fill sizes="128px" className="object-contain opacity-80 brightness-0" />
            </motion.div>
            <div className="text-center md:text-left">
              <p className="display text-4xl leading-[0.9] md:text-5xl">
                Bold Texas flavor.
                <br />
                <span className="text-primary">25+ markets. One crunch.</span>
              </p>
              <p className="mt-3 max-w-lg text-sm font-semibold uppercase tracking-caps text-third/70 md:text-base">
                Hand-battered since 1952 — find the one closest to you.
              </p>
            </div>
            <div className="relative flex items-center justify-center md:justify-end">
              <Link
                href="/find-your-market"
                data-cursor="link"
                className="rounded-full bg-third px-7 py-4 font-texas text-sm font-extrabold uppercase tracking-caps text-white transition-colors hover:bg-primary"
              >
                Find your market <BrandArrow />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 pb-4 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Mobile accordion */}
          <div className="space-y-2 md:hidden">
            {columns.map((col) => (
              <details key={col.title} className="group border-b border-white/10">
                <summary className="flex cursor-pointer items-center justify-between py-3">
                  <p className="font-texas text-lg font-bold capitalize text-white">{col.title}</p>
                  <BrandArrow dir="down" className="size-5 text-white transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="pb-3 ps-2">
                  <ColumnLinks links={col.links} />
                </div>
              </details>
            ))}
            <div className="py-4">
              <FollowUs />
            </div>
          </div>

          {/* Desktop grid */}
          <div className="hidden flex-wrap gap-8 pb-8 md:flex">
            {columns.map((col) => (
              <div className="min-w-[150px] flex-1" key={col.title}>
                <p className="mb-4 font-texas text-lg font-bold uppercase tracking-wide text-secondary">{col.title}</p>
                <ColumnLinks links={col.links} />
              </div>
            ))}
            <div className="min-w-[150px] flex-1">
              <p className="mb-4 font-texas text-lg font-bold uppercase tracking-wide text-secondary">Follow us</p>
              <FollowUs />
            </div>
          </div>

          <hr className="my-2 border-white/15" />

          <div className="flex flex-col items-center justify-between gap-y-4 py-3 lg:flex-row lg:gap-y-0">
            <Link href="/" className="flex items-center lg:flex-1" data-cursor="link">
              <Image src="/images/logo-dual-badge.svg" alt="Texas Chicken" width={2125} height={1023} className="h-[52px] w-auto object-contain" />
            </Link>
            <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-gray-300 lg:flex-1">
              {footer.legal.map((l, i) => (
                <div key={l.href} className="flex items-center gap-x-3">
                  {i > 0 && <span aria-hidden className="text-gray-500">|</span>}
                  <Link href={l.href} className="font-texas capitalize transition-colors hover:text-white hover:underline">
                    {l.label}
                  </Link>
                </div>
              ))}
            </nav>
            <p className="text-center text-sm text-gray-400 sm:text-end lg:flex-1">
              © {brand.since}–2026 {brand.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
