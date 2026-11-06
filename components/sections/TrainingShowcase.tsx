"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import { TRAININGS } from "@/lib/trainings";

/** Split media list: image on one side follows the active course on the other. */
export function TrainingShowcase({ cta = true }: { cta?: boolean }) {
  const [active, setActive] = useState(0);

  return (
    <section className="px-2 sm:px-4">
      <div className="mx-auto max-w-[1680px] rounded-[28px] bg-navy-900 py-20 text-white sm:rounded-[36px] sm:py-28">
        <div className="container-x">
          <div data-reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="kicker text-sun">Training</p>
              <h2 className="h-display mt-4 text-4xl leading-[1.05] sm:text-5xl">Practical skills, sharpened before you sail</h2>
            </div>
            {cta && (
              <Link href="/services#training" className="btn btn-ghost-light">
                All training courses
              </Link>
            )}
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div data-reveal="image" className="relative hidden aspect-[4/3.4] overflow-hidden rounded-[var(--radius-frame)] bg-navy-800 lg:block">
              {TRAININGS.map((t, i) => (
                <Image
                  key={t.code}
                  src={t.image}
                  alt=""
                  fill
                  sizes="50vw"
                  className={clsx("object-cover transition-all duration-700", i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0")}
                />
              ))}
              <span className="absolute left-5 top-5 rounded-full bg-sun px-3 py-1 text-xs font-semibold text-ink">{TRAININGS[active].code}</span>
            </div>

            <ol className="border-t border-white/10">
              {TRAININGS.map((t, i) => {
                const open = i === active;
                return (
                  <li key={t.code} data-reveal className="border-b border-white/10">
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      className="flex w-full items-baseline gap-5 py-6 text-left"
                    >
                      <span className={clsx("font-mono text-xs transition-colors", open ? "text-sun" : "text-white/40")}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={clsx("flex-1 font-display text-xl font-semibold tracking-tight transition-colors sm:text-2xl", open ? "text-white" : "text-white/55")}>
                        {t.title}
                      </span>
                      <span className={clsx("text-xl text-white/50 transition-transform", open && "rotate-45 text-sun")} aria-hidden>
                        +
                      </span>
                    </button>
                    <div className={clsx("grid transition-all duration-500", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                      <div className="overflow-hidden">
                        <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-2xl lg:hidden">
                          <Image src={t.image} alt="" fill sizes="100vw" className="object-cover" />
                        </div>
                        <p className="max-w-lg pb-7 pl-9 text-white/70">{t.body}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
