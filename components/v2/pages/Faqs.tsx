"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { Title } from "@/components/v2/kit";
import { ClosingCta } from "./shared";
import { faqsPage } from "@/lib/content";
import { faqsV2 } from "@/lib/content-v2/pages";

const fix = (s: string) => faqsV2.fixes.reduce((t, [a, b]) => t.replace(a, b), s);
const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;
/** Answers may carry inline `[label](href)` links; `plain` is what search matches against. */
const GROUPS = faqsPage.groups.map((g) => ({
  ...g,
  items: g.items.map((i) => {
    const a = fix(i.a);
    return { q: i.q, a, plain: a.replace(LINK, "$1") };
  }),
}));

/** Render an answer: blank lines split paragraphs, `[label](href)` becomes a link. */
function Answer({ text }: { text: string }) {
  return (
    <div className="space-y-4 px-5 pb-5 text-base leading-relaxed text-third/85 md:px-8 md:pb-6 md:text-lg">
      {text.split(/\n{2,}/).map((para, p) => {
        const parts: React.ReactNode[] = [];
        let last = 0;
        for (const m of para.matchAll(LINK)) {
          parts.push(para.slice(last, m.index));
          parts.push(
            <Link key={m.index} href={m[2]} className="font-bold text-primary underline underline-offset-4 hover:text-third">
              {m[1]}
            </Link>,
          );
          last = m.index! + m[0].length;
        }
        parts.push(para.slice(last));
        return <p key={p}>{parts}</p>;
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- hero */
export function FaqsHeroV2() {
  return (
    <section className="bg-white pb-8 pt-24 text-third md:pb-14 md:pt-32 lg:pt-44">
      <div className="container-tx">
        <Title as="h1" lines={faqsV2.hero.title} size="lg" className="!mt-0 md:text-[5.4rem]" />
      </div>
    </section>
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
        items: g.items.filter((i) => !term || i.q.toLowerCase().includes(term) || i.plain.toLowerCase().includes(term)),
      }))
      .filter((g) => g.items.length);
  }, [q, group]);

  return (
    <section id="faq-search" className="relative scroll-mt-28 bg-white pb-10 md:pb-14">
      <div className="container-tx grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-12">
        {/* min-w-0: the swipeable chip row must not widen the grid track */}
        <div className="min-w-0">
          {/* Search */}
          <label className="flex items-center gap-3 rounded-full border-2 border-third/10 bg-white px-5 py-3.5 shadow-soft3 focus-within:border-secondary md:gap-4 md:px-6 md:py-4">
            <svg viewBox="0 0 24 24" className="size-6 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={faqsV2.hero.search}
              className="w-full min-w-0 bg-transparent font-texas text-lg text-third md:text-xl placeholder:text-third/40 focus:outline-none"
              aria-label="Search FAQs"
            />
            {q && (
              <button onClick={() => setQ("")} className="text-sm font-bold uppercase tracking-caps text-third/50 hover:text-primary">
                Clear
              </button>
            )}
          </label>

          {/* Category chips */}
          <div className="chip-row mt-5 gap-2 md:mt-6">
            {["All", ...GROUPS.map((g) => g.title)].map((t) => (
              <button
                key={t}
                onClick={() => setGroup(t)}
                data-cursor="link"
                className={`rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-caps transition-colors md:px-5 ${
                  group === t ? "bg-third text-white" : "bg-third/5 text-third/70 hover:bg-secondary hover:text-third"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div className="mt-8 space-y-10 md:mt-12 md:space-y-14">
            {results.length === 0 && <p className="rounded-3xl bg-secondary/15 p-8 text-lg text-third/80">{faqsV2.empty}</p>}
            {results.map((g) => (
              <div key={g.title}>
                <h2 className="display text-[2.1rem] uppercase text-third md:text-5xl">
                  {g.title}
                </h2>
                <div className="mt-4 space-y-2.5 md:mt-6 md:space-y-3">
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
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-8 md:py-5"
                        >
                          <span className="font-texas text-lg font-bold leading-snug text-third md:text-xl">{item.q}</span>
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
                              <Answer text={item.a} />
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
