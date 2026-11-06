"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { FormProvider, useForm, type FieldErrors, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import {
  applicationSchema,
  emptyApplication,
  STEP_FIELDS,
  type Application,
  type ApplicationInput,
} from "@/lib/application-schema";
import { submitApplication } from "@/lib/submit";
import { PersonalSection } from "./PersonalSection";
import { SchoolSection } from "./SchoolSection";
import { CertificatesSection } from "./CertificatesSection";
import { SeaServiceSection } from "./SeaServiceSection";
import { ReviewSheet } from "./ReviewSheet";
import { DownloadPdfButton } from "./DownloadPdfButton";

const STEPS = ["Personal", "School", "Certificates", "Sea service", "Review"];

function scrollToFirstError() {
  requestAnimationFrame(() => {
    const el = document.querySelector<HTMLElement>('#apply-form [aria-invalid="true"], #apply-form [role="alert"]');
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (el && "focus" in el) el.focus({ preventScroll: true });
  });
}

export function ApplicationForm({ jobSlug = "", position = "", jobTitle }: { jobSlug?: string; position?: string; jobTitle?: string }) {
  const draftKey = `jena-apply-draft:${jobSlug || "general"}`;
  const methods = useForm<ApplicationInput, unknown, Application>({
    resolver: zodResolver(applicationSchema),
    defaultValues: emptyApplication(jobSlug, position),
    mode: "onTouched",
  });
  const { handleSubmit, trigger, reset, watch, getValues, getFieldState, setError, register, formState } = methods;

  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string>();
  const [restored, setRestored] = useState(false);
  const [serverError, setServerError] = useState<string>();
  const [result, setResult] = useState<{ reference: string; demo?: boolean } | null>(null);
  const [pending, startTransition] = useTransition();
  const top = useRef<HTMLDivElement>(null);

  // restore draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const draft = JSON.parse(raw) as { values: ApplicationInput; step: number };
      reset({ ...emptyApplication(jobSlug, position), ...draft.values, jobSlug, declaration: false as unknown as true });
      setStep(Math.min(draft.step ?? 0, STEPS.length - 1));
      setRestored(true);
    } catch {
      /* ignore broken drafts */
    }
  }, [draftKey, jobSlug, position, reset]);

  // autosave draft
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const sub = watch((values, { name }) => {
      // step validation uses trigger(), which doesn't enable re-validation; clear errors as soon as a field is fixed
      if (name && getFieldState(name).invalid) trigger(name);
      clearTimeout(t);
      t = setTimeout(() => {
        try {
          localStorage.setItem(draftKey, JSON.stringify({ values, step }));
        } catch {
          /* storage full or blocked */
        }
      }, 400);
    });
    return () => {
      clearTimeout(t);
      sub.unsubscribe();
    };
  }, [watch, draftKey, step, getFieldState, trigger]);

  const goTo = (n: number) => {
    setStep(n);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const next = async () => {
    const ok = await trigger(STEP_FIELDS[step] as unknown as FieldPath<ApplicationInput>[]);
    let photoOk = true;
    if (step === 0 && !photo) {
      setPhotoError("Please upload your photo");
      photoOk = false;
    }
    if (ok && photoOk) goTo(step + 1);
    else scrollToFirstError();
  };

  const onValid = (data: Application) => {
    if (!photo) {
      setPhotoError("Please upload your photo");
      return goTo(0);
    }
    setServerError(undefined);
    const fd = new FormData();
    fd.set("payload", JSON.stringify(data));
    fd.set("photo", photo);
    startTransition(async () => {
      const res = await submitApplication(fd);
      if (res.ok) {
        localStorage.removeItem(draftKey);
        setResult({ reference: res.reference, demo: res.demo });
        top.current?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      setServerError(res.error);
      if (res.fieldErrors) {
        const paths = Object.keys(res.fieldErrors);
        paths.forEach((p) => setError(p as FieldPath<ApplicationInput>, { message: res.fieldErrors![p] }));
        const first = paths[0]?.split(".")[0];
        const idx = STEP_FIELDS.findIndex((f) => (f as readonly string[]).includes(first));
        if (idx >= 0) goTo(idx);
        scrollToFirstError();
      }
    });
  };

  const onInvalid = (errs: FieldErrors<ApplicationInput>) => {
    const idx = STEP_FIELDS.findIndex((fields) => fields.some((f) => f in errs));
    if (idx >= 0 && idx !== step) goTo(idx);
    scrollToFirstError();
  };

  const discardDraft = () => {
    localStorage.removeItem(draftKey);
    reset(emptyApplication(jobSlug, position));
    setPhoto(null);
    setRestored(false);
    goTo(0);
  };

  if (result) {
    return (
      <div ref={top} className="rounded-[var(--radius-frame)] bg-navy-900 p-8 text-center text-white sm:p-14">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-sun text-ink">
          <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="m5 12 5 5L20 7" />
          </svg>
        </div>
        <h3 className="h-display text-3xl">Application received</h3>
        <p className="mx-auto mt-3 max-w-md text-white/70">
          Thank you. Our crewing team will review your documents and contact you by phone or email within 3–5 working days.
        </p>
        <p className="mt-6 font-mono text-sm text-white/60">Reference number</p>
        <p className="font-mono text-2xl font-bold text-sun">{result.reference}</p>
        {result.demo && (
          <p className="mx-auto mt-6 max-w-md rounded-xl bg-white/10 p-3 text-xs text-white/70">
            Demo mode: Supabase is not configured yet, so this application was validated but not stored.
          </p>
        )}
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div ref={top} className="scroll-mt-28" />
      <form id="apply-form" noValidate onSubmit={handleSubmit(onValid, onInvalid)} className="space-y-6">
        {jobTitle && (
          <h2 data-reveal className="h-display text-3xl sm:text-4xl">
            Apply for the position: <span className="text-brand">{jobTitle}</span>
          </h2>
        )}

        {/* stepper */}
        <nav aria-label="Form progress" className="sticky top-[84px] z-20 -mx-1 overflow-x-auto rounded-full border border-line bg-white/90 p-1.5 shadow-sm backdrop-blur">
          <ol className="flex min-w-max gap-1">
            {STEPS.map((label, i) => (
              <li key={label} className="flex-1">
                <button
                  type="button"
                  disabled={i > step}
                  onClick={() => goTo(i)}
                  aria-current={i === step ? "step" : undefined}
                  className={clsx(
                    "flex w-full items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition sm:text-sm",
                    i === step ? "bg-ink text-white" : i < step ? "text-ink hover:bg-paper" : "text-muted/60",
                  )}
                >
                  <span
                    className={clsx(
                      "flex size-5 items-center justify-center rounded-full font-mono text-[10px]",
                      i === step ? "bg-sun text-ink" : i < step ? "bg-brand text-white" : "bg-line",
                    )}
                  >
                    {i < step ? "✓" : i + 1}
                  </span>
                  {label}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {restored && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sun bg-sun/15 px-4 py-3 text-sm">
            <span>We restored your saved draft. {!photo && "Please re-attach your photo."}</span>
            <button type="button" onClick={discardDraft} className="font-semibold text-red-700 hover:underline">
              Start over
            </button>
          </div>
        )}

        {/* honeypot */}
        <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" {...register("website")} />

        <div hidden={step !== 0}>
          <PersonalSection
            photo={photo}
            onPhoto={(f) => {
              setPhoto(f);
              setPhotoError(undefined);
            }}
            photoError={photoError}
          />
        </div>
        <div hidden={step !== 1}>
          <SchoolSection />
        </div>
        <div hidden={step !== 2}>
          <CertificatesSection />
        </div>
        <div hidden={step !== 3}>
          <SeaServiceSection />
        </div>
        {step === 4 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="h-display text-[28px]">Review your application</h3>
                <p className="mt-1 text-sm text-muted">Check every detail matches your documents. Tap a step above to make changes.</p>
              </div>
              <DownloadPdfButton fileName={pdfName(getValues().personal.englishName)} />
            </div>
            <ReviewSheet values={getValues()} photo={photo} />
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-white p-4 text-sm">
              <input type="checkbox" {...register("declaration")} className="mt-0.5 size-4 accent-[var(--color-brand)]" />
              <span>
                I declare that the information given is true and complete. I understand that false information may lead to
                rejection of my application, and I consent to Jena Shipping storing my details for crew recruitment.
              </span>
            </label>
            {formState.errors.declaration && <p className="field-error">{formState.errors.declaration.message}</p>}
          </div>
        )}

        {serverError && (
          <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
            {serverError}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-line pt-6">
          <button type="button" onClick={() => goTo(step - 1)} disabled={step === 0} className="btn btn-ghost-dark">
            ← Back
          </button>
          <span className="hidden font-mono text-xs text-muted sm:block">
            Step {step + 1} of {STEPS.length} · draft saved on this device
          </span>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn btn-ink">
              Continue →
            </button>
          ) : (
            <button type="submit" disabled={pending} className="btn btn-sun">
              {pending ? "Submitting…" : "Submit application"}
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

function pdfName(name?: string) {
  const slug = (name ?? "").trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  return `Jena-Seafarer-Application${slug ? `-${slug.toUpperCase()}` : ""}.pdf`;
}
