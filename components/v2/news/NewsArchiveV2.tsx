"use client";

import type { ReactNode } from "react";
import BrandArrow from "@/components/ui/BrandArrow";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { newsPage } from "@/lib/content";
import { newsV2 } from "@/lib/content-v2/news";
import { ease } from "@/lib/motion";
import { Eyebrow, Title } from "@/components/v2/kit";

const ALL = "All";

/**
 * Archive grid in the informative site's card style (white card, 16:9 photo,
 * calendar date, title, three-line summary, yellow "Read more ›"), paginated
 * six at a time so the page length stays fixed however many releases pile up.
 */
export default function NewsArchiveV2() {
  const { perPage } = newsV2.archive;
  const [filter, setFilter] = useState(ALL);
  const [page, setPage] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);

  const chips = useMemo(() => [ALL, ...newsPage.categories], []);
  const list = useMemo(
    () => (filter === ALL ? newsPage.articles : newsPage.articles.filter((a) => a.category === filter)),
    [filter]
  );
  const pages = Math.max(1, Math.ceil(list.length / perPage));
  const current = list.slice(page * perPage, page * perPage + perPage);

  const goTo = (p: number) => {
    setPage(Math.max(0, Math.min(pages - 1, p)));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative bg-white py-20 md:py-28">
      <div ref={topRef} className="container-tx scroll-mt-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>{newsV2.archive.eyebrow}</Eyebrow>
            <Title lines={newsV2.archive.heading} size="md" />
          </div>
          <span className="text-sm font-bold uppercase tracking-caps text-third/50">
            {list.length} {list.length === 1 ? "story" : "stories"} · page {page + 1} of {pages}
          </span>
        </div>

        {/* Category chips */}
        <div className="mt-10 flex flex-wrap gap-3">
          {chips.map((c) => {
            const active = c === filter;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setFilter(c);
                  setPage(0);
                }}
                data-cursor="link"
                className={`rounded-full border-2 px-5 py-2 text-xs font-extrabold uppercase tracking-caps transition-colors ${
                  active ? "border-primary bg-primary text-white" : "border-third/15 text-third/70 hover:border-secondary hover:text-third"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${filter}-${page}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: ease.out }}
            className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {current.map((a) => (
              <article
                key={a.href}
                className="flex flex-col overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-third/5 transition-shadow duration-300 hover:shadow-lg"
              >
                <a href={a.href} target="_blank" rel="noopener noreferrer" data-cursor="view" className="group flex h-full flex-col">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={a.image}
                      alt={a.title}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-caps text-white">
                      {a.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center text-sm text-gray-500">
                      <CalendarIcon />
                      {a.date}
                    </div>
                    <h3 className="mb-3 line-clamp-3 font-texas text-xl font-bold text-gray-900 transition-colors group-hover:text-secondary">
                      {a.title}
                    </h3>
                    <p className="mb-4 line-clamp-3 text-gray-600">{a.excerpt}</p>
                    <div className="mt-auto pt-4">
                      <span className="inline-flex items-center font-texas font-bold uppercase tracking-wide text-secondary group-hover:underline">
                        {newsV2.archive.readMore}
                        <BrandArrow className="ms-1 size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </a>
              </article>
            ))}
          </motion.div>
        </AnimatePresence>

        {list.length === 0 && <p className="mt-16 text-center text-third/60">{newsV2.archive.empty}</p>}

        {/* Pagination */}
        {pages > 1 && (
          <nav aria-label="Stories pages" className="mt-14 flex items-center justify-center gap-2">
            <PageBtn label={<><BrandArrow dir="left" /> Prev</>} disabled={page === 0} onClick={() => goTo(page - 1)} />
            {Array.from({ length: pages }, (_, p) => (
              <PageBtn key={p} label={String(p + 1)} active={p === page} onClick={() => goTo(p)} round />
            ))}
            <PageBtn label={<>Next <BrandArrow /></>} disabled={page === pages - 1} onClick={() => goTo(page + 1)} />
          </nav>
        )}
      </div>
    </section>
  );
}

function PageBtn({
  label,
  onClick,
  active = false,
  disabled = false,
  round = false,
}: {
  label: ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  round?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-current={active ? "page" : undefined}
      data-cursor="link"
      className={`${round ? "size-12" : "h-12 px-5"} rounded-full border-2 font-texas text-sm font-bold uppercase tracking-wide transition-colors disabled:pointer-events-none disabled:opacity-30 ${
        active ? "border-primary bg-primary text-white" : "border-third text-third hover:border-secondary hover:bg-secondary"
      }`}
    >
      {label}
    </button>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="me-1.5 size-4" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
