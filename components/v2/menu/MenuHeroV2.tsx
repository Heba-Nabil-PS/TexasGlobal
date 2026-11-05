"use client";

import BrandArrow from "@/components/ui/BrandArrow";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { ShootingStar, Stamp } from "@/components/v2/kit";
import { menuV2 } from "@/lib/content-v2/menu";
import { ease } from "@/lib/motion";

const AUTOPLAY_MS = 5500;

/**
 * Menu hero — full-bleed rotating banner (bone-in · Mexicana · tenders) with
 * live HTML title/CTA per slide, following the menu reference.
 */
export default function MenuHeroV2() {
  const { slides, eyebrow, cta, secondary } = menuV2.hero;
  const [index, setIndex] = useState(0);
  const hover = useRef(false);

  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const t = setInterval(() => {
      if (!hover.current) setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [slides.length]);

  const s = slides[index];
  const lead = s.tone === "light" ? "text-third" : "text-white";
  const accent = s.tone === "dark" ? "text-secondary" : s.tone === "warm" ? "text-third" : "text-primary";
  const body = s.tone === "light" ? "text-third/80" : "text-white/85";

  return (
    <section
      className="relative h-[86svh] min-h-[560px] w-full overflow-hidden bg-third md:h-[92svh]"
      onMouseEnter={() => (hover.current = true)}
      onMouseLeave={() => (hover.current = false)}
      aria-roledescription="carousel"
      aria-label="Featured menu items"
    >
      {/* Slides */}
      <AnimatePresence initial={false}>
        <motion.div
          key={s.key}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: ease.out }}
        >
          <Image
            src={s.image}
            alt={`${s.title.join(" ")}`}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover object-[72%_center] md:object-right"
          />
          {/* left legibility wash, sampled from the photo so it melts in */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, ${s.wash} 0%, ${s.wash}e6 22%, ${s.wash}80 42%, transparent 62%)`,
            }}
          />
          {/* mobile: bottom wash instead */}
          <div
            className="absolute inset-0 md:hidden"
            style={{ background: `linear-gradient(0deg, ${s.wash} 8%, ${s.wash}cc 38%, transparent 70%)` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Copy */}
      <div className="container-tx relative z-10 flex h-full flex-col justify-end pb-28 sm:pb-24 md:justify-center md:pb-0 md:pt-24">
        <span className={`eyebrow ${{ light: "text-primary", dark: "text-secondary", warm: "text-third" }[s.tone]}`}>
          <ShootingStar className="size-5" />
          {eyebrow}
        </span>

        <AnimatePresence mode="wait">
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, ease: ease.out }}
          >
            <h1 className="display mt-4 text-[15vw] leading-[0.86] sm:text-[11vw] md:text-[7vw] lg:text-[6.2vw]">
              <span className={`block ${lead}`}>{s.title[0]}</span>
              <span className={`block ${accent}`}>{s.title[1]}</span>
            </h1>
            <p className={`mt-5 max-w-md text-base leading-relaxed md:text-lg ${body}`}>{s.body}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button href={cta.href} variant="yellow" pulse>
            {cta.label}
          </Button>
          <a
            href={secondary.href}
            data-cursor="link"
            className={`text-sm font-extrabold uppercase tracking-caps underline-offset-4 hover:underline ${lead}`}
          >
            {secondary.label} <BrandArrow dir="down" />
          </a>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="container-tx flex justify-end pb-6">
          {/* Dots + arrows */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Previous slide"
              onClick={() => go(index - 1)}
              className="flex size-10 items-center justify-center rounded-full bg-white/90 text-third shadow transition-colors hover:bg-secondary"
            >
              <BrandArrow dir="left" />
            </button>
            {slides.map((sl, i) => (
              <button
                key={sl.key}
                aria-label={`Show ${sl.title.join(" ")}`}
                onClick={() => go(i)}
                className="relative h-1.5 w-10 overflow-hidden rounded-full bg-white/40"
              >
                {i === index && (
                  <motion.span
                    key={`${sl.key}-${index}`}
                    className="absolute inset-y-0 left-0 bg-secondary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                  />
                )}
              </button>
            ))}
            <button
              aria-label="Next slide"
              onClick={() => go(index + 1)}
              className="flex size-10 items-center justify-center rounded-full bg-white/90 text-third shadow transition-colors hover:bg-secondary"
            >
              <BrandArrow />
            </button>
          </div>
        </div>
      </div>

      <Stamp text="Bold Texas flavor" size={120} className="absolute right-[6%] top-32 z-20 hidden lg:block" />
    </section>
  );
}
