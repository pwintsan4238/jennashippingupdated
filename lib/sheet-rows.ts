/**
 * Turns validated form data into labelled cells for the Google Sheet.
 * Each submission becomes one row; the label is the column header, so adding a field here
 * adds a column in the sheet automatically (the Apps Script appends unknown headers).
 */
import type { Application } from "./application-schema";
import { formatNrc } from "./application-schema";
import { formatDMY } from "./dates";
import { MAIN_CERTS, POSITIONS, STCW_CERTS } from "./form-options";
import { INQUIRY_TYPES, type InquiryType } from "./contact";

export type SheetField = [label: string, value: string];

const join = (parts: (string | undefined | null | false)[], sep = ", ") => parts.filter(Boolean).join(sep);

function certLine(label: string, c: { number?: string; issue?: string; expiry?: string; authority?: string; capacity?: string }) {
  return join([
    label + (c.capacity ? ` (${c.capacity})` : ""),
    c.number && `No. ${c.number}`,
    c.issue && `issued ${formatDMY(c.issue)}`,
    c.expiry && `expires ${formatDMY(c.expiry)}`,
    c.authority && `by ${c.authority}`,
  ]);
}

export function applicationFields(a: Application, jobTitle?: string): SheetField[] {
  const p = a.personal;
  const position = POSITIONS.find((x) => x.value === p.positionApplied)?.label ?? p.positionApplied;

  const schools = a.schools.map((s, i) => `${i + 1}. ${join([s.name, s.speciality, s.diploma, s.graduationYear])}`).join("\n");

  const certs = MAIN_CERTS.map((c) => {
    const v = a.certs[c.code];
    if (!v.number) return null;
    const label = "customLabel" in c ? v.label || "Other certificate" : c.label;
    return certLine(label, "hasCapacity" in c ? v : { ...v, capacity: "" });
  })
    .filter(Boolean)
    .join("\n");

  const stcw = STCW_CERTS.filter((c) => a.stcw[c.code].held)
    .map((c) => certLine(c.label, a.stcw[c.code]))
    .join("\n");

  const sea = a.noSeaService
    ? "No sea service yet"
    : a.seaService
        .map((s, i) =>
          `${i + 1}. ` +
          join([
            s.rank,
            s.vessel && `${s.vessel} (${join([s.vesselType, s.flag])})`,
            s.company,
            join([s.grt && `GRT ${s.grt}`, s.power && `${s.power} ${s.powerUnit}`], " / "),
            s.tradingArea,
            `${formatDMY(s.signOn)} – ${s.signOff ? formatDMY(s.signOff) : "present"}`,
            s.remarks,
          ]),
        )
        .join("\n");

  return [
    ["Position applied", position],
    ["Job opening", jobTitle ?? (a.jobSlug ? a.jobSlug : "Open application")],
    ["English name", p.englishName],
    ["Chinese name", p.chineseName],
    ["Date of birth", formatDMY(p.dob)],
    ["Place of birth", p.placeOfBirth],
    ["Mobile", p.mobile],
    ["Home phone", p.homePhone],
    ["Email", p.email],
    ["NRC", formatNrc(p.nrc)],
    ["Address", p.address],
    ["Height (cm)", p.heightCm],
    ["Weight (kg)", p.weightKg],
    ["Blood type", p.bloodType],
    ["Boiler suit", p.boilerSuit],
    ["Shoe size", p.shoeSize],
    ["Next of kin", p.nextOfKin],
    ["Relationship", p.relationship],
    ["Schools", schools],
    ["Certificates", certs],
    ["STCW certificates", stcw],
    ["Sea service", sea],
  ];
}

export function contactFields(c: { name: string; email: string; phone: string; inquiryType: string; message: string }): SheetField[] {
  return [
    ["Name", c.name],
    ["Email", c.email],
    ["Phone / Viber", c.phone],
    ["Inquiry type", INQUIRY_TYPES[c.inquiryType as InquiryType] ?? c.inquiryType],
    ["Message", c.message],
  ];
}
