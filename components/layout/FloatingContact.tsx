"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { site } from "@/lib/site";

const channels = [
  { label: "Viber", href: site.messaging.viber, color: "bg-[#7360f2]" },
  { label: "WhatsApp", href: site.messaging.whatsapp, color: "bg-[#25d366]" },
  { label: "Telegram", href: site.messaging.telegram, color: "bg-[#229ed9]" },
  { label: "Call", href: site.phones[0].href, color: "bg-brand" },
];

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 800);
      // stay out of the way of the hero; the header already has contact links
      setVisible(window.scrollY > 320);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible && !open) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 print:hidden sm:bottom-6 sm:right-6">
      {open && (
        <ul className="mb-1 flex flex-col items-end gap-2">
          {channels.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className={clsx("flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg", c.color)}
              >
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center gap-2">
        {showTop && (
          <button
            type="button"
            aria-label="Scroll to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex size-12 items-center justify-center rounded-full bg-white text-ink shadow-lg ring-1 ring-line"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="m6 15 6-6 6 6" />
            </svg>
          </button>
        )}
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex h-12 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white shadow-lg shadow-navy-950/25 hover:bg-navy-800"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12Z" />}
          </svg>
          Contact us
        </button>
      </div>
    </div>
  );
}
