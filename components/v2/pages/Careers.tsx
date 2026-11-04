"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Counter from "@/components/ui/Counter";
import { Eyebrow, Lead, OutlineStar, Section, Stamp, Title } from "@/components/v2/kit";
import { ClosingCta, HeroV2 } from "./shared";
import { careersPage } from "@/lib/content";
import { careersV2 } from "@/lib/content-v2/pages";
import { ease, fadeUp, inView, staggerContainer } from "@/lib/motion";

/* ---------------------------------------------------------------- hero */
export function CareersHeroV2() {
  const h = careersV2.hero;
  return (
    <HeroV2
      eyebrow={h.eyebrow}
      title={h.title}
      body={h.body}
      visual={
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, rotate: 3, y: 30 }}
            animate={{ opacity: 1, rotate: 0, y: 0 }}
            transition={{ duration: 1, ease: ease.expo }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-[3rem] shadow-pop md:aspect-[5/5]"
          >
            <Image
              src="/assets/v2/menu/banner-bone-in.png"
              alt="Texas Chicken crew member serving a box of hand-battered chicken"
              fill
              priority
              sizes="(max-width:1024px) 92vw, 48vw"
              className="object-cover object-[72%_50%]"
            />
          </motion.div>
          <Stamp text={h.stamp} size={130} className="absolute -bottom-8 -left-6 md:-left-10" />
          <span className="display absolute -right-2 bottom-10 rotate-[-6deg] rounded-xl bg-secondary px-4 py-2 text-2xl uppercase text-third shadow-soft3 md:text-3xl">
            Now hiring
          </span>
        </div>
      }
    >
      <Button href={h.primary.href} variant="red" pulse>
        {h.primary.label}
      </Button>
      <Button href={h.secondary.href} variant="ghost">
        {h.secondary.label}
      </Button>
    </HeroV2>
  );
}

/* --------------------------------------------------- stats + culture */
export function CareersCultureV2() {
  const c = careersV2.culture;
  const tone = { red: "bg-primary text-white", yellow: "bg-secondary text-third", ink: "bg-third text-white", white: "bg-white text-third ring-2 ring-third/10" };
  return (
    <Section className="!pt-4">
      <div className="container-tx">
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {careersV2.stats.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className={`relative overflow-hidden rounded-3xl p-6 md:p-8 ${tone[s.tone]}`}>
              <OutlineStar className="absolute -right-6 -top-6 size-28 opacity-60" color={s.tone === "yellow" ? "#fff" : "#F4B118"} />
              <Counter value={s.value} suffix={s.suffix} className="display relative text-5xl md:text-6xl" />
              <p className="relative mt-2 text-sm font-bold uppercase tracking-caps opacity-80">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-24">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <Title lines={c.title} size="md" />
          <Lead>{c.body}</Lead>
        </div>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {c.points.map((p, i) => (
            <motion.div
              key={p.title}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-third/[0.04] p-7 pt-0"
            >
              <div className="relative -mx-4 aspect-[915/700] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
                <Image src={p.image} alt="" fill sizes="(max-width:1024px) 45vw, 22vw" className="object-contain" />
              </div>
              <span className="display text-5xl leading-none text-secondary">0{i + 1}</span>
              <h3 className="display mt-2 text-3xl uppercase leading-none text-third">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-third/70">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* --------------------------------------------------------- open roles */
export function CareersRolesV2() {
  const [filter, setFilter] = useState(careersPage.filters[0]);
  const roles = filter === "All" ? careersPage.roles : careersPage.roles.filter((r) => r.type === filter);
  const r = careersV2.roles;

  return (
    <section id="roles" className="relative scroll-mt-28 bg-white py-20 md:py-28">
      <div className="container-tx">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>{r.eyebrow}</Eyebrow>
            <Title lines={r.title} size="md" />
          </div>
          <div className="flex flex-wrap gap-2">
            {careersPage.filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                data-cursor="link"
                className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-caps transition-colors ${
                  filter === f ? "bg-secondary text-third" : "bg-third/5 text-third/70 hover:bg-third/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-10 grid gap-4 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {roles.map((role) => (
              <motion.a
                key={role.title}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: ease.out }}
                href="/contact-us"
                data-cursor="link"
                className="group flex items-center justify-between gap-4 rounded-3xl border-2 border-third/10 bg-white p-6 transition-colors hover:border-secondary hover:bg-secondary/10"
              >
                <div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-caps text-primary">{role.type}</span>
                  <h3 className="display mt-3 text-3xl uppercase leading-none text-third">{role.title}</h3>
                  <p className="mt-2 flex items-center gap-2 text-sm text-third/60">
                    <svg viewBox="0 0 24 24" className="size-4 text-primary" fill="currentColor" aria-hidden>
                      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                    </svg>
                    {role.location} · {role.commitment}
                  </p>
                </div>
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-third text-xl text-white transition-transform group-hover:translate-x-1 group-hover:bg-primary">
                  →
                </span>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>

        <p className="mt-8 text-sm text-third/50">{r.note}</p>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- closing */
export function CareersCtaV2() {
  const c = careersV2.cta;
  return (
    <ClosingCta eyebrow={c.eyebrow} title={c.title} body={c.body} image="/assets/v2/crunch/crunch-06.png">
      <Button href={c.primary.href} variant="red">
        {c.primary.label}
      </Button>
      <Button href={c.secondary.href} variant="ghost">
        {c.secondary.label}
      </Button>
    </ClosingCta>
  );
}
