"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { newsV2 } from "@/lib/content-v2/news";
import { ease } from "@/lib/motion";
import { ShootingStar, Stamp } from "@/components/v2/kit";

/**
 * News hero, ported from the informative site's blogs page: breadcrumb on top,
 * a giant centred red title, then the intro. Product cut-outs and the brand
 * stamp flank the title so the page opens on food rather than a dark block.
 */
export default function NewsHeroV2() {
  const h = newsV2.hero;
  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-36 text-third md:pb-24 md:pt-44">
      {/* Flanking product cut-outs */}
      <motion.div
        initial={{ opacity: 0, x: -60, rotate: -8 }}
        animate={{ opacity: 1, x: 0, rotate: -4 }}
        transition={{ duration: 1, ease: ease.out, delay: 0.3 }}
        className="pointer-events-none absolute -left-16 top-40 hidden w-[24vw] max-w-[360px] lg:block"
      >
        <Image src="/assets/v2/signatures/sig-01.png" alt="" width={915} height={874} className="relative h-auto w-full" priority />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 60, rotate: 8 }}
        animate={{ opacity: 1, x: 0, rotate: 5 }}
        transition={{ duration: 1, ease: ease.out, delay: 0.45 }}
        className="pointer-events-none absolute -right-14 top-56 hidden w-[22vw] max-w-[330px] lg:block"
      >
        <Image src="/assets/v2/signatures/sig-03.png" alt="" width={915} height={874} className="relative h-auto w-full" priority />
      </motion.div>

      <div className="container-tx relative z-10 flex flex-col items-center text-center">
        {/* Breadcrumb — as on the informative site */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm capitalize text-third/60">
          <Link href="/" className="transition-colors hover:text-secondary">
            Home
          </Link>
          <span aria-hidden>›</span>
          <span className="text-secondary">News</span>
        </nav>

        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: ease.out, delay: 0.1 }}
          className="eyebrow mt-8 text-tex-red"
        >
          <ShootingStar className="size-5" /> {h.eyebrow}
        </motion.span>

        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: ease.out, delay: 0.15 }}
          className="mt-4 block font-texas text-2xl font-extrabold uppercase leading-none text-third md:text-4xl"
        >
          {h.pre}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          className="relative text-center font-texas font-black uppercase italic leading-none tracking-tight text-primary drop-shadow-sm"
          style={{ fontSize: "clamp(56px, 13vw, 168px)" }}
        >
          {h.title}
          <Stamp text="Bold Texas flavor" size={96} className="absolute -right-6 -top-10 hidden md:block" />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: ease.out, delay: 0.4 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-third/75 md:text-xl"
        >
          {h.subtitle}
        </motion.p>
      </div>
    </section>
  );
}
