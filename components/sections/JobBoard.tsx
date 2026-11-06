"use client";

import { useMemo, useState } from "react";
import type { Job } from "@/lib/jobs";
import { JobCard, OpenApplicationCard } from "./JobCard";

const DEPARTMENTS = ["All", "Deck", "Engine", "Catering", "Shore-based"] as const;

export function JobBoard({ jobs }: { jobs: Job[] }) {
  const [dept, setDept] = useState<(typeof DEPARTMENTS)[number]>("All");
  const [vessel, setVessel] = useState("");
  const [q, setQ] = useState("");

  const vesselTypes = useMemo(() => Array.from(new Set(jobs.map((j) => j.vesselType).filter(Boolean))), [jobs]);
  const filtered = jobs.filter(
    (j) =>
      (dept === "All" || j.department === dept) &&
      (!vessel || j.vesselType === vessel) &&
      (!q || `${j.title} ${j.rankCode}`.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div>
      <div data-reveal className="mb-6 flex flex-col gap-3 rounded-2xl border border-line bg-white p-2 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-1" role="group" aria-label="Department">
          {DEPARTMENTS.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={dept === d}
              onClick={() => setDept(d)}
              className={`min-h-11 rounded-full px-4 py-2 text-sm font-semibold transition sm:min-h-0 ${dept === d ? "bg-ink text-white" : "text-muted hover:bg-paper hover:text-ink"}`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex flex-1 gap-2 lg:justify-end">
          <select aria-label="Vessel type" value={vessel} onChange={(e) => setVessel(e.target.value)} className="field-input field-select lg:w-56">
            <option value="">All vessel types</option>
            {vesselTypes.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <input
            type="search"
            aria-label="Search rank"
            placeholder="Search rank…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="field-input lg:w-56"
          />
        </div>
      </div>

      <p className="mb-5 text-sm text-muted">
        {filtered.length} open position{filtered.length === 1 ? "" : "s"}
      </p>

      <div className={`grid gap-4 md:grid-cols-2 lg:gap-6 ${filtered.length >= 2 ? "lg:grid-cols-3" : ""}`}>
        {filtered.map((j) => (
          <JobCard key={j.slug} job={j} />
        ))}
        <OpenApplicationCard />
      </div>
    </div>
  );
}
