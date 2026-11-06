import Image from "next/image";
import { asset } from "@/lib/asset";

const PHOTOS = [
  { src: asset("/images/chinese-class.jpg"), caption: "Chinese language class, Yangon office", span: "col-span-2 row-span-2" },
  { src: asset("/images/welding-training.jpg"), caption: "Welding workshop", span: "" },
  { src: asset("/images/safety-maintenance.jpg"), caption: "FFE / LSA inspection", span: "" },
  { src: asset("/images/harbor-lighthouse.jpg"), caption: "Port calls worldwide", span: "" },
  { src: asset("/images/cargo-ship-harbor.jpg"), caption: "Bulk carrier entering port", span: "" },
];

export function Gallery() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-x">
        <div data-reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker text-brand">Gallery</p>
            <h2 className="h-display mt-4 text-4xl sm:text-5xl">Life at Jena Shipping</h2>
          </div>
          <p className="max-w-sm text-muted">Training days, drills and the people behind every contract.</p>
        </div>
        <div className="grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[220px] lg:grid-cols-4 lg:gap-4">
          {PHOTOS.map((p) => (
            <figure key={p.src} data-reveal="image" className={`group relative overflow-hidden rounded-2xl bg-navy-900 sm:rounded-3xl ${p.span}`}>
              <Image src={p.src} alt={p.caption} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-ink backdrop-blur">
                {p.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
