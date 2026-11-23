"use client";

/**
 * HashScroll — makes every in-page `#anchor` link actually work.
 *
 * Lenis owns the scroll position (globals.css forces `scroll-behavior: auto`),
 * so the browser's native hash jump either does nothing or gets immediately
 * overwritten on the next Lenis frame. That is why `<Button href="#apply">`
 * looked dead. One delegated listener fixes every anchor on the site at once:
 *
 *  - clicks on any same-page `#hash` link are handed to `lenis.scrollTo`
 *  - the fixed header height is measured and subtracted, so the target lands
 *    below the nav instead of under it
 *  - the URL is updated with replaceState — never a hash jump, which would
 *    fight the animation we just started
 *  - the destination gets `data-flash` for a beat so you can SEE where you
 *    landed (the ring pulse lives in globals.css)
 *
 * Deep links (`/franchising#apply` typed or pasted) get the same treatment
 * once on mount, after layout has settled.
 *
 * A target that sets its own `scroll-margin-top` (e.g. the /franchising
 * sections, which also sit under a sticky section nav) is trusted to know its
 * offset: Lenis applies that margin itself, so the header offset is skipped.
 * Targets marked `data-no-flash` skip the arrival ring (whole sections).
 * `prefers-reduced-motion` gets an instant jump instead of the eased scroll.
 */

import { useCallback, useEffect } from "react";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";

/** how long the destination stays highlighted — matches the CSS animation */
const FLASH_MS = 1800;
/** breathing room between the header and the top of the target */
const GAP = 16;

/** the target's own scroll-margin-top, if it declares one */
function ownMargin(el: HTMLElement) {
  const m = Number.parseFloat(getComputedStyle(el).scrollMarginTop);
  return Number.isFinite(m) && m > 0 ? m : 0;
}

export default function HashScroll() {
  const lenis = useLenis();
  const pathname = usePathname();

  const headerOffset = () => {
    const h = document.querySelector("header");
    // bottom edge, not height: the nav floats a little below the top of the viewport
    return (h instanceof HTMLElement ? Math.max(0, h.getBoundingClientRect().bottom) : 0) + GAP;
  };

  const flash = useCallback((el: HTMLElement) => {
    if (el.hasAttribute("data-no-flash")) return;
    el.setAttribute("data-flash", "");
    window.setTimeout(() => el.removeAttribute("data-flash"), FLASH_MS);
  }, []);

  const goTo = useCallback(
    (hash: string, instant = false) => {
      // `#apply` is a valid selector, but ids like `#1` are not — guard it.
      let el: HTMLElement | null = null;
      try {
        el = document.querySelector<HTMLElement>(hash);
      } catch {
        el = document.getElementById(hash.slice(1));
      }
      if (!el) return false;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const jump = instant || reduce;
      const margin = ownMargin(el);

      if (lenis) {
        // Lenis subtracts scroll-margin-top on its own; only add the header
        // offset for targets that don't declare one.
        lenis.scrollTo(el, {
          offset: margin ? 0 : -headerOffset(),
          duration: jump ? 0 : 1.15,
          immediate: jump,
        });
      } else {
        // Lenis not mounted yet — plain jump still works.
        const y = el.getBoundingClientRect().top + window.scrollY - (margin || headerOffset());
        window.scrollTo({ top: y, behavior: jump ? "auto" : "smooth" });
      }

      flash(el);
      return true;
    },
    [lenis, flash],
  );

  /* ---- every same-page anchor click, delegated ---- */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // let modified clicks (new tab, download, middle button) behave natively
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;

      const a = (e.target as Element | null)?.closest?.("a");
      if (!(a instanceof HTMLAnchorElement) || a.target === "_blank") return;

      const href = a.getAttribute("href");
      if (!href || href === "#" || !href.includes("#")) return;

      // same-document only: "#apply", or "/franchising#apply" while already there
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname || url.origin !== window.location.origin) return;

      if (goTo(url.hash)) {
        e.preventDefault();
        window.history.replaceState(null, "", url.hash);
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [goTo]);

  /* ---- deep link on arrival (first load AND client-side navigation, e.g. the
          nav's "Franchise with us" → /franchising#apply-form) ---- */
  useEffect(() => {
    if (!window.location.hash) return;
    const hash = window.location.hash;
    // one frame for the layout, a beat more for the preloader to let go
    const t1 = window.setTimeout(() => goTo(hash), 400);
    // images above the target can still push it down: correct once more if it drifted
    const t2 = window.setTimeout(() => {
      let el: HTMLElement | null = null;
      try {
        el = document.querySelector<HTMLElement>(hash);
      } catch {
        el = document.getElementById(hash.slice(1));
      }
      if (el && Math.abs(el.getBoundingClientRect().top - (ownMargin(el) || headerOffset())) > 12)
        goTo(hash);
    }, 1700);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenis, pathname]);

  return null;
}
