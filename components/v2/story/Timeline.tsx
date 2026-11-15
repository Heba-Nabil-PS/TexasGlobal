"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import BrandArrow from "@/components/ui/BrandArrow";
import BrandStar from "@/components/ui/BrandStar";
import { storyPage } from "@/lib/content";
import { ease } from "@/lib/motion";

/** How long each chapter plays before advancing. */
const CHAPTER_MS = 6500;

type Chapter = (typeof storyPage.timeline)[number] & {
  place?: string;
  image?: string;
  inset?: { image: string; caption: string };
};

/**
 * Story timeline — a photo-led history sized to fit one screen (below the
 * floating nav): compact heading row → year rail (thumbnails + progress) →
 * fixed-height stage with the archive photo and the chapter copy.
 * Autoplays only while on screen; pauses on hover, on the pause button and for
 * reduced motion. Swipe, ←/→ keys and the rail all navigate.
 */
export default function Timeline() {
  const chapters = storyPage.timeline as readonly Chapter[];
  const count = chapters.length;
  const reduce = useReducedMotion();

  const rootRef = useRef<HTMLElement>(null);
  const inView = useInView(rootRef, { amount: 0.5 });

  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [hover, setHover] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  const playing = !reduce && inView && !hover && !userPaused;

  const go = useCallback(
    (to: number) => {
      const next = ((to % count) + count) % count;
      setDir(next >= index ? 1 : -1);
      setIndex(next);
    },
    [count, index]
  );

  // ←/→ when the timeline has focus
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.contains(document.activeElement)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  const c = chapters[index];

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label="Our history, 1952 to today"
      className="relative scroll-mt-40 overflow-hidden bg-cream-200 py-8 md:py-10"
    >
      {/* keyframes for the rail progress bar */}
      <style>{`@keyframes tl-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>

      <div className="container-tx" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        {/* ------------------------------------------------ compact heading row */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow text-tex-red">
              <BrandStar /> The timeline
            </span>
            <h2 className="display mt-2 text-4xl uppercase leading-[0.95] text-ink md:text-5xl">From one stand to the world.</h2>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-[11px] font-bold uppercase tracking-caps text-third/50">
              Chapter {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            {!reduce && (
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-pressed={userPaused}
                data-cursor="link"
                className="rounded-full border border-third/20 px-4 py-2 text-[11px] font-bold uppercase tracking-caps text-third transition-colors hover:bg-third hover:text-cream"
              >
                {userPaused ? "▶ Play" : "❚❚ Pause"}
              </button>
            )}
          </div>
        </div>

        {/* ------------------------------------------- year rail (above stage) */}
        <ol className="mt-5 flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] md:grid md:grid-cols-6 md:gap-3 md:overflow-visible [&::-webkit-scrollbar]:hidden">
          {chapters.map((ch, i) => {
            const active = i === index;
            const done = i < index;
            return (
              <li key={ch.year} className="w-40 shrink-0 snap-start md:w-auto">
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={active ? "step" : undefined}
                  aria-label={`${ch.year}: ${ch.title}`}
                  data-cursor="link"
                  className={`group flex w-full flex-col gap-2 rounded-xl p-1.5 text-left transition-colors ${active ? "bg-white shadow-soft3" : "hover:bg-white/60"}`}
                >
                  {/* progress line: full for past chapters, filling for the current one */}
                  <span className="relative block h-1 overflow-hidden rounded-full bg-third/10">
                    {done && <span className="absolute inset-0 bg-primary" />}
                    {active && (
                      <span
                        key={`${index}-${reduce ? "static" : "run"}`}
                        className="absolute inset-0 origin-left bg-primary"
                        style={
                          reduce
                            ? undefined
                            : {
                                animation: `tl-progress ${CHAPTER_MS}ms linear forwards`,
                                animationPlayState: playing ? "running" : "paused",
                              }
                        }
                        onAnimationEnd={() => go(index + 1)}
                      />
                    )}
                  </span>

                  <span className="flex items-center gap-2.5">
                    <span className={`relative h-10 w-14 shrink-0 overflow-hidden rounded-md ${active ? "" : "opacity-70 group-hover:opacity-100"}`}>
                      {ch.image && (
                        <Image
                          src={ch.image}
                          alt=""
                          fill
                          sizes="56px"
                          className={`object-cover transition-all duration-500 ${active ? "" : "grayscale group-hover:grayscale-0"}`}
                        />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className={`display block text-lg leading-none ${active ? "text-primary" : "text-third/60"}`}>{ch.year}</span>
                      <span className="mt-0.5 block truncate text-[11px] font-semibold text-third/50">{ch.title}</span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* ------------------------------------------------- stage (fixed height) */}
        <div className="mt-4 grid overflow-hidden rounded-[1.75rem] bg-third shadow-soft3 lg:h-[clamp(300px,calc(100svh-27rem),460px)] lg:grid-cols-[1.45fr_1fr]">
          {/* photo */}
          <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:h-full">
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={index}
                custom={dir}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: `${dir * 6}%` }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: `${dir * -6}%` }}
                transition={{ duration: 0.7, ease: ease.out }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(index + 1);
                  else if (info.offset.x > 60) go(index - 1);
                }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                {/* slow push-in while the chapter plays */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: reduce ? 1 : 1.08 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: reduce ? 0 : CHAPTER_MS / 1000 + 1, ease: "linear" }}
                >
                  {c.image && (
                    <Image
                      src={c.image}
                      alt={`${c.year}: ${c.title}`}
                      fill
                      sizes="(max-width:1024px) 100vw, 58vw"
                      priority={index === 0}
                      draggable={false}
                      className="pointer-events-none select-none object-cover"
                    />
                  )}
                </motion.div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-third/50" />
              </motion.div>
            </AnimatePresence>

            {/* inset polaroid when the archive has a second shot */}
            <AnimatePresence>
              {c.inset && (
                <motion.figure
                  key={c.inset.image}
                  initial={{ opacity: 0, rotate: 10, y: 30 }}
                  animate={{ opacity: 1, rotate: 4, y: 0 }}
                  exit={{ opacity: 0, rotate: 10, y: 20 }}
                  transition={{ duration: 0.6, ease: ease.out, delay: 0.35 }}
                  className="pointer-events-none absolute bottom-4 right-4 hidden w-28 bg-white p-1.5 pb-6 shadow-pop sm:block md:w-32"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-third">
                    <Image src={c.inset.image} alt={c.inset.caption} fill sizes="130px" className="object-cover" />
                  </div>
                  <figcaption className="absolute inset-x-1 bottom-1 text-center text-[9px] font-bold uppercase leading-tight tracking-caps text-third/70">
                    {c.inset.caption}
                  </figcaption>
                </motion.figure>
              )}
            </AnimatePresence>
          </div>

          {/* chapter copy */}
          <div className="relative flex flex-col justify-between gap-6 overflow-hidden p-6 text-cream md:p-8">
            {/* ghost year */}
            <span aria-hidden className="display pointer-events-none absolute -right-3 -top-4 select-none text-[8rem] leading-none text-white/[0.04] md:text-[10rem]">
              {c.year}
            </span>

            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: ease.out }}
                className="relative"
                aria-live="polite"
              >
                <p className="text-[11px] font-bold uppercase tracking-caps text-secondary">
                  {c.year}
                  {c.place && <span className="text-cream/50"> · {c.place}</span>}
                </p>
                <h3 className="display mt-3 text-3xl uppercase leading-[0.95] md:text-4xl">{c.title}</h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-cream/75">{c.desc}</p>
              </motion.div>
            </AnimatePresence>

            {/* controls */}
            <div className="relative flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous chapter"
                onClick={() => go(index - 1)}
                data-cursor="link"
                className="grid size-11 place-items-center rounded-full border-2 border-cream/60 text-lg text-cream transition-colors hover:bg-cream hover:text-third"
              >
                <BrandArrow dir="left" />
              </button>
              <button
                type="button"
                aria-label="Next chapter"
                onClick={() => go(index + 1)}
                data-cursor="link"
                className="grid size-11 place-items-center rounded-full bg-secondary text-lg text-third transition-colors hover:bg-cream"
              >
                <BrandArrow />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
