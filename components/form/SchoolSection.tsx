"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { emptySchool, type ApplicationInput } from "@/lib/application-schema";
import { MAX_SCHOOLS } from "@/lib/form-options";
import { Field, TextInput, YearSelect } from "./fields";
import { SectionCard } from "./SectionCard";

export function SchoolSection() {
  const { control } = useFormContext<ApplicationInput>();
  const { fields, append, remove } = useFieldArray({ control, name: "schools" });

  return (
    <SectionCard index="02" title="Marine college / school attended" description="List your maritime education, most recent first.">
      <div className="space-y-5">
        {fields.map((f, i) => (
          <div key={f.id} className="relative rounded-2xl border border-line bg-paper/60 p-4 sm:p-5">
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute right-3 top-3 rounded-full px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            )}
            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field name={`schools.${i}.name`} label="Name of school" required className="sm:col-span-2 lg:col-span-1">
                <TextInput name={`schools.${i}.name`} upper placeholder="I.T.C (THANLYIN)" />
              </Field>
              <Field name={`schools.${i}.speciality`} label="Speciality" required>
                <TextInput name={`schools.${i}.speciality`} upper placeholder="MECHANICAL" />
              </Field>
              <Field name={`schools.${i}.graduationYear`} label="Year of graduation" required>
                <YearSelect name={`schools.${i}.graduationYear`} />
              </Field>
              <Field name={`schools.${i}.diploma`} label="Type of diploma held" required>
                <TextInput name={`schools.${i}.diploma`} upper placeholder="I.T.C (MECHANICAL)" />
              </Field>
            </div>
          </div>
        ))}
      </div>
      {fields.length < MAX_SCHOOLS && (
        <button type="button" onClick={() => append({ ...emptySchool })} className="btn btn-ghost-dark mt-5">
          + Add another school
        </button>
      )}
    </SectionCard>
  );
}
