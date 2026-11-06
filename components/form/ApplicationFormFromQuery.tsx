"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ApplicationForm } from "./ApplicationForm";
import { POSITION_VALUES } from "@/lib/form-options";

function Inner() {
  const position = useSearchParams().get("position") ?? "";
  const valid = POSITION_VALUES.includes(position) ? position : "";
  return <ApplicationForm key={valid} position={valid} />;
}

/** Reads ?position= in the browser so the page can be statically exported. */
export function ApplicationFormFromQuery() {
  return (
    <Suspense fallback={<ApplicationForm position="" />}>
      <Inner />
    </Suspense>
  );
}
