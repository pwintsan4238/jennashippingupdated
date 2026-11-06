"use server";

import { headers } from "next/headers";
import { applicationSchema, formatNrc, type Application } from "@/lib/application-schema";
import { MAIN_CERTS, STCW_CERTS } from "@/lib/form-options";
import { adminClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export type SubmitResult =
  | { ok: true; reference: string; demo?: boolean }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const MAX_PHOTO = 5 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

function toRow(id: string, a: Application, photoPath: string | null) {
  const p = a.personal;
  const certificates = [
    ...MAIN_CERTS.filter((c) => a.certs[c.code].number).map((c) => {
      const cert = a.certs[c.code];
      return {
        kind: "main",
        code: c.code,
        label: "customLabel" in c ? cert.label : c.label,
        capacity: cert.capacity,
        number: cert.number,
        issue_date: cert.issue,
        expiry_date: cert.expiry,
        authority: cert.authority,
      };
    }),
    ...STCW_CERTS.filter((c) => a.stcw[c.code].held).map((c) => {
      const cert = a.stcw[c.code];
      return {
        kind: "stcw",
        code: c.code,
        label: c.label,
        capacity: "",
        number: cert.number,
        issue_date: cert.issue,
        expiry_date: cert.expiry,
        authority: cert.authority,
      };
    }),
  ];

  return {
    id,
    job_slug: a.jobSlug,
    position_applied: p.positionApplied,
    english_name: p.englishName.toUpperCase(),
    chinese_name: p.chineseName,
    dob: p.dob,
    place_of_birth: p.placeOfBirth,
    height_cm: p.heightCm,
    weight_kg: p.weightKg,
    blood_type: p.bloodType,
    next_of_kin: p.nextOfKin,
    relationship: p.relationship,
    address: p.address,
    boiler_suit: p.boilerSuit,
    shoe_size: p.shoeSize,
    home_phone: p.homePhone,
    mobile: p.mobile,
    email: p.email,
    nrc: formatNrc(p.nrc),
    no_sea_service: a.noSeaService,
    photo_path: photoPath,
    schools: a.schools.map((s) => ({
      name: s.name,
      speciality: s.speciality,
      graduation_year: s.graduationYear,
      diploma: s.diploma,
    })),
    certificates,
    sea_service: (a.noSeaService ? [] : a.seaService).map((s, i) => ({
      position_order: i + 1,
      company: s.company,
      vessel: s.vessel,
      vessel_type: s.vesselType,
      flag: s.flag,
      grt: s.grt,
      power: s.power,
      power_unit: s.powerUnit,
      trading_area: s.tradingArea,
      rank: s.rank,
      sign_on: s.signOn,
      sign_off: s.signOff,
      remarks: s.remarks,
    })),
  };
}

export async function submitApplication(formData: FormData): Promise<SubmitResult> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!rateLimit(`apply:${ip}`, 5, 60 * 60 * 1000)) {
    return { ok: false, error: "Too many submissions from this network. Please try again later or call our office." };
  }

  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("payload") ?? ""));
  } catch {
    return { ok: false, error: "The form data could not be read. Please try again." };
  }

  const parsed = applicationSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path.join(".")] ??= issue.message;
    return { ok: false, error: "Some fields need attention.", fieldErrors };
  }

  const photo = formData.get("photo");
  if (!(photo instanceof File) || photo.size === 0) return { ok: false, error: "Please attach your photo." };
  if (!PHOTO_TYPES.includes(photo.type) || photo.size > MAX_PHOTO) {
    return { ok: false, error: "Photo must be a JPG, PNG or WEBP image under 5 MB." };
  }

  const id = crypto.randomUUID();
  const db = adminClient();

  if (!db) {
    // Supabase not configured yet (local/dev): log so the payload can be inspected.
    console.info("[apply] Supabase not configured — application not stored:", JSON.stringify(toRow(id, parsed.data, null)));
    return { ok: true, reference: `DEMO-${id.slice(0, 8).toUpperCase()}`, demo: true };
  }

  const ext = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
  const photoPath = `${id}/photo.${ext}`;
  const upload = await db.storage.from("applications").upload(photoPath, photo, { contentType: photo.type });
  if (upload.error) {
    console.error("[apply] photo upload:", upload.error.message);
    return { ok: false, error: "We couldn't upload your photo. Please try again." };
  }

  const { data, error } = await db.rpc("submit_application", { p: toRow(id, parsed.data, photoPath) });
  if (error || !data?.[0]) {
    console.error("[apply] insert:", error?.message);
    await db.storage.from("applications").remove([photoPath]);
    return { ok: false, error: "We couldn't save your application. Please try again or contact our office." };
  }

  return { ok: true, reference: data[0].reference as string };
}
