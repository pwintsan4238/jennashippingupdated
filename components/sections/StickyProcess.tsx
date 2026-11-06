"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { asset } from "@/lib/asset";

export const PROCESS = [
  {
    title: "Application & Document Review",
    body: "Submit the online Seafarer's Application Form. Our crewing team checks your COC, STCW certificates, passport, SID and Seaman Book for validity and expiry.",
    image: asset("/images/office-interior.jpg"),
    meta: "1–3 working days",
  },
  {
    title: "Technical & English Screening",
    body: "A rank-specific technical interview and English / Chinese communication check, so we can match you with the right vessel type and principal.",
    image: asset("/images/technicians-machinery.jpg"),
    meta: "In office or online",
  },
  {
    title: "Principal Interview & Approval",
    body: "Shortlisted candidates are presented to the shipowner or manager for final interview, contract terms and approval.",
    image: asset("/images/container-vessel.jpg"),
    meta: "Contract & wages confirmed",
  },
  {
    title: "Pre-departure Briefing & Joining",
    body: "Medical, flag-state documents, visa and travel arranged. A pre-departure briefing in Yangon covers your contract, safety and how we support your family.",
    image: asset("/images/anchorage.jpg"),
    meta: "We stay in touch on board",
  },
];

/** 3-column sticky walkthrough: left tab list stays pinned and tracks the step in view. */
export function StickyProcess() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[minmax(280px,0.8fr)_1.6fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p data-reveal className="kicker text-brand">How it works</p>
          <h2 data-reveal className="h-display mt-4 text-4xl leading-[1.05] sm:text-5xl">From application to sign-on</h2>
          <p data-reveal className="lead mt-5">Four clear steps. We keep you updated by phone or Viber at each one.</p>
          <ol data-reveal className="relative mt-10 hidden lg:block">
            <span aria-hidden className="absolute left-[11px] top-3 bottom-3 w-px bg-line" />
            <span
              aria-hidden
              className="absolute left-[11px] top-3 w-px bg-brand transition-all duration-500"
              style={{ height: `calc(${active / (PROCESS.length - 1)} * (100% - 24px))` }}
            />
            {PROCESS.map((p, i) => (
              <li key={p.title}>
                <button
                  type="button"
                  onClick={() => refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })}
                  className={clsx("relative flex w-full items-center gap-4 py-3 text-left transition-colors", i <= active ? "text-ink" : "text-muted hover:text-ink")}
                >
                  <span
                    className={clsx(
                      "relative z-10 flex size-6 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors",
                      i < active ? "border-brand bg-brand text-white" : i === active ? "border-brand bg-white text-brand" : "border-line bg-paper",
                    )}
                  >
                    {i < active ? "✓" : i + 1}
                  </span>
                  <span className={clsx("text-[15px]", i === active && "font-semibold")}>{p.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-5">
          {PROCESS.map((p, i) => (
            <div
              key={p.title}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-step={i}
              data-reveal
              className={clsx(
                "grid overflow-hidden rounded-[var(--radius-frame)] border bg-white transition-all duration-500 sm:grid-cols-[0.9fr_1fr]",
                i === active ? "border-brand/25 shadow-[0_24px_60px_-30px_rgba(36,51,230,0.35)]" : "border-line",
              )}
            >
              <div className="relative min-h-[220px]">
                <Image src={p.image} alt="" fill sizes="(min-width:1024px) 30vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-col p-7 sm:p-9">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-brand">Step {String(i + 1).padStart(2, "0")}</span>
                  <span className="rounded-full bg-paper px-3 py-1 text-xs font-medium text-muted">{p.meta}</span>
                </div>
                <h3 className="h-display mt-auto pt-10 text-2xl">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
