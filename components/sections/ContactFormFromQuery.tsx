"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ContactForm } from "./ContactForm";
import { INQUIRY_TYPES, type InquiryType } from "@/lib/contact";

function Inner() {
  const type = useSearchParams().get("type");
  const defaultType = (type && type in INQUIRY_TYPES ? type : "seafarer") as InquiryType;
  return <ContactForm key={defaultType} defaultType={defaultType} />;
}

/** Reads ?type= in the browser so the page can be statically exported. */
export function ContactFormFromQuery() {
  return (
    <Suspense fallback={<ContactForm />}>
      <Inner />
    </Suspense>
  );
}
