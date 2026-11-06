"use client";

import { useFormContext } from "react-hook-form";
import type { ApplicationInput } from "@/lib/application-schema";
import { toISO } from "@/lib/dates";
import {
  BLOOD_TYPES,
  BOILER_SUITS,
  NRC_STATES,
  NRC_TYPES,
  POSITIONS,
  RELATIONSHIPS,
  SHOE_SIZES,
} from "@/lib/form-options";
import { ComboInput, DateInput, Field, Select, TextArea, TextInput, useFieldError } from "./fields";
import { PhotoUpload } from "./PhotoUpload";
import { SectionCard } from "./SectionCard";

export function PersonalSection({
  photo,
  onPhoto,
  photoError,
}: {
  photo: File | null;
  onPhoto: (f: File | null) => void;
  photoError?: string;
}) {
  const now = new Date();
  const maxDob = toISO(new Date(now.getFullYear() - 16, now.getMonth(), now.getDate()));
  const minDob = toISO(new Date(now.getFullYear() - 75, 0, 1));

  return (
    <SectionCard index="01" title="Personal particulars" description="As shown on your passport. Fields marked * are required.">
      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <PhotoUpload file={photo} onChange={onPhoto} error={photoError} />

        <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
          <Field name="personal.englishName" label="English name" required className="sm:col-span-2 xl:col-span-1">
            <TextInput name="personal.englishName" upper autoComplete="name" placeholder="NAY LIN SOE" />
          </Field>
          <Field name="personal.chineseName" label="Chinese name" hint="Optional">
            <TextInput name="personal.chineseName" placeholder="中文名" />
          </Field>
          <Field name="personal.positionApplied" label="Position applied" required>
            <Select name="personal.positionApplied" options={POSITIONS} />
          </Field>

          <Field name="personal.dob" label="Date of birth" required>
            <DateInput name="personal.dob" min={minDob} max={maxDob} />
          </Field>
          <Field name="personal.placeOfBirth" label="Place of birth" required>
            <TextInput name="personal.placeOfBirth" upper placeholder="YANGON" />
          </Field>
          <Field name="personal.bloodType" label="Type of blood" required>
            <Select name="personal.bloodType" options={BLOOD_TYPES} />
          </Field>

          <Field name="personal.heightCm" label="Height (cm)" required>
            <TextInput name="personal.heightCm" inputMode="decimal" placeholder="173" />
          </Field>
          <Field name="personal.weightKg" label="Weight (kg)" required>
            <TextInput name="personal.weightKg" inputMode="decimal" placeholder="91" />
          </Field>
          <Field name="personal.boilerSuit" label="Boiler suit" required>
            <Select name="personal.boilerSuit" options={BOILER_SUITS} />
          </Field>

          <Field name="personal.shoeSize" label="Shoe size (EU)" required>
            <Select name="personal.shoeSize" options={SHOE_SIZES} />
          </Field>
          <Field name="personal.nextOfKin" label="Next of kin" required>
            <TextInput name="personal.nextOfKin" upper placeholder="DAW LIN LIN HTET" />
          </Field>
          <Field name="personal.relationship" label="Relationship" required>
            <ComboInput name="personal.relationship" options={RELATIONSHIPS} upper placeholder="WIFE" />
          </Field>
        </div>
      </div>

      <div className="mt-6 grid gap-x-5 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
        <Field name="personal.address" label="Address" required className="sm:col-span-2 xl:col-span-3">
          <TextArea name="personal.address" rows={2} placeholder="No.538, Nga Moe Yeiak (4) Street, Thingangyun Tsp, Yangon" />
        </Field>

        <NrcField />

        <Field name="personal.mobile" label="Mobile no." required>
          <TextInput name="personal.mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="09 782945494" />
        </Field>
        <Field name="personal.homePhone" label="Home phone no." hint="Optional">
          <TextInput name="personal.homePhone" type="tel" inputMode="tel" placeholder="01 234567" />
        </Field>
        <Field name="personal.email" label="Email" required>
          <TextInput name="personal.email" type="email" autoComplete="email" placeholder="name@example.com" />
        </Field>
      </div>
    </SectionCard>
  );
}

function NrcField() {
  const { register, watch } = useFormContext<ApplicationInput>();
  const errState = useFieldError("personal.nrc.state");
  const errTown = useFieldError("personal.nrc.township");
  const errNum = useFieldError("personal.nrc.number");
  const nrc = watch("personal.nrc");
  const error = errState ?? errTown ?? errNum;
  const preview = nrc?.state && nrc.township && nrc.number ? `${nrc.state}/${nrc.township}(${nrc.type})${nrc.number}` : null;

  return (
    <fieldset className="sm:col-span-2 xl:col-span-3">
      <legend className="field-label">
        ID No. (NRC No.)<span className="ml-0.5 text-red-600">*</span>
      </legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-[90px_1fr_130px_1fr]">
        <select aria-label="NRC state number" aria-invalid={errState ? true : undefined} {...register("personal.nrc.state")} className="field-input field-select">
          <option value="">No.</option>
          {NRC_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          aria-label="Township code"
          aria-invalid={errTown ? true : undefined}
          placeholder="MaLaMa"
          autoComplete="off"
          {...register("personal.nrc.township")}
          className="field-input"
        />
        <select aria-label="NRC type" {...register("personal.nrc.type")} className="field-input field-select">
          {NRC_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <input
          aria-label="NRC 6-digit number"
          aria-invalid={errNum ? true : undefined}
          placeholder="133870"
          inputMode="numeric"
          maxLength={6}
          {...register("personal.nrc.number")}
          className="field-input tabular-nums"
        />
      </div>
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-1 text-xs text-muted">
          {preview ? (
            <>
              Will be saved as <strong className="font-mono text-ink">{preview}</strong>
            </>
          ) : (
            "Format: 10/MaLaMa(N)133870"
          )}
        </p>
      )}
    </fieldset>
  );
}
