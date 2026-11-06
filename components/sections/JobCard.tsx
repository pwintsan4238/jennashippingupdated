import Link from "next/link";
import type { Job } from "@/lib/jobs";

export function JobCard({ job }: { job: Job }) {
  const facts = [
    ["Vessel", job.vesselType],
    ["Contract", job.contractDuration],
    ["Sign-on", job.signOnWindow],
    ["Experience", job.experience],
  ];
  return (
    <article data-reveal className="group relative flex flex-col rounded-[var(--radius-frame)] border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-ink/15 hover:shadow-[0_30px_60px_-35px_rgba(11,27,51,0.35)]">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          <span className="size-1.5 rounded-full bg-green-500" /> Hiring now
        </span>
        <span className="text-xs font-medium text-muted">
          {job.department} · {job.location}
        </span>
      </div>
      <h3 className="h-display mt-6 text-[28px] leading-tight">
        <Link href={`/careers/${job.slug}`} className="after:absolute after:inset-0 after:rounded-[var(--radius-frame)]">
          {job.title}
        </Link>
      </h3>
      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-line pt-6 text-sm">
        {facts.map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs text-muted">{k}</dt>
            <dd className="mt-0.5 font-medium">{v || "—"}</dd>
          </div>
        ))}
      </dl>
      <div className="relative z-10 mt-auto flex gap-2 pt-8">
        <Link href={`/careers/${job.slug}#apply`} className="btn btn-ink flex-1">
          Apply now
        </Link>
        <Link href={`/careers/${job.slug}`} className="btn btn-ghost-dark">
          Details
        </Link>
      </div>
    </article>
  );
}

export function OpenApplicationCard({ dark }: { dark?: boolean }) {
  return (
    <Link
      href="/careers/apply"
      data-reveal
      className={`group flex min-h-[340px] flex-col rounded-[var(--radius-frame)] p-7 transition-all duration-300 hover:-translate-y-1 ${
        dark ? "bg-navy-900 text-white" : "border border-dashed border-ink/20 bg-sand/60 hover:border-ink/40"
      }`}
    >
      <span className={`text-xs font-semibold ${dark ? "text-sun" : "text-brand"}`}>Open application</span>
      <span className="h-display mt-6 block text-[28px] leading-tight">Don&apos;t see your rank?</span>
      <span className={`mt-3 block text-[15px] leading-relaxed ${dark ? "text-white/70" : "text-muted"}`}>
        2nd Officer, Fitter, AB, Cook, Cadet — any rank. Send your sea service record once; we&apos;ll call you when a matching vessel opens.
      </span>
      <span className={`btn mt-auto w-fit ${dark ? "btn-sun" : "btn-ink"}`}>
        Submit your details <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
      </span>
    </Link>
  );
}
