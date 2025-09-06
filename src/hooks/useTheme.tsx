import type { Theme } from "@emotion/react";
import { createContext, useContext } from "react";
// 1. Define the shape of the context's value
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// 2. Create the context with an initial value or `null` and assert its type
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

// 3. Create a custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
