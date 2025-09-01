import { createContext } from "react";

export type ResponsiveType = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

export const ResponsiveContext = createContext<ResponsiveType>({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
});
