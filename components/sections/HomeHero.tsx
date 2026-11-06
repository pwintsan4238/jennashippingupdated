"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { asset } from "@/lib/asset";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function HomeHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-hero-img]", { scale: 1.12, duration: 2, ease: "power3.out" });
        gsap.from("[data-hero-in]", { y: 28, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.08, delay: 0.15 });
        gsap.to("[data-hero-img]", {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="px-2 pb-4 sm:px-4">
      <div className="relative mx-auto h-[calc(100svh-84px)] min-h-[620px] max-h-[920px] max-w-[1680px] overflow-hidden rounded-[28px] bg-navy-900 sm:rounded-[36px]">
        <Image
          data-hero-img
          src={asset("/images/bulk-carrier-harbor.jpg")}
          alt="Bulk carrier under way leaving harbour"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_60%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/55 via-navy-950/10 to-navy-950/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/60 via-navy-950/15 to-transparent" />

        <div className="container-x relative flex h-full flex-col justify-between pb-6 pt-12 sm:pb-10 sm:pt-16">
          <div className="max-w-3xl text-white">
            <p data-hero-in className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[13px] font-medium backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-sun" />
              Myanmar seafarer crewing agency · Yangon
            </p>
            <h1 data-hero-in className="h-display mt-6 max-w-[8.4em] text-[clamp(2.6rem,5.8vw,5.25rem)] leading-[0.98]">
              Empowering Myanmar seafarers for global success.
            </h1>
            <p data-hero-in className="mt-6 max-w-[34rem] text-base leading-relaxed text-white/90 sm:text-lg">
              We place qualified crew on legitimate vessels with reputable shipowners worldwide — and support them with training,
              documents and family welfare at every step.
            </p>
            <div data-hero-in className="mt-8 flex flex-wrap gap-3">
              <Link href="/careers" className="btn btn-white">
                Find a job at sea <span aria-hidden>→</span>
              </Link>
              <Link href="/contact?type=shipowner" className="btn btn-ghost-light backdrop-blur-sm">
                I&apos;m hiring crew
              </Link>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4">
            <p data-hero-in className="hidden text-sm text-white/80 md:block">
              Deck · Engine · Catering — from cadet to Master &amp; Chief Engineer
            </p>
            <Link
              data-hero-in
              href="/careers/apply"
              className="group ml-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-white/95 p-4 text-ink shadow-2xl shadow-navy-950/30 backdrop-blur transition-colors hover:bg-white sm:w-auto"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
                  <path d="M14 3v5h5M9 13h6M9 17h4" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-base font-semibold uppercase tracking-wide sm:text-lg">Submit application</span>
                <span className="block truncate text-xs text-muted">Deck · Engine · Catering — any rank</span>
              </span>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-white transition group-hover:translate-x-0.5" aria-hidden>
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
