"use client";

/**
 * FranchiseTabs — the four franchise.texaschicken.com pages (Why Us,
 * Opportunities, Investment, Support) stacked in order on /franchising, under
 * a sticky section nav. (The file keeps its old name; nothing is tabbed now.)
 *
 * Behaviour worth knowing about:
 *  - every section is rendered and visible: no hidden panels
 *  - the nav items are plain `<a href="#id">` links. The site-wide HashScroll
 *    provider does the (Lenis) scroll and the replaceState; it honours each
 *    section's scroll-margin-top and prefers-reduced-motion. Deep links such as
 *    /franchising#investment are handled there too.
 *  - scrollspy is an IntersectionObserver band just under the sticky nav; the
 *    active link gets aria-current="true" plus the sliding red pill
 *  - under 768px the nav is a swipeable row of label-only chips, and the
 *    active chip is scrolled into view horizontally
 */

import BrandArrow from "@/components/ui/BrandArrow";
import BrandStar from "@/components/ui/BrandStar";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";
import OpportunityMap from "@/components/sections/OpportunityMap";
import { franchisePage } from "@/lib/content";
import { staggerContainer, fadeUp, ease } from "@/lib/motion";

type Tab = (typeof franchisePage.tabs)[number];
type PanelProps = { tab: Tab };

const TABS = franchisePage.tabs;
const IDS = TABS.map((t) => t.id);

/** Index-aligned with TABS. */
const PANELS = [WhyUs, Opportunities, Investment, Support];

/** CTA closing each section. All point at the application form further down. */
const CTAS = [
  { label: "Get started", href: "#apply-form" },
  { label: "Explore open territories", href: "#apply-form" },
  { label: "Apply now", href: "#apply-form" },
  { label: "Apply now", href: "#apply-form" },
];

/**
 * The sticky nav sits under the fixed site header (72px phones, 132px lg).
 * `--frnav-h` is the nav's measured height; the fallbacks match its
 * server-rendered size so the margin is right before the first measurement.
 */
const SECTION_SCROLL_MARGIN =
  "scroll-mt-[calc(72px_+_var(--frnav-h,84px))] lg:scroll-mt-[calc(132px_+_var(--frnav-h,100px))]";

/* ------------------------------------------------------------------ shell */
export default function FranchiseTabs() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  /** section a nav click is travelling to; scrollspy holds still until we arrive */
  const lockRef = useRef<number | null>(null);
  const lockTimer = useRef<number | undefined>(undefined);
  /** re-runs the scrollspy pick (set by the observer effect) */
  const resyncRef = useRef<() => void>(() => {});

  // ---- scrollspy ---------------------------------------------------------
  useEffect(() => {
    const nav = navRef.current;
    const root = rootRef.current;
    const end = endRef.current;
    const sections = IDS.map((id) => document.getElementById(id));
    if (!nav || !root || !end || sections.some((s) => !s)) return;

    const inBand = new Set<number>();
    let atEnd = false;

    const pick = () => {
      // The end of the block is on screen: the last section wins even if it is
      // too short to ever reach the band under the nav.
      if (atEnd && inBand.has(IDS.length - 1)) return IDS.length - 1;
      for (let i = 0; i < IDS.length; i++) if (inBand.has(i)) return i;
      return null;
    };

    const update = () => {
      const next = pick();
      if (next === null) return; // above or below the block: keep the last value
      if (lockRef.current !== null) {
        if (next !== lockRef.current) return;
        lockRef.current = null;
      }
      setActive(next);
    };
    // let a nav click's timeout release the lock and re-sync
    resyncRef.current = update;

    let bandIO: IntersectionObserver | null = null;
    const build = () => {
      bandIO?.disconnect();
      inBand.clear();
      // `--frnav-h` feeds the sections' scroll-margin-top (no layout impact)
      root.style.setProperty("--frnav-h", `${nav.offsetHeight}px`);
      // Band: from the nav's bottom edge (when stuck) down 40% of what's left.
      const line = (Number.parseFloat(getComputedStyle(nav).top) || 0) + nav.offsetHeight;
      const vh = window.innerHeight;
      const band = Math.max(24, (vh - line) * 0.4);
      const bottom = Math.max(0, vh - line - band);
      bandIO = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const i = sections.indexOf(e.target as HTMLElement);
            if (e.isIntersecting) inBand.add(i);
            else inBand.delete(i);
          }
          update();
        },
        { rootMargin: `-${Math.round(line)}px 0px -${Math.round(bottom)}px 0px` },
      );
      sections.forEach((s) => bandIO!.observe(s!));
    };

    const endIO = new IntersectionObserver(([e]) => {
      atEnd = e.isIntersecting;
      update();
    });
    endIO.observe(end);

    build();
    // Rebuild when the band moves: viewport resize, or the nav changing height
    // (breakpoint, font load).
    let raf = 0;
    const rebuild = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(build);
    };
    const ro = new ResizeObserver(rebuild);
    ro.observe(nav);
    window.addEventListener("resize", rebuild);

    return () => {
      cancelAnimationFrame(raf);
      bandIO?.disconnect();
      endIO.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", rebuild);
      window.clearTimeout(lockTimer.current);
    };
  }, []);

  // ---- nav click -----------------------------------------------------------
  // HashScroll (document listener) does the scroll + replaceState; here we only
  // light the target immediately, hold the scrollspy while the page travels
  // past the sections in between, and move focus like a native anchor would.
  const onPick = useCallback((i: number) => {
    setActive(i);
    lockRef.current = i;
    window.clearTimeout(lockTimer.current);
    lockTimer.current = window.setTimeout(() => {
      lockRef.current = null;
      resyncRef.current();
    }, 1600);
    document.getElementById(IDS[i])?.focus({ preventScroll: true });
  }, []);

  // ---- keep the active chip in view in the (phone) scrolling row -----------
  useEffect(() => {
    const row = rowRef.current;
    const link = linkRefs.current[active];
    if (!row || !link || row.scrollWidth <= row.clientWidth) return;
    const li = link.parentElement as HTMLElement;
    const left = li.offsetLeft - (row.clientWidth - li.offsetWidth) / 2;
    row.scrollTo({ left: Math.max(0, left), behavior: reduce ? "auto" : "smooth" });
  }, [active, reduce]);

  return (
    <div ref={rootRef} className="bg-cream-200 pb-10 md:pb-14">
      {/* ---- sticky section nav ----------------------------------------- */}
      {/* The band echoes the site nav rather than bleeding edge to edge: same
          1150px / px-8 box the desktop header uses, floating on the section. */}
      <nav
        ref={navRef}
        aria-label="Franchising sections"
        className="sticky top-[72px] z-30 py-3 lg:top-[132px]"
      >
        <div className="mx-auto flex w-full max-w-[1150px] justify-center px-5 lg:px-8">
          <ul
            ref={rowRef}
            className="flex max-w-full gap-1 overflow-x-auto overscroll-x-contain rounded-full border border-ink/10 bg-paper/90 p-2 shadow-soft3 backdrop-blur-md [scrollbar-width:none] md:gap-2 [&::-webkit-scrollbar]:hidden"
          >
            {TABS.map((t, i) => {
              const on = i === active;
              return (
                <li key={t.id} className="shrink-0">
                  <a
                    ref={(el) => {
                      linkRefs.current[i] = el;
                    }}
                    href={`#${t.id}`}
                    aria-current={on ? "true" : undefined}
                    onClick={(e) => {
                      // modified clicks (new tab etc.) are left to the browser
                      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                      onPick(i);
                    }}
                    data-cursor="link"
                    className="relative flex min-h-11 items-center rounded-full px-4 py-2 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tex-red md:px-7 md:py-3"
                  >
                    {on && (
                      <motion.span
                        layoutId="fr-tab"
                        transition={
                          reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }
                        }
                        className="absolute inset-0 rounded-full bg-tex-red"
                      />
                    )}
                    <span className="relative block">
                      <span
                        className={`block whitespace-nowrap text-sm font-extrabold uppercase tracking-caps ${
                          on ? "text-cream" : "text-ink"
                        }`}
                      >
                        {t.label}
                      </span>
                      <span
                        className={`hidden text-[0.68rem] font-semibold ${
                          on ? "text-cream/70" : "text-ink-400"
                        } md:block`}
                      >
                        {t.blurb}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* ---- the four sections, in order ----------------------------------
          tabIndex -1 so a nav click can hand focus to the section (as a native
          anchor jump would) without making sections Tab stops. */}
      <div className="container-tx">
        {PANELS.map((Panel, i) => {
          const t = TABS[i];
          return (
            <section
              key={t.id}
              id={t.id}
              aria-labelledby={`${t.id}-label`}
              tabIndex={-1}
              data-no-flash
              className={`${SECTION_SCROLL_MARGIN} outline-none ${
                i === 0 ? "pt-16 md:pt-20" : "mt-20 border-t border-ink/10 pt-20 md:mt-28 md:pt-28"
              }`}
            >
              <Panel tab={t} />
              <div className="mt-12 flex md:mt-14">
                <Button href={CTAS[i].href} variant="red">
                  {CTAS[i].label}
                  <BrandArrow />
                </Button>
              </div>
            </section>
          );
        })}
        {/* marks the end of the block for the scrollspy (see `atEnd`) */}
        <div ref={endRef} aria-hidden className="h-px" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- section 1 */
function WhyUs({ tab }: PanelProps) {
  const { whyUs } = franchisePage;
  return (
    <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <PanelHeading tab={tab} eyebrow="Why us" heading={whyUs.heading} />
        {whyUs.points.map((p) => (
          <motion.p
            key={p.k}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: "some" }}
            className="mt-5 max-w-xl text-base leading-relaxed text-ink-600 md:text-lg"
          >
            <span className="font-bold text-ink">{p.k}</span> {p.v}
          </motion.p>
        ))}
      </div>

      {/* "See us opening around the world" — photo slider (from the Why Us page) */}
      <OpeningsSlider />
    </div>
  );
}

/** Line icons for the "partner we're looking for" cards — one per criterion. */
function ProfileIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    // storefront
    store: (
      <>
        <path d="M4 4h16l1.5 5h-19z" />
        <path d="M4.5 9v11h15V9" />
        <path d="M10 20v-6h4v6" />
      </>
    ),
    // several buildings
    units: (
      <>
        <path d="M2 21h20" />
        <path d="M4 21V9l5-3v15" />
        <path d="M9 21V3l7 4v14" />
        <path d="M16 21v-8l4 2v6" />
      </>
    ),
    // map pin
    site: (
      <>
        <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </>
    ),
    // heart
    values: <path d="M12 20s-7.5-4.6-9.3-9.2C1.4 7.4 3.6 4 7 4c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8C19.5 15.4 12 20 12 20z" />,
  };
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths[name]}
    </svg>
  );
}

const AUTOPLAY_MS = 4500;

function OpeningsSlider() {
  const slides = franchisePage.whyUs.openings;
  const count = slides.length;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // the section is always on the page now, so only autoplay while it is seen
  const onScreen = useInView(ref, { amount: 0.25 });
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (to: number, d: number) => {
      setDir(d);
      setIndex(((to % count) + count) % count);
    },
    [count]
  );

  // Gentle autoplay; pauses on hover/focus, off screen, and when the visitor prefers reduced motion.
  useEffect(() => {
    if (reduce || paused || !onScreen) return;
    const t = window.setTimeout(() => go(index + 1, 1), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [index, paused, reduce, onScreen, go]);

  const slide = slides[index];

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="flex flex-col"
      aria-roledescription="carousel"
      aria-label="See us opening around the world"
    >
      <span className="eyebrow text-tex-red"><BrandStar /> See us opening around the world</span>

      <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-ink shadow-soft3">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: `${dir * 8}%`, scale: 1.04 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: `${dir * -8}%` }}
            transition={{ duration: 0.6, ease: ease.out }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(index + 1, 1);
              else if (info.offset.x > 60) go(index - 1, -1);
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}: ${slide.name}`}
          >
            <Image
              src={slide.image}
              alt={slide.name}
              fill
              sizes="(max-width: 1024px) 92vw, 42vw"
              className="pointer-events-none select-none object-cover"
              draggable={false}
              priority={index === 0}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-7">
              <p className="display text-2xl uppercase leading-none text-cream md:text-3xl">{slide.name}</p>
              <span className="display shrink-0 text-lg text-tex-yellow">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* controls: arrows (looping), progress + counter */}
      <div className="mt-5 flex items-center gap-4">
        <button
          aria-label="Previous opening"
          onClick={() => go(index - 1, -1)}
          className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-ink text-xl text-ink transition-colors hover:bg-ink hover:text-cream"
          data-cursor="link"
        >
          <BrandArrow dir="left" />
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="h-1 overflow-hidden rounded-full bg-ink/10">
            <motion.div
              className="h-full rounded-full bg-tex-red"
              animate={{ width: `${((index + 1) / count) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-caps text-ink/50">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")} · Swipe or use the arrows
          </span>
        </div>
        <button
          aria-label="Next opening"
          onClick={() => go(index + 1, 1)}
          className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-ink text-xl text-ink transition-colors hover:bg-ink hover:text-cream"
          data-cursor="link"
        >
          <BrandArrow />
        </button>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------- section 2 */
function Opportunities({ tab }: PanelProps) {
  const { opportunities } = franchisePage;
  return (
    <div>
      {/* Intro + the US note side by side, so the right of the heading isn't empty */}
      <div className="grid items-end gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
        <div>
          <PanelHeading tab={tab} eyebrow="Global opportunities" heading={opportunities.heading} />
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-600 md:text-lg">
            {opportunities.body}
          </p>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: "some" }}
          className="flex flex-col items-start gap-5 rounded-[1.75rem] bg-tex-red p-7 text-cream shadow-soft3 md:p-8"
        >
          <span className="eyebrow text-tex-yellow"><BrandStar /> Looking at the U.S.?</span>
          <p className="text-sm leading-relaxed text-cream/85">{opportunities.usNote}</p>
          <Button
            href={opportunities.usUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="yellow"
          >
            {opportunities.usCta}
          </Button>
        </motion.div>
      </div>

      {/* Every country we do NOT trade in yet, on one interactive map. */}
      <OpportunityMap />
    </div>
  );
}

/* -------------------------------------------------------------- section 3 */
const money = (n: number) => `US$${n.toLocaleString("en-US")}`;

type ModelId = (typeof franchisePage.investment.models)[number]["id"];

/**
 * Totals are SUMMED from the line items (null = not applicable = 0) instead of
 * being typed in next to them, so the headline figure can never drift from the
 * breakdown. Computed at module level: identical on server and client.
 */
const MODEL_TOTALS = Object.fromEntries(
  franchisePage.investment.models.map((m) => [
    m.id,
    franchisePage.investment.lines.reduce((sum, l) => sum + (l[m.id] ?? 0), 0),
  ]),
) as Record<ModelId, number>;
const TOTAL_LOW = Math.min(...Object.values(MODEL_TOTALS));
const TOTAL_HIGH = Math.max(...Object.values(MODEL_TOTALS));

function Investment({ tab }: PanelProps) {
  const { investment } = franchisePage;
  const reduce = useReducedMotion();
  const [model, setModel] = useState<ModelId>("avg");
  const [showLines, setShowLines] = useState(false);
  const current = investment.models.find((m) => m.id === model)!;
  const total = MODEL_TOTALS[model];
  const peak = Math.max(...investment.lines.map((l) => l[model] ?? 0));
  const lowTier = investment.models.find((m) => MODEL_TOTALS[m.id] === TOTAL_LOW)!.tier;
  const highTier = investment.models.find((m) => MODEL_TOTALS[m.id] === TOTAL_HIGH)!.tier;

  return (
    <div>
      <PanelHeading tab={tab} eyebrow="Investment" heading={investment.profileHeading} />

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: "some" }}
        className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {investment.profile.map((p) => (
          <motion.div
            key={p.title}
            variants={fadeUp}
            className="rounded-[1.5rem] border border-ink/10 bg-paper p-6 shadow-soft3"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-tex-red text-tex-yellow">
              <ProfileIcon name={p.icon} />
            </span>
            <h3 className="display mt-4 text-lg uppercase leading-tight text-ink">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{p.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* commercial terms + the all-in range, both visible without expanding */}
      <h3 className="display mt-16 text-2xl uppercase text-ink md:text-3xl">
        {investment.termsHeading}
      </h3>
      <motion.dl
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: "some" }}
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {investment.terms.map((t) => (
          <motion.div
            key={t.label}
            variants={fadeUp}
            className="rounded-2xl border border-ink/10 bg-paper px-6 py-5"
          >
            <dt className="text-xs font-bold uppercase tracking-caps text-ink-400">{t.label}</dt>
            <dd className="display mt-1 text-2xl text-tex-red">
              {t.value}
              {t.note && (
                <span className="ml-2 align-middle text-xs font-bold uppercase tracking-caps text-ink-400">
                  {t.note}
                </span>
              )}
            </dd>
          </motion.div>
        ))}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl bg-ink px-6 py-5 sm:col-span-2 lg:col-span-3 lg:flex lg:items-baseline lg:justify-between lg:gap-6"
        >
          <dt className="text-xs font-bold uppercase tracking-caps text-cream/60">Total investment</dt>
          <dd className="display mt-1 text-2xl text-tex-yellow md:text-3xl lg:mt-0">
            {money(TOTAL_LOW)} – {money(TOTAL_HIGH)}
            <span className="ml-2 align-middle text-xs font-bold uppercase tracking-caps text-cream/60">
              {lowTier} – {highTier}
            </span>
          </dd>
        </motion.div>
      </motion.dl>

      {/* build-model switcher + total, with the line items behind a toggle */}
      <div className="mt-16 overflow-hidden rounded-[1.75rem] border border-ink/10 bg-paper shadow-soft3">
        <div className="flex flex-col gap-6 p-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow text-tex-red"><BrandStar /> Estimated investment</span>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Build model">
              {investment.models.map((m) => {
                const on = m.id === model;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setModel(m.id)}
                    aria-pressed={on}
                    data-cursor="link"
                    className="relative min-h-11 rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-caps transition-colors duration-300"
                  >
                    {on && (
                      <motion.span
                        layoutId="fr-model"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-ink"
                      />
                    )}
                    <span
                      className={`absolute inset-0 rounded-full border ${
                        on ? "border-transparent" : "border-ink/15"
                      }`}
                    />
                    <span className={`relative ${on ? "text-cream" : "text-ink-600"}`}>{m.tier}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-ink-600">{current.name}</p>
          </div>

          <div className="text-left md:text-right" aria-live="polite">
            <span className="text-xs font-bold uppercase tracking-caps text-ink-400">
              Total investment
            </span>
            {/* Plain server-rendered figure (no count-up from 0); only a model
                switch animates. tabular-nums keeps the width steady. */}
            <div className="display text-4xl tabular-nums text-tex-red md:text-5xl">
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={model}
                  className="inline-block"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: reduce ? 0 : 0.22, ease: ease.out }}
                >
                  {money(total)}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowLines((s) => !s)}
          aria-expanded={showLines}
          aria-controls="investment-breakdown"
          data-cursor="link"
          className="flex min-h-11 w-full items-center justify-center gap-2 border-t border-ink/10 px-8 py-3.5 text-xs font-extrabold uppercase tracking-caps text-tex-red transition-colors hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tex-red"
        >
          {showLines ? "Hide full breakdown" : "View full breakdown"}
          <span aria-hidden className={`transition-transform duration-300 ${showLines ? "rotate-180" : ""}`}>
            <BrandArrow dir="down" />
          </span>
        </button>

        {/* Collapsed to height 0 rather than unmounted, so every figure stays in
            the server-rendered HTML; `inert` keeps it out of the a11y tree and
            tab order while shut. */}
        <motion.div
          id="investment-breakdown"
          initial={false}
          animate={{ height: showLines ? "auto" : 0 }}
          transition={{ duration: reduce ? 0 : 0.45, ease: ease.out }}
          className="overflow-hidden"
          inert={!showLines}
        >
          <ul className="divide-y divide-ink/10 border-t border-ink/10">
            {investment.lines.map((l) => {
              const v = l[model];
              return (
                <li
                  key={l.label}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-2.5 md:grid-cols-[minmax(0,1.5fr)_minmax(80px,1fr)_auto] md:gap-6 md:px-8"
                >
                  <span className="text-sm text-ink">{l.label}</span>
                  {/* the bar is a nicety — on a phone the figure is what matters */}
                  <div className="hidden h-1 w-full overflow-hidden rounded-full bg-ink/[0.07] md:block">
                    <motion.span
                      className="block h-full rounded-full bg-tex-yellow"
                      initial={false}
                      animate={{ width: v ? `${(v / peak) * 100}%` : "0%" }}
                      transition={{ duration: reduce ? 0 : 0.5, ease: ease.out }}
                    />
                  </div>
                  <span
                    className={`shrink-0 text-sm font-bold tabular-nums ${
                      v ? "text-ink" : "text-ink-400"
                    }`}
                  >
                    {v ? money(v) : "N/A"}
                  </span>
                </li>
              );
            })}
            <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 bg-cream px-6 py-3.5 md:px-8">
              <span className="text-sm font-extrabold uppercase tracking-caps text-ink">Total investment</span>
              <span className="text-sm font-extrabold tabular-nums text-tex-red">{money(total)}</span>
            </li>
          </ul>
        </motion.div>

        <p className="border-t border-ink/10 bg-cream px-8 py-4 text-xs leading-relaxed text-ink-600">
          {investment.disclaimer}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- section 4 */
function Support({ tab }: PanelProps) {
  const { resources } = franchisePage;
  // Phones only: each card's bullets fold into an accordion (first one open).
  // From md up the bullets are always shown and the toggle is not rendered.
  const [open, setOpen] = useState<Set<string>>(() => new Set([resources.pillars[0].id]));
  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <div>
      <PanelHeading tab={tab} eyebrow="Support" heading={resources.heading} />
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-600 md:text-lg">
        {resources.body}
      </p>

      <div className="mt-12 grid gap-4 md:grid-cols-2 md:gap-5">
        {resources.pillars.map((p, i) => {
          const on = open.has(p.id);
          const titleId = `pillar-${p.id}-title`;
          const bodyId = `pillar-${p.id}`;
          return (
            <article
              key={p.id}
              aria-labelledby={titleId}
              className="overflow-hidden rounded-[1.75rem] border border-ink/10 bg-paper shadow-soft3"
            >
              <div className="flex items-start gap-5 p-7 md:p-8">
                <span className="display shrink-0 text-2xl text-tex-yellow">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 id={titleId} className="display text-xl uppercase text-ink md:text-2xl">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{p.summary}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(p.id)}
                  aria-expanded={on}
                  aria-controls={bodyId}
                  aria-labelledby={titleId}
                  data-cursor="link"
                  className="-mr-1 -mt-1 grid size-11 shrink-0 place-items-center rounded-full border border-ink/15 text-lg text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-tex-red md:hidden"
                >
                  <span
                    aria-hidden
                    className={`transition-transform duration-300 ${on ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
              </div>

              {/* grid-rows 0fr→1fr animates to the content's height in CSS only;
                  `invisible` (transitioned, so it flips after the close) keeps the
                  folded bullets out of the a11y tree. Always open from md up. */}
              <div
                id={bodyId}
                className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out md:visible md:grid-rows-[1fr] ${
                  on ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="grid gap-8 border-t border-ink/10 p-7 sm:grid-cols-2 md:p-8">
                    {p.groups.map((g) => (
                      <div key={g.title}>
                        <h4 className="text-xs font-bold uppercase tracking-caps text-tex-red">
                          {g.title}
                        </h4>
                        <ul className="mt-4 flex flex-col gap-2.5">
                          {g.items.map((it) => (
                            <li key={it} className="flex gap-3 text-sm leading-relaxed text-ink-600">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-tex-yellow" />
                              {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- shared */
/**
 * Section heading: the nav's label line (eyebrow + the nav subtitle) and the
 * section's h2. The eyebrow carries the id the <section> is labelled by.
 */
function PanelHeading({ tab, eyebrow, heading }: { tab: Tab; eyebrow: string; heading: string }) {
  return (
    <div>
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: "some" }}
        className="flex flex-wrap items-center gap-x-3 gap-y-1"
      >
        <span id={`${tab.id}-label`} className="eyebrow text-tex-red">
          <BrandStar /> {eyebrow}
        </span>
        <span className="text-sm font-semibold text-ink-400">{tab.blurb}</span>
      </motion.p>
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: "some" }}
        className="display mt-4 max-w-2xl text-4xl uppercase leading-[0.95] text-ink sm:text-5xl"
      >
        {heading}
      </motion.h2>
    </div>
  );
}
