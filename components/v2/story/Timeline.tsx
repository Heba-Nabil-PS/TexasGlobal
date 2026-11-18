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
      className="relative scroll-mt-40 overflow-hidden bg-white py-12 md:py-20"
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
        <ol className="mt-8 flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] md:grid md:grid-cols-6 md:gap-3 md:overflow-visible [&::-webkit-scrollbar]:hidden">
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
                  className={`group flex w-full flex-col gap-2 rounded-xl p-1.5 text-left transition-colors ${active ? "bg-white shadow-soft3 ring-1 ring-third/5" : "hover:bg-third/[0.03]"}`}
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
        {/* Full-width archive photo; the chapter copy rides on a compact label
            that overlaps the photo (desktop) or tucks under it (mobile). */}
        <div className="relative mt-6 md:mt-8">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem] bg-third shadow-soft3 lg:aspect-auto lg:h-[clamp(340px,calc(100svh-22rem),540px)]">
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
                      sizes="(max-width:1280px) 100vw, 1280px"
                      priority={index === 0}
                      draggable={false}
                      className="pointer-events-none select-none object-cover"
                    />
                  )}
                </motion.div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-third/40 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* inset polaroid when the archive has a second shot */}
            <AnimatePresence>
              {c.inset && (
                <motion.figure
                  key={c.inset.image}
                  initial={{ opacity: 0, rotate: 10, y: -30 }}
                  animate={{ opacity: 1, rotate: 4, y: 0 }}
                  exit={{ opacity: 0, rotate: 10, y: -20 }}
                  transition={{ duration: 0.6, ease: ease.out, delay: 0.35 }}
                  className="pointer-events-none absolute right-5 top-5 hidden w-28 bg-white p-1.5 pb-6 shadow-pop sm:block md:w-36"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-third">
                    <Image src={c.inset.image} alt={c.inset.caption} fill sizes="150px" className="object-cover" />
                  </div>
                  <figcaption className="absolute inset-x-1 bottom-1 text-center text-[9px] font-bold uppercase leading-tight tracking-caps text-third/70">
                    {c.inset.caption}
                  </figcaption>
                </motion.figure>
              )}
            </AnimatePresence>

            {/* arrows sit on the photo, bottom-right */}
            <div className="absolute bottom-5 right-5 hidden items-center gap-3 lg:flex">
              <button
                type="button"
                aria-label="Previous chapter"
                onClick={() => go(index - 1)}
                data-cursor="link"
                className="grid size-11 place-items-center rounded-full border-2 border-white/80 bg-third/20 text-lg text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-third"
              >
                <BrandArrow dir="left" />
              </button>
              <button
                type="button"
                aria-label="Next chapter"
                onClick={() => go(index + 1)}
                data-cursor="link"
                className="grid size-11 place-items-center rounded-full bg-secondary text-lg text-third transition-colors hover:bg-white"
              >
                <BrandArrow />
              </button>
            </div>
          </div>

          {/* chapter label — overlaps the photo's lower-left corner on desktop */}
          <div className="relative z-10 mx-3 -mt-8 rounded-2xl bg-white p-5 shadow-pop sm:mx-6 md:p-6 lg:absolute lg:bottom-6 lg:left-6 lg:mx-0 lg:mt-0 lg:w-[min(440px,40%)]">
            <span aria-hidden className="absolute inset-y-5 left-0 w-1 rounded-r-full bg-primary md:inset-y-6" />
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: ease.out }}
                aria-live="polite"
              >
                <p className="flex items-baseline gap-2">
                  <span className="display text-2xl leading-none text-primary md:text-3xl">{c.year}</span>
                  {c.place && <span className="text-[11px] font-bold uppercase tracking-caps text-third/50">{c.place}</span>}
                </p>
                <h3 className="display mt-2 text-2xl uppercase leading-[0.95] text-ink md:text-[1.7rem]">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-third/75 md:text-[15px]">{c.desc}</p>
              </motion.div>
            </AnimatePresence>

            {/* mobile/tablet arrows live in the label */}
            <div className="mt-4 flex items-center gap-3 lg:hidden">
              <button
                type="button"
                aria-label="Previous chapter"
                onClick={() => go(index - 1)}
                className="grid size-10 place-items-center rounded-full border-2 border-third/30 text-third transition-colors hover:bg-third hover:text-white"
              >
                <BrandArrow dir="left" />
              </button>
              <button
                type="button"
                aria-label="Next chapter"
                onClick={() => go(index + 1)}
                className="grid size-10 place-items-center rounded-full bg-secondary text-third transition-colors hover:bg-third hover:text-white"
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
