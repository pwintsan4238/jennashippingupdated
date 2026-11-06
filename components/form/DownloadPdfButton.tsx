"use client";

import { useState } from "react";

const PAGE_W = 210; // A4, mm
const PAGE_H = 297;
const MARGIN = 10;

/** Renders the review sheet (#print-sheet) to a multi-page A4 PDF, breaking pages between table rows. */
export function DownloadPdfButton({ fileName }: { fileName: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function download() {
    const node = document.querySelector<HTMLElement>("#print-sheet > div");
    if (!node) return;
    setBusy(true);
    setError(false);
    try {
      const [{ toCanvas }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")]);
      const width = node.scrollWidth;
      const height = node.scrollHeight;
      const canvas = await toCanvas(node, { pixelRatio: 2, backgroundColor: "#ffffff", width, height });

      const pxPerMm = width / (PAGE_W - MARGIN * 2);
      const pageHeightPx = (PAGE_H - MARGIN * 2) * pxPerMm;
      const top = node.getBoundingClientRect().top;
      const breaks = [...node.querySelectorAll("tr, p, h3")].map((el) => el.getBoundingClientRect().bottom - top).sort((a, b) => a - b);

      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const scale = canvas.height / height;
      let start = 0;
      let first = true;
      while (start < height - 1) {
        let end = Math.min(start + pageHeightPx, height);
        if (end < height) {
          const fit = breaks.filter((b) => b > start + 40 && b <= end);
          if (fit.length) end = fit[fit.length - 1];
        }
        const slice = document.createElement("canvas");
        slice.width = canvas.width;
        slice.height = Math.ceil((end - start) * scale);
        slice.getContext("2d")!.drawImage(canvas, 0, start * scale, canvas.width, slice.height, 0, 0, canvas.width, slice.height);
        if (!first) pdf.addPage();
        pdf.addImage(slice.toDataURL("image/jpeg", 0.92), "JPEG", MARGIN, MARGIN, PAGE_W - MARGIN * 2, (end - start) / pxPerMm);
        first = false;
        start = end;
      }
      pdf.save(fileName);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <button type="button" onClick={download} disabled={busy} className="btn btn-ghost-dark">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16" />
        </svg>
        {busy ? "Preparing PDF…" : "Download PDF"}
      </button>
      {error && <p className="text-xs text-red-600">Couldn&apos;t create the PDF — please try again.</p>}
    </div>
  );
}
