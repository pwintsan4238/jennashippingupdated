"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { emptySeaService, type ApplicationInput } from "@/lib/application-schema";
import { durationLabel, todayISO } from "@/lib/dates";
import { FLAGS, MAX_SEA_SERVICE, POSITIONS, POWER_UNITS, TRADING_AREAS, VESSEL_TYPES } from "@/lib/form-options";
import { ComboInput, DateInput, Field, Select, TextInput, useFieldError } from "./fields";
import { SectionCard } from "./SectionCard";

const RANKS = POSITIONS.map((p) => ({ value: p.value, label: p.value }));

function Entry({ index, count, onRemove, onMove }: { index: number; count: number; onRemove: () => void; onMove: (to: number) => void }) {
  const { register, watch } = useFormContext<ApplicationInput>();
  const base = `seaService.${index}` as const;
  const signOn = watch(`${base}.signOn`);
  const signOff = watch(`${base}.signOff`);
  const duration = durationLabel(signOn, signOff);
  const today = todayISO();

  return (
    <article className="rounded-2xl border border-line bg-paper/60 p-4 sm:p-5">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-display text-base font-semibold">
          <span className="mr-2 font-mono text-brand">{String(index + 1).padStart(2, "0")}</span>
          Company {index + 1}
          {index === 0 && <span className="ml-2 rounded-full bg-sun px-2 py-0.5 text-[11px] font-bold normal-case tracking-normal">Most recent</span>}
        </h4>
        <div className="flex items-center gap-1 text-xs font-semibold">
          <button type="button" disabled={index === 0} onClick={() => onMove(index - 1)} className="rounded-full px-2 py-1 hover:bg-ink/5 disabled:opacity-30" aria-label="Move up">
            ↑
          </button>
          <button type="button" disabled={index === count - 1} onClick={() => onMove(index + 1)} className="rounded-full px-2 py-1 hover:bg-ink/5 disabled:opacity-30" aria-label="Move down">
            ↓
          </button>
          {count > 1 && (
            <button type="button" onClick={onRemove} className="rounded-full px-2 py-1 text-red-600 hover:bg-red-50">
              Remove
            </button>
          )}
        </div>
      </header>

      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field name={`${base}.company`} label="Name of company" required className="sm:col-span-2">
          <TextInput name={`${base}.company`} upper placeholder="Company / manning agent" />
        </Field>
        <Field name={`${base}.vessel`} label="Name of vessel" required>
          <TextInput name={`${base}.vessel`} upper placeholder="MV HIRYU MARU" />
        </Field>
        <Field name={`${base}.vesselType`} label="Type of vessel" required>
          <ComboInput name={`${base}.vesselType`} options={VESSEL_TYPES} upper placeholder="GENERAL CARGO" />
        </Field>

        <Field name={`${base}.flag`} label="Flag" required>
          <ComboInput name={`${base}.flag`} options={FLAGS} upper placeholder="PANAMA" />
        </Field>
        <Field name={`${base}.grt`} label="GRT">
          <TextInput name={`${base}.grt`} inputMode="numeric" placeholder="1498" />
        </Field>
        <PowerField base={base} />
        <Field name={`${base}.tradingArea`} label="Trading area" required>
          <Select name={`${base}.tradingArea`} options={TRADING_AREAS} />
        </Field>

        <Field name={`${base}.rank`} label="Rank" required>
          <Select name={`${base}.rank`} options={RANKS} />
        </Field>
        <Field name={`${base}.signOn`} label="Date of sign-on" required>
          <DateInput name={`${base}.signOn`} max={today} />
        </Field>
        <Field name={`${base}.signOff`} label="Date of sign-off" hint={duration ? `Service: ${duration}` : "Leave empty if still on board"}>
          <DateInput name={`${base}.signOff`} min={signOn || undefined} max={today} />
        </Field>
        <Field name={`${base}.remarks`} label="Remarks">
          <input {...register(`${base}.remarks`)} className="field-input" placeholder="Optional" />
        </Field>
      </div>
    </article>
  );
}

function PowerField({ base }: { base: `seaService.${number}` }) {
  const { register } = useFormContext<ApplicationInput>();
  const error = useFieldError(`${base}.power`);
  return (
    <div>
      <label className="field-label" htmlFor={`${base}-power`}>
        BHP or KW
      </label>
      <div className="flex">
        <input
          id={`${base}-power`}
          {...register(`${base}.power`)}
          inputMode="numeric"
          placeholder="1324"
          aria-invalid={error ? true : undefined}
          className="field-input rounded-r-none"
        />
        <select aria-label="Power unit" {...register(`${base}.powerUnit`)} className="field-input field-select w-24 rounded-l-none border-l-0">
          {POWER_UNITS.map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export function SeaServiceSection() {
  const { control, register, watch } = useFormContext<ApplicationInput>();
  const { fields, append, remove, move, replace } = useFieldArray({ control, name: "seaService" });
  const noSeaService = watch("noSeaService");
  const listError = useFieldError("seaService");

  return (
    <SectionCard index="04" title="Sea service" description={`Up to ${MAX_SEA_SERVICE} vessels — Company 1 is your most recent contract.`}>
      <label className="mb-5 flex w-fit cursor-pointer items-center gap-3 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium">
        <input
          type="checkbox"
          {...register("noSeaService", {
            // hidden entries would still be validated, so clear them / restore one blank entry
            onChange: (e) => replace(e.target.checked ? [] : [{ ...emptySeaService }]),
          })}
          className="size-4 accent-[var(--color-brand)]"
        />
        No sea service yet (new cadet / rating)
      </label>

      {!noSeaService && (
        <>
          <div className="space-y-5">
            {fields.map((f, i) => (
              <Entry key={f.id} index={i} count={fields.length} onRemove={() => remove(i)} onMove={(to) => move(i, to)} />
            ))}
          </div>
          {listError && <p className="field-error mt-3">{listError}</p>}
          {fields.length < MAX_SEA_SERVICE && (
            <button type="button" onClick={() => append({ ...emptySeaService })} className="btn btn-ghost-dark mt-5">
              + Add previous vessel ({fields.length}/{MAX_SEA_SERVICE})
            </button>
          )}
        </>
      )}
    </SectionCard>
  );
}
