import clsx from "clsx";

/** Infinite running typography strip (duplicated track, CSS animation). */
export function Marquee({ words, className, reveal }: { words: string[]; className?: string; reveal?: boolean }) {
  const track = (
    <div className="flex shrink-0 items-center">
      {words.map((w, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="px-6">{w}</span>
          <span className="size-1.5 rounded-full bg-brand/40" />
        </span>
      ))}
    </div>
  );
  return (
    <div aria-hidden data-reveal={reveal ? "fade" : undefined} className={clsx("pointer-events-none flex select-none overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]", className)}>
      <div className="flex animate-marquee">
        {track}
        {track}
      </div>
    </div>
  );
}
