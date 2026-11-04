"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eyebrow, Lead, Title } from "@/components/v2/kit";
import { fadeUp } from "@/lib/motion";

/**
 * Shared scaffolding for the V2 inner pages (Franchising, Contact, FAQs, Careers).
 * Every page gets the same white canvas, type scale and spacing — but its own
 * signature visual, so the pages stop looking like copies of each other.
 */
export function HeroV2({
  eyebrow,
  title,
  body,
  children,
  visual,
  decor,
  reverse = false,
}: {
  eyebrow: string;
  title: string[];
  body: string;
  children?: ReactNode;
  visual: ReactNode;
  decor?: ReactNode;
  reverse?: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-32 text-third md:pb-24 lg:pt-44">
      {decor}
      <div
        className={`container-tx relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-8 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <Title as="h1" lines={title} size="lg" className="md:text-[5.4rem]" />
          <Lead>{body}</Lead>
          {children && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="mt-9 flex flex-wrap items-center gap-4">
              {children}
            </motion.div>
          )}
        </div>
        <div className="relative">{visual}</div>
      </div>
    </section>
  );
}

const GLOBES = ["/assets/v2/globe/americas.png", "/assets/v2/globe/africa-europe.png", "/assets/v2/globe/asia.png"];

/** "GIF-style" spinning globe — crossfades the three hemisphere renders eastward. */
export function GlobeSpin({ className = "", interval = 2200 }: { className?: string; interval?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % GLOBES.length), interval);
    return () => clearInterval(t);
  }, [interval]);
  return (
    <div className={`relative aspect-[2221/2268] ${className}`}>
      <AnimatePresence initial={false}>
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ opacity: 0, rotate: -6 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 6 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        >
          <Image src={GLOBES[i]} alt="Texas Chicken markets around the globe" fill sizes="(max-width:1024px) 80vw, 40vw" className="object-contain" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Food cut-out that gently floats — products are the hero on every page. */
export function FloatFood({
  src,
  alt,
  className = "",
  delay = 0,
  amp = 12,
  sizes = "30vw",
}: {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
  amp?: number;
  sizes?: string;
}) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        animate={{ y: [0, -amp, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
        className="relative h-full w-full"
      >
        <Image src={src} alt={alt} fill sizes={sizes} className="object-contain mix-blend-multiply drop-shadow-xl" />
      </motion.div>
    </motion.div>
  );
}

/** Form input on the white canvas. */
export function FieldV2({
  label,
  placeholder,
  type = "text",
  as,
  rows = 4,
  options,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  as?: "textarea" | "select";
  rows?: number;
  /** choices when as="select"; placeholder becomes the empty first option */
  options?: string[];
}) {
  const cls =
    "mt-2 w-full rounded-2xl border-2 border-third/10 bg-white px-4 py-3 text-base text-third placeholder:text-third/40 transition-colors focus:border-secondary focus:outline-none";
  return (
    <motion.label variants={fadeUp} className="block">
      <span className="text-xs font-bold uppercase tracking-caps text-third/70">{label}</span>
      {as === "textarea" ? (
        <textarea rows={rows} placeholder={placeholder} className={`${cls} resize-none`} />
      ) : as === "select" ? (
        <span className="relative block">
          <select defaultValue="" required className={`${cls} cursor-pointer appearance-none pr-12 invalid:text-third/40`}>
            <option value="" disabled>
              {placeholder}
            </option>
            {options?.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <span aria-hidden className="pointer-events-none absolute right-5 top-1/2 mt-1 -translate-y-1/2 text-sm text-third/60">
            ▾
          </span>
        </span>
      ) : (
        <input type={type} placeholder={placeholder} className={cls} />
      )}
    </motion.label>
  );
}

/** Closing call-to-action — white card with a food burst instead of a flat red block. */
export function ClosingCta({
  eyebrow,
  title,
  body,
  children,
  image = "/assets/v2/menu/explore-combo.png",
}: {
  eyebrow: string;
  title: string[];
  body: string;
  children: ReactNode;
  image?: string;
}) {
  return (
    <section className="relative bg-white pb-24 pt-8 md:pb-32">
      <div className="container-tx">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-secondary px-8 py-14 md:px-16 md:py-20">
          {/* sunburst rays */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 -top-40 size-[46rem] animate-[spin_60s_linear_infinite] opacity-25"
            style={{ background: "repeating-conic-gradient(#fff 0deg 8deg, transparent 8deg 20deg)", borderRadius: "9999px" }}
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="eyebrow text-primary">★ {eyebrow}</span>
              <Title lines={title} size="md" className="md:text-[4rem]" />
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-third/80">{body}</p>
              <div className="mt-8 flex flex-wrap gap-4">{children}</div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 40, rotate: 4 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[3/2] w-full"
            >
              <Image src={image} alt="Texas Chicken meal" fill sizes="(max-width:1024px) 90vw, 40vw" className="object-contain mix-blend-multiply" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
