"use client";

import BrandArrow from "@/components/ui/BrandArrow";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Eyebrow, Lead, Title } from "@/components/v2/kit";
import { menuV2 } from "@/lib/content-v2/menu";
import { ease } from "@/lib/motion";

type Item = (typeof menuV2.crunch.items)[number];

/** Lines the first card up with .container-tx content on any screen width. */
const GUTTER = "max(clamp(20px, 5vw, 56px), calc((100vw - 1360px) / 2 + clamp(20px, 5vw, 56px)))";

/**
 * Pick your crunch — panoramic line-up on the white canvas: orange category
 * names over cut-out combos on soft oval "plates".
 * - Desktop: pinned; vertical scroll drives the row sideways until the last
 *   card clears, then the page scrolls on (same motion as the home LTOs).
 * - Mobile: native swipe row — no scroll-jacking on touch.
 */
export default function PickYourCrunchV2() {
  return (
    <div id="pick-your-crunch">
      <MobileRow />
      <PinnedRow />
    </div>
  );
}

function Header({ aside }: { aside?: React.ReactNode }) {
  const { eyebrow, title, body } = menuV2.crunch;
  return (
    <div className="container-tx flex items-end justify-between gap-8">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Title lines={title} />
        <Lead>{body}</Lead>
      </div>
      {aside}
    </div>
  );
}

function PinnedRow() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const { items } = menuV2.crunch;

  // Travel = how far the track overflows the viewport, measured from the real width.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setTravel(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  return (
    <section
      ref={sectionRef}
      className="relative hidden bg-white text-third md:block"
      style={{ height: `calc(100svh + ${travel}px)` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-24">
        <Header aside={<ScrollProgress progress={scrollYProgress} count={items.length} />} />

        <motion.div
          ref={trackRef}
          style={{ x, paddingInline: GUTTER, willChange: "transform" }}
          className="mt-8 flex w-max gap-10"
        >
          {items.map((c, i) => (
            <Card key={c.id} c={c} i={i} className="w-[min(27vw,52vh)]" />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/** Scroll-linked progress + counter — the "keep scrolling, there's more" cue. */
function ScrollProgress({ progress, count }: { progress: MotionValue<number>; count: number }) {
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);
  const [n, setN] = useState(1);
  useEffect(() => progress.on("change", (v) => setN(Math.min(count, Math.floor(v * count) + 1))), [progress, count]);
  return (
    <div className="shrink-0 pb-2">
      <div className="flex w-56 flex-col gap-2">
        <div className="h-1 overflow-hidden rounded-full bg-third/10">
          <motion.div className="h-full rounded-full bg-primary" style={{ width }} />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-caps text-third/50">
          {String(n).padStart(2, "0")} / {String(count).padStart(2, "0")} · Keep scrolling <BrandArrow dir="down" />
        </span>
      </div>
    </div>
  );
}

function MobileRow() {
  const { items } = menuV2.crunch;
  return (
    <section className="relative overflow-hidden bg-white py-16 text-third md:hidden">
      <Header />
      <div
        style={{ paddingInline: GUTTER, scrollPaddingInline: GUTTER }}
        className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((c, i) => (
          <Card key={c.id} c={c} i={i} className="w-[76vw] snap-start sm:w-[46vw]" />
        ))}
      </div>
      <p className="container-tx text-[11px] font-bold uppercase tracking-caps text-third/50">Swipe for more <BrandArrow /></p>
    </section>
  );
}

function Card({ c, i, className }: { c: Item; i: number; className: string }) {
  return (
    <motion.a
      href="/find-your-market"
      data-cursor="link"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: ease.out, delay: Math.min(i, 3) * 0.08 }}
      className={`group relative flex shrink-0 flex-col ${className}`}
    >
      <h3 className="display text-[2.4rem] leading-[0.88] text-[#E5512A] transition-colors duration-300 group-hover:text-primary md:text-[2.9rem]">
        <span className="block">{c.title[0]}</span>
        <span className="block">{c.title[1]}</span>
      </h3>

      <div className="relative mt-2 aspect-[1667/1414] w-full">
        {/* oval plate */}
        <span className="absolute inset-x-[6%] bottom-[8%] h-[26%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(244,177,24,0.28),rgba(244,177,24,0.08)_70%,transparent)] transition-transform duration-500 group-hover:scale-x-110" />
        <Image
          src={c.image}
          alt={c.title.join(" ")}
          fill
          sizes="(max-width: 640px) 76vw, (max-width: 1024px) 46vw, 27vw"
          className="object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-[1.04]"
        />
      </div>

      <span className="mt-1 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-caps text-third/50 transition-colors group-hover:text-primary">
        {c.tag} <span aria-hidden className="transition-transform group-hover:translate-x-1"><BrandArrow /></span>
      </span>
    </motion.a>
  );
}
