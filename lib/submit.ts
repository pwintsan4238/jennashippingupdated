/**
 * Client-side form submit handlers for the static (GitHub Pages) build.
 *
 * The site is currently frontend-only: these validate the input and return a demo
 * success result without storing anything.
 *
 * TODO (backend): replace the "demo" branches with calls to the backend / admin API.
 * The original Supabase server-action versions live in app/actions/ for reference.
 */
import { z } from "zod";
import { applicationSchema } from "@/lib/application-schema";
import { INQUIRY_TYPES } from "@/lib/contact";

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
  if (file instanceof File && file.size > 0 && (!FILE_TYPES.includes(file.type) || file.size > MAX_FILE)) {
    return { error: "Attachment must be PDF, Word or image, under 5 MB.", fieldErrors: { attachment: "Invalid file" }, values };
  }

  // TODO (backend): send parsed.data (+ attachment) to the backend API here.
  return { ok: true, demo: true };
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

  // TODO (backend): send parsed.data + photo to the backend API and return its reference.
  return { ok: true, reference: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, demo: true };
}
