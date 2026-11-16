"use client";

import BrandArrow from "@/components/ui/BrandArrow";
import BrandStar from "@/components/ui/BrandStar";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { featured } from "@/lib/content";
import { LinesReveal } from "@/components/ui/TextReveal";
import Reveal from "@/components/ui/Reveal";

/**
 * What's new (LTOs).
 * - Mobile: a native swipe carousel (no scroll-jacking) so every card + the
 *   CTA are reachable with a thumb.
 * - Desktop: a pinned horizontal gallery driven by vertical scroll, with travel
 *   measured from the real track width so the last card always clears.
 */
export default function Featured({
  cards = featured.items.map((item) => <FeaturedCard key={item.title} item={item} />),
  note,
  endCard = <EndCard />,
}: {
  cards?: ReactNode;
  note?: string;
  /** closing tile after the cards (defaults to the red "See the full menu" square) */
  endCard?: ReactNode;
}) {
  return (
    <>
      {/* Mobile — native swipe carousel */}
      <section id="featured" className="bg-cream py-12 md:hidden">
        <Heading note={note} />
        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {cards}
          {endCard}
        </div>
      </section>

      {/* Desktop — pinned horizontal scroll */}
      <FeaturedPinned cards={cards} note={note} endCard={endCard} />
    </>
  );
}

function Heading({ note }: { note?: string }) {
  return (
    <div className="container-tx">
      <Reveal>
        <span className="eyebrow text-tex-red"><BrandStar /> {featured.eyebrow}</span>
      </Reveal>
      <h2 className="display mt-4 text-[12vw] leading-[0.88] text-ink md:text-[min(6vw,10svh)]">
        <LinesReveal lines={[featured.heading]} lineClassName="block" />
      </h2>
      {note && <p className="mt-3 text-xs font-bold uppercase tracking-caps text-third/40">{note}</p>}
    </div>
  );
}

function FeaturedPinned({ cards, note, endCard }: { cards: ReactNode; note?: string; endCard: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () =>
      // clientWidth excludes the vertical scrollbar, so the last card stops fully in view
      setTravel(Math.max(0, track.scrollWidth - document.documentElement.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // the row finishes travelling at 85% and rests on the last card for the final
  // stretch, so the section doesn't unpin the instant the end arrives; a light
  // spring smooths the hand-off from wheel/trackpad steps
  const raw = useTransform(scrollYProgress, [0, 0.85, 1], [0, -travel, -travel]);
  const x = useSpring(raw, { stiffness: 140, damping: 30, mass: 0.35 });

  return (
    <section
      ref={sectionRef}
      className="relative hidden bg-cream md:block"
      style={{ height: `calc(100svh + ${Math.round(travel / 0.85)}px)` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* heading takes what it needs; the card row fills the rest of the screen,
            so cards are always shown at full height (never cut off top or bottom) */}
        <div className="shrink-0 pt-24 md:pt-28">
          <Heading note={note} />
        </div>
        <motion.div
          ref={trackRef}
          style={{ x, willChange: "transform" }}
          className="flex min-h-0 flex-1 items-center gap-8 pb-[max(2.5rem,5svh)] pl-[5vw] pt-[max(1.5rem,3svh)]"
        >
          {cards}
          {endCard}
          {/* end padding: same 5vw gutter as the left once the row has fully scrolled */}
          <div aria-hidden className="w-[calc(5vw-2rem)] shrink-0 self-stretch" />
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedCard({ item }: { item: (typeof featured.items)[number] }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative aspect-square w-[82vw] max-w-[440px] shrink-0 snap-center overflow-hidden rounded-[28px] bg-ink shadow-pop md:h-full md:max-h-[58vh] md:w-auto md:max-w-none"
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        sizes="(max-width: 768px) 82vw, 52vh"
      />
    </motion.article>
  );
}

function EndCard() {
  return (
    <Link
      href="/menu"
      data-cursor="link"
      className="group flex aspect-square w-[82vw] max-w-[420px] shrink-0 snap-center flex-col items-center justify-center gap-5 rounded-[2rem] bg-[#94332b] shadow-soft3 text-cream md:h-full md:max-h-[58vh] md:w-auto md:max-w-none"
    >
      <span className="display text-center text-4xl leading-[0.9]">
        See the
        <br />
        full menu
      </span>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-tex-yellow text-2xl text-ink transition-transform duration-300 group-hover:scale-110">
        <BrandArrow />
      </span>
    </Link>
  );
}
