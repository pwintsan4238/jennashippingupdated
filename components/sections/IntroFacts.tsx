import Image from "next/image";
import { WordReveal } from "@/components/motion/WordReveal";
import { asset } from "@/lib/asset";

const FACTS = [
  {
    title: "Placement worldwide",
    body: "Contracts with reputable shipowners and managers on legitimate, compliant vessels.",
    icon: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />,
  },
  {
    title: "Deck, engine & catering — every rank",
    body: "From deck and engine cadets to Master and Chief Engineer, plus cooks and stewards.",
    icon: <path d="M3 17l2 3h14l2-3M5 17V9h14v8M9 9V5h6v4M12 5V3" />,
  },
  {
    title: "Office in Thingangyun, Yangon",
    body: "Walk in to meet the crewing team, bring your documents or attend training.",
    icon: <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Zm0-9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />,
  },
];

export function IntroFacts() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <p data-reveal className="kicker text-brand lg:pt-3">About Jena Shipping</p>
          <WordReveal
            className="h-display text-[clamp(1.6rem,2.7vw,2.45rem)] leading-[1.18]"
            segments={[
              { text: "We open global careers for Myanmar seafarers — " },
              {
                text: "with equal rights and opportunities alongside their international counterparts, and support from first application to sign-off.",
                className: "text-muted",
              },
            ]}
          />
        </div>

        <div className="mt-16 grid gap-4 lg:grid-cols-[1fr_1fr] lg:gap-6">
          <div data-reveal="image" className="relative min-h-[380px] overflow-hidden rounded-[var(--radius-frame)] bg-navy-900">
            <Image src={asset("/images/office-building.jpg")} alt="Sabei Phyu Condo, home of the Jena Shipping office in Thingangyun, Yangon" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/85 to-transparent p-7 pt-24 text-white">
              <p className="text-xs font-medium text-white/70">Visit our office</p>
              <p className="mt-1 max-w-sm font-display text-xl font-semibold leading-snug tracking-tight">Sabei Phyu Condo, 10th floor — Zawana bus stop, Thingangyun, Yangon</p>
            </div>
          </div>
          <div className="flex flex-col divide-y divide-line rounded-[var(--radius-frame)] border border-line bg-white">
            {FACTS.map((f) => (
              <div key={f.title} data-reveal className="flex flex-1 items-start gap-5 p-7 sm:p-8">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {f.icon}
                  </svg>
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-muted">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
