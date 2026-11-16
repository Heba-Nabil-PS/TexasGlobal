"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import manifest from "./burger-manifest.json";

/**
 * The Mexicana opening layer by layer as you scroll — a transparent image
 * sequence drawn to a canvas, built from the brand video (img/video.MP4,
 * 4.05 s back to 2.40 s: the closed sandwich from the end of the clip,
 * opening to its widest):
 *  - motion-interpolated to 120 fps, so even the fast "snap" where the top
 *    bun lifts has in-between frames
 *  - frames picked at equal visual change, so every bit of scroll moves the
 *    sandwich by the same amount (no dead zones, no jumps)
 *  - frames are shown crisp (never blended); the framing (gentle zoom-out as
 *    it opens) comes from a pre-smoothed camera path interpolated continuously
 * Frame 0 = closed, last = fully open; the picture is a pure function of
 * `progress` (0–1), so scrolling up closes it again exactly.
 */
type Cam = [number, number, number, number];
export const BURGER = {
  count: manifest.count,
  width: manifest.width,
  height: manifest.height,
  aspect: manifest.aspect, // canvas width / height
  dir: "/assets/v2/franchising/burger",
};
const CAMS = manifest.cams as Cam[];

const src = (i: number) => `${BURGER.dir}/${String(i).padStart(3, "0")}.webp`;

export default function BurgerScrub({ progress, className = "" }: { progress: MotionValue<number>; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>([]);
  const ready = useRef<boolean[]>([]); // loaded AND decoded (drawing never blocks on a decode)
  const current = useRef(0); // fractional frame position
  const raf = useRef(0);

  const frame = useTransform(progress, (p) => (p <= 0 ? 0 : p >= 1 ? 1 : p) * (BURGER.count - 1));

  /** nearest decoded frame to i (the sequence may still be streaming in) */
  const nearest = (i: number) => {
    for (let d = 0; d < BURGER.count; d++) {
      if (ready.current[i - d]) return frames.current[i - d]!;
      if (ready.current[i + d]) return frames.current[i + d]!;
    }
    return null;
  };

  const draw = () => {
    raf.current = 0;
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const f = current.current;
    const img = nearest(Math.round(f));
    if (!img) return;
    // camera: continuous between frames
    const i0 = Math.floor(f), i1 = Math.min(BURGER.count - 1, i0 + 1), t = f - i0;
    const a = CAMS[i0], b = CAMS[i1];
    const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
    const w = a[2] + (b[2] - a[2]) * t, h = a[3] + (b[3] - a[3]) * t;
    // map the camera view onto the canvas (parts of the view outside the image are just empty)
    const sx = c.width / w, sy = c.height / h;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, -x * sx, -y * sy, BURGER.width * sx, BURGER.height * sy);
  };
  const schedule = () => {
    if (!raf.current) raf.current = requestAnimationFrame(draw);
  };

  useMotionValueEvent(frame, "change", (i) => {
    current.current = i;
    schedule();
  });

  // canvas backing size = its CSS size × DPR
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ro = new ResizeObserver(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.max(1, Math.round(c.clientWidth * dpr));
      c.height = Math.max(1, Math.round(c.width / BURGER.aspect));
      schedule();
    });
    ro.observe(c);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // frame 0 first, then a coarse pass (every 4th) so scrubbing works early, then the rest
  useEffect(() => {
    let cancelled = false;
    current.current = frame.get();
    const order: number[] = [0];
    for (let i = 4; i < BURGER.count; i += 4) order.push(i);
    order.push(BURGER.count - 1);
    for (let i = 1; i < BURGER.count; i++) if (!order.includes(i)) order.push(i);
    let next = 0;
    const pump = () => {
      if (cancelled || next >= order.length) return;
      const i = order[next++];
      const img = new Image();
      img.decoding = "async";
      img.src = src(i);
      frames.current[i] = img;
      img
        .decode()
        .then(() => {
          if (cancelled) return;
          ready.current[i] = true;
          if (Math.abs(i - current.current) <= 4) schedule();
        })
        .catch(() => {})
        .finally(() => !cancelled && pump());
    };
    // a few parallel lanes sharing one queue
    for (let lane = 0; lane < 4; lane++) pump();
    return () => {
      cancelled = true;
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      role="img"
      aria-label="The Mexicana chicken sandwich, its layers lifting apart"
      className={`block h-auto w-full ${className}`}
      style={{
        aspectRatio: `${BURGER.aspect}`,
        // soften the canvas edges so a crumb drifting out never shows a hard cut
        maskImage: "linear-gradient(to right, transparent, #000 4%, #000 96%, transparent), linear-gradient(to bottom, transparent, #000 3%, #000 97%, transparent)",
        maskComposite: "intersect",
        WebkitMaskImage: "linear-gradient(to right, transparent, #000 4%, #000 96%, transparent), linear-gradient(to bottom, transparent, #000 3%, #000 97%, transparent)",
        WebkitMaskComposite: "source-in",
      }}
    />
  );
}
