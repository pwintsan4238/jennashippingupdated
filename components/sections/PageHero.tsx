import Image from "next/image";
import type { ReactNode } from "react";

/** Light editorial page header: title block, then an optional framed image. */
export function PageHero({
  kicker,
  title,
  lead,
  image,
  imageAlt = "",
  imagePosition = "object-center",
  children,
  aside,
}: {
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  image?: string;
  imageAlt?: string;
  /** Tailwind object-position class for the wide crop */
  imagePosition?: string;
  children?: ReactNode;
  /** right-hand column content on large screens (e.g. facts) */
  aside?: ReactNode;
}) {
  return (
    <section className="pt-14 sm:pt-20">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p data-reveal className="kicker text-brand">{kicker}</p>
            <h1 data-reveal className="h-display mt-5 text-[clamp(2.5rem,5.6vw,4.75rem)] leading-[1.0]">{title}</h1>
          </div>
          <div data-reveal className="lg:pb-2">
            {lead && <p className="lead">{lead}</p>}
            {children}
          </div>
        </div>
        {aside}
      </div>
      {image && (
        <div className="mt-12 px-2 sm:mt-16 sm:px-4">
          <div data-reveal="image" className="relative mx-auto aspect-[16/9] max-h-[620px] w-full max-w-[1680px] overflow-hidden rounded-[28px] sm:aspect-[21/8] sm:rounded-[36px]">
            <Image src={image} alt={imageAlt} fill priority sizes="100vw" className={`object-cover ${imagePosition}`} />
          </div>
        </div>
      )}
    </section>
  );
}
