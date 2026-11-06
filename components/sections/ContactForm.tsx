"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContact, type ContactState } from "@/lib/submit";
import { INQUIRY_TYPES, type InquiryType } from "@/lib/contact";

export function ContactForm({ defaultType = "seafarer" }: { defaultType?: InquiryType }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, {});
  const fe = state.fieldErrors ?? {};
  const v = state.values ?? {};
  const done = useRef<HTMLDivElement>(null);

  // The confirmation is much shorter than the form, so on phones it can end up above the screen.
  useEffect(() => {
    if (!state.ok || !done.current) return;
    done.current.scrollIntoView({ behavior: "smooth", block: "center" });
    done.current.focus({ preventScroll: true });
  }, [state.ok]);

  if (state.ok) {
    return (
      <div ref={done} tabIndex={-1} role="status" className="rounded-[var(--radius-frame)] bg-navy-900 p-10 text-center text-white outline-none">
        <p className="h-display text-2xl">Message sent — thank you!</p>
        <p className="mt-2 text-white/70">Our team will reply by email or phone within one working day.</p>
        {state.demo && <p className="mt-4 text-xs text-white/50">Demo mode: Supabase not configured, message not stored.</p>}
      </div>
    );
  }

  return (
    <form key={JSON.stringify(v)} action={action} className="grid flex-1 content-start gap-x-4 gap-y-5 sm:grid-cols-2" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <div>
        <label htmlFor="c-name" className="field-label">Full name<span className="text-red-600">*</span></label>
        <input id="c-name" name="name" defaultValue={v.name} required autoComplete="name" aria-invalid={fe.name ? true : undefined} className="field-input" />
        {fe.name && <p className="field-error">{fe.name}</p>}
      </div>
      <div>
        <label htmlFor="c-email" className="field-label">Email<span className="text-red-600">*</span></label>
        <input id="c-email" name="email" defaultValue={v.email} type="email" required autoComplete="email" aria-invalid={fe.email ? true : undefined} className="field-input" />
        {fe.email && <p className="field-error">{fe.email}</p>}
      </div>
      <div>
        <label htmlFor="c-phone" className="field-label">Phone / Viber</label>
        <input id="c-phone" name="phone" defaultValue={v.phone} type="tel" autoComplete="tel" placeholder="09 …" className="field-input" />
      </div>
      <div>
        <label htmlFor="c-type" className="field-label">Inquiry type</label>
        <select id="c-type" name="inquiryType" defaultValue={v.inquiryType ?? defaultType} className="field-input field-select">
          {Object.entries(INQUIRY_TYPES).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-msg" className="field-label">Message<span className="text-red-600">*</span></label>
        <textarea id="c-msg" name="message" defaultValue={v.message} rows={6} required aria-invalid={fe.message ? true : undefined} className="field-input resize-y" />
        {fe.message && <p className="field-error">{fe.message}</p>}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-file" className="field-label">Attach CV or document (optional)</label>
        <input
          id="c-file"
          name="attachment"
          type="file"
          accept=".pdf,.doc,.docx,image/jpeg,image/png"
          className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-paper file:px-4 file:py-3 file:font-semibold file:text-ink hover:file:bg-line"
        />
        <p className="mt-1 text-xs text-muted">PDF, Word or image · max 5 MB</p>
        {fe.attachment && <p className="field-error">{fe.attachment}</p>}
      </div>
      {state.error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">{state.error}</p>}
      <div className="sm:col-span-2" data-floating-avoid>
        <button type="submit" disabled={pending} className="btn btn-ink w-full sm:w-auto">
          {pending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
