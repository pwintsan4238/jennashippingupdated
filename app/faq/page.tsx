import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  path: "/faq/",
  title: "FAQ",
  description:
    "Answers to common questions about applying for seafarer jobs, documents, training courses and crew supply at Jena Shipping, Yangon.",
});

type QA = { q: string; a: string };

const GROUPS: { title: string; items: QA[] }[] = [
  {
    title: "Applying for a job",
    items: [
      {
        q: "How do I apply?",
        a: "Pick an opening on the Careers page and fill in the application form, or send an open application for any rank. You can also visit our office in Thingangyun with your documents.",
      },
      {
        q: "Can I apply if there is no opening for my rank?",
        a: "Yes. Use the open application form. We keep your details on file and contact you when a matching vessel comes up.",
      },
      {
        q: "Do you charge seafarers a fee to apply?",
        a: "Applying online is free. If you have questions about any costs relating to training or documents, please call our office before you pay anyone.",
      },
      {
        q: "How long until I hear back?",
        a: "Our crewing team usually replies within one working day. If you have not heard from us, call or message us on Viber, WhatsApp or Telegram.",
      },
      {
        q: "I have no sea service yet. Can I still apply?",
        a: "Yes — cadets and new seafarers are welcome. Tick “no sea service” on the form and tell us about your marine college and certificates.",
      },
    ],
  },
  {
    title: "Documents & certificates",
    items: [
      {
        q: "Which documents do I need?",
        a: "A passport-style photo, Passport, SID and Seaman Book (CDC), your COC if you are an officer, and your STCW certificates. Have the numbers, issue and expiry dates ready.",
      },
      {
        q: "My certificate is about to expire. What should I do?",
        a: "Tell us when you apply. We can guide you on renewal and refresher courses so you are ready before sign-on.",
      },
      {
        q: "Can I save my application and finish later?",
        a: "Yes. The form saves a draft in your browser automatically, and you can download a PDF copy of your application before you submit.",
      },
    ],
  },
  {
    title: "Training",
    items: [
      {
        q: "What courses do you offer?",
        a: "LSA/FFE, crane, welding and on-job maritime Chinese classes in Yangon, plus guidance and arrangements for core STCW safety certificates.",
      },
      {
        q: "How do I join a course?",
        a: "Send us a message with the inquiry type “Maritime training courses”, or call the office to ask about the next intake.",
      },
    ],
  },
  {
    title: "For shipowners",
    items: [
      {
        q: "Which ranks can you supply?",
        a: "Deck, engine and catering officers and ratings — from cadets to Master and Chief Engineer — for bulk, general cargo, container and tanker vessels.",
      },
      {
        q: "How do I request crew?",
        a: "Send the rank, vessel type, flag, trading area, joining port and date through the contact form (choose “Shipowner / crewing inquiry”) or email us directly.",
      },
    ],
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GROUPS.flatMap((g) => g.items).map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        kicker="FAQ"
        title="Questions, answered."
        lead="Everything seafarers and shipowners usually ask us. Can't find yours? Call or message the office — we're happy to help."
      />

      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-20">
          <nav aria-label="FAQ topics" className="lg:sticky lg:top-28 lg:self-start">
            <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {GROUPS.map((g, i) => (
                <li key={g.title}>
                  <a href={`#faq-${i}`} className="block rounded-full border border-line bg-white px-4 py-2.5 text-sm font-medium text-muted hover:text-ink lg:rounded-xl lg:border-0 lg:bg-transparent lg:px-3">
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-14">
            {GROUPS.map((g, i) => (
              <div key={g.title} id={`faq-${i}`} className="scroll-mt-28">
                <h2 data-reveal className="h-display text-3xl">{g.title}</h2>
                <div className="mt-6 divide-y divide-line rounded-[var(--radius-frame)] border border-line bg-white">
                  {g.items.map((item) => (
                    <details key={item.q} className="group px-6 sm:px-8">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg font-semibold tracking-tight [&::-webkit-details-marker]:hidden">
                        {item.q}
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand transition-transform group-open:rotate-45" aria-hidden>
                          +
                        </span>
                      </summary>
                      <p className="max-w-2xl pb-6 leading-relaxed text-muted">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}

            <div data-reveal className="flex flex-wrap items-center justify-between gap-6 rounded-[var(--radius-frame)] bg-navy-900 p-8 text-white sm:p-10">
              <div>
                <h2 className="h-display text-2xl sm:text-3xl">Still have a question?</h2>
                <p className="mt-2 text-white/70">{site.hours}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="btn btn-sun">Send a message</Link>
                <a href={site.phones[0].href} className="btn btn-ghost-light">{site.phones[0].label}</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
