"use client";

import { Fragment, type ReactNode } from "react";
import PageTitle from "@/components/v2/pages/PageTitle";

/** A paragraph, a sub-heading, a bullet list or a table. */
export type LegalBlock =
  | string
  | { h: string }
  | { ul: string[] }
  | { table: { head: string[]; rows: string[][] } };

type LegalSection = { id: string; title: string; body: LegalBlock[] };

/** Turns emails and URLs inside policy text into links. */
function linkify(text: string): ReactNode {
  const re = /([\w.+-]+@[\w-]+\.[\w.]+[a-z])|((?:https?:\/\/|www\.)[^\s,;)]+[^\s.,;)]|\b(?:[\w-]+\.)+com\/[\w/-]+)/gi;
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    const v = m[0];
    const href = m[1] ? `mailto:${v}` : v.startsWith("http") ? v : `https://${v}`;
    out.push(
      <a key={i} href={href} target={m[1] ? undefined : "_blank"} rel="noopener noreferrer" className="break-words text-tex-red underline-offset-2 hover:underline">
        {v}
      </a>,
    );
    last = i + v.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out.map((n, k) => <Fragment key={k}>{n}</Fragment>);
}

function Block({ b }: { b: LegalBlock }) {
  if (typeof b === "string") return <p className="leading-relaxed text-ink-600">{linkify(b)}</p>;
  if ("h" in b) return <h3 className="display pt-2 text-xl uppercase leading-tight text-ink">{b.h}</h3>;
  if ("ul" in b)
    return (
      <ul className="list-disc space-y-2 pl-5 leading-relaxed text-ink-600 marker:text-tex-red">
        {b.ul.map((li, i) => (
          <li key={i}>{linkify(li)}</li>
        ))}
      </ul>
    );
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-ink/10">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead className="bg-ink/[0.04]">
          <tr>
            {b.table.head.map((h) => (
              <th key={h} className="px-4 py-3 font-bold uppercase tracking-wide text-ink">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {b.table.rows.map((r, i) => (
            <tr key={i} className="border-t border-ink/10 align-top">
              {r.map((c, j) => (
                <td key={j} className={`px-4 py-3 leading-relaxed ${j === 0 ? "font-semibold text-ink" : "text-ink-600"}`}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Shared layout for legal / policy pages (Privacy, Terms). Plain page title,
 * a sticky table of contents and a readable prose column — so utility pages
 * still feel part of the same production.
 */
export default function LegalDoc({
  hero,
  updated,
  sections,
}: {
  hero: { eyebrow: string; title: string[]; subtitle?: string };
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageTitle title={hero.title.join(" ").replace(/\.$/, "")} />

      <section className="bg-cream pb-10 pt-10 md:pb-12 md:pt-14">
        <div className="container-tx grid gap-12 lg:grid-cols-[240px_1fr]">
          {/* Table of contents */}
          {/* data-lenis-prevent: let the mouse wheel scroll this list instead of the page.
              top-64 keeps it clear of the floating menu bar. */}
          <aside
            data-lenis-prevent
            className="lg:sticky lg:top-64 lg:max-h-[calc(100vh-17rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:pr-3"
          >
            <p className="text-xs font-bold uppercase tracking-caps text-ink/40">{updated}</p>
            <nav className="mt-5 flex flex-col gap-2.5 border-l-2 border-ink/10 pl-4">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  data-cursor="link"
                  className="text-sm text-ink-600 transition-colors hover:text-tex-red"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Prose */}
          {/* Static on purpose: a fade-in tied to "30% visible" never fires for
              sections taller than the screen, leaving blank gaps. */}
          <div className="min-w-0 max-w-3xl space-y-10">
            {sections.map((s) => (
              <div key={s.id} id={s.id} className="scroll-mt-64">
                <h2 className="display text-2xl uppercase leading-tight text-ink md:text-3xl">
                  {s.title}
                </h2>
                <div className="mt-4 space-y-4">
                  {s.body.map((b, i) => (
                    <Block key={i} b={b} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
