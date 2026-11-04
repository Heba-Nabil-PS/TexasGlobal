"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { OutlineStar, Stamp } from "@/components/v2/kit";
import { ClosingCta, FloatFood, HeroV2 } from "./shared";
import { faqsPage } from "@/lib/content";
import { faqsV2 } from "@/lib/content-v2/pages";

const fix = (s: string) => faqsV2.fixes.reduce((t, [a, b]) => t.replace(a, b), s);
const GROUPS = faqsPage.groups.map((g) => ({ ...g, items: g.items.map((i) => ({ q: i.q, a: fix(i.a) })) }));

/* ---------------------------------------------------------------- hero */
export function FaqsHeroV2() {
  const h = faqsV2.hero;
  return (
    <HeroV2
      eyebrow={h.eyebrow}
      title={h.title}
      body={h.body}
      decor={
        <div aria-hidden className="pointer-events-none absolute -right-20 top-20 hidden size-[640px] rounded-full border-[48px] border-secondary/25 lg:block" />
      }
      visual={
        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          {["?", "!", "?"].map((g, i) => (
            <motion.span
              key={i}
              aria-hidden
              animate={{ y: [0, -14, 0], rotate: [i * 8 - 8, i * 8, i * 8 - 8] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
              className={`display absolute leading-none ${
                ["left-[2%] top-[4%] text-[9rem] text-primary", "right-[6%] top-[0%] text-[6rem] text-secondary", "right-[0%] bottom-[22%] text-[7rem] text-third"][i]
              }`}
            >
              {g}
            </motion.span>
          ))}
          <FloatFood src="/assets/v2/signatures/sig-04.png" alt="Honey-butter biscuits" className="inset-[10%]" sizes="40vw" />
          <Stamp text={h.stamp} size={120} className="absolute bottom-[4%] left-[4%]" />
        </div>
      }
    >
      <Button href="#faq-search" variant="red">
        Browse all questions
      </Button>
      <Button href="/contact-us" variant="ghost">
        Ask us directly
      </Button>
    </HeroV2>
  );
}

/* ------------------------------------------ search + chips + accordion body */
export function FaqsBodyV2() {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<string>("All");
  const [open, setOpen] = useState<string | null>(GROUPS[0].items[0].q);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return GROUPS.filter((g) => group === "All" || g.title === group)
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => !term || i.q.toLowerCase().includes(term) || i.a.toLowerCase().includes(term)),
      }))
      .filter((g) => g.items.length);
  }, [q, group]);

  return (
    <section id="faq-search" className="relative scroll-mt-28 bg-white pb-24 md:pb-32">
      <div className="container-tx grid gap-12 lg:grid-cols-[1fr_340px]">
        <div>
          {/* Search */}
          <label className="flex items-center gap-4 rounded-full border-2 border-third/10 bg-white px-6 py-4 shadow-soft3 focus-within:border-secondary">
            <svg viewBox="0 0 24 24" className="size-6 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={faqsV2.hero.search}
              className="w-full bg-transparent font-texas text-xl text-third placeholder:text-third/40 focus:outline-none"
              aria-label="Search FAQs"
            />
            {q && (
              <button onClick={() => setQ("")} className="text-sm font-bold uppercase tracking-caps text-third/50 hover:text-primary">
                Clear
              </button>
            )}
          </label>

          {/* Category chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            {["All", ...GROUPS.map((g) => g.title)].map((t) => (
              <button
                key={t}
                onClick={() => setGroup(t)}
                data-cursor="link"
                className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-caps transition-colors ${
                  group === t ? "bg-third text-white" : "bg-third/5 text-third/70 hover:bg-secondary hover:text-third"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div className="mt-12 space-y-14">
            {results.length === 0 && <p className="rounded-3xl bg-secondary/15 p-8 text-lg text-third/80">{faqsV2.empty}</p>}
            {results.map((g) => (
              <div key={g.title}>
                <h2 className="display flex items-center gap-3 text-4xl uppercase text-third md:text-5xl">
                  <span className="size-3 rotate-45 bg-primary" />
                  {g.title}
                </h2>
                <div className="mt-6 space-y-3">
                  {g.items.map((item) => {
                    const isOpen = open === item.q;
                    return (
                      <div
                        key={item.q}
                        className={`overflow-hidden rounded-3xl transition-colors ${isOpen ? "bg-secondary" : "bg-third/[0.04] hover:bg-third/[0.07]"}`}
                      >
                        <button
                          onClick={() => setOpen(isOpen ? null : item.q)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left md:px-8"
                        >
                          <span className="font-texas text-xl font-bold text-third">{item.q}</span>
                          <span
                            className={`grid size-9 shrink-0 place-items-center rounded-full text-xl font-bold transition-transform ${
                              isOpen ? "rotate-45 bg-third text-white" : "bg-white text-primary"
                            }`}
                          >
                            +
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <p className="px-6 pb-6 text-lg leading-relaxed text-third/85 md:px-8">{item.a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky side card */}
        <aside className="lg:sticky lg:top-36 lg:self-start">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-8 pt-10 text-white">
            <OutlineStar className="absolute -right-10 -top-10 size-48 opacity-70" />
            <p className="display relative text-4xl uppercase leading-[0.95]">{faqsV2.side.title}</p>
            <p className="relative mt-3 text-white/80">{faqsV2.side.body}</p>
            <div className="relative mt-6">
              <Button href={faqsV2.side.cta.href} variant="yellow">
                {faqsV2.side.cta.label}
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- closing */
export function FaqsCtaV2() {
  const c = faqsV2.cta;
  return (
    <ClosingCta eyebrow={c.eyebrow} title={c.title} body={c.body} image="/assets/v2/crunch/crunch-04.png">
      <Button href={c.primary.href} variant="red">
        {c.primary.label}
      </Button>
      <Button href={c.secondary.href} variant="ghost">
        {c.secondary.label}
      </Button>
    </ClosingCta>
  );
}
