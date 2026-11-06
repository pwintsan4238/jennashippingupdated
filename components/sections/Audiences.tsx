import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/asset";

const Check = () => (
  <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="m5 12 4.5 4.5L19 7" />
  </svg>
);

/** Dual entry point: seafarers vs. shipowners. */
export function Audiences() {
  return (
    <section className="pb-24 sm:pb-32">
      <div className="container-x">
        <div data-reveal className="mb-12 max-w-2xl">
          <p className="kicker text-brand">How we help</p>
          <h2 className="h-display mt-4 text-4xl leading-[1.05] sm:text-5xl">One team, two sides of the gangway</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          <article data-reveal className="flex flex-col overflow-hidden rounded-[var(--radius-frame)] bg-navy-900 text-white">
            <div className="relative aspect-[16/9]">
              <Image src={asset("/images/engine-room-crew.jpg")} alt="Engine crew at work" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col p-7 sm:p-10">
              <p className="text-sm font-medium text-sun">For seafarers</p>
              <h3 className="h-display mt-2 text-3xl">Your next contract, done right</h3>
              <ul className="mt-6 space-y-3 text-white/80">
                {["Deck, engine and catering positions on international vessels", "Certificate and document review before you apply to a principal", "Training, pre-departure briefing and family support"].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="text-sun"><Check /></span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap gap-3 pt-10">
                <Link href="/careers" className="btn btn-sun">View open jobs</Link>
                <Link href="/careers/apply" className="btn btn-ghost-light">Apply online</Link>
              </div>
            </div>
          </article>

          <article data-reveal className="flex flex-col overflow-hidden rounded-[var(--radius-frame)] border border-line bg-white">
            <div className="relative aspect-[16/9]">
              <Image src={asset("/images/ever-harvest-harbor.jpg")} alt="General cargo vessel in port" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col p-7 sm:p-10">
              <p className="text-sm font-medium text-brand">For shipowners &amp; managers</p>
              <h3 className="h-display mt-2 text-3xl">Qualified Myanmar crew, ready to join</h3>
              <ul className="mt-6 space-y-3 text-muted">
                {["Vetted officers and ratings for cargo, bulk, container and tanker fleets", "Technical and English screening before principal interview", "Documents, medicals, visas and travel handled end-to-end"].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="text-brand"><Check /></span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap gap-3 pt-10">
                <Link href="/contact?type=shipowner" className="btn btn-ink">Request crew</Link>
                <Link href="/services" className="btn btn-ghost-dark">Our services</Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
