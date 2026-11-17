"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
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

const VIDEO_HOLD = 1.5; // extra scroll room so a video tray's clip plays out (≈ screens)

type Tl = { inA: number; inB: number; outA: number; outB: number; hold: number; switchAt: number; vEnd: number };

function buildTimeline(n: number) {
  const cats: Tl[] = [];
  // first tray builds while the section scrolls into view (u 0 → 1)
  let inA = 0.3;
  let inB = 1.12;
  for (let i = 0; i < n; i++) {
    const last = i === n - 1;
    const hold = crunchBuild[i].video ? VIDEO_HOLD : HOLD;
    const outA = last ? Infinity : inB + hold;
    const outB = last ? Infinity : outA + 0.62 * SWAP;
    // a video clip runs from the start of the build to just before the take-off
    const vEnd = inB + hold * 0.85;
    cats.push({ inA, inB, outA, outB, hold: last ? inB + END * 0.4 : (inB + outA) / 2, switchAt: last ? Infinity : outA + 0.5 * SWAP, vEnd });
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

/** Same breakpoint as the side-by-side stage in globals.css (.crunch-grid). null until mounted. */
function useWideStage() {
  const [wide, setWide] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px), (orientation: landscape) and (min-width: 640px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return wide;
}

export default function PickYourCrunchV2() {
  const reduce = usePrefersReducedMotion();
  const wide = useWideStage();
  if (reduce) return <StaticCrunch />;
  // Phones/portrait tablets: no scroll-scrubbing, the brand videos just play.
  // (Before mount we don't know yet; reserve roughly the player's height.)
  if (wide === null) return <section aria-hidden className="min-h-[100svh] bg-white" />;
  return wide ? <CrunchBuilder /> : <CrunchPlayer />;
}

/* ---------- phones: autoplay player ---------- */

/**
 * One compact stage instead of a ~9-screen pinned scrub: the active category's
 * brand video plays on its own while the section is on screen, then hands over
 * to the next category. The rail shows progress and switches on tap.
 */
function CrunchPlayer() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { amount: 0.35 });
  const [i, setI] = useState(0);
  const [progress, setProgress] = useState(0);
  const c = crunchBuild[i];
  const n = crunchBuild.length;

  const go = (k: number) => {
    setProgress(0);
    setI(((k % n) + n) % n);
  };

  return (
    <section ref={ref} aria-labelledby="crunch-heading" className="bg-white pb-10 pt-8 text-third">
      <h2 id="crunch-heading" className="sr-only">
        Pick your crunch: menu categories
      </h2>
      <div className="container-tx">
        {/* copy: sized to its content (1-line titles leave no gap); the video
            below glides to its new position via layout animation */}
        <div className="relative">
          {/* popLayout: the outgoing copy is lifted out of flow at once, so the
              height changes in one step (no collapse-to-zero bounce) */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col"
            >
              <span className="text-xs font-extrabold uppercase tracking-caps text-third/40">
                {two(i + 1)} / {two(n)}
              </span>
              <h3 className="display mt-1 text-[clamp(2.4rem,11vw,3.4rem)] uppercase leading-[0.86] text-primary">
                {c.title.map((t) => (
                  <span key={t} className="block">
                    {t}
                  </span>
                ))}
              </h3>
              <span aria-hidden className="mt-3 block h-1 w-24 rounded-full bg-secondary" />
              <p className="mt-2 text-base leading-snug text-third/70">{c.blurb}</p>
              <a href={c.href} data-cursor="link" className="mt-2 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-caps">
                Find it near you <span aria-hidden>→</span>
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* the brand video at its own 16:9, studio backdrop keyed out to the page white */}
        <motion.div layout transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="relative mt-2 aspect-video">
          {c.video ? (
            <KeyedVideo
              key={c.id}
              video={c.video}
              playing={visible}
              label={c.title.join(" ")}
              onProgress={setProgress}
              onEnded={() => go(i + 1)}
            />
          ) : (
            <Image src={c.combo.src} alt={c.title.join(" ")} fill sizes="90vw" className="object-contain p-4" />
          )}
        </motion.div>

        {/* rail: tap to switch; the live one fills as its video plays */}
        <motion.ol layout transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="mt-4 grid grid-cols-4 gap-2" aria-label="Menu categories">
          {crunchBuild.map((cat, k) => {
            const live = k === i;
            return (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => go(k)}
                  aria-current={live ? "step" : undefined}
                  aria-label={cat.short}
                  className={`relative flex w-full flex-col items-center gap-1.5 rounded-2xl px-1 pb-2 pt-1.5 transition-colors ${live ? "bg-primary/10" : ""}`}
                >
                  <span className={`relative block size-12 overflow-hidden rounded-full bg-white ring-2 transition-shadow ${live ? "ring-primary" : "ring-ink/10"}`}>
                    <Image src={cat.combo.src} alt="" fill sizes="48px" className="scale-[1.35] object-contain" />
                  </span>
                  <span className={`text-center text-[10px] font-extrabold uppercase leading-tight tracking-caps ${live ? "text-primary" : "text-third/60"}`}>
                    {cat.short}
                  </span>
                  <span aria-hidden className="absolute inset-x-3 bottom-0.5 h-[2px] overflow-hidden rounded-full bg-transparent">
                    <span
                      className="block h-full origin-left rounded-full bg-tex-yellow"
                      style={{ transform: `scaleX(${live ? progress : k < i ? 1 : 0})`, transition: "transform 250ms linear" }}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
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
      className="crunch-section relative bg-white text-third"
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
                {crunchBuild.map((c, i) =>
                  c.video ? <VideoTray key={c.id} video={c.video} u={u} tl={TL.cats[i]} /> : <Tray key={c.id} c={c} u={u} tl={TL.cats[i]} />,
                )}
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
      {/* paper, then the contact shadows on it, then the food back to front */}
      <Piece p={c.pieces[0]} k={0} n={c.pieces.length} u={u} tl={tl} />
      {c.pieces.slice(1).map((p, i) => (
        <ContactShadow key={p.key} p={p} k={i + 1} n={c.pieces.length} u={u} tl={tl} />
      ))}
      {c.pieces.slice(1).map((p, i) => (
        <Piece key={p.key} p={p} k={i + 1} n={c.pieces.length} u={u} tl={tl} />
      ))}
    </>
  );
}

/**
 * Fits a smooth surface a + bx + cy + dx² + exy + fy² (per channel) to the
 * empty studio backdrop in a small sample of the video's first frame. Cells
 * darker than the fit (a stray shadow already in frame) are dropped and the fit
 * repeated, so the plate is just the backdrop's light falloff.
 */
function fitBackdrop(data: Uint8ClampedArray, gw: number, gh: number) {
  const cells = gw * gh;
  const xs: number[] = [], ys: number[] = [];
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) { xs.push(i / (gw - 1) - 0.5); ys.push(j / (gh - 1) - 0.5); }
  const basis = (k: number) => [1, xs[k], ys[k], xs[k] * xs[k], xs[k] * ys[k], ys[k] * ys[k]];
  const solve = (keep: boolean[], ch: number) => {
    const A = Array.from({ length: 6 }, () => new Array(7).fill(0));
    for (let k = 0; k < cells; k++) {
      if (!keep[k]) continue;
      const b = basis(k), v = data[k * 4 + ch];
      for (let r = 0; r < 6; r++) { for (let c = 0; c < 6; c++) A[r][c] += b[r] * b[c]; A[r][6] += b[r] * v; }
    }
    for (let c = 0; c < 6; c++) { // Gauss-Jordan
      let p = c;
      for (let r = c + 1; r < 6; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      [A[c], A[p]] = [A[p], A[c]];
      const d = A[c][c] || 1e-9;
      for (let k = c; k < 7; k++) A[c][k] /= d;
      for (let r = 0; r < 6; r++) if (r !== c) { const m = A[r][c]; for (let k = c; k < 7; k++) A[r][k] -= m * A[c][k]; }
    }
    return A.map((row) => row[6]);
  };
  const lum = (k: number) => (data[k * 4] + data[k * 4 + 1] + data[k * 4 + 2]) / 3;
  let keep = new Array(cells).fill(true);
  for (let it = 0; it < 4; it++) {
    const co = [0, 1, 2].map((ch) => solve(keep, ch));
    keep = keep.map((_, k) => {
      const b = basis(k);
      const fit = co.reduce((s, c) => s + c.reduce((t, w, q) => t + w * b[q], 0), 0) / 3;
      return lum(k) > fit - 3;
    });
  }
  return [0, 1, 2].map((ch) => solve(keep, ch));
}

/**
 * A tray told by its brand video: the clip is scrubbed by scroll (inA → vEnd
 * maps to 0 → duration), so scrolling up rewinds it. Every frame is drawn to a
 * canvas and divided by the studio backdrop (colour-dodge with the inverted
 * plate), which turns the grey backdrop pure white — the food and its real
 * shadows sit straight on the page with no visible frame. It fades in as its
 * build starts and lifts away during the take-off like the cut-out trays.
 */
const PLATE_GAIN = 0.955; // < 1 pushes the near-backdrop (noise, compression) fully to white

type CrunchVideo = NonNullable<BuildCategory["video"]>;

/** From an *empty* backdrop frame on `v`: fit the studio backdrop and render (1 − gain·backdrop). */
function makePlate(v: HTMLVideoElement, video: CrunchVideo) {
  // sample the empty first frame small, fit the backdrop, render 1 − gain·backdrop full size
  const gw = 48, gh = Math.round((48 * video.h) / video.w);
  const s = document.createElement("canvas");
  s.width = gw; s.height = gh;
  const sx = s.getContext("2d", { willReadFrequently: true })!;
  sx.drawImage(v, 0, 0, gw, gh);
  const co = fitBackdrop(sx.getImageData(0, 0, gw, gh).data, gw, gh);
  const W = 212, H = Math.round((W * video.h) / video.w); // smooth surface: low res is plenty, scaled up bilinear
  const p = document.createElement("canvas");
  p.width = W; p.height = H;
  const px = p.getContext("2d")!;
  const img = px.createImageData(W, H);
  for (let j = 0; j < H; j++) {
    const y = j / (H - 1) - 0.5;
    for (let i = 0; i < W; i++) {
      const x = i / (W - 1) - 0.5;
      const b = [1, x, y, x * x, x * y, y * y];
      const o = (j * W + i) * 4;
      for (let ch = 0; ch < 3; ch++) {
        const bg = co[ch].reduce((t, w, q) => t + w * b[q], 0);
        img.data[o + ch] = 255 - Math.min(255, bg * PLATE_GAIN);
      }
      img.data[o + 3] = 255;
    }
  }
  px.putImageData(img, 0, 0);
  return p;
}

/** Draw the current video frame divided by the backdrop: grey studio → pure white page. */
function paintKeyed(c: HTMLCanvasElement | null, v: HTMLVideoElement | null, p: HTMLCanvasElement | null, video: CrunchVideo) {
  const lift = 1 - (video.shadow ?? 1); // how much of the grey shadow to wash out
  const ctx = c?.getContext("2d", { willReadFrequently: lift > 0 });
  if (!v || !c || !ctx || !p || v.readyState < 2) return;
  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(v, 0, 0, c.width, c.height);
  ctx.globalCompositeOperation = "color-dodge"; // frame / (gain × backdrop)
  ctx.drawImage(p, 0, 0, c.width, c.height);
  ctx.globalCompositeOperation = "source-over";
  if (lift > 0) {
    // lighten the cast shadows: neutral (unsaturated) mid-to-light greys move toward white;
    // colourful food, dark sauce and pure whites are left alone
    const img = ctx.getImageData(0, 0, c.width, c.height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      const mx = r > g ? (r > b ? r : b) : g > b ? g : b;
      const mn = r < g ? (r < b ? r : b) : g < b ? g : b;
      if (mx === 255 && mn === 255) continue;
      const sat = mx ? (mx - mn) / mx : 0;
      const w = clamp01((0.16 - sat) / 0.1) * clamp01(((r + g + b) / 765 - 0.3) / 0.25) * lift;
      if (w <= 0) continue;
      d[i] = r + (255 - r) * w;
      d[i + 1] = g + (255 - g) * w;
      d[i + 2] = b + (255 - b) * w;
    }
    ctx.putImageData(img, 0, 0);
  }
}


function VideoTray({ video, u, tl }: { video: NonNullable<BuildCategory["video"]>; u: MotionValue<number>; tl: Tl }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const plate = useRef<HTMLCanvasElement | null>(null);
  const target = useRef(0); // 0–1 through the clip
  const raf = useRef(0);

  const paint = () => paintKeyed(canvasRef.current, videoRef.current, plate.current, video);

  const seek = () => {
    raf.current = 0;
    const v = videoRef.current;
    if (!v || !v.duration || v.seeking || !plate.current) return; // `seeked` calls back in
    const t = target.current * Math.max(0, v.duration - 0.05);
    if (Math.abs(v.currentTime - t) > 0.012) v.currentTime = t;
  };
  const schedule = () => {
    if (!raf.current) raf.current = requestAnimationFrame(seek);
  };

  useMotionValueEvent(u, "change", (x) => {
    target.current = seg(x, tl.inA, tl.vEnd);
    schedule();
  });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let url = "";
    let cancelled = false;
    target.current = seg(u.get(), tl.inA, tl.vEnd);

    const buildPlate = () => {
      plate.current = makePlate(v, video);
    };

    const onSeeked = () => {
      if (!plate.current) {
        try {
          buildPlate();
        } catch {
          return;
        }
      }
      paint();
      schedule();
    };
    const onLoaded = () => {
      v.currentTime = 0.001; // first frame → backdrop plate
    };
    v.addEventListener("loadeddata", onLoaded);
    v.addEventListener("seeked", onSeeked);

    // pull the whole file into memory so scrubbing never waits on the network
    fetch(video.src)
      .then((r) => (r.ok ? r.blob() : Promise.reject()))
      .then((b) => {
        if (cancelled) return;
        url = URL.createObjectURL(b);
        v.src = url;
      })
      .catch(() => {
        if (!cancelled) v.src = video.src;
      });

    return () => {
      cancelled = true;
      v.removeEventListener("loadeddata", onLoaded);
      v.removeEventListener("seeked", onSeeked);
      if (raf.current) cancelAnimationFrame(raf.current);
      if (url) URL.revokeObjectURL(url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video.src]);

  const opacity = useTransform(u, (v) => seg(v, tl.inA - 0.05, tl.inA + 0.12) * (1 - (Number.isFinite(tl.outA) ? seg(v, tl.outA + 0.1, tl.outB) : 0)));
  const transform = useTransform(u, (v) => {
    const o = Number.isFinite(tl.outA) ? inCubic(seg(v, tl.outA, tl.outB)) : 0;
    return `translate3d(${(-o * 40).toFixed(2)}%, ${(-o * 6).toFixed(2)}%, 0) scale(${(1 - o * 0.15).toFixed(4)})`;
  });
  const visibility = useTransform(opacity, (o) => (o <= 0.001 ? "hidden" : "visible"));

  // soft edges as a safety net: whatever is left of the backdrop never ends in a hard line
  const edgeX = "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)";
  const edgeY = "linear-gradient(to bottom, transparent, #000 7%, #000 93%, transparent)";

  return (
    <motion.div style={{ opacity, transform, visibility }} className="absolute inset-[-14%] will-change-transform">
      <canvas
        ref={canvasRef}
        width={video.w}
        height={video.h}
        className="block h-full w-full object-contain"
        style={{
          // per-video framing so every tray reads at the same size, standing on the same line
          transform: video.scale && video.scale !== 1 ? `scale(${video.scale})` : undefined,
          transformOrigin: "50% 65%",
          maskImage: `${edgeX}, ${edgeY}`, maskComposite: "intersect", WebkitMaskImage: `${edgeX}, ${edgeY}`, WebkitMaskComposite: "source-in" }}
      />
      <video ref={videoRef} muted playsInline preload="auto" disablePictureInPicture aria-hidden className="pointer-events-none absolute left-0 top-0 h-px w-px opacity-0" />
    </motion.div>
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

/**
 * Soft shadow on the paper right under a piece's solid footprint — the dark
 * "contact" line that makes food read as resting on the sheet, not hovering.
 * Fades in as the piece lands; lifts away first when it leaves.
 */
function ContactShadow({ p, k, n, u, tl }: { p: BuildPiece; k: number; n: number; u: MotionValue<number>; tl: Tl }) {
  const strength = p.shadow ?? 0.5;
  const h = (p.w * p.ih) / p.iw;
  const [foot, l, r] = p.base;
  const sw = p.w * (r - l) * 0.96;
  const sh = Math.min(p.w * 0.1, h * 0.22);
  const cx = p.x + p.w * (l + r) * 0.5;
  const cy = p.y + h * foot - sh * 0.35; // tucked just under the base
  const opacity = useTransform(u, (v) => {
    const { e, o } = piecePhase(v, k, n, tl);
    return strength * seg(e, 0.6, 1) * (1 - seg(o, 0, 0.2));
  });
  if (strength <= 0) return null;
  return (
    <motion.div
      aria-hidden
      style={{
        left: pct(cx - sw / 2, STAGE.w),
        top: pct(cy - sh / 2 - STAGE.y0, STAGE.h),
        width: pct(sw, STAGE.w),
        height: pct(sh, STAGE.h),
        opacity,
        background: "radial-gradient(closest-side, rgba(64,36,12,0.55), rgba(64,36,12,0.22) 55%, rgba(64,36,12,0))",
      }}
      className="pointer-events-none absolute rounded-full"
    />
  );
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

/**
 * Phone player video: plays in real time (no scrubbing) and paints each frame
 * through the same backdrop key as the desktop stage, so the food sits on the
 * white page instead of in a grey box. Plays only while `playing` (on screen).
 */
function KeyedVideo({
  video,
  playing,
  label,
  onProgress,
  onEnded,
}: {
  video: CrunchVideo;
  playing: boolean;
  label: string;
  onProgress: (p: number) => void;
  onEnded: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const plate = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false); // plate built, first frame painted

  // 1) first (empty) frame → backdrop plate, then paint it
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = () => {
      v.currentTime = 0.001;
    };
    const onSeeked = () => {
      if (plate.current) return;
      try {
        plate.current = makePlate(v, video);
      } catch {
        return;
      }
      paintKeyed(canvasRef.current, v, plate.current, video);
      setReady(true);
    };
    v.addEventListener("loadeddata", onLoaded);
    v.addEventListener("seeked", onSeeked);
    if (v.readyState >= 2) onLoaded();
    return () => {
      v.removeEventListener("loadeddata", onLoaded);
      v.removeEventListener("seeked", onSeeked);
    };
  }, [video]);

  // 2) play/pause with visibility; repaint every decoded frame while playing
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !ready) return;
    if (!playing) {
      v.pause();
      return;
    }
    type RVFC = HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: () => void) => number;
      cancelVideoFrameCallback?: (h: number) => void;
    };
    const vv = v as RVFC;
    let handle = 0;
    let stopped = false;
    const tick = () => {
      if (stopped) return;
      paintKeyed(canvasRef.current, v, plate.current, video);
      if (v.duration) onProgress(v.currentTime / v.duration);
      handle = vv.requestVideoFrameCallback ? vv.requestVideoFrameCallback(tick) : requestAnimationFrame(tick);
    };
    v.play().then(tick).catch(() => {});
    return () => {
      stopped = true;
      v.pause();
      if (vv.cancelVideoFrameCallback) vv.cancelVideoFrameCallback(handle);
      else cancelAnimationFrame(handle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, ready, video]);

  // soft edges: whatever is left of the backdrop never ends in a hard line
  const edgeX = "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)";
  const edgeY = "linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent)";

  return (
    <>
      <canvas
        ref={canvasRef}
        width={720}
        height={Math.round((720 * video.h) / video.w)}
        role="img"
        aria-label={label}
        className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
        style={{
          maskImage: `${edgeX}, ${edgeY}`,
          maskComposite: "intersect",
          WebkitMaskImage: `${edgeX}, ${edgeY}`,
          WebkitMaskComposite: "source-in",
        }}
      />
      <video
        ref={videoRef}
        src={video.src}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden
        onEnded={onEnded}
        className="pointer-events-none absolute left-0 top-0 h-px w-px opacity-0"
      />
    </>
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
