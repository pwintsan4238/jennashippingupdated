import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="py-28 sm:py-40">
      <div className="container-x max-w-3xl text-center">
        <p className="font-mono text-sm text-brand">404 · Off course</p>
        <h1 className="h-display mt-5 text-[clamp(2.5rem,6vw,4.5rem)] leading-none">This page has drifted out of range.</h1>
        <p className="lead mx-auto mt-6 max-w-xl">The link may be old, or the job may have been filled. Let&apos;s get you back on course.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-ink">Back to home</Link>
          <Link href="/careers" className="btn btn-ghost-dark">See open jobs</Link>
          <Link href="/contact" className="btn btn-ghost-dark">Contact us</Link>
        </div>
      </div>
    </section>
  );
}
