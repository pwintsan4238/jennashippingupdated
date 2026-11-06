import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { getJobs } from "@/lib/jobs";
import { PageHero } from "@/components/sections/PageHero";
import { JobBoard } from "@/components/sections/JobBoard";
import { StickyProcess } from "@/components/sections/StickyProcess";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { asset } from "@/lib/asset";

export const metadata: Metadata = pageMeta({
  path: "/careers/",
  title: "Careers",
  description: "Open seafarer jobs with Jena Shipping — deck, engine and catering positions on international vessels. Apply online.",
});



const PROMISES = [
  ["Reputable principals", "Contracts only with legitimate shipowners and managers."],
  ["Every rank welcome", "From cadets and ratings to Master and Chief Engineer."],
  ["Guidance throughout", "Certificates, training and pre-departure support."],
];

export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <>
      <PageHero
        kicker="Careers"
        title="Unlock your maritime career."
        lead="We connect passionate Myanmar seafarers with reputable shipping companies worldwide — whether it's your first job at sea or your next promotion."
        image={asset("/images/ever-harvest-harbor.jpg")}
        imageAlt="Cargo vessel alongside in a sunny harbour"
        aside={
          <dl className="mt-14 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
            {PROMISES.map(([k, v]) => (
              <div key={k} data-reveal>
                <dt className="font-display text-lg font-semibold tracking-tight">{k}</dt>
                <dd className="mt-1 text-[15px] text-muted">{v}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <section id="openings" className="scroll-mt-24 py-24 sm:py-32">
        <div className="container-x">
          <div data-reveal className="mb-10 max-w-2xl">
            <p className="kicker text-brand">Job openings</p>
            <h2 className="h-display mt-4 text-4xl sm:text-5xl">Find the right job for you</h2>
            <p className="lead mt-4">No matter what it is that you do on board.</p>
          </div>
          <JobBoard jobs={jobs} />
        </div>
      </section>

      <div className="bg-white">
        <StickyProcess />
      </div>
      <div className="pt-4">
        <CtaBanner title="Your next contract starts here." />
      </div>
    </>
  );
}
