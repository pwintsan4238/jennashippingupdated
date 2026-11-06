export const POSITIONS = [
  { value: "MASTER", label: "Master" },
  { value: "C/O", label: "C/O — Chief Officer" },
  { value: "2/O", label: "2/O — Second Officer" },
  { value: "3/O", label: "3/O — Third Officer" },
  { value: "4/O", label: "4/O — Fourth Officer" },
  { value: "CE", label: "CE — Chief Engineer" },
  { value: "1/E", label: "1/E — First Engineer" },
  { value: "2/E", label: "2/E — Second Engineer" },
  { value: "3/E", label: "3/E — Third Engineer" },
  { value: "4/E", label: "4/E — Fourth Engineer" },
  { value: "EE", label: "EE — Electrical Engineer" },
  { value: "BOSUN", label: "Bosun" },
  { value: "FITTER", label: "Fitter" },
  { value: "PUMPMAN", label: "Pumpman" },
  { value: "AB", label: "AB — Able Seaman" },
  { value: "OILER", label: "Oiler" },
  { value: "OS", label: "OS — Ordinary Seaman" },
  { value: "WIPER", label: "Wiper" },
  { value: "MESSMAN", label: "Messman" },
  { value: "DC", label: "DC — Deck Cadet" },
  { value: "EC", label: "EC — Engine Cadet" },
  { value: "COOK", label: "Cook" },
  { value: "DR", label: "DR — Deck Rating" },
  { value: "ER", label: "ER — Engine Rating" },
] as const;

export const POSITION_VALUES = POSITIONS.map((p) => p.value) as [string, ...string[]];

export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "A", "B", "AB", "O"] as const;

export const BOILER_SUITS = ["S", "M", "L", "XL", "XXL", "3XL"] as const;

export const SHOE_SIZES = ["38", "39", "40", "41", "42", "43", "44", "45", "46", "47"] as const;

export const RELATIONSHIPS = ["Wife", "Husband", "Father", "Mother", "Son", "Daughter", "Brother", "Sister", "Other"];

export const NRC_STATES = Array.from({ length: 14 }, (_, i) => String(i + 1));
export const NRC_TYPES = [
  { value: "N", label: "(N) Naing" },
  { value: "E", label: "(E) Ei" },
  { value: "P", label: "(P) Pyu" },
  { value: "T", label: "(T) Thathana" },
  { value: "Y", label: "(Y) Yahan" },
  { value: "S", label: "(S) Sa" },
] as const;

export const AUTHORITIES = ["DMA", "YGN", "MOTC", "NPT", "MDY", "Panama MA", "Liberia MA", "Other"];

export const COC_CAPACITIES = [
  "Master (Unlimited)",
  "Chief Mate (Unlimited)",
  "OOW Deck (Unlimited)",
  "Chief Engineer (Unlimited)",
  "Second Engineer (Unlimited)",
  "OOW Engine (Unlimited)",
  "Electro-Technical Officer",
  "Master (Near Coastal)",
  "Chief Engineer (Near Coastal)",
];

export const VESSEL_TYPES = [
  "GENERAL CARGO",
  "BULK CARRIER",
  "CONTAINER",
  "OIL TANKER",
  "CHEMICAL TANKER",
  "OIL/CHEMICAL TANKER",
  "LPG CARRIER",
  "LNG CARRIER",
  "RO-RO",
  "REEFER",
  "MULTI-PURPOSE",
  "OFFSHORE / SUPPLY",
  "TUG",
  "PASSENGER",
];

export const FLAGS = [
  "PANAMA", "LIBERIA", "MARSHALL ISLANDS", "HONG KONG", "SINGAPORE", "MALTA", "BAHAMAS",
  "CYPRUS", "GREECE", "CHINA", "MONGOLIA", "CAMEROON", "TOGO", "SIERRA LEONE", "BELIZE",
  "COMOROS", "PALAU", "TUVALU", "TANZANIA", "ST KITTS & NEVIS", "ANTIGUA & BARBUDA",
  "COOK ISLANDS", "VANUATU", "MYANMAR", "JAPAN", "KOREA", "INDIA", "INDONESIA", "MALAYSIA",
  "THAILAND", "VIETNAM", "PHILIPPINES", "NORWAY", "DENMARK", "UNITED KINGDOM", "ISLE OF MAN", "PORTUGAL",
];

export const TRADING_AREAS = [
  { value: "FG", label: "FG — Foreign Going" },
  { value: "NC", label: "NC — Near Coastal" },
  { value: "COASTAL", label: "Coastal" },
  { value: "INLAND", label: "Inland" },
] as const;

export const POWER_UNITS = ["BHP", "KW"] as const;

/** Main documents: always shown, filled with number + dates + authority. */
export const MAIN_CERTS = [
  { code: "coc", label: "C.O.C (Certificate of Competency)", hasCapacity: true },
  { code: "gmdss", label: "GMDSS" },
  { code: "other", label: "Other certificate", customLabel: true },
  { code: "passport", label: "Passport", required: true },
  { code: "sid", label: "Seaman Identity Document (SID)" },
  { code: "cdc", label: "Seaman Book (CDC)" },
] as const;

export type MainCertCode = (typeof MAIN_CERTS)[number]["code"];

/** STCW / training certificates: ticked if held, then details are filled. */
export const STCW_CERTS = [
  { code: "bst", label: "Familiarization and Basic Safety Training" },
  { code: "pscrb", label: "Proficiency in Survival Craft and Rescue Boats" },
  { code: "edh", label: "Efficient Deck Hand (EDH)" },
  { code: "pmfa", label: "Proficiency in Medical First Aid" },
  { code: "mfa", label: "Medical First Aid (MFA)" },
  { code: "aff", label: "Advanced Fire-fighting Training" },
  { code: "radar", label: "Radar Observation and Plotting and Radar Simulator" },
  { code: "ecdis", label: "Operational Use of ECDIS" },
  { code: "arpa", label: "ARPA Simulator" },
  { code: "tf_oil_chem", label: "Oil & Chemical Tanker Familiarization (TF Oil & Chemical)" },
  { code: "sat", label: "Security Awareness Training" },
  { code: "sdsd", label: "Seafarers with Designated Security Duties" },
  { code: "sso", label: "SSO Cert" },
  { code: "brm", label: "Bridge Resource Management (BRM)" },
  { code: "erm", label: "Engine Resource Management (ERM)" },
  { code: "hv", label: "High Voltage" },
  { code: "welding", label: "Certificate of Welding" },
  { code: "aot", label: "Oil Tanker Operation (AOT)" },
  { code: "act", label: "Chemical Tanker Operation (ACT)" },
  { code: "cholera", label: "Cholera" },
  { code: "hk_license", label: "HK License" },
  { code: "pssr", label: "PSSR (Personal Safety & Social Responsibilities)" },
] as const;

export type StcwCode = (typeof STCW_CERTS)[number]["code"];

export const MAX_SEA_SERVICE = 5;
export const MAX_SCHOOLS = 3;
