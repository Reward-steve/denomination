import { createContext } from "react";
import type { PersonalInfoFormData } from "../types/auth.types";

interface RegContextType {
  step: number;
  setStep: (step: number) => void;
  data: PersonalInfoFormData;
  updateData: (updates: Partial<PersonalInfoFormData>) => void;
  prev: boolean;
  setPrev: (prev: boolean) => void;
}

// Mock context with a default value
export const RegContext = createContext<RegContextType | undefined>(undefined);
