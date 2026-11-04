"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { Eyebrow, Stamp, Title } from "@/components/v2/kit";
import { FieldV2, FloatFood, HeroV2 } from "./shared";
import { contactPage } from "@/lib/content";
import { contactV2 } from "@/lib/content-v2/pages";
import { fadeUp, inView, staggerContainer } from "@/lib/motion";

/* ---------------------------------------------------------------- hero */
export function ContactHeroV2() {
  const h = contactV2.hero;
  return (
    <HeroV2
      eyebrow={h.eyebrow}
      title={h.title}
      body={h.body}
      visual={
        <div className="relative mx-auto aspect-[5/4] w-full max-w-[600px]">
          <div className="absolute inset-[8%] rounded-full bg-secondary" />
          <div className="absolute inset-[4%]">
            <Image
              src="/assets/v2/crunch/crunch-05.png"
              alt="Texas Chicken meal"
              fill
              sizes="(max-width:1024px) 90vw, 45vw"
              className="rounded-full object-contain mix-blend-multiply"
            />
          </div>
          {h.bubbles.map((b, i) => (
            <motion.span
              key={b}
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { delay: 0.6 + i * 0.25, duration: 0.4 },
                scale: { delay: 0.6 + i * 0.25, duration: 0.4 },
                y: { delay: 1 + i * 0.4, duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              className={`absolute whitespace-nowrap rounded-2xl px-4 py-2.5 font-texas text-base font-bold shadow-soft3 md:text-lg ${
                [
                  "left-0 top-[8%] rounded-bl-none bg-secondary text-third",
                  "right-0 top-[38%] rounded-br-none bg-third text-white",
                  "bottom-[6%] left-[10%] rounded-tl-none bg-white text-primary ring-1 ring-third/10",
                ][i]
              }`}
            >
              {b}
            </motion.span>
          ))}
          <Stamp text={h.stamp} size={118} className="absolute -bottom-4 right-[4%]" />
        </div>
      }
    />
  );
}

/* --------------------------------------------- channels + HQ + message form */
export function ContactBodyV2() {
  const [subject, setSubject] = useState(contactPage.form.subjects[0]);
  const badges = ["bg-secondary text-third", "bg-primary text-white", "bg-third text-white", "bg-secondary text-third"];

  return (
    <section className="relative bg-white pb-24 md:pb-32">
      <div className="container-tx">
        <Eyebrow>{contactV2.body.eyebrow}</Eyebrow>
        <Title lines={contactV2.body.title} size="md" />

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Channels — one clean list, each with its own colour badge */}
          <motion.ul
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="grid gap-4"
          >
            {contactPage.channels.map((c, i) => (
              <motion.li key={c.title} variants={fadeUp}>
                <a
                  href={`mailto:${c.value}`}
                  data-cursor="link"
                  className="group flex items-center gap-5 rounded-[1.75rem] bg-white p-5 shadow-soft3 ring-1 ring-third/10 transition-all duration-300 hover:-translate-y-1 hover:ring-secondary md:p-6"
                >
                  <span className={`grid size-14 shrink-0 place-items-center rounded-2xl text-2xl ${badges[i]}`} aria-hidden>
                    {contactV2.channelIcons[i]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="display block text-2xl uppercase leading-none text-third md:text-[1.7rem]">{c.title}</span>
                    <span className="mt-1.5 block break-words text-sm font-bold text-primary underline-offset-4 group-hover:underline">
                      {c.value}
                    </span>
                    <span className="mt-0.5 block text-xs text-third/60">{c.note}</span>
                  </span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-third/10 text-third transition-colors group-hover:border-secondary group-hover:bg-secondary" aria-hidden>
                    →
                  </span>
                </a>
              </motion.li>
            ))}
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
            <FloatFood
              src="/assets/v2/signatures/sig-04.png"
              alt="Honey-butter biscuits"
              className="-right-6 -top-14 hidden size-36 md:block"
              amp={8}
              sizes="150px"
            />
            <motion.h2 variants={fadeUp} className="display text-4xl uppercase text-third md:text-5xl">
              {contactPage.form.heading}
            </motion.h2>
            <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-2">
              {contactPage.form.subjects.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubject(s)}
                  data-cursor="link"
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-caps transition-colors ${
                    subject === s ? "bg-secondary text-third" : "border-2 border-third/10 text-third/70 hover:border-secondary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </motion.div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <FieldV2 label="Full name" placeholder="Jane Doe" />
              <FieldV2 label="Email" type="email" placeholder="jane@email.com" />
            </div>
            <div className="mt-5">
              <FieldV2 as="textarea" rows={5} label="Message" placeholder="How can we help?" />
            </div>
            <motion.div variants={fadeUp} className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-third/60">
                Regarding: <span className="font-bold text-primary">{subject}</span>
              </p>
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
