"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { adminClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { INQUIRY_TYPES } from "@/lib/contact";


const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.email("Invalid email address"),
  phone: z.string().trim().max(30),
  inquiryType: z.enum(Object.keys(INQUIRY_TYPES) as [keyof typeof INQUIRY_TYPES]),
  message: z.string().trim().min(10, "Please write a little more (10+ characters)").max(3000),
  website: z.string().max(0),
});

export type ContactState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  demo?: boolean;
  /** echoed back so the form can keep what was typed after React resets it */
  values?: Record<string, string>;
};

const MAX_FILE = 5 * 1024 * 1024;
const FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"];

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!rateLimit(`contact:${ip}`, 8, 60 * 60 * 1000)) return { error: "Too many messages. Please call or email us directly." };

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

  const db = adminClient();
  if (!db) {
    console.info("[contact] Supabase not configured — message not stored:", parsed.data);
    return { ok: true, demo: true };
  }

  const id = crypto.randomUUID();
  let attachmentPath: string | null = null;
  if (hasFile) {
    const safeName = file.name.replace(/[^\w.-]+/g, "_").slice(-80);
    attachmentPath = `contact/${id}/${safeName}`;
    const up = await db.storage.from("applications").upload(attachmentPath, file, { contentType: file.type });
    if (up.error) return { error: "We couldn't upload your attachment. Please try again.", values };
  }

  const d = parsed.data;
  const { error } = await db.from("contact_messages").insert({
    id,
    name: d.name,
    email: d.email,
    phone: d.phone || null,
    inquiry_type: d.inquiryType,
    message: d.message,
    attachment_path: attachmentPath,
  });
  if (error) {
    console.error("[contact] insert:", error.message);
    return { error: "We couldn't send your message. Please call or email us directly.", values };
  }
  return { ok: true };
}
