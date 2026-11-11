"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Title } from "@/components/v2/kit";
import { ceoV2 } from "@/lib/content-v2/home";
import { staggerContainer, fadeUp, inView, ease } from "@/lib/motion";

/**
 * CEO message — rebuilt to the client reference: white canvas, ink/red display
 * title, red rule beside the copy, yellow name, and the branded portrait frame
 * ("TEXAS . FLAVOR . BOLD." border + "OUR CEO" stamp) instead of the dark,
 * glow-heavy panel. Balanced two-column spacing.
 */
export default function CeoV2() {
  return (
    <section className="relative overflow-hidden bg-white py-12 md:py-16">
      <div className="container-tx relative grid items-center gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
        <div className="max-w-xl lg:justify-self-end">
          <Title lines={ceoV2.titleLines} size="lg" className="!mt-0" />

          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="mt-8 space-y-4 border-l-[3px] border-primary pl-6"
          >
            {ceoV2.body.map((p, i) => (
              <motion.p
                key={i}
                variants={fadeUp}
                className={`leading-relaxed text-third/80 ${i === 0 ? "text-xl font-bold uppercase text-third" : "text-base md:text-lg"}`}
              >
                {p}
              </motion.p>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={inView} className="mt-8 pl-6">
            <div className="display text-3xl text-secondary md:text-4xl">{ceoV2.name}</div>
            <div className="mt-1 text-xs font-bold uppercase tracking-caps text-third/50">{ceoV2.role}</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, rotate: 4, y: 40 }}
          whileInView={{ opacity: 1, rotate: 0, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.9, ease: ease.out }}
          whileHover={{ rotate: -1.5, scale: 1.01 }}
          className="relative mx-auto w-full max-w-[460px] lg:mx-0"
        >
          <Image
            src={ceoV2.image}
            alt={`${ceoV2.name}, ${ceoV2.role}`}
            width={1545}
            height={1721}
            sizes="(max-width: 1024px) 90vw, 460px"
            className="h-auto w-full select-none drop-shadow-2xl"
          />
          <CeoStamp />
        </motion.div>
      </div>
    </section>
  );
}

/** 5-point star path centred on (100,100). */
const STAR = Array.from({ length: 10 }, (_, i) => {
  const r = i % 2 === 0 ? 32 : 13;
  const a = (Math.PI / 5) * i - Math.PI / 2;
  return `${(100 + r * Math.cos(a)).toFixed(2)},${(100 + r * Math.sin(a)).toFixed(2)}`;
}).join(" ");

/**
 * Animated "OUR CEO" stamp. Sits exactly over the stamp baked into ceo.png
 * (centre ≈ 222,1498 / radius ≈ 222 on the 1545×1721 artwork) and covers it,
 * so the text ring can spin while the star stays put.
 */
function CeoStamp() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute"
      style={{ left: "-0.3%", top: "73.9%", width: "29.3%", aspectRatio: "1 / 1" }}
    >
      <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
        <circle cx="100" cy="100" r="100" fill="#9a3324" />
        <motion.g
          style={{ originX: "100px", originY: "100px" }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 14, ease: "linear", repeat: Infinity }}
        >
          <defs>
            <path id="ceo-stamp-ring" d="M100,100 m-60,0 a60,60 0 1,1 120,0 a60,60 0 1,1 -120,0" />
          </defs>
          <text className="display" fill="#fff" fontSize="30" letterSpacing="1">
            <textPath href="#ceo-stamp-ring" textLength="372" lengthAdjust="spacingAndGlyphs">
              OUR CEO . OUR CEO . OUR CEO .
            </textPath>
          </text>
        </motion.g>
        <motion.polygon
          points={STAR}
          fill="#F4B118"
          style={{ originX: "100px", originY: "100px" }}
          animate={reduce ? undefined : { scale: [1, 1.12, 1] }}
          transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
        />
      </svg>
    </div>
  );
}
