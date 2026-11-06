import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/asset";

export const SERVICES = [
  {
    tag: "Global",
    title: "Seafarer Placement & Global Opportunities",
    body: "We connect new and experienced Myanmar seafarers with reputable international shipping companies, on legitimate vessels that comply with international maritime standards.",
    points: ["Deck, engine & catering ranks", "Bulk, tanker, container & general cargo", "Contract terms explained before you sign"],
    image: asset("/images/ever-harvest-harbor.jpg"),
    alt: "Cargo vessel alongside in harbour",
    link: { href: "/careers", label: "See open jobs" },
  },
  {
    tag: "Myanmar",
    title: "Professional Training & Continuous Development",
    body: "Practical courses in our Yangon facilities, plus guidance on STCW certificates — so every candidate is ready for the role and the vessel.",
    points: ["LSA / FFE, crane & welding courses", "On-job maritime Chinese classes", "STCW certificate guidance & renewals"],
    image: asset("/images/welding-training.jpg"),
    alt: "Trainee welding in the workshop",
    link: { href: "#training", label: "View courses" },
  },
  {
    tag: "Myanmar",
    title: "Seafarer Welfare & Family Support",
    body: "A team in Yangon that looks after crew before, during and after the contract — and stays in touch with their families at home.",
    points: ["Pre-departure briefing in Yangon", "Allotment & contract guidance", "Family contact while crew are on board"],
    image: asset("/images/seafarers-blue-sky.jpg"),
    alt: "Seafarers on deck under a blue sky",
    link: { href: "/contact", label: "Talk to our team" },
  },
  {
    tag: "For shipowners",
    title: "Crew Supply for Shipowners & Managers",
    body: "Vetted officers and ratings for bulk, cargo, container and tanker fleets, with screening handled end to end.",
    points: ["Officers and ratings on request", "Document & certificate verification", "Technical screening & principal interviews"],
    image: asset("/images/safety-maintenance.jpg"),
    alt: "Shipboard safety maintenance team",
    link: { href: "/contact?type=shipowner", label: "Request crew" },
  },
];

/** 2×2 service cards: framed photo, summary, what's included, next step. */
export function ServicesGrid() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-x">
        <div data-reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="kicker text-brand">What we do</p>
            <h2 className="h-display mt-4 text-4xl leading-[1.05] sm:text-5xl">Everything a seafarer needs — in one place</h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-muted">Four services, one Yangon team — from your first application to the day you sign off.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
          {SERVICES.map((s, i) => (
            <article key={s.title} data-reveal className="group flex flex-col rounded-[var(--radius-frame)] border border-line bg-white p-2.5">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[20px]">
                <Image src={s.image} alt={s.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur">{s.tag}</span>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-7">
                <span className="font-mono text-sm text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="h-display mt-2 text-2xl leading-tight sm:text-[1.75rem]">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{s.body}</p>
                <ul className="mt-6 grid gap-2.5 border-t border-line pt-5 text-[15px]">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] text-brand" aria-hidden>
                        ✓
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <Link href={s.link.href} className="mt-auto inline-flex items-center gap-2 self-start pt-7 text-sm font-semibold text-ink transition-colors hover:text-brand">
                  {s.link.label} <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
