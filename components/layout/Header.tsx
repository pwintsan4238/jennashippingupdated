"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { nav, site } from "@/lib/site";
import { asset } from "@/lib/asset";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 print:hidden",
        scrolled || open ? "border-b border-line bg-paper/85 backdrop-blur-xl" : "border-b border-transparent bg-paper",
      )}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Jena Shipping home">
          <Image src={asset("/logo.png")} alt="" width={46} height={36} className="h-9 w-auto" priority />
          <span className="leading-tight">
            <span className="block font-display text-[15px] font-semibold tracking-tight">Jena Shipping</span>
            <span className="block text-[11px] text-muted">Crewing · Training · Welfare</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
          {nav.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "relative rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors",
                  active ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {n.label}
                {active && <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a href={site.phones[0].href} className="hidden text-[14px] font-medium text-muted hover:text-ink xl:block">
            {site.phones[0].label}
          </a>
          <Link href="/careers/apply" className="btn btn-ink hidden px-5 py-2.5 sm:inline-flex">
            Apply now
          </Link>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-full border border-line bg-white lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Mobile" className="container-x pb-5 lg:hidden">
          <ul className="divide-y divide-line border-y border-line">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="flex items-center justify-between py-4 font-display text-xl font-semibold">
                  {n.label}
                  <span className="text-muted">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link href="/careers/apply" className="btn btn-ink">
              Apply now
            </Link>
            <a href={site.phones[0].href} className="btn btn-ghost-dark">
              Call us
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
