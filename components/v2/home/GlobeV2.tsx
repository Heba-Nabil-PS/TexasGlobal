"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef } from "react";
import Button from "@/components/ui/Button";
import { Eyebrow, Title, Stamp } from "@/components/v2/kit";
import { globeV2 } from "@/lib/content-v2/home";

const STEP_MS = 3600;

/**
 * Global footprint — bright, white canvas. The three globe renders cross-fade
 * with a turning motion so the globe reads as rotating (Americas → MEA/Europe →
 * Asia), and the active region + its markets are named beside it. A big
 * "25+ markets", and a co-branded CTA. No dark map, no
 * unexplained dots, and no focus on where we aren't.
 */
export default function GlobeV2() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.3 });
  const frames = globeV2.frames;

  useEffect(() => {
    if (paused || !visible) return;
    const t = setInterval(() => setI((n) => (n + 1) % frames.length), STEP_MS);
    return () => clearInterval(t);
  }, [paused, visible, frames.length]);

  const f = frames[i];

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="container-tx text-center">
        <Eyebrow center>{globeV2.eyebrow}</Eyebrow>
        <Title lines={globeV2.titleLines} size="lg" className="mx-auto max-w-4xl" />
      </div>

      <div ref={ref} className="container-tx mt-10 grid items-center gap-10 lg:mt-14 lg:grid-cols-[1fr_auto_1fr]">
        {/* Region list — doubles as legend + manual control */}
        <ul className="order-2 flex flex-col gap-3 lg:order-1" onMouseLeave={() => setPaused(false)}>
          {frames.map((fr, n) => (
            <li key={fr.region}>
              <button
                onMouseEnter={() => {
                  setPaused(true);
                  setI(n);
                }}
                onClick={() => setI(n)}
                className={`w-full rounded-2xl border-2 px-5 py-4 text-left transition-all ${
                  n === i ? "border-secondary bg-secondary/15 shadow-soft3" : "border-third/10 hover:border-third/30"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`size-3 rounded-full ${n === i ? "bg-primary" : "bg-third/20"}`} />
                  <span className="display text-2xl text-third">{fr.region}</span>
                </span>
                <span className="mt-1 block pl-6 text-sm font-semibold uppercase tracking-wide text-third/60">{fr.markets}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* The globe */}
        <div className="relative order-1 mx-auto aspect-square w-[min(80vw,520px)] lg:order-2">
          <div className="absolute inset-[6%] rounded-full bg-secondary/20 blur-3xl" />
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={f.src}
              initial={{ opacity: 0, rotate: 18, scale: 0.94 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -18, scale: 0.94 }}
              transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
              className="absolute inset-0"
            >
              <Image src={f.src} alt={`Texas Chicken markets — ${f.region}`} fill sizes="520px" className="object-contain" />
            </motion.div>
          </AnimatePresence>
          <Stamp text="25+ markets" size={110} className="absolute -right-2 bottom-4 md:-right-6" />
        </div>

        {/* Big number + CTAs */}
        <div className="order-3 text-center lg:text-left">
          <div className="display text-7xl leading-none text-secondary md:text-8xl">{globeV2.stat}</div>
          <p className="mx-auto mt-4 max-w-sm text-lg leading-relaxed text-third/75 lg:mx-0 md:text-xl">{globeV2.body}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button href={globeV2.ctaSecondary.href} variant="red" pulse>
              {globeV2.ctaSecondary.label}
            </Button>
            <Button href={globeV2.ctaPrimary.href} variant="ghost">
              {globeV2.ctaPrimary.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
