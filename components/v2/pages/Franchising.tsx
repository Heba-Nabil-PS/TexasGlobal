"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Counter from "@/components/ui/Counter";
import { Eyebrow, Lead, OutlineStar, Section, Stamp, Title } from "@/components/v2/kit";
import { ClosingCta, FieldV2, FloatFood, GlobeSpin, HeroV2 } from "./shared";
import { franchisePage } from "@/lib/content";
import { franchiseV2 } from "@/lib/content-v2/pages";
import { fadeUp, inView, staggerContainer } from "@/lib/motion";

/* ------------------------------------------------------------- hero + proof */
export function FranchiseHeroV2() {
  const h = franchiseV2.hero;
  return (
    <>
      <HeroV2
        eyebrow={h.eyebrow}
        title={h.title}
        body={h.body}
        decor={
          <div aria-hidden className="pointer-events-none absolute -right-[18vw] top-24 size-[62vw] max-w-[1000px] rounded-full bg-secondary/15" />
        }
        visual={
          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            <GlobeSpin className="absolute inset-[6%]" />
            <Stamp text={h.stamp} size={132} className="absolute right-0 top-2 md:right-2" />
            <FloatFood
              src="/assets/v2/signatures/sig-01.png"
              alt="Hand-battered bone-in chicken"
              className="-bottom-6 -left-6 size-[52%] md:-left-14"
              delay={0.4}
            />
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

      {/* Proof — investor-grade numbers as bold tiles */}
      <section className="bg-white pb-16 md:pb-24">
        <div className="container-tx">
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            {franchiseV2.proof.map((s, i) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                className={`relative overflow-hidden rounded-3xl p-6 md:p-8 ${
                  ["bg-primary text-white", "bg-secondary text-third", "bg-third text-white", "bg-white text-third ring-2 ring-third/10"][i]
                }`}
              >
                <OutlineStar className="absolute -right-6 -top-6 size-28 opacity-60" color={i === 1 ? "#fff" : "#F4B118"} />
                <Counter value={s.value} suffix={s.suffix} className="display relative text-5xl md:text-6xl" />
                <p className="relative mt-2 text-sm font-bold uppercase tracking-caps opacity-80">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------- credentials (was yellow marquee) */
export function FranchiseCredentialsV2() {
  const c = franchiseV2.credentials;
  return (
    <Section>
      <div className="container-tx grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <Title lines={c.title} size="md" />
          <Lead>{c.body}</Lead>
          <motion.ul
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="mt-10 space-y-5"
          >
            {c.reasons.map((r, i) => (
              <motion.li key={r.k} variants={fadeUp} className="flex gap-4">
                <span className="display grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-lg text-third">
                  {i + 1}
                </span>
                <div>
                  <p className="display text-2xl uppercase">{r.k}</p>
                  <p className="text-third/70">{r.v}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div className="relative">
          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="grid gap-5 sm:grid-cols-3"
          >
            {c.items.map((b, i) => (
              <motion.div
                key={b.title}
                variants={fadeUp}
                whileHover={{ y: -8, rotate: i === 1 ? 0 : i === 0 ? -2 : 2 }}
                className={`flex flex-col items-center rounded-[2rem] bg-white p-6 text-center shadow-soft3 ring-1 ring-third/5 ${
                  i === 1 ? "sm:-translate-y-8" : ""
                }`}
              >
                <div className="relative h-24 w-full">
                  <Image src={b.badge} alt={b.title} fill className="object-contain" />
                </div>
                <p className="display mt-5 text-2xl uppercase text-primary">{b.title}</p>
                <p className="mt-1 text-sm text-third/60">{b.note}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------- steps + application */
export function FranchiseApplyV2() {
  const a = franchiseV2.apply;
  return (
    <section id="apply" className="relative overflow-hidden bg-white pb-24 pt-8 md:pb-32">
      <div className="container-tx">
        <Eyebrow>{a.eyebrow}</Eyebrow>
        <Title lines={a.title} size="md" />

        {/* steps as a connected road */}
        <motion.ol
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: "some" }}
          className="relative mt-14 grid gap-6 md:grid-cols-4"
        >
          <span aria-hidden className="absolute left-0 right-0 top-8 hidden border-t-4 border-dashed border-secondary md:block" />
          {franchisePage.steps.map((s) => (
            <motion.li key={s.n} variants={fadeUp} className="relative">
              <span className="display relative z-10 grid size-16 place-items-center rounded-full bg-primary text-2xl text-white shadow-pop">
                {s.n}
              </span>
              <h3 className="display mt-5 text-3xl uppercase">{s.title}</h3>
              <p className="mt-2 text-third/70">{s.desc}</p>
            </motion.li>
          ))}
        </motion.ol>

        {/* application — pitch + form on the white canvas */}
        <div className="relative mt-20 text-third">
          <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            {/* pitch */}
            <div className="flex flex-col">
              <Eyebrow>{a.formEyebrow}</Eyebrow>
              <Title lines={a.formTitle} size="md" />
              <p className="mt-5 max-w-sm text-lg leading-relaxed text-third/75">{a.formBody}</p>

              <p className="mt-8 text-xs font-extrabold uppercase tracking-caps text-third/50">What happens next</p>
              <motion.ul
                variants={staggerContainer(0.1)}
                initial="hidden"
                whileInView="show"
                viewport={inView}
                className="mt-3 space-y-3"
              >
                {a.next.map((n, i) => (
                  <motion.li key={n} variants={fadeUp} className="flex items-start gap-3">
                    <span className="display grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-sm text-third">
                      {i + 1}
                    </span>
                    <span className="pt-1 font-semibold leading-snug text-third/85">{n}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* form */}
            <motion.form
              id="apply-form"
              variants={staggerContainer(0.06)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: "some" }}
              onSubmit={(e) => e.preventDefault()}
              className="relative rounded-[2rem] bg-white p-6 shadow-soft3 ring-1 ring-third/10 sm:p-10"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-dashed border-third/10 pb-5">
                <h3 className="display text-3xl uppercase">{a.formHeading}</h3>
                <span className="text-xs font-bold uppercase tracking-caps text-third/50">{a.formTime}</span>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <FieldV2 label="Full name" placeholder="Jane Doe" />
                <FieldV2 label="Email" type="email" placeholder="jane@company.com" />
                <FieldV2 label="Country / market" placeholder="e.g. Egypt" />
                <FieldV2 as="select" label="Investment capacity" placeholder="Select a range" options={a.investment} />
              </div>
              <div className="mt-5">
                <FieldV2 as="textarea" label="Tell us more" placeholder="Your experience, target territory, timeline…" />
              </div>

              <motion.div variants={fadeUp} className="mt-7">
                <button
                  type="submit"
                  data-cursor="link"
                  className="group flex w-full items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-extrabold uppercase tracking-caps text-white transition-colors hover:bg-tex-red700"
                >
                  Submit application
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
                <p className="mt-4 text-center text-[11px] uppercase tracking-caps text-third/40">{a.disclaimer}</p>
              </motion.div>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- closing */
export function FranchiseClosingV2() {
  return (
    <ClosingCta
      eyebrow="Your market is next"
      title={["Bring the crunch", "to [your market]."]}
      body="Tell us where you see Texas Chicken next — our development team will map the opportunity with you."
      image="/assets/v2/crunch/crunch-03.png"
    >
      <Button href="#apply-form" variant="red">
        Apply now
      </Button>
      <Button href="#opportunities" variant="ghost">
        Explore open territories
      </Button>
    </ClosingCta>
  );
}
