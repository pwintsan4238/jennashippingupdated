/** Dates are stored as local ISO strings (yyyy-mm-dd) and shown as dd.mm.yyyy like the paper form. */

export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromISO(s?: string | null): Date | undefined {
  if (!s || !ISO_DATE.test(s)) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDMY(s?: string | null): string {
  if (!s || !ISO_DATE.test(s)) return "";
  const [y, m, d] = s.split("-");
  return `${d}.${m}.${y}`;
}

export function todayISO(): string {
  return toISO(new Date());
}

/** Whole years between two ISO dates. */
export function yearsBetween(fromIso: string, toIso: string): number {
  const a = fromISO(fromIso)!;
  const b = fromISO(toIso)!;
  let years = b.getFullYear() - a.getFullYear();
  if (b.getMonth() < a.getMonth() || (b.getMonth() === a.getMonth() && b.getDate() < a.getDate())) years--;
  return years;
}

/** Human-readable duration such as "1 yr 2 mo 8 d". */
export function durationLabel(fromIso?: string, toIso?: string): string {
  const a = fromISO(fromIso);
  const b = fromISO(toIso);
  if (!a || !b || b < a) return "";
  let months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  let days = b.getDate() - a.getDate();
  if (days < 0) {
    months--;
    days += new Date(b.getFullYear(), b.getMonth(), 0).getDate();
  }
  const y = Math.floor(months / 12);
  const mo = months % 12;
  return [y && `${y} yr`, mo && `${mo} mo`, `${days} d`].filter(Boolean).join(" ");
}

/** Days until the given ISO date (negative if past). */
export function daysUntil(iso?: string): number | null {
  const d = fromISO(iso);
  if (!d) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - now.getTime()) / 86_400_000);
}
