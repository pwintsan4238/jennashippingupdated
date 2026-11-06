import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { asset } from "@/lib/asset";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  path: "/about/",
  title: "About us",
  description:
    "Jena Shipping (Jena Company Limited) is a Yangon-based crewing, training and welfare agency connecting Myanmar seafarers with reputable international shipowners.",
});

const VALUES = [
  {
    title: "Fairness",
    body: "Myanmar seafarers deserve equal rights and opportunities alongside their international counterparts. Contract terms are explained clearly before anyone signs.",
  },
  {
    title: "Safety first",
    body: "We only work with legitimate shipowners and compliant vessels, and our courses put safety at sea ahead of everything else.",
  },
  {
    title: "Competence",
    body: "Every candidate is checked for certificates, sea service and practical skills — so principals get crew who are ready for the role.",
  },
  {
    title: "Care for families",
    body: "A contract affects a whole household. We stay in touch with families at home while their seafarer is on board.",
  },
];

const MILESTONES = [
  ["Apply", "Walk in, call, or apply online with your particulars, certificates and sea service."],
  ["Prepare", "Document review, STCW guidance and practical training in our Yangon facilities."],
  ["Join", "Principal interview, contract briefing, medicals, visas and travel arranged."],
  ["On board & home", "Allotment guidance, family contact and support right through to sign-off."],
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="About us"
        title="A Yangon team for Myanmar seafarers."
        lead={`${site.legalName} connects qualified Myanmar crew with reputable shipowners worldwide — and supports them with training and welfare from first application to sign-off.`}
        image={asset("/images/seafarers-blue-sky.jpg")}
        imageAlt="Myanmar seafarers on deck under a blue sky"
        imagePosition="object-[50%_40%]"
      />

      {/* Mission */}
      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <div data-reveal>
            <p className="kicker text-brand">Our mission</p>
            <p className="mt-6 font-display text-2xl font-semibold leading-snug tracking-tight text-brand">“{site.tagline}”</p>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-muted">
            <p data-reveal>
              <span className="font-semibold text-ink">Jena Shipping</span> is a crewing and maritime training company based in Thingangyun
              Township, Yangon. We recruit deck, engine and catering seafarers for international vessels — from cadets and ratings to
              Master and Chief Engineer.
            </p>
            <p data-reveal>
              We believe a good placement starts long before sign-on. That is why we run practical courses — LSA/FFE, crane, welding and
              on-job maritime Chinese — and help candidates keep their STCW certificates in order.
            </p>
            <p data-reveal>
              For shipowners and managers, we provide vetted Myanmar officers and ratings with documents, screening and travel handled end
              to end, so crew arrive ready to work.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-24 sm:py-32">
        <div className="container-x">
          <div data-reveal className="mb-12 max-w-2xl">
            <p className="kicker text-brand">What we stand for</p>
            <h2 className="h-display mt-4 text-4xl leading-[1.05] sm:text-5xl">Values we sail by</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {VALUES.map((v, i) => (
              <article key={v.title} data-reveal className="flex flex-col rounded-[var(--radius-frame)] border border-line bg-paper p-7">
                <span className="font-mono text-sm text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="h-display mt-3 text-2xl">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{v.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div data-reveal="image" className="relative min-h-[420px] overflow-hidden rounded-[var(--radius-frame)] bg-navy-900">
            <Image src={asset("/images/office-interior.jpg")} alt="Inside the Jena Shipping office in Yangon" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <div data-reveal>
              <p className="kicker text-brand">How we work</p>
              <h2 className="h-display mt-4 text-4xl leading-[1.05] sm:text-5xl">With you at every step</h2>
            </div>
            <ol className="mt-10 divide-y divide-line border-y border-line">
              {MILESTONES.map(([t, b], i) => (
                <li key={t} data-reveal className="flex gap-6 py-6">
                  <span className="font-mono text-sm text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-tight">{t}</h3>
                    <p className="mt-1.5 leading-relaxed text-muted">{b}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div data-reveal className="mt-10 flex flex-wrap gap-3">
              <Link href="/careers" className="btn btn-ink">See open jobs</Link>
              <Link href="/shipowners" className="btn btn-ghost-dark">For shipowners</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white">
        <WhyChoose />
      </div>
      <div className="pt-4">
        <CtaBanner />
      </div>
    </>
  );
}
