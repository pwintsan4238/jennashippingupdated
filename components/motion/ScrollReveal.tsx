"use client";

import { useEffect } from "react";

const STAGGER_MS = 90;
const MAX_DELAY_MS = 450;

/**
 * Site-wide scroll intro animation. Any element with `data-reveal` ("up" default, "fade", "image")
 * starts hidden (see globals.css, only when <html> has the `reveal` class) and animates in when it
 * enters the viewport. Elements entering together are staggered. New elements (route changes,
 * filtered lists) are picked up automatically.
 */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("reveal")) return;

    const seen = new WeakSet<Element>();

    const finish = (el: HTMLElement) => {
      // drop the reveal styles once done so hover transitions on the element behave normally
      window.setTimeout(() => {
        el.removeAttribute("data-reveal");
        el.classList.remove("is-revealed");
        el.style.removeProperty("--reveal-delay");
      }, 1400);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
        entering.forEach((e, i) => {
          const el = e.target as HTMLElement;
          el.style.setProperty("--reveal-delay", `${Math.min(i * STAGGER_MS, MAX_DELAY_MS)}ms`);
          el.classList.add("is-revealed");
          io.unobserve(el);
          finish(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    const scan = () => {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
