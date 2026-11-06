import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ApplicationFormFromQuery } from "@/components/form/ApplicationFormFromQuery";

export const metadata: Metadata = {
  title: "Open application",
  description: "Submit your Seafarer's Application Form to Jena Shipping for any deck, engine or catering rank.",
};

const NEEDS = ["Passport-style photo", "Passport, SID & Seaman Book details", "STCW certificate numbers & dates", "Last 5 vessels you served on"];

export default function OpenApplicationPage() {

  return (
    <>
      <PageHero
        kicker="Open application"
        title="Seafarer's application form."
        lead="Any rank, any department. Fill in your particulars, certificates and sea service once — our crewing team will contact you when a matching vessel opens."
      >
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {NEEDS.map((n) => (
            <li key={n} className="flex items-center gap-2 text-sm">
              <span className="text-brand" aria-hidden>✓</span>
              {n}
            </li>
          ))}
        </ul>
      </PageHero>
      <section className="pb-24 pt-14">
        <div className="container-x">
          <ApplicationFormFromQuery />
        </div>
      </section>
    </>
  );
}
