import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { TrainingShowcase } from "@/components/sections/TrainingShowcase";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "Services & Training",
  description:
    "Seafarer placement, crew supply for shipowners, LSA/FFE, crane, welding and Chinese language training, and seafarer welfare support from Jena Shipping, Yangon.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        kicker="Services"
        title="Placement, training and welfare — under one roof."
        lead="One Yangon team supporting Myanmar crew from first application to sign-off, and supplying shipowners with qualified officers and ratings."
        image={asset("/images/1600-x900-anchorage.jpg")}
        imageAlt="Tanker and cargo vessel at anchorage at sunset"
        imagePosition="object-[50%_78%]"
      />
      <ServicesGrid />
      <div id="training" className="scroll-mt-20">
        <TrainingShowcase cta={false} />
      </div>
      <CtaBanner />
    </>
  );
}
