/**
 * Client-side form submit handlers for the static site.
 *
 * After validation, submissions are sent to a Google Apps Script web app that adds a row to the
 * company's Google Sheet, saves the photo/attachment to Google Drive and emails the office
 * (google-apps-script/Code.gs, setup in docs/GOOGLE_SHEETS_SETUP.md).
 * If `site.formsEndpoint` is empty the forms run in demo mode: they validate but send nothing.
 */
import { z } from "zod";
import { applicationSchema } from "@/lib/application-schema";
import { INQUIRY_TYPES } from "@/lib/contact";
import { applicationFields, contactFields, type SheetField } from "@/lib/sheet-rows";
import { site } from "@/lib/site";

export type ContactState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  demo?: boolean;
  /** echoed back so the form can keep what was typed after React resets it */
  values?: Record<string, string>;
};

export type SubmitResult =
  | { ok: true; reference: string; demo?: boolean }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.email("Invalid email address"),
  phone: z.string().trim().max(30),
  inquiryType: z.enum(Object.keys(INQUIRY_TYPES) as [keyof typeof INQUIRY_TYPES]),
  message: z.string().trim().min(10, "Please write a little more (10+ characters)").max(3000),
  website: z.string().max(0),
});

const MAX_FILE = 5 * 1024 * 1024;
const FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];
const MAX_PHOTO = 5 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

const SEND_FAILED = `Your details couldn't be sent. Please check your internet connection and try again, or call ${site.phones[0].label}.`;

type UploadFile = { name: string; type: string; base64: string };

async function toUpload(file: File): Promise<UploadFile> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return { name: file.name, type: file.type, base64: btoa(binary) };
}

/**
 * POST to the Apps Script web app. Sent as text/plain so the browser makes a "simple" request
 * (no CORS preflight, which Apps Script can't answer); the script parses the JSON body itself.
 */
async function sendToSheet(kind: "application" | "contact", fields: SheetField[], file?: File): Promise<{ ok: true; reference: string } | { ok: false; error: string }> {
  try {
    const res = await fetch(site.formsEndpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ kind, fields, file: file ? await toUpload(file) : undefined, website: "" }),
      redirect: "follow",
    });
    const data = (await res.json()) as { ok?: boolean; reference?: string; error?: string };
    if (data.ok && data.reference) return { ok: true, reference: data.reference };
    return { ok: false, error: data.error || SEND_FAILED };
  } catch {
    return { ok: false, error: SEND_FAILED };
  }
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = Object.fromEntries(
    ["name", "email", "phone", "inquiryType", "message", "website"].map((k) => [k, String(formData.get(k) ?? "")]),
  );
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { error: "Please check the highlighted fields.", fieldErrors, values };
  }

  const file = formData.get("attachment");
  const hasFile = file instanceof File && file.size > 0;
  if (hasFile && (!FILE_TYPES.includes(file.type) || file.size > MAX_FILE)) {
    return { error: "Attachment must be PDF, Word or image, under 5 MB.", fieldErrors: { attachment: "Invalid file" }, values };
  }

  if (!site.formsEndpoint) return { ok: true, demo: true };

  const res = await sendToSheet("contact", contactFields(parsed.data), hasFile ? file : undefined);
  return res.ok ? { ok: true } : { error: res.error, values };
}

export async function submitApplication(formData: FormData): Promise<SubmitResult> {
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

  if (!site.formsEndpoint) {
    return { ok: true, reference: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, demo: true };
  }

  const jobTitle = String(formData.get("jobTitle") ?? "") || undefined;
  return sendToSheet("application", applicationFields(parsed.data, jobTitle), photo);
}
