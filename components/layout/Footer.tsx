import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/lib/site";
import { asset } from "@/lib/asset";

export function Footer() {
  return (
    <footer className="mt-4 bg-paper print:hidden">
      <div className="container-x border-t border-line py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
          <div data-reveal>
            <div className="flex items-center gap-3">
              <Image src={asset("/logo.png")} alt="" width={56} height={44} className="h-10 w-auto" />
              <span className="font-display text-lg font-semibold tracking-tight">Jena Shipping</span>
            </div>
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-muted">
              Myanmar seafarer recruitment, training and welfare — connecting qualified crew with reputable shipowners worldwide.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                ["Viber", site.messaging.viber],
                ["WhatsApp", site.messaging.whatsapp],
                ["Telegram", site.messaging.telegram],
              ].map(([l, h]) => (
                <a key={l} href={h} target={h.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium hover:border-ink/30">
                  {l}
                </a>
              ))}
            </div>
          </div>

          <div data-reveal>
            <p className="text-sm font-semibold">Explore</p>
            <ul className="mt-4 space-y-2.5 text-[15px] text-muted">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-ink">{n.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/careers/apply" className="hover:text-ink">Open application</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-ink">FAQ</Link>
              </li>
            </ul>
          </div>

          <div data-reveal>
            <p className="text-sm font-semibold">Contact</p>
            <ul className="mt-4 space-y-2.5 text-[15px] text-muted">
              {site.phones.map((p) => (
                <li key={p.href}>
                  <a href={p.href} className="hover:text-ink">{p.label}</a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`} className="break-all hover:text-ink">{site.email}</a>
              </li>
            </ul>
          </div>

          <div data-reveal>
            <p className="text-sm font-semibold">Office</p>
            <address className="mt-4 space-y-2.5 text-[15px] not-italic leading-relaxed text-muted">
              <p>{site.addressEn}</p>
              <p lang="my">{site.addressMy}</p>
              <p>{site.hours}</p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
          <p>Thingangyun Township, Yangon, Myanmar</p>
        </div>
      </div>
    </footer>
  );
}
