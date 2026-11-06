import type { ReactNode } from "react";

export function SectionCard({
  index,
  title,
  description,
  children,
}: {
  index: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-frame)] border border-line bg-white p-5 sm:p-8">
      <header className="mb-6 flex items-start gap-4 border-b border-line pb-5">
        <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 font-mono text-xs font-bold text-brand">{index}</span>
        <div>
          <h3 className="h-display text-2xl sm:text-[28px]">{title}</h3>
          {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}
