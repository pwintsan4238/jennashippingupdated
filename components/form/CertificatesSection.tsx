"use client";

import { useFormContext } from "react-hook-form";
import clsx from "clsx";
import type { ApplicationInput } from "@/lib/application-schema";
import { daysUntil, todayISO } from "@/lib/dates";
import { AUTHORITIES, COC_CAPACITIES, MAIN_CERTS, STCW_CERTS, type StcwCode } from "@/lib/form-options";
import { ComboInput, DateInput, Field, TextInput, useFieldError } from "./fields";
import { SectionCard } from "./SectionCard";

const ROW = "grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(230px,1.3fr)_1fr_1fr_1fr_1fr] lg:items-start";

type Prefix = `certs.${(typeof MAIN_CERTS)[number]["code"]}` | `stcw.${StcwCode}`;

function ExpiryBadge({ expiry }: { expiry?: string }) {
  const d = daysUntil(expiry);
  if (d === null) return null;
  if (d < 0) return <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700">Expired</span>;
  if (d < 180) return <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">Expires soon</span>;
  return null;
}

function CertInputs({ prefix, required }: { prefix: Prefix; required?: boolean }) {
  const { watch } = useFormContext<ApplicationInput>();
  const issue = watch(`${prefix}.issue`) as string;
  const expiry = watch(`${prefix}.expiry`) as string;
  const today = todayISO();
  const hide = "lg:sr-only";

  return (
    <>
      <Field name={`${prefix}.number`} label="Number" required={required} labelClassName={hide}>
        <TextInput name={`${prefix}.number`} upper placeholder="Number" autoComplete="off" />
      </Field>
      <Field name={`${prefix}.issue`} label="Date of issue" required={required} labelClassName={hide}>
        <DateInput name={`${prefix}.issue`} max={today} />
      </Field>
      <Field name={`${prefix}.expiry`} label={<>Date of expiry <ExpiryBadge expiry={expiry} /></>} required={required} labelClassName={clsx(hide)}>
        <DateInput name={`${prefix}.expiry`} min={issue || undefined} />
      </Field>
      <Field name={`${prefix}.authority`} label="Issuing authority" required={required} labelClassName={hide}>
        <ComboInput name={`${prefix}.authority`} options={AUTHORITIES} upper placeholder="DMA" />
      </Field>
      {expiry && <div className="-mt-2 hidden lg:col-start-4 lg:block"><ExpiryBadge expiry={expiry} /></div>}
    </>
  );
}

function TableHeader() {
  return (
    <div className={clsx(ROW, "hidden border-b border-line pb-2 font-mono text-[11px] font-bold uppercase tracking-wider text-muted lg:grid")}>
      <span>Category</span>
      <span>Number</span>
      <span>Date of issue</span>
      <span>Date of expiry</span>
      <span>Issuing authority</span>
    </div>
  );
}

function StcwRow({ code, label, index }: { code: StcwCode; label: string; index: number }) {
  const { register, watch, setValue, getValues } = useFormContext<ApplicationInput>();
  const held = watch(`stcw.${code}.held`);
  const numberError = useFieldError(`stcw.${code}.number`);
  const issueError = useFieldError(`stcw.${code}.issue`);
  const anyError = numberError ?? issueError;

  // Many Myanmar STCW certs share one DMA number and dates; let the user copy them from the row above.
  const previous = STCW_CERTS.slice(0, index)
    .map((c) => c.code)
    .reverse()
    .find((c) => getValues(`stcw.${c}.held`) && getValues(`stcw.${c}.number`));

  const copyPrevious = () => {
    if (!previous) return;
    const src = getValues(`stcw.${previous}`);
    setValue(`stcw.${code}`, { ...src, held: true }, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className={clsx("rounded-2xl border p-3 transition sm:p-4", held ? "border-brand/30 bg-brand/[0.03]" : "border-line", anyError && "border-red-300")}>
      <div className={clsx(held && ROW)}>
        <div className="flex items-start justify-between gap-2 lg:pt-2.5">
          <label className="flex cursor-pointer items-start gap-3 text-sm font-medium">
            <input type="checkbox" {...register(`stcw.${code}.held`)} className="mt-0.5 size-4 shrink-0 accent-[var(--color-brand)]" />
            {label}
          </label>
          {held && previous && (
            <button type="button" onClick={copyPrevious} className="shrink-0 text-xs font-semibold text-brand hover:underline lg:hidden">
              Same as above
            </button>
          )}
        </div>
        {held && <CertInputs prefix={`stcw.${code}`} required />}
      </div>
      {held && previous && (
        <button type="button" onClick={copyPrevious} className="mt-2 hidden text-xs font-semibold text-brand hover:underline lg:inline">
          ↳ Same number &amp; dates as above
        </button>
      )}
    </div>
  );
}

export function CertificatesSection() {
  const { watch } = useFormContext<ApplicationInput>();
  const heldCount = STCW_CERTS.filter((c) => watch(`stcw.${c.code}.held`)).length;

  return (
    <SectionCard
      index="03"
      title="Certificates"
      description="Pick dates from the calendar. Passport is required; fill any other document you hold."
    >
      <h4 className="mb-3 font-display text-lg font-semibold">Documents &amp; competency</h4>
      <TableHeader />
      <div className="divide-y divide-line">
        {MAIN_CERTS.map((c) => (
          <div key={c.code} className={clsx(ROW, "py-4")}>
            <div className="space-y-2 lg:pt-2.5">
              <p className="text-sm font-semibold">
                {c.label}
                {"required" in c && <span className="ml-0.5 text-red-600">*</span>}
              </p>
              {"hasCapacity" in c && (
                <Field name="certs.coc.capacity" label="Capacity / grade" labelClassName="text-xs">
                  <ComboInput name="certs.coc.capacity" options={COC_CAPACITIES} placeholder="e.g. Chief Engineer (Unlimited)" />
                </Field>
              )}
              {"customLabel" in c && (
                <Field name="certs.other.label" label="Certificate name" labelClassName="text-xs">
                  <TextInput name="certs.other.label" placeholder="e.g. GOC, Tanker DCE" />
                </Field>
              )}
            </div>
            <CertInputs prefix={`certs.${c.code}`} required={"required" in c} />
          </div>
        ))}
      </div>

      <div className="mt-10 mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="font-display text-lg font-semibold">Tick the certificates you hold</h4>
        <span className="font-mono text-xs text-muted">{heldCount} selected</span>
      </div>
      <div className="space-y-2">
        {STCW_CERTS.map((c, i) => (
          <StcwRow key={c.code} code={c.code} label={c.label} index={i} />
        ))}
      </div>
    </SectionCard>
  );
}
