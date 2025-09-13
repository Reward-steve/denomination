import type { DropdownOption } from "../../../types/auth.types";

export const PROMOTION_EVIDENCE: DropdownOption[] = [
  { id: "1", name: "Father's Pronouncement" },
  { id: "2", name: "Father's Letter" },
];

export type PromotionEvidence = "Father's Pronouncement" | "Father's Letter";

export const relationships = [
  { id: "1", name: "Father" },
  { id: "2", name: "Mother" },
  { id: "3", name: "Son" },
  { id: "4", name: "Daughter" },
  { id: "5", name: "Brother" },
  { id: "6", name: "Sister" },
  { id: "7", name: "Grandfather" },
  { id: "8", name: "Grandmother" },
  { id: "9", name: "Grandson" },
  { id: "10", name: "Granddaughter" },
  { id: "11", name: "Uncle" },
  { id: "12", name: "Aunt" },
  { id: "13", name: "Nephew" },
  { id: "14", name: "Niece" },
  { id: "15", name: "Cousin" },
  { id: "16", name: "Spouse" }, // Husband / Wife
  { id: "17", name: "Fiancé/Fiancée" },
  { id: "18", name: "Stepfather" },
  { id: "19", name: "Stepmother" },
  { id: "20", name: "Stepson" },
  { id: "21", name: "Stepdaughter" },
  { id: "22", name: "Father-in-law" },
  { id: "23", name: "Mother-in-law" },
  { id: "24", name: "Son-in-law" },
  { id: "25", name: "Daughter-in-law" },
  { id: "26", name: "Brother-in-law" },
  { id: "27", name: "Sister-in-law" },
  { id: "28", name: "Guardian" },
  { id: "29", name: "Ward" },
  { id: "30", name: "Friend" },
  { id: "31", name: "Colleague" },
  { id: "32", name: "Mentor" },
  { id: "33", name: "Other" },
];
