"use client";

import { useRef, type PointerEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const REASONS = [
  {
    title: "Quality service",
    body: "The right rank on the right vessel — we match experience, certificates and vessel type before we put a candidate forward.",
    icon: <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3Z" />,
  },
  {
    title: "Modern online process",
    body: "Apply online, see certificate expiry at a glance, download your application as a PDF and hear back within one working day.",
    icon: <path d="M4 5h16v11H4zM8 20h8M12 16v4M8 10l2 2 4-4" />,
  },
  {
    title: "Trusted professionals",
    body: "An experienced Yangon crewing team that checks every COC, STCW certificate, passport and SID — and works only with legitimate principals.",
    icon: <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3Zm-3 9l2 2 4-4" />,
  },
  {
    title: "Care beyond the contract",
    body: "Pre-departure briefings, allotment guidance, and a team that stays in touch with families while crew are on board.",
    icon: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
  },
];

function spotlight(e: PointerEvent<HTMLLIElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

/** Dark band: why seafarers and shipowners choose Jena. Cards tilt in, badges pop, numbers count up. */
export function WhyChoose() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-why-list]", start: "top 80%", once: true } });
        tl.from("[data-why-card]", {
          opacity: 0,
          y: 70,
          rotateX: -18,
          transformPerspective: 900,
          transformOrigin: "top center",
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
        })
          .from("[data-why-icon]", { scale: 0.4, rotate: -20, opacity: 0, duration: 0.7, ease: "back.out(2)", stagger: 0.12 }, 0.35);

        gsap.utils.toArray<HTMLElement>("[data-why-num]").forEach((el, i) => {
          const n = { v: 0 };
          tl.to(n, { v: i + 1, duration: 0.6, ease: "none", snap: { v: 1 }, onUpdate: () => (el.textContent = String(n.v).padStart(2, "0")) }, 0.4 + i * 0.12);
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="px-2 py-4 sm:px-4">
      <div className="mx-auto max-w-[1680px] rounded-[28px] bg-navy-900 py-20 text-white sm:rounded-[36px] sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
          <div data-reveal className="lg:pt-2">
            <p className="kicker text-sun">Why choose Jena</p>
            <h2 className="h-display mt-5 text-[clamp(2.1rem,4.2vw,3.5rem)] leading-[1.04]">
              Crewing done properly — for seafarers and shipowners.
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-white/70 sm:text-lg">
              We make finding the next contract — or the next crew — straightforward and transparent. From the first application to
              sign-off, every candidate is screened with care and every principal is checked, so seafarers sail with confidence and
              owners get crew they can rely on.
            </p>
          </div>

          <ol data-why-list className="grid gap-4 sm:grid-cols-2">
            {REASONS.map((r, i) => (
              <li
                key={r.title}
                data-why-card
                onPointerMove={spotlight}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white/5 p-7 ring-1 ring-white/10 transition-colors hover:bg-white/[0.07]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(255,214,10,0.13), transparent 60%)" }}
                />
                <div className="relative flex items-center justify-between">
                  <span data-why-icon className="flex size-11 items-center justify-center rounded-xl bg-sun/15 text-sun">
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      {r.icon}
                    </svg>
                  </span>
                  <span data-why-num className="font-mono text-xs text-white/40">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="relative mt-8 font-display text-xl font-semibold tracking-tight">{r.title}</h3>
                <p className="relative mt-2 text-[15px] leading-relaxed text-white/65">{r.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
