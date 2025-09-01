import { useContext } from "react";
import { ResponsiveContext } from "../context/ResponsiveContext";

export function useResponsive() {
  return useContext(ResponsiveContext);
}
