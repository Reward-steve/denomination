import React, { useState } from "react";
import type { PersonalInfoFormData } from "../types/auth.types";
import { RegContext } from "./RegContext";

// A self-contained, functional component
export const RegistrationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [step, setStep] = useState(1);
  const [prev, setPrev] = useState(true);

  // Initialize data with an empty object to prevent the 'updates' error
  const [data, setData] = useState<PersonalInfoFormData>(
    {} as PersonalInfoFormData
  );

  const updateData = (updates: Partial<PersonalInfoFormData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const value = { step, setStep, data, updateData, prev, setPrev };

  return <RegContext.Provider value={value}>{children}</RegContext.Provider>;
};
