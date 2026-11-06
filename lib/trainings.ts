import { asset } from "@/lib/asset";

export const TRAININGS = [
  {
    code: "LSA/FFE",
    title: "LSA / FFE Training",
    body: "Hands-on practice with life-saving appliances and fire-fighting equipment — lifeboats, liferafts, immersion suits, SCBA and extinguishers — for real emergencies at sea.",
    image: asset("/images/crew-lifeboat.jpg"),
  },
  {
    code: "CRANE",
    title: "Crane Training",
    body: "Safe, efficient cargo handling: signalling, load charts, pre-use checks and slinging, equipping operators with essential skills for maritime operations.",
    image: asset("/images/crane-briefing.jpg"),
  },
  {
    code: "WELD",
    title: "Welding Training",
    body: "Prepares fitters and engine ratings for safe, precise shipboard welding and cutting — including hot-work permits and fire watch.",
    image: asset("/images/welding-training.jpg"),
  },
  {
    code: "中文",
    title: "On-job Chinese Language Class",
    body: "Practical maritime Chinese for working with Chinese owners, officers and crews — commands, safety terms and day-to-day communication on board.",
    image: asset("/images/chinese-class.jpg"),
  },
  {
    code: "STCW",
    title: "Core STCW & Safety Certifications",
    body: "Guidance and arrangements for Basic Safety, Survival Craft, Medical First Aid, Advanced Fire-fighting, Security Awareness and other mandatory STCW courses.",
    image: asset("/images/safety-maintenance.jpg"),
  },
];
