import React, { useState } from "react";
import type { PersonalInfoFormData } from "../types/auth.types";
import { RegContext } from "./RegContext";
import { saveInStore, getFromStore } from "../utils/appHelpers";

// Helper: Deep merge objects safely
const deepMerge = <T extends object>(target: T, source: Partial<T>): T => {
  const output = { ...target };
  for (const key in source) {
    if (
      Object.prototype.hasOwnProperty.call(source, key) &&
      source[key] !== undefined
    ) {
      if (
        typeof source[key] === "object" &&
        !Array.isArray(source[key]) &&
        source[key] !== null
      ) {
        (output as any)[key] = deepMerge(
          (target as any)[key] || {},
          source[key] as any
        );
      } else {
        (output as any)[key] = source[key];
      }
    }
  }
  return output;
};

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [step, setStep] = useState<number>(() => {
    return getFromStore<number>("ucca_reg_step", "session") || 1;
  });

  const [prev, setPrev] = useState<boolean>(() => {
    return getFromStore<boolean>("ucca_reg_prev", "session") ?? true;
  });

  const [data, setData] = useState<PersonalInfoFormData>(() => {
    return (
      getFromStore<PersonalInfoFormData>("ucca_reg_data", "session") ||
      ({} as PersonalInfoFormData)
    );
  });

  const updateData = (updates: Partial<PersonalInfoFormData>) => {
    setData((prev) => {
      const merged = deepMerge(prev, updates); // ✅ preserve nested data
      saveInStore("ucca_reg_data", merged, "session");
      return merged;
    });
  };

  // keep step & prev persistent too
  const setStepPersist = (val: number) => {
    setStep(val);
    saveInStore("ucca_reg_step", val, "session");
  };

  const setPrevPersist = (val: boolean) => {
    setPrev(val);
    saveInStore("ucca_reg_prev", val, "session");
  };

  const value = {
    step,
    setStep: setStepPersist,
    data,
    updateData,
    prev,
    setPrev: setPrevPersist,
  };

  return <RegContext.Provider value={value}>{children}</RegContext.Provider>;
};
