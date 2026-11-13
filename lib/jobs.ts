import "server-only";

export type Department = "Deck" | "Engine" | "Catering" | "Shore-based";

export type Job = {
  slug: string;
  title: string;
  rankCode: string;
  department: Department;
  vesselType: string;
  location: string;
  experience: string;
  contractDuration: string;
  signOnWindow: string;
  requirements: string[];
  duties: string[];
};

/** The openings shown on /careers. Edit this list to add or remove a job (a new slug gets its own page). */
const JOBS: Job[] = [
  {
    slug: "chief-engineer",
    title: "Chief Engineer",
    rankCode: "CE",
    department: "Engine",
    vesselType: "General Cargo / Container",
    location: "Myanmar",
    experience: "Mid",
    contractDuration: "6–9 months",
    signOnWindow: "As soon as possible",
    requirements: [
      "Valid STCW III/2 Chief Engineer COC (Unlimited)",
      "Minimum 12 months sea service as Chief Engineer or 1/E",
      "Valid Passport, SID and Seaman Book (CDC)",
      "Basic Safety, AFF, PMFA and Security certificates",
    ],
    duties: [
      "Take overall charge of the engine department and its safe, efficient operation",
      "Lead, train and supervise engineers, oilers, fitters and wipers on board",
      "Plan and carry out the Planned Maintenance System (PMS) for main engine, auxiliaries and deck machinery",
      "Ensure compliance with SOLAS, MARPOL, ISM and flag-state requirements in the engine room",
      "Manage fuel, lube oil and spare-part inventories, bunkering and consumption reports",
      "Coordinate repairs, dry-docking and class surveys with the Master and technical superintendent",
      "Maintain engine log books, oil record book and all statutory engine-department records",
      "Lead engine-room emergency drills and keep fire-fighting and safety equipment ready",
      "Monitor performance and propose improvements to efficiency and emissions",
      "Evaluate engine crew performance and report to the company",
    ],
  },
];

export async function getJobs(): Promise<Job[]> {
  return JOBS;
}

export async function getJob(slug: string): Promise<Job | null> {
  const jobs = await getJobs();
  return jobs.find((j) => j.slug === slug) ?? null;
}
