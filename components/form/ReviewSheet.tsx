"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { ApplicationInput } from "@/lib/application-schema";
import { formatNrc } from "@/lib/application-schema";
import { formatDMY } from "@/lib/dates";
import { MAIN_CERTS, STCW_CERTS, TRADING_AREAS } from "@/lib/form-options";

const th = "border border-ink/70 bg-paper px-2 py-1.5 text-left text-[11px] font-bold uppercase";
const td = "border border-ink/70 px-2 py-1.5 text-center text-[12px] text-brand-600";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <th className={th}>{label}</th>
      <td className={td}>{children || "—"}</td>
    </>
  );
}

/** Read-only rendering laid out like the paper Seafarer's Application Form. */
export function ReviewSheet({ values, photo }: { values: ApplicationInput; photo: File | null }) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!photo) return;
    const u = URL.createObjectURL(photo);
    setPhotoUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [photo]);

  const p = values.personal;
  const certRows = [
    ...MAIN_CERTS.map((c) => ({
      ...values.certs[c.code],
      label: "customLabel" in c ? values.certs[c.code].label || "Other" : c.label,
      show: c.code !== "other" || Boolean(values.certs.other.number),
    })),
    ...STCW_CERTS.map((c) => ({ label: c.label, capacity: "", ...values.stcw[c.code], show: values.stcw[c.code].held })),
  ].filter((r) => r.show);
  const sea = values.noSeaService ? [] : values.seaService;
  const area = (v: string) => TRADING_AREAS.find((t) => t.value === v)?.value ?? v;

  const seaRows: [string, (i: number) => ReactNode][] = [
    ["Name of company", (i) => sea[i]?.company],
    ["Name of vessel", (i) => sea[i]?.vessel],
    ["Type of vessel", (i) => sea[i]?.vesselType],
    ["Flag", (i) => sea[i]?.flag],
    ["GRT/BHP or KW", (i) => (sea[i] ? [sea[i].grt, sea[i].power && `${sea[i].power} ${sea[i].powerUnit}`].filter(Boolean).join("/") : "")],
    ["Trading area", (i) => sea[i] && area(sea[i].tradingArea)],
    ["Rank", (i) => sea[i]?.rank],
    ["Date of sign-on", (i) => formatDMY(sea[i]?.signOn)],
    ["Date of sign-off", (i) => formatDMY(sea[i]?.signOff)],
    ["Remarks", (i) => sea[i]?.remarks],
  ];

  return (
    <div id="print-sheet" className="overflow-x-auto rounded-2xl border border-line bg-white p-4 sm:p-6">
      <div className="min-w-[760px] text-ink">
        <h3 className="mb-4 text-center font-serif text-2xl font-black tracking-wide">SEAFARER&apos;S APPLICATION FORM</h3>

        <p className="mb-1 text-xs font-black">1. PERSONAL PARTICULARS</p>
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <Row label="English name">{p.englishName?.toUpperCase()}</Row>
              <Row label="Date of birth">{formatDMY(p.dob)}</Row>
              <Row label="Place of birth">{p.placeOfBirth?.toUpperCase()}</Row>
              <td rowSpan={6} className="w-[120px] border border-ink/70 p-1 align-top">
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoUrl} alt="Applicant" className="aspect-[3/4] w-full object-cover" />
                ) : (
                  <span className="flex aspect-[3/4] items-center justify-center text-xs text-brand">PHOTO</span>
                )}
              </td>
            </tr>
            <tr>
              <Row label="Chinese name">{p.chineseName}</Row>
              <Row label="Height/Weight">{p.heightCm && `${p.heightCm}cm/${p.weightKg}kg`}</Row>
              <Row label="Next of kin">{p.nextOfKin?.toUpperCase()}</Row>
            </tr>
            <tr>
              <Row label="Position applied">{p.positionApplied}</Row>
              <Row label="Type of blood">{p.bloodType}</Row>
              <Row label="Relationship">{p.relationship?.toUpperCase()}</Row>
            </tr>
            <tr>
              <th className={th} rowSpan={2}>Address</th>
              <td className={td} colSpan={3} rowSpan={2}>{p.address}</td>
              <Row label="Boiler suit">{p.boilerSuit}</Row>
            </tr>
            <tr>
              <Row label="Shoes size">{p.shoeSize}</Row>
            </tr>
            <tr>
              <Row label="ID No. (NRC)">{formatNrc(p.nrc)}</Row>
              <Row label="Email">{p.email}</Row>
              <th className={th}>Home / Mobile</th>
              <td className={td}>{[p.homePhone, p.mobile].filter(Boolean).join(" / ")}</td>
            </tr>
          </tbody>
        </table>

        <p className="mb-1 mt-4 text-xs font-black">2. MARINE COLLEGE/SCHOOL ATTENDED</p>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Name of school", "Speciality", "Year of graduation", "Type of diploma held"].map((h) => (
                <th key={h} className={`${th} text-center`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {values.schools.map((s, i) => (
              <tr key={i}>
                <td className={td}>{s.name}</td>
                <td className={td}>{s.speciality}</td>
                <td className={td}>{s.graduationYear}</td>
                <td className={td}>{s.diploma}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mb-1 mt-4 text-xs font-black">3. CERTIFICATES</p>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Category", "Capacity", "Number", "Date of issue", "Date of expiry", "Issuing authority"].map((h) => (
                <th key={h} className={`${th} text-center`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {certRows.map((c, i) => (
              <tr key={i}>
                <th className={`${th} normal-case font-medium`}>{c.label}</th>
                <td className={td}>{c.capacity}</td>
                <td className={td}>{c.number}</td>
                <td className={td}>{formatDMY(c.issue)}</td>
                <td className={td}>{formatDMY(c.expiry)}</td>
                <td className={td}>{c.authority}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mb-1 mt-4 text-xs font-black">4. SEA SERVICE</p>
        {sea.length === 0 ? (
          <p className="border border-ink/70 px-2 py-3 text-center text-sm text-muted">No sea service yet</p>
        ) : (
          <table className="w-full table-fixed border-collapse">
            <tbody>
              {seaRows.map(([label, cell]) => (
                <tr key={label}>
                  <th className={`${th} w-[150px]`}>{label}</th>
                  {sea.map((_, i) => (
                    <td key={i} className={td}>{cell(i) || ""}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
