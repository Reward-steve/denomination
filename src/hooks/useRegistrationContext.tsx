import { RegistrationContext } from "../context/RegistrationContext";
import { useContext } from "react";
export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context)
    throw new Error("useRegistration must be used within RegistrationProvider");
  return context;
};
