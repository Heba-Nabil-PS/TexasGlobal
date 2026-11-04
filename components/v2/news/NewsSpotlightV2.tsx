"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { newsPage } from "@/lib/content";
import { newsV2 } from "@/lib/content-v2/news";
import { Eyebrow, SliderControls, Title } from "@/components/v2/kit";

type Slide = { title: string; excerpt: string; image: string; badge: string; date: string; href: string };

/** Lines the first card up with .container-tx content on any screen width. */
const GUTTER = "max(clamp(20px, 5vw, 56px), calc((100vw - 1360px) / 2 + clamp(20px, 5vw, 56px)))";

function useSlides(): Slide[] {
  const f = newsPage.featured;
  return [
    { title: f.title, excerpt: f.excerpt, image: f.image, badge: f.tag, date: f.date, href: f.href },
    ...newsPage.articles.slice(0, newsV2.spotlight.count - 1).map((a) => ({
      title: a.title,
      excerpt: a.excerpt,
      image: a.image,
      badge: a.category,
      date: a.date,
      href: a.href,
    })),
  ];
}

/**
 * Spotlight, ported from the informative site's "What's new with Texas
 * Chicken™" block: a big photo with a red info box hanging off its bottom edge
 * that wipes to yellow on hover.
 * - Desktop: pinned; vertical scroll drives the row sideways until the last
 *   story clears, then the page scrolls on.
 * - Mobile: swipe / arrow carousel — no scroll-jacking on touch.
 */
export default function NewsSpotlightV2() {
  const slides = useSlides();
  return (
    <>
      <MobileCarousel slides={slides} />
      <PinnedRow slides={slides} />
    </>
  );
}

function Header({ aside }: { aside?: React.ReactNode }) {
  return (
    <div className="container-tx flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <Eyebrow>{newsV2.spotlight.eyebrow}</Eyebrow>
        <Title lines={newsV2.spotlight.heading} size="md" />
      </div>
      {aside}
    </div>
  );
}

function PinnedRow({ slides }: { slides: Slide[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);

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
    <section ref={sectionRef} className="relative hidden bg-white md:block" style={{ height: `calc(100svh + ${travel}px)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-24">
        <Header aside={<ScrollProgress progress={scrollYProgress} count={slides.length} />} />
        <motion.div ref={trackRef} style={{ x, paddingInline: GUTTER, willChange: "transform" }} className="mt-10 flex w-max gap-8">
          {slides.map((s, k) => (
            <SpotlightCard key={s.href + k} slide={s} className="w-[min(680px,52vw)]" imageClass="h-[min(400px,40vh)]" />
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
          {String(n).padStart(2, "0")} / {String(count).padStart(2, "0")} · Keep scrolling ↓
        </span>
      </div>
    </div>
  );
}

function MobileCarousel({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const go = (n: number) => setI(Math.max(0, Math.min(slides.length - 1, n)));
  const startX = useRef<number | null>(null);

  return (
    <section className="relative overflow-hidden bg-white pb-24 pt-10 md:hidden">
      <Header aside={<SliderControls index={i} count={slides.length} onPrev={() => go(i - 1)} onNext={() => go(i + 1)} />} />
      <div className="container-tx mt-12">
        <div
          onPointerDown={(e) => (startX.current = e.clientX)}
          onPointerUp={(e) => {
            if (startX.current === null) return;
            const dx = e.clientX - startX.current;
            startX.current = null;
            if (dx < -60) go(i + 1);
            else if (dx > 60) go(i - 1);
          }}
          style={{
            transform: `translateX(calc(${-i} * (86vw + 24px)))`,
            transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          className="flex touch-pan-y gap-6"
        >
          {slides.map((s, k) => (
            <SpotlightCard
              key={s.href + k}
              slide={s}
              className={`w-[86vw] transition-opacity duration-500 ${k === i ? "opacity-100" : "opacity-50"}`}
              imageClass="h-[300px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SpotlightCard({ slide, className, imageClass }: { slide: Slide; className: string; imageClass: string }) {
  const internal = slide.href.startsWith("/");
  const Wrapper = internal ? Link : "a";
  return (
    <Wrapper
      href={slide.href}
      {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      data-cursor="view"
      draggable={false}
      className={`group block shrink-0 ${className}`}
    >
      <div className={`relative mb-24 w-full ${imageClass}`}>
        <div className="absolute inset-0 overflow-hidden rounded-sm">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            draggable={false}
            sizes="(max-width: 768px) 86vw, 680px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <span className="absolute right-6 top-6 z-20 rounded-full bg-[#c0392b] px-6 py-2 text-xs font-bold uppercase tracking-wider text-white">
          {slide.badge}
        </span>

        {/* Overlay info box — red, wipes to yellow on hover */}
        <div className="absolute -bottom-20 left-0 z-10 w-[88%] md:w-3/4">
          <div className="relative overflow-hidden bg-primary px-7 py-6 shadow-lg md:px-10 md:py-8">
            <div className="absolute inset-0 z-0 translate-x-full bg-secondary transition-transform duration-500 group-hover:translate-x-0" />
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-caps text-white/70 transition-colors group-hover:text-third/70">
                {slide.date}
              </span>
              <h3 className="mt-2 line-clamp-2 font-texas text-2xl font-extrabold uppercase leading-tight text-white transition-colors group-hover:text-third md:text-3xl">
                {slide.title}
              </h3>
              <p className="mt-3 line-clamp-2 text-base text-white/85 transition-colors group-hover:text-third/80 md:w-[85%]">
                {slide.excerpt}
              </p>
            </div>
            <svg
              viewBox="0 0 490.661 490.661"
              aria-hidden
              className="absolute bottom-5 right-5 z-10 size-8 fill-secondary transition-colors group-hover:fill-white"
            >
              <path d="M453.352 236.091 48.019 1.424c-3.285-1.899-7.36-1.899-10.688 0a10.681 10.681 0 0 0-5.333 9.237v469.333c0 3.819 2.048 7.339 5.333 9.237a10.802 10.802 0 0 0 5.333 1.429c1.856 0 3.691-.469 5.355-1.429l405.333-234.667c3.285-1.92 5.312-5.44 5.312-9.237s-2.027-7.338-5.312-9.236z" />
            </svg>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
