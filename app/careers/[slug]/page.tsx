import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJob, getJobs } from "@/lib/jobs";
import { ApplicationForm } from "@/components/form/ApplicationForm";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getJobs()).map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const job = await getJob((await params).slug);
  return job ? { title: `${job.title} — Apply`, description: `Apply online for ${job.title} with Jena Shipping.` } : {};
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const job = await getJob((await params).slug);
  if (!job) notFound();

  const summary = [
    ["Location", job.location],
    ["Experience", job.experience],
    ["Vacancy", job.title],
    ["Vessel type", job.vesselType],
    ["Contract", job.contractDuration],
    ["Sign-on", job.signOnWindow],
  ];

  return (
    <>
      <section className="pt-10 sm:pt-14">
        <div className="container-x">
          <Link href="/careers#openings" data-reveal className="inline-block text-sm font-medium text-muted hover:text-ink">
            ← All openings
          </Link>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-8 border-b border-line pb-12">
            <div data-reveal>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  <span className="size-1.5 rounded-full bg-green-500" /> Hiring now
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-muted ring-1 ring-line">{job.department} department</span>
              </div>
              <h1 className="h-display mt-5 text-[clamp(2.75rem,6vw,5rem)] leading-none">{job.title}</h1>
            </div>
            <a href="#apply" data-reveal className="btn btn-ink">
              Apply for this position <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-20">
          <div className="max-w-2xl">
            <h2 data-reveal className="h-display text-2xl">Duties and responsibilities</h2>
            <ul className="mt-6 space-y-4">
              {job.duties.map((d) => (
                <li key={d} data-reveal className="flex gap-4 leading-relaxed text-muted">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand" />
                  {d}
                </li>
              ))}
            </ul>
            {job.requirements.length > 0 && (
              <>
                <h2 data-reveal className="h-display mt-14 text-2xl">Requirements</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {job.requirements.map((r) => (
                    <li key={r} data-reveal className="rounded-2xl border border-line bg-white p-4 text-[15px] leading-snug">
                      <span className="mb-2 block text-brand" aria-hidden>✓</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div data-reveal className="rounded-[var(--radius-frame)] border border-line bg-white p-7">
              <h2 className="font-display text-lg font-semibold">Job summary</h2>
              <dl className="mt-4 divide-y divide-line">
                {summary.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-3 text-sm">
                    <dt className="text-muted">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <a href="#apply" className="btn btn-ink mt-6 w-full">
                Apply now
              </a>
              <p className="mt-4 text-center text-xs text-muted">Takes about 10 minutes · draft saved automatically</p>
            </div>
          </aside>
        </div>
      </section>

      <section id="apply" className="scroll-mt-20 bg-white pb-24 pt-16 sm:pt-20">
        <div className="container-x">
          <ApplicationForm jobSlug={job.slug} position={job.rankCode} jobTitle={job.title} />
        </div>
      </section>
    </>
  );
}
