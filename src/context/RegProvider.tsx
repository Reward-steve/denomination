import React, { useState } from "react";
import { type RegistrationData } from "../types/auth.types";
import { RegistrationContext } from "./RegistrationContext";

export const RegistrationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [step, setStep] = useState(1);
  const [prev, setPrev] = useState(true);
  const [data, setData] = useState<RegistrationData>({
    email: "",
    code: "",
    password: "",
    cpassword: "",
    name: "",
    logo: "",
    school_logo: "",
    phone: "",
    abbr: "",
    address: "",
    last_name: "",
    gender: "",
    passport: "",
    first_name: "",
    username: "",
    reg_status: "",
  });

  const updateData = (updates: Partial<RegistrationData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <RegistrationContext.Provider
      value={{ step, setStep, data, updateData, prev, setPrev }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};
