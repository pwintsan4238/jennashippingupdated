import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { asset } from "@/lib/asset";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Crew supply for shipowners",
  description:
    "Vetted Myanmar officers and ratings for bulk, general cargo, container and tanker fleets. Screening, documents, medicals, visas and travel handled by Jena Shipping, Yangon.",
};

const RANKS = [
  { dept: "Deck", ranks: ["Master", "Chief Officer", "2nd Officer", "3rd Officer", "Bosun", "AB", "OS", "Deck Cadet"] },
  { dept: "Engine", ranks: ["Chief Engineer", "2nd Engineer", "3rd Engineer", "4th Engineer", "Electrical Engineer", "Fitter", "Oiler", "Wiper", "Engine Cadet"] },
  { dept: "Catering", ranks: ["Chief Cook", "Cook", "Messman", "Steward"] },
];

const STEPS = [
  ["Send your request", "Rank, vessel type, flag, trading area, joining port and date, and wage scale."],
  ["Shortlist", "We match candidates on certificates, sea service and vessel experience, and send CVs for review."],
  ["Screening & interview", "Technical and English screening in Yangon, then your interview — in person or online."],
  ["Documents & joining", "COC/STCW verification, medicals, visas, travel and pre-departure briefing."],
  ["Ongoing support", "Allotments, family contact and reliefs handled by our Yangon team throughout the contract."],
];

const CHECKS = [
  "COC & STCW certificates verified with issuing authority",
  "Passport, SID and Seaman Book (CDC) validity checked",
  "Sea service and references confirmed with previous employers",
  "Technical and English screening before you interview",
  "Practical refreshers: LSA/FFE, crane, welding, maritime Chinese",
  "Pre-departure briefing on company policies and contract terms",
];

const VESSELS = ["Bulk carrier", "General cargo", "Container", "Oil / chemical tanker", "Multi-purpose", "Offshore support"];

export default function ShipownersPage() {
  return (
    <>
      <PageHero
        kicker="For shipowners & managers"
        title="Qualified Myanmar crew, ready to join."
        lead="Tell us the rank, vessel and joining date. Our Yangon team shortlists, screens and prepares officers and ratings — and stays with them through the contract."
        image={asset("/images/1600-x-900-container-vessel-1.jpg")}
        imageAlt="Container vessel at sea"
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/contact?type=shipowner" className="btn btn-ink">Request crew</Link>
          <a href={`mailto:${site.email}?subject=Crew%20request`} className="btn btn-ghost-dark">Email the crewing team</a>
        </div>
      </PageHero>

      {/* Ranks */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <div data-reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="kicker text-brand">Ranks we supply</p>
              <h2 className="h-display mt-4 text-4xl leading-[1.05] sm:text-5xl">Officers and ratings, every department</h2>
            </div>
            <ul className="flex max-w-md flex-wrap gap-2">
              {VESSELS.map((v) => (
                <li key={v} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-muted">{v}</li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
            {RANKS.map((d) => (
              <article key={d.dept} data-reveal className="rounded-[var(--radius-frame)] border border-line bg-white p-7 sm:p-8">
                <h3 className="h-display text-2xl">{d.dept}</h3>
                <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-line pt-5 text-[15px]">
                  {d.ranks.map((r) => (
                    <li key={r} className="flex items-center gap-2">
                      <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                      {r}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-navy-900 py-24 text-white sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div data-reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="kicker text-sun">How it works</p>
            <h2 className="h-display mt-4 text-4xl leading-[1.05] sm:text-5xl">From request to sign-on</h2>
            <p className="mt-5 max-w-md leading-relaxed text-white/70">
              One point of contact in Yangon handles every step, so your superintendents can focus on the fleet.
            </p>
          </div>
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {STEPS.map(([t, b], i) => (
              <li key={t} data-reveal className="flex gap-6 py-7">
                <span className="font-mono text-sm text-sun">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight">{t}</h3>
                  <p className="mt-1.5 leading-relaxed text-white/70">{b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Vetting */}
      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <div data-reveal>
              <p className="kicker text-brand">Vetting</p>
              <h2 className="h-display mt-4 text-4xl leading-[1.05] sm:text-5xl">Checked before they reach you</h2>
            </div>
            <ul className="mt-8 grid gap-3">
              {CHECKS.map((c) => (
                <li key={c} data-reveal className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4 text-[15px]">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] text-brand" aria-hidden>✓</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal="image" className="relative min-h-[460px] overflow-hidden rounded-[var(--radius-frame)] bg-navy-900">
            <Image src={asset("/images/crane-briefing.jpg")} alt="Safety briefing under a shipyard crane" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <CtaBanner title="Need crew for your next rotation?" />
    </>
  );
}
