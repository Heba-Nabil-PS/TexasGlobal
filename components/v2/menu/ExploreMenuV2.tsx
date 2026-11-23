"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BRAND_STAR_VIEWBOX, BrandStarShape } from "@/components/ui/BrandStar";
import { ShootingStar, V2 } from "@/components/v2/kit";
import { menuV2 } from "@/lib/content-v2/menu";
import { ease, inView } from "@/lib/motion";

/**
 * Explore our menu — a 1:1 rebuild of the supplied artwork
 * (images/Explore our menu-01.png, 2000×723 frame). Every element sits at the
 * artwork's measured position inside a frame of the same aspect ratio, so the
 * spacing, sizes and tray placement match at any width:
 *  - words are SVG text stretched to the artwork's exact line widths
 *    (textLength); font size = cap height / 0.734 (brand font cap ratio)
 *  - the tray is an HTML layer positioned in % of the frame
 * The category reel (PickYourCrunchV2) follows as its own section (it pins, and
 * this section clips overflow). The body copy + CTAs are hidden for now.
 * Below md the small eyebrow + tagline would be unreadable at frame scale, so
 * they switch to regular HTML text.
 */

const CAP = 0.734;
const INK = "#2d2926";

/** Measured in artwork units (2000 × 723). */
const M = {
  eyebrow: { starX: 815, starY: 62, starW: 42, x: 866, base: 98, cap: 30, w: 267 },
  // "Explore Church's Texas" is longer than the artwork's "Explore our Texas", so its
  // cap height is scaled down (17/22 chars) to keep the letter shapes from squashing
  line1: { x: 133, base: 320, cap: 135, w: 1735 },
  chicken: { x: 133, base: 555, cap: 175, w: 772 },
  menu: { x: 1345, base: 555, cap: 175, w: 508 },
  // image has transparent padding (~4% left, ~9% right), so the frame is wider than
  // the visible tray: visible food spans ~877 → 1350 (touching "MENU"), bottom ~581
  tray: { x: 856, y: 227, w: 543 },
  // the animated combo (802×520, cropped tight to the final layout): same visible
  // food span ~877 → 1350, bottom ~585
  video: { x: 873, y: 274, w: 480 },
  tagline: { x: 535, base: 636, cap: 23, w: 1015 },
  /** second tagline line, same box one line lower */
  tagline2: { x: 535, base: 676, cap: 23, w: 1015 },
};

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export default function ExploreMenuV2() {
  const { eyebrow, lines, tagline, image, video } = menuV2.explore;
  const [left, right] = lines[1].split("|");
  const [tag1, tag2] = tagline.split("|");

  return (
    <section id="pick-your-crunch" className="relative z-10 scroll-mt-24 overflow-hidden bg-white pb-0 pt-6 text-third md:pb-4 md:pt-10">
      {/* mobile-only small text */}
      <p className="eyebrow w-full justify-center text-third md:hidden">
        <ShootingStar className="size-5" /> {eyebrow}
      </p>

      <div className="relative mx-auto aspect-[2000/723] w-full max-w-[1500px]">
        <motion.svg
          viewBox="0 0 2000 723"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={`${lines[0]} ${left} ${right}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.8, ease: ease.out }}
          style={{ fontFamily: "var(--font-texas)" }}
        >
          {/* eyebrow */}
          <g className="hidden md:inline" fill={INK}>
            <svg x={M.eyebrow.starX} y={M.eyebrow.starY} width={M.eyebrow.starW} height={M.eyebrow.starW * (28 / 32)} viewBox={BRAND_STAR_VIEWBOX}>
              <BrandStarShape />
            </svg>
            <Line x={M.eyebrow.x} base={M.eyebrow.base} cap={M.eyebrow.cap} w={M.eyebrow.w} weight={700} text={eyebrow} />
          </g>

          {/* the two big lines */}
          <g fill={V2.orange}>
            <Line {...M.line1} weight={900} text={lines[0]} />
            <Line {...M.chicken} weight={900} text={left} />
            <Line {...M.menu} weight={900} text={right} />
          </g>

          {/* tagline */}
          <g className="hidden md:inline" fill={INK}>
            <Line {...M.tagline} weight={600} text={tag1} />
            {tag2 && <Line {...M.tagline2} weight={600} text={tag2} />}
          </g>
        </motion.svg>

        {/* combo tray — the meal assembles itself (transparent WebM), over both lines */}
        <ComboVideo image={image} video={video} />
      </div>

      <div className="container-tx flex flex-col items-center text-center">
        {/* mobile-only tagline */}
        <p className="mt-2 text-sm font-semibold uppercase text-third md:hidden">{tagline.replace("|", " ")}</p>

        {/* Hidden for now: body copy + "Find your market to order" / "See the signatures" buttons.
            Restore with: <motion.p variants={fadeUp} ...>{body}</motion.p> and the two <Button>s (see git history). */}
      </div>
    </section>
  );
}

/** One line of uppercase text, stretched to an exact measured width. */
function Line({ x, base, cap, w, weight, text }: { x: number; base: number; cap: number; w: number; weight: number; text: string }) {
  return (
    <text x={x} y={base} fontSize={cap / CAP} fontWeight={weight} textLength={w} lengthAdjust="spacingAndGlyphs">
      {text.toUpperCase()}
    </text>
  );
}

/**
 * The combo assembling itself: a transparent VP9 WebM that plays once when it
 * scrolls into view and holds on the final frame. Safari can't render VP9
 * alpha (it shows a black box), and reduced-motion users get the still, so
 * both fall back to the static cutout in its artwork position.
 */
function ComboVideo({ image, video }: { image: string; video: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [useVideo, setUseVideo] = useState<boolean | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    const safari = /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg|Android/.test(ua);
    const ios = /iPad|iPhone|iPod/.test(ua);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setUseVideo(!safari && !ios && !reduced);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!useVideo || !el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.play().catch(() => {});
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [useVideo]);

  if (useVideo === null) return null;

  if (useVideo) {
    return (
      <div className="absolute" style={{ left: pct(M.video.x, 2000), top: pct(M.video.y, 723), width: pct(M.video.w, 2000) }}>
        <video
          ref={ref}
          src={video}
          muted
          playsInline
          preload="auto"
          aria-label="Texas Chicken combo: chicken, fries and drink"
          className="block h-auto w-full"
          width={802}
          height={520}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.9, ease: ease.pop, delay: 0.25 }}
      className="absolute"
      style={{ left: pct(M.tray.x, 2000), top: pct(M.tray.y, 723), width: pct(M.tray.w, 2000) }}
    >
      <Image
        src={image}
        alt="Texas Chicken combo: chicken, fries and drink"
        width={1680}
        height={1096}
        sizes="(max-width: 1500px) 24vw, 360px"
        className="h-auto w-full"
      />
    </motion.div>
  );
}
