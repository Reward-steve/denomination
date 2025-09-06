import { RegContext } from "../context/RegContext";
import { useContext } from "react";
export const useRegistration = () => {
  const context = useContext(RegContext);
  if (!context)
    throw new Error("useRegistration must be used within RegistrationProvider");
  return context;
};
