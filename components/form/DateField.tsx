"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { formatDMY, fromISO, toISO } from "@/lib/dates";

type Props = {
  value: string;
  onChange: (iso: string) => void;
  onBlur?: () => void;
  /** earliest/latest selectable dates (ISO) */
  min?: string;
  max?: string;
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  placeholder?: string;
};

export function DateField({ value, onChange, onBlur, min, max, invalid, disabled, id, placeholder = "dd.mm.yyyy" }: Props) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const popId = useId();
  const selected = fromISO(value);
  const minDate = fromISO(min);
  const maxDate = fromISO(max);
  const now = new Date();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    onBlur?.();
  };

  const disabledDays = [
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ];

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={popId}
        onClick={() => setOpen((o) => !o)}
        className={`field-input flex items-center justify-between gap-2 text-left ${invalid ? "!border-red-500" : ""}`}
      >
        <span className={value ? "tabular-nums" : "text-muted/60"}>{value ? formatDMY(value) : placeholder}</span>
        <svg aria-hidden viewBox="0 0 24 24" className="size-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      </button>

      {open && (
        <>
          {/* mobile: bottom sheet backdrop */}
          <div className="fixed inset-0 z-40 bg-ink/40 sm:hidden" onClick={close} aria-hidden />
          <div
            id={popId}
            role="dialog"
            aria-label="Choose date"
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white p-4 shadow-2xl sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-0 sm:top-full sm:mt-2 sm:rounded-2xl sm:border sm:border-line"
          >
            <DayPicker
              mode="single"
              captionLayout="dropdown"
              selected={selected}
              defaultMonth={selected ?? maxDate ?? now}
              startMonth={minDate ?? new Date(1940, 0)}
              endMonth={maxDate ?? new Date(now.getFullYear() + 15, 11)}
              disabled={disabledDays}
              onSelect={(d) => {
                onChange(d ? toISO(d) : "");
                close();
              }}
              autoFocus
            />
            <div className="mt-2 flex justify-between border-t border-line pt-3 text-sm">
              <button
                type="button"
                className="font-semibold text-muted hover:text-ink"
                onClick={() => {
                  onChange("");
                  close();
                }}
              >
                Clear
              </button>
              <button type="button" className="font-semibold text-brand" onClick={close}>
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
