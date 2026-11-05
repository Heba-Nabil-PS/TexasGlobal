"use client";

import BrandStar from "@/components/ui/BrandStar";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Button from "@/components/ui/Button";
import Marquee from "@/components/ui/Marquee";
import Stats from "@/components/ui/Stats";
import { Section, Eyebrow, Title, Lead, Stamp, OutlineStar, SliderControls } from "@/components/v2/kit";
import { storyV2 } from "@/lib/content-v2/story";
import { storyPage } from "@/lib/content";
import { ease, fadeUp, inView, staggerContainer } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/* Hero — bright brand-yellow stage, product-dominant composition      */
/* ------------------------------------------------------------------ */
export function StoryHeroV2({
  title = storyV2.hero.title,
  subtitle = storyV2.hero.subtitle,
  eyebrow = storyV2.hero.eyebrow,
}: {
  title?: string[];
  subtitle?: string;
  eyebrow?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const foodY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const ghostX = useTransform(scrollYProgress, [0, 1], [0, -160]);

  return (
    <section ref={ref} className="relative flex items-center overflow-hidden bg-[#E9962A] pb-12 pt-32 text-third md:pb-14 md:pt-36 lg:min-h-[100svh]">
      {/* ghost year */}
      <motion.span
        aria-hidden
        style={{ x: ghostX }}
        className="display pointer-events-none absolute -bottom-10 left-0 select-none whitespace-nowrap text-[42vw] leading-none text-white/20 md:text-[30vw]"
      >
        1952
      </motion.span>

      <div className="container-tx relative z-10 grid w-full items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: ease.out, delay: 0.15 }}
            className="eyebrow text-third"
          >
            <BrandStar /> {eyebrow}
          </motion.span>
          <Title as="h1" size="lg" lines={title} />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: ease.out, delay: 0.5 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-third/85"
          >
            {subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: ease.out, delay: 0.65 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Button href={storyV2.hero.ctaPrimary.href} variant="red">
              {storyV2.hero.ctaPrimary.label}
            </Button>
            <Button href={storyV2.hero.ctaSecondary.href} variant="ghost">
              {storyV2.hero.ctaSecondary.label}
            </Button>
          </motion.div>
        </div>

        {/* Food composition */}
        <motion.div style={{ y: foodY }} className="relative mx-auto aspect-square w-full max-w-[520px]">
          <OutlineStar className="absolute inset-[4%] h-[92%] w-[92%]" color="#ffffff" />
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: ease.expo, delay: 0.3 }}
            className="absolute inset-x-[2%] top-[10%] aspect-[1680/1096]"
          >
            <Image src="/assets/v2/menu/explore-combo.png" alt="Texas Chicken bone-in box, fries and drink" fill priority sizes="(max-width:1024px) 90vw, 46vw" className="object-contain drop-shadow-[0_30px_40px_rgba(45,41,38,0.35)]" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -60, rotate: -12 }}
            animate={{ opacity: 1, x: 0, rotate: -6 }}
            transition={{ duration: 1, ease: ease.expo, delay: 0.55 }}
            className="absolute -left-[4%] bottom-[2%] aspect-[915/874] w-[52%]"
          >
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative h-full w-full">
              <Image src="/assets/v2/signatures/sig-01.png" alt="Hand-battered bone-in chicken" fill sizes="30vw" className="object-contain drop-shadow-[0_24px_30px_rgba(45,41,38,0.35)]" />
            </motion.div>
          </motion.div>
          <Stamp text="Since 1952" size={112} className="absolute bottom-[6%] right-[4%]" />
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Moving strip — one calm line of brand keywords                      */
/* ------------------------------------------------------------------ */
export function KeywordStripV2() {
  return (
    <div className="overflow-hidden bg-third py-4 text-white md:py-5">
      <Marquee duration={34}>
        {storyV2.strip.map((w) => (
          <span key={w} className="flex items-center">
            <span className="display whitespace-nowrap px-6 text-2xl uppercase leading-none md:text-[2.2rem]">{w}</span>
            <span className="px-2 text-xl text-secondary md:text-2xl"><BrandStar /></span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Heritage — scrapbook collage instead of a boxed photo               */
/* ------------------------------------------------------------------ */
export function HeritageV2() {
  const h = storyV2.heritage;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const photoRot = useTransform(scrollYProgress, [0, 1], [-9, -3]);
  const foodY = useTransform(scrollYProgress, [0, 1], [80, -60]);

  return (
    <Section>
      <div ref={ref} className="container-tx grid items-center gap-16 lg:grid-cols-[1fr_1fr] lg:gap-20">
        {/* Collage */}
        <div className="relative mx-auto h-[460px] w-full max-w-[560px] sm:h-[560px]">
          <OutlineStar className="absolute -left-[6%] top-[4%] h-[95%] w-[95%]" />
          {/* yellow note */}
          <motion.div
            initial={{ opacity: 0, rotate: 14, y: -20 }}
            whileInView={{ opacity: 1, rotate: 7, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.8, ease: ease.pop }}
            className="absolute right-[2%] top-[2%] z-10 bg-secondary px-6 py-5 text-third shadow-soft3"
          >
            <p className="display text-4xl leading-[0.85] md:text-5xl">Est.<br />1952</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-caps">San Antonio, TX</p>
          </motion.div>
          {/* polaroid */}
          <motion.figure
            style={{ rotate: photoRot }}
            className="absolute left-[2%] top-[8%] z-[5] w-[64%] bg-white p-3 pb-12 shadow-pop"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-third">
              <Image src={h.photo} alt="Texas Chicken heritage" fill sizes="(max-width:1024px) 60vw, 30vw" className="object-cover" />
            </div>
            <figcaption className="display absolute inset-x-0 bottom-3 text-center text-lg uppercase text-third/80">
              {h.photoCaption}
            </figcaption>
          </motion.figure>
          {/* product */}
          <motion.div style={{ y: foodY }} className="absolute -right-[4%] bottom-[-4%] z-20 aspect-[915/874] w-[66%]">
            <Image src={h.product} alt="Hand-battered bone-in chicken" fill sizes="(max-width:1024px) 60vw, 32vw" className="object-contain drop-shadow-[0_26px_30px_rgba(45,41,38,0.3)]" />
          </motion.div>
          {/* stamps */}
          <div className="absolute bottom-[2%] left-[0%] z-30 w-28 sm:w-32">
            <div className="relative aspect-square animate-[spin_26s_linear_infinite]">
              <Image src={h.stamp} alt="Bold Texas Flavor" fill sizes="128px" className="object-contain" />
            </div>
          </div>
        </div>

        {/* Copy */}
        <div>
          <Eyebrow>{h.eyebrow}</Eyebrow>
          <Title lines={h.title} />
          <motion.div variants={staggerContainer(0.12)} initial="hidden" whileInView="show" viewport={inView} className="mt-7 max-w-xl space-y-4">
            {h.body.map((p, i) => (
              <motion.p key={i} variants={fadeUp} className="text-lg leading-relaxed text-third/75">
                {p}
              </motion.p>
            ))}
          </motion.div>
          <motion.dl
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="mt-10 flex flex-wrap gap-x-10 gap-y-6"
          >
            {h.facts.map((f) => (
              <motion.div key={f.k} variants={fadeUp} className="border-l-4 border-secondary pl-4">
                <dt className="display text-5xl leading-none text-primary">{f.k}</dt>
                <dd className="mt-1 text-xs font-bold uppercase tracking-caps text-third/60">{f.v}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </Section>
  );
}
