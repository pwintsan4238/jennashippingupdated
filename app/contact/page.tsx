import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";
import { ContactFormFromQuery } from "@/components/sections/ContactFormFromQuery";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  path: "/contact/",
  title: "Contact",
  description: "Contact Jena Shipping in Thingangyun, Yangon — phone, email, Viber, WhatsApp, Telegram, or send us a message.",
});

export default function ContactPage() {

  return (
    <>
      <PageHero
        kicker="Contact"
        title="Let's talk."
        lead="Starting your journey at sea, advancing your career, or looking for qualified Myanmar crew — our team replies within one working day."
      />

      <section className="py-14 sm:py-20">
        <div className="container-x grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6">
          <aside className="flex flex-col gap-4 lg:gap-6">
            <div data-reveal className="rounded-[var(--radius-frame)] bg-navy-900 p-7 text-white sm:p-8">
              <p className="text-sm text-white/60">Call the office</p>
              <ul className="mt-2 space-y-1">
                {site.phones.map((p) => (
                  <li key={p.href}>
                    <a href={p.href} className="font-display text-xl font-semibold tracking-tight hover:text-sun sm:text-2xl">
                      {p.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-white/60">Email</p>
              <a href={`mailto:${site.email}`} className="mt-1 block break-all font-medium hover:text-sun">
                {site.email}
              </a>
              <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-6">
                <a href={site.messaging.viber} className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20">Viber</a>
                <a href={site.messaging.whatsapp} target="_blank" rel="noreferrer" className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20">WhatsApp</a>
                <a href={site.messaging.telegram} target="_blank" rel="noreferrer" className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20">Telegram</a>
              </div>
            </div>
            <div data-reveal className="flex flex-1 flex-col rounded-[var(--radius-frame)] border border-line bg-white p-7 sm:p-8">
              <p className="text-sm text-muted">Visit us</p>
              <address className="mb-6 mt-2 space-y-3 not-italic">
                <p className="font-display text-lg font-semibold leading-snug tracking-tight">{site.addressEn}</p>
                <p lang="my" className="text-muted">{site.addressMy}</p>
              </address>
              <p className="mt-auto flex items-center gap-2 border-t border-line pt-5 text-sm">
                <span className="size-2 rounded-full bg-green-500" /> {site.hours}
              </p>
            </div>
          </aside>

          <div data-reveal className="flex flex-col rounded-[var(--radius-frame)] border border-line bg-white p-6 sm:p-10">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-6">
              <div>
                <h2 className="h-display text-3xl sm:text-4xl">Send us a message</h2>
                <p className="mt-2 text-[15px] text-muted">Jobs, training, documents or crew requests — write to us here.</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                <span className="size-1.5 rounded-full bg-green-500" /> Usually replies in 24h
              </span>
            </div>
            <ContactFormFromQuery />
          </div>
        </div>
      </section>

      <section className="px-2 pb-24 sm:px-4">
        <div data-reveal="image" className="relative mx-auto h-[440px] max-w-[1680px] overflow-hidden rounded-[28px] border border-line bg-white sm:rounded-[36px]">
          <iframe
            title="Map — Zawana Bus Stop, Lay Daungkan Road, Yangon"
            src={site.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 size-full grayscale-[30%]"
          />
          <a href={site.mapLink} target="_blank" rel="noreferrer" className="btn btn-ink absolute bottom-5 left-5">
            Open in Google Maps
          </a>
        </div>
      </section>
    </>
  );
}
