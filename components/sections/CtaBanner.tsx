"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { site } from "@/lib/site";
import { asset } from "@/lib/asset";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Positions are % of the cluster box; `speed` drives scroll parallax. */
const TILES = [
  {
    src: asset("/images/seafarers-blue-sky.jpg"),
    alt: "Jena crew on deck",
    pos: "left-[20%] top-[9%] w-[44%] aspect-[4/5] z-10",
    speed: -6,
    sizes: "(min-width:1024px) 300px, 44vw",
  },
  {
    src: asset("/images/crane-briefing.jpg"),
    alt: "Safety briefing under a crane",
    pos: "right-0 top-0 w-[30%] aspect-square",
    speed: 12,
    sizes: "(min-width:1024px) 200px, 30vw",
  },
  {
    src: asset("/images/crew-lifeboat.jpg"),
    alt: "Crew launching a lifeboat",
    pos: "right-[2%] top-[39%] w-[34%] aspect-[4/3]",
    speed: 4,
    sizes: "(min-width:1024px) 230px, 34vw",
  },
  {
    src: asset("/images/office-interior.jpg"),
    alt: "Jena Shipping crewing office",
    pos: "left-0 top-[52%] w-[27%] aspect-square z-20",
    speed: 14,
    sizes: "(min-width:1024px) 180px, 27vw",
  },
  {
    src: asset("/images/container-vessel.jpg"),
    alt: "Container vessel at sea",
    pos: "left-[45%] bottom-0 w-[29%] aspect-[4/3] z-20",
    speed: -10,
    sizes: "(min-width:1024px) 200px, 29vw",
  },
];

const VESSELS = [
  "Bulk carriers",
  "Oil & chemical tankers",
  "Container ships",
  "General cargo",
  "LPG / LNG carriers",
  "Offshore & supply",
];

/** Closing conversion section: split copy + floating photo-tile collage. */
export function CtaBanner({
  title = "Ready to set sail with Jena Shipping?",
  lead = "Seafarers looking for their next contract and shipowners looking for qualified Myanmar crew — our Yangon team is ready to help.",
}: {
  title?: string;
  lead?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: Number(el.dataset.speed) },
            {
              yPercent: -Number(el.dataset.speed),
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden py-24 sm:py-32">
      <div className="container-x">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <p data-reveal className="kicker text-brand">
              Get started
            </p>
            <h2
              data-reveal
              className="h-display mt-5 text-[clamp(2.4rem,5vw,4.25rem)] leading-[1.0]"
            >
              {title}
            </h2>
            <p data-reveal className="lead mt-6 max-w-lg">
              {lead}
            </p>
            <div data-reveal className="mt-9 flex flex-wrap gap-3">
              <Link href="/careers/apply" className="btn btn-ink">
                Apply as a seafarer <span aria-hidden>→</span>
              </Link>
              <Link
                href="/contact?type=shipowner"
                className="btn btn-ghost-dark"
              >
                Request crew
              </Link>
            </div>
            <dl
              data-reveal
              className="mt-12 grid max-w-md grid-cols-2 gap-6 border-t border-line pt-6 text-sm"
            >
              <div>
                <dt className="text-muted">Call the office</dt>
                <dd className="mt-1">
                  <a
                    href={site.phones[0].href}
                    className="font-display text-base font-semibold hover:text-brand"
                  >
                    {site.phones[0].label}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted">Message us</dt>
                <dd className="mt-1 flex gap-3 font-semibold">
                  <a href={site.messaging.viber} className="hover:text-brand">
                    Viber
                  </a>
                  <a
                    href={site.messaging.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-brand"
                  >
                    WhatsApp
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative mx-auto aspect-[6/5] w-full max-w-[680px]">
            <div
              aria-hidden
              className="absolute inset-[6%] -z-10 rounded-full bg-[radial-gradient(circle_at_center,var(--color-brand-50),transparent_70%)]"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(var(--color-line)_1.2px,transparent_1.2px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]"
            />

            {TILES.map((t) => (
              <div
                key={t.src}
                data-speed={t.speed}
                className={clsx("absolute", t.pos)}
              >
                <div
                  data-reveal="image"
                  className="relative size-full overflow-hidden rounded-[20px] shadow-xl shadow-navy-950/10 ring-4 ring-paper sm:rounded-[26px]"
                >
                  <Image
                    src={t.src}
                    alt={t.alt}
                    fill
                    sizes={t.sizes}
                    className="object-cover"
                  />
                </div>
              </div>
            ))}

            <div
              data-speed={-14}
              className="absolute left-[3%] top-[12%] z-30 w-[15%]"
            >
              <div data-reveal>
                <div className="float-slow flex aspect-square items-center justify-center rounded-2xl bg-white p-[14%] shadow-xl shadow-navy-950/10 ring-1 ring-line">
                  <Image
                    src={asset("/logo.png")}
                    alt="Jena Shipping logo"
                    width={120}
                    height={94}
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>

            <div
              data-speed={8}
              className="absolute bottom-0 left-0 z-30 hidden sm:block"
            >
              <div data-reveal>
                <Link
                  href="/careers"
                  className="float-slower flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 shadow-xl shadow-navy-950/10 ring-1 ring-line"
                >
                  <span className="relative flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand">
                    <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                    <svg
                      viewBox="0 0 24 24"
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden
                    >
                      <path d="M3 17l2 3h14l2-3M5 17V9h14v8M9 9V5h6v4M12 5V3" />
                    </svg>
                  </span>
                  <span className="leading-tight">
                    <span className="block text-xs text-muted">Now hiring</span>
                    <span className="block font-display text-[15px] font-semibold">
                      Deck · Engine · Catering
                    </span>
                  </span>
                </Link>
              </div>
            </div>

            <div
              data-speed={-4}
              className="absolute left-[22%] top-0 z-30 hidden sm:block"
            >
              <p data-reveal>
                <span className="float-slow block rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-white shadow-lg">
                  <span className="mr-1.5 inline-block size-1.5 rounded-full bg-sun align-middle" />
                  Trained in Yangon
                </span>
              </p>
            </div>
          </div>
        </div>

        <div
          data-reveal
          className="mt-14 flex flex-col gap-5 border-t sm:mt-20 border-line pt-8 lg:flex-row lg:items-center lg:gap-10"
        >
          <p className="shrink-0 text-sm font-medium text-muted">
            Crew for every vessel type
          </p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 font-display text-lg font-semibold tracking-tight text-ink/70">
            {VESSELS.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
