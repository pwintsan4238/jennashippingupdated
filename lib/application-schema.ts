import { z } from "zod";
import { ISO_DATE, todayISO, yearsBetween } from "./dates";
import {
  BLOOD_TYPES,
  BOILER_SUITS,
  MAIN_CERTS,
  MAX_SCHOOLS,
  MAX_SEA_SERVICE,
  NRC_TYPES,
  POSITION_VALUES,
  POWER_UNITS,
  SHOE_SIZES,
  STCW_CERTS,
  type MainCertCode,
  type StcwCode,
} from "./form-options";

const REQUIRED = "Required";
const text = (max = 120) => z.string().trim().max(max, `Max ${max} characters`);
const requiredText = (max = 120) => text(max).min(1, REQUIRED);
const optionalDate = z.string().refine((v) => v === "" || ISO_DATE.test(v), "Pick a date from the calendar");
const requiredDate = z.string().min(1, "Pick a date from the calendar").regex(ISO_DATE, "Pick a date from the calendar");
const digits = (label: string, max: number) =>
  z.string().trim().refine((v) => v === "" || (/^\d+(\.\d+)?$/.test(v) && Number(v) <= max), `${label} must be a number`);

const isObject = (p: { value: unknown }) => typeof p.value === "object" && p.value !== null;

const MOBILE = /^(\+?959|09)\d{7,9}$/;
const PHONE = /^\+?\d{6,15}$/;
const stripPhone = (v: string) => v.replace(/[\s\-()]/g, "");

const nrcSchema = z.object({
  state: z.string().min(1, REQUIRED),
  township: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{3,12}$/, "Letters only, e.g. MaLaMa"),
  type: z.enum(NRC_TYPES.map((t) => t.value) as [string, ...string[]], { error: REQUIRED }),
  number: z.string().trim().regex(/^\d{6}$/, "6 digits"),
});

const personalSchema = z
  .object({
    englishName: requiredText(80).regex(/^[A-Za-z .'-]+$/, "Use English letters only"),
    chineseName: text(40),
    dob: requiredDate,
    placeOfBirth: requiredText(60),
    heightCm: z.string().trim().min(1, REQUIRED).refine((v) => Number(v) >= 120 && Number(v) <= 230, "120–230 cm"),
    weightKg: z.string().trim().min(1, REQUIRED).refine((v) => Number(v) >= 35 && Number(v) <= 200, "35–200 kg"),
    positionApplied: z.enum(POSITION_VALUES, { error: "Choose a position" }),
    bloodType: z.enum(BLOOD_TYPES, { error: "Choose blood type" }),
    nextOfKin: requiredText(80),
    relationship: requiredText(30),
    address: requiredText(300),
    boilerSuit: z.enum(BOILER_SUITS, { error: "Choose a size" }),
    shoeSize: z.enum(SHOE_SIZES, { error: "Choose a size" }),
    homePhone: z.string().trim().refine((v) => v === "" || PHONE.test(stripPhone(v)), "Invalid phone number"),
    mobile: z.string().trim().refine((v) => MOBILE.test(stripPhone(v)), "Myanmar mobile, e.g. 09 782945494"),
    email: z.email("Invalid email address"),
    nrc: nrcSchema,
  })
  .superRefine((p, ctx) => {
    if (ISO_DATE.test(p.dob)) {
      const age = yearsBetween(p.dob, todayISO());
      if (age < 16 || age > 75) ctx.addIssue({ code: "custom", path: ["dob"], message: "Age must be 16–75" });
    }
  }, { when: isObject });

const schoolSchema = z.object({
  name: requiredText(120),
  speciality: requiredText(80),
  graduationYear: z.string().regex(/^\d{4}$/, "Choose a year"),
  diploma: requiredText(120),
});

const certSchema = z.object({
  label: text(80),
  capacity: text(80),
  number: text(40),
  issue: optionalDate,
  expiry: optionalDate,
  authority: text(40),
});

const stcwCertSchema = z.object({
  held: z.boolean(),
  number: text(40),
  issue: optionalDate,
  expiry: optionalDate,
  authority: text(40),
});

const mainShape = Object.fromEntries(MAIN_CERTS.map((c) => [c.code, certSchema])) as Record<MainCertCode, typeof certSchema>;
const stcwShape = Object.fromEntries(STCW_CERTS.map((c) => [c.code, stcwCertSchema])) as Record<StcwCode, typeof stcwCertSchema>;

const seaServiceSchema = z.object({
  company: requiredText(100),
  vessel: requiredText(80),
  vesselType: requiredText(40),
  flag: requiredText(40),
  grt: digits("GRT", 1_000_000),
  power: digits("Power", 1_000_000),
  powerUnit: z.enum(POWER_UNITS),
  tradingArea: z.string().min(1, REQUIRED),
  rank: z.string().min(1, REQUIRED),
  signOn: requiredDate,
  signOff: optionalDate,
  remarks: text(200),
});

export const applicationSchema = z
  .object({
    jobSlug: z.string(),
    personal: personalSchema,
    schools: z.array(schoolSchema).min(1).max(MAX_SCHOOLS),
    certs: z.object(mainShape),
    stcw: z.object(stcwShape),
    noSeaService: z.boolean(),
    seaService: z.array(seaServiceSchema).max(MAX_SEA_SERVICE),
    declaration: z.literal(true, { error: "Please confirm the declaration" }),
    /** honeypot — must stay empty */
    website: z.string().max(0),
  })
  .superRefine((v, ctx) => {
    const today = todayISO();

    const checkDates = (path: (string | number)[], issue: string, expiry: string) => {
      if (issue && issue > today) ctx.addIssue({ code: "custom", path: [...path, "issue"], message: "Cannot be in the future" });
      if (issue && expiry && expiry <= issue)
        ctx.addIssue({ code: "custom", path: [...path, "expiry"], message: "Must be after date of issue" });
    };

    for (const c of MAIN_CERTS) {
      const cert = v.certs?.[c.code];
      if (!cert) continue;
      const touched = Boolean(cert.number || cert.issue || cert.expiry || cert.authority || cert.capacity);
      const required = "required" in c && c.required;
      if (touched || required) {
        if (!cert.number) ctx.addIssue({ code: "custom", path: ["certs", c.code, "number"], message: REQUIRED });
        if (!cert.issue) ctx.addIssue({ code: "custom", path: ["certs", c.code, "issue"], message: REQUIRED });
        if (!cert.authority) ctx.addIssue({ code: "custom", path: ["certs", c.code, "authority"], message: REQUIRED });
        if (required && !cert.expiry) ctx.addIssue({ code: "custom", path: ["certs", c.code, "expiry"], message: REQUIRED });
        if ("customLabel" in c && !cert.label)
          ctx.addIssue({ code: "custom", path: ["certs", c.code, "label"], message: "Name the certificate" });
      }
      checkDates(["certs", c.code], cert.issue, cert.expiry);
    }

    for (const c of STCW_CERTS) {
      const cert = v.stcw?.[c.code];
      if (!cert?.held) continue;
      if (!cert.number) ctx.addIssue({ code: "custom", path: ["stcw", c.code, "number"], message: REQUIRED });
      if (!cert.issue) ctx.addIssue({ code: "custom", path: ["stcw", c.code, "issue"], message: REQUIRED });
      if (!cert.authority) ctx.addIssue({ code: "custom", path: ["stcw", c.code, "authority"], message: REQUIRED });
      checkDates(["stcw", c.code], cert.issue, cert.expiry);
    }

    const sea = Array.isArray(v.seaService) ? v.seaService : [];
    if (!v.noSeaService && sea.length === 0)
      ctx.addIssue({ code: "custom", path: ["seaService"], message: "Add at least one vessel, or tick “No sea service yet”" });

    sea.forEach((s, i) => {
      if (!s) return;
      if (s.signOn && s.signOn > today)
        ctx.addIssue({ code: "custom", path: ["seaService", i, "signOn"], message: "Cannot be in the future" });
      if (s.signOn && s.signOff && s.signOff < s.signOn)
        ctx.addIssue({ code: "custom", path: ["seaService", i, "signOff"], message: "Must be after sign-on" });
    });
  }, { when: isObject });

export type ApplicationInput = z.input<typeof applicationSchema>;
export type Application = z.output<typeof applicationSchema>;

const emptyCert = { label: "", capacity: "", number: "", issue: "", expiry: "", authority: "" };
const emptyStcw = { held: false, number: "", issue: "", expiry: "", authority: "" };

export const emptySeaService = {
  company: "",
  vessel: "",
  vesselType: "",
  flag: "",
  grt: "",
  power: "",
  powerUnit: "KW" as const,
  tradingArea: "",
  rank: "",
  signOn: "",
  signOff: "",
  remarks: "",
};

export const emptySchool = { name: "", speciality: "", graduationYear: "", diploma: "" };

export function emptyApplication(jobSlug = "", position = ""): ApplicationInput {
  return {
    jobSlug,
    personal: {
      englishName: "",
      chineseName: "",
      dob: "",
      placeOfBirth: "",
      heightCm: "",
      weightKg: "",
      positionApplied: position as ApplicationInput["personal"]["positionApplied"],
      bloodType: "" as ApplicationInput["personal"]["bloodType"],
      nextOfKin: "",
      relationship: "",
      address: "",
      boilerSuit: "" as ApplicationInput["personal"]["boilerSuit"],
      shoeSize: "" as ApplicationInput["personal"]["shoeSize"],
      homePhone: "",
      mobile: "",
      email: "",
      nrc: { state: "", township: "", type: "N", number: "" },
    },
    schools: [{ ...emptySchool }],
    certs: Object.fromEntries(MAIN_CERTS.map((c) => [c.code, { ...emptyCert }])) as ApplicationInput["certs"],
    stcw: Object.fromEntries(STCW_CERTS.map((c) => [c.code, { ...emptyStcw }])) as ApplicationInput["stcw"],
    noSeaService: false,
    seaService: [{ ...emptySeaService }],
    declaration: false as unknown as true,
    website: "",
  };
}

export function formatNrc(n: { state: string; township: string; type: string; number: string }) {
  if (!n.state || !n.township || !n.number) return "";
  return `${n.state}/${n.township}(${n.type})${n.number}`;
}

/** Fields validated when leaving each step. */
export const STEP_FIELDS = [
  ["personal"],
  ["schools"],
  ["certs", "stcw"],
  ["seaService", "noSeaService"],
  ["declaration"],
] as const;
