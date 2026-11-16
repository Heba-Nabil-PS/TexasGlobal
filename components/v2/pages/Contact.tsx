"use client";

import BrandArrow from "@/components/ui/BrandArrow";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { Eyebrow, Title } from "@/components/v2/kit";
import { FieldV2, HeroV2 } from "./shared";
import { contactPage } from "@/lib/content";
import { contactV2 } from "@/lib/content-v2/pages";
import { fadeUp, inView, staggerContainer } from "@/lib/motion";

/* Solid 24px glyphs (storefront, article, briefcase, help) — same filled,
   currentColor style as the icons in /public/assets/icons. */
const channelIcons = [
  "M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z",
  "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
  "M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z",
  "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z",
];

/* ---------------------------------------------------------------- hero */
export function ContactHeroV2() {
  const h = contactV2.hero;
  return (
    <HeroV2
      eyebrow={h.eyebrow}
      title={h.title}
      body={h.body}
      visual={
        <div className="relative mx-auto aspect-[1531/1021] w-full max-w-[640px]">
          <Image
            src="/assets/v2/contact-team.png"
            alt="The Texas Chicken team in uniform"
            fill
            priority
            sizes="(max-width:1024px) 90vw, 45vw"
            className="rounded-[2.5rem] object-cover shadow-soft3"
          />
        </div>
      }
    />
  );
}

/* --------------------------------------------- channels + HQ + message form */
export function ContactBodyV2() {
  return (
    <section className="relative bg-white pb-10 md:pb-14">
      <div className="container-tx">
        <Eyebrow>{contactV2.body.eyebrow}</Eyebrow>
        <Title lines={contactV2.body.title} size="md" />

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Channels — one clean list */}
          <motion.ul
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="grid gap-4"
          >
            {contactPage.channels.map((c, i) => {
              // The whole card goes to the channel's page: the arrow link's ::after stretches over it.
              const arrowClass =
                "grid size-10 shrink-0 place-items-center rounded-full border-2 border-third/10 text-third transition-colors group-hover:border-secondary group-hover:bg-secondary after:absolute after:inset-0 after:rounded-[1.75rem] after:content-['']";
              return (
                <motion.li key={c.title} variants={fadeUp}>
                  <div className="group relative flex cursor-pointer items-center gap-5 rounded-[1.75rem] bg-white p-5 shadow-soft3 ring-1 ring-third/10 transition-all duration-300 hover:-translate-y-1 hover:ring-secondary md:p-6">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary text-secondary" aria-hidden>
                      <svg viewBox="0 0 24 24" className="size-7" fill="currentColor">
                        <path d={channelIcons[i]} />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="display block text-2xl uppercase leading-none text-third md:text-[1.7rem]">{c.title}</span>
                      <span className="mt-1.5 block text-xs text-third/60">{c.note}</span>
                    </span>
                    <Link href={c.href} data-cursor="link" aria-label={`Go to ${c.title}`} className={arrowClass}>
                      <BrandArrow />
                    </Link>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>

          {/* Form */}
          <motion.form
            variants={staggerContainer(0.06)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            onSubmit={(e) => e.preventDefault()}
            className="relative rounded-[2.5rem] bg-white p-8 shadow-soft3 ring-1 ring-third/10 md:p-12"
          >
            <motion.h2 variants={fadeUp} className="display text-4xl uppercase text-third md:text-5xl">
              {contactPage.form.heading}
            </motion.h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <FieldV2 label="Full name" placeholder="Jane Doe" />
              <FieldV2 label="Email" type="email" placeholder="jane@email.com" />
            </div>
            <div className="mt-5">
              <FieldV2 as="textarea" rows={5} label="Message" placeholder="How can we help?" />
            </div>
            <motion.div variants={fadeUp} className="mt-7 flex justify-end">
              <Button type="submit" variant="red">
                Send message
              </Button>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
