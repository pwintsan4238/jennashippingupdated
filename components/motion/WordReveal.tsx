"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Segment = { text: string; className?: string };

/** Paragraph whose words light up one by one as it scrolls through the viewport. */
export function WordReveal({ segments, className }: { segments: Segment[]; className?: string }) {
  const root = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.12, y: 8 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: { trigger: root.current, start: "top 85%", end: "bottom 45%", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <p ref={root} className={className}>
      {segments.map((s, i) => (
        <span key={i} className={s.className}>
          {s.text.split(/(\s+)/).map((w, j) =>
            /^\s+$/.test(w) || !w ? (
              w
            ) : (
              <span key={j} data-word className="inline-block">
                {w}
              </span>
            ),
          )}
        </span>
      ))}
    </p>
  );
}
