"use client";

import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from "react";
import { Controller, get, useFormContext, type FieldPath } from "react-hook-form";
import clsx from "clsx";
import type { ApplicationInput } from "@/lib/application-schema";
import { DateField } from "./DateField";

type Name = FieldPath<ApplicationInput>;

export function useFieldError(name: Name): string | undefined {
  const {
    formState: { errors },
  } = useFormContext<ApplicationInput>();
  return (get(errors, name) as { message?: string } | undefined)?.message;
}

type FieldProps = {
  name: Name;
  label: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  className?: string;
  labelClassName?: string;
  /** a single form control; gets id + aria wiring */
  children: ReactElement<Record<string, unknown>>;
};

/** Label + control + error message. */
export function Field({ name, label, required, hint, className, labelClassName, children }: FieldProps) {
  const id = useId();
  const error = useFieldError(name);
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  const control = isValidElement(children)
    ? cloneElement(children, { id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })
    : children;

  return (
    <div className={className}>
      <label htmlFor={id} className={clsx("field-label", labelClassName)}>
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      {control}
      {error ? (
        <p id={`${id}-err`} className="field-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({
  name,
  upper,
  className,
  ...rest
}: { name: Name; upper?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  const { register } = useFormContext<ApplicationInput>();
  const reg = register(name, upper ? { setValueAs: (v: string) => (typeof v === "string" ? v.toUpperCase() : v) } : undefined);
  return (
    <input
      {...rest}
      {...reg}
      className={clsx("field-input", upper && "uppercase", className)}
    />
  );
}

export function TextArea({ name, ...rest }: { name: Name } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { register } = useFormContext<ApplicationInput>();
  return <textarea {...rest} {...register(name)} className="field-input min-h-[88px] resize-y" />;
}

export function Select({
  name,
  options,
  placeholder = "Select…",
  ...rest
}: {
  name: Name;
  options: readonly (string | { value: string; label: string })[];
  placeholder?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { register } = useFormContext<ApplicationInput>();
  return (
    <select {...rest} {...register(name)} className="field-input field-select">
      <option value="">{placeholder}</option>
      {options.map((o) => {
        const opt = typeof o === "string" ? { value: o, label: o } : o;
        return (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        );
      })}
    </select>
  );
}

/** Text input with suggestion list (free text allowed). */
export function ComboInput({
  name,
  options,
  upper,
  ...rest
}: { name: Name; options: readonly string[]; upper?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  const listId = useId();
  return (
    <>
      <TextInput name={name} list={listId} upper={upper} autoComplete="off" {...rest} />
      <datalist id={listId}>
        {options.map((o) => (
          <option key={o} value={o} />
        ))}
      </datalist>
    </>
  );
}

export function DateInput({
  name,
  min,
  max,
  disabled,
  id,
}: {
  name: Name;
  min?: string;
  max?: string;
  disabled?: boolean;
  id?: string;
}) {
  const { control } = useFormContext<ApplicationInput>();
  const error = useFieldError(name);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <DateField
          id={id}
          value={(field.value as string) ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          min={min}
          max={max}
          disabled={disabled}
          invalid={Boolean(error)}
        />
      )}
    />
  );
}

export function YearSelect({ name, from = 1960, to = new Date().getFullYear(), ...rest }: { name: Name; from?: number; to?: number } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const years = Array.from({ length: to - from + 1 }, (_, i) => String(to - i));
  return <Select name={name} options={years} placeholder="Year" {...rest} />;
}
