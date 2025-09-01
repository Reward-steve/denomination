import { createContext } from "react";
import { type RegistrationData } from "../types/auth.types";

export interface RegistrationContextType {
  step: number;
  setStep: (step: number) => void;
  data: RegistrationData;
  updateData: (updates: Partial<RegistrationData>) => void;
  prev: boolean;
  setPrev: (prev: boolean) => void;
}

export const RegistrationContext = createContext<
  RegistrationContextType | undefined
>(undefined);
