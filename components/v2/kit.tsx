"use client";

import BrandArrow from "@/components/ui/BrandArrow";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import BrandStar, { BRAND_STAR_VIEWBOX, BrandStarShape } from "@/components/ui/BrandStar";
import { fadeUp, inView, lineMaskParent, lineMaskChild } from "@/lib/motion";

/**
 * V2 design kit — the shared language for every redesigned section, taken from
 * the client references: white canvas, ink display type with one red accent,
 * the "shooting star" eyebrow, rotating stamps and outline stars behind food.
 * Use these instead of one-off styles so every page reads as one brand.
 */

export const V2 = {
  red: "#B12028",
  redDeep: "#9a3324",
  yellow: "#F4B118",
  ink: "#2d2926",
  orange: "#E5512A",
};

/** Section shell — consistent white canvas + vertical rhythm. */
export function Section({
  id,
  children,
  className = "",
  tone = "white",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "white" | "yellow" | "ink";
}) {
  const bg = tone === "yellow" ? "bg-secondary text-third" : tone === "ink" ? "bg-third text-white" : "bg-white text-third";
  return (
    <section id={id} className={`relative overflow-hidden py-20 md:py-28 ${bg} ${className}`}>
      {children}
    </section>
  );
}

/** The tilted "shooting star" glyph used in every reference eyebrow. */
export function ShootingStar({ className = "size-5" }: { className?: string }) {
  return (
    <BrandStar className={className} />
  );
}

export function Eyebrow({ children, onDark = false, center = false }: { children: ReactNode; onDark?: boolean; center?: boolean }) {
  return (
    <motion.span
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      className={`eyebrow ${center ? "justify-center" : ""} ${onDark ? "text-secondary" : "text-tex-red"}`}
    >
      <ShootingStar className="size-5" />
      {children}
    </motion.span>
  );
}

/**
 * Display heading. `lines` are revealed line by line; wrap a word in [brackets]
 * to paint it brand red, e.g. ["Message", "from [our CEO]"].
 */
export function Title({
  lines,
  as: Tag = "h2",
  className = "",
  onDark = false,
  size = "lg",
}: {
  lines: string[];
  as?: "h1" | "h2" | "h3";
  className?: string;
  onDark?: boolean;
  size?: "md" | "lg" | "xl";
}) {
  const sizes = {
    md: "text-4xl sm:text-5xl md:text-[3.4rem]",
    lg: "text-[11vw] sm:text-6xl md:text-[4.6rem]",
    xl: "text-[13vw] md:text-[7vw]",
  };
  return (
    <Tag className={`display mt-4 leading-[0.9] ${sizes[size]} ${onDark ? "text-white" : "text-third"} ${className}`}>
      <motion.span className="block" variants={lineMaskParent} initial="hidden" whileInView="show" viewport={inView}>
        {lines.map((l, i) => (
          <span key={i} className="line-clip">
            <motion.span variants={lineMaskChild} style={{ display: "block" }}>
              {accent(l)}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

function accent(line: string) {
  const parts = line.split(/(\[[^\]]+\])/g);
  return parts.map((p, i) =>
    p.startsWith("[") ? (
      <span key={i} className="text-primary">
        {p.slice(1, -1)}
      </span>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export function Lead({ children, className = "", onDark = false }: { children: ReactNode; className?: string; onDark?: boolean }) {
  return (
    <motion.p
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      className={`mt-5 max-w-2xl text-lg leading-relaxed md:text-xl ${onDark ? "text-white/75" : "text-third/75"} ${className}`}
    >
      {children}
    </motion.p>
  );
}

/** Round rotating stamp — red disc, white ring text, yellow star (as in the CEO / signature refs). */
export function Stamp({
  text,
  size = 110,
  className = "",
  color = "red",
  spin = true,
}: {
  text: string;
  size?: number;
  className?: string;
  color?: "red" | "yellow" | "ink";
  /** true = always spinning, "hover" = only while its parent .group is hovered */
  spin?: boolean | "hover";
}) {
  const fill = color === "yellow" ? V2.yellow : color === "ink" ? V2.ink : V2.redDeep;
  const ink = color === "yellow" ? V2.ink : "#fff";
  const starFill = color === "yellow" ? V2.redDeep : V2.yellow;
  const ring = `${text} · ${text} · `.toUpperCase();
  const id = `stamp-${text.replace(/\W/g, "")}-${size}`;
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
        <circle cx="50" cy="50" r="49" fill={fill} />
        <defs>
          <path id={id} d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
        </defs>
        <g
          className={
            spin === "hover"
              ? "origin-center animate-[spin_16s_linear_infinite] [animation-play-state:paused] group-hover:[animation-play-state:running]"
              : spin
                ? "origin-center animate-[spin_16s_linear_infinite]"
                : ""
          }
          style={{ transformBox: "fill-box" }}
        >
          <text fill={ink} fontSize="11.5" fontWeight="800" letterSpacing="1.2" fontFamily="var(--font-texas)">
            <textPath href={`#${id}`} textLength="222">
              {ring}
            </textPath>
          </text>
        </g>
        <svg x="29" y="29" width="42" height="42" viewBox={BRAND_STAR_VIEWBOX} fill={starFill}>
          <BrandStarShape />
        </svg>
      </svg>
    </div>
  );
}

/** Thin outline star — sits behind cut-out food, like the Signatures artwork. */
export function OutlineStar({ className = "", color = V2.yellow }: { className?: string; color?: string }) {
  return (
    <svg viewBox={BRAND_STAR_VIEWBOX} className={`pointer-events-none ${className}`} aria-hidden>
      <BrandStarShape fill="none" stroke={color} strokeWidth="4" />
    </svg>
  );
}

/** Prev/next + progress — the explicit "there's more, keep going" cue for sliders. */
export function SliderControls({
  index,
  count,
  onPrev,
  onNext,
  onDark = false,
  hint = "Swipe or use the arrows",
}: {
  index: number;
  count: number;
  onPrev: () => void;
  onNext: () => void;
  onDark?: boolean;
  hint?: string;
}) {
  const btn = `flex size-12 items-center justify-center rounded-full border-2 text-xl transition-colors disabled:opacity-30 ${
    onDark ? "border-white/70 text-white hover:bg-white hover:text-third" : "border-third text-third hover:bg-third hover:text-white"
  }`;
  return (
    <div className="flex items-center gap-4">
      <button aria-label="Previous" onClick={onPrev} disabled={index <= 0} className={btn} data-cursor="link">
        <BrandArrow dir="left" />
      </button>
      <div className="flex min-w-[120px] flex-col gap-1.5">
        <div className={`h-1 overflow-hidden rounded-full ${onDark ? "bg-white/20" : "bg-third/10"}`}>
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${((index + 1) / count) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <span className={`text-[11px] font-bold uppercase tracking-caps ${onDark ? "text-white/60" : "text-third/50"}`}>
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")} · {hint}
        </span>
      </div>
      <button aria-label="Next" onClick={onNext} disabled={index >= count - 1} className={btn} data-cursor="link">
        <BrandArrow />
      </button>
    </div>
  );
}
