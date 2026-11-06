export const INQUIRY_TYPES = {
  seafarer: "Seafarer job application / inquiry",
  training: "Maritime training courses",
  shipowner: "Shipowner / crewing inquiry",
  other: "Other",
} as const;

export type InquiryType = keyof typeof INQUIRY_TYPES;
