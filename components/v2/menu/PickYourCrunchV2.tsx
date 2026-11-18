"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useTransform, type MotionValue, type Variants } from "framer-motion";
import { useLenis } from "lenis/react";
import { crunchBuild, type BuildCategory } from "@/lib/content-v2/crunch-build";

/**
 * Pick your crunch — the menu categories, one stage per category.
 *
 * Desktop / landscape ("wide"): a short pinned stage. Scroll only *chooses* the
 * category (about two-thirds of a screen each); everything else runs on its own
 * clock, so it reacts instantly instead of being dragged frame by frame:
 *  - the category's brand video plays in real time (food drops onto the tray)
 *    and holds on the finished tray
 *  - the outgoing tray slides away, the next one slides in; the title rises
 *    letter by letter
 *  - a "next" button on the rail moves on; the rail jumps to any category
 * Phones / portrait tablets: a compact autoplay player (no pinning).
 * Reduced motion: a static list of the finished composites.
 */

/** screens of scroll per category on the pinned stage */
const STEP = 0.65;
/** brand clips play a little faster than shot */
const PLAYBACK_RATE = 1.5;

const ease = [0.22, 1, 0.36, 1] as const;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
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

/* ---------- desktop: pinned stage, scroll picks the category ---------- */

function CrunchBuilder() {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const n = crunchBuild.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // load the clips a screen before the section arrives; play only while it's on screen
  const near = useInView(ref, { once: true, margin: "100% 0px 100% 0px" });
  const stageRef = useRef<HTMLDivElement>(null);
  const onScreen = useInView(stageRef, { amount: 0.5 });

  const [active, setActive] = useState(0);
  const [done, setDone] = useState(false); // the live clip has finished: nudge the "next" button
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(n - 1, Math.max(0, Math.floor(p * n)));
    setActive((a) => (a === next ? a : next));
  });
  useEffect(() => setDone(!crunchBuild[active].video), [active]);

  const scrollTo = (y: number) => {
    if (lenis) lenis.scrollTo(y, { duration: 0.9 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };
  /** scroll to category i (k = n: just past the stage) */
  const jump = (k: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    scrollTo(k >= n ? top + el.offsetHeight - window.innerHeight * 0.25 : top + ((k + 0.1) / n) * range);
  };

  const c = crunchBuild[active];

  return (
    <section
      ref={ref}
      aria-labelledby="crunch-heading"
      className="crunch-section relative bg-white text-third"
      style={{ height: `${100 + n * STEP * 100}svh` }}
    >
      <h2 id="crunch-heading" className="sr-only">
        Pick your crunch: menu categories
      </h2>

      <div ref={stageRef} className="crunch-stage sticky top-0 h-[100svh] overflow-hidden">
        {/* content area between the fixed nav and the rail */}
        <div className="crunch-area absolute inset-x-0">
          <div className="crunch-grid container-tx grid h-full">
            {/* copy */}
            <div className="crunch-copy relative">
              <AnimatePresence initial={false}>
                <CategoryCopy key={c.id} c={c} i={active} />
              </AnimatePresence>
            </div>

            {/* food stage: the live tray in front, the others parked left (done) / right (next) */}
            <div className="relative flex items-center justify-center">
              <div aria-hidden className="crunch-food relative aspect-[800/530]">
                {crunchBuild.map((cat, k) => {
                  const live = k === active;
                  return (
                    <motion.div
                      key={cat.id}
                      initial={false}
                      animate={live ? { opacity: 1, x: "0%", scale: 1 } : { opacity: 0, x: k < active ? "-28%" : "28%", scale: 0.9 }}
                      transition={{ duration: live ? 0.7 : 0.5, ease, delay: live ? 0.12 : 0 }}
                      className={`absolute inset-[-14%] ${live ? "" : "pointer-events-none"}`}
                    >
                      {cat.video ? (
                        near && (
                          <KeyedVideo
                            video={cat.video}
                            playing={live && onScreen}
                            restart
                            width={1024}
                            label={cat.title.join(" ")}
                            onEnded={() => live && setDone(true)}
                          />
                        )
                      ) : (
                        <Image src={cat.combo.src} alt="" fill sizes="56vw" className="object-contain p-[12%]" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <Rail progress={scrollYProgress} active={active} done={done} onJump={jump} />
      </div>
    </section>
  );
}

/* ---------- copy ---------- */

const copyV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.02 } },
  exit: { transition: { staggerChildren: 0.008 } },
};
const charV: Variants = {
  hidden: { y: "115%", rotate: 12 },
  show: { y: "0%", rotate: 0, transition: { duration: 0.55, ease } },
  exit: { y: "-115%", rotate: -8, transition: { duration: 0.3, ease: [0.55, 0, 0.75, 0.2] } },
};
const fadeV: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease, delay: 0.25 } },
  exit: { opacity: 0, y: -14, transition: { duration: 0.2 } },
};
const lineV: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.6, ease, delay: 0.2 } },
  exit: { scaleX: 0, transition: { duration: 0.2 } },
};

function CategoryCopy({ c, i }: { c: BuildCategory; i: number }) {
  const light = c.ink === "light";
  return (
    <motion.div variants={copyV} initial="hidden" animate="show" exit="exit" className="crunch-layer absolute inset-0 flex flex-col">
      <motion.span variants={fadeV} className={`text-xs font-extrabold uppercase tracking-caps md:text-sm ${light ? "text-white/50" : "text-third/40"}`}>
        {two(i + 1)} / {two(crunchBuild.length)}
      </motion.span>

      <h3 className={`crunch-title display mt-1 uppercase leading-[0.86] md:mt-2 ${light ? "text-secondary" : "text-primary"}`}>
        <a href={c.href} data-cursor="link" className="block" aria-label={c.title.join(" ")}>
          {c.title.map((t) => (
            <motion.span key={t} variants={copyV} className="-mt-[0.1em] block overflow-hidden pb-[0.04em] pt-[0.1em]" aria-hidden>
              {[...t].map((ch, j) => (
                <motion.span key={j} variants={charV} className="inline-block origin-bottom-left">
                  {ch === " " ? " " : ch}
                </motion.span>
              ))}
            </motion.span>
          ))}
        </a>
      </h3>

      <motion.span aria-hidden variants={lineV} className="mt-3 block h-1 w-28 shrink-0 origin-left rounded-full bg-secondary md:mt-5 md:w-40" />

      <motion.div variants={fadeV}>
        <p className={`crunch-blurb mt-2 max-w-sm text-base leading-snug md:mt-4 md:text-lg md:leading-relaxed ${light ? "text-white/75" : "text-third/70"}`}>{c.blurb}</p>
        <a
          href={c.href}
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
    </motion.div>
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
 * Backdrop key: every video frame is drawn to a canvas and divided by the
 * studio backdrop (colour-dodge with the inverted plate), which turns the grey
 * backdrop pure white — the food and its real shadows sit straight on the page
 * with no visible frame.
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


/**
 * A brand video played in real time (never scrubbed — that's what made the
 * stage lag) and painted each frame through the backdrop key, so the food sits
 * on the white page instead of in a grey box. Plays only while `playing`;
 * with `restart` it starts from the top each time it becomes live, and it
 * holds on the finished tray when the clip ends.
 */
function KeyedVideo({
  video,
  playing,
  label,
  restart = false,
  width = 720,
  onProgress,
  onEnded,
}: {
  video: CrunchVideo;
  playing: boolean;
  label: string;
  restart?: boolean;
  width?: number;
  onProgress?: (p: number) => void;
  onEnded?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const plate = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false); // plate built, first frame painted

  // 1) first (empty) frame → backdrop plate; every later seek repaints the canvas
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = () => {
      if (!plate.current) v.currentTime = 0.001;
    };
    const onSeeked = () => {
      if (!plate.current) {
        try {
          plate.current = makePlate(v, video);
        } catch {
          return;
        }
        setReady(true);
      }
      paintKeyed(canvasRef.current, v, plate.current, video);
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
      if (v.duration) onProgress?.(v.currentTime / v.duration);
      if (v.ended) return; // hold the finished tray
      handle = vv.requestVideoFrameCallback ? vv.requestVideoFrameCallback(tick) : requestAnimationFrame(tick);
    };
    if (restart) v.currentTime = 0;
    v.playbackRate = PLAYBACK_RATE;
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
        width={width}
        height={Math.round((width * video.h) / video.w)}
        role="img"
        aria-label={label}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
        style={{
          // per-video framing so every tray reads at the same size, standing on the same line
          transform: video.scale && video.scale !== 1 ? `scale(${video.scale})` : undefined,
          transformOrigin: "50% 65%",
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

function Rail({ progress, active, done, onJump }: { progress: MotionValue<number>; active: number; done: boolean; onJump: (i: number) => void }) {
  const last = active === crunchBuild.length - 1;
  return (
    <nav aria-label="Menu categories" className="absolute inset-x-0 bottom-3 z-10 flex justify-center px-3 md:bottom-6">
      {/* same pill bar as the Franchising tabs, plus a "next" button at the end */}
      <ol className="flex items-center gap-1 rounded-full border border-ink/10 bg-paper/90 p-1.5 shadow-soft3 backdrop-blur-md md:gap-2 md:p-2">
        {crunchBuild.map((c, i) => (
          <li key={c.id}>
            <RailButton c={c} i={i} progress={progress} live={active === i} onJump={onJump} />
          </li>
        ))}
        <li className="ms-1 border-s border-ink/10 ps-2 md:ps-3">
          <button
            type="button"
            onClick={() => onJump(active + 1)}
            aria-label={last ? "Continue down the page" : `Next: ${crunchBuild[active + 1].short}`}
            data-cursor="link"
            className={`relative grid size-10 place-items-center rounded-full text-white transition-colors duration-300 md:size-11 ${done ? "bg-tex-red" : "bg-third hover:bg-tex-red"}`}
          >
            {done && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-tex-red/40" />}
            <motion.svg
              aria-hidden
              viewBox="0 0 24 24"
              className="relative size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={done ? { y: [0, 3, 0] } : { y: 0 }}
              transition={done ? { duration: 1, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </motion.svg>
          </button>
        </li>
      </ol>
    </nav>
  );
}

function RailButton({ c, i, progress, live, onJump }: { c: BuildCategory; i: number; progress: MotionValue<number>; live: boolean; onJump: (i: number) => void }) {
  // how far through this category's slice of the scroll we are
  const fill = useTransform(progress, (p) => clamp01(p * crunchBuild.length - i));
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
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          className="absolute inset-0 overflow-hidden rounded-full bg-tex-red"
        >
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
