"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useLenis } from "lenis/react";
import { STAGE, crunchBuild, type BuildCategory, type BuildPiece } from "@/lib/content-v2/crunch-build";

/**
 * Pick your crunch — a pinned, scroll-scrubbed "tray builder".
 *
 * The section pins one full-screen stage. Scroll progress drives a single
 * timeline value `u` (≈ screens scrolled); everything on the stage is a pure
 * function of `u`, so scrolling up plays the exact same motion in reverse.
 *
 * Per category:
 *  BUILD    a circle of the category's colour wipes out from the tray, the tray
 *           paper slides in, then each cut-out flies in on an arc (own
 *           direction, spin and scale), landing with a small pop, back to front;
 *           the title rises letter by letter through a mask
 *  HOLD     the finished tray floats with depth parallax
 *  TAKE-OFF pieces fly back out (front first, tray paper last, conveyor-style)
 *           while the next category's pieces are already flying in
 *
 * A category rail (the finished composite artworks) shows progress and jumps
 * to any tray. Reduced motion gets a static list of the composites.
 */

/* ---------- timeline (units ≈ viewport heights of scroll) ---------- */

const HOLD = 0.38; // finished tray stays put
const SWAP = 0.88; // one tray leaves, the next builds
const END = 0.45; // last tray holds before the page moves on

type Tl = { inA: number; inB: number; outA: number; outB: number; hold: number; switchAt: number };

function buildTimeline(n: number) {
  const cats: Tl[] = [];
  // first tray builds while the section scrolls into view (u 0 → 1)
  let inA = 0.3;
  let inB = 1.12;
  for (let i = 0; i < n; i++) {
    const last = i === n - 1;
    const outA = last ? Infinity : inB + HOLD;
    const outB = last ? Infinity : outA + 0.62 * SWAP;
    cats.push({ inA, inB, outA, outB, hold: last ? inB + END * 0.4 : (inB + outA) / 2, switchAt: last ? Infinity : outA + 0.5 * SWAP });
    if (!last) {
      inA = outA + 0.3 * SWAP;
      inB = outA + SWAP;
    }
  }
  return { cats, U: cats[n - 1].inB + END };
}

const TL = buildTimeline(crunchBuild.length);

/* ---------- easing ---------- */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const outCubic = (t: number) => 1 - (1 - t) ** 3;
const inCubic = (t: number) => t * t * t;
const outBack = (t: number, c = 1.4) => 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2;
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** 0 → 1 while building, 1 while held, → 0 while taken apart */
const life = (u: number, tl: Tl) => seg(u, tl.inA, tl.inB) * (1 - (Number.isFinite(tl.outA) ? seg(u, tl.outA, tl.outB) : 0));

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const two = (n: number) => String(n).padStart(2, "0");

/* ---------- section ---------- */

/** prefers-reduced-motion, live (framer's hook doesn't follow changes after mount) */
function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduce;
}

export default function PickYourCrunchV2() {
  const reduce = usePrefersReducedMotion();
  return reduce ? <StaticCrunch /> : <CrunchBuilder />;
}

function CrunchBuilder() {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const u = useTransform(scrollYProgress, (p) => p * TL.U);

  // the only React state: which category is "live" (for links / a11y / rail)
  const [active, setActive] = useState(0);
  useMotionValueEvent(u, "change", (v) => {
    const i = TL.cats.findIndex((c) => v < c.switchAt);
    const next = i === -1 ? crunchBuild.length - 1 : i;
    setActive((a) => (a === next ? a : next));
  });

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top - window.innerHeight + (TL.cats[i].hold / TL.U) * el.offsetHeight;
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      aria-labelledby="crunch-heading"
      className="relative bg-white text-third"
      style={{ height: `${TL.U * 100}svh` }}
    >
      <h2 id="crunch-heading" className="sr-only">
        Pick your crunch: menu categories
      </h2>

      <div className="sticky top-0 h-[100svh] crunch-stage overflow-hidden">
        {/* colour wipes, one per category, stacked in order */}
        {crunchBuild.map((c, i) => (
          <Wipe key={c.id} u={u} tl={TL.cats[i]} color={c.bg} />
        ))}

        {/* ghost numbers rolling like an odometer */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {crunchBuild.map((c, i) => (
            <GhostNumber key={c.id} u={u} tl={TL.cats[i]} n={i + 1} light={c.ink === "light"} />
          ))}
        </div>

        {/* content area between the fixed nav and the rail */}
        <div className="crunch-area absolute inset-x-0">
          <div className="crunch-grid container-tx grid h-full">
            {/* copy */}
            <div className="crunch-copy relative">
              {crunchBuild.map((c, i) => (
                <CategoryCopy key={c.id} c={c} i={i} u={u} tl={TL.cats[i]} live={active === i} />
              ))}
            </div>

            {/* food stage */}
            <div className="relative flex items-center justify-center">
              <div
                aria-hidden
                className="crunch-food relative aspect-[800/530]"
              >
                {crunchBuild.map((c, i) => (
                  <Tray key={c.id} c={c} u={u} tl={TL.cats[i]} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <Rail u={u} active={active} onJump={jump} />
      </div>
    </section>
  );
}

/* ---------- background ---------- */

function Wipe({ u, tl, color }: { u: MotionValue<number>; tl: Tl; color: [string, string] }) {
  const clipPath = useTransform(u, (v) => `circle(${inOut(seg(v, tl.inA - 0.08, tl.inB)) * 150}% at var(--cx) var(--cy))`);
  return <motion.div aria-hidden style={{ clipPath, background: `radial-gradient(120% 95% at var(--cx) var(--cy), ${color[0]} 0%, ${color[0]} 22%, ${color[1]} 100%)` }} className="absolute inset-0" />;
}

function GhostNumber({ u, tl, n, light }: { u: MotionValue<number>; tl: Tl; n: number; light: boolean }) {
  const transform = useTransform(u, (v) => {
    const i = outCubic(seg(v, tl.inA + 0.2, tl.inB));
    const o = Number.isFinite(tl.outA) ? inCubic(seg(v, tl.outA, tl.outB)) : 0;
    return `translate3d(0, ${(1 - i) * 70 - o * 70}%, 0)`;
  });
  const opacity = useTransform(u, (v) => life(v, tl));
  return (
    <motion.span
      style={{ transform, opacity }}
      className={`display absolute right-[2%] top-[18%] select-none text-[clamp(11rem,30vw,28rem)] leading-none text-transparent md:right-[6%] md:top-[12%] ${
        light ? "[-webkit-text-stroke:2px_rgba(255,255,255,0.09)]" : "[-webkit-text-stroke:2px_rgba(45,41,38,0.07)]"
      }`}
    >
      {two(n)}
    </motion.span>
  );
}

/* ---------- the tray ---------- */

function Tray({ c, u, tl }: { c: BuildCategory; u: MotionValue<number>; tl: Tl }) {
  const glowOpacity = useTransform(u, (v) => life(v, tl) * 0.85);
  const glowScale = useTransform(u, (v) => 0.55 + 0.45 * life(v, tl));
  return (
    <>
      <motion.div
        style={{ opacity: glowOpacity, scale: glowScale, background: `radial-gradient(closest-side, ${c.glow}, transparent)` }}
        className="absolute inset-[-12%] rounded-full blur-2xl"
      />
      {/* back to front; the cut-outs carry their own shadows */}
      {c.pieces.map((p, k) => (
        <Piece key={p.key} p={p} k={k} n={c.pieces.length} u={u} tl={tl} />
      ))}
    </>
  );
}

/** build (e) and take-apart (o) progress of one piece */
function piecePhase(v: number, k: number, n: number, tl: Tl) {
  // build: back-to-front stagger
  const span = tl.inB - tl.inA;
  const L = n > 1 ? span * 0.5 : span * 0.8;
  const a = tl.inA + (n > 1 ? (k * (span - L)) / (n - 1) : span * 0.2);
  const e = seg(v, a, a + L);

  // take apart: front-to-back (the tray paper leaves last)
  let o = 0;
  if (Number.isFinite(tl.outA)) {
    const ospan = tl.outB - tl.outA;
    const Lo = n > 1 ? ospan * 0.55 : ospan;
    const b = tl.outA + (n > 1 ? ((n - 1 - k) * (ospan - Lo)) / (n - 1) : 0);
    o = inCubic(seg(v, b, b + Lo));
  }
  return { e, o };
}

function pieceMotion(v: number, p: BuildPiece, k: number, n: number, tl: Tl) {
  const { e, o } = piecePhase(v, k, n, tl);
  // once landed (e = 1) every piece is locked to the paper: no drift, no float
  const dx = p.from.dx * (1 - outCubic(e)) + p.to.dx * o;
  const dy = p.from.dy * (1 - outBack(e, 1.1)) + p.to.dy * o;
  const r = p.from.r * (1 - outCubic(e)) + p.to.r * o;
  const s = (p.from.s + (1 - p.from.s) * outBack(e, 1.7)) * (1 + (p.to.s - 1) * o);
  const opacity = seg(e, 0, 0.12) * (1 - seg(o, 0.45, 1));
  return { dx, dy, r, s, opacity };
}
function Piece({ p, k, n, u, tl }: { p: BuildPiece; k: number; n: number; u: MotionValue<number>; tl: Tl }) {
  const h = (p.w * p.ih) / p.iw; // artwork px
  // stage-relative offsets → % of the piece's own box (so no measuring)
  const kx = (100 * STAGE.w) / p.w;
  const ky = (100 * STAGE.h) / h;

  const transform = useTransform(u, (v) => {
    const m = pieceMotion(v, p, k, n, tl);
    return `translate3d(${(m.dx * kx).toFixed(2)}%, ${(m.dy * ky).toFixed(2)}%, 0) rotate(${m.r.toFixed(2)}deg) scale(${m.s.toFixed(4)})`;
  });
  const opacity = useTransform(u, (v) => pieceMotion(v, p, k, n, tl).opacity);
  const visibility = useTransform(opacity, (o) => (o <= 0.001 ? "hidden" : "visible"));

  return (
    <motion.div
      style={{
        left: pct(p.x, STAGE.w),
        top: pct(p.y - STAGE.y0, STAGE.h),
        width: pct(p.w, STAGE.w),
        transform,
        opacity,
        visibility,
      }}
      className="absolute will-change-transform"
    >
      <Image
        src={p.src}
        alt=""
        width={p.iw}
        height={p.ih}
        sizes={`(max-width: 768px) ${Math.ceil((94 * p.w) / STAGE.w)}vw, ${Math.ceil((56 * p.w) / STAGE.w)}vw`}
        className="block h-auto w-full select-none"
        draggable={false}
      />
    </motion.div>
  );
}

/* ---------- copy ---------- */

function CategoryCopy({ c, i, u, tl, live }: { c: BuildCategory; i: number; u: MotionValue<number>; tl: Tl; live: boolean }) {
  const light = c.ink === "light";
  const chars = c.title.join("").length;
  let offset = 0;

  const span = tl.inB - tl.inA;
  const metaOpacity = useTransform(u, (v) => seg(v, tl.inA + 0.35 * span, tl.inB) * (1 - (Number.isFinite(tl.outA) ? seg(v, tl.outA, tl.outA + 0.25 * SWAP) : 0)));
  const restT = useTransform(u, (v) => {
    const i_ = outCubic(seg(v, tl.inB - 0.3 * span, tl.inB + 0.05));
    const o = Number.isFinite(tl.outA) ? inCubic(seg(v, tl.outA, tl.outA + 0.3 * SWAP)) : 0;
    return `translate3d(0, ${(1 - i_) * 28 - o * 24}px, 0)`;
  });
  const restOpacity = useTransform(u, (v) => seg(v, tl.inB - 0.3 * span, tl.inB + 0.05) * (1 - (Number.isFinite(tl.outA) ? seg(v, tl.outA, tl.outA + 0.25 * SWAP) : 0)));
  const line = useTransform(u, (v) => outCubic(seg(v, tl.inB - 0.35 * span, tl.inB + 0.05)) * (1 - (Number.isFinite(tl.outA) ? seg(v, tl.outA, tl.outA + 0.3 * SWAP) : 0)));

  return (
    <div
      aria-hidden={!live}
      inert={!live}
      className="crunch-layer absolute inset-0 flex flex-col"
    >
      <motion.span
        style={{ opacity: metaOpacity }}
        className={`text-xs font-extrabold uppercase tracking-caps md:text-sm ${light ? "text-white/50" : "text-third/40"}`}
      >
        {two(i + 1)} / {two(crunchBuild.length)}
      </motion.span>

      <h3
        className={`crunch-title display mt-1 uppercase leading-[0.86] md:mt-2 ${
          light ? "text-secondary" : "text-primary"
        }`}
      >
        <a href={c.href} tabIndex={live ? 0 : -1} data-cursor="link" className="block">
          {c.title.map((t) => {
            const start = offset;
            offset += t.length;
            return (
              <span key={t} className="block overflow-hidden pb-[0.04em] pt-[0.1em] -mt-[0.1em]">
                {[...t].map((ch, j) => (
                  <Char key={j} ch={ch} j={start + j} m={chars} u={u} tl={tl} />
                ))}
              </span>
            );
          })}
        </a>
      </h3>

      <motion.span aria-hidden style={{ scaleX: line }} className="mt-3 block h-1 w-28 shrink-0 origin-left rounded-full bg-secondary md:mt-5 md:w-40" />

      <motion.div style={{ transform: restT, opacity: restOpacity }}>
        <p className={`crunch-blurb mt-2 max-w-sm text-base leading-snug md:mt-4 md:text-lg md:leading-relaxed ${light ? "text-white/75" : "text-third/70"}`}>{c.blurb}</p>
        <a
          href={c.href}
          tabIndex={live ? 0 : -1}
          data-cursor="link"
          className={`group mt-2 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-caps transition-colors md:mt-5 ${
            light ? "text-white hover:text-secondary" : "text-third hover:text-primary"
          }`}
        >
          Find it near you
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
      </motion.div>
    </div>
  );
}

function Char({ ch, j, m, u, tl }: { ch: string; j: number; m: number; u: MotionValue<number>; tl: Tl }) {
  const transform = useTransform(u, (v) => {
    const span = tl.inB - tl.inA;
    const tIn = seg(v, tl.inA + 0.3 * span, tl.inB);
    const st = (j / Math.max(1, m - 1)) * 0.45;
    const ci = outCubic(seg(tIn, st, st + 0.55));
    let co = 0;
    if (Number.isFinite(tl.outA)) {
      const tOut = seg(v, tl.outA, tl.outA + 0.45 * SWAP);
      const so = (j / Math.max(1, m - 1)) * 0.4;
      co = inCubic(seg(tOut, so, so + 0.6));
    }
    return `translate3d(0, ${((1 - ci) * 118 - co * 118).toFixed(2)}%, 0) rotate(${((1 - ci) * 14 - co * 10).toFixed(2)}deg)`;
  });
  return (
    <motion.span style={{ transform }} className="inline-block origin-bottom-left will-change-transform">
      {ch === " " ? " " : ch}
    </motion.span>
  );
}

/* ---------- category rail ---------- */

function Rail({ u, active, onJump }: { u: MotionValue<number>; active: number; onJump: (i: number) => void }) {
  return (
    <nav aria-label="Menu categories" className="absolute inset-x-0 bottom-3 z-10 flex justify-center px-3 md:bottom-6">
      {/* same pill bar as the Franchising tabs */}
      <ol className="flex gap-1 rounded-full border border-ink/10 bg-paper/90 p-1.5 shadow-soft3 backdrop-blur-md md:gap-2 md:p-2">
        {crunchBuild.map((c, i) => (
          <li key={c.id}>
            <RailButton c={c} i={i} u={u} live={active === i} onJump={onJump} />
          </li>
        ))}
      </ol>
    </nav>
  );
}

function RailButton({ c, i, u, live, onJump }: { c: BuildCategory; i: number; u: MotionValue<number>; live: boolean; onJump: (i: number) => void }) {
  const tl = TL.cats[i];
  const fill = useTransform(u, (v) => (v < tl.inA ? 0 : v >= tl.switchAt ? 1 : seg(v, tl.inA, Math.min(tl.switchAt, TL.U))));
  return (
    <button
      type="button"
      onClick={() => onJump(i)}
      aria-current={live ? "step" : undefined}
      data-cursor="link"
      className={`group relative flex items-center gap-3 rounded-full p-1 text-left transition-colors duration-300 md:py-1.5 md:pl-1.5 md:pr-6 ${
        live ? "" : "hover:bg-ink/5"
      }`}
    >
      {live && (
        <motion.span
          aria-hidden
          layoutId="crunch-rail-pill"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="absolute inset-0 overflow-hidden rounded-full bg-tex-red"
        >
          {/* progress through this category */}
          <motion.span style={{ scaleX: fill }} className="absolute inset-x-6 bottom-1 h-[2px] origin-left rounded-full bg-tex-yellow" />
        </motion.span>
      )}
      <span
        className={`relative block size-10 shrink-0 overflow-hidden rounded-full bg-white ring-2 transition-[box-shadow] duration-300 md:size-11 ${
          live ? "ring-tex-yellow" : "ring-ink/10"
        }`}
      >
        <Image src={c.combo.src} alt="" fill sizes="44px" className="scale-[1.35] object-contain" />
      </span>
      <span className="relative hidden md:block">
        <span className={`block whitespace-nowrap text-sm font-extrabold uppercase tracking-caps ${live ? "text-cream" : "text-ink"}`}>{c.short}</span>
        <span className={`block whitespace-nowrap text-[0.68rem] font-semibold ${live ? "text-cream/70" : "text-ink-400"}`}>{c.sub}</span>
      </span>
      <span className="sr-only md:hidden">{c.short}</span>
    </button>
  );
}

/* ---------- reduced motion ---------- */

function StaticCrunch() {
  return (
    <section aria-labelledby="crunch-heading" className="bg-white pb-16 text-third">
      <h2 id="crunch-heading" className="sr-only">
        Pick your crunch: menu categories
      </h2>
      <ol className="container-tx grid gap-12 md:grid-cols-2">
        {crunchBuild.map((c, i) => (
          <li key={c.id}>
            <a href={c.href} className="group block">
              <Image src={c.combo.src} alt={c.title.join(" ")} width={c.combo.iw} height={c.combo.ih} sizes="(max-width: 768px) 90vw, 45vw" className="h-auto w-full" />
              <span className="mt-4 block text-sm font-extrabold uppercase tracking-caps text-third/40">
                {two(i + 1)} / {two(crunchBuild.length)}
              </span>
              <h3 className="display mt-1 text-5xl uppercase leading-[0.86] text-primary">{c.title.join(" ")}</h3>
              <p className="mt-3 max-w-sm text-lg text-third/70">{c.blurb}</p>
              <span className="mt-3 inline-block text-sm font-extrabold uppercase tracking-caps group-hover:text-primary">Find it near you</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
