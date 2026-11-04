"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { ShootingStar, V2 } from "@/components/v2/kit";
import { menuV2 } from "@/lib/content-v2/menu";
import { ease, fadeUp, inView } from "@/lib/motion";

/**
 * Explore our menu — a 1:1 rebuild of the supplied artwork
 * (images/Explore our menu-01.png, 2000×723 frame). Every element sits at the
 * artwork's measured position inside a frame of the same aspect ratio, so the
 * spacing, sizes and tray placement match at any width:
 *  - words are SVG text stretched to the artwork's exact line widths
 *    (textLength); font size = cap height / 0.734 (brand font cap ratio)
 *  - the tray is an HTML layer positioned in % of the frame
 * Below md the small eyebrow + tagline would be unreadable at frame scale, so
 * they switch to regular HTML text.
 */

const CAP = 0.734;
const INK = "#2d2926";

/** Measured in artwork units (2000 × 723). */
const M = {
  eyebrow: { starX: 815, starY: 62, starW: 42, x: 866, base: 98, cap: 30, w: 267 },
  line1: { x: 133, base: 320, cap: 175, w: 1735 },
  chicken: { x: 133, base: 555, cap: 175, w: 772 },
  menu: { x: 1345, base: 555, cap: 175, w: 508 },
  // image has transparent padding (~4% left, ~9% right), so the frame is wider than
  // the visible tray: visible food spans ~877 → 1350 (touching "MENU"), bottom ~581
  tray: { x: 856, y: 227, w: 543 },
  tagline: { x: 535, base: 636, cap: 23, w: 1015 },
};

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export default function ExploreMenuV2() {
  const { eyebrow, lines, tagline, image, body, ctaPrimary, ctaSecondary } = menuV2.explore;
  const [left, right] = lines[1].split("|");

  return (
    <section className="relative overflow-hidden bg-white pb-10 pt-6 text-third md:pb-12 md:pt-10">
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
            <svg x={M.eyebrow.starX} y={M.eyebrow.starY} width={M.eyebrow.starW} height={M.eyebrow.starW * (28 / 32)} viewBox="0 0 32 28">
              <path d="M17.6 1 20 10.2l9.6.4-7.7 5.6 2.9 9.1-7.6-5.6-7.7 5.4 3-9.2L4.8 10.4l9.5-.2Z" transform="rotate(-14 16 14)" />
              <path d="M0 15.5 9 13l.6 1.8L.6 17.4Z" opacity=".9" />
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
            <Line {...M.tagline} weight={600} text={tagline} />
          </g>
        </motion.svg>

        {/* combo tray — exact artwork position, over both lines */}
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
      </div>

      <div className="container-tx flex flex-col items-center text-center">
        {/* mobile-only tagline */}
        <p className="mt-2 text-sm font-semibold uppercase text-third md:hidden">{tagline}</p>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-third/75 md:mt-6 md:text-xl"
        >
          {body}
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <Button href={ctaPrimary.href} variant="yellow">
            {ctaPrimary.label}
          </Button>
          <Button href={ctaSecondary.href} variant="ghost">
            {ctaSecondary.label} ↓
          </Button>
        </motion.div>
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
