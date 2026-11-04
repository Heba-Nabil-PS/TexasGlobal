"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Counter from "@/components/ui/Counter";
import Reveal from "@/components/ui/Reveal";
import { WordsReveal } from "@/components/ui/TextReveal";
import { Eyebrow, Title, Stamp, OutlineStar } from "@/components/v2/kit";
import { about } from "@/lib/content";
import { aboutV2 } from "@/lib/content-v2/home";
import { staggerContainer, fadeUp, inView } from "@/lib/motion";

/** Home "Our story": global-leadership headline, white canvas, stat cards, tray video. */
export default function AboutV2() {
  return (
    <section id="about" className="relative overflow-hidden bg-white pb-12 pt-14 md:pb-16 md:pt-20">
      <OutlineStar className="absolute -right-24 top-10 hidden size-[420px] opacity-60 lg:block" />
      <div className="container-tx relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <Eyebrow>{aboutV2.eyebrow}</Eyebrow>
            <Title lines={aboutV2.titleLines} size="md" className="md:!text-[3.6vw]" />

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-third/70">
              <WordsReveal text={aboutV2.body} />
            </p>

            <StatCards />

            <Reveal delay={0.15} className="mt-10 flex flex-wrap items-center gap-4">
              <Button href={about.cta.primary.href} variant="yellow">
                {about.cta.primary.label}
              </Button>
              <Button href={about.cta.secondary.href} variant="ghost">
                {about.cta.secondary.label}
              </Button>
            </Reveal>
          </div>

          <div className="relative h-[380px] md:h-[620px]">
            <Stamp text="Bold Texas flavor" size={120} className="absolute right-4 top-6 z-10 md:right-10" />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-full w-full"
            >
              <video
                className="h-full w-full object-contain object-center mix-blend-multiply"
                src="/assets/home/food-gif.webm"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-label="Texas Chicken tray"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Punchier counters: tilted cards, big numbers, 1–3 word labels, one yellow hero card. */
function StatCards() {
  return (
    <motion.div
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4"
    >
      {aboutV2.stats.map((s, i) => {
        const hero = i === 1;
        return (
          <motion.div
            key={s.label}
            variants={fadeUp}
            whileHover={{ y: -6, rotate: 0 }}
            style={{ rotate: i % 2 ? 1.5 : -1.5 }}
            className={`relative flex flex-col justify-between overflow-hidden rounded-2xl p-4 shadow-soft3 md:p-5 ${
              hero ? "bg-secondary text-third" : "bg-third text-white"
            }`}
          >
            <span className="absolute -right-2 -top-3 text-5xl opacity-15" aria-hidden>
              ★
            </span>
            <div className={`display text-[2.6rem] leading-none md:text-5xl ${hero ? "text-primary" : "text-secondary"}`}>
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-3 text-sm font-extrabold uppercase leading-tight tracking-wide">{s.label}</div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
