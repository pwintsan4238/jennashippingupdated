import Link from "next/link";
import { getJobs } from "@/lib/jobs";
import { HomeHero } from "@/components/sections/HomeHero";
import { Marquee } from "@/components/sections/Marquee";
import { IntroFacts } from "@/components/sections/IntroFacts";
import { Audiences } from "@/components/sections/Audiences";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { TrainingShowcase } from "@/components/sections/TrainingShowcase";
import { StickyProcess } from "@/components/sections/StickyProcess";
import { JobCard, OpenApplicationCard } from "@/components/sections/JobCard";
import { Gallery } from "@/components/sections/Gallery";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  path: "/",
  description:
    "Jena Shipping connects qualified Myanmar seafarers with reputable international shipowners, with STCW training, crane, welding and Chinese language courses, and family welfare support.",
});

const RANKS = ["Master", "Chief Officer", "Chief Engineer", "2nd Engineer", "Electrical Engineer", "Bosun", "Fitter", "Pumpman", "AB", "Oiler", "Cook", "Deck Cadet", "Engine Cadet"];

export default async function HomePage() {
  const jobs = await getJobs();

  return (
    <>
      <HomeHero />

      <Marquee words={RANKS} reveal className="border-y border-line py-5 font-display text-lg font-medium text-muted sm:text-xl" />

      <IntroFacts />
      <Audiences />
      <WhyChoose />
      <TrainingShowcase />
      <StickyProcess />

      <section className="pb-24 sm:pb-32">
        <div className="container-x">
          <div data-reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="kicker text-brand">Job openings</p>
              <h2 className="h-display mt-4 text-4xl sm:text-5xl">Find the right job at sea</h2>
            </div>
            <Link href="/careers" className="btn btn-ghost-dark">
              All openings <span aria-hidden>→</span>
            </Link>
          </div>
          <div className={`grid gap-4 md:grid-cols-2 lg:gap-6 ${jobs.length >= 2 ? "lg:grid-cols-3" : ""}`}>
            {jobs.slice(0, 2).map((j) => (
              <JobCard key={j.slug} job={j} />
            ))}
            <OpenApplicationCard dark />
          </div>
        </div>
      </section>

      <div className="bg-white">
        <Gallery />
      </div>
      <div className="pt-4">
        <CtaBanner />
      </div>
    </>
  );
}
