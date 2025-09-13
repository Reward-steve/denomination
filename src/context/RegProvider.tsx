import React, { useState, useCallback, useMemo } from "react";
import type { PersonalInfoFormData } from "../types/auth.types";
import { RegContext } from "./RegContext";
import { saveInStore, getFromStore } from "../utils/appHelpers";

/**
 * Deep merge helper for nested form objects.
 * Ensures updates don’t overwrite unrelated keys.
 */
const deepMerge = <T extends object>(target: T, source: Partial<T>): T => {
  const out: any = { ...(target as any) };

  for (const key of Object.keys(source) as (keyof typeof source)[]) {
    const sVal = source[key];
    const tVal = (out as any)[key];

    if (sVal === undefined) continue;

    if (
      sVal &&
      typeof sVal === "object" &&
      !Array.isArray(sVal) &&
      !(sVal instanceof File)
    ) {
      out[key] = deepMerge((tVal as object) || {}, sVal as Partial<object>);
    } else {
      out[key] = sVal;
    }
  }

  return out as T;
};

/**
 * Remove File objects (non-serializable) before saving to storage.
 */
const omitFilesForStorage = (value: any): any => {
  if (value === null || value === undefined) return value;
  if (value instanceof File) return undefined;

  if (Array.isArray(value)) {
    return value
      .map((v) => omitFilesForStorage(v))
      .filter((v) => v !== undefined);
  }

  if (typeof value === "object") {
    const out: any = {};
    for (const k of Object.keys(value)) {
      const v = omitFilesForStorage(value[k]);
      if (v !== undefined) out[k] = v;
    }
    return out;
  }

  return value;
};

/** Default state shape to satisfy TypeScript */
const DEFAULT_DATA = {
  bio: {},
  prev_positions: [],
  ucca_position: [],
  photo: undefined,
  education: [],
  nok: {},
} as unknown as PersonalInfoFormData;

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [step, setStep] = useState<number>(
    () => getFromStore<number>("ucca_reg_step", "session") || 1
  );

  const [prev, setPrev] = useState<boolean>(
    () => getFromStore<boolean>("ucca_reg_prev", "session") ?? true
  );

  // Load saved data, or start fresh
  const initialData =
    getFromStore<PersonalInfoFormData>("ucca_reg_data", "session") ||
    DEFAULT_DATA;

  // Files stay in memory only (not persisted)
  const [data, setData] = useState<PersonalInfoFormData>(() => initialData);

  const updateData = useCallback((updates: Partial<PersonalInfoFormData>) => {
    setData((prevState) => {
      const merged = deepMerge(prevState, updates);

      // Only persist serializable values
      saveInStore("ucca_reg_data", omitFilesForStorage(merged), "session");

      return merged; // keep Files in memory
    });
  }, []);

  const setStepPersist = useCallback((val: number) => {
    setStep(val);
    saveInStore("ucca_reg_step", val, "session");
  }, []);

  const setPrevPersist = useCallback((val: boolean) => {
    setPrev(val);
    saveInStore("ucca_reg_prev", val, "session");
  }, []);

  // Memoize context value to avoid unnecessary re-renders
  const value = useMemo(
    () => ({
      step,
      setStep: setStepPersist,
      data,
      updateData,
      prev,
      setPrev: setPrevPersist,
    }),
    [step, data, prev, setStepPersist, setPrevPersist, updateData]
  );

  return <RegContext.Provider value={value}>{children}</RegContext.Provider>;
};
