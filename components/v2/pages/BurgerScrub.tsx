"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";

/**
 * The Mexicana, exploding layer by layer as you scroll — a transparent image
 * sequence from the brand video (img/video.MP4, 3.96 s → 1.08 s: the closed
 * sandwich from the end of the clip, opening back up), checkerboard keyed out,
 * every frame re-scaled so the sandwich keeps filling the box.
 * Frame 0 = closed sandwich, last frame = layers apart. The frame shown is a
 * pure function of `progress` (0–1), so scrolling up closes it again exactly;
 * neighbouring frames are crossfaded so the scrub stays smooth.
 */
export const BURGER = { count: 32, width: 760, height: 1040, dir: "/assets/v2/franchising/burger" };

const src = (i: number) => `${BURGER.dir}/${String(i).padStart(3, "0")}.webp`;
const ok = (im: HTMLImageElement | null | undefined): im is HTMLImageElement => !!im && im.complete && im.naturalWidth > 0;

export default function BurgerScrub({ progress, className = "" }: { progress: MotionValue<number>; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>([]);
  const current = useRef(0); // fractional frame position
  const raf = useRef(0);

  const frame = useTransform(progress, (p) => (p <= 0 ? 0 : p >= 1 ? 1 : p) * (BURGER.count - 1));

  /** nearest loaded frame to i (the sequence may still be streaming in) */
  const nearest = (i: number) => {
    for (let d = 0; d < BURGER.count; d++) {
      if (ok(frames.current[i - d])) return frames.current[i - d]!;
      if (ok(frames.current[i + d])) return frames.current[i + d]!;
    }
    return null;
  };

  const draw = () => {
    raf.current = 0;
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const f = current.current;
    const i = Math.floor(f);
    // blend only through the middle of each step: smooth, but no long doubled image
    const r = f - i;
    const t = r <= 0.3 ? 0 : r >= 0.7 ? 1 : ((r - 0.3) / 0.4) ** 2 * (3 - 2 * ((r - 0.3) / 0.4));
    const a = nearest(t >= 1 ? i + 1 : i);
    if (!a) return;
    const b = t > 0.01 && t < 1 ? frames.current[i + 1] : null;
    ctx.clearRect(0, 0, c.width, c.height);
    if (ok(b) && b !== a) {
      // a at full strength, b over it: no see-through dip mid-fade
      ctx.drawImage(a, 0, 0, c.width, c.height);
      ctx.globalAlpha = t;
      ctx.drawImage(b, 0, 0, c.width, c.height);
      ctx.globalAlpha = 1;
    } else {
      ctx.drawImage(a, 0, 0, c.width, c.height);
    }
  };
  const schedule = () => {
    if (!raf.current) raf.current = requestAnimationFrame(draw);
  };

  useMotionValueEvent(frame, "change", (i) => {
    current.current = i;
    schedule();
  });

  // canvas backing size follows its CSS size × DPR (capped at the source size)
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ro = new ResizeObserver(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.min(BURGER.width, Math.round(c.clientWidth * dpr));
      c.width = w;
      c.height = Math.round((w * BURGER.height) / BURGER.width);
      schedule();
    });
    ro.observe(c);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load frame 0 first, then a coarse pass (every 6th) so scrubbing works early, then the rest
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
      img.onload = img.onerror = () => {
        if (cancelled) return;
        if (Math.abs(i - current.current) <= 6) schedule();
        pump();
      };
      img.src = src(i);
      frames.current[i] = img;
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
      style={{ aspectRatio: `${BURGER.width} / ${BURGER.height}` }}
    />
  );
}
